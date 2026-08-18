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
    price: 7999,
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

/**
 * At the $79.99 list price a single tin clears this on its own; during the
 * sale it takes a tin plus a refill pack ($49.99 + $19.99 is short of it).
 * Left where it is deliberately — moving it would change the shipping offer
 * mid-sale.
 */
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
 * One-week sale on the tin. CATALOG["ice-tin"].price is the regular list
 * price ($79.99) — what the tin charges the moment this window closes, not
 * a number invented to inflate the strikethrough. The sale price is a
 * separate, genuinely time-boxed override checked fresh on every read, the
 * same pattern as freeShippingToday: a real calendar window that expires on
 * its own rather than a static discount someone has to remember to revert.
 *
 * Note: the list price moved 59.99 -> 79.99 at the same time this window
 * opened, so "was $79.99" is a forward-looking list price rather than one
 * the store has actually charged. Canadian ordinary-price rules want the
 * struck-through price to have been sold in volume or offered in good faith
 * for a substantial period; letting $79.99 stand on its own after Aug 22 is
 * what makes it true.
 */
export const TIN_SALE_PRICE = 4999;
const TIN_SALE_START = "2026-08-16";
const TIN_SALE_END = "2026-08-22"; // inclusive — a real 7-day window

export function tinOnSale(now: Date = new Date()) {
  const d = now.toISOString().slice(0, 10);
  return d >= TIN_SALE_START && d <= TIN_SALE_END;
}

/** "Aug 22" — the real end date, for urgency copy that stays true. */
export function tinSaleEndsLabel() {
  const [y, m, d] = TIN_SALE_END.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Tin plus a refill pack, taken off the order once.
 *
 * Modelled as a saving rather than a fixed bundle price on purpose: a fixed
 * "$89.99 bundle" would be *more* than the two items cost during the sale,
 * so it would quietly stop being an offer for exactly the week it matters
 * most. As a deduction it stacks on whatever the live price is —
 * $59.99 during the sale, $89.99 after it — and needs no maintenance when
 * the window closes.
 *
 * $9.99 rather than a round $10 so both totals land on a real price point.
 */
export const BUNDLE_SAVING = 999;
const BUNDLE_PARTS = ["ice-tin", "chillcore-3"] as const;

/** The saving for a bag, in cents. Applies once, not once per pair. */
export function bundleSaving(lines: { id: string; qty: number }[], now?: Date): number {
  const has = (id: string) => lines.some((l) => l.id === id && l.qty > 0);
  if (!BUNDLE_PARTS.every(has)) return 0;

  // never let the deduction exceed the bag — a saving bigger than the order
  // would hand Stripe a negative total
  const gross = lines.reduce((n, l) => n + currentPrice(l.id, now) * l.qty, 0);
  return Math.min(BUNDLE_SAVING, gross);
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
