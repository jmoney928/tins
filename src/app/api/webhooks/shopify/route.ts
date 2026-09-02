import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { sendMetaEvent, metaConfigured } from "@/lib/meta";

export const dynamic = "force-dynamic";

/**
 * Shopify order webhook — the server-side half of Purchase.
 *
 * Once Shopify takes the payment the Stripe webhook stops firing, and with it
 * went the only report of a sale that is not subject to ad blockers, tracking
 * prevention or a closed tab. The custom pixel in Shopify's checkout restored
 * the browser half; this restores the other one.
 *
 * Deliberately built against a webhook created in the Shopify admin rather
 * than through the Admin API, because that needs no Admin token, no app
 * scopes and no protected-customer-data approval — three things that have
 * been the blocker here. It needs one value: the signing secret Shopify shows
 * on the webhook page.
 *
 * Signature first, always. An unsigned request could otherwise fabricate an
 * order and poison the ad optimisation this exists to feed.
 */

type ShopifyOrder = {
  id: number;
  checkout_token?: string | null;
  total_price?: string;
  currency?: string;
  email?: string | null;
  phone?: string | null;
  created_at?: string;
  line_items?: { sku?: string | null; quantity?: number; price?: string }[];
  billing_address?: Record<string, string | null> | null;
  shipping_address?: Record<string, string | null> | null;
  customer?: { first_name?: string | null; last_name?: string | null; email?: string | null } | null;
  note_attributes?: { name: string; value: string }[];
};

function verify(raw: string, header: string | null): boolean {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret || !header) return false;

  const expected = createHmac("sha256", secret).update(raw, "utf8").digest("base64");
  const a = Buffer.from(expected);
  const b = Buffer.from(header);
  // timingSafeEqual throws on a length mismatch, which is itself a rejection
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Cart attributes arrive on the order as note_attributes. */
function attr(order: ShopifyOrder, name: string): string | null {
  return order.note_attributes?.find((n) => n.name === name)?.value ?? null;
}

export async function POST(request: Request) {
  const raw = await request.text();

  if (!verify(raw, request.headers.get("x-shopify-hmac-sha256"))) {
    console.error("[shopify webhook] rejected: bad or missing signature");
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  const topic = request.headers.get("x-shopify-topic") ?? "";
  if (!topic.startsWith("orders/")) return NextResponse.json({ received: true });

  let order: ShopifyOrder;
  try {
    order = JSON.parse(raw) as ShopifyOrder;
  } catch {
    return NextResponse.json({ error: "Malformed payload." }, { status: 400 });
  }

  if (!metaConfigured()) {
    console.warn("[shopify webhook] Meta is not configured — order", order.id, "not reported");
    return NextResponse.json({ received: true, reported: false });
  }

  const ship = order.shipping_address ?? order.billing_address ?? {};
  const lines = order.line_items ?? [];

  /**
   * The same id the custom pixel sends from Shopify's checkout, so Meta
   * collapses the browser and server copies into one conversion. Both sides
   * key on the checkout token because both sides genuinely have it — the
   * order id is not visible to the pixel in every case.
   */
  const eventId = `purchase.${order.checkout_token ?? order.id}`;

  const reported = await sendMetaEvent({
    eventName: "Purchase",
    eventId,
    eventTime: order.created_at ? Math.floor(Date.parse(order.created_at) / 1000) : undefined,
    actionSource: "website",
    user: {
      email: order.email ?? order.customer?.email ?? null,
      phone: order.phone ?? null,
      firstName: order.customer?.first_name ?? ship.first_name ?? null,
      lastName: order.customer?.last_name ?? ship.last_name ?? null,
      city: ship.city ?? null,
      region: ship.province_code ?? ship.province ?? null,
      postalCode: ship.zip ?? null,
      country: ship.country_code ?? null,
      // carried from the ad click, through our cart, into Shopify's order
      externalId: attr(order, "external_id"),
      fbp: attr(order, "fbp"),
      fbc: attr(order, "fbc"),
      ip: attr(order, "client_ip"),
      userAgent: attr(order, "client_ua"),
    },
    value: Number(order.total_price ?? 0),
    currency: order.currency ?? "CAD",
    contents: lines
      .filter((l) => l.sku)
      .map((l) => ({
        id: l.sku!,
        quantity: l.quantity ?? 1,
        item_price: Number(l.price ?? 0),
      })),
  });

  console.log(
    `[shopify webhook] ${topic} order ${order.id} — Purchase ${reported ? "reported" : "not accepted"}`,
  );

  // Shopify retries on non-2xx. Meta de-duplicates on the shared event id, so
  // a retry cannot double-count; returning 200 keeps the queue clear.
  return NextResponse.json({ received: true, reported });
}
