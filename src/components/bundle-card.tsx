"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { useCart } from "./cart/cart-context";
import { ProductArt } from "./product-art";
import { BUNDLE_SAVING, CATALOG, bundlePair, money } from "@/lib/catalog";

type State = "idle" | "adding" | "added";

/**
 * The tin-and-pack offer, made legible and actionable in one block.
 *
 * Before this, the offer was spread across three surfaces as prose — "$9.99
 * off and free shipping" under a CTA, a sentence on the shop card, a line in
 * the bag — and never once totalled. A shopper had to hold four numbers in
 * their head to work out that the pair costs $59.99 rather than $77.98. Most
 * will not, so most never saw an offer at all.
 *
 * Two rules it follows:
 *
 *   It states the total, not just the deduction. "Save $9.99" is a discount;
 *   "$77.98 → $59.99" is a decision a buyer can make without arithmetic.
 *
 *   It never claims the offer is applied when it is not. Once the pack is in
 *   the bag it stops selling and confirms, because a panel still asking for
 *   something the shopper has already done reads as broken.
 *
 * Prices come from the local catalogue rather than the live Shopify figures
 * the product page is handed, which is the same source the bag itself totals
 * from — so this card and the bag can never disagree with each other. If the
 * two ever diverge from Shopify, both are wrong together and the checkout
 * response is what corrects them.
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

  // rendered on the server as "not yet added", so hold the offer back until
  // the bag has been read — otherwise it flashes at a shopper who has one
  const hasPack = cart.lines.some((l) => l.id === "chillcore-3");
  const hasTin = cart.lines.some((l) => l.id === "ice-tin");
  if (!cart.ready) return null;

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

  // both halves present: confirm the saving, stop selling it
  if (hasPack && hasTin) {
    return (
      <div
        className={`flex items-start gap-2.5 rounded-2xl border border-ice-500/25 bg-ice-100/70 px-4 py-3 ${className}`}
      >
        <CheckIcon size={15} weight="bold" className="mt-0.5 shrink-0 text-ice-700" />
        <p className="text-sm leading-relaxed text-ice-700">
          <span className="font-medium">Pair applied.</span>{" "}
          {money(BUNDLE_SAVING)} off and free shipping — {money(pair.saving)} less
          than buying the two separately.
        </p>
      </div>
    );
  }

  const compact = variant === "drawer";

  return (
    <div
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
            Buy the pair
          </p>
          <p className="mt-1.5 text-[15px] leading-tight font-medium text-white-ice">
            The Ice Tin + {pack.name}
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-frost">
            One pack ships inside the tin. A three-pack means one is always
            frozen and ready to swap in.
          </p>
        </div>
      </div>

      {/* the whole point of this component: the two totals, side by side */}
      <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-ice-500/15 pt-4">
        <span className="font-mono text-sm text-fog line-through decoration-fog/50">
          {money(pair.list)}
        </span>
        <span className="font-mono text-2xl tracking-tight text-white-ice">
          {money(pair.total)}
        </span>
        <span className="rounded-full bg-ice-500 px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-paper uppercase">
          Save {money(pair.saving)}
        </span>
      </div>

      <p className="mt-2 text-xs text-fog">
        {money(pair.tin)} tin + {money(pair.pack)} pack, less {money(BUNDLE_SAVING)}, and
        shipping is free on the pair.
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
            Pack added
          </>
        ) : (
          <>
            <PlusIcon size={14} weight="bold" />
            {hasTin ? `Add the pack — ${money(pair.total)} for both` : "Add the pack"}
          </>
        )}
      </button>
    </div>
  );
}
