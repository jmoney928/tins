import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Ice pack care",
  description: "How to freeze, clean and store the Chillcore gel ice pack so it lasts for years: lay it flat, 90 minutes to set, wipe clean, never puncture or microwave it.",
  path: "/ice-pack-care",
});

export default function IcePackCarePage() {
  return (
    <InfoPage
      path="/ice-pack-care"
      eyebrow="Support"
      title="Ice pack care"
      intro="The Chillcore pack is sealed and food-safe, but it remains a gel pack. A few rules keep it working for years rather than months."
    >
      <section>
        <h2 className="text-lg font-medium text-white-ice">Freezing</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Lay it flat in the freezer. Ninety minutes sets it fully, and
          leaving it longer does no harm — a spare can be kept frozen
          indefinitely.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">Cleaning</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Wipe with a damp cloth. Do not put it through a dishwasher or leave
          it to soak; the seal is built for cold, not for sustained heat or
          pressure.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">What to avoid</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Do not puncture it, microwave it, or refreeze it once the seal has
          failed: food-safe gel is only food-safe while it is sealed. A pack
          that arrives punctured or leaking is a warranty matter rather than
          something to work around.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">When to replace it</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          If it stops holding its shape after freezing, or the seal looks
          swollen or split, stop using it. A three-pack keeps a spare in
          rotation, so there is never a wait for one to freeze.
        </p>
      </section>
    </InfoPage>
  );
}
