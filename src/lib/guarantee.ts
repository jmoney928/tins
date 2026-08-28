/**
 * The cold-or-refund guarantee.
 *
 * The old returns policy asked for the tin back "unused, in its original
 * packaging", which meant a buyer could not test the one claim they doubted
 * — that it actually keeps pouches cold — without voiding their own return.
 * At $49.99 to a stranger on the internet, that is the objection.
 *
 * Stated once here because it appears on the home page, in the buy box, at
 * checkout and on the returns page, and a guarantee that is worded four
 * different ways is not a guarantee anyone trusts.
 *
 * This is a real commitment with a real cost: return postage on any tin sent
 * back inside the window, on a product the buyer has been actively using.
 */

export const GUARANTEE_DAYS = 30;

/** Buy box, footer badges — one line, no clauses. */
export const GUARANTEE_SHORT = `${GUARANTEE_DAYS}-day cold-or-refund guarantee, return shipping paid.`;

/** Under a CTA, where there is room for the reason but not the detail. */
export const GUARANTEE_MEDIUM = `Use the tin for ${GUARANTEE_DAYS} days. If it does not hold pouches colder and keep spent ones separated, return it for a full refund with return shipping paid.`;

export const GUARANTEE_TITLE = "Thirty days, used, fully refundable.";

export const GUARANTEE_BODY = `Use the tin in normal daily conditions for ${GUARANTEE_DAYS} days. If it does not hold pouches colder, or does not keep spent ones separated from fresh, return it for a full refund with return shipping paid. There is no requirement that it be unused or in its original packaging — the guarantee exists so the product can be tested properly. The lifetime warranty on the shell applies regardless.`;

/**
 * The one exception, and it stays an exception rather than a headline. A gel
 * pack that has been through a freezer cannot be resold, so it is not
 * returnable — but a nervous buyer should meet the confidence first and the
 * footnote second.
 */
export const GUARANTEE_EXCEPTION =
  "Opened Chillcore packs are not returnable, as a gel pack that has been frozen cannot be resold. All other items are refundable in full.";
