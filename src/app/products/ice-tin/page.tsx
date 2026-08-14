import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  PackageIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "@phosphor-icons/react/dist/ssr";
import { FrostField } from "@/components/frost-field";
import { ProductNav } from "@/components/pdp/product-nav";
import { TinBuyBox } from "@/components/pdp/tin-buy-box";
import { AddButton } from "@/components/add-button";
import { QuickView } from "@/components/quick-view";
import { ProductArt } from "@/components/product-art";
import { SiteFooter } from "@/components/site-footer";
import { CATALOG, CURRENCY_LABEL, money } from "@/lib/catalog";
import { SPECS, STEPS } from "@/lib/products";
import { CARRIERS } from "@/lib/testers";
import { remaining } from "@/lib/stock";

export const metadata: Metadata = {
  title: "The Ice Tin",
  description:
    "A three-floor snus can holding 25 fresh pouches: spent on top, fresh in the middle, a slim ice pack underneath. Machined 6061-T6, stays cold for 6 hours. $59.99 CAD, in stock now.",
  openGraph: {
    title: "The Ice Tin — Cold to the last pouch",
    description:
      "25 pouches across three floors, with a slim ice pack in the base. Stays cold for 6 hours. In stock now, ships worldwide.",
    url: "https://icetins.com/products/ice-tin",
    type: "website",
  },
};

// live stock, checked on every request — a scarcity claim that goes stale is a lie
export const dynamic = "force-dynamic";

const NOTES = CARRIERS.slice(0, 3);

