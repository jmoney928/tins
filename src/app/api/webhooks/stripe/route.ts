import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { settleOrder, type SettleLine } from "@/lib/stock";
import { CATALOG } from "@/lib/catalog";
import { purchaseEventId } from "@/lib/attribution";
import { sendMetaEvent } from "@/lib/meta";
import { sendOrderEmail } from "@/lib/email";
import { markRecovered, attachRecoveryUrl } from "@/lib/abandoned";

/**
 * Purchase, reported from the server.
 *
 * The browser copy fires on the success page, which a shopper can close, block
 * or reload — so the only certain observation of a sale is this one. Both
 * copies carry an event id derived from the Stripe session, so Meta collapses
 * them into a single conversion rather than counting the order twice.
 *
 * The click identity was captured on landing and carried out to Stripe as
 * session metadata, which is how an order made minutes later on a different
 * origin can still be traced back to the ad that produced it. The buyer
 * details are Stripe's verified values, hashed in `sendMetaEvent`.
 */
async function reportPurchase(session: Stripe.Checkout.Session, lines: SettleLine[]) {
  const d = session.customer_details;
  const m = session.metadata ?? {};
  const [firstName, ...rest] = (d?.name ?? "").trim().split(/\s+/);

  await sendMetaEvent({
    eventName: "Purchase",
    eventId: purchaseEventId(session.id),
    eventTime: session.created,
    actionSource: "website",
    user: {
      email: d?.email,
      phone: d?.phone,
      firstName: firstName || null,
      lastName: rest.length ? rest.join(" ") : null,
      city: d?.address?.city,
      region: d?.address?.state,
      postalCode: d?.address?.postal_code,
      country: d?.address?.country,
      externalId: m.external_id ?? null,
      fbp: m.fbp ?? null,
      fbc: m.fbc ?? null,
      ip: m.client_ip ?? null,
      userAgent: m.client_ua ?? null,
    },
    value: (session.amount_total ?? 0) / 100,
    currency: session.currency ?? "cad",
    contents: lines.map((l) => ({
      id: l.sku,
      quantity: l.qty,
      item_price: l.unit_amount / 100,
    })),
  });
}

/** The confirmation the success page has been promising all along. */
async function sendOrderConfirmation(session: Stripe.Checkout.Session, lines: SettleLine[]) {
  const to = session.customer_details?.email;
  if (!to) {
    console.warn("[stripe webhook] no email on", session.id, "— no confirmation sent");
    return;
  }

  await sendOrderEmail({
    to,
    // the same reference the success page shows, so a support email matches
    reference: `IT-${session.id.slice(-8).toUpperCase()}`,
    lines: lines.map((l) => ({ name: l.name, qty: l.qty, total_amount: l.total_amount })),
    total: session.amount_total ?? 0,
    currency: session.currency ?? "cad",
    shippingName:
      session.collected_information?.shipping_details?.name ?? session.customer_details?.name,
  });
}

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

  // The session lapsed without payment. Stripe mints a fresh link to the same
  // bag on expiry, which is what the second reminder sends people to — and it
  // also reports the email they typed on Stripe's page, so a shopper who
  // abandoned before our own field can still be reached.
  if (event.type === "checkout.session.expired") {
    const expired = event.data.object as Stripe.Checkout.Session;
    await attachRecoveryUrl(
      expired.id,
      expired.after_expiration?.recovery?.url ?? null,
      expired.customer_details?.email ?? expired.customer_email ?? null,
    );
    return NextResponse.json({ received: true });
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

    // Everything below is guarded on `applied`, so a Stripe retry of an
    // already-settled session cannot double-report a conversion or send the
    // buyer a second confirmation.
    if (applied) {
      await reportPurchase(session, lines);
      await sendOrderConfirmation(session, lines);
    }

    // outside the `applied` guard on purpose: a replayed webhook should still
    // close out a recovery row that an earlier delivery failed to mark, and
    // marking twice is a no-op
    await markRecovered(session.id);

    return NextResponse.json({ received: true, applied });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[stripe webhook] settling failed:", message);
    // 500 tells Stripe to retry; settle_order is idempotent so that is safe
    return NextResponse.json({ error: "Could not settle order." }, { status: 500 });
  }
}
