import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/info-page";
import { LegalMeta, Mail } from "@/components/legal";

export const metadata: Metadata = {
  title: "Cookies",
  description:
    "Every cookie and stored value this site sets, named, with what it is for, how long it lasts and how to refuse it.",
  alternates: { canonical: "/cookies" },
};

/**
 * The table below is the real list, taken from lib/attribution.ts and the
 * cart context. A cookie page that describes a category of site rather than
 * this one is the kind of document that makes a regulator look harder, and it
 * is trivially checkable by anyone who opens their browser tools.
 *
 * If a cookie is added, removed or renamed anywhere in the codebase, this
 * array is the other half of that change.
 */
const COOKIES = [
  {
    name: "it_eid",
    who: "Ice Tins",
    what: "A random identifier with no meaning outside this site, so that a visit and a later purchase can be recognised as the same person for advertising measurement. It contains no name, email address or anything else about you.",
    life: "90 days",
  },
  {
    name: "it_utm",
    who: "Ice Tins",
    what: "The campaign parameters from the link that first brought you here, so we can tell which advertisement led to a sale.",
    life: "90 days",
  },
  {
    name: "_fbp",
    who: "Meta",
    what: "Set by the Meta Pixel to identify a browser across visits, and used for advertising measurement and targeting.",
    life: "90 days",
  },
  {
    name: "_fbc",
    who: "Meta",
    what: "Set when you arrive from a Meta advertisement, recording the click so the resulting purchase can be attributed to it.",
    life: "90 days",
  },
];

const STORED = [
  {
    name: "icetins:cart",
    what: "What is in your bag, so it survives a refresh or a closed tab. It stays in your browser and is never sent to us until you check out.",
    life: "Until you clear it or empty the bag",
  },
];

export default function CookiesPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Cookies"
      intro="Every cookie this site sets, by name, with what it does and how long it lasts. The list is short, and it is the whole list."
    >
      <LegalMeta />

      <section>
        <h2 className="text-lg font-medium text-white-ice">Cookies we set</h2>
        <div className="mt-5 flex flex-col gap-6 border-t border-frost/8 pt-5">
          {COOKIES.map((c) => (
            <div key={c.name}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-sm text-white-ice">{c.name}</span>
                <span className="font-mono text-[10px] tracking-[0.18em] text-ice-700 uppercase">
                  {c.who}
                </span>
                <span className="ml-auto font-mono text-[11px] text-fog/70">{c.life}</span>
              </div>
              <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-fog">
                {c.what}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">
          Stored in your browser, not a cookie
        </h2>
        <div className="mt-5 flex flex-col gap-6 border-t border-frost/8 pt-5">
          {STORED.map((c) => (
            <div key={c.name}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-sm text-white-ice">{c.name}</span>
                <span className="ml-auto font-mono text-[11px] text-fog/70">{c.life}</span>
              </div>
              <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-fog">
                {c.what}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">What we do not set</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          There is no analytics suite, no session recording, no heatmap, no
          advertising network other than Meta, and no third-party cookie beyond
          the two Meta ones named above. The shop has no accounts, so there is
          no login cookie either.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">Refusing them</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          The four cookies above are for advertising measurement, and refusing
          them does not affect anything you can do here — the bag, the checkout
          and the guarantee all work without them.
        </p>
        <ul className="mt-4 flex flex-col gap-2.5 text-sm leading-relaxed text-fog">
          <li>
            Every browser can block or delete cookies for a single site from
            its own settings, and clearing them here removes all four.
          </li>
          <li>
            Meta lets you control how your activity off its apps is used, from
            the Off-Facebook Activity settings in your Meta account.
          </li>
          <li>
            Browser-level tracking protection, or an extension that blocks
            Meta&rsquo;s script, stops the two Meta cookies from being set at
            all.
          </li>
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-fog">
          If you would rather we deleted the measurement records associated
          with you, email <Mail /> and we will. The{" "}
          <Link href="/privacy" className="text-ice-700 underline underline-offset-2">
            privacy policy
          </Link>{" "}
          explains what those records contain and who else holds them.
        </p>
      </section>
    </InfoPage>
  );
}
