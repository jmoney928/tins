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
  blurb: string;
  points: string[];
  specs: { k: string; v: string }[];
  /** null when unlimited; otherwise the Drop 01 allocation */
  remaining: number | null;
};

export const CATALOG: Record<string, Product> = {
  "ice-tin": {
    id: "ice-tin",
    name: "The Ice Tin",
    tagline: "Cerakote over 6061-T6, bead-blasted matte black",
    price: 5999,
    image: "/tin-lid.jpg",
    gallery: ["/tin-lid.jpg", "/three-layer.png", "/xray-section.png"],
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

export const money = (cents: number) =>
  `$${(cents / 100).toFixed(2).replace(/\.00$/, "")}`;

/** Amount plus the currency code, for anywhere the code is not already shown. */
export const priceWithCurrency = (cents: number) =>
  `${money(cents)} ${CURRENCY_LABEL}`;
