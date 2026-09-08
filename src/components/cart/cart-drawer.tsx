"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  XIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
  WarningCircleIcon,
  SnowflakeIcon,
  ShieldCheckIcon,
  WrenchIcon,
  LockSimpleIcon,
  TimerIcon,
  TagIcon,
  CheckIcon,
  ArrowCounterClockwiseIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useCart, HOLD_MINUTES } from "./cart-context";
import { useExpressCheckout } from "./use-express-checkout";
import { ExpressButton } from "../express-button";
import { PreorderNote } from "../preorder-note";
import { ProductArt } from "../product-art";
import { BundleCard } from "../bundle-card";
import { FREE_SHIPPING_OVER, money, moneyExact } from "@/lib/catalog";
import { GUARANTEE_DAYS } from "@/lib/guarantee";
import { AnimatedMoney } from "../animated-money";

const GLIDE = [0.16, 1, 0.3, 1] as const;

/**
 * The hold, counting down.
 *
 * It is real: when it reaches zero the bag is released and offered back with
 * one tap. A countdown that did nothing at zero would be decoration, and a
 * shopper who tests it — they do — would learn the drawer lies.
 */
function HoldTimer({ until }: { until: number }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  const left = Math.max(0, until - now);
  const m = Math.floor(left / 60_000);
  const s = Math.floor((left % 60_000) / 1000);
  const urgent = left < 3 * 60_000;
  return (
    <span
      className={`flex items-center gap-1.5 font-mono text-[11px] tracking-[0.12em] tabular-nums ${
        urgent ? "text-[#a33e37]" : "text-ice-700"
      }`}
      title={`Your bag is held for ${HOLD_MINUTES} minutes`}
    >
      <TimerIcon size={13} weight={urgent ? "fill" : "regular"} />
      HELD {m}:{String(s).padStart(2, "0")}
    </span>
  );
}

/** The three things a buyer wants to be sure of, at the last step. */
function TrustStrip() {
  return (
    <ul className="grid grid-cols-3 gap-2 border-b border-frost/8 px-6 py-4">
      {[
        [ShieldCheckIcon, `${GUARANTEE_DAYS}-day cold-or-refund`],
        [WrenchIcon, "Lifetime shell warranty"],
        [LockSimpleIcon, "Encrypted checkout"],
      ].map(([Icon, label]) => {
        const I = Icon as typeof ShieldCheckIcon;
        return (
          <li
            key={label as string}
            className="flex flex-col items-center gap-1.5 text-center text-[11px] leading-tight text-fog"
          >
            <I size={16} weight="light" className="text-ice-500" />
            {label as string}
          </li>
        );
      })}
    </ul>
  );
}

/** How far the bag is from free shipping, as a bar rather than a sum. */
function ShippingProgress({ subtotal, toGo, unlocked }: { subtotal: number; toGo: number; unlocked: boolean }) {
  const pct = unlocked ? 100 : Math.min(100, Math.round((subtotal / FREE_SHIPPING_OVER) * 100));
  return (
    <div className="border-b border-frost/8 px-6 py-4">
      <p className="flex items-center justify-between text-xs">
        <span className={unlocked ? "font-medium text-ice-700" : "text-frost"}>
          {unlocked ? (
            <span className="flex items-center gap-1.5">
              <CheckIcon size={12} weight="bold" />
              Free shipping unlocked
            </span>
          ) : (
            <>
              Add <span className="font-medium text-white-ice">{money(toGo)}</span> more for
              free shipping
            </>
          )}
        </span>
        <span className="font-mono text-[10px] tracking-[0.12em] text-fog uppercase">
          {money(FREE_SHIPPING_OVER)}
        </span>
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-frost/10">
        <motion.div
          className={`h-full rounded-full ${unlocked ? "bg-ice-500" : "bg-ice-300"}`}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: GLIDE }}
        />
      </div>
    </div>
  );
}

