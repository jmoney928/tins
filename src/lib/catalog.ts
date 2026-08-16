/** Prices are in cents everywhere. Floats and money do not mix. */
export const CURRENCY = "cad";
export const CURRENCY_LABEL = "CAD";

export type Product = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  /** null when the product is drawn rather than photographed */
  image: string | null;
  gallery: string[];
  /** parallel to gallery — one descriptive alt per photo, not a repeated product name */
  galleryAlt: string[];
  blurb: string;
  points: string[];
  specs: { k: string; v: string }[];
  /** null when unlimited; otherwise the current stock count */
  remaining: number | null;
};

export const CATALOG: Record<string, Product> = {
  "ice-tin": {
    id: "ice-tin",
    name: "The Ice Tin",
    tagline: "Cerakote over 6061-T6, bead-blasted matte black",
    price: 5999,
    image: "/side-product.jpg",
    gallery: ["/side-product.jpg", "/dark-product.jpg", "/three-layer-gallery.jpg"],
    galleryAlt: [
      "The Ice Tin at an angle, showing the machined lid and the three stacked floors",
      "The Ice Tin on a dark stone surface, matte black Cerakote finish",
      "The Ice Tin exploded into its three floors: lid, perforated pouch tray, and ice pack base",
    ],
    blurb:
      "Three floors in the footprint of a standard can: spent pouches up top, twenty-five fresh in the middle, a slim ice pack in the base. Sealed, it holds fridge temperature for six hours.",
    points: [
      "Three floors: spent, fresh, ice",
      "Perforated floor so the cold rises",
      "Two silicone O-rings, IPX6",
      "One Chillcore pack in the box",
      "Lifetime warranty on the shell",
    ],
    specs: [
      { k: "Diameter", v: "68 mm" },
      { k: "Height", v: "41 mm" },
      { k: "Floors", v: "8 / 20 / 13 mm" },
      { k: "Holds", v: "25 fresh + 15 spent" },
      { k: "Cold hold", v: "6 hours" },
      { k: "Shell", v: "6061-T6 aluminium" },
    ],
    remaining: 142,
  },
  "chillcore-3": {
    id: "chillcore-3",
    name: "Chillcore three-pack",
    tagline: "Three slim ice packs — one in, one freezing, one spare",
    price: 1999,
    image: "/ice-packs.jpg",
    // the annotated shot carries the dimensions, so it earns a place in the gallery
    gallery: ["/ice-packs.jpg", "/ice-packs-dims.jpg"],
    galleryAlt: [
      "Three Chillcore ice packs stacked, matte black with the engraved emblem",
      "Three Chillcore ice packs with dimensions labelled: 6.7 cm across, 1.3 cm thick each",
    ],
    blurb:
      "One pack ships inside every can, which is enough until you want it cold again the same day. With three you stop waiting on the freezer: one in the base, one setting up, one spare in the door.",
    points: [
      "Three discs per pack",
      "Ninety minutes to freeze",
      "Food-safe gel, sealed",
      "Drops into the base and clicks flat",
    ],
    specs: [
      { k: "In the pack", v: "3 discs" },
      { k: "Each", v: "6.7 × 1.3 cm" },
      { k: "Freeze", v: "90 min" },
      { k: "Weight", v: "18 g each" },
      { k: "Fill", v: "Food-safe gel" },
    ],
    remaining: null,
  },
};

/** Set so a tin plus a refill pack clears it — that is the order we want. */
export const FREE_SHIPPING_OVER = 7500;
export const SHIPPING_FLAT = 800;

/**
 * One-day free-shipping promo, triggered by adding to cart. Anchored to a
 * real calendar date rather than "today" as a tautology — it genuinely
 * expires, rather than being an evergreen banner that always claims
 * urgency. Checked against server time in the checkout API, which never
 * trusts a client-supplied shipping amount; the client copy here is
 * display-only.
 */
const FREE_SHIPPING_PROMO_DATE = "2026-08-16";

export function freeShippingToday(now: Date = new Date()) {
  return now.toISOString().slice(0, 10) === FREE_SHIPPING_PROMO_DATE;
}

/**
 * One-week sale on the tin. CATALOG["ice-tin"].price stays the real,
 * actually-charged-until-now regular price ($59.99) — that is what makes a
 * "was $59.99" strikethrough honest. The sale price is a separate,
 * genuinely time-boxed override checked fresh on every read, the same
 * pattern as freeShippingToday: a real calendar window that expires on its
 * own rather than a static discount someone has to remember to revert.
 */
export const TIN_SALE_PRICE = 4999;
const TIN_SALE_START = "2026-08-16";
const TIN_SALE_END = "2026-08-22"; // inclusive — a real 7-day window

export function tinOnSale(now: Date = new Date()) {
  const d = now.toISOString().slice(0, 10);
  return d >= TIN_SALE_START && d <= TIN_SALE_END;
}

/** The price to actually charge/display right now for any product. */
export function currentPrice(id: string, now?: Date): number {
  if (id === "ice-tin" && tinOnSale(now)) return TIN_SALE_PRICE;
  return CATALOG[id].price;
}

export const money = (cents: number) =>
  `$${(cents / 100).toFixed(2).replace(/\.00$/, "")}`;

/** Amount plus the currency code, for anywhere the code is not already shown. */
export const priceWithCurrency = (cents: number) =>
  `${money(cents)} ${CURRENCY_LABEL}`;
