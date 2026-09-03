"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { CATALOG, bundlePair, currentPrice, money } from "@/lib/catalog";

/**
 * The panel that drops under "Shop".
 *
 * Structure borrowed from a classic retail mega-menu — category columns,
 * a ruled footer, a "shop all" out to the right — but every entry is a real
 * destination. A menu padded with invented variants to fill four columns
 * reads as a bigger catalogue until someone clicks one, and this shop
 * genuinely sells two things.
 *
 * Prices are read live so the menu cannot drift from the shelf.
 */
function columns() {
  const tin = CATALOG["ice-tin"];
  const packs = CATALOG["chillcore-3"];

  return [
    {
      heading: "Tins",
      links: [
        {
          label: tin.name,
          href: "/products/ice-tin",
          meta: money(currentPrice(tin.id)),
        },
      ],
    },
    {
      heading: "Ice packs",
      links: [
        {
          label: packs.name,
          href: "/#collection",
          meta: money(currentPrice(packs.id)),
        },
        { label: "Ice pack care", href: "/ice-pack-care" },
      ],
    },
    {
      heading: "Before you buy",
      links: [
        { label: "The cold system", href: "/cold-system" },
        { label: "How it is built", href: "/build" },
        { label: "Field notes", href: "/field-notes" },
      ],
    },
    {
      heading: "Support",
      links: [
        { label: "Cold-or-refund guarantee", href: "/guarantee" },
        { label: "Shipping & returns", href: "/shipping-returns" },
        { label: "Warranty", href: "/warranty" },
      ],
    },
  ];
}

export function ShopMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-4 top-full pt-2 sm:inset-x-6"
        >
          <div className="glass-edge mx-auto max-w-7xl rounded-[1.75rem] bg-abyss/95 p-8 backdrop-blur-xl sm:p-10">
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
              {columns().map((col) => (
                <div key={col.heading}>
                  <h2 className="text-base tracking-tight text-ice-300">{col.heading}</h2>
                  <ul className="mt-5 flex flex-col gap-3.5">
                    {col.links.map((l) => (
                      <li key={l.href + l.label}>
                        <Link
                          href={l.href}
                          onClick={onClose}
                          className="group flex items-baseline gap-2 text-sm text-fog transition-colors duration-200 hover:text-frost"
                        >
                          {l.label}
                          {"meta" in l && l.meta && (
                            <span className="font-mono text-[11px] text-fog/60 transition-colors duration-200 group-hover:text-ice-500">
                              {l.meta}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* the footer row had a whole empty half; the offer is the one
                thing worth putting in it */}
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-frost/8 pt-6">
              <p className="text-sm text-fog">
                Tin and pack together:{" "}
                <span className="text-white-ice">{money(bundlePair().total)} delivered</span>,
                against {money(bundlePair().list)} apart.
              </p>
              <Link
                href="/products/ice-tin"
                onClick={onClose}
                className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-frost uppercase transition-colors duration-200 hover:text-ice-300"
              >
                Shop all
                <ArrowRightIcon
                  size={13}
                  weight="bold"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
