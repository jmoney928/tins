import { newEventId } from "./attribution";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * The Meta Pixel only ever fired PageView — no AddToCart, InitiateCheckout,
 * or Purchase — which means every campaign reads zero Results no matter
 * how the site actually performs, because the events that would report a
 * conversion were never sent. This is the one call site for all of them.
 *
 * Every event now carries an `eventID` and is mirrored to /api/track, which
 * re-sends it from the server with the request's real IP, user agent and
 * first-party cookies attached. Meta collapses the two copies on the shared
 * id, so the mirror recovers the blocked share of traffic without inflating
 * conversions. Purchase is the exception: it is reported from the Stripe
 * webhook, the only place a sale is certain to be observed.
 *
 * Callers pass cart lines rather than Meta's parameter names, and this module
 * derives both the pixel payload and the mirror payload from them — one shape
 * in, so the two copies of an event cannot drift apart.
 */

export type PixelEvent = "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase";

export type TrackInput = {
  lines?: { id: string; qty: number }[];
  value?: number;
  currency?: string;
  orderId?: string;
};

export function trackPixel(
  event: PixelEvent,
  input: TrackInput = {},
  options?: { eventId?: string; mirror?: boolean },
) {
  if (typeof window === "undefined") return;

  const eventId = options?.eventId ?? newEventId();
  const { lines, value, currency, orderId } = input;

  const params: Record<string, unknown> = {};
  if (lines?.length) {
    params.content_ids = lines.map((l) => l.id);
    params.content_type = "product";
    params.contents = lines.map((l) => ({ id: l.id, quantity: l.qty }));
    params.num_items = lines.reduce((n, l) => n + l.qty, 0);
  }
  if (value !== undefined) params.value = value;
  if (currency) params.currency = currency;
  if (orderId) params.order_id = orderId;

  if (window.fbq) window.fbq("track", event, params, { eventID: eventId });

  if (options?.mirror === false || event === "Purchase") return;

  void fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, eventId, params: { lines }, url: window.location.href }),
    keepalive: true,
  }).catch(() => {
    // a failed mirror is a measurement gap, never a broken page
  });
}
