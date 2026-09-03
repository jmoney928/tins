"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon, PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { useCart } from "./cart/cart-context";
import { ProductArt } from "./product-art";
import { BUNDLE_SAVING, CATALOG, bundlePair, money, moneyExact } from "@/lib/catalog";

type State = "idle" | "adding" | "added";

/**
 * The tin-and-pack offer, stated the way a shopper would repeat it.
 *
 * The offer was true, and fully explained, and still close to unusable. It
 * was written as a mechanism — a $49.99 tin, a $19.99 pack, $9.99 off, and
 * shipping waived over $55 — which is four figures and two rules, and asks a
 * shopper to do the sum before they can tell whether it is worth taking.
 * Nobody does that sum. Most met no offer at all.
 *
 * Set against the only alternative they have, all of it collapses into one
 * comparison: the tin on its own is $57.99 delivered, the tin with three
 * packs is $59.99 delivered. Two totals, and the packs cost two dollars. The
 * mechanism is still here, once, underneath — as the reason the number is
 * what it is rather than as the thing to be worked out.
 *
 * Both totals rather than the difference alone, deliberately. Two dollars is
 * only the step for a single tin: a second tin already clears the free
 * shipping threshold, so the pack costs its usual ten from there. Printing
 * both figures scopes the claim to the case it is true for, instead of
 * leaving a headline that quietly stops applying.
 *
 * Prices come from the local catalogue rather than the live Shopify figures
 * the product page is handed, which is the same source the bag totals from —
 * so this card and the bag can never disagree with each other.
 */
export function BundleCard({
  /** "page" carries the full frame; "drawer" is the flatter version for the bag */
  variant = "page",
  className = "",
}: {
  variant?: "page" | "drawer";
  className?: string;
}) {
  const cart = useCart();
  const pack = CATALOG["chillcore-3"];
  const [state, setState] = useState<State>("idle");
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  // The offer renders on the server in its selling state and only changes for
  // the minority who already hold both halves, so it sits in the initial HTML
  // rather than appearing after hydration.
  const hasPack = cart.ready && cart.lines.some((l) => l.id === "chillcore-3");
  const hasTin = cart.ready && cart.lines.some((l) => l.id === "ice-tin");

  const pair = bundlePair();

  const add = () => {
    if (state !== "idle") return;
    setState("adding");
    cart.add("chillcore-3");
    timers.current.push(
      window.setTimeout(() => setState("added"), 420),
      window.setTimeout(() => setState("idle"), 2400),
    );
  };

  const compact = variant === "drawer";
  const done = hasPack && hasTin;

  // The offer and its confirmation swap with a short crossfade rather than a
  // cut: the shopper has just pressed the button, and the thing they pressed
  // turning into the sentence that says what it did is the receipt.
  const swap = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
    transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] as const },
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {done ? (
        // both halves present: confirm what it cost, stop selling it
        <motion.div
          key="done"
          {...swap}
          className={`flex items-start gap-2.5 rounded-2xl border border-ice-500/25 bg-ice-100/70 px-4 py-3 ${className}`}
        >
          <CheckIcon size={15} weight="bold" className="mt-0.5 shrink-0 text-ice-700" />
          <p className="text-sm leading-relaxed text-ice-700">
            <span className="font-medium">Packs added.</span> Shipping is free and{" "}
            {money(BUNDLE_SAVING)} is off, so the three-pack added {money(pair.step)}{" "}
            to this order.
          </p>
        </motion.div>
      ) : (
    <motion.div
      key="offer"
      {...swap}
      className={`rounded-[1.5rem] border border-ice-500/25 bg-ice-100/60 ${
        compact ? "p-4" : "p-5 sm:p-6"
      } ${className}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`shrink-0 overflow-hidden rounded-2xl bg-ink ${
            compact ? "h-14 w-14" : "h-16 w-16 sm:h-20 sm:w-20"
          }`}
        >
          <ProductArt product={pack} sizes="80px" className="h-full w-full" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] tracking-[0.2em] text-ice-700 uppercase">
            Add to your order
          </p>
          <p className="mt-1.5 text-[15px] leading-tight font-medium text-white-ice">
            Three spare ice packs for {money(pair.step)}
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-frost">
            One pack ships inside the tin. A three-pack means one is always
            frozen and ready to swap in.
          </p>
        </div>
      </div>

      {/* the offer itself: two totals, both delivered, nothing to work out */}
      <dl className="mt-4 border-t border-ice-500/15 pt-3">
        <div className="flex items-baseline justify-between gap-4 py-1">
          <dt className="text-sm text-fog">The tin on its own</dt>
          <dd className="shrink-0 font-mono text-sm text-fog">
            {moneyExact(pair.alone)} delivered
          </dd>
        </div>
        <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-ice-500/10 pt-2">
          <dt className="text-sm font-medium text-white-ice">
            The tin and three packs
          </dt>
          <dd className="shrink-0 font-mono text-lg text-white-ice">
            {moneyExact(pair.total)} delivered
          </dd>
        </div>
      </dl>

      {/* the mechanism, once, as the reason rather than the puzzle */}
      <p className="mt-2.5 text-xs leading-relaxed text-fog">
        Ordered together the pair ships free and {money(BUNDLE_SAVING)} comes
        off, which is how a {money(pair.pack)} three-pack adds {money(pair.step)}.
      </p>

      <button
        onClick={add}
        disabled={state !== "idle"}
        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-all duration-300 ease-[var(--ease-glide)] active:scale-[0.98] ${
          state === "added" ? "bg-ice-500 text-paper" : "bg-ink text-paper hover:bg-ice-700"
        }`}
      >
        {state === "adding" ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-paper/35 border-t-paper" />
            Adding
          </>
        ) : state === "added" ? (
          <>
            <CheckIcon size={14} weight="bold" />
            Packs added
          </>
        ) : (
          <>
            <PlusIcon size={14} weight="bold" />
            {hasTin
              ? `Add the packs — ${moneyExact(pair.total)} delivered`
              : "Add the three-pack"}
          </>
        )}
      </button>
    </motion.div>
      )}
    </AnimatePresence>
  );
}
