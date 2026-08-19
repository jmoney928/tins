import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
import { FREE_SHIPPING_OVER, SHIPPING_FLAT, freeShippingToday, money } from "@/lib/catalog";
import { SHIPS_FROM_STOCK, leadTimeLabel, transitLabel } from "@/lib/fulfilment";
import { GUARANTEE_BODY, GUARANTEE_EXCEPTION } from "@/lib/guarantee";

export const metadata: Metadata = {
  title: "Shipping & returns",
  alternates: { canonical: "/shipping-returns" },
};

// the rate below depends on freeShippingToday(), which must be checked
// against the current date rather than baked in at build time
export const dynamic = "force-dynamic";

export default function ShippingReturnsPage() {
  const promoToday = freeShippingToday();

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
              {SHIPS_FROM_STOCK ? "Processing" : "Lead time"}
            </dt>
            <dd className="mt-1.5 text-sm text-frost">{leadTimeLabel()}</dd>
          </div>
          <div className="bg-paper p-5">
            <dt className="font-mono text-[10px] tracking-[0.18em] text-fog uppercase">
              Rate
            </dt>
            <dd className="mt-1.5 text-sm text-frost">
              {promoToday
                ? "Free today, every order"
                : `${money(SHIPPING_FLAT)} flat, free over ${money(FREE_SHIPPING_OVER)}`}
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
              Transit
            </dt>
            <dd className="mt-1.5 text-sm text-frost">{transitLabel()}</dd>
          </div>
        </dl>
        <p className="mt-5 text-sm leading-relaxed text-fog">
          A tracking number goes out by email the morning your order leaves. On
          international orders, customs duties and import taxes (if any) are
          set by your country, not by us, and aren't included at checkout.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-white-ice">
          Returns — the cold-or-refund guarantee
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-frost">
          {GUARANTEE_BODY}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          Email{" "}
          <a href="mailto:shop@icetins.com" className="text-ice-700 underline underline-offset-2">
            shop@icetins.com
          </a>{" "}
          with your order number and we&rsquo;ll send a prepaid return label.
          You do not need the original packaging, and the tin does not need to
          be unused — carrying it is how you find out whether it works.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          {GUARANTEE_EXCEPTION} If a pack&rsquo;s seal arrived compromised,
          that is a warranty replacement rather than a return.
        </p>
      </section>
    </InfoPage>
  );
}
