"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  LockSimpleIcon,
  SnowflakeIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useCart } from "./cart/cart-context";
import { ProductArt } from "./product-art";
import { BrandMark } from "./brand-mark";
import { CURRENCY_LABEL, money } from "@/lib/catalog";
import { GUARANTEE_SHORT } from "@/lib/guarantee";
import { trackPixel } from "@/lib/pixel";

export function CheckoutClient() {
  const cart = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [cancelled, setCancelled] = useState(false);
  const [email, setEmail] = useState("");

  // read once on mount rather than useSearchParams, which would force a
  // Suspense boundary around an otherwise static page
  useEffect(() => {
    setCancelled(new URLSearchParams(window.location.search).has("cancelled"));
  }, []);

  const pay = async () => {
    if (busy) return;

    // checked here as well as on the server, so a typo costs a glance rather
    // than a round trip out to Stripe and back
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError("Enter the email your receipt should go to.");
      return;
    }

    setBusy(true);
    setError("");
    setCancelled(false);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: cart.lines.map((l) => ({ id: l.id, qty: l.qty })),
          email: email.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.url) {
        setError(data.error ?? "Could not start checkout. Try again.");
        setBusy(false);
        return;
      }

      trackPixel("InitiateCheckout", {
        lines: cart.lines.map((l) => ({ id: l.id, qty: l.qty })),
        currency: CURRENCY_LABEL,
        value: cart.total / 100,
      });

      // hand off to Stripe; the bag is cleared on the success page, not here,
      // so backing out of Stripe leaves the shopper's bag intact
      window.location.href = data.url;
    } catch {
      setError("No connection. Check your network and try again.");
      setBusy(false);
    }
  };

  if (cart.ready && cart.lines.length === 0) {
    return (
      <main className="mx-auto flex min-h-[100dvh] max-w-xl flex-col items-center justify-center gap-5 px-6 text-center">
        <SnowflakeIcon size={30} weight="thin" className="text-ice-500" />
        <h1 className="text-3xl leading-none tracking-tighter text-white-ice">
          Your bag is empty.
        </h1>
        <p className="max-w-[36ch] text-sm leading-relaxed text-fog">
          Nothing to check out yet. Add a tin to get started.
        </p>
        <Link
          href="/#collection"
          className="mt-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-paper transition-colors duration-300 hover:bg-ice-700"
        >
          Look at the tin
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex items-center justify-between">
        <Link href="/" aria-label="Ice Tins Supply Co., home">
          <BrandMark size={30} />
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-fog uppercase transition-colors hover:text-frost"
        >
          <ArrowLeftIcon size={13} weight="bold" />
          Keep looking
        </Link>
      </div>

      <h1 className="mt-12 text-4xl leading-[0.95] font-medium tracking-tighter text-white-ice sm:text-5xl">
        Checkout
      </h1>
      <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-fog">
        Payment, address and delivery are handled on Stripe&rsquo;s secure page.
        You will land back here the moment it clears.
      </p>

      {cancelled && (
        <p className="mt-6 flex items-start gap-2 rounded-2xl border border-frost/12 bg-abyss/70 px-4 py-3 text-sm text-fog">
          <WarningCircleIcon size={15} weight="fill" className="mt-0.5 shrink-0 text-ice-500" />
          You came back without paying. Your bag is exactly where you left it.
        </p>
      )}

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
        <p className="font-mono text-[11px] tracking-[0.28em] text-fog uppercase">
          Your bag
        </p>

        <ul className="mt-6 flex flex-col gap-5">
          {cart.lines.map((l) => (
            <li key={l.id} className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-ink">
                <ProductArt product={l.product} sizes="64px" className="h-full w-full" />
                <span className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 font-mono text-[10px] text-paper">
                  {l.qty}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-white-ice">{l.product.name}</p>
                <p className="truncate text-xs text-fog">{l.product.tagline}</p>
              </div>
              <span className="font-mono text-sm text-white-ice">{money(l.total)}</span>
            </li>
          ))}
        </ul>

        <dl className="mt-7 flex flex-col gap-2 border-t border-frost/8 pt-6 text-sm">
          <div className="flex justify-between text-fog">
            <dt>Subtotal</dt>
            <dd className="font-mono">{money(cart.subtotal)}</dd>
          </div>
          {cart.saving > 0 && (
            <div className="flex justify-between text-ice-700">
              <dt>Tin + pack bundle</dt>
              <dd className="font-mono">−{money(cart.saving)}</dd>
            </div>
          )}
          <div className="flex justify-between text-fog">
            <dt>Shipping</dt>
            <dd className="font-mono">
              {cart.shipping === 0 ? "Free" : money(cart.shipping)}
            </dd>
          </div>
          <div className="mt-2 flex justify-between border-t border-frost/8 pt-3 text-white-ice">
            <dt className="font-medium">Total</dt>
            <dd className="font-mono text-lg">{money(cart.total)}</dd>
          </div>
        </dl>

        {/* asked here rather than on Stripe's page, and passed through so it
            arrives prefilled — one field earlier, not one field more */}
        <div className="mt-7">
          <label
            htmlFor="checkout-email"
            className="font-mono text-[11px] tracking-[0.18em] text-fog uppercase"
          >
            Email
          </label>
          <input
            id="checkout-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") pay();
            }}
            placeholder="you@example.com"
            aria-describedby="checkout-email-note"
            className="mt-2 w-full rounded-2xl border border-frost/12 bg-paper/60 px-4 py-3.5 text-sm text-frost outline-none transition-colors duration-300 placeholder:text-fog/60 focus:border-ice-500/60"
          />
          <p id="checkout-email-note" className="mt-2 text-xs leading-relaxed text-fog/80">
            Your receipt and tracking go here. If you do not finish, we will
            email your bag back to you once — and nothing else.
          </p>
        </div>

        <button
          onClick={pay}
          disabled={busy}
          className="group mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-sm font-medium text-paper transition-all duration-300 ease-[var(--ease-glide)] hover:bg-ice-700 active:scale-[0.99] disabled:opacity-70"
        >
          {busy ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-paper/35 border-t-paper" />
              Opening Stripe
            </>
          ) : (
            <>
              Pay {money(cart.total)}
              <ArrowRightIcon
                size={14}
                weight="bold"
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </>
          )}
        </button>

        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-fog/80">
          <LockSimpleIcon size={13} weight="fill" />
          Secured by Stripe. Card details never touch our servers.
        </p>
        {/* the last thing read before paying should be the way out, not the
            lock icon */}
        <p className="mt-2 text-center text-xs leading-relaxed text-fog/80">
          {GUARANTEE_SHORT}
        </p>
      </div>
    </main>
  );
}
