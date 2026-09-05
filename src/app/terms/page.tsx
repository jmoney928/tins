import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/info-page";
import { LegalMeta, Mail } from "@/components/legal";
import { CURRENCY_LABEL } from "@/lib/catalog";
import { GUARANTEE_DAYS } from "@/lib/guarantee";

export const metadata: Metadata = {
  title: "Terms of sale",
  description:
    "The terms and conditions that apply to purchases from Ice Tins Supply Co., including orders, pricing, delivery, returns, warranty and liability.",
  alternates: { canonical: "/terms" },
};

/**
 * Conventional terms in conventional order.
 *
 * Delivery times, shipping rates and the guarantee detail are referenced by
 * link rather than restated here. Terms that quote a figure the shop has
 * since changed are a written promise contradicting the checkout, and that
 * failure is not hypothetical on this site — the bundle price did exactly
 * that. One statement of a number, on the page that owns it.
 */
export default function TermsPage() {
  return (
    <InfoPage
      path="/terms"
      eyebrow="Legal"
      title="Terms of sale"
      intro="These terms and conditions apply to all purchases from Ice Tins Supply Co. Please read them before placing an order."
    >
      <LegalMeta />

      <section>
        <h2 className="text-lg font-medium text-white-ice">
          1. Agreement to these terms
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          These terms form a binding agreement between you and Ice Tins Supply
          Co. (&ldquo;Ice Tins&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), of
          8105 North Fraser Way, Burnaby, British Columbia V5J 5M8, Canada. By
          placing an order or using this website you agree to them. If you do
          not agree, please do not place an order.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">2. Eligibility</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          You must be of legal age to form a binding contract in your
          jurisdiction, and you must provide accurate and complete information
          when placing an order. We may refuse or cancel any order at our
          discretion.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">
          3. Products and descriptions
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          We sell machined metal containers and gel ice packs. Ice Tins does
          not sell, ship or supply nicotine, tobacco, or any consumable
          product, in any form or in any territory. Nothing on this website
          constitutes an offer to supply such products.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          We take care to describe products accurately, but colours,
          photography and finish may vary slightly, and specifications may be
          improved without notice. Performance figures are stated for the
          conditions described alongside them and are not guarantees for other
          conditions.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">
          4. Orders and acceptance
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Your order is an offer to purchase. A contract is formed only when we
          send you an order confirmation. If we are unable to fulfil an order,
          including where a product or price has been listed in error, we will
          cancel it and refund any payment in full.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">
          5. Pricing and payment
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Prices are stated in {CURRENCY_LABEL} and exclude applicable sales
          taxes, which are calculated and displayed at checkout. Payment is
          taken in full at the time of order by our payment provider. Prices,
          promotions and product availability may change at any time, but never
          for an order already accepted.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">
          6. Shipping and delivery
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Delivery estimates, shipping rates and dispatch times are set out on
          our{" "}
          <Link
            href="/shipping-returns"
            className="text-ice-700 underline underline-offset-2"
          >
            shipping and returns
          </Link>{" "}
          page and on the product page at the time of purchase. All such times
          are estimates given in good faith and are not guaranteed. Title and
          risk pass to you on delivery.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          You are responsible for any customs duties, import taxes and charges
          imposed by the destination country. These are not included at
          checkout and are not within our control.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">
          7. Returns and refunds
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Purchases are covered by our {GUARANTEE_DAYS}-day cold-or-refund
          guarantee. The full conditions, including how to start a return and
          the limited exceptions that apply, are set out on our{" "}
          <Link
            href="/shipping-returns"
            className="text-ice-700 underline underline-offset-2"
          >
            shipping and returns
          </Link>{" "}
          page. Nothing in these terms affects your statutory rights as a
          consumer.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">8. Warranty</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Products are covered by the warranty described on our{" "}
          <Link href="/warranty" className="text-ice-700 underline underline-offset-2">
            warranty
          </Link>{" "}
          page, which sets out what is covered, what is excluded and how to make
          a claim. Consumable items are not covered by that warranty.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">9. Acceptable use</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          You agree not to use this website for any unlawful purpose, to
          interfere with its operation or security, to purchase for resale
          without our written consent, or to access it by automated means
          without permission. Products are sold for personal use, and it is
          your responsibility to ensure that your use of them complies with the
          law where you live.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">
          10. Intellectual property
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          All content on this website, including text, photography, designs,
          product designs and trade marks, is owned by Ice Tins Supply Co. or
          its licensors and is protected by intellectual property law. You may
          not reproduce, distribute or create derivative works from it without
          our written permission, except as permitted by law. Media use of the
          assets published on our{" "}
          <Link href="/press" className="text-ice-700 underline underline-offset-2">
            press
          </Link>{" "}
          page is permitted on the terms stated there.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">11. Disclaimers</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          The website is provided on an &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo; basis. To the fullest extent permitted by law, we
          disclaim all warranties not expressly stated in these terms,
          including implied warranties of merchantability and fitness for a
          particular purpose. We do not warrant that the website will be
          uninterrupted or error free.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">
          12. Limitation of liability
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          To the fullest extent permitted by law, we are not liable for
          indirect, incidental, special, consequential or punitive damages, or
          for loss of profit, revenue, data or business, however caused. Our
          total liability arising out of or in connection with any order is
          limited to the amount you paid for that order.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Nothing in these terms excludes or limits liability for death or
          personal injury caused by negligence, for fraud or fraudulent
          misrepresentation, or for any other liability that cannot lawfully be
          excluded or limited. Some jurisdictions do not permit certain
          exclusions, in which case the limitations above apply only to the
          extent permitted.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">13. Indemnity</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          You agree to indemnify and hold harmless Ice Tins Supply Co. and its
          officers, employees and agents against any claim, loss or expense
          arising from your breach of these terms or your misuse of the website
          or the products.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">14. Force majeure</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          We are not liable for any delay or failure to perform caused by
          events beyond our reasonable control, including supply failures,
          carrier disruption, labour disputes, natural events and acts of
          government.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">
          15. Governing law and disputes
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          These terms are governed by the laws of the Province of British
          Columbia and the federal laws of Canada applicable in it, and the
          courts of British Columbia have exclusive jurisdiction. If you
          purchase as a consumer resident elsewhere, you retain the benefit of
          any mandatory consumer protection law of your country of residence.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">16. General</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          If any provision of these terms is held to be unenforceable, the
          remainder continues in effect. Our failure to enforce a provision is
          not a waiver of it. These terms, together with our{" "}
          <Link href="/privacy" className="text-ice-700 underline underline-offset-2">
            privacy policy
          </Link>{" "}
          and the pages referenced above, constitute the entire agreement
          between us in relation to your purchase.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">
          17. Changes and contact
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          We may revise these terms at any time. The version that applies to
          your purchase is the one published when your order was accepted, and
          the date at the top of this page shows when this version was issued.
          Questions about these terms should be sent to <Mail />.
        </p>
      </section>
    </InfoPage>
  );
}
