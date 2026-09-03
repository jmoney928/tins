import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "@phosphor-icons/react/dist/ssr";
import {
  bundlePair,
  CATALOG,
  CURRENCY_LABEL,
  currentPrice,
  tinOnSale,
  money,
} from "@/lib/catalog";
import { AddButton } from "./add-button";
import { QuickView } from "./quick-view";
import { liveCatalog } from "@/lib/live-catalog";

export async function Collection() {
  const tin = CATALOG["ice-tin"];
  const core = CATALOG["chillcore-3"];
  const onSale = tinOnSale();

  // priced from Shopify where it can answer, from the local catalogue where
  // it cannot — the same fallback the product page uses
  const live = await liveCatalog();
  const tinPrice = live?.["ice-tin"]?.price ?? currentPrice("ice-tin");
  const tinWas = live?.["ice-tin"]?.compareAt ?? tin.price;
  const corePrice = live?.["chillcore-3"]?.price ?? core.price;

  return (
    <section id="collection" className="relative overflow-hidden py-20 sm:py-28">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* centred, to break the left-head / right-body pattern used elsewhere */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] tracking-[0.28em] text-ice-500 uppercase">
            The tin
          </p>
          {/* flat declarative on purpose — the two-tone headline runs in four
              other sections, and dropping it once is what keeps it working */}
          <h2 className="mt-4 text-4xl leading-[0.95] font-medium tracking-tighter text-balance text-white-ice sm:text-5xl">
            One can, and the packs that go in it.
          </h2>
          <p className="mx-auto mt-5 max-w-[46ch] text-sm leading-relaxed text-fog">
            A single configuration, made properly, with no variants to
            choose between and nothing added that does not earn its place.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          {/* shot dark — the one place the page goes to black */}
          <Link
            href="/products/ice-tin"
            className="group relative overflow-hidden rounded-[2rem] bg-ink"
          >
            <Image
              src="/side-product.jpg"
              alt="The Ice Tin at an angle, showing the machined lid and the three stacked floors"
              width={1000}
              height={1000}
              sizes="(max-width: 1024px) 92vw, 46vw"
              className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-glide)] group-hover:scale-[1.03]"
            />
            {/* one badge on the photograph, not two: the sale pill that sat
                opposite this said nothing the price below does not */}
            <span className="absolute top-6 left-6 rounded-full border border-white/15 bg-ink/70 px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-ice-300 uppercase backdrop-blur-md">
              In stock
            </span>
          </Link>

          <div className="glass-edge flex flex-col rounded-[2rem] bg-paper/75 p-8 backdrop-blur-sm sm:p-10">
            <h3 className="text-2xl leading-tight tracking-tight text-white-ice">
              {tin.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ice-700">
              {tin.tagline}
            </p>
            <p className="mt-4 max-w-[40ch] text-sm leading-relaxed text-fog">
              {tin.blurb}
            </p>

            <ul className="mt-8 flex flex-col gap-3.5 border-t border-frost/8 pt-8">
              {tin.points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-frost">
                  <CheckIcon
                    size={14}
                    weight="bold"
                    className="mt-1 shrink-0 text-ice-500"
                  />
                  {p}
                </li>
              ))}
            </ul>

            <div className="mt-auto flex items-center justify-between gap-4 border-t border-frost/8 pt-8">
              <span>
                {onSale && (
                  <span className="block font-mono text-[10px] tracking-[0.22em] text-ice-700 uppercase">
                    Launch price
                  </span>
                )}
                <span className="mt-1 flex items-baseline gap-2.5">
                  <span className="font-mono text-2xl tracking-tight text-white-ice">
                    {money(tinPrice)}
                  </span>
                  {onSale && (
                    <span className="font-mono text-base text-fog line-through decoration-fog/50">
                      {money(tinWas)}
                    </span>
                  )}
                  <span className="text-xs text-fog">{CURRENCY_LABEL}</span>
                </span>
              </span>
              <Link
                href="/products/ice-tin"
                className="group flex items-center gap-2.5 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors duration-300 ease-[var(--ease-glide)] hover:bg-ice-700 active:scale-[0.98]"
              >
                See the tin
                <ArrowRightIcon
                  size={14}
                  weight="bold"
                  className="transition-transform duration-300 ease-[var(--ease-glide)] group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* The refill borrows the tin's framing — same gutter, same radius, a
            full-bleed photo panel beside a glass card — but at roughly half the
            height, so it reads as the same family without rivalling the tin. */}
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-[13rem_1fr] lg:grid-cols-[16rem_1fr]">
          <div className="relative overflow-hidden rounded-[2rem] bg-ink">
            <Image
              src={core.image!}
              alt="Three Chillcore ice packs stacked, matte black with the engraved emblem"
              width={1000}
              height={1000}
              sizes="(max-width: 640px) 92vw, 16rem"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="glass-edge flex flex-col rounded-[2rem] bg-paper/75 p-6 backdrop-blur-sm sm:p-7">
            <h3 className="text-lg leading-tight tracking-tight text-white-ice">
              {core.name}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ice-700">
              {core.tagline}
            </p>
            {/* the pair, totalled — the offer was previously stated as a
                deduction the reader had to apply to a price on another card */}
            <p className="mt-2.5 text-sm leading-relaxed text-frost">
              Ordered with a tin, the two come to {money(bundlePair().total)}{" "}
              delivered instead of {money(bundlePair().list)}.
            </p>

            {/* two columns, so four short points fill the row the photo sets
                rather than leaving the card half empty */}
            <ul className="mt-5 grid gap-x-8 gap-y-2.5 border-t border-frost/8 pt-5 sm:grid-cols-2">
              {core.points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-frost">
                  <CheckIcon
                    size={14}
                    weight="bold"
                    className="mt-1 shrink-0 text-ice-500"
                  />
                  {p}
                </li>
              ))}
            </ul>

            <div className="mt-auto flex items-center justify-between gap-5 border-t border-frost/8 pt-5">
              <span className="font-mono text-lg tracking-tight text-white-ice">
                {money(corePrice)}
                <span className="ml-2 text-xs text-fog">{CURRENCY_LABEL}</span>
              </span>
              <div className="flex items-center gap-3">
                <QuickView productId="chillcore-3" className="hidden sm:flex" />
                <AddButton productId="chillcore-3" label="Add pack" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
