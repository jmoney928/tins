"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { moneyExact } from "@/lib/catalog";

/**
 * A price that rolls to its new value instead of snapping.
 *
 * Where a figure changes in response to something the shopper just did — a
 * quantity, a pack added, a saving applied — the roll is what tells them the
 * number they are reading is the consequence of that action. The value is
 * driven as a motion value and written straight to the text node, so nothing
 * re-renders while it moves, and the first render prints the final figure so
 * the server HTML is already correct.
 */
export function AnimatedMoney({
  cents,
  format = moneyExact,
  className,
}: {
  cents: number;
  format?: (cents: number) => string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const mv = useMotionValue(cents);
  const text = useTransform(mv, (v) => format(Math.round(v)));
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      mv.set(cents);
      return;
    }
    if (reduced) {
      mv.set(cents);
      return;
    }
    const controls = animate(mv, cents, { duration: 0.55, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [cents, mv, reduced]);

  return <motion.span className={className}>{text}</motion.span>;
}
