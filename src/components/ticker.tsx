"use client";

import { memo } from "react";
import { motion } from "framer-motion";

const WORDS = [
  "One tin, one refill pack",
  "Cold for 6 hours",
  "Machined in Vancouver, BC",
  "Freezer to ready in 90 min",
  "One ice pack in every can",
  "Free shipping over $75",
];

/** Seamless single-direction band. Duplicated once, translated exactly -50%. */
export const Ticker = memo(function Ticker() {
  const row = [...WORDS, ...WORDS];

  return (
    <div className="relative overflow-hidden border-y py-5 hairline bg-abyss/30">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-void to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-void to-transparent" />

      <motion.div
        className="flex w-max items-center gap-10 will-change-transform"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
      >
        {row.map((w, i) => (
          <span
            key={`${w}-${i}`}
            className="flex shrink-0 items-center gap-10 font-mono text-[11px] tracking-[0.26em] text-fog uppercase"
          >
            {w}
            <span className="h-1 w-1 rotate-45 bg-ice-700" />
          </span>
        ))}
      </motion.div>
    </div>
  );
});
