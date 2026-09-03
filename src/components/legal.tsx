/**
 * Shared furniture for the legal pages.
 *
 * One date for all three. A privacy policy dated differently from the cookie
 * page it references reads as though nobody checked whether they still agree —
 * and here they genuinely have to, because the cookie table and the processor
 * list describe the same code.
 */
export const LEGAL_UPDATED = "3 September 2026";

export function LegalMeta({ note }: { note?: string }) {
  return (
    <p className="-mt-4 font-mono text-[11px] tracking-[0.16em] text-fog/70 uppercase">
      Last updated {LEGAL_UPDATED}
      {note ? ` — ${note}` : ""}
    </p>
  );
}

/** The single contact address, so it can never be mistyped on one page. */
export function Mail() {
  return (
    <a
      href="mailto:shop@icetins.com"
      className="text-ice-700 underline underline-offset-2"
    >
      shop@icetins.com
    </a>
  );
}
