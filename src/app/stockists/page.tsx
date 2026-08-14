import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = {
  title: "Stockists",
  alternates: { canonical: "/stockists" },
};

export default function StockistsPage() {
  return (
    <InfoPage
      eyebrow="Company"
      title="Stockists"
      intro="We're online-only right now — there's no store to walk into and no locator to search."
    >
      <section>
        <h2 className="text-lg font-medium text-white-ice">Buying one</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Every Ice Tin ships direct from Vancouver, BC, through{" "}
          <Link href="/products/ice-tin" className="text-ice-700 underline underline-offset-2">
            the product page
          </Link>
          . That's the only place we sell — nobody else is authorized to
          carry it yet, so treat anything sold elsewhere as unverified.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">Want to carry it?</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          If you run a shop and want to stock the tin, email{" "}
          <a href="mailto:hello@icetins.com" className="text-ice-700 underline underline-offset-2">
            hello@icetins.com
          </a>{" "}
          with a bit about the store. We're not set up for wholesale yet, but
          we're keeping a list.
        </p>
      </section>
    </InfoPage>
  );
}
