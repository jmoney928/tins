"use client";

import { useEffect } from "react";
import { trackPixel } from "@/lib/pixel";

/**
 * Fires once, client-side, when a paid order actually renders — this page
 * only loads via the Stripe success_url, so a fired Purchase event means a
 * completed payment, not just a visit.
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
    trackPixel("Purchase", {
      value,
      currency,
      content_type: "product",
      order_id: orderId,
    });
    // fire once per mount, not on every prop identity change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
