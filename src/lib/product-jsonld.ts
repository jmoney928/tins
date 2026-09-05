import { CATALOG, SHIPPING_FLAT } from "./catalog";
import { LEAD_TIME_WEEKS, TRANSIT_DAYS } from "./fulfilment";
import { GUARANTEE_DAYS } from "./guarantee";
import { aggregateRatingJsonLd } from "./social-proof";
import { ORG_ID, ORG_NAME, PACK_ID, PRODUCT_ID, absoluteUrl } from "./seo";

const PDP_URL = absoluteUrl("/products/ice-tin");

/**
 * The tin as a schema.org Product, shared by the product page and the home
 * page (which now sells it directly). Both carry the same @id, so a crawler
 * sees one product referenced from two URLs rather than two products.
 *
 * InStock is correct — the tin can be bought today — but on its own it
 * tells Google the same thing a warehoused product would, and this one
 * takes a fortnight to make. handlingTime is where that belongs, so the
 * machine-readable promise matches the one on the page.
 */
export function productJsonLd(unitPriceCents: number) {
  const tin = CATALOG["ice-tin"];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": PRODUCT_ID,
    name: tin.name,
    description: tin.blurb,
    sku: tin.id,
    image: tin.gallery.map((g) => absoluteUrl(g)),
    brand: { "@type": "Brand", name: ORG_NAME },
    manufacturer: { "@id": ORG_ID },
    material: "6061-T6 aluminium, Cerakote finish",
    color: "Matte black",
    width: { "@type": "QuantitativeValue", value: 68, unitCode: "MMT" },
    height: { "@type": "QuantitativeValue", value: 41, unitCode: "MMT" },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Capacity", value: "25 pouches" },
      { "@type": "PropertyValue", name: "Cold hold", value: "6 hours at 22°C" },
      { "@type": "PropertyValue", name: "Seal", value: "Two silicone O-rings, IPX6" },
      { "@type": "PropertyValue", name: "Included", value: "One Chillcore ice pack" },
    ],
    isRelatedTo: { "@id": PACK_ID },
    offers: {
      "@type": "Offer",
      url: PDP_URL,
      priceCurrency: "CAD",
      price: (unitPriceCents / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": ORG_ID },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: (SHIPPING_FLAT / 100).toFixed(2),
          currency: "CAD",
        },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "CA" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: LEAD_TIME_WEEKS.min * 7,
            maxValue: LEAD_TIME_WEEKS.max * 7,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: TRANSIT_DAYS.min,
            maxValue: TRANSIT_DAYS.max,
            unitCode: "DAY",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "CA",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: GUARANTEE_DAYS,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
        refundType: "https://schema.org/FullRefund",
      },
    },
    // omitted entirely until there is a real average and somewhere on this
    // page a reader can check it — rating markup that a visitor cannot see
    // is what earns a manual penalty, not rich results
    aggregateRating: aggregateRatingJsonLd(),
  };
}

/** The refill, as the accessory it is. */
export function packJsonLd(priceCents: number) {
  const pack = CATALOG["chillcore-3"];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": PACK_ID,
    name: pack.name,
    description: pack.blurb,
    sku: pack.id,
    image: pack.image ? [absoluteUrl(pack.image)] : undefined,
    brand: { "@type": "Brand", name: ORG_NAME },
    isAccessoryOrSparePartFor: { "@id": PRODUCT_ID },
    offers: {
      "@type": "Offer",
      url: PDP_URL,
      priceCurrency: "CAD",
      price: (priceCents / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": ORG_ID },
    },
  };
}
