import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/info-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Stockists",
  description: "Ice Tins sells online only, direct from Vancouver, BC. No retailer is authorised to carry the tin. Wholesale enquiries by email.",
  path: "/stockists",
});

export default function StockistsPage() {
  return (
    <InfoPage
      path="/stockists"
      eyebrow="Company"
      title="Stockists"
      intro="Ice Tins sells online only. There is no shop to visit and no stockist list to search."
    >
      <section>
        <h2 className="text-lg font-medium text-white-ice">Buying one</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Every Ice Tin ships direct from Vancouver, BC, through{" "}
          <Link href="/products/ice-tin" className="text-ice-700 underline underline-offset-2">
            the product page
          </Link>
          . That is the only place we sell. No retailer is authorised to
          carry the tin, so anything offered elsewhere should be treated as
          unverified.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">Want to carry it?</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          If you run a shop and want to stock the tin, email{" "}
          <a href="mailto:shop@icetins.com" className="text-ice-700 underline underline-offset-2">
            shop@icetins.com
          </a>{" "}
          with a short description of the shop. Wholesale is not open yet, but
          enquiries are kept on file.
        </p>
      </section>
    </InfoPage>
  );
}
