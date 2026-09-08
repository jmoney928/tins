/**
 * How long an order actually takes — stated once, read everywhere.
 *
 * This existed in three places and disagreed with itself in all three: the
 * product page promised dispatch in 1–2 business days, the Stripe session
 * quoted a 3–8 business day delivery estimate, and the confirmation page —
 * which the buyer only reaches after paying — said six weeks. A shopper met
 * them in that order, so the worst news arrived last, after the money.
 *
 * That is survivable on word-of-mouth traffic and fatal on paid traffic: it
 * produces refunds, card disputes and complaints on the ads themselves, and
 * Meta restricts ad accounts on exactly those signals.
 *
 * The two numbers below measure different things and are no longer in
 * competition:
 *
 *   LEAD_TIME_WEEKS — order placed to parcel dispatched (we make it)
 *   TRANSIT_DAYS    — dispatched to the door (the courier carries it)
 *
 * Set to a 2–3 week build window. Setting max to 0 switches every surface
 * back to shipping from stock, in one place.
 */

import { PREORDER } from "./mode";

export const LEAD_TIME_WEEKS: { min: number; max: number } = { min: 2, max: 3 };

/**
 * The dispatch window a pre-order is sold against.
 *
 * Taken from the lead time above rather than invented, because that is the
 * figure the shop already stands behind everywhere else and two different
 * promises would be worse than none. If the first production run will take
 * longer than a normal batch, change LEAD_TIME_WEEKS — every surface follows
 * it, and a pre-order sold against a window that turns out to be wrong is
 * the failure this whole file exists to prevent.
 */
export function preorderWindow() {
  return leadTimeLabel();
}

/** The sentence a buyer must meet before paying for something unmade. */
export function preorderPromise() {
  return `This is a pre-order. Your tin is dispatched within ${leadTimeLabel()} of ordering, then ${transitLabel()} in transit.`;
}

export const TRANSIT_DAYS = { min: 3, max: 8 } as const;

/** True when we dispatch from stock rather than making to order. */
export const SHIPS_FROM_STOCK = LEAD_TIME_WEEKS.max === 0;

/** "2–3 weeks" / "1–2 business days" — the dispatch half of the promise. */
export function leadTimeLabel() {
  if (SHIPS_FROM_STOCK) return "1–2 business days";
  const { min, max } = LEAD_TIME_WEEKS;
  return min === max ? `${max} weeks` : `${min}–${max} weeks`;
}

/** "3–8 business days" — the courier half. */
export function transitLabel() {
  return `${TRANSIT_DAYS.min}–${TRANSIT_DAYS.max} business days`;
}

/** One sentence for the product page and the FAQ. */
export function dispatchSentence() {
  return SHIPS_FROM_STOCK
    ? `Every order ships from Vancouver, BC within ${leadTimeLabel()}, then ${transitLabel()} in transit.`
    : `Each tin is machined to order in Vancouver, BC. Current lead time is ${leadTimeLabel()} to dispatch, then ${transitLabel()} in transit.`;
}

/** The headline a buyer sees before paying — never rosier than the receipt. */
export function availabilityHeadline() {
  if (PREORDER) return "Pre-order from the first run.";
  return SHIPS_FROM_STOCK ? "In stock and ready to ship." : "Made to order, in batches.";
}

/**
 * The dispatch promise as a clause, for a sentence that is already carrying a
 * price and cannot afford the full version.
 */
export function dispatchShort() {
  return SHIPS_FROM_STOCK
    ? `Dispatched in ${leadTimeLabel()}, then ${transitLabel()} in transit.`
    : `Dispatched in ${leadTimeLabel()}, then ${transitLabel()} in transit.`;
}

/**
 * The availability claim, in the few words a badge or an eyebrow has room for.
 *
 * Every one of those slots used to say "In stock" — the hero, the shop card,
 * a live unit count over the buy box, and "In stock now" in the closing
 * paragraph — while the same pages promised a 2–3 week lead time. A shopper
 * met the fast promise four times and the true one once, which is the shape
 * of a complaint rather than a sale.
 */
export function availabilityShort() {
  if (PREORDER) return "Pre-order";
  return SHIPS_FROM_STOCK ? "In stock" : "Made to order";
}
