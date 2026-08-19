"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckIcon,
  LockSimpleIcon,
  MinusIcon,
  PackageIcon,
  PlusIcon,
  ShieldCheckIcon,
  SnowflakeIcon,
  TruckIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useCart } from "../cart/cart-context";
import { ProductArt } from "../product-art";
import {
  CATALOG,
  CURRENCY_LABEL,
  FREE_SHIPPING_OVER,
  SHIPPING_FLAT,
  freeShippingToday,
  tinOnSale,
  currentPrice,
  money,
} from "@/lib/catalog";
import { dispatchSentence } from "@/lib/fulfilment";
import { GuaranteeLine } from "../guarantee";
import { ReviewBadge } from "../review-badge";

type State = "idle" | "adding" | "added";

/**
 * Gallery, quantity, and the add-to-bag flow — plus the sticky mobile bar
 * that reappears once the main button scrolls out of view. On a page built
 * to be landed on mid-scroll from an ad, the CTA has to be reachable from
 * anywhere, not just the top.
 */
export function TinBuyBox({ remaining }: { remaining: number | null }) {
  const product = CATALOG["ice-tin"];
  const cart = useCart();
  const router = useRouter();
  const [shot, setShot] = useState(0);
  const [qty, setQty] = useState(1);
  const [state, setState] = useState<State>("idle");
  const [buying, setBuying] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(true);
  const ctaRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setCtaVisible(entry.isIntersecting), {
      rootMargin: "-64px 0px 0px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const add = () => {
    if (state !== "idle") return;
    setState("adding");
    cart.add(product.id, qty);
    timers.current.push(
      window.setTimeout(() => {
        setState("added");
        cart.openDrawer();
      }, 420),
      window.setTimeout(() => setState("idle"), 2200),
    );
  };

  const buyNow = () => {
    if (buying) return;
    setBuying(true);
    cart.add(product.id, qty);
    router.push("/checkout");
  };

  const promoToday = freeShippingToday();
  const onSale = tinOnSale();
  const unitPrice = currentPrice(product.id);
  const clearsFreeShipping = unitPrice * qty >= FREE_SHIPPING_OVER;

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-start lg:gap-14">
        {/* gallery */}
        <div>
          <div className="overflow-hidden rounded-[1.75rem] bg-ink sm:rounded-[2rem]">
            <ProductArt
              product={product}
              src={product.gallery[shot]}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="aspect-square w-full"
            />
          </div>
          {/* wraps rather than scrolls: eight thumbnails overflow the column
              on every viewport, and a hidden thumbnail is a photo nobody
              looks at */}
          <div className="mt-3 flex flex-wrap gap-2.5">
            {product.gallery.map((g, i) => (
              <button
                key={g}
                onClick={() => setShot(i)}
                aria-label={`View image ${i + 1}`}
                className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-ink transition-all duration-300 sm:h-[4.5rem] sm:w-[4.5rem] ${
                  i === shot ? "ring-2 ring-ice-500 ring-offset-2" : "opacity-55 hover:opacity-90"
                }`}
              >
                <ProductArt product={product} src={g} sizes="72px" className="h-full w-full" />
              </button>
            ))}
          </div>
        </div>

        {/* buy box */}
        <div>
          {onSale && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-ice-500 px-4 py-2 font-mono text-[11px] tracking-[0.16em] text-paper uppercase">
              <SnowflakeIcon size={13} weight="fill" />
              Launch price {money(unitPrice)} — reg. {money(product.price)}
            </div>
          )}

          {remaining !== null && (
            <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-ice-700 uppercase">
              <span className="animate-breathe h-1.5 w-1.5 rounded-full bg-ice-500" />
              {remaining > 0 ? `${remaining} in stock` : "Out of stock"}
            </p>
          )}

          <h1 className="mt-3 text-4xl leading-[0.95] font-medium tracking-tighter text-white-ice sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-2.5 text-sm text-fog">{product.tagline}</p>
          <ReviewBadge className="mt-3" />

          <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-frost">
            {product.blurb}
          </p>

          <ul className="mt-6 grid grid-cols-1 gap-2.5 border-t border-frost/8 pt-6 sm:grid-cols-2">
            {product.points.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm text-frost">
                <CheckIcon size={14} weight="bold" className="mt-0.5 shrink-0 text-ice-500" />
                {p}
              </li>
            ))}
          </ul>

          {/* the deadline is stated once, at the top of this column — repeating
              it over the price only made the offer look like it was pleading */}
          <div ref={ctaRef} className="mt-8 border-t border-frost/8 pt-7">
            <div className="flex items-baseline gap-2.5">
              {onSale && (
                <span className="font-mono text-lg text-fog line-through decoration-fog/50">
                  {money(product.price * qty)}
                </span>
              )}
              <span className="font-mono text-3xl tracking-tight text-white-ice">
                {money(unitPrice * qty)}
              </span>
              <span className="text-xs text-fog">{CURRENCY_LABEL}</span>
            </div>

            <div className="mt-4 flex items-stretch gap-3">
              <div className="flex items-center rounded-full border border-frost/12">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="One fewer"
                  className="px-4 py-3.5 text-fog transition-colors hover:text-frost"
                >
                  <MinusIcon size={14} weight="bold" />
                </button>
                <span className="min-w-8 text-center font-mono text-sm text-frost">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(99, q + 1))}
                  aria-label="One more"
                  className="px-4 py-3.5 text-fog transition-colors hover:text-frost"
                >
                  <PlusIcon size={14} weight="bold" />
                </button>
              </div>

              <button
                onClick={add}
                disabled={state !== "idle"}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-all duration-300 ease-[var(--ease-glide)] active:scale-[0.98] ${
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
                    In bag
                  </>
                ) : (
                  "Add to bag"
                )}
              </button>
            </div>

            <button
              onClick={buyNow}
              disabled={buying}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-frost/15 px-6 py-3.5 text-sm font-medium text-frost transition-all duration-300 ease-[var(--ease-glide)] hover:border-ice-500/50 hover:bg-slate-deep/40 active:scale-[0.98] disabled:opacity-70"
            >
              {buying ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-frost/35 border-t-frost" />
              ) : null}
              {buying ? "Taking you to checkout" : "Checkout now"}
            </button>

            <p className="mt-3 flex items-center gap-1.5 text-xs text-fog">
              <TruckIcon size={13} weight="light" />
              {promoToday
                ? "Free shipping today — already applied."
                : clearsFreeShipping
                  ? "Free shipping — this order qualifies."
                  : `${money(SHIPPING_FLAT)} flat shipping, free over ${money(FREE_SHIPPING_OVER)}.`}
            </p>
            {/* the guarantee sits with the button, not on a policy page:
                this is the moment the doubt actually occurs */}
            <GuaranteeLine className="mt-3" />
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-fog">
              <ShieldCheckIcon size={13} weight="light" />
              Lifetime warranty on the shell.
            </p>
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-fog">
              <LockSimpleIcon size={13} weight="fill" />
              Secure checkout via Stripe — card details never touch our servers.
            </p>
            <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-fog">
              <PackageIcon size={13} weight="light" className="mt-0.5 shrink-0" />
              {dispatchSentence()}
            </p>
          </div>
        </div>
      </div>

      {/* sticky mobile bar — the safety net once the real button is gone */}
      <AnimatePresence>
        {!ctaVisible && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
            className="glass-edge fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 bg-paper/95 px-4 py-3 backdrop-blur-xl sm:hidden"
            style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-fog">{product.name}</p>
              <p className="flex items-baseline gap-2 font-mono text-base tracking-tight text-white-ice">
                {onSale && (
                  <span className="text-xs text-fog line-through decoration-fog/50">
                    {money(product.price * qty)}
                  </span>
                )}
                {money(unitPrice * qty)}
              </p>
            </div>
            <button
              onClick={add}
              disabled={state !== "idle"}
              className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-all duration-300 active:scale-[0.97] ${
                state === "added" ? "bg-ice-500 text-paper" : "bg-ink text-paper"
              }`}
            >
              {state === "added" ? (
                <>
                  <CheckIcon size={14} weight="bold" />
                  In bag
                </>
              ) : (
                "Add to bag"
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
