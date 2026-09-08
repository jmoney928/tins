import { StarIcon } from "@phosphor-icons/react/dist/ssr";
import { WAITLIST } from "@/lib/mode";
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
export function ReviewBadge({
  className = "",
  tone = "ink",
}: {
  className?: string;
  /** "paper" on a dark ground */
  tone?: "ink" | "paper";
}) {
  const text = tone === "paper" ? "text-ice-100/75 hover:text-white" : "text-fog hover:text-frost";
  const empty = tone === "paper" ? "text-ice-100/30" : "text-fog/40";
  // nobody has received one yet, so there is nothing to rate
  if (WAITLIST) return null;

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
              className={i <= filled ? (tone === "paper" ? "text-ice-300" : "text-ice-500") : empty}
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
        className={`flex items-center gap-2 text-xs transition-colors ${text} ${className}`}
      >
        {body}
      </a>
    );
  }

  return (
    <span className={`flex items-center gap-2 text-xs ${text} ${className}`}>{body}</span>
  );
}
