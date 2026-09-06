"use client";

import { ArrowRightIcon, LockSimpleIcon } from "@phosphor-icons/react/dist/ssr";

/**
 * The button that leaves for the payment page, and the line under it naming
 * what waits there.
 *
 * The wallets live on the payment page, not on ours: Apple Pay needs the
 * domain it runs on to be registered with Apple, and ours is not the domain
 * the payment page is served from. Naming them here is what makes the tap
 * worth making — a shopper on an iPhone should know the next screen is one
 * touch, not a form.
 */
export function ExpressButton({
  onClick,
  busy,
  label,
  className = "",
}: {
  onClick: () => void;
  busy: boolean;
  label: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <button
        onClick={onClick}
        disabled={busy}
        className="group flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-sm font-medium text-paper transition-all duration-300 ease-[var(--ease-glide)] hover:bg-ice-700 active:scale-[0.99] disabled:opacity-70"
      >
        {busy ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-paper/35 border-t-paper" />
            Opening secure checkout
          </>
        ) : (
          <>
            {label}
            <ArrowRightIcon
              size={14}
              weight="bold"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </>
        )}
      </button>
      <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-xs text-fog">
        <LockSimpleIcon size={12} weight="fill" className="shrink-0" />
        Apple Pay, Google Pay, Shop Pay or card next
      </p>
    </div>
  );
}
