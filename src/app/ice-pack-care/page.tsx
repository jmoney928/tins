import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = {
  title: "Ice pack care",
  alternates: { canonical: "/ice-pack-care" },
};

export default function IcePackCarePage() {
  return (
    <InfoPage
      eyebrow="Support"
      title="Ice pack care"
      intro="The Chillcore pack is sealed and food-safe, but it's still a gel pack — a few rules keep it working for years, not months."
    >
      <section>
        <h2 className="text-lg font-medium text-white-ice">Freezing</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Lay it flat in the freezer. Ninety minutes gets it fully set;
          leaving it longer doesn't hurt anything, so it's fine to keep a
          spare frozen and ready.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">Cleaning</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Wipe with a damp cloth. Don't run it through a dishwasher or soak
          it — the seal is built for cold, not sustained heat or pressure.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">What to avoid</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Don't puncture, microwave, or refreeze it if the seal has already
          failed — food-safe gel is only food-safe while it's sealed. If a
          pack ever arrives punctured or leaking, that's a warranty issue,
          not something to work around.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">When to replace it</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          If it stops holding its shape after freezing, or the seal looks
          swollen or split, stop using it. A fresh three-pack keeps a spare
          in rotation so you're never waiting on one to freeze.
        </p>
      </section>
    </InfoPage>
  );
}
