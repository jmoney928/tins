import { Reveal } from "./reveal";
import { homeFaqs } from "@/lib/faq";

/**
 * The four questions that stop a first-time buyer. The list lives in
 * lib/faq.ts so the FAQPage JSON-LD on the home page and llms.txt read the
 * same answers.
 */

export function HomeFaq() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.28em] text-ice-500 uppercase">
            Before you order
          </p>
          <h2 className="mt-4 max-w-[22ch] text-3xl leading-[0.95] font-medium tracking-tighter text-white-ice sm:text-4xl">
            Four things people ask first.
          </h2>
        </Reveal>

        <Reveal as="dl" delay={80} className="mt-10 divide-y divide-frost/8 border-t border-frost/8">
          {homeFaqs().map((f) => (
            <div
              key={f.q}
              className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-[minmax(0,22rem)_1fr] sm:gap-10"
            >
              <dt className="text-base font-medium text-white-ice">{f.q}</dt>
              <dd className="max-w-[58ch] text-sm leading-relaxed text-fog">{f.a}</dd>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
