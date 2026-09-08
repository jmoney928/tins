import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  TruckIcon,
  WrenchIcon,
} from "@phosphor-icons/react/dist/ssr";
import { ProductStage } from "./product-stage";
import { LAYER_ANCHORS } from "@/lib/stage";
import { Magnetic } from "./magnetic";
import { CATALOG, bundlePair, currentPrice, money, tinOnSale } from "@/lib/catalog";
import { GUARANTEE_SHORT } from "@/lib/guarantee";
import { ReviewBadge } from "./review-badge";
import { AddButton } from "./add-button";
import { WaitlistForm } from "./waitlist-form";
import { SELLING } from "@/lib/mode";
import { buyVerb } from "@/lib/preorder";
import { PreorderNote } from "./preorder-note";

/**
 * One fact per piece, top to bottom, each sitting level with the piece it
 * describes. The title says what the part is; the line under it says what
 * that does for the person holding the tin. Nothing here that the product
 * page and the FAQ do not already claim.
 */
const LAYER_FACTS = [
  {
    title: "Machined aluminium lid",
    body: "Screws shut on two O-rings. Rain and sweat stay out, cold stays in.",
  },
  {
    title: "Your pouches",
    body: "Sit on a perforated floor, so the cold comes straight up under them.",
  },
  {
    title: "The ice pack",
    body: "Freeze it overnight, drop it in. Six hours of cold.",
  },
];

/**
 * The first screen, read in the order the eye takes it: the headline is the
 * biggest thing on the page, the tin hangs directly beneath it, the three
 * facts sit to the right of the tin with a line back to the piece each one
 * describes, and the price and button close the loop below the facts.
 *
 * The background is the inside of an ice cave. Two overlays keep it out of
 * the way: a darkening wash so the type never depends on the photograph's
 * own contrast, and a fade to paper along the bottom so the page below
 * continues white without a seam.
 */
