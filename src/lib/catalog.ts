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
    tagline: "Twenty-five fresh, held cold, with a sealed floor for spent pouches",
    price: 7999,
    image: "/side-product.jpg",
    /**
     * Ordered by the question each shot answers, not by how pretty it is:
     * what is it, how big is it, what is inside, does the cold claim hold up,
     * and only then the atmosphere. galleryAlt stays index-parallel —
     * ProductArt looks the alt up by position in this array.
     */
    gallery: [
      "/side-product.jpg",
      "/in-hand.jpg",
      "/three-layer-gallery.jpg",
      "/condensation.jpg",
      "/three-floors.jpg",
      "/lid-slate.jpg",
      "/dark-product.jpg",
      "/frost-burst.jpg",
    ],
    galleryAlt: [
      "The Ice Tin at an angle, showing the machined lid and the three stacked floors",
      "The Ice Tin held in one hand, roughly the width of a palm, against a charcoal knit sweater",
      "The Ice Tin exploded into its three floors: lid, perforated pouch tray, and ice pack base",
      "Close-up of condensation beading on the tin and frost crystals along the seam between two floors",
      "The Ice Tin on a white background, the three stacked floors and their seams clearly visible",
      "The engraved Ice Tins Supply Co. lid seen from above on dark slate",
      "The Ice Tin on a dark stone surface, matte black Cerakote finish",
      "The Ice Tin surrounded by a burst of powdered ice and cold vapour",
    ],
    blurb:
      "Three compartments in the footprint of a standard can. Twenty-five fresh pouches sit on a perforated tray above a slim ice pack, which holds fridge temperature for six hours. A sealed upper floor takes spent pouches, keeping them separate until they can be disposed of.",
    // benefit first, engineering second — the order a buyer cares about
    points: [
      "Sealed top floor for spent pouches",
      "Twenty-five held at fridge temperature for 6 hours",
      "Perforated floor for direct cold transfer",
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
      "One pack ships inside every can, which is sufficient for a single daily cycle. A three-pack removes the wait between uses: one in the base, one freezing, one in reserve.",
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
 * Shipping is free on one order shape only: a tin with a Chillcore pack.
 *
 * Not a spend threshold. A threshold rewards whatever gets the total over
 * the line, which on a two-product shop means two tins as readily as the
 * refill nobody thinks to buy — and the refill is the repeat purchase this
 * business actually runs on. Tying the perk to the pair points it at the
 * order worth encouraging rather than at the bigger one.
 */
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
 * Launch pricing, with no countdown.
 *
 * This replaces a seven-day sale that expired on Aug 22. A deadline that
 * close is worse than no deadline: everyone arriving on the 23rd would have
 * met the worst version of the offer — full price, no anchor, no reason to
 * act — and the urgency was doing nothing for the majority of traffic that
 * never saw it in time.
 *
 * ── Read this before leaving it running ──────────────────────────────────
 * $79.99 is the price this tin sells for when launch pricing ends, and the
 * shop has never actually charged it. That is defensible for an
 * introductory period on a new product; it stops being defensible if it runs
 * indefinitely, because Canadian ordinary-price rules expect a struck-through
 * price to have been sold in volume or offered in good faith for a
 * substantial period. Either move to $79.99 in due course, or drop the
 * comparison and simply sell at $49.99. Set LAUNCH_PRICING to false to do
 * the former; every surface follows.
 */
export const LAUNCH_PRICING = true;
export const TIN_SALE_PRICE = 4999;

/** Kept as a function so callers read a live value, not a frozen import. */
export function tinOnSale(_now: Date = new Date()) {
  return LAUNCH_PRICING;
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

/**
 * The bundle condition, stated once. The $9.99 discount and free shipping
 * both hang off it, so they can never disagree about what qualifies.
 */
export function hasBundle(lines: { id: string; qty: number }[]): boolean {
  return BUNDLE_PARTS.every((id) => lines.some((l) => l.id === id && l.qty > 0));
}

/** Free shipping is earned by the pair, not by the size of the order. */
export function qualifiesForFreeShipping(lines: { id: string; qty: number }[]): boolean {
  return hasBundle(lines);
}

/** The saving for a bag, in cents. Applies once, not once per pair. */
export function bundleSaving(lines: { id: string; qty: number }[], now?: Date): number {
  if (!hasBundle(lines)) return 0;

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
