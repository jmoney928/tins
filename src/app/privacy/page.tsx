import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/info-page";
import { LegalMeta, Mail } from "@/components/legal";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What Ice Tins Supply Co. collects, why, who processes it, how long it is kept, and how to have it removed.",
  alternates: { canonical: "/privacy" },
};

/**
 * Written against what the code actually does rather than from a template.
 * Every processor named here appears in the codebase, and every cookie listed
 * is one the site genuinely sets — see lib/attribution.ts for the two of them
 * that are ours. If a processor is removed, this page has to change with it.
 */
export default function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Privacy policy"
      intro="What we collect, why we collect it, who else handles it, and how to have it removed. This describes the site as it actually works, not a category of site."
    >
      <LegalMeta />

      <section>
        <h2 className="text-lg font-medium text-white-ice">Who is responsible</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Ice Tins Supply Co., 8105 North Fraser Way, Burnaby, British
          Columbia V5J 5M8, Canada, is responsible for the personal
          information described here. Questions, requests and complaints all
          go to <Mail />, which is read by a person rather than a queue.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">What we collect</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Three groups, and nothing outside them.
        </p>
        <dl className="mt-5 flex flex-col gap-5 border-t border-frost/8 pt-5">
          <div>
            <dt className="font-mono text-[11px] tracking-[0.18em] text-ice-700 uppercase">
              When you order
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-fog">
              Your email address, name, shipping address, the items ordered and
              the amount paid. Payment card details are entered on the payment
              page and are handled by our payment processor; they never reach
              our servers and we never see them.
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] tracking-[0.18em] text-ice-700 uppercase">
              When you browse
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-fog">
              Pages viewed, IP address, browser and device type, the referring
              link, and any campaign parameters in the URL that brought you
              here. This is used to measure which advertisements lead to sales
              and for no other purpose. The{" "}
              <Link href="/cookies" className="text-ice-700 underline underline-offset-2">
                cookies page
              </Link>{" "}
              lists each identifier by name.
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] tracking-[0.18em] text-ice-700 uppercase">
              When you contact us
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-fog">
              Your email address and whatever you write to us, kept as long as
              it takes to resolve the matter and to honour the warranty if the
              message concerned one.
            </dd>
          </div>
        </dl>
        <p className="mt-5 text-sm leading-relaxed text-fog">
          We do not ask for a date of birth, a phone number, or an account
          password, because the shop has no accounts to log into.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">Who else handles it</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          We use a small number of service providers, each for one job. They
          process your information on our instructions and are not permitted to
          use it for their own purposes, except where a provider is separately
          responsible for its own advertising data, as noted.
        </p>
        <ul className="mt-5 flex flex-col gap-3 border-t border-frost/8 pt-5">
          {[
            ["Shopify", "Checkout, payment processing and order records. Canada and the United States."],
            ["Meta Platforms", "Advertising measurement. We send Meta a record of purchases so that advertising can be attributed, including a hashed form of your email address and IP address. Meta is separately responsible for what it does with advertising data. United States."],
            ["Resend", "Sends order confirmations and, if a checkout is not completed, one reminder. United States."],
            ["Vercel", "Hosts the site and keeps short-lived server logs, which include IP addresses. United States."],
            ["Supabase", "Stores order records. United States."],
          ].map(([who, what]) => (
            <li key={who} className="flex flex-col gap-1 sm:flex-row sm:gap-6">
              <span className="shrink-0 font-mono text-[11px] tracking-[0.14em] text-ice-700 uppercase sm:w-40">
                {who}
              </span>
              <span className="text-sm leading-relaxed text-fog">{what}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm leading-relaxed text-fog">
          We do not sell personal information, and we do not share it with
          anyone beyond the providers above.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">
          Where your information goes
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Several of the providers above are based in the United States, so
          your information is stored and processed outside Canada and outside
          the European Economic Area. It is therefore accessible to the courts
          and authorities of those countries under their own laws. We use
          providers who commit to appropriate safeguards for those transfers,
          and we keep the number of them small for exactly this reason.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">
          Why we are allowed to hold it
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Order information is held because it is necessary to perform the
          contract you entered into when you bought something — we cannot ship
          a tin without an address. Advertising measurement is held on the
          basis of consent where consent is required, and on the basis of our
          legitimate interest in knowing which advertisements work where it is
          not. Where we rely on consent you may withdraw it at any time, and
          the{" "}
          <Link href="/cookies" className="text-ice-700 underline underline-offset-2">
            cookies page
          </Link>{" "}
          explains how.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">How long we keep it</h2>
        <ul className="mt-3 flex flex-col gap-2.5 text-sm leading-relaxed text-fog">
          <li>
            Order records: seven years, because Canadian tax law requires
            business records to be retained for that period.
          </li>
          <li>
            Advertising identifiers: ninety days from your most recent visit,
            after which they expire on their own.
          </li>
          <li>
            An abandoned checkout: thirty days, after which it is deleted
            whether or not the order was ever completed.
          </li>
          <li>Correspondence: as long as the matter is open, plus the warranty period if it concerned one.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">Your rights</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Wherever you live, you may ask us for a copy of the personal
          information we hold about you, ask us to correct it, or ask us to
          delete it. If you are in the European Economic Area or the United
          Kingdom you may additionally object to processing, ask us to restrict
          it, and ask for your information in a portable form.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Email <Mail /> and say what you want done. We will respond within
          thirty days. We may need to keep order records that tax law requires
          us to retain, and we will say so plainly rather than refusing
          without a reason.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          If you are unhappy with how we have handled a request, you may
          complain to the Office of the Privacy Commissioner of Canada, or to
          the data protection authority in your own country if you are in the
          European Economic Area or the United Kingdom.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">Marketing email</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          We send an order confirmation, and one reminder if a checkout is
          started but not completed. There is no newsletter and no mailing
          list. Every message carries an unsubscribe link, and unsubscribing
          stops everything except the receipt for an order you have actually
          placed.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">Age</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          This site sells empty machined containers and ice packs. It does not
          sell, ship or supply nicotine or tobacco in any form. It is not
          directed at children, and we do not knowingly collect information
          from anyone under sixteen. If you believe a child has given us
          personal information, write to <Mail /> and it will be deleted.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">Changes</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          If this policy changes, the date at the top of the page changes with
          it. Material changes to how we use existing information will be sent
          to anyone who has ordered from us, rather than left here to be
          noticed.
        </p>
      </section>
    </InfoPage>
  );
}
