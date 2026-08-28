import { Benefits } from "@/components/benefits";
import { Collection } from "@/components/collection";
import { Explore } from "@/components/explore";
import { FrostField } from "@/components/frost-field";
import { Hero } from "@/components/hero";
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
        {/* the felt benefits come before the engineering: disposal and
            freshness are what a cold visitor recognises, the cold system is
            what justifies the price once they are interested */}
        <Benefits />
        <Collection />
        <Explore />
      </main>

      <SiteFooter />
    </>
  );
}
