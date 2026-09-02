import { NextResponse, type NextRequest } from "next/server";
import {
  CATALOG,
  CURRENCY,
  SHIPPING_FLAT,
  freeShippingToday,
  currentPrice,
  bundleSaving,
  qualifiesForFreeShipping,
} from "@/lib/catalog";
import { stripe, inspectKey, keyDiagnosis, siteOrigin } from "@/lib/stripe";
import { remaining } from "@/lib/stock";
import { COOKIE } from "@/lib/attribution";
import { TRANSIT_DAYS } from "@/lib/fulfilment";
import { recordAbandoned } from "@/lib/abandoned";
import { liveCatalog } from "@/lib/live-catalog";
import { createCart } from "@/lib/shopify";

/**
 * Creates a Stripe Checkout Session and hands back its URL.
 *
 * The client sends only `{id, qty}` pairs. Every price, the shipping rule and
 * the allocation check are recomputed here from the catalogue — a total that
 * arrives from the browser is never trusted, and Stripe is charged from these
 * numbers, not from anything the client said.
 */

type Line = { id: string; qty: number };

/**
 * Which checkout takes the money.
 *
 * A switch rather than a replacement, because flipping payment providers is
 * not a thing to discover has happened. Set CHECKOUT_PROVIDER=shopify when
 * Shopify Payments is active and the bundle discount has been rebuilt as a
 * Shopify automatic discount — until then Shopify's checkout would charge
 * full price for the pair and silently drop the offer the site advertises.
 */
const provider = () => (process.env.CHECKOUT_PROVIDER === "shopify" ? "shopify" : "stripe");

/**
 * Hands the bag to Shopify and returns its checkout URL.
 *
 * The click identity travels as cart attributes, which is the Shopify
 * equivalent of the Stripe session metadata doing that job today: they ride
 * with the cart, survive the redirect and come back on the order, so a sale
 * can still be traced to the ad that produced it.
 *
 * Prices, shipping and discounts are Shopify's from here. This route stops
 * computing them rather than computing them twice and disagreeing.
 */
async function shopifyCheckout(
  request: NextRequest,
  bag: Line[],
  email: string,
): Promise<
  | { url: string; cost: { subtotal: string; total: string; discount: string } }
  | { error: string; status: number }
> {
  const live = await liveCatalog();
  if (!live) {
    return { error: "Checkout is unavailable right now. Try again shortly.", status: 503 };
  }

  const lines = [];
  for (const l of bag) {
    const item = live[l.id];
    if (!item) return { error: "Your bag is out of date. Reload the page.", status: 400 };
    if (!item.available) return { error: `${CATALOG[l.id].name} is sold out.`, status: 409 };
    if (item.stock !== null && item.stock < l.qty) {
      return { error: `Only ${item.stock} of ${CATALOG[l.id].name} left.`, status: 409 };
    }
    lines.push({ variantId: item.variantId, quantity: l.qty });
  }

  const cart = await createCart(lines, attribution(request), email);

  // Returned so the total Shopify intends to charge can be read directly,
  // rather than inferred from a checkout page that computes it in the browser.
  const discount = cart.discountAllocations.reduce(
    (n, d) => n + Number(d.discountedAmount.amount),
    0,
  );
  return {
    url: cart.checkoutUrl,
    cost: {
      subtotal: cart.cost.subtotalAmount.amount,
      total: cart.cost.totalAmount.amount,
      discount: discount.toFixed(2),
    },
  };
}

/**
 * The bundle discount as a Stripe coupon.
 *
 * Applied as a discount rather than by quietly shaving the pack's unit price,
 * so the line items stay truthful and the saving shows as its own line on the
 * receipt. The id is deterministic, so this creates one coupon per amount for
 * the whole account rather than one per checkout.
 *
 * If it cannot be resolved we throw: the shopper has already been shown the
 * discounted total, and charging more than the cart displayed is the one
 * failure mode worth refusing the sale over.
 */
async function bundleCoupon(amountOff: number) {
  const id = `ice-tins-bundle-${amountOff}-${CURRENCY}`;
  try {
    return (await stripe().coupons.retrieve(id)).id;
  } catch {
    try {
      return (
        await stripe().coupons.create({
          id,
          amount_off: amountOff,
          currency: CURRENCY,
          duration: "once",
          name: "Tin + pack bundle",
        })
      ).id;
    } catch (err) {
      // a concurrent checkout may have created it between our two calls
      if ((err as { code?: string }).code === "resource_already_exists") return id;
      throw err;
    }
  }
}

/**
 * The attribution cookies, read server-side rather than accepted from the
 * body — the browser has no reason to be trusted with them, and by this point
 * whatever JavaScript ran on the page is no longer in the picture.
 *
 * Stripe rejects metadata values over 500 characters and undefined values, so
 * every entry is trimmed and absent keys are simply left out.
 */
function attribution(request: NextRequest) {
  const meta: Record<string, string> = {};
  const put = (key: string, value?: string) => {
    if (value) meta[key] = value.slice(0, 500);
  };

  put("fbp", request.cookies.get(COOKIE.fbp)?.value);
  put("fbc", request.cookies.get(COOKIE.fbc)?.value);
  put("external_id", request.cookies.get(COOKIE.externalId)?.value);
  put("utm", request.cookies.get(COOKIE.utm)?.value);
  put(
    "client_ip",
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      request.headers.get("x-real-ip") ??
      undefined,
  );
  put("client_ua", request.headers.get("user-agent") ?? undefined);

  return meta;
}

