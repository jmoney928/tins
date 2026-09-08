import { PREORDER } from "./mode";
import { leadTimeLabel, transitLabel } from "./fulfilment";

export { PREORDER };

/**
 * One sentence, used by every surface that takes a payment.
 *
 * Stated from the same lead time the rest of the site quotes, so a buyer
 * cannot be shown one window here and another on the product page. If the
 * first run will take longer than a normal batch, change LEAD_TIME_WEEKS in
 * lib/fulfilment.ts and every one of these moves with it.
 */
export function preorderPromiseText() {
  return `Pre-order: dispatched within ${leadTimeLabel()}, then ${transitLabel()} in transit.`;
}

/** The verb on a button, so no button says "add to bag" for an unmade thing. */
export const buyVerb = PREORDER ? "Pre-order" : "Add to bag";
