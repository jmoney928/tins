import { Anatomy } from "@/components/anatomy";
import { Carriers } from "@/components/carriers";
import { ColdSystem } from "@/components/cold-system";
import { Collection } from "@/components/collection";
import { Drop } from "@/components/drop";
import { Facts } from "@/components/facts";
import { FrostField } from "@/components/frost-field";
import { Hero } from "@/components/hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { Ticker } from "@/components/ticker";

export default function Home() {
  return (
    <>
      <FrostField />
      <SiteNav />

      <main>
        <Hero />
        <Ticker />
        <ColdSystem />
        <Collection />
        <Anatomy />
        <Facts />
        <Carriers />
        <Drop />
      </main>

      <SiteFooter />
    </>
  );
}
