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
import {
  LEAD_TIME_WEEKS,
  TRANSIT_DAYS,
  availabilityHeadline,
  dispatchSentence,
  dispatchShort,
  leadTimeLabel,
  transitLabel,
} from "@/lib/fulfilment";
import { GUARANTEE_BODY, GUARANTEE_EXCEPTION, GUARANTEE_MEDIUM } from "@/lib/guarantee";
import { aggregateRatingJsonLd } from "@/lib/social-proof";
import { Guarantee } from "@/components/guarantee";
import { SPECS, STEPS } from "@/lib/products";
import { liveCatalog } from "@/lib/live-catalog";
import { ORG_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";

const PDP_URL = absoluteUrl("/products/ice-tin");

/** Named once so the shipping rule reads the same wherever it appears. */
const PACK_LABEL = "Chillcore pack";

// the description below quotes the live price, so metadata is generated
// per request rather than frozen at build time — this page is already
// force-dynamic for the same reason (live stock)
export async function generateMetadata(): Promise<Metadata> {
  const priceLine = tinOnSale()
    ? `Launch price ${money(currentPrice("ice-tin"))} CAD (regular ${money(CATALOG["ice-tin"].price)}).`
    : `${money(currentPrice("ice-tin"))} CAD, made to order in Vancouver.`;

  return {
    title: "The Ice Tin",
    description: `A three-floor snus can holding 25 fresh pouches: spent on top, fresh in the middle, a slim ice pack underneath. Machined 6061-T6, stays cold for 6 hours. ${priceLine}`,
    alternates: { canonical: "/products/ice-tin" },
    openGraph: {
      title: "The Ice Tin — Cold to the last pouch",
      description:
        "25 pouches across three floors, with a slim ice pack in the base. Stays cold for 6 hours. Machined to order in Vancouver, shipped worldwide.",
      url: PDP_URL,
      type: "website",
      images: [
        { url: absoluteUrl("/side-product.jpg"), width: 1100, height: 1100, alt: "The Ice Tin" },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "The Ice Tin — Cold to the last pouch",
      description:
        "25 pouches across three floors, with a slim ice pack in the base. Stays cold for 6 hours.",
      images: [absoluteUrl("/side-product.jpg")],
    },
  };
}

// live stock, checked on every request — a scarcity claim that goes stale is a lie
export const dynamic = "force-dynamic";

/**
 * Answers real questions the rest of the page already makes — nothing here
 * says anything the blurb, specs, or objections section doesn't. The
 * FAQPage JSON-LD below is generated from this same array, so the
 * structured data can never drift from what a visitor actually reads. It's
 * a function of the shipping promo (not a module-level constant) so the
 * shipping answer stays accurate on the date the promo expires — this page
 * is force-dynamic, so it re-evaluates on every request.
 */
function buildFaqs(promoToday: boolean) {
  return [
    {
      q: "What is inside The Ice Tin?",
      a: "Three floors in the footprint of a standard can: an empty top floor for spent pouches, a middle floor that holds 25 fresh pouches, and a slim Chillcore ice pack in the base.",
    },
    {
      q: "How long does it keep pouches cold?",
      a: "Six hours at room temperature with the lid sealed on its two O-rings.",
    },
    {
      q: "Does the ice pack come with it?",
      a: "Yes. One Chillcore pack ships inside every tin. Three-packs are sold separately for customers who want a frozen spare available at all times.",
    },
    {
      q: "What is the tin made from?",
      a: "Cerakote-finished 6061-T6 aluminium, bead-blasted matte black, 68 mm across and 41 mm tall.",
    },
    {
      q: "Where does it ship from, and how fast?",
      a: promoToday
        ? `Everything leaves Vancouver, BC. ${dispatchShort()} Shipping is free today on every order.`
        : `Everything leaves Vancouver, BC. ${dispatchShort()} Shipping is ${money(SHIPPING_FLAT)} flat, and free on any order holding both a tin and a ${PACK_LABEL}.`,
    },
    {
      q: "Is there nicotine or tobacco inside?",
      a: "No. Ice Tins Supply Co. sells empty machined cans and ice packs only, and does not sell, ship or supply nicotine or tobacco in any form.",
    },
    {
      q: "What does the warranty cover?",
      a: "A lifetime warranty on the shell against cracking or a failed thread.",
    },
    {
      // the skeptic's question, answered head-on rather than avoided — the
      // doubt is the objection, so meeting it is worth more than restating
      // the benefit
      q: "Do pouches really go stale otherwise?",
      a: "Yes, in the way a beer goes stale warm: still usable, no longer the thing you paid for. Warmth dries a pouch out and flattens its flavour as the moisture is lost. Held at fridge temperature, a pouch taken at hour six is materially the same as one taken at hour one. Our test conditions are a frozen pack, a closed lid and a 22°C room, which holds for six hours; the same can with an empty tray holds approximately one.",
    },
    {
      q: "When will it actually arrive?",
      a: `Count ${leadTimeLabel()} for your tin to be made and dispatched, then ${transitLabel()} for the courier. A tracking number is emailed the morning it leaves the workshop. The wait is stated here, on the shop page and at checkout rather than after the payment.`,
    },
    {
      q: "What if it is not for me?",
      a: `${GUARANTEE_MEDIUM} There is no requirement that it be unused or in its original packaging. ${GUARANTEE_EXCEPTION}`,
    },
    {
      q: "Can I replace the O-rings or the ice pack?",
      a: "Yes. Chillcore packs are sold in three-packs and seat directly into the base. The two silicone O-rings are standard sizes and fit by hand; contact shop@icetins.com and replacements will be sent at no charge for as long as you own the tin.",
    },
    {
      // the price is the objection at this end of the market, so it is
      // answered here too — this array feeds the FAQPage JSON-LD, which is
      // where answer engines read it
      q: `Why is it ${money(currentPrice("ice-tin"))}?`,
      a: "The tin is machined from solid 6061-T6 in small batches rather than pressed from sheet, the threads and O-rings are specified to keep sealing for six hours after a year of daily use, and the shell is covered for life. The price reflects a working cold system rather than a lid on a container.",
    },
  ];
}

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
  const FAQS = buildFaqs(promoToday);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: tin.name,
    description: tin.blurb,
    sku: tin.id,
    image: tin.gallery.map((g) => absoluteUrl(g)),
    brand: { "@type": "Brand", name: ORG_NAME },
    offers: {
      "@type": "Offer",
      url: PDP_URL,
      priceCurrency: "CAD",
      price: (unitPrice / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: ORG_NAME },
      /**
       * InStock is correct — the tin can be bought today — but on its own it
       * tells Google the same thing a warehoused product would, and this one
       * takes a fortnight to make. handlingTime is where that belongs, so the
       * machine-readable promise matches the one on the page rather than
       * quietly contradicting it in a shopping result.
       */
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "CA" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: LEAD_TIME_WEEKS.min * 7,
            maxValue: LEAD_TIME_WEEKS.max * 7,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: TRANSIT_DAYS.min,
            maxValue: TRANSIT_DAYS.max,
            unitCode: "DAY",
          },
        },
      },
    },
    // omitted entirely until there is a real average and somewhere on this
    // page a reader can check it — rating markup that a visitor cannot see
    // is what earns a manual penalty, not rich results
    aggregateRating: aggregateRatingJsonLd(),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: tin.name, item: PDP_URL },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      {/* plain <script>, not next/script — see layout.tsx for why */}
      <script
        id="product-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        id="breadcrumb-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        id="faq-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
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
