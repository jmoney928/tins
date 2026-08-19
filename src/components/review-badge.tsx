import { StarIcon } from "@phosphor-icons/react/dist/ssr";
import {
  REVIEW_RATING,
  REVIEW_SOURCE_URL,
  ratingLabel,
  reviewCountLabel,
} from "@/lib/social-proof";

/**
 * The review count, with stars only once there is a real average behind
 * them. Until then it shows the count alone — which is a true claim, and a
 * plain one reads as more credible than five gold stars nobody can check.
 */
export function ReviewBadge({ className = "" }: { className?: string }) {
  const label = ratingLabel();
  const filled = REVIEW_RATING === null ? 0 : Math.round(REVIEW_RATING);

  const body = (
    <>
      {REVIEW_RATING !== null && (
        <span className="flex items-center gap-0.5" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((i) => (
            <StarIcon
              key={i}
              size={13}
              weight={i <= filled ? "fill" : "regular"}
              className={i <= filled ? "text-ice-500" : "text-fog/40"}
            />
          ))}
        </span>
      )}
      <span>{label ?? reviewCountLabel()}</span>
    </>
  );

  if (REVIEW_SOURCE_URL) {
    return (
      <a
        href={REVIEW_SOURCE_URL}
        className={`flex items-center gap-2 text-xs text-fog transition-colors hover:text-frost ${className}`}
      >
        {body}
      </a>
    );
  }

  return (
    <span className={`flex items-center gap-2 text-xs text-fog ${className}`}>{body}</span>
  );
}
