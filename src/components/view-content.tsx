"use client";

import { useEffect, useRef } from "react";
import { trackPixel } from "@/lib/pixel";

/**
 * ViewContent for the product page.
 *
 * Missing until now, which meant the highest-intent retargeting audience you
 * can build — saw the product, did not buy — did not exist. Guarded against
 * a second fire so React's development double-invoke does not report two
 * views of the same page.
 */
export function ViewContent({ productId }: { productId: string }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackPixel("ViewContent", { lines: [{ id: productId, qty: 1 }] });
  }, [productId]);

  return null;
}
