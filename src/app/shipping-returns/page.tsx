import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
import { FREE_SHIPPING_OVER, SHIPPING_FLAT, money } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shipping & returns",
  alternates: { canonical: "/shipping-returns" },
};

export default function ShippingReturnsPage() {
  return (
    <InfoPage
      eyebrow="Support"
      title="Shipping & returns"
      intro="Everything ships from Vancouver, BC. Here's exactly how it moves, and what happens if something's wrong when it arrives."
    >
      <section>
        <h2 className="text-lg font-medium text-white-ice">Shipping</h2>
        <dl className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-frost/8 sm:grid-cols-2">
          <div className="bg-paper p-5">
            <dt className="font-mono text-[10px] tracking-[0.18em] text-fog uppercase">
              Processing
            </dt>
            <dd className="mt-1.5 text-sm text-frost">1–2 business days</dd>
          </div>
          <div className="bg-paper p-5">
            <dt className="font-mono text-[10px] tracking-[0.18em] text-fog uppercase">
              Rate
            </dt>
            <dd className="mt-1.5 text-sm text-frost">
              {money(SHIPPING_FLAT)} flat, free over {money(FREE_SHIPPING_OVER)}
            </dd>
          </div>
          <div className="bg-paper p-5">
            <dt className="font-mono text-[10px] tracking-[0.18em] text-fog uppercase">
              Origin
            </dt>
            <dd className="mt-1.5 text-sm text-frost">Vancouver, BC, Canada</dd>
          </div>
          <div className="bg-paper p-5">
            <dt className="font-mono text-[10px] tracking-[0.18em] text-fog uppercase">
              Coverage
            </dt>
            <dd className="mt-1.5 text-sm text-frost">Worldwide</dd>
          </div>
        </dl>
        <p className="mt-5 text-sm leading-relaxed text-fog">
          A tracking number goes out by email the morning your order leaves. On
          international orders, customs duties and import taxes (if any) are
          set by your country, not by us, and aren't included at checkout.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">Returns</h2>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          The Ice Tin can be returned unused, in its original packaging,
          within 30 days of delivery for a full refund of the item price.
          Email{" "}
          <a href="mailto:hello@icetins.com" className="text-ice-700 underline underline-offset-2">
            hello@icetins.com
          </a>{" "}
          with your order number and we'll send a return label.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Chillcore ice packs are a food-safe consumable — once one has been
          in a freezer, it can't be resold, so packs aren't returnable unless
          the seal arrived compromised. That's covered under warranty, not as
          a return.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Shipping costs on the original order aren't refunded unless the
          return is because of our error.
        </p>
      </section>
    </InfoPage>
  );
}
