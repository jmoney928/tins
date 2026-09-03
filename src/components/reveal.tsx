"use client";

import { createElement, useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type Tag = "div" | "section" | "li" | "figure" | "article" | "dl" | "ul" | "ol";

/**
 * Scroll reveal for content below the fold.
 *
 * The element ships in the server HTML with `data-reveal=""`, which the
 * stylesheet holds at zero opacity and a few pixels low. On mount it is either
 * shown at once (already on screen) or handed to an IntersectionObserver that
 * flips the attribute to "in" the first time it enters the viewport. The
 * transition lives in CSS, so the reveal costs one attribute write per
 * element and never touches React state.
 *
 * Two things keep this from ever hiding content:
 *   - a <noscript> style in the root layout shows everything when scripts are
 *     off, and the stylesheet carries a delayed fallback animation that shows
 *     everything if hydration never arrives;
 *   - prefers-reduced-motion disables the hidden state entirely.
 *
 * Never wrap an ancestor of a sticky or fixed element: the transform that
 * lifts the content in makes the wrapper their containing block while it
 * runs.
 */
export function Reveal({
  as = "div",
  delay = 0,
  className,
  children,
}: {
  as?: Tag;
  /** stagger, in milliseconds */
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.reveal = "in";
      return;
    }

    // already on screen: show now rather than after an observer round-trip
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      el.dataset.reveal = "in";
      return;
    }

    el.dataset.reveal = "armed";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.reveal = "in";
        io.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return createElement(
    as,
    {
      ref,
      "data-reveal": "",
      className,
      style: delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined,
    },
    children,
  );
}
