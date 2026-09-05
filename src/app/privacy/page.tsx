import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/info-page";
import { LegalMeta, Mail } from "@/components/legal";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How Ice Tins Supply Co. collects, uses, shares and protects personal information, and the choices available to you.",
  alternates: { canonical: "/privacy" },
};

/**
 * Conventional structure and conventional language, deliberately.
 *
 * An earlier draft named each processor and each cookie individually. That
 * reads well and is accurate on the day it is written, but it makes the page
 * a dependency of the infrastructure: change an email provider and the policy
 * is silently false, which is a worse position than a general one. Categories
 * of recipient stay true across a vendor change.
 *
 * The one rule this file keeps from that draft: nothing here may describe
 * something the site does not do. Boilerplate that mentions accounts,
 * loyalty schemes or data sales would be exactly the sort of untrue statement
 * a policy exists to avoid.
 */
export default function PrivacyPage() {
  return (
    <InfoPage
      path="/privacy"
      eyebrow="Legal"
      title="Privacy policy"
      intro="This policy explains how Ice Tins Supply Co. collects, uses, shares and protects personal information when you visit this website or place an order, and the choices available to you."
    >
      <LegalMeta />

      <section>
        <h2 className="text-lg font-medium text-white-ice">1. Overview</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Ice Tins Supply Co. (&ldquo;Ice Tins&rdquo;, &ldquo;we&rdquo;,
          &ldquo;us&rdquo;) operates www.icetins.com and is the business
          responsible for the personal information described in this policy.
          We are located at 8105 North Fraser Way, Burnaby, British Columbia
          V5J 5M8, Canada.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          This policy applies to the website and to orders placed through it.
          It does not apply to third-party websites we link to, which publish
          their own policies.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">
          2. Information we collect
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          <span className="text-frost">Information you provide.</span> When you
          place an order or contact us, we collect your name, email address,
          shipping address, order details and any information contained in
          your correspondence. Payment card details are collected and processed
          by our payment provider and are not received or stored by us.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          <span className="text-frost">Information collected automatically.</span>{" "}
          When you visit the website we collect technical and usage
          information, including IP address, browser and device type, pages
          viewed, referring website and any campaign parameters contained in
          the link you arrived through. Some of this is collected using cookies
          and similar technologies, described in our{" "}
          <Link href="/cookies" className="text-ice-700 underline underline-offset-2">
            cookie policy
          </Link>
          .
        </p>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          We do not collect payment card numbers, government identification, or
          any special category of personal information, and the website has no
          user accounts.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">
          3. How we use information
        </h2>
        <ul className="mt-3 flex flex-col gap-2.5 text-sm leading-relaxed text-fog">
          <li>To process, fulfil and deliver your order.</li>
          <li>To send order confirmations, dispatch notices and service messages.</li>
          <li>To respond to enquiries, warranty claims and returns.</li>
          <li>To measure the performance of our advertising and website.</li>
          <li>To detect and prevent fraud and misuse.</li>
          <li>To comply with our legal, tax and accounting obligations.</li>
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-fog">
          Where the law requires a legal basis for processing, we rely on
          performance of a contract for order fulfilment, our legitimate
          interests for site security and advertising measurement, your consent
          where consent is required, and compliance with a legal obligation for
          record keeping.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">
          4. How we share information
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          We do not sell personal information. We share it only with service
          providers who process it on our behalf and under contract, in the
          following categories:
        </p>
        <ul className="mt-3 flex flex-col gap-2.5 text-sm leading-relaxed text-fog">
          <li>E-commerce and payment providers, to take and record orders.</li>
          <li>Shipping and logistics providers, to deliver them.</li>
          <li>Email service providers, to send order and service messages.</li>
          <li>
            Hosting, infrastructure and security providers, to operate the
            website.
          </li>
          <li>
            Advertising and measurement partners, including Meta Platforms, to
            report on advertising performance.
          </li>
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-fog">
          We may also disclose information where required by law, to enforce
          our terms, to protect our rights or the safety of others, or in
          connection with a merger, acquisition or sale of assets.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">
          5. Cookies and similar technologies
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          We use cookies and similar technologies to operate the website, to
          remember the contents of your bag, and to measure advertising. Our{" "}
          <Link href="/cookies" className="text-ice-700 underline underline-offset-2">
            cookie policy
          </Link>{" "}
          sets out the categories we use and how to refuse or remove them.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">
          6. International transfers
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          We are based in Canada and some of our service providers are located
          in the United States and elsewhere. Personal information may
          therefore be stored and processed outside your country of residence
          and may be accessible to courts and authorities in those countries
          under their laws. Where required, we put appropriate safeguards in
          place for those transfers.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">7. Retention</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          We keep personal information only for as long as necessary for the
          purposes described in this policy. Order and transaction records are
          retained for the period required by Canadian tax and business law.
          Information collected for advertising measurement is retained for a
          limited period and then expires. Correspondence is retained for as
          long as needed to resolve the matter and to honour any applicable
          warranty.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">8. Security</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          We use appropriate technical and organisational measures to protect
          personal information, including encryption in transit and restricted
          access to systems that hold it. No method of transmission or storage
          is completely secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">
          9. Your rights and choices
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Subject to local law, you may request access to the personal
          information we hold about you, request that it be corrected or
          deleted, object to or restrict certain processing, request a portable
          copy, and withdraw consent where we rely on it. You may also opt out
          of marketing messages at any time using the unsubscribe link in any
          such message.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          To exercise a right, contact us at <Mail />. We will respond within
          the period required by applicable law. We may need to verify your
          identity, and we may retain information we are legally required to
          keep.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          If you are not satisfied with our response, you may complain to the
          Office of the Privacy Commissioner of Canada or to the supervisory
          authority in your country of residence.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">
          10. Children&rsquo;s privacy
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          The website is not directed at children, and we do not knowingly
          collect personal information from children. If you believe a child
          has provided us with personal information, contact us at <Mail /> and
          we will delete it.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">
          11. Changes to this policy
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          We may update this policy from time to time. The date at the top of
          this page shows when it was last revised, and any material change
          will be brought to the attention of customers by email.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">12. Contact us</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Ice Tins Supply Co., 8105 North Fraser Way, Burnaby, British
          Columbia V5J 5M8, Canada. Email <Mail />.
        </p>
      </section>
    </InfoPage>
  );
}
