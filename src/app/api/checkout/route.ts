import { NextResponse } from "next/server";
import { CATALOG, CURRENCY, FREE_SHIPPING_OVER, SHIPPING_FLAT } from "@/lib/catalog";
import { stripe, inspectKey, keyDiagnosis, siteOrigin } from "@/lib/stripe";
import { remaining } from "@/lib/stock";

/**
 * Creates a Stripe Checkout Session and hands back its URL.
 *
 * The client sends only `{id, qty}` pairs. Every price, the shipping rule and
 * the allocation check are recomputed here from the catalogue — a total that
 * arrives from the browser is never trusted, and Stripe is charged from these
 * numbers, not from anything the client said.
 */

type Line = { id: string; qty: number };

export async function POST(request: Request) {
  const key = inspectKey();
  if (!key.ok) {
    // one clear line in the log instead of an opaque 502 from Stripe later
    console.error("[checkout]", keyDiagnosis(key));
    return NextResponse.json(
      {
        error: "Payments are not configured yet. Check back shortly.",
        // setup aid: the reason and the first three characters only, never the key
        setup: { reason: key.reason, saw: key.saw },
      },
      { status: 503 },
    );
  }

  let body: { lines?: unknown };
  try {
    body = (await request.json()) as { lines?: unknown };
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const lines = Array.isArray(body.lines) ? (body.lines as Line[]) : [];
  if (!lines.length)
    return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });

  // collapse duplicate ids first — checking each line on its own lets the same
  // product appear twice and clear the allocation test twice over
  const wanted = new Map<string, number>();
  for (const l of lines) {
    const qty = Math.floor(Number(l?.qty));
    if (!CATALOG[l?.id] || !Number.isFinite(qty) || qty < 1 || qty > 99)
      return NextResponse.json(
        { error: "Your bag is out of date. Reload the page and try again." },
        { status: 400 },
      );
    wanted.set(l.id, (wanted.get(l.id) ?? 0) + qty);
  }

  const priced = [];
  for (const [id, qty] of wanted) {
    const p = CATALOG[id];
    if (qty > 99)
      return NextResponse.json(
        { error: `You cannot order more than 99 of ${p.name}.` },
        { status: 400 },
      );

    const stock = await remaining(id);
    if (!stock.ok)
      // the store is unreachable — refuse rather than sell what we cannot verify
      return NextResponse.json({ error: stock.reason }, { status: 503 });

    if (stock.remaining < qty)
      return NextResponse.json(
        {
          error:
            stock.remaining === 0
              ? `${p.name} sold out while you were deciding.`
              : `Only ${stock.remaining} of ${p.name} left in stock.`,
        },
        { status: 409 },
      );

    priced.push({ product: p, qty });
  }

  const subtotal = priced.reduce((n, l) => n + l.product.price * l.qty, 0);
  const shipping = subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FLAT;
  const origin = siteOrigin(request);

  try {
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      line_items: priced.map((l) => ({
        quantity: l.qty,
        price_data: {
          currency: CURRENCY,
          unit_amount: l.product.price,
          product_data: {
            name: l.product.name,
            description: l.product.tagline,
            images: l.product.image ? [`${origin}${l.product.image}`] : undefined,
            metadata: { sku: l.product.id },
          },
        },
      })),
      shipping_address_collection: {
        allowed_countries: [
          "US", "CA", "GB", "IE", "SE", "NO", "DK", "FI", "IS",
          "DE", "NL", "BE", "FR", "ES", "IT", "PL", "AT", "CH",
          "AU", "NZ",
        ],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: shipping === 0 ? "Free shipping" : "Standard shipping",
            fixed_amount: { amount: shipping, currency: CURRENCY },
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 8 },
            },
          },
        },
      ],
      phone_number_collection: { enabled: false },
      allow_promotion_codes: true,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?cancelled=1`,
      metadata: {
        // an audit trail in the Stripe dashboard — the webhook itself reads
        // stock back from the expanded line items, not from here
        bag: JSON.stringify(priced.map((l) => ({ id: l.product.id, qty: l.qty }))),
      },
    });

    if (!session.url)
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 502 },
      );

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const e = err as { type?: string; code?: string; message?: string; param?: string };
    console.error("[checkout] stripe rejected the session:", e.type, e.code, e.message);
    return NextResponse.json(
      {
        error: "Could not start checkout. Try again in a moment.",
        // Stripe's classification, not its message — safe to surface, and it
        // turns "502" into something actionable during setup
        setup: { type: e.type ?? null, code: e.code ?? null, param: e.param ?? null },
      },
      { status: 502 },
    );
  }
}
