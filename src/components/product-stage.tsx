"use client";

import { memo, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { LAYERS, STAGE_ALT } from "@/lib/stage";

const SPRING = { stiffness: 80, damping: 18, mass: 0.6 };

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Hero object. Each piece floats on its own period so the stack drifts the
 * way a thing hanging in cold air would, and the pointer nudges the whole
 * group a little. No 3D tilt: a photograph tilted in perspective reads as a
 * mistake. Isolated leaf; the loops never re-render the page.
 */
export const ProductStage = memo(function ProductStage({
  className = "",
}: {
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const x = useSpring(useTransform(px, [-0.5, 0.5], [-12, 12]), SPRING);
  const y = useSpring(useTransform(py, [-0.5, 0.5], [-8, 8]), SPRING);

  return (
    <div
      ref={ref}
      className={`relative w-full ${className}`}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      <motion.div
        style={{ x, y }}
        className="relative aspect-[416/706] w-full"
        role="img"
        aria-label={STAGE_ALT}
      >
        {LAYERS.map((l, i) => (
          <motion.div
            key={l.src}
            className="absolute inset-x-0"
            style={{ top: `${l.top}%` }}
            initial={{ y: l.lift, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.3, ease: EASE, delay: 0.12 + i * 0.06 }}
          >
            <motion.div
              animate={{ y: [0, -l.float, 0] }}
              transition={{
                duration: l.dur,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.4 + i * 0.4,
              }}
            >
              <Image
                src={l.src}
                alt=""
                width={l.w}
                height={l.h}
                priority
                sizes="(max-width: 640px) 52vw, (max-width: 1024px) 40vw, 360px"
                className="h-auto w-full select-none"
                draggable={false}
              />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
});
