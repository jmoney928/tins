import Image from "next/image";

/**
 * Emblem + wordmark lockup. The emblem carries the cyan, so the wordmark
 * stays a single weight — two accents in one lockup reads as clutter.
 */
export function BrandMark({
  size = 30,
  wordmark = true,
  tagline = false,
  /** the full badge's ring text turns to mush under ~44px — use the reticle */
  compact = size < 44,
  className = "",
}: {
  size?: number;
  wordmark?: boolean;
  tagline?: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <Image
        src={compact ? "/logo-compact-512.png" : "/logo-emblem-512.png"}
        alt="Ice Tins Supply Co."
        width={size}
        height={size}
        priority
        className="shrink-0 rounded-full"
        style={{ width: size, height: size }}
      />
      {wordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-mono text-sm tracking-[0.24em] text-white-ice uppercase">
            Ice Tins
          </span>
          {tagline && (
            <span className="mt-1.5 font-mono text-[9px] tracking-[0.3em] text-ice-500 uppercase">
              Supply Co.
            </span>
          )}
        </span>
      )}
    </span>
  );
}
