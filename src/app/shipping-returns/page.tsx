import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
import { pageMetadata } from "@/lib/seo";
import { SHIPPING_FLAT, freeShippingToday, money } from "@/lib/catalog";
import { SHIPS_FROM_STOCK, leadTimeLabel, transitLabel } from "@/lib/fulfilment";
import { GUARANTEE_BODY, GUARANTEE_DAYS, GUARANTEE_EXCEPTION } from "@/lib/guarantee";

export const metadata: Metadata = pageMetadata({
  title: "Shipping & returns",
  description: `Ships from Vancouver, BC: ${leadTimeLabel()} to dispatch, ${transitLabel()} in transit, ${money(SHIPPING_FLAT)} flat, free with a tin and a pack. ${GUARANTEE_DAYS}-day cold-or-refund returns.`,
  path: "/shipping-returns",
});

// the rate below depends on freeShippingToday(), which must be checked
// against the current date rather than baked in at build time
export const dynamic = "force-dynamic";

export default function ShippingReturnsPage() {
  const promoToday = freeShippingToday();

  return (
    <InfoPage
      path="/shipping-returns"
      eyebrow="Support"
      title="Shipping & returns"
      intro="Every order ships from Vancouver, BC. This page sets out how it travels, and what happens if something is wrong when it arrives."
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
                : `${money(SHIPPING_FLAT)} flat — free with a tin and a Chillcore pack`}
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
          A tracking number is emailed the morning an order leaves. On
          international orders, customs duties and import taxes are set by the
          destination country rather than by us, and are not included at
          checkout.
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
          with your order number and a prepaid return label is sent back.
          You do not need the original packaging, and the tin does not need to
          be unused — carrying it is how you find out whether it works.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          {GUARANTEE_EXCEPTION} If a pack&rsquo;s seal arrives compromised,
          that is a warranty replacement rather than a return.
        </p>
      </section>
    </InfoPage>
  );
}
