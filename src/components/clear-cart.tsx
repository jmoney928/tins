"use client";

import { useEffect } from "react";
import { useCart } from "./cart/cart-context";

/** Empties the bag once Stripe has confirmed the payment. */
export function ClearCart() {
  const { clear, ready } = useCart();
  useEffect(() => {
    if (ready) clear();
  }, [ready, clear]);
  return null;
}
