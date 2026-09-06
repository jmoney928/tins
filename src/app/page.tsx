import { Anywhere } from "@/components/anywhere";
import { Collection } from "@/components/collection";
import { CtaBar } from "@/components/cta-bar";
import { HowItWorks } from "@/components/how-it-works";
import { WhatItIs } from "@/components/what-it-is";
import { Explore } from "@/components/explore";
import { FieldNotes } from "@/components/field-notes";
import { FinalCta } from "@/components/final-cta";
import { FrostField } from "@/components/frost-field";
import { Guarantee } from "@/components/guarantee";
import { Hero } from "@/components/hero";
import { HomeFaq } from "@/components/home-faq";
import { Offer } from "@/components/offer";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { Ticker } from "@/components/ticker";
import { Why } from "@/components/why";
import { JsonLd } from "@/components/json-ld";
import { CATALOG, currentPrice, tinOnSale } from "@/lib/catalog";
import { faqJsonLd, homeFaqs } from "@/lib/faq";
import { productJsonLd } from "@/lib/product-jsonld";

// the hero and shop card show live sale/shipping-promo pricing, which
// depends on today's date — must not be frozen at build time
export const dynamic = "force-dynamic";

/**
 * The home page is a single-product funnel, in the order a first-time
 * visitor needs things:
 *
 *   hook      — the claim, the object, the price, a button that adds it
 *   problem   — why a warm pouch is a problem at all (most have made peace)
 *   product   — the tin itself, with a direct add and a link to the detail
 *   offer     — the two ways to order, both totalled to the door
 *   proof     — three testers, quoted as written
 *   risk      — the cold-or-refund guarantee
 *   objections— the four questions asked before a first order
 *   ask       — the last button, then the reading for anyone still deciding
 *
 * There is a way to buy in the first screen, the third section and the
 * last, and nothing between them sends the reader off the page. The topic
 * links come after the final ask, for the reader who wants the long
 * version before deciding.
 */
export default function Home() {
  const price = currentPrice("ice-tin");
  const compareAt = tinOnSale() ? CATALOG["ice-tin"].price : null;

  return (
    <>
      {/* the page sells the tin directly now, so it carries the product
          entity too — same @id as the product page, one product, two URLs */}
      <JsonLd id="home-product-json-ld" data={productJsonLd(price)} />
      <JsonLd id="home-faq-json-ld" data={faqJsonLd(homeFaqs())} />
      <FrostField />
      <SiteNav tone="dark" />

      <main>
        <Hero />
        <Ticker />
        {/* show it, sell it, explain one thing, sell it again — a way to
            buy under every idea, so the reader who is convinced at that
            point never scrolls to find one */}
        <WhatItIs />
        <CtaBar />
        <HowItWorks />
        <CtaBar note="One ice pack comes in the box." />
        <Why />
        <CtaBar />
        <Anywhere />
        <CtaBar note="Same size as a normal can." />
        <Collection />
        <Offer />
        <FieldNotes title="People who carry one." />
        <CtaBar />
        <Guarantee />
        <CtaBar note="Try it for 30 days. Send it back if it is not cold." />
        <HomeFaq />
        <FinalCta price={price} compareAt={compareAt} action="add" />
        <Explore />
      </main>

      <SiteFooter />
    </>
  );
}
