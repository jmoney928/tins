"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  SnowflakeIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useCart } from "./cart/cart-context";
import { useExpressCheckout } from "./cart/use-express-checkout";
import { ExpressButton } from "./express-button";
import { ProductArt } from "./product-art";
import { BundleCard } from "./bundle-card";
import { BrandMark } from "./brand-mark";
import { AnimatedMoney } from "./animated-money";
import { moneyExact } from "@/lib/catalog";
import { GUARANTEE_SHORT } from "@/lib/guarantee";

/**
 * A handover, not a form.
 *
 * This page used to ask for an email and then send the shopper on. That put a
 * keyboard in front of the one screen built to avoid one: Apple Pay and Shop
 * Pay exist to skip typing, and they live on the payment page, so making
 * people type here and meet the shortcut afterwards inverted the whole point.
 * The payment page collects the email itself.
 *
 * The bag and the drawer now go straight there. What remains here is for
 * anyone who arrives at the URL another way: it forwards on its own, and only
 * stops to show the bag when there is a reason to — a failed handover, or a
 * shopper who has just come back from an abandoned payment page and would
 * bounce straight out again if it forwarded.
 */
export function CheckoutClient() {
  const cart = useCart();
  const { go, busy, error } = useExpressCheckout();
  const [cancelled, setCancelled] = useState(false);
  // read once on mount rather than useSearchParams, which would force a
  // Suspense boundary around an otherwise static page
  const [read, setRead] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    setCancelled(new URLSearchParams(window.location.search).has("cancelled"));
    setRead(true);
  }, []);

  useEffect(() => {
    if (!read || started.current || cancelled) return;
    if (!cart.ready || cart.lines.length === 0) return;
    started.current = true;
    void go();
  }, [read, cancelled, cart.ready, cart.lines.length, go]);

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          aria-label="Ice Tins Supply Co., home"
          className="-my-2 flex min-h-11 items-center py-2"
        >
          <BrandMark size={30} />
        </Link>
        <Link
          href="/"
          className="-my-2 flex min-h-11 items-center gap-2 py-2 font-mono text-[11px] tracking-[0.18em] text-fog uppercase transition-colors hover:text-frost"
        >
          <ArrowLeftIcon size={13} weight="bold" />
          Continue shopping
        </Link>
      </div>
      {children}
    </main>
  );

  // still handing over, or still reading the bag back
  const forwarding = !read || !cart.ready || (started.current && !error);

  if (forwarding) {
    return (
      <Shell>
        <div className="flex min-h-[50dvh] flex-col items-center justify-center gap-4 text-center">
          <span className="h-5 w-5 animate-spin rounded-full border-[1.5px] border-frost/25 border-t-frost" />
          <p className="text-lg tracking-tight text-white-ice">
            Taking you to checkout.
          </p>
          <p className="max-w-[34ch] text-sm leading-relaxed text-fog">
            Apple Pay, Google Pay, Shop Pay or card on the next screen.
          </p>
        </div>
      </Shell>
    );
  }

  if (cart.lines.length === 0) {
    return (
      <Shell>
        <div className="flex min-h-[50dvh] flex-col items-center justify-center gap-5 text-center">
          <SnowflakeIcon size={30} weight="thin" className="text-ice-500" />
          <h1 className="text-3xl leading-none tracking-tighter text-white-ice">
            Your bag is empty.
          </h1>
          <p className="max-w-[36ch] text-sm leading-relaxed text-fog">
            There is nothing to check out. Add a tin to continue.
          </p>
          <Link
            href="/products/ice-tin"
            className="mt-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-paper transition-colors duration-300 hover:bg-ice-700"
          >
            View the tin
          </Link>
        </div>
      </Shell>
    );
  }

  // tin in the bag: the offer is still available and still worth stating,
  // because the total on this page is the one it changes
  const showOffer = cart.lines.some((l) => l.id === "ice-tin");

  return (
    <Shell>
      <h1 className="mt-12 text-4xl leading-[0.95] font-medium tracking-tighter text-white-ice sm:text-5xl">
        Your bag
      </h1>
      <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-fog">
        {cancelled
          ? "The payment was not completed and your bag has been kept as it was. Pick up where you left off whenever you are ready."
          : "Payment, address and delivery are taken on our secure payment page."}
      </p>

      {error && (
        <p
          role="alert"
          className="mt-6 flex items-start gap-2 rounded-2xl border border-[#b4463f]/30 bg-[#b4463f]/8 px-4 py-3 text-sm text-[#a33e37]"
        >
          <WarningCircleIcon size={15} weight="fill" className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}

      <div className="glass-edge mt-10 rounded-[2rem] bg-paper/75 p-6 backdrop-blur-sm sm:p-8">
        <ul className="flex flex-col gap-5">
          {cart.lines.map((l) => (
            <li key={l.id} className="flex items-center gap-4">
              {/* the badge hangs outside the thumbnail, so the clipping has to
                  happen on an inner wrapper — on the outer one it sliced the
                  quantity in half */}
              <div className="relative h-16 w-16 shrink-0">
                <div className="h-full w-full overflow-hidden rounded-xl bg-ink">
                  <ProductArt product={l.product} sizes="64px" className="h-full w-full" />
                </div>
                <span className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 font-mono text-[10px] text-paper">
                  {l.qty}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-white-ice">{l.product.name}</p>
                <p className="truncate text-xs text-fog">{l.product.tagline}</p>
              </div>
              <AnimatedMoney
                cents={l.total}
                className="font-mono text-sm text-white-ice tabular-nums"
              />
            </li>
          ))}
        </ul>

        {/* the last place the pair can still be taken, and the one place the
            shopper is already looking at a total it would change */}
        {showOffer && <BundleCard variant="drawer" className="mt-7" />}

        <dl className="mt-7 flex flex-col gap-2 border-t border-frost/8 pt-6 text-sm">
          <div className="flex justify-between text-fog">
            <dt>Subtotal</dt>
            <AnimatedMoney cents={cart.subtotal} className="font-mono tabular-nums" />
          </div>
          {cart.saving > 0 && (
            <div className="flex justify-between text-ice-700">
              <dt>Tin + pack saving</dt>
              <dd className="font-mono tabular-nums">−{moneyExact(cart.saving)}</dd>
            </div>
          )}
          <div className="flex justify-between text-fog">
            <dt>Shipping</dt>
            <dd className="font-mono tabular-nums">
              {cart.shipping === 0 ? "Free" : moneyExact(cart.shipping)}
            </dd>
          </div>
          <div className="mt-2 flex justify-between border-t border-frost/8 pt-3 text-white-ice">
            <dt className="font-medium">Total</dt>
            <AnimatedMoney cents={cart.total} className="font-mono text-lg tabular-nums" />
          </div>
        </dl>

        <ExpressButton
          className="mt-7"
          busy={busy}
          label={`Checkout — ${moneyExact(cart.total)}`}
          onClick={() => void go()}
        />

        {/* the last thing read before paying should be the way out, not the
            lock icon */}
        <p className="mt-3 text-center text-xs leading-relaxed text-fog/80">
          {GUARANTEE_SHORT}
        </p>
      </div>
    </Shell>
  );
}
