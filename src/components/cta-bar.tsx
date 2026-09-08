import Link from "next/link";
import { AddButton } from "./add-button";
import { WaitlistForm } from "./waitlist-form";
import { Reveal } from "./reveal";
import { currentPrice, money } from "@/lib/catalog";
import { GUARANTEE_DAYS } from "@/lib/guarantee";
import { SELLING } from "@/lib/mode";
import { buyVerb } from "@/lib/preorder";

/**
 * The ask, repeated.
 *
 * The page alternates a thing to understand with a way to buy. Each block
 * teaches one idea; this sits under it so the reader who is convinced at
 * that point never has to scroll to find the button.
 */
export function CtaBar({ note, source = "page" }: { note?: string; source?: string }) {
  if (!SELLING) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="border-t border-frost/8 py-8">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-base font-medium text-white-ice">
              It is not on sale yet. Be first to know.
            </p>
            <WaitlistForm
              source={source}
              className="mt-4 text-left"
              note={note ?? "One email the day it opens. Nothing else."}
            />
          </div>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <Reveal className="flex flex-col items-center gap-3 border-t border-frost/8 py-8 text-center">
        <AddButton
          productId="ice-tin"
          label={`${buyVerb} — ${money(currentPrice("ice-tin"))}`}
          className="w-full px-8 py-4 sm:w-auto"
        />
        {/* no note here: these buttons open the bag, and the bag carries the
            dispatch window immediately above its checkout button. Repeating
            it under all six of these turned one promise into wallpaper. */}
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
