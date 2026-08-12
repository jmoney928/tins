"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const SPRING = { stiffness: 220, damping: 22, mass: 0.4 };

/**
 * Pulls its child toward the cursor. All values live outside the React render
 * cycle — no setState per mousemove.
 */
export function Magnetic({
  children,
  strength = 0.32,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const x = useSpring(useTransform(mx, (v) => v * strength), SPRING);
  const y = useSpring(useTransform(my, (v) => v * strength), SPRING);

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={className}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set(e.clientX - (r.left + r.width / 2));
        my.set(e.clientY - (r.top + r.height / 2));
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
