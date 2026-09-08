/**
 * What the shop is doing today.
 *
 *   "selling"   — in stock, ordered and dispatched on the normal lead time
 *   "preorder"  — money is taken now, against a stated dispatch window
 *   "waitlist"  — nothing can be bought; addresses are collected instead
 *
 * Every buying affordance reads these, and so does the checkout route, the
 * structured data, the questions and llms.txt. Changing this one line moves
 * the whole site, in any direction, with nothing left behind still making
 * the previous claim.
 */
export type ShopMode = "selling" | "preorder" | "waitlist";

// widened deliberately: the comparisons below stay meaningful to the type
// checker, so switching this line never leaves dead branches behind
export const MODE = "preorder" as ShopMode;

/** Can money be taken at all. True for both selling and pre-order. */
export const SELLING: boolean = MODE !== "waitlist";

/** Taking money now for something not yet made. */
export const PREORDER: boolean = MODE === "preorder";

/** Collecting addresses, selling nothing. */
export const WAITLIST: boolean = MODE === "waitlist";
