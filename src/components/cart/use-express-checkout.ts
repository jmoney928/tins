"use client";

import { useCallback, useRef, useState } from "react";
import { useCart } from "./cart-context";
import { CURRENCY_LABEL, currentPrice } from "@/lib/catalog";
import { trackPixel } from "@/lib/pixel";

export type BagLine = { id: string; qty: number };

/**
 * Hands the bag straight to the payment page.
 *
 * There used to be a page of our own between the bag and the payment page,
 * asking for an email. It cost every shopper a form, and it cost the wallets
 * their whole reason for existing: Apple Pay and Shop Pay are there to skip
 * typing, and we made people type first, then showed them the shortcut. The
 * payment page collects the email itself, so ours was asking for something
 * they were about to give anyway.
 *
 * `go()` sends the whole bag. `go(lines)` sends exactly those lines, for the
 * buy-now button on the product page, which cannot wait for cart state to
 * settle before it fires.
 */
export function useExpressCheckout() {
  const cart = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  // a second click while the first request is in flight would create a second
  // Shopify cart and abandon the first
  const inflight = useRef(false);

  const go = useCallback(
    async (override?: BagLine[]) => {
      if (inflight.current) return;
      const lines = override ?? cart.lines.map((l) => ({ id: l.id, qty: l.qty }));
      if (!lines.length) return;

      inflight.current = true;
      setBusy(true);
      setError("");

      const release = (message: string) => {
        setError(message);
        inflight.current = false;
        setBusy(false);
      };

      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lines, code: cart.code?.status === "applied" ? cart.code.code : undefined }),
        });
        const data = await res.json();

        if (!res.ok || !data.url) {
          release(data.error ?? "Could not start checkout. Try again.");
          return;
        }

        // Shopify keeps its own copy of this cart and recovers it by email if
        // the shopper abandons, so clearing ours loses nothing they cannot get
        // back — and prevents a stale bag greeting a customer who has paid.
        if (data.provider === "shopify") cart.clear();

        trackPixel("InitiateCheckout", {
          lines,
          currency: CURRENCY_LABEL,
          value: override
            ? override.reduce((n, l) => n + currentPrice(l.id) * l.qty, 0) / 100
            : cart.total / 100,
        });

        window.location.href = data.url;
      } catch {
        release("No connection. Check your network and try again.");
      }
    },
    [cart],
  );

  return { go, busy, error };
}
