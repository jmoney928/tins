import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/info-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Warranty claim",
  description: "Lifetime warranty on the Ice Tin shell against cracking or a failed thread. What is covered, what is not, and how to file a claim by email.",
  path: "/warranty",
});

export default function WarrantyPage() {
  return (
    <InfoPage
      path="/warranty"
      eyebrow="Support"
      title="Warranty claim"
      intro="The shell is covered for as long as you own it. This page sets out what that includes and how to make a claim."
    >
      <section>
        <h2 className="text-lg font-medium text-white-ice">What is covered</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          A lifetime warranty on the aluminium shell against cracking or a
          failed thread under normal use. If a floor will not seat, a thread
          strips, or the shell cracks, we replace it. Your order email is
          sufficient — there is no receipt to produce.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">What is not covered</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Cosmetic wear from normal carry — fine scuffing on the Cerakote
          finish, a duller logo after months in a pocket — is not a defect
          but a finish behaving as aluminium does. Damage from drops, from
          being run over, or from modification is not covered. The Chillcore
          ice pack is a consumable and falls outside this warranty; a pack
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
          <a href="mailto:shop@icetins.com" className="text-ice-700 underline underline-offset-2">
            shop@icetins.com
          </a>{" "}
          with your order number, two or three photographs of the fault, and
          a line on what happened. Most claims are answered within two
          business days.
        </p>
      </section>
    </InfoPage>
  );
}
