"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { IceCore } from "./ice-core";
import { Splatter } from "./splatter";

/** Isolated perpetual motion: the core drifts and turns, the splash breathes. */
export const CoreStage = memo(function CoreStage() {
  return (
    <div className="relative mx-auto flex w-full max-w-[440px] items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.06, 1], rotate: [0, 4, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute inset-[-30%] opacity-[0.62] mix-blend-multiply"
      >
        <Splatter
          scope="core-splash"
          rotate={-18}
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

      <div className="glass-edge absolute top-[6%] left-0 -rotate-6 rounded-full bg-paper/85 px-3.5 py-1.5 font-mono text-[10px] tracking-[0.18em] text-ice-700 uppercase backdrop-blur-md">
        −18 °C
      </div>
      <div className="glass-edge absolute right-0 bottom-[10%] flex rotate-3 items-center gap-2 rounded-full bg-paper/85 px-3.5 py-1.5 font-mono text-[10px] tracking-[0.18em] text-frost uppercase backdrop-blur-md">
        <span className="animate-breathe h-1.5 w-1.5 rounded-full bg-ice-500" />
        18 g
      </div>
    </div>
  );
});
