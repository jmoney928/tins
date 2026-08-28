"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ListIcon, XIcon, HandbagIcon } from "@phosphor-icons/react/dist/ssr";
import { Magnetic } from "./magnetic";
import { useCart } from "./cart/cart-context";
import { BrandMark } from "./brand-mark";
import { ShopMenu } from "./shop-menu";

const LINKS = [
  { label: "Shop", href: "/products/ice-tin" },
  { label: "Cold system", href: "/cold-system" },
  { label: "Build", href: "/build" },
  { label: "Field notes", href: "/field-notes" },
  { label: "Guarantee", href: "/guarantee" },
];

export function SiteNav() {
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const { scrollY } = useScroll();
  const cart = useCart();

  useMotionValueEvent(scrollY, "change", (v) => setCondensed(v > 40));

  /**
   * Closing is delayed by a beat so the cursor can cross the gap between the
   * "Shop" link and the panel below it without the menu vanishing mid-travel
   * — the usual reason hover menus feel broken.
   */
  const closeTimer = useRef<number | undefined>(undefined);
  const openShop = () => {
    window.clearTimeout(closeTimer.current);
    setShopOpen(true);
  };
  const closeShop = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setShopOpen(false), 140);
  };

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // hover is not available to everyone, so the panel also answers to Escape
  useEffect(() => {
    if (!shopOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShopOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shopOpen]);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6 sm:pt-5"
        onMouseLeave={closeShop}
      >
        <nav
          className={`mx-auto flex max-w-7xl items-center gap-6 rounded-full px-5 py-3 transition-all duration-500 ease-[var(--ease-glide)] sm:px-6 ${
            condensed
              ? "glass-edge bg-abyss/65 backdrop-blur-xl"
              : "border border-transparent"
          }`}
        >
          <a href="#top" aria-label="Ice Tins Supply Co., home">
            <BrandMark size={30} />
          </a>

          <ul className="ml-auto hidden items-center gap-8 md:flex">
            {LINKS.map((l) => {
              const isShop = l.href === "/products/ice-tin";
              return (
                <li
                  key={l.href}
                  onMouseEnter={isShop ? openShop : closeShop}
                  onFocus={isShop ? openShop : closeShop}
                >
                  <a
                    href={l.href}
                    {...(isShop
                      ? { "aria-haspopup": true, "aria-expanded": shopOpen }
                      : {})}
                    className="group relative text-sm text-fog transition-colors duration-300 hover:text-frost"
                  >
                    {l.label}
                    <span
                      className={`absolute -bottom-1.5 left-0 h-px bg-ice-500 transition-all duration-400 ease-[var(--ease-glide)] group-hover:w-full ${
                        isShop && shopOpen ? "w-full" : "w-0"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="ml-auto flex items-center gap-3 md:ml-0">
            <button
              onClick={cart.openDrawer}
              aria-label={cart.count ? `Bag, ${cart.count} items` : "Bag, empty"}
              className="hairline relative rounded-full border p-2.5 text-fog transition-colors duration-300 hover:text-frost"
            >
              <HandbagIcon size={17} weight="light" />
              {cart.count > 0 && (
                <span className="absolute -top-1 -right-1 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-ink px-1 font-mono text-[10px] leading-none text-paper">
                  {cart.count}
                </span>
              )}
            </button>

            <Magnetic className="hidden sm:block">
              <a
                href="/products/ice-tin"
                className="block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors duration-300 hover:bg-ice-700 active:scale-[0.98]"
              >
                See the tin
              </a>
            </Magnetic>

            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="hairline rounded-full border p-2.5 text-frost md:hidden"
            >
              <ListIcon size={17} weight="light" />
            </button>
          </div>
        </nav>

        <ShopMenu open={shopOpen} onClose={() => setShopOpen(false)} />
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-paper/95 backdrop-blur-2xl md:hidden"
          >
            <div className="flex items-center justify-between px-6 py-7">
              <BrandMark size={30} />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="hairline rounded-full border p-2.5 text-frost"
              >
                <XIcon size={17} weight="light" />
              </button>
            </div>

            <motion.ul
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } } }}
              className="mt-6 flex flex-col gap-2 px-6"
            >
              {[...LINKS, { label: "See the tin", href: "/products/ice-tin" }].map((l) => (
                <motion.li
                  key={l.href}
                  variants={{
                    hidden: { opacity: 0, y: 22 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { type: "spring", stiffness: 110, damping: 18 },
                    },
                  }}
                  className="hairline border-b"
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-5 text-4xl leading-none tracking-tighter text-white-ice"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
