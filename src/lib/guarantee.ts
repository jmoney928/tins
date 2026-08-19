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
export const GUARANTEE_SHORT = `${GUARANTEE_DAYS}-day cold-or-refund guarantee — we pay return shipping.`;

/** Under a CTA, where there is room for the reason but not the detail. */
export const GUARANTEE_MEDIUM = `Carry it for ${GUARANTEE_DAYS} days. If it does not keep your pouches colder and your pockets cleaner, send it back for a full refund and we cover the postage.`;

export const GUARANTEE_TITLE = "Cold and clean, or your money back.";

export const GUARANTEE_BODY = `Carry it for ${GUARANTEE_DAYS} days. If it does not keep your pouches colder and your pockets cleaner than whatever you are using now, send it back for a full refund — and we will cover return shipping. No "unused, in original packaging" fine print: using it is the entire point. The shell's lifetime warranty runs either way.`;

/**
 * The one exception, and it stays an exception rather than a headline. A gel
 * pack that has been through a freezer cannot be resold, so it is not
 * returnable — but a nervous buyer should meet the confidence first and the
 * footnote second.
 */
export const GUARANTEE_EXCEPTION =
  "Opened Chillcore packs are not returnable — once a gel pack has been frozen it cannot be resold. Everything else comes back for a full refund.";
