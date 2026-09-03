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

export const SHIPPING_FLAT = 800;

/**
 * Free shipping threshold, set to sit between a tin on its own and a tin with
 * a pack.
 *
 * This was a pure "cart contains both products" rule, which is the offer we
 * actually want. Shopify's native automatic discounts cannot express it — they
 * condition on spend or quantity, not on cart composition — and the exact rule
 * would need a Shopify Function, which is an app deployment for one line of
 * logic.
 *
 * $55 reproduces the offer at every price point that exists today:
 *
 *   tin alone        $49.99  → under, pays $8
 *   pack alone       $19.99  → under, pays $8
 *   tin + pack       $69.98  → over, free   (the pair, as intended)
 *
 * The one behaviour it adds is that two tins ($99.98) also ship free. That is
 * a bigger order paying us more, so it is a tolerable thing to give away, and
 * it is the reason this number lives here rather than being inferred from the
 * bundle.
 *
 * It must stay equal to the minimum on the Shopify free-shipping discount. If
 * these two disagree, the cart shows one total and the checkout charges
 * another.
 */
export const FREE_SHIPPING_OVER = 5500;

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
 * most. As a deduction it stacks on whatever the live price is and needs no
 * maintenance when the window closes.
 *
 * ── Why $4.99, and why this number was wrong ────────────────────────────
 * This read $9.99 and Shopify was giving $4.99. The site advertised the pair
 * at $59.99 and the checkout charged $64.99, so every bundle order was billed
 * five dollars over the displayed price — the dangerous direction of the two.
 * It surfaced only because the offer was rewritten as a total a shopper could
 * read, which made it worth measuring against what Shopify actually returns.
 *
 * $9.99 was also too deep to want back. Two incentives were stacking on one
 * $19.99 item — the discount plus $8 of waived shipping — which would have
 * put the three-pack out at $2, ninety percent off, and left the $19.99
 * standalone price impossible to defend. At $4.99 the pack adds $7.00 to a
 * single-tin order: plainly a deal, and no longer two prices for one product.
 *
 * MUST equal the "Buy X get Y" amount on the Shopify automatic discount.
 * Verified against it by POSTing a tin and a pack to /api/checkout and
 * reading cost.total, which is the only thing that proves these agree — the
 * Storefront cart does not evaluate automatic discounts, so nothing short of
 * a real cart total will catch a drift like this one.
 */
export const BUNDLE_SAVING = 499;
const BUNDLE_PARTS = ["ice-tin", "chillcore-3"] as const;

/**
 * The bundle condition, stated once. The bundle discount and free shipping
 * both hang off it, so they can never disagree about what qualifies.
 */
export function hasBundle(lines: { id: string; qty: number }[]): boolean {
  return BUNDLE_PARTS.every((id) => lines.some((l) => l.id === id && l.qty > 0));
}

/**
 * Mirrors the Shopify discount exactly, so the total shown in the bag is the
 * total Shopify charges. Measured on the goods subtotal before the bundle
 * saving, which is the figure Shopify tests its minimum against.
 */
export function qualifiesForFreeShipping(lines: { id: string; qty: number }[], now?: Date): boolean {
  const subtotal = lines.reduce((n, l) => n + currentPrice(l.id, now) * l.qty, 0);
  return subtotal >= FREE_SHIPPING_OVER;
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

/**
 * The bundle offer, in words, from the same numbers the cart charges.
 *
 * Both halves of it are stated together everywhere it appears. They were
 * introduced separately — the discount first, free shipping later — and ended
 * up mentioned in different places: the shop card named the money off, the
 * buy box named the shipping, and nowhere told a shopper that adding one pack
 * does both. An offer a customer has to assemble from three pages is not an
 * offer they will act on.
 */
export const bundleOffer = () =>
  `${money(BUNDLE_SAVING)} off and free shipping`;

/** Full sentence, for cards and drawers with room for one. */
export const bundleOfferSentence = () =>
  `Add a ${CATALOG["chillcore-3"].name} to a tin for ${bundleOffer()}.`;

export const money = (cents: number) =>
  `$${(cents / 100).toFixed(2).replace(/\.00$/, "")}`;

/**
 * Money with the cents always shown, for the totals columns in the bag and at
 * checkout. money() drops a trailing .00 because "$8 flat shipping" reads
 * better than "$8.00 flat shipping" in a sentence — but in a right-aligned
 * column beside $49.99 and $57.99, a bare "$8" reads as unfinished.
 */
export const moneyExact = (cents: number) => `$${(cents / 100).toFixed(2)}`;

/** Amount plus the currency code, for anywhere the code is not already shown. */
export const priceWithCurrency = (cents: number) =>
  `${money(cents)} ${CURRENCY_LABEL}`;

/**
 * The pair, priced end to end.
 *
 * The offer was true everywhere but stated nowhere: the discount was named on
 * one line, free shipping on another, and no surface ever showed a shopper
 * what the two of them together actually cost. A saving nobody can total is a
 * saving nobody acts on.
 *
 * Every number a customer reads about the bundle comes from here, so the
 * arithmetic printed on the product page cannot drift from the total the bag
 * charges. `list` deliberately includes the flat shipping the pair avoids —
 * that is a real cost a buyer would otherwise pay, and leaving it out would
 * understate the offer rather than overstate it.
 *
 * The pair must clear FREE_SHIPPING_OVER for `total` to be honest. At today's
 * prices it does, with room to spare: $69.98 against a $55 minimum.
 */
export function bundlePair(now?: Date) {
  const tin = currentPrice("ice-tin", now);
  const pack = currentPrice("chillcore-3", now);
  const list = tin + pack + SHIPPING_FLAT;
  const total = tin + pack - BUNDLE_SAVING;

  /**
   * `alone` and `step` are the two numbers a shopper can actually use.
   *
   * The offer was being explained as a mechanism — a $49.99 tin, a $19.99
   * pack, a bundle discount, shipping waived — four figures and two rules,
   * and nobody standing in a shop does that arithmetic. Set against the only
   * alternative they have, it collapses into one sentence: a tin on its own
   * is $57.99 delivered, the tin with three packs is $59.99 delivered, so the
   * packs cost two dollars.
   *
   * `step` is a property of the prices, not of anyone's basket, so it is
   * equally true on a product page with an empty bag. It is only this small
   * for a single tin — a second tin already ships free, so the pack costs the
   * usual $10 from there — which is why the card states both totals rather
   * than the difference on its own.
   */
  const alone = tin + SHIPPING_FLAT;
  return { tin, pack, list, total, alone, step: total - alone, saving: list - total };
}
