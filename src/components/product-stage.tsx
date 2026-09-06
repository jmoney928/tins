"use client";

import { memo, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Splatter } from "./splatter";

const SPRING = { stiffness: 80, damping: 18, mass: 0.6 };

/**
 * Hero object: the three pieces, shot separated. Parallax only — a photograph
 * tilted in 3D reads as a mistake, so the pointer nudges it instead.
 * Isolated leaf; the float loop never re-renders the page.
 */
export const ProductStage = memo(function ProductStage({
  onDark = false,
}: {
  /** drops the multiply splatter, which only muddies a dark ground */
  onDark?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const x = useSpring(useTransform(px, [-0.5, 0.5], [-14, 14]), SPRING);
  const y = useSpring(useTransform(py, [-0.5, 0.5], [-10, 10]), SPRING);

  return (
    <div
      ref={ref}
      className="relative mx-auto flex w-full max-w-[460px] items-center justify-center"
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
      {!onDark && (
        <Splatter
          scope="hero-product"
          rotate={-22}
          className="pointer-events-none absolute inset-[-14%] opacity-[0.38] mix-blend-multiply"
        />
      )}

      <motion.div
        style={{ x, y }}
        animate={{ translateY: [0, -9, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-full"
      >
        <Image
          src="/tin-exploded.png"
          alt="The Ice Tins can separated into its three pieces: engraved lid, pouch chamber with a perforated floor, and the ice pack tray"
          width={1400}
          height={1400}
          priority
          sizes="(max-width: 1024px) 80vw, 42vw"
          className="h-auto w-full"
        />
      </motion.div>

    </div>
  );
});
