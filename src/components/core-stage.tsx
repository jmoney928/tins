"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { IceCore } from "./ice-core";
import { Splatter } from "./splatter";

/**
 * Isolated perpetual motion: the core drifts and turns, the splash breathes.
 * `onDark` flips the blend mode and the pill treatment — a splash that
 * multiplies on white disappears entirely on ink.
 */
export const CoreStage = memo(function CoreStage({
  onDark = false,
}: {
  onDark?: boolean;
}) {
  return (
    <div className="relative mx-auto flex w-full max-w-[440px] items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.06, 1], rotate: [0, 4, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className={`pointer-events-none absolute inset-[-28%] ${
          onDark
            ? "opacity-[0.32] mix-blend-screen"
            : "opacity-[0.62] mix-blend-multiply"
        }`}
      >
        <Splatter
          scope="core-splash"
          rotate={-18}
          from={onDark ? "#d3ecf6" : undefined}
          to={onDark ? "#2e9dc8" : undefined}
          className="h-full w-full"
        />
      </motion.div>

      <motion.div
        animate={{ y: [0, -12, 0], rotate: [-3, 3, -3] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-[68%] sm:w-[74%]"
      >
        <IceCore scope="stage" className="w-full drop-shadow-2xl" />
      </motion.div>

      <div
        className={`absolute top-[6%] left-0 -rotate-6 rounded-full px-3.5 py-1.5 font-mono text-[10px] tracking-[0.18em] uppercase backdrop-blur-md ${
          onDark
            ? "border border-white/15 bg-white/[0.06] text-ice-300"
            : "glass-edge bg-paper/85 text-ice-700"
        }`}
      >
        −18 °C
      </div>
      <div
        className={`absolute right-0 bottom-[10%] flex rotate-3 items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[10px] tracking-[0.18em] uppercase backdrop-blur-md ${
          onDark
            ? "border border-white/15 bg-white/[0.06] text-white"
            : "glass-edge bg-paper/85 text-frost"
        }`}
      >
        <span className="animate-breathe h-1.5 w-1.5 rounded-full bg-ice-500" />
        18 g
      </div>
    </div>
  );
});
