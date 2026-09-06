import Link from "next/link";
import { AddButton } from "./add-button";
import { Reveal } from "./reveal";
import { currentPrice, money } from "@/lib/catalog";
import { GUARANTEE_DAYS } from "@/lib/guarantee";

/**
 * The ask, repeated.
 *
 * The page alternates a thing to understand with a way to buy. Each block
 * teaches one idea; this sits under it so the reader who is convinced at
 * that point never has to scroll to find the button.
 */
export function CtaBar({ note }: { note?: string }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <Reveal className="flex flex-col items-center gap-3 border-t border-frost/8 py-8 text-center">
        <AddButton
          productId="ice-tin"
          label={`Get the tin — ${money(currentPrice("ice-tin"))}`}
          className="w-full px-8 py-4 sm:w-auto"
        />
        <p className="text-xs text-fog">
          {note ?? `Ships worldwide. ${GUARANTEE_DAYS} days to change your mind.`}{" "}
          <Link href="/products/ice-tin" className="text-ice-700 underline underline-offset-2">
            See the tin
          </Link>
        </p>
      </Reveal>
    </div>
  );
}
