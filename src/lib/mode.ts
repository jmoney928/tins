/**
 * Waitlist mode.
 *
 * True: the site shows the product and collects email addresses, and nothing
 * can be bought. Every buying affordance reads this one constant — the
 * buttons, the bag, the drawer, the checkout page and the checkout route
 * itself — so the switch is complete in both directions and there is no
 * corner of the site left selling something the shop will not take money for.
 *
 * Set it to false to sell again. Nothing else has to change.
 */
export const WAITLIST: boolean = true;

/** Selling is on. Reads better at a call site than `!WAITLIST`. */
export const SELLING: boolean = !WAITLIST;
