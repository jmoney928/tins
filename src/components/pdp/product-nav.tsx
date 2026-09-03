"use client";

import Link from "next/link";
import { ArrowLeftIcon, HandbagIcon } from "@phosphor-icons/react/dist/ssr";
import { useCart } from "../cart/cart-context";
import { BrandMark } from "../brand-mark";

/**
 * Deliberately not the full SiteNav. A sales page has one job — every link
 * off it is a chance to leave before adding to bag, so this keeps exactly
 * two: back to the shop, and the bag the visitor is trying to fill.
 */
export function ProductNav() {
  const cart = useCart();

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6 sm:pt-5">
      <nav className="glass-edge mx-auto flex max-w-7xl items-center gap-4 rounded-full bg-paper/80 px-4 py-3 backdrop-blur-xl sm:px-5">
        <Link
          href="/"
          aria-label="Back to Ice Tins Supply Co."
          /* -m-2.5 p-2.5 grows the tap area to 44px without moving the arrow:
             at 15x15 this was the smallest target on the site, and the only
             way off the page. */
          className="-m-3 flex min-h-11 min-w-11 items-center justify-center gap-2.5 p-3 text-fog transition-colors duration-300 hover:text-frost"
        >
          <ArrowLeftIcon size={15} weight="bold" />
          <span className="hidden sm:inline">
            <BrandMark size={26} />
          </span>
        </Link>

        <span className="sm:hidden">
          <BrandMark size={24} />
        </span>

        <button
          onClick={cart.openDrawer}
          aria-label={cart.count ? `Bag, ${cart.count} items` : "Bag, empty"}
          className="hairline relative ml-auto grid size-11 place-items-center rounded-full border text-fog transition-colors duration-300 hover:text-frost"
        >
          <HandbagIcon size={17} weight="light" />
          {cart.count > 0 && (
            <span className="absolute -top-1 -right-1 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-ink px-1 font-mono text-[10px] leading-none text-paper">
              {cart.count}
            </span>
          )}
        </button>
      </nav>
    </header>
  );
}