export function Hero() {
  const onSale = tinOnSale();

  return (
    <div id="top" className="relative isolate bg-[#07111f] text-ice-100">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* a portrait crop for phones: the landscape frame cropped to a
            phone shows streaks of ice rather than a cave, so the phone gets
            the opening itself, cut tall */}
        <Image
          src="/ice-cave-mobile.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_30%] sm:hidden"
        />
        <Image
          src="/ice-cave-r.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden object-cover object-center sm:block"
        />
        <div className="absolute inset-0 bg-[#07111f]/40" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-[#07111f]/70 via-[#07111f]/35 to-[#07111f]/60 lg:block" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07111f]/75 via-[#07111f]/45 to-[#07111f]/70 lg:hidden" />
        <div className="absolute inset-x-0 top-0 hidden h-40 bg-gradient-to-b from-[#07111f]/65 to-transparent lg:block" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent via-paper/60 to-paper" />
      </div>

      <section className="relative mx-auto grid min-h-[100dvh] w-full max-w-7xl grid-cols-1 content-center gap-y-6 px-4 pt-24 pb-32 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-x-12 lg:gap-y-8 lg:pt-24 lg:pb-28">
        {/* 1. The headline. Biggest thing on the screen, read first. */}
        <div
          className="cascade lg:col-span-2"
          style={{ "--index": 0 } as React.CSSProperties}
        >
          <span className="flex items-center gap-3 font-mono text-[11px] tracking-[0.28em] text-ice-300 uppercase">
            <span className="animate-breathe h-1.5 w-1.5 rounded-full bg-ice-300" />
            Made in Vancouver. Ships worldwide.
          </span>
          <h1 className="mt-5 text-[3.25rem] leading-[0.9] font-medium tracking-tighter text-balance text-white sm:text-7xl lg:text-[5.4rem]">
            Keep your snus{" "}
            <span className="bg-gradient-to-b from-white via-ice-300 to-ice-500 bg-clip-text font-semibold tracking-tight text-transparent uppercase">
              ice cold
            </span>
          </h1>
        </div>

        {/* 2. The tin, straight under the headline, and 3. a fact beside each
            piece with a line back to it. The label column is as tall as the
            stage, so a label placed at a percentage of its height lands
            level with the rim it points at, at any width. */}
        <div
          className="cascade relative lg:self-center"
          style={{ "--index": 1 } as React.CSSProperties}
        >
          <ProductStage className="max-w-[51%] lg:max-w-[290px] xl:max-w-[315px]" />

          {/* absolutely placed against the wrapper, whose height is the stage's,
              so the percentage offsets below have something to resolve against */}
          <ol
            className="absolute inset-y-0 right-0 left-[51%] lg:left-[290px] xl:left-[315px]"
            aria-label="The three parts of the tin"
          >
            {LAYER_FACTS.map((f, i) => (
              <li
                key={f.title}
                className="cascade absolute inset-x-0 flex items-start gap-2 sm:gap-3"
                style={
                  {
                    top: `calc(${LAYER_ANCHORS[i]}% - 0.7rem)`,
                    "--index": 3 + i,
                  } as React.CSSProperties
                }
              >
                {/* the line back to the piece, arrowhead at the tin end */}
                <span
                  aria-hidden
                  className="relative mt-[0.68rem] h-px w-5 shrink-0 bg-ice-300/85 sm:w-9 lg:mt-[0.72rem] lg:w-10 xl:mt-[0.8rem] xl:w-14"
                >
                  <span className="absolute top-1/2 -left-px size-[7px] -translate-y-1/2 rotate-45 border-b border-l border-ice-300" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] leading-tight font-medium text-white sm:text-sm lg:text-base xl:text-lg">
                    {f.title}
                  </span>
                  <span className="mt-1 block text-[12px] leading-snug text-ice-100/80 sm:text-[13px] lg:text-sm lg:leading-relaxed xl:text-[15px]">
                    {f.body}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* 4. Why it matters, then the price and the button. */}
        <div
          className="cascade lg:self-center"
          style={{ "--index": 2 } as React.CSSProperties}
        >
          <p className="max-w-[46ch] text-[15px] leading-normal text-ice-100/85 sm:text-base sm:leading-relaxed lg:text-lg">
            Warm snus is like warm beer: still snus, not what you paid for.
            The Ice Tin holds every pouch at fridge temperature for six
            hours, so the last one of the day is as cold as the first.
          </p>

          <div className="mt-6">
            {onSale && (
              <p className="font-mono text-[11px] tracking-[0.24em] text-ice-300 uppercase">
                Launch price
              </p>
            )}
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-mono text-3xl tracking-tight text-white">
                {money(currentPrice("ice-tin"))}
              </span>
              {onSale && (
                <span className="font-mono text-base text-ice-100/60 line-through decoration-ice-100/40">
                  {money(CATALOG["ice-tin"].price)}
                </span>
              )}
              <span className="text-xs text-ice-100/60">CAD</span>
            </div>
          </div>

          {/*
            The bag, from the hero. One product, one price, one button: a
            visitor who arrives ready should not have to visit a second page
            to act. The drawer that opens carries the pack offer, so the
            shortest route to checkout still passes the upsell.
          */}
          {SELLING ? (
            <div className="mt-6 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
              <Magnetic strength={0.4}>
                <AddButton
                  productId="ice-tin"
                  tone="paper"
                  label={`${buyVerb} — ${money(currentPrice("ice-tin"))}`}
                  className="w-full px-7 py-4 sm:w-auto"
                />
              </Magnetic>

              <Link
                href="/products/ice-tin"
                className="group flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-4 text-sm text-ice-100 transition-all duration-300 ease-[var(--ease-glide)] hover:border-white/40 hover:bg-white/10 active:scale-[0.98]"
              >
                See the tin
                <ArrowRightIcon
                  size={15}
                  weight="bold"
                  className="transition-transform duration-300 ease-[var(--ease-glide)] group-hover:translate-x-1"
                />
              </Link>
            </div>
          ) : (
            /* the anchor every "join the waitlist" link on the site points at */
            <div id="waitlist" className="mt-6 scroll-mt-28">
              <WaitlistForm
                source="hero"
                tone="dark"
                note="One email the day it opens. Nothing else."
              />
              <Link
                href="/products/ice-tin"
                className="group mt-4 inline-flex items-center gap-2 text-sm text-ice-100/80 underline underline-offset-4 transition-colors hover:text-white"
              >
                See the tin
                <ArrowRightIcon
                  size={13}
                  weight="bold"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          )}

          <PreorderNote className="mt-4" tone="dark" />

          {/* Trust strip. ReviewBadge shows stars only when a real average is
              set, and the rating markup stays off until the reviews are
              readable on the page — see lib/social-proof.ts. */}
          <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ice-100/75">
            <li>
              <ReviewBadge tone="paper" />
            </li>
            <li className="flex items-center gap-2">
              <TruckIcon size={14} weight="light" className="text-ice-300" />
              Three spare ice packs for {money(bundlePair().step)} with a tin
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheckIcon size={14} weight="light" className="text-ice-300" />
              {GUARANTEE_SHORT}
            </li>
            <li className="flex items-center gap-2">
              <WrenchIcon size={14} weight="light" className="text-ice-300" />
              Lifetime shell warranty
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
