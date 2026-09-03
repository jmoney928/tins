import { Benefits } from "@/components/benefits";
import { Collection } from "@/components/collection";
import { Explore } from "@/components/explore";
import { FrostField } from "@/components/frost-field";
import { Hero } from "@/components/hero";
import { Offer } from "@/components/offer";
import { Why } from "@/components/why";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { Ticker } from "@/components/ticker";

// the hero and shop card show live sale/shipping-promo pricing, which
// depends on today's date — must not be frozen at build time
export const dynamic = "force-dynamic";

/**
 * The home page sells and routes; it no longer tries to be every page at
 * once.
 *
 * The cold system, the build and the field notes were anchors inside this
 * document, which meant one URL competing for every query the site could
 * plausibly answer. They are real pages now, and Explore links to them with
 * summaries rather than repeating them.
 */
export default function Home() {
  return (
    <>
      <FrostField />
      <SiteNav />

      <main>
        <Hero />
        <Ticker />
        {/* the problem before the product: a warm pouch is something most
            visitors have made peace with, so the case that it is a problem
            at all has to be made before the engineering means anything */}
        <Why />
        <Benefits />
        <Collection />
        {/* the offer as a receipt, both columns totalled to the door */}
        <Offer />
        <Explore />
      </main>

      <SiteFooter />
    </>
  );
}
