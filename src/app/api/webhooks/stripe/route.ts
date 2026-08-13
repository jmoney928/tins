import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { settleOrder, type SettleLine } from "@/lib/stock";
import { CATALOG } from "@/lib/catalog";

/**
 * The only place an order becomes real.
 *
 * A shopper can close the tab before the success page loads, so fulfilment
 * must never hang off a redirect. Stripe retries this endpoint until it gets
 * a 2xx, which is why settle_order is idempotent on the session id.
 *
 * The signature check needs the raw body — do not parse it first.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeConfigured() || !secret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature)
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });

  const raw = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(raw, signature, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "bad signature";
    console.error("[stripe webhook] rejected:", message);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  ) {
    return NextResponse.json({ received: true });
  }

  const lean = event.data.object as Stripe.Checkout.Session;
  if (lean.payment_status !== "paid") {
    console.log(`[stripe webhook] ${lean.id} not paid yet (${lean.payment_status})`);
    return NextResponse.json({ received: true });
  }

  try {
    // the event payload omits line items, so read them back from the session
    const session = await stripe().checkout.sessions.retrieve(lean.id, {
      expand: ["line_items.data.price.product"],
    });

    const lines: SettleLine[] = (session.line_items?.data ?? []).map((li) => {
      const qty = li.quantity ?? 1;
      const total = li.amount_total ?? 0;
      return {
        // price_data products are created inline, so the sku rides in metadata
        sku:
          (typeof li.price?.product === "object" &&
          li.price.product &&
          !("deleted" in li.price.product)
            ? li.price.product.metadata?.sku
            : undefined) ?? li.description ?? "unknown",
        name: li.description ?? "Item",
        qty,
        unit_amount: li.price?.unit_amount ?? Math.round(total / Math.max(qty, 1)),
        total_amount: total,
      };
    });

    if (!lines.length) {
      console.error("[stripe webhook] no line items on", session.id);
      return NextResponse.json({ received: true });
    }

    // A sku we cannot resolve would decrement nothing and look like success.
    // Fail loudly and let Stripe retry rather than lose the allocation.
    const unknown = lines.filter((l) => !CATALOG[l.sku]);
    if (unknown.length) {
      console.error(
        "[stripe webhook] unresolved skus on", session.id,
        unknown.map((l) => l.sku).join(", "),
      );
      return NextResponse.json({ error: "Unresolved line items." }, { status: 500 });
    }

    const d = session.customer_details;
    const applied = await settleOrder({
      sessionId: session.id,
      paymentIntent:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : (session.payment_intent?.id ?? null),
      email: d?.email ?? null,
      name: d?.name ?? null,
      currency: session.currency ?? "cad",
      subtotal: session.amount_subtotal ?? null,
      shipping: session.total_details?.amount_shipping ?? null,
      total: session.amount_total ?? null,
      shippingName: session.collected_information?.shipping_details?.name ?? d?.name ?? null,
      address:
        (session.collected_information?.shipping_details
          ?.address as unknown as Record<string, unknown>) ??
        (d?.address as unknown as Record<string, unknown>) ??
        null,
      lines,
    });

    console.log(
      applied
        ? `[stripe webhook] ${session.id} settled — order recorded, stock decremented`
        : `[stripe webhook] ${session.id} already settled, ignoring replay`,
    );

    // TODO: send the confirmation email here, guarded on `applied`.
    return NextResponse.json({ received: true, applied });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[stripe webhook] settling failed:", message);
    // 500 tells Stripe to retry; settle_order is idempotent so that is safe
    return NextResponse.json({ error: "Could not settle order." }, { status: 500 });
  }
}
