"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";

const CARRIERS = [
  {
    name: "Teodor Vahlström",
    role: "Lift mechanic",
    city: "Åre",
    tint: "from-[#3f6f88] to-[#10203a] text-white",
    quote:
      "Summer maintenance season, sun on the toolbox all day. I opened it at four and the pouches were still cold.",
  },
  {
    name: "Marisol Okonkwo",
    role: "Bar manager",
    city: "Chicago",
    tint: "from-[#2e9dc8] to-[#12475f] text-white",
    quote:
      "August in Chicago with no air behind the bar. Still cold at the end of the shift, and the top floor means nothing damp goes in my pocket.",
  },
  {
    name: "Kasper Lindqvist",
    role: "Joiner",
    city: "Gothenburg",
    tint: "from-[#7f9bab] to-[#2b4055] text-white",
    quote:
      "Four months in a jeans pocket and it still lands on the same stop every time I close it.",
  },
  {
    name: "Nadia Bergsson",
    role: "Dock hand",
    city: "Reykjavík",
    tint: "from-[#8fd2e8] to-[#3f6f88] text-white",
    quote:
      "Freeze a pack overnight, swap it in the morning. Took a week to make it a habit, then I stopped thinking about it.",
  },
  {
    name: "Emile Haugerud",
    role: "Sound engineer",
    city: "Oslo",
    tint: "from-[#1d7ba1] to-[#0f3d52] text-white",
    quote:
      "Six or seven opens a day since spring and the threads still feel smooth.",
  },
];


export function Carriers() {
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
          <h2 className="mt-4 text-4xl leading-[0.95] font-medium tracking-tighter text-white-ice sm:text-5xl">
            Tested
            <span className="text-fog"> before you get one.</span>
          </h2>
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