export default async function IceTinPage() {
  const tin = CATALOG["ice-tin"];
  const core = CATALOG["chillcore-3"];
  const stock = await remaining("ice-tin");
  const left =
    stock.ok && Number.isFinite(stock.remaining) ? stock.remaining : (tin.remaining ?? null);

  return (
    <>
      <FrostField />
      <ProductNav />

      <main className="pt-24 sm:pt-28">
        {/* buy box */}
        <section id="top" className="mx-auto max-w-7xl px-4 sm:px-6 scroll-mt-24">
          <TinBuyBox remaining={left} />
        </section>

        {/* stock and shipping reassurance */}
        <section className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6">
          <div className="glass-edge relative overflow-hidden rounded-[2rem] bg-abyss/80 p-7 backdrop-blur-md sm:p-10">
            <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(46,157,200,0.24),transparent_65%)] blur-2xl" />
            <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-10">
              <PackageIcon size={32} weight="thin" className="text-ice-500" />
              <div>
                <h2 className="text-2xl leading-tight tracking-tight text-white-ice sm:text-3xl">
                  In stock and ready to ship.
                </h2>
                <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-fog">
                  Every order ships from Vancouver, BC within 1–2 business
                  days. Machined in small batches so quality stays
                  consistent — we simply make more when we run low.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* how it works */}
        <section className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6">
          <p className="font-mono text-[11px] tracking-[0.28em] text-ice-500 uppercase">
            How it works
          </p>
          <h2 className="mt-4 max-w-[20ch] text-3xl leading-[0.95] font-medium tracking-tighter text-white-ice sm:text-4xl">
            Three steps, then you stop thinking about it.
          </h2>

          <ol className="mt-10 border-t border-frost/8">
            {STEPS.map((s) => (
              <li
                key={s.n}
                className="group grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-3 border-b border-frost/8 py-7 transition-colors duration-500 hover:bg-slate-deep/25 sm:grid-cols-[auto_1fr_auto] sm:gap-x-10"
              >
                <span className="font-mono text-sm text-ice-700 transition-colors duration-500 group-hover:text-ice-300">
                  {s.n}
                </span>
                <h3 className="text-2xl leading-tight tracking-tight text-white-ice">
                  {s.title}
                </h3>
                <span className="col-start-2 font-mono text-sm text-ice-500 sm:col-start-3 sm:row-start-1 sm:text-base">
                  {s.stat}
                </span>
                <p className="col-start-2 max-w-[52ch] text-sm leading-relaxed text-fog sm:col-span-2">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* the details — clearly laid out, nothing left implicit */}
        <section className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6">
          <p className="font-mono text-[11px] tracking-[0.28em] text-ice-500 uppercase">
            The details
          </p>
          <h2 className="mt-4 max-w-[22ch] text-3xl leading-[0.95] font-medium tracking-tighter text-white-ice sm:text-4xl">
            Exactly what you are buying.
          </h2>
          <p className="mt-4 max-w-[56ch] text-sm leading-relaxed text-fog">
            One machined can, one Chillcore pack in the box. That is the
            order — no bundles to parse, no tiers.
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-frost/8 sm:grid-cols-3">
            {SPECS.map((s) => (
              <div key={s.k} className="bg-paper p-5">
                <dt className="font-mono text-[10px] tracking-[0.18em] text-fog uppercase">
                  {s.k}
                </dt>
                <dd className={`mt-1.5 text-sm text-frost ${s.mono ? "font-mono" : ""}`}>
                  {s.v}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* field notes — real testers, named, no star ratings */}
        <section className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6">
          <p className="font-mono text-[11px] tracking-[0.28em] text-ice-500 uppercase">
            Field notes
          </p>
          <h2 className="mt-4 max-w-[22ch] text-3xl leading-[0.95] font-medium tracking-tighter text-white-ice sm:text-4xl">
            Tested before you get one.
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {NOTES.map((c) => (
              <figure
                key={c.name}
                className="glass-edge flex flex-col justify-between rounded-[1.75rem] bg-paper/75 p-6 backdrop-blur-sm sm:p-7"
              >
                <blockquote className="text-base leading-snug tracking-tight text-frost">
                  &ldquo;{c.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-3 border-t border-frost/8 pt-5">
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br ${c.tint} font-mono text-[11px]`}
                  >
                    {c.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("")}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-white-ice">{c.name}</span>
                    <span className="block font-mono text-[10px] text-fog">
                      {c.role} — {c.city}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* objections, answered before they're asked */}
        <section className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6">
          <div className="grid grid-cols-1 gap-8 border-t border-frost/8 pt-10 sm:grid-cols-3 sm:gap-10">
            <div className="flex gap-4">
              <TruckIcon size={20} weight="light" className="mt-0.5 shrink-0 text-ice-500" />
              <div>
                <h3 className="text-sm font-medium text-white-ice">Shipping</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fog">
                  Ships worldwide from Vancouver, BC. Flat $8, free at $75+.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <ShieldCheckIcon size={20} weight="light" className="mt-0.5 shrink-0 text-ice-500" />
              <div>
                <h3 className="text-sm font-medium text-white-ice">Warranty</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fog">
                  Lifetime warranty on the shell against cracking or a failed
                  thread. Email us and we replace it.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <PackageIcon size={20} weight="light" className="mt-0.5 shrink-0 text-ice-500" />
              <div>
                <h3 className="text-sm font-medium text-white-ice">What is in the box</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fog">
                  One tin, one Chillcore ice pack. We sell empty cans and ice
                  packs only — no nicotine or tobacco, ever.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* cross-sell — kept short, this page's job is the tin */}
        <section className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6">
          <div className="glass-edge flex flex-col gap-6 rounded-[2rem] bg-paper/75 p-6 backdrop-blur-sm sm:flex-row sm:items-center sm:gap-8 sm:p-7">
            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-ink">
              <ProductArt product={core} sizes="96px" className="h-full w-full" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg leading-tight tracking-tight text-white-ice">{core.name}</h3>
              <p className="mt-1.5 max-w-[46ch] text-sm leading-relaxed text-fog">
                One pack ships in every tin. Add this if you want a spare
                already freezing on day one.
              </p>
            </div>
            <div className="flex shrink-0 items-center justify-between gap-5 border-t border-frost/8 pt-5 sm:border-t-0 sm:pt-0">
              <span className="font-mono text-lg tracking-tight text-white-ice">
                {money(core.price)}
                <span className="ml-2 text-xs text-fog">{CURRENCY_LABEL}</span>
              </span>
              <div className="flex items-center gap-3">
                <QuickView productId="chillcore-3" className="hidden sm:flex" />
                <AddButton productId="chillcore-3" label="Add pack" openBag={false} />
              </div>
            </div>
          </div>
        </section>

        {/* final push */}
        <section className="mx-auto mt-16 max-w-7xl px-4 pb-8 sm:mt-24 sm:px-6">
          <div className="glass-edge relative overflow-hidden rounded-[2.5rem] bg-abyss/80 px-6 py-14 text-center backdrop-blur-md sm:px-14 sm:py-16">
            <div className="pointer-events-none absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(46,157,200,0.22),transparent_65%)] blur-3xl" />
            <div className="relative">
              <h2 className="mx-auto max-w-[20ch] text-3xl leading-[0.95] font-medium tracking-tighter text-white-ice sm:text-4xl">
                Ready when you are.
              </h2>
              <p className="mx-auto mt-4 max-w-[46ch] text-sm leading-relaxed text-fog">
                $59.99 CAD, one tin, one ice pack in the box. In stock now.
              </p>
              <Link
                href="#top"
                className="group mt-8 inline-flex items-center justify-center gap-3 rounded-full bg-ink px-8 py-4 text-sm font-medium text-paper transition-colors duration-300 ease-[var(--ease-glide)] hover:bg-ice-700 active:scale-[0.98]"
              >
                Get the tin
                <ArrowRightIcon
                  size={15}
                  weight="bold"
                  className="transition-transform duration-300 ease-[var(--ease-glide)] group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
