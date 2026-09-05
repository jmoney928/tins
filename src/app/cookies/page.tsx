import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/info-page";
import { LegalMeta, Mail } from "@/components/legal";

export const metadata: Metadata = {
  title: "Cookie policy",
  description:
    "How Ice Tins Supply Co. uses cookies and similar technologies, the categories in use, and how to control them.",
  alternates: { canonical: "/cookies" },
};

/**
 * Categories rather than a table of individual cookie names.
 *
 * A named table is exact on the day it is written and wrong the moment a
 * cookie is renamed, added by a third party, or dropped — and it is the sort
 * of detail nobody remembers to update. Categories describe what is happening
 * without going stale, which is why almost every brand states them this way.
 *
 * The categories below must stay honest: there is genuinely no analytics
 * suite, session recording or personalisation on this site, so none of them
 * is listed.
 */
const CATEGORIES = [
  {
    name: "Strictly necessary",
    body: "Required for the website to function, including keeping the contents of your bag and carrying you securely through checkout. These cannot be switched off without breaking the site, and they do not require consent.",
  },
  {
    name: "Functional",
    body: "Remember choices you make so the site behaves consistently between visits. Refusing these does not prevent you from ordering.",
  },
  {
    name: "Advertising and measurement",
    body: "Set by us and by our advertising partners, including Meta Platforms, to understand which advertisements lead to visits and purchases, and to measure campaign performance. These are the only cookies on this site set by a third party.",
  },
];

export default function CookiesPage() {
  return (
    <InfoPage
      path="/cookies"
      eyebrow="Legal"
      title="Cookie policy"
      intro="This policy explains how Ice Tins Supply Co. uses cookies and similar technologies on www.icetins.com, and how you can control them."
    >
      <LegalMeta />

      <section>
        <h2 className="text-lg font-medium text-white-ice">1. What cookies are</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Cookies are small text files placed on your device when you visit a
          website. They are widely used to make websites work, to remember your
          preferences, and to report on how a site is used. This policy also
          covers similar technologies such as pixels and local storage, which
          perform comparable functions.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">
          2. Categories we use
        </h2>
        <div className="mt-5 flex flex-col gap-6 border-t border-frost/8 pt-5">
          {CATEGORIES.map((c) => (
            <div key={c.name}>
              <h3 className="font-mono text-[11px] tracking-[0.18em] text-ice-700 uppercase">
                {c.name}
              </h3>
              <p className="mt-2 max-w-[64ch] text-sm leading-relaxed text-fog">
                {c.body}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm leading-relaxed text-fog">
          We do not use cookies for session recording, behavioural profiling
          beyond advertising measurement, or personalisation of the content you
          see, and this website has no user accounts.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">
          3. Third-party cookies
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Advertising and measurement cookies may be set by our advertising
          partners when you visit the site. Those partners act as independent
          controllers of the data they collect and handle it under their own
          privacy policies, which we recommend reading alongside ours.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">
          4. How long they last
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Some cookies last only for your browsing session and are removed when
          you close your browser. Others persist for a limited period so that a
          return visit can be recognised, and expire automatically. No cookie
          set by this site is intended to persist beyond the period necessary
          for the purpose it serves.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">
          5. How to control cookies
        </h2>
        <ul className="mt-3 flex flex-col gap-2.5 text-sm leading-relaxed text-fog">
          <li>
            Every major browser allows you to block or delete cookies for an
            individual website, or for all websites, from its settings.
          </li>
          <li>
            Most browsers offer tracking protection that prevents third-party
            advertising cookies from being set at all.
          </li>
          <li>
            Advertising platforms provide their own controls over how activity
            on other websites is used. For Meta, these are available in the
            off-site activity settings of your Meta account.
          </li>
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-fog">
          Blocking advertising and measurement cookies does not affect your
          ability to browse the site, place an order, or rely on our guarantee.
          Blocking strictly necessary cookies may prevent parts of the site
          from working.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">
          6. Changes and contact
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          We may update this policy from time to time, and the date at the top
          of this page shows when it was last revised. How the information
          collected through cookies is used more generally is described in our{" "}
          <Link href="/privacy" className="text-ice-700 underline underline-offset-2">
            privacy policy
          </Link>
          . Questions may be sent to <Mail />.
        </p>
      </section>
    </InfoPage>
  );
}
