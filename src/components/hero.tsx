import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  TruckIcon,
  WrenchIcon,
} from "@phosphor-icons/react/dist/ssr";
import { ProductStage } from "./product-stage";
import { Magnetic } from "./magnetic";
import { CATALOG, bundlePair, currentPrice, money, tinOnSale } from "@/lib/catalog";
import { GUARANTEE_SHORT } from "@/lib/guarantee";
import { ReviewBadge } from "./review-badge";
import { AddButton } from "./add-button";

const PROOF = [
  ["3 floors", "spent, fresh, ice"],
  ["25", "pouches, fresh"],
  ["6 hours", "cold, sealed"],
];

/**
 * The first screen is the inside of an ice cave.
 *
 * The photograph is mirrored so its bright opening sits behind the tin on
 * the left and the dark wall carries the type on the right. Two overlays do
 * the rest: a left-running darkening so the text column never depends on
 * the photograph's own contrast, and a fade to paper along the bottom so
 * the page below continues white without a seam.
 *
 * Three grid children rather than two columns of prose: on mobile the
 * object lands between the headline and the body copy instead of below the
 * fold.
 */
export function Hero() {
  const onSale = tinOnSale();

  return (
    <div id="top" className="relative isolate bg-[#07111f] text-ice-100">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* a portrait crop for phones: the landscape frame cropped to a
            phone shows streaks of ice rather than a cave, so the phone gets
            the opening itself, cut tall */}
        <Image
          src="/ice-cave-mobile.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_30%] sm:hidden"
        />
        <Image
          src="/ice-cave.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden object-cover object-center sm:block"
        />
        {/* legibility for the type column, and the seam into the white page */}
        <div className="absolute inset-0 hidden bg-gradient-to-l from-[#07111f]/75 via-[#07111f]/25 to-transparent lg:block" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07111f]/70 via-[#07111f]/35 to-[#07111f]/55 lg:hidden" />
        <div className="absolute inset-x-0 top-0 hidden h-40 bg-gradient-to-b from-[#07111f]/60 to-transparent lg:block" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent via-paper/60 to-paper" />
      </div>

      <section className="relative mx-auto grid min-h-[100dvh] w-full max-w-7xl grid-cols-1 content-center gap-8 px-4 pt-28 pb-36 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:grid-rows-[auto_auto] lg:gap-x-8 lg:pt-24 lg:pb-40">
        <div
          className="cascade relative lg:col-start-2 lg:row-start-1 lg:self-end lg:pl-12"
          style={{ "--index": 0 } as React.CSSProperties}
        >
          <span className="flex items-center gap-3 font-mono text-[11px] tracking-[0.28em] text-ice-300 uppercase">
            <span className="animate-breathe h-1.5 w-1.5 rounded-full bg-ice-300" />
            Made to order, ships worldwide
          </span>

          {/* what it is and what it does, in one line; the figures move to
              the sentence below, where they support rather than lead */}
          <h1 className="mt-6 text-[3.25rem] leading-[0.88] font-medium tracking-tighter text-balance text-white sm:text-7xl lg:text-[5.2rem]">
            The snus tin with a freezer in the base.
          </h1>
        </div>

        <div
          className="cascade lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:-ml-4 lg:self-center"
          style={{ "--index": 1 } as React.CSSProperties}
        >
          <ProductStage onDark />
        </div>

        <div
          className="cascade lg:col-start-2 lg:row-start-2 lg:pl-12"
          style={{ "--index": 2 } as React.CSSProperties}
        >
          <p className="max-w-[50ch] text-base leading-relaxed text-ice-100/80">
            Twenty-five pouches held at fridge temperature for six hours. A
            slim frozen pack sits under a perforated tray, every floor seals
            on its own O-ring, and the shell is machined from solid
            aluminium in Vancouver.
          </p>

          <div className="mt-9">
            {onSale && (
              <p className="font-mono text-[11px] tracking-[0.24em] text-ice-300 uppercase">
                Launch price
              </p>
            )}
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-mono text-3xl tracking-tight text-white">
                {money(currentPrice("ice-tin"))}
              </span>
              {onSale && (
                <span className="font-mono text-base text-ice-100/60 line-through decoration-ice-100/40">
                  {money(CATALOG["ice-tin"].price)}
                </span>
              )}
              <span className="text-xs text-ice-100/60">CAD</span>
            </div>
          </div>

          {/*
            The bag, from the hero. One product, one price, one button: a
            visitor who arrives ready should not have to visit a second page
            to act. The drawer that opens carries the pack offer, so the
            shortest route to checkout still passes the upsell.
          */}
          <div className="mt-6 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
            <Magnetic strength={0.4}>
              <AddButton
                productId="ice-tin"
                tone="paper"
                label={`Add to bag — ${money(currentPrice("ice-tin"))}`}
                className="w-full px-7 py-4 sm:w-auto"
              />
            </Magnetic>

            <Link
              href="/products/ice-tin"
              className="group flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-4 text-sm text-ice-100 transition-all duration-300 ease-[var(--ease-glide)] hover:border-white/40 hover:bg-white/10 active:scale-[0.98]"
            >
              See the tin
              <ArrowRightIcon
                size={15}
                weight="bold"
                className="transition-transform duration-300 ease-[var(--ease-glide)] group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Trust strip. ReviewBadge shows stars only when a real average is
              set, and the rating markup stays off until the reviews are
              readable on the page — see lib/social-proof.ts. */}
          <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ice-100/75">
            <li>
              <ReviewBadge tone="paper" />
            </li>
            <li className="flex items-center gap-2">
              <TruckIcon size={14} weight="light" className="text-ice-300" />
              Three spare ice packs for {money(bundlePair().step)} with a tin
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheckIcon size={14} weight="light" className="text-ice-300" />
              {GUARANTEE_SHORT}
            </li>
            <li className="flex items-center gap-2">
              <WrenchIcon size={14} weight="light" className="text-ice-300" />
              Lifetime shell warranty
            </li>
          </ul>

          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-white/12 pt-7">
            {PROOF.map(([n, label]) => (
              <div key={n}>
                <dt className="font-mono text-lg text-white">{n}</dt>
                <dd className="mt-1 text-xs leading-snug text-ice-100/70">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}
