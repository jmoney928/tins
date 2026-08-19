/**
 * Customer reviews.
 *
 * Stated once, because a count that appears on the home page, the buy box and
 * in structured data has to be the same number in all three — and because
 * when the real figures come in, they change here and nowhere else.
 *
 * ── Two things to keep honest ────────────────────────────────────────────
 *
 * RATING stays null until the actual average is known. A star rating is the
 * easiest thing on a shop to invent and the most damaging to get wrong: it is
 * the number a buyer leans on hardest, and Google treats fabricated rating
 * markup as grounds for a manual penalty. Stars render only once this is set.
 *
 * AggregateRating structured data is emitted only when RATING is set *and*
 * SOURCE_URL points somewhere a visitor can read the reviews themselves.
 * Google requires the ratings behind the markup to be visible to the reader
 * on the page carrying it; marking up a number that appears nowhere is what
 * gets sites delisted rather than promoted.
 */

/** Reported by the shop owner. Shown as "300+", so keep it conservative. */
export const REVIEW_COUNT = 300;

/**
 * The average, out of 5, as reported by the shop owner.
 *
 * These are informal — feedback by email, message and word of mouth rather
 * than a review platform. That is fine as a claim the shop stands behind,
 * and it is why SOURCE_URL below is still null: nothing on this site lets a
 * visitor read them, which keeps the structured data switched off. Getting
 * even twenty of these into a review widget, with names attached, would
 * convert better than the number alone and would make the markup safe.
 */
export const REVIEW_RATING: number | null = 4.8;

/** Where a visitor can read them. Null until the reviews are reachable. */
export const REVIEW_SOURCE_URL: string | null = null;

export const hasRating = () => REVIEW_RATING !== null;

/** "300+ reviews" — the claim we can make today. */
export const reviewCountLabel = () => `${REVIEW_COUNT}+ reviews`;

/** "4.8 out of 5 from 300+ reviews", once a rating exists. */
export function ratingLabel() {
  if (REVIEW_RATING === null) return null;
  return `${REVIEW_RATING} out of 5 from ${reviewCountLabel()}`;
}

/**
 * Only safe to attach to the Product JSON-LD when both a rating and a place
 * to read the reviews exist. Returns undefined otherwise, and the product
 * markup simply omits the field.
 */
export function aggregateRatingJsonLd() {
  if (REVIEW_RATING === null || !REVIEW_SOURCE_URL) return undefined;
  return {
    "@type": "AggregateRating",
    ratingValue: REVIEW_RATING,
    reviewCount: REVIEW_COUNT,
    bestRating: 5,
    worstRating: 1,
  };
}
