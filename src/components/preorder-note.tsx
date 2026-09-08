import { ClockIcon } from "@phosphor-icons/react/dist/ssr";
import { PREORDER, preorderPromiseText } from "@/lib/preorder";

/**
 * The pre-order promise, wherever someone is about to pay.
 *
 * A buyer must meet this before the money leaves, not after. The whole risk
 * of taking payment for something unmade is a person who thought it was
 * coming this week, so the dispatch window appears beside every button that
 * takes a payment rather than once, further down, in a policy page.
 */
export function PreorderNote({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  if (!PREORDER) return null;
  return (
    <p
      className={`flex items-start gap-2 text-xs leading-relaxed ${
        tone === "dark" ? "text-ice-100/80" : "text-fog"
      } ${className}`}
    >
      <ClockIcon
        size={13}
        weight="light"
        className={`mt-0.5 shrink-0 ${tone === "dark" ? "text-ice-300" : "text-ice-500"}`}
      />
      {preorderPromiseText()}
    </p>
  );
}
