import { Anatomy } from "@/components/anatomy";
import { Benefits } from "@/components/benefits";
import { Carriers } from "@/components/carriers";
import { Guarantee } from "@/components/guarantee";
import { ColdSystem } from "@/components/cold-system";
import { Collection } from "@/components/collection";
import { Facts } from "@/components/facts";
import { FrostField } from "@/components/frost-field";
import { Hero } from "@/components/hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { Ticker } from "@/components/ticker";

// the hero and shop card show live sale/shipping-promo pricing, which
// depends on today's date — must not be frozen at build time
export const dynamic = "force-dynamic";

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
        <ColdSystem />
        <Collection />
        <Guarantee />
        <Anatomy />
        <Facts />
        <Carriers />
      </main>

      <SiteFooter />
    </>
  );
}
