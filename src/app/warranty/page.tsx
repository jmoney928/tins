import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = {
  title: "Warranty claim",
  alternates: { canonical: "/warranty" },
};

export default function WarrantyPage() {
  return (
    <InfoPage
      eyebrow="Support"
      title="Warranty claim"
      intro="The shell is covered for as long as you own it. Here's what that means and how to use it."
    >
      <section>
        <h2 className="text-lg font-medium text-white-ice">What's covered</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          A lifetime warranty on the aluminium shell against cracking or a
          failed thread under normal use. If a floor won't seat, a thread
          strips, or the shell cracks, we'll replace it — no receipt hunting,
          your order email is enough.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">What's not</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Cosmetic wear from normal carry — fine scuffing on the Cerakote
          finish, a duller logo after months in a pocket — isn't a defect,
          it's aluminium doing what aluminium does. Damage from drops, being
          run over, or modification isn't covered either. The Chillcore ice
          pack is a consumable and isn't covered under this warranty; a pack
          that arrives with a compromised seal is handled as a{" "}
          <Link href="/shipping-returns" className="text-ice-700 underline underline-offset-2">
            return
          </Link>
          , not a claim.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">How to file one</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Email{" "}
          <a href="mailto:hello@icetins.com" className="text-ice-700 underline underline-offset-2">
            hello@icetins.com
          </a>{" "}
          with your order number, a couple of photos of the issue, and a line
          on what happened. Most claims get a straight yes or no within a
          couple of days.
        </p>
      </section>
    </InfoPage>
  );
}
