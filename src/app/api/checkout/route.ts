import { NextResponse } from "next/server";
import { CATALOG, FREE_SHIPPING_OVER, SHIPPING_FLAT } from "@/lib/catalog";
import { stripe, stripeConfigured, siteOrigin } from "@/lib/stripe";
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
  if (!stripeConfigured()) {
    console.error("[checkout] STRIPE_SECRET_KEY is not set in this environment");
    return NextResponse.json(
      { error: "Payments are not configured yet. Check back shortly." },
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

  const priced = [];
  for (const l of lines) {
    const p = CATALOG[l?.id];
    const qty = Math.floor(Number(l?.qty));
    if (!p || !Number.isFinite(qty) || qty < 1 || qty > 99)
      return NextResponse.json(
        { error: "Your bag is out of date. Reload the page and try again." },
        { status: 400 },
      );

    const left = remaining(p.id);
    if (left < qty)
      return NextResponse.json(
        {
          error:
            left === 0
              ? `${p.name} sold out of Drop 01 while you were deciding.`
              : `Only ${left} of ${p.name} left in Drop 01.`,
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
      ui_mode: "hosted",
      line_items: priced.map((l) => ({
        quantity: l.qty,
        price_data: {
          currency: "usd",
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
            fixed_amount: { amount: shipping, currency: "usd" },
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
        // the webhook reads this back to decrement the Drop 01 allocation
        bag: JSON.stringify(priced.map((l) => ({ id: l.product.id, qty: l.qty }))),
        drop: "01",
      },
    });

    if (!session.url)
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 502 },
      );

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not reach the payment provider.";
    console.error("[checkout] stripe session failed:", message);
    return NextResponse.json(
      { error: "Could not start checkout. Try again in a moment." },
      { status: 502 },
    );
  }
}
