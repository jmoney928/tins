"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import { CARRIERS } from "@/lib/testers";

export function Carriers({ heading: H = "h2" }: { heading?: "h1" | "h2" }) {
  const rail = useRef<HTMLDivElement>(null);

  const nudge = (dir: 1 | -1) =>
    rail.current?.scrollBy({ left: dir * 360, behavior: "smooth" });

  return (
    <section id="carriers" className="py-20 sm:py-24">
      <div className="mx-auto flex max-w-7xl items-end justify-between gap-6 px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] tracking-[0.28em] text-ice-500 uppercase">
            Field testers
          </p>
          <H className="mt-4 text-4xl leading-[0.95] font-medium tracking-tighter text-white-ice sm:text-5xl">
            Field notes from testers.
          </H>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            onClick={() => nudge(-1)}
            aria-label="Previous"
            className="rounded-full border border-frost/8 p-3 text-fog transition-all duration-300 hover:border-ice-500/40 hover:text-frost active:scale-95"
          >
            <CaretLeftIcon size={15} weight="bold" />
          </button>
          <button
            onClick={() => nudge(1)}
            aria-label="Next"
            className="rounded-full border border-frost/8 p-3 text-fog transition-all duration-300 hover:border-ice-500/40 hover:text-frost active:scale-95"
          >
            <CaretRightIcon size={15} weight="bold" />
          </button>
        </div>
      </div>

      <div
        ref={rail}
        style={{
          /* keeps the first card flush with the max-w-7xl content edge,
             while the rail itself still bleeds to the viewport */
          paddingInlineStart: "max(1rem, calc((100vw - 80rem) / 2 + 1.5rem))",
        }}
        className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {CARRIERS.map((c, i) => (
          <motion.figure
            key={c.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: (i % 3) * 0.08,
            }}
            className="glass-edge flex w-[82vw] shrink-0 snap-start flex-col justify-between rounded-[1.75rem] bg-paper/75 p-7 backdrop-blur-sm sm:w-[27rem]"
          >
            <blockquote className="text-lg leading-snug tracking-tight text-frost">
              &ldquo;{c.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-3 border-t border-frost/8 pt-6">
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br ${c.tint} font-mono text-xs`}
              >
                {c.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm text-white-ice">
                  {c.name}
                </span>
                <span className="block font-mono text-[11px] text-fog">
                  {c.role} — {c.city}
                </span>
              </span>
            </figcaption>
          </motion.figure>
        ))}

        <div className="w-2 shrink-0 sm:w-6" />
      </div>
    </section>
  );
}
