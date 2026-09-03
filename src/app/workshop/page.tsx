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
      intro="Ice Tins Supply Co. designs and sells a machined aluminium tin with a built-in ice pack tray, based in Vancouver, BC."
    >
      <section>
        <h2 className="text-lg font-medium text-white-ice">What we make</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          One tin, machined to one spec, plus a refill ice pack sold
          separately. Keeping the range simple lets us focus on getting that
          one product right rather than spreading across a wider catalogue.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">How it is made</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Each tin is machined in small batches and checked before it ships.
          When a batch is spoken for, the next one is cut.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">The specs</h2>
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
