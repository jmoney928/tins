"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useAnimate } from "framer-motion";
import { HandbagIcon } from "@phosphor-icons/react/dist/ssr";
import { useCart } from "./cart/cart-context";

/**
 * The bag, shared by both navs.
 *
 * Adding to the bag already opens the drawer, but the drawer closes and the
 * count in the corner is what remains — so the count has to be seen to
 * change. The badge springs in and the button gives a small bump whenever the
 * count goes up, and does neither on load, when a stored bag is merely being
 * read back.
 */
export function BagButton({ className = "" }: { className?: string }) {
  const cart = useCart();
  const [scope, animate] = useAnimate<HTMLButtonElement>();
  const prev = useRef<number | null>(null);

  useEffect(() => {
    if (!cart.ready) return;
    if (prev.current !== null && cart.count > prev.current) {
      animate(
        scope.current,
        { scale: [1, 1.16, 1] },
        { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
      );
    }
    prev.current = cart.count;
  }, [cart.count, cart.ready, animate, scope]);

  return (
    <button
      ref={scope}
      onClick={cart.openDrawer}
      aria-label={cart.count ? `Bag, ${cart.count} items` : "Bag, empty"}
      className={`hairline relative grid size-11 place-items-center rounded-full border text-fog transition-colors duration-300 hover:text-frost ${className}`}
    >
      <HandbagIcon size={17} weight="light" />
      <AnimatePresence>
        {cart.count > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: "spring", stiffness: 520, damping: 26 }}
            className="absolute -top-1 -right-1 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-ink px-1 font-mono text-[10px] leading-none text-paper"
          >
            {cart.count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
