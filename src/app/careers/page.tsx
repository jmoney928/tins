import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = {
  title: "Careers",
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return (
    <InfoPage
      eyebrow="Company"
      title="Careers"
      intro="No open roles right now — we're a small team machining one product."
    >
      <section>
        <h2 className="text-lg font-medium text-white-ice">Speculative applications</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          If that changes, it'll be for hands-on work — machining,
          fulfilment, or customer support — before anything else. If that's
          you and you'd rather not wait for a posting, send a short note to{" "}
          <a href="mailto:hello@icetins.com" className="text-ice-700 underline underline-offset-2">
            hello@icetins.com
          </a>
          . We keep good ones on file.
        </p>
      </section>
    </InfoPage>
  );
}
