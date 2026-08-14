import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
import { SPECS } from "@/lib/products";

export const metadata: Metadata = {
  title: "The workshop",
  alternates: { canonical: "/workshop" },
};

export default function WorkshopPage() {
  return (
    <InfoPage
      eyebrow="Company"
      title="The workshop"
      intro="Ice Tins Supply Co. makes one thing: a machined can with an ice pack built in. Everything here is in service of that one object."
    >
      <section>
        <h2 className="text-lg font-medium text-white-ice">One product, on purpose</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          We don't run colourways or seasonal drops. There's one tin,
          machined to one spec, and a refill pack for the part that wears
          out. Narrowing to one SKU means every hour goes into making that
          one thing better instead of managing a catalogue.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">Small batches</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Machined out of Vancouver, BC, in runs sized to what we can
          inspect properly rather than what a factory minimum demands. When
          a batch sells out, we machine more — there's no artificial scarcity
          and no waitlist theatre, just a queue for the next run.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">What "machined right" means here</h2>
        <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-frost/8 sm:grid-cols-3">
          {SPECS.slice(0, 6).map((s) => (
            <div key={s.k} className="bg-paper p-5">
              <dt className="font-mono text-[10px] tracking-[0.18em] text-fog uppercase">
                {s.k}
              </dt>
              <dd className={`mt-1.5 text-sm text-frost ${s.mono ? "font-mono" : ""}`}>
                {s.v}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </InfoPage>
  );
}
