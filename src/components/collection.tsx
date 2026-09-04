import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "@phosphor-icons/react/dist/ssr";
import {
  CATALOG,
  CURRENCY_LABEL,
  currentPrice,
  tinOnSale,
  money,
} from "@/lib/catalog";
import { AddButton } from "./add-button";
import { liveCatalog } from "@/lib/live-catalog";
import { Reveal } from "./reveal";

export async function Collection() {
  const tin = CATALOG["ice-tin"];
  const onSale = tinOnSale();

  // priced from Shopify where it can answer, from the local catalogue where
  // it cannot — the same fallback the product page uses
  const live = await liveCatalog();
  const tinPrice = live?.["ice-tin"]?.price ?? currentPrice("ice-tin");
  const tinWas = live?.["ice-tin"]?.compareAt ?? tin.price;

  return (
    <section id="collection" className="relative overflow-hidden py-20 sm:py-28">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* centred, to break the left-head / right-body pattern used elsewhere */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] tracking-[0.28em] text-ice-500 uppercase">
            The tin
          </p>
          {/* flat declarative on purpose — the two-tone headline runs in four
              other sections, and dropping it once is what keeps it working */}
          <h2 className="mt-4 text-4xl leading-[0.95] font-medium tracking-tighter text-balance text-white-ice sm:text-5xl">
            One can, made properly.
          </h2>
          <p className="mx-auto mt-5 max-w-[46ch] text-sm leading-relaxed text-fog">
            A single configuration, made properly, with no variants to
            choose between and nothing added that does not earn its place.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          {/* shot dark — the one place the page goes to black */}
          <Reveal className="grid">
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
            {/* nothing stamped on the photograph. An availability pill sat
                here, and a label floating on a product shot is the tell of a
                template; the fact it carried is in the hero eyebrow above
                and in the buy box, where a buyer reads it. */}
          </Link>
          </Reveal>

          <Reveal delay={110} className="grid">
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

            <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-frost/8 pt-8">
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
              <div className="flex items-center gap-3">
                <Link
                  href="/products/ice-tin"
                  className="group flex items-center gap-2 rounded-full border border-frost/12 px-5 py-3 text-sm text-frost transition-all duration-300 ease-[var(--ease-glide)] hover:border-ice-500/50 hover:bg-slate-deep/40 active:scale-[0.98]"
                >
                  Details
                  <ArrowRightIcon
                    size={14}
                    weight="bold"
                    className="transition-transform duration-300 ease-[var(--ease-glide)] group-hover:translate-x-1"
                  />
                </Link>
                <AddButton productId="ice-tin" label="Add to bag" className="px-6 py-3" />
              </div>
            </div>
          </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
}
