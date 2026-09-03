import Link from "next/link";
import {
  ArrowUpRightIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  TruckIcon,
  WrenchIcon,
} from "@phosphor-icons/react/dist/ssr";
import { ProductStage } from "./product-stage";
import { Magnetic } from "./magnetic";
import { Splatter } from "./splatter";
import { CATALOG, bundlePair, currentPrice, money, tinOnSale } from "@/lib/catalog";
import { GUARANTEE_SHORT } from "@/lib/guarantee";
import { ReviewBadge } from "./review-badge";

const PROOF = [
  ["3 floors", "spent, fresh, ice"],
  ["25", "pouches, fresh"],
  ["6 hours", "cold, sealed"],
];

/**
 * Three grid children rather than two columns of prose: on mobile the object
 * lands between the headline and the body copy instead of below the fold.
 */
export function Hero() {
  const onSale = tinOnSale();

  return (
    <section
      id="top"
      /* overflow-x-clip contains the splatter below, which bleeds 288px past
         the right edge. Every other section carrying one already clips; this
         one did not, and on a phone that overflow widened the layout viewport
         and pushed the nav's bag and menu buttons off the screen. */
      className="relative mx-auto grid min-h-[100dvh] w-full max-w-7xl grid-cols-1 content-center gap-8 overflow-x-clip px-4 pt-28 pb-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:grid-rows-[auto_auto] lg:gap-x-8 lg:pt-24 lg:pb-0"
    >
      <Splatter
        scope="hero-splat"
        rotate={22}
        className="pointer-events-none absolute -top-24 -right-72 h-[42rem] w-[42rem] opacity-[0.34] mix-blend-multiply"
      />

      <div
        className="cascade relative lg:col-start-2 lg:row-start-1 lg:self-end lg:pl-12"
        style={{ "--index": 0 } as React.CSSProperties}
      >
        <span className="flex items-center gap-3 font-mono text-[11px] tracking-[0.28em] text-fog uppercase">
          <span className="animate-breathe h-1.5 w-1.5 rounded-full bg-ice-500" />
          Made to order, ships worldwide
        </span>

        <h1 className="mt-6 text-[3.25rem] leading-[0.88] font-medium tracking-tighter text-white-ice sm:text-7xl lg:text-[5.2rem]">
          Twenty-five pouches,
          <br />
          <span className="text-fog">fridge-cold for six hours.</span>
        </h1>
      </div>

      <div
        className="cascade lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:-ml-4 lg:self-center"
        style={{ "--index": 1 } as React.CSSProperties}
      >
        <ProductStage />
      </div>

      <div
        className="cascade lg:col-start-2 lg:row-start-2 lg:pl-12"
        style={{ "--index": 2 } as React.CSSProperties}
      >
        <p className="max-w-[50ch] text-base leading-relaxed text-fog">
          A slim frozen pack sits in the base, under a perforated tray that
          puts the pouches in direct contact with the cold. Above it, a sealed floor takes
          the spent pouches. Standard 68 mm diameter, one floor deeper than a
          conventional can.
        </p>

        {/*
          The price, set as a price.

          This used to be a solid blue pill above the headline reading "LAUNCH
          PRICE $49.99 — REG. $79.99", and the same pill ran on the shop card
          and the buy box. Three shouted badges for one number is how a
          template announces a discount, not how a shop states what something
          costs. The figures are unchanged; they now sit in the type scale,
          above the button, where a buyer looks for them.
        */}
        <div className="mt-9">
          {onSale && (
            <p className="font-mono text-[11px] tracking-[0.24em] text-ice-700 uppercase">
              Launch price
            </p>
          )}
          <div className="mt-2 flex items-baseline gap-3">
            <span className="font-mono text-3xl tracking-tight text-white-ice">
              {money(currentPrice("ice-tin"))}
            </span>
            {onSale && (
              <span className="font-mono text-base text-fog line-through decoration-fog/50">
                {money(CATALOG["ice-tin"].price)}
              </span>
            )}
            <span className="text-xs text-fog">CAD</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
          <Magnetic strength={0.4}>
            <Link
              href="/products/ice-tin"
              className="group flex items-center justify-center gap-3 rounded-full bg-ink px-7 py-4 text-sm font-medium text-paper transition-colors duration-300 ease-[var(--ease-glide)] hover:bg-ice-700 active:scale-[0.98]"
            >
              See the tin
              <ArrowRightIcon
                size={15}
                weight="bold"
                className="transition-transform duration-300 ease-[var(--ease-glide)] group-hover:translate-x-1"
              />
            </Link>
          </Magnetic>

          <a
            href="/cold-system"
            className="flex items-center justify-center gap-2 rounded-full border border-frost/8 px-7 py-4 text-sm text-frost transition-all duration-300 ease-[var(--ease-glide)] hover:border-ice-500/40 hover:bg-slate-deep/40 active:scale-[0.98]"
          >
            How the cold works
            <ArrowUpRightIcon size={15} weight="bold" />
          </a>
        </div>

        {/* Trust strip. ReviewBadge shows stars only when a real average is
            set, and the rating markup stays off until the reviews are
            readable on the page — see lib/social-proof.ts. */}
        <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-fog">
          <li>
            <ReviewBadge />
          </li>
          <li className="flex items-center gap-2">
            <TruckIcon size={14} weight="light" className="text-ice-500" />
            Free shipping on a tin and a pack — {money(bundlePair().total)} for both
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheckIcon size={14} weight="light" className="text-ice-500" />
            {GUARANTEE_SHORT}
          </li>
          <li className="flex items-center gap-2">
            <WrenchIcon size={14} weight="light" className="text-ice-500" />
            Lifetime shell warranty
          </li>
        </ul>

        <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-frost/8 pt-7">
          {PROOF.map(([n, label]) => (
            <div key={n}>
              <dt className="font-mono text-lg text-white-ice">{n}</dt>
              <dd className="mt-1 text-xs leading-snug text-fog">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
