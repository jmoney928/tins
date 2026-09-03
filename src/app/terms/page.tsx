import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/info-page";
import { LegalMeta, Mail } from "@/components/legal";
import { CURRENCY_LABEL, SHIPPING_FLAT, money } from "@/lib/catalog";
import { leadTimeLabel, transitLabel } from "@/lib/fulfilment";
import { GUARANTEE_DAYS } from "@/lib/guarantee";

export const metadata: Metadata = {
  title: "Terms of sale",
  description:
    "The terms you buy under: what we sell, what it costs, when it arrives, how to send it back, and whose law governs the sale.",
  alternates: { canonical: "/terms" },
};

/**
 * Every number on this page is read from the same constants the shop charges
 * and displays, rather than typed out. Terms that quote a lead time or a
 * shipping rate the site has since changed are worse than no terms: they are
 * a written promise that contradicts the checkout.
 */
export default function TermsPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Terms of sale"
      intro="The terms you buy under. They are short because the shop is simple: one product, one configuration, one place to buy it."
    >
      <LegalMeta />

      <section>
        <h2 className="text-lg font-medium text-white-ice">Who you are buying from</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Ice Tins Supply Co., 8105 North Fraser Way, Burnaby, British
          Columbia V5J 5M8, Canada. Placing an order means you accept these
          terms. If something here does not work for you, write to <Mail />{" "}
          before you order rather than after.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">What we sell</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          A machined aluminium container and gel ice packs. Nothing else. Ice
          Tins Supply Co. does not sell, ship or supply nicotine, tobacco or
          any consumable product in any form, anywhere, and nothing on this
          site should be read as an offer to do so. What you put in the tin is
          your own business and your own responsibility, including compliance
          with the law where you live.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          You must be old enough to enter a contract where you live in order
          to buy from us.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">Orders and acceptance</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          An order is an offer to buy. The contract forms when we send the
          confirmation email, not when the payment clears. If we cannot fulfil
          an order — a pricing error, an item we cannot make, an address we
          cannot ship to — we will cancel it and refund you in full, and we
          will tell you why.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">Prices and payment</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          All prices are in {CURRENCY_LABEL} and are shown before tax. Any
          sales tax is calculated and displayed at checkout. Payment is taken
          in full at checkout by our payment processor; we never receive or
          store your card details.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Prices can change, but never for an order already placed. Where a
          price is shown alongside a higher one struck through, the struck
          figure is our regular list price for the product.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">Delivery</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Each tin is machined to order. The current lead time is{" "}
          {leadTimeLabel()} to dispatch, then {transitLabel()} in transit.
          Shipping is {money(SHIPPING_FLAT)} flat, and free on any order
          containing both a tin and a Chillcore three-pack. These are
          estimates in good faith, not guaranteed dates; a courier delay is
          not something we can promise away.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Risk passes to you on delivery. On international orders, customs
          duties and import taxes are set by the destination country, are
          payable by you, and are not included at checkout. Full detail is on
          the{" "}
          <Link
            href="/shipping-returns"
            className="text-ice-700 underline underline-offset-2"
          >
            shipping and returns
          </Link>{" "}
          page.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">
          Returns and the guarantee
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          The {GUARANTEE_DAYS}-day cold-or-refund guarantee is a contractual
          promise, not a goodwill gesture: use the tin normally for{" "}
          {GUARANTEE_DAYS} days and, if it does not hold pouches colder or does
          not keep spent ones separated, send it back for a full refund with
          return shipping paid. It does not need to be unused or in its
          original packaging.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Opened Chillcore packs are not returnable, because a gel pack that
          has been frozen cannot be resold. A pack whose seal arrives
          compromised is a warranty replacement rather than a return. Nothing
          here affects your statutory rights.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">Warranty</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          The aluminium shell carries a lifetime warranty against cracking or
          a failed thread under normal use, for as long as you own it. What is
          and is not covered, and how to claim, is set out on the{" "}
          <Link href="/warranty" className="text-ice-700 underline underline-offset-2">
            warranty page
          </Link>
          . The ice pack is a consumable and is not covered.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">Liability</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          We are responsible for loss that is a foreseeable result of our
          breaking these terms or failing to use reasonable care. We are not
          responsible for loss that was not foreseeable, or for business
          losses. Our total liability for any order is limited to what you paid
          for it. Nothing in these terms limits liability for death or personal
          injury caused by negligence, for fraud, or for anything else that
          cannot lawfully be limited.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">Governing law</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          These terms are governed by the laws of British Columbia and the
          applicable laws of Canada, and the courts of British Columbia have
          jurisdiction. If you buy as a consumer elsewhere, you keep the
          protection of the mandatory consumer law of the country you live in.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">Changes</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          These terms may change. The version that applies to your order is the
          one published when you placed it, and the date at the top of this
          page tells you which that was. Your{" "}
          <Link href="/privacy" className="text-ice-700 underline underline-offset-2">
            privacy policy
          </Link>{" "}
          rights are separate and are not affected by changes here.
        </p>
      </section>
    </InfoPage>
  );
}