export async function POST(request: NextRequest) {
  const usingShopify = provider() === "shopify";

  // Stripe's key only has to be present when Stripe is taking the money.
  // Gating every checkout on it would keep the shop tied to a provider it is
  // no longer using.
  const key = inspectKey();
  if (!usingShopify && !key.ok) {
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

  let body: { lines?: unknown; email?: unknown };
  try {
    body = (await request.json()) as { lines?: unknown; email?: unknown };
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  // Collected on our page rather than left to Stripe's, which is the only way
  // an abandoned checkout is reachable at all — Stripe only tells us an
  // address once someone has already paid. It is passed straight through as
  // `customer_email`, so nobody types it twice.
  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) {
    return NextResponse.json(
      { error: "That email does not look right. Check it and try again." },
      { status: 400 },
    );
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

    // Shopify owns the allocation once it owns checkout, and it is checked
    // against live inventory in shopifyCheckout — asking Supabase as well
    // would let a stale table refuse a sale Shopify would have accepted.
    const stock = usingShopify
      ? ({ ok: true, remaining: Number.POSITIVE_INFINITY } as const)
      : await remaining(id);
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

  const subtotal = priced.reduce((n, l) => n + currentPrice(l.product.id) * l.qty, 0);
  // recomputed here rather than trusted from the client, like every other
  // number in this route
  const bag = priced.map((l) => ({ id: l.product.id, qty: l.qty }));

  if (usingShopify) {
    try {
      const result = await shopifyCheckout(request, bag, email);
      if ("error" in result) {
        return NextResponse.json({ error: result.error }, { status: result.status });
      }
      console.log("[checkout] shopify cart", JSON.stringify(result.cost));
      // Deliberately not recorded for recovery. Our reminder is cancelled by
      // markRecovered(), which only the Stripe webhook calls — and that
      // webhook never fires once Shopify takes the payment. Every row would
      // stay open forever, and the daily cron would mail everyone who had
      // successfully paid to say their bag was still waiting.
      //
      // Shopify recovers its own abandoned checkouts, and it knows which ones
      // completed. Recovery is its job from here.
      // the browser is told which checkout it is going to, because it has to
      // clear the local bag itself: with Shopify the shopper finishes on
      // Shopify's thank-you page and never comes back to ours, where the bag
      // is cleared today. Leaving it full invites a second order of something
      // they have already bought.
      return NextResponse.json({ url: result.url, provider: "shopify", cost: result.cost });
    } catch (err) {
      console.error("[checkout] shopify:", err instanceof Error ? err.message : String(err));
      return NextResponse.json(
        { error: "Could not start checkout. Try again in a moment." },
        { status: 502 },
      );
    }
  }
  const saving = bundleSaving(bag);
  const goods = subtotal - saving;
  const shipping =
    freeShippingToday() || qualifiesForFreeShipping(bag) ? 0 : SHIPPING_FLAT;
  const origin = siteOrigin(request);

  try {
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      line_items: priced.map((l) => ({
        quantity: l.qty,
        price_data: {
          currency: CURRENCY,
          unit_amount: currentPrice(l.product.id),
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
            // transit only — the lead time before dispatch is stated on the
            // product page and repeated in the confirmation, from the same
            // constant, so Stripe's estimate cannot contradict either
            delivery_estimate: {
              minimum: { unit: "business_day", value: TRANSIT_DAYS.min },
              maximum: { unit: "business_day", value: TRANSIT_DAYS.max },
            },
          },
        },
      ],
      customer_email: email,
      // Stripe hands back a fresh link to the same bag once the session
      // lapses, which is what the second reminder sends people to
      after_expiration: { recovery: { enabled: true, allow_promotion_codes: false } },
      phone_number_collection: { enabled: false },
      // Stripe refuses both at once, so a bundle order trades the promo-code
      // field for the discount it already earned
      ...(saving > 0
        ? { discounts: [{ coupon: await bundleCoupon(saving) }] }
        : { allow_promotion_codes: true }),
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?cancelled=1`,
      metadata: {
        // an audit trail in the Stripe dashboard — the webhook itself reads
        // stock back from the expanded line items, not from here
        bag: JSON.stringify(bag),
        // the click identity, carried across the redirect. Stripe is the only
        // thing that survives the round trip to the payment page and back, so
        // the webhook can attribute a sale to the ad that produced it.
        ...attribution(request),
      },
    });

    if (!session.url)
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 502 },
      );

    // recorded after the session exists so the row always has a session id to
    // be marked recovered against; awaited, but it never throws, so a broken
    // recovery table cannot cost the sale that is already paid for
    await recordAbandoned({
      sessionId: session.id,
      email,
      lines: priced.map((l) => ({
        sku: l.product.id,
        name: l.product.name,
        qty: l.qty,
        total_amount: currentPrice(l.product.id) * l.qty,
      })),
      subtotalCents: goods,
      currency: CURRENCY,
      checkoutUrl: session.url,
      attribution: attribution(request),
    });

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
