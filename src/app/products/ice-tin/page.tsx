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
import { ViewContent } from "@/components/view-content";
import { Reveal } from "@/components/reveal";
import { Offer } from "@/components/offer";
import { FieldNotes } from "@/components/field-notes";
import { FinalCta } from "@/components/final-cta";
import { JsonLd } from "@/components/json-ld";
import {
  bundlePair,
  CATALOG,
  CURRENCY_LABEL,
  SHIPPING_FLAT,
  freeShippingToday,
  tinOnSale,
  currentPrice,
  money,
  moneyExact,
} from "@/lib/catalog";
import { availabilityHeadline, leadTimeLabel, transitLabel } from "@/lib/fulfilment";
import { Guarantee } from "@/components/guarantee";
import { SPECS, STEPS } from "@/lib/products";
import { liveCatalog } from "@/lib/live-catalog";
import { PACK_LABEL, faqJsonLd, productFaqs } from "@/lib/faq";
import { packJsonLd, productJsonLd } from "@/lib/product-jsonld";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

// the description quotes the live price, so metadata is generated per
// request rather than frozen at build time — this page is already
// force-dynamic for the same reason
export async function generateMetadata(): Promise<Metadata> {
  const priceLine = tinOnSale()
    ? `Launch price ${money(currentPrice("ice-tin"))} CAD, regularly ${money(CATALOG["ice-tin"].price)}.`
    : `${money(currentPrice("ice-tin"))} CAD, made to order in Vancouver.`;

  return pageMetadata({
    title: "The Ice Tin: cooled snus tin, cold for six hours",
    ogTitle: "The Ice Tin — a snus tin with an ice pack in the base",
    description: `A machined aluminium snus tin with an ice pack in the base. 25 pouches at fridge temperature for six hours. ${priceLine}`,
    path: "/products/ice-tin",
    image: {
      url: "/side-product.jpg",
      width: 1100,
      height: 1100,
      alt: "The Ice Tin, matte black machined aluminium, showing the lid and three stacked floors",
    },
  });
}

// live pricing, checked on every request
export const dynamic = "force-dynamic";

