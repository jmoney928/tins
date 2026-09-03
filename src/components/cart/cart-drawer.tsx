"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  XIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
  ArrowRightIcon,
  SnowflakeIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useCart } from "./cart-context";
import { ProductArt } from "../product-art";
import { BundleCard } from "../bundle-card";
import { SHIPPING_FLAT, money, moneyExact } from "@/lib/catalog";
import { AnimatedMoney } from "../animated-money";

const GLIDE = [0.16, 1, 0.3, 1] as const;

export function CartDrawer() {
  const cart = useCart();
  const { drawerOpen, closeDrawer } = cart;

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

  // free shipping is earned by the pair, so the bag offers the missing half
  // as something to add rather than a number to work out. The card stays
  // once the pack is in — it turns into the line confirming what the pair
  // cost, which is the last thing read before the checkout button.
  const showOffer = !cart.freeShippingPromo && cart.lines.some((l) => l.id === "ice-tin");

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
            <header className="flex items-center justify-between border-b border-frost/8 px-6 py-5">
              <p className="font-mono text-[11px] tracking-[0.28em] text-fog uppercase">
                Your bag
                {cart.count > 0 && (
                  <span className="ml-2 text-ice-700">({cart.count})</span>
                )}
              </p>
              <button
                onClick={closeDrawer}
                aria-label="Close bag"
                className="rounded-full border border-frost/10 p-2 text-fog transition-colors duration-300 hover:text-frost"
              >
                <XIcon size={15} weight="bold" />
              </button>
            </header>

            {cart.lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-10 text-center">
                <SnowflakeIcon size={30} weight="thin" className="text-ice-500" />
                <p className="text-lg tracking-tight text-white-ice">
                  Your bag is empty.
                </p>
                <p className="max-w-[30ch] text-sm leading-relaxed text-fog">
                  Add a tin to begin. Shipped worldwide from Vancouver,
                  British Columbia.
                </p>
                <button
                  onClick={closeDrawer}
                  className="mt-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors duration-300 hover:bg-ice-700"
                >
                  View the tin
                </button>
              </div>
            ) : (
              <>
                {cart.freeShippingPromo && (
                  <div className="mx-6 mt-5 flex items-center gap-2.5 rounded-2xl border border-ice-500/25 bg-ice-100 px-4 py-3">
                    <SnowflakeIcon size={16} weight="fill" className="shrink-0 text-ice-700" />
                    <p className="text-sm text-ice-700">
                      <span className="font-medium">Free shipping, today only</span> — already
                      applied at checkout.
                    </p>
                  </div>
                )}

                <ul className="flex-1 divide-y divide-frost/8 overflow-y-auto px-6">
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
                        <ProductArt
                          product={line.product}
                          sizes="80px"
                          className="h-full w-full"
                        />
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
                        <p className="mt-1 truncate text-xs text-fog">
                          {line.product.tagline}
                        </p>

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

                {/* the upsell sits above the totals rather than inside them:
                    it changes three of the four lines below, so a shopper
                    should meet it before reading a total it would alter */}
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

                <footer className="border-t border-frost/8 px-6 py-6">
                  {/* silent while the card above is showing, which already says
                      shipping is free on the pair — stacked twice it read as a
                      nag rather than an offer */}
                  {!showOffer && (
                    <p className="mb-4 font-mono text-[11px] tracking-[0.14em] text-ice-700 uppercase">
                      {cart.freeShippingPromo
                        ? "Free shipping unlocked — today only"
                        : cart.freeShipping
                          ? "Free shipping unlocked"
                          : `${money(SHIPPING_FLAT)} shipping — free with a tin and a pack`}
                    </p>
                  )}

                  {/* every figure here rolls to its new value, and the saving
                      line slides in when the pair is completed — the total
                      has to be seen to change in response to the offer */}
                  <dl className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between text-fog">
                      <dt>Subtotal</dt>
                      <AnimatedMoney cents={cart.subtotal} className="font-mono tabular-nums" />
                    </div>
                    <AnimatePresence initial={false}>
                      {cart.saving > 0 && (
                        <motion.div
                          key="saving"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: GLIDE }}
                          className="overflow-hidden"
                        >
                          <div className="flex justify-between text-ice-700">
                            <dt>Tin + pack saving</dt>
                            <dd className="font-mono tabular-nums">−{moneyExact(cart.saving)}</dd>
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

                  <Link
                    href="/checkout"
                    onClick={closeDrawer}
                    className="group mt-5 flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-sm font-medium text-paper transition-colors duration-300 hover:bg-ice-700 active:scale-[0.98]"
                  >
                    Checkout
                    <ArrowRightIcon
                      size={14}
                      weight="bold"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