/** Type a code, see Shopify's own figure for what it takes off. */
function CodeField() {
  const cart = useCart();
  const [draft, setDraft] = useState("");
  const code = cart.code;

  if (code?.status === "applied") {
    return (
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-ice-500/25 bg-ice-100/70 px-4 py-3">
        <p className="flex items-center gap-2 text-sm text-ice-700">
          <TagIcon size={14} weight="fill" />
          <span className="font-mono tracking-wide">{code.code}</span>
          <span>applied</span>
        </p>
        <button
          onClick={cart.removeCode}
          aria-label={`Remove code ${code.code}`}
          className="font-mono text-[10px] tracking-[0.14em] text-fog uppercase transition-colors hover:text-[#a33e37]"
        >
          Remove
        </button>
      </div>
    );
  }

  const checking = code?.status === "checking";
  const problem = code?.status === "invalid" || code?.status === "unverified" ? code.reason : "";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        cart.applyCode(draft);
      }}
    >
      <label htmlFor="bag-code" className="sr-only">
        Discount code
      </label>
      <div className="flex gap-2">
        <input
          id="bag-code"
          value={draft}
          onChange={(e) => setDraft(e.target.value.toUpperCase())}
          placeholder="Discount code"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          /* 16px: iOS zooms the viewport for a focused field under that */
          className="min-h-11 min-w-0 flex-1 rounded-full border border-frost/12 bg-paper/70 px-4 font-mono text-base tracking-wide text-frost uppercase outline-none transition-colors placeholder:font-sans placeholder:text-sm placeholder:normal-case placeholder:text-fog/60 focus:border-ice-500/60"
        />
        <button
          type="submit"
          disabled={checking || !draft.trim()}
          className="min-h-11 shrink-0 rounded-full border border-frost/15 px-5 text-sm font-medium text-frost transition-all duration-300 hover:border-ice-500/50 hover:bg-slate-deep/40 disabled:opacity-50"
        >
          {checking ? "Checking" : "Apply"}
        </button>
      </div>
      {problem && (
        <p role="alert" className="mt-2 text-xs text-[#a33e37]">
          {problem}
        </p>
      )}
    </form>
  );
}