export default async function IceTinPage() {
  const tin = CATALOG["ice-tin"];
  const core = CATALOG["chillcore-3"];
  // Shopify is the authority for price once it can answer; the local
  // catalogue remains the fallback, so an outage degrades rather than breaks.
  const live = await liveCatalog();
  const liveTin = live?.["ice-tin"];

  const promoToday = freeShippingToday();
  const onSale = tinOnSale();
  const unitPrice = liveTin?.price ?? currentPrice("ice-tin");
  const packPrice = live?.["chillcore-3"]?.price ?? core.price;
  const FAQS = productFaqs(promoToday);

  return (
    <>
      <JsonLd id="product-json-ld" data={productJsonLd(unitPrice)} />
      <JsonLd id="pack-json-ld" data={packJsonLd(packPrice)} />
      <JsonLd
        id="breadcrumb-json-ld"
        data={breadcrumbJsonLd([{ name: tin.name, path: "/products/ice-tin" }])}
      />
      <JsonLd id="faq-json-ld" data={faqJsonLd(FAQS)} />
      <ViewContent productId={tin.id} />
      <FrostField />
      <ProductNav />

      <main className="pt-24 sm:pt-28">
        {/* buy box */}
        <section id="top" className="mx-auto max-w-7xl px-4 sm:px-6 scroll-mt-24">
          <TinBuyBox
            price={liveTin?.price}
            compareAt={liveTin ? liveTin.compareAt : undefined}
          />
        </section>

        {/* the price justification, kept close to the button — at this price
            the objection is what it costs, not what it does */}
        <section className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6">
          <Reveal className="grid grid-cols-1 gap-5 border-t border-frost/8 pt-10 sm:grid-cols-[minmax(0,20rem)_1fr] sm:gap-10">
            <h2 className="text-2xl leading-tight tracking-tight text-white-ice sm:text-3xl">
              What the price reflects.
            </h2>
            <p className="max-w-[62ch] text-sm leading-relaxed text-fog">
              Billet 6061-T6, machined in small batches in Vancouver. Two
              silicone O-rings and a double-start thread specified to keep
              sealing after several thousand cycles. Thirty-one prototypes
              preceded this revision, and the shell carries a lifetime
              warranty.
            </p>
          </Reveal>
        </section>

        <Offer />

        {/* stock and shipping reassurance */}
        <section className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6">
          <Reveal className="glass-edge relative overflow-hidden rounded-[2rem] bg-abyss/80 p-7 backdrop-blur-md sm:p-10">
            <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(46,157,200,0.24),transparent_65%)] blur-2xl" />
            <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-10">
              <PackageIcon size={32} weight="thin" className="text-ice-500" />
              <div>
                <h2 className="text-2xl leading-tight tracking-tight text-white-ice sm:text-3xl">
                  {availabilityHeadline()}
                </h2>
                <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-fog">
                  Tins are cut in batches rather than held in a warehouse, so
                  an order joins the next run instead of leaving a shelf.
                  That is {leadTimeLabel()} to dispatch and {transitLabel()}{" "}
                  in transit, and it is why every unit is checked by the
                  person who made it.
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* how it works */}
        <section className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.28em] text-ice-500 uppercase">
              How it works
            </p>
            <h2 className="mt-4 max-w-[20ch] text-3xl leading-[0.95] font-medium tracking-tighter text-white-ice sm:text-4xl">
              Three steps to set up.
            </h2>
          </Reveal>

          <ol className="mt-10 border-t border-frost/8">
            {STEPS.map((s, i) => (
              <Reveal
                as="li"
                key={s.n}
                delay={i * 90}
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
              </Reveal>
            ))}
          </ol>
        </section>

        {/* the details — clearly laid out, nothing left implicit */}
        <section className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.28em] text-ice-500 uppercase">
              The details
            </p>
            <h2 className="mt-4 max-w-[22ch] text-3xl leading-[0.95] font-medium tracking-tighter text-white-ice sm:text-4xl">
              What the order includes.
            </h2>
            <p className="mt-4 max-w-[56ch] text-sm leading-relaxed text-fog">
              One machined can and one Chillcore pack, supplied together. A
              single configuration, with no tiers or optional extras.
            </p>
          </Reveal>

          <Reveal as="dl" delay={80} className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-frost/8 sm:grid-cols-3">
            {SPECS.map((s) => (
              <div key={s.k} className="bg-paper p-5">
                <dt className="font-mono text-[11px] tracking-[0.18em] text-fog uppercase sm:text-[10px]">
                  {s.k}
                </dt>
                <dd className={`mt-1.5 text-sm text-frost ${s.mono ? "font-mono" : ""}`}>
                  {s.v}
                </dd>
              </div>
            ))}
          </Reveal>
        </section>

        {/* field notes — real testers, named, no star ratings */}
        <FieldNotes title="Tested before you get one." />

        {/* objections, answered before they're asked */}
        <section className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6">
          <div className="grid grid-cols-1 gap-8 border-t border-frost/8 pt-10 sm:grid-cols-3 sm:gap-10">
            <Reveal className="flex gap-4">
              <TruckIcon size={20} weight="light" className="mt-0.5 shrink-0 text-ice-500" />
              <div>
                <h3 className="text-sm font-medium text-white-ice">Shipping</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fog">
                  {promoToday
                    ? "Ships worldwide from Vancouver, BC. Free today on every order."
                    : `Ships worldwide from Vancouver, BC. ${money(SHIPPING_FLAT)} flat, and free on any order with a tin and a ${PACK_LABEL} in it.`}
                </p>
              </div>
            </Reveal>
            <Reveal delay={90} className="flex gap-4">
              <ShieldCheckIcon size={20} weight="light" className="mt-0.5 shrink-0 text-ice-500" />
              <div>
                <h3 className="text-sm font-medium text-white-ice">Warranty</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fog">
                  Lifetime warranty on the shell against cracking or a failed
                  thread. Email us and we replace it.
                </p>
              </div>
            </Reveal>
            <Reveal delay={180} className="flex gap-4">
              <PackageIcon size={20} weight="light" className="mt-0.5 shrink-0 text-ice-500" />
              <div>
                <h3 className="text-sm font-medium text-white-ice">What is in the box</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fog">
                  One tin, one Chillcore ice pack. We sell empty cans and ice
                  packs only — no nicotine or tobacco, ever.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* cross-sell — kept short, this page's job is the tin */}
        <section className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6">
          <Reveal className="glass-edge flex flex-col gap-6 rounded-[2rem] bg-paper/75 p-6 backdrop-blur-sm sm:flex-row sm:items-center sm:gap-8 sm:p-7">
            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-ink">
              <ProductArt product={core} sizes="96px" className="h-full w-full" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg leading-tight tracking-tight text-white-ice">{core.name}</h3>
              <p className="mt-1.5 max-w-[46ch] text-sm leading-relaxed text-fog">
                One pack ships in every tin. A three-pack keeps a frozen
                spare available at all times —{" "}
                <span className="text-frost">
                  ordered with a tin they add {money(bundlePair().step)}, which is{" "}
                  {moneyExact(bundlePair().total)} delivered against{" "}
                  {moneyExact(bundlePair().alone)} for the tin on its own.
                </span>
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
          </Reveal>
        </section>

        <Guarantee />

        {/* faq — the same questions as the FAQPage JSON-LD above, verbatim */}
        <section className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.28em] text-ice-500 uppercase">
              Questions
            </p>
            <h2 className="mt-4 max-w-[22ch] text-3xl leading-[0.95] font-medium tracking-tighter text-white-ice sm:text-4xl">
              Frequently asked questions.
            </h2>
          </Reveal>

          <Reveal as="dl" delay={80} className="mt-10 divide-y divide-frost/8 border-t border-frost/8">
            {FAQS.map((f) => (
              <div key={f.q} className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-[minmax(0,22rem)_1fr] sm:gap-10">
                <dt className="text-base font-medium text-white-ice">{f.q}</dt>
                <dd className="max-w-[58ch] text-sm leading-relaxed text-fog">{f.a}</dd>
              </div>
            ))}
          </Reveal>
        </section>

        {/* final push */}
        <FinalCta price={unitPrice} compareAt={onSale ? tin.price : null} action="top" />
      </main>

      <SiteFooter />
    </>
  );
}
