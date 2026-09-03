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
      intro="There are no open roles at present. Ice Tins is a small team making one product."
    >
      <section>
        <h2 className="text-lg font-medium text-white-ice">Speculative applications</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          When that changes it will be for hands-on work first — machining,
          fulfilment or customer support. If that describes you and you would
          rather not wait for a posting, send a short note to{" "}
          <a href="mailto:shop@icetins.com" className="text-ice-700 underline underline-offset-2">
            shop@icetins.com
          </a>
          . Applications are kept on file.
        </p>
      </section>
    </InfoPage>
  );
}
