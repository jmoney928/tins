import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { commit } from "@/lib/stock";

/**
 * The only place an order becomes real.
 *
 * A shopper can close the tab before the success page loads, so fulfilment
 * must never hang off a redirect. Stripe retries this endpoint until it gets
 * a 2xx, which is why `commit` is idempotent on the session id.
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

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status !== "paid") break;

      let bag: { id: string; qty: number }[] = [];
      try {
        bag = JSON.parse(session.metadata?.bag ?? "[]");
      } catch {
        console.error("[stripe webhook] unreadable bag metadata on", session.id);
      }

      const applied = commit(session.id, bag);
      console.log(
        applied
          ? `[stripe webhook] order ${session.id} settled — allocation updated`
          : `[stripe webhook] order ${session.id} already settled, ignoring replay`,
      );

      // TODO: persist the order and send the confirmation email here.
      break;
    }

    case "checkout.session.expired":
      // nothing was reserved, so nothing to release
      break;

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
