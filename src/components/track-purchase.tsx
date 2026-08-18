"use client";

import { useEffect } from "react";
import { trackPixel } from "@/lib/pixel";
import { purchaseEventId } from "@/lib/attribution";

/**
 * Fires once, client-side, when a paid order actually renders — this page
 * only loads via the Stripe success_url, so a fired Purchase event means a
 * completed payment, not just a visit.
 *
 * Two things guard the count. The event id is derived from the Stripe session
 * rather than generated, so this copy and the webhook's copy carry the same
 * id and Meta reports one conversion instead of two. And a reload of the
 * success page used to re-fire the event outright, which quietly inflated
 * every campaign it touched — the session id is recorded in sessionStorage so
 * a refresh reports nothing.
 */
export function TrackPurchase({
  value,
  currency,
  orderId,
}: {
  value: number;
  currency: string;
  orderId: string;
}) {
  useEffect(() => {
    const key = `it.purchase.${orderId}`;
    try {
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
    } catch {
      // private mode with storage disabled — still better to send once here
      // than to skip the event entirely; the webhook copy de-duplicates it
    }

    trackPixel(
      "Purchase",
      { value, currency, orderId },
      { eventId: purchaseEventId(orderId) },
    );
    // fire once per mount, not on every prop identity change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