export function CartDrawer() {
  const cart = useCart();
  const { drawerOpen, closeDrawer } = cart;
  const { go, busy, error } = useExpressCheckout();

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeDrawer]);

  // the card stays once the pack is in — it turns into the line confirming
  // what the pair cost, which is the last thing read before checkout
  const showOffer = !cart.freeShippingPromo && cart.lines.some((l) => l.id === "ice-tin");
  const codeApplied = cart.code?.status === "applied";

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-[60] bg-ink/25 backdrop-blur-sm"
          />

          <motion.aside
            role="dialog"
            aria-label="Bag"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 220, damping: 30 }}
            className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col border-l border-frost/10 bg-paper shadow-2xl"
          >
            <header className="flex items-center justify-between gap-4 border-b border-frost/8 px-6 py-5">
              <p className="font-mono text-[11px] tracking-[0.28em] text-fog uppercase">
                Your bag
                {cart.count > 0 && <span className="ml-2 text-ice-700">({cart.count})</span>}
              </p>
              <div className="flex items-center gap-4">
                {cart.holdUntil !== null && cart.lines.length > 0 && (
                  <HoldTimer until={cart.holdUntil} />
                )}
                <button
                  onClick={closeDrawer}
                  aria-label="Close bag"
                  className="rounded-full border border-frost/10 p-2 text-fog transition-colors duration-300 hover:text-frost"
                >
                  <XIcon size={15} weight="bold" />
                </button>
              </div>
            </header>

            {cart.lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-10 text-center">
                <SnowflakeIcon size={30} weight="thin" className="text-ice-500" />
                {cart.released ? (
                  <>
                    <p className="text-lg tracking-tight text-white-ice">
                      Your hold ran out.
                    </p>
                    <p className="max-w-[30ch] text-sm leading-relaxed text-fog">
                      The bag was released after {HOLD_MINUTES} minutes. It is one tap to
                      bring it back.
                    </p>
                    <button
                      onClick={cart.restore}
                      className="mt-2 flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors duration-300 hover:bg-ice-700"
                    >
                      <ArrowCounterClockwiseIcon size={14} weight="bold" />
                      Restore my bag
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-lg tracking-tight text-white-ice">Your bag is empty.</p>
                    <p className="max-w-[30ch] text-sm leading-relaxed text-fog">
                      Add a tin to begin. Shipped worldwide from Vancouver, British Columbia.
                    </p>
                    <button
                      onClick={closeDrawer}
                      className="mt-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors duration-300 hover:bg-ice-700"
                    >
                      View the tin
                    </button>
                  </>
                )}
              </div>
            ) : (
              <>
                {/* Everything between the header and the checkout button scrolls
                    as one, so nothing in the middle can be squeezed away. */}
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <TrustStrip />

                  {cart.freeShippingPromo ? (
                    <div className="mx-6 mt-5 flex items-center gap-2.5 rounded-2xl border border-ice-500/25 bg-ice-100 px-4 py-3">
                      <SnowflakeIcon size={16} weight="fill" className="shrink-0 text-ice-700" />
                      <p className="text-sm text-ice-700">
                        <span className="font-medium">Free shipping, today only</span> — already
                        applied at checkout.
                      </p>
                    </div>
                  ) : (
                    <ShippingProgress
                      subtotal={cart.subtotal}
                      toGo={cart.toFreeShipping}
                      unlocked={cart.freeShipping}
                    />
                  )}

                  <ul className="divide-y divide-frost/8 px-6">
                    <AnimatePresence initial={false}>
                      {cart.lines.map((line) => (
                        <motion.li
                          key={line.id}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0, borderTopWidth: 0 }}
                          transition={{ duration: 0.32, ease: GLIDE }}
                          className="flex gap-4 overflow-hidden py-6"
                        >
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-ink">
                            <ProductArt product={line.product} sizes="80px" className="h-full w-full" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="text-sm leading-tight text-white-ice">
                                {line.product.name}
                              </h3>
                              <AnimatedMoney
                                cents={line.total}
                                className="shrink-0 font-mono text-sm text-white-ice tabular-nums"
                              />
                            </div>
                            <p className="mt-1 truncate text-xs text-fog">{line.product.tagline}</p>

                            <div className="mt-3 flex items-center gap-3">
                              <div className="flex items-center rounded-full border border-frost/12">
                                <button
                                  onClick={() => cart.setQty(line.id, line.qty - 1)}
                                  aria-label={`One fewer ${line.product.name}`}
                                  className="px-2.5 py-1.5 text-fog transition-colors hover:text-frost"
                                >
                                  <MinusIcon size={12} weight="bold" />
                                </button>
                                <span className="min-w-6 text-center font-mono text-xs text-frost">
                                  {line.qty}
                                </span>
                                <button
                                  onClick={() => cart.setQty(line.id, line.qty + 1)}
                                  aria-label={`One more ${line.product.name}`}
                                  className="px-2.5 py-1.5 text-fog transition-colors hover:text-frost"
                                >
                                  <PlusIcon size={12} weight="bold" />
                                </button>
                              </div>

                              <button
                                onClick={() => cart.remove(line.id)}
                                className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] text-fog uppercase transition-colors hover:text-[#a33e37]"
                              >
                                <TrashIcon size={12} weight="bold" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>

                  {/* the upsell sits above the totals: it changes three of the
                      lines below, so a shopper meets it before the total */}
                  <AnimatePresence initial={false}>
                    {showOffer && (
                      <motion.div
                        key="offer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.36, ease: GLIDE }}
                        className="shrink-0 overflow-hidden"
                      >
                        <div className="border-t border-frost/8 px-6 pt-5">
                          <BundleCard variant="drawer" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="border-t border-frost/8 px-6 pt-5">
                    <CodeField />
                  </div>

                  <div className="px-6 py-6">
                    <dl className="flex flex-col gap-2 text-sm">
                      <div className="flex justify-between text-fog">
                        <dt>Subtotal</dt>
                        <AnimatedMoney cents={cart.subtotal} className="font-mono tabular-nums" />
                      </div>
                      <AnimatePresence initial={false}>
                        {cart.discount > 0 && (
                          <motion.div
                            key={codeApplied ? "code" : "saving"}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: GLIDE }}
                            className="overflow-hidden"
                          >
                            <div className="flex justify-between text-ice-700">
                              <dt>
                                {codeApplied ? (
                                  <>
                                    You save{" "}
                                    <span className="font-mono text-xs tracking-wide">
                                      ({cart.code && "code" in cart.code ? cart.code.code : ""})
                                    </span>
                                  </>
                                ) : (
                                  "Tin + pack saving"
                                )}
                              </dt>
                              <AnimatedMoney
                                cents={cart.discount}
                                format={(c) => `−${moneyExact(c)}`}
                                className="font-mono tabular-nums"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="flex justify-between text-fog">
                        <dt>Shipping</dt>
                        <dd className="font-mono tabular-nums">
                          <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span
                              key={cart.shipping === 0 ? "free" : "flat"}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.22, ease: GLIDE }}
                              className="inline-block"
                            >
                              {cart.shipping === 0 ? "Free" : moneyExact(cart.shipping)}
                            </motion.span>
                          </AnimatePresence>
                        </dd>
                      </div>
                      <div className="mt-2 flex justify-between border-t border-frost/8 pt-3 text-white-ice">
                        <dt className="font-medium">Total</dt>
                        <AnimatedMoney cents={cart.total} className="font-mono text-lg tabular-nums" />
                      </div>
                    </dl>
                  </div>
                </div>

                <footer className="shrink-0 border-t border-frost/8 px-6 py-5">
                  <PreorderNote className="mb-3" />
                  <ExpressButton
                    className=""
                    busy={busy}
                    label={`Checkout — ${moneyExact(cart.total)}`}
                    onClick={() => void go()}
                  />
                  {error && (
                    <p
                      role="alert"
                      className="mt-3 flex items-start gap-2 rounded-2xl border border-[#b4463f]/30 bg-[#b4463f]/8 px-4 py-3 text-sm text-[#a33e37]"
                    >
                      <WarningCircleIcon size={15} weight="fill" className="mt-0.5 shrink-0" />
                      {error}
                    </p>
                  )}
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
