import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import {
  BUNDLE_SAVING,
  SHIPPING_FLAT,
  bundlePair,
  freeShippingToday,
  money,
  moneyExact,
} from "@/lib/catalog";
import { AddPairButton } from "./add-pair-button";
import { ProductArt } from "./product-art";
import { CATALOG } from "@/lib/catalog";
import { Reveal } from "./reveal";

/**
 * The two ways to order, priced to the door, side by side.
 *
 * Every other statement of the offer on the site is a sentence, and a
 * sentence asks the reader to hold four figures in their head. This is the
 * receipt version: each column adds up in front of them, both end in a
 * delivered total, and the difference between the totals is the price of
 * the packs. Nothing is left to be worked out.
 *
 * Hidden on a free-shipping promo day, when the second column's advantage
 * is smaller and the arithmetic below would be wrong.
 */
export function Offer() {
  if (freeShippingToday()) return null;
  const pair = bundlePair();
  const tin = CATALOG["ice-tin"];
  const pack = CATALOG["chillcore-3"];

  // what each column buys, as a picture before it is a sum
  const Shot = ({ product }: { product: typeof tin }) => (
    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-ink sm:h-28 sm:w-28">
      <ProductArt product={product} sizes="112px" className="h-full w-full" />
    </div>
  );

  const Row = ({
    k,
    v,
    tone = "text-fog",
  }: {
    k: string;
    v: string;
    tone?: string;
  }) => (
    <div className={`flex items-baseline justify-between gap-4 py-2 text-sm ${tone}`}>
      <dt>{k}</dt>
      <dd className="font-mono tabular-nums">{v}</dd>
    </div>
  );

  return (
    <section id="offer" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-[11px] tracking-[0.28em] text-ice-500 uppercase">
            The offer
          </p>
          <h2 className="mt-4 text-4xl leading-[0.95] font-medium tracking-tighter text-balance text-white-ice sm:text-5xl">
            Two ways to order.
            <span className="text-fog"> Both priced to the door.</span>
          </h2>
          <p className="mt-5 max-w-[52ch] text-sm leading-relaxed text-fog">
            One pack ships inside every tin. Add the three-pack in the same
            order and the pair ships free with {money(BUNDLE_SAVING)} off, which
            is how three spare packs come to {money(pair.step)}.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Reveal className="glass-edge flex flex-col rounded-[2rem] bg-paper/75 p-7 backdrop-blur-sm sm:p-8">
            <Shot product={tin} />
            <p className="mt-6 font-mono text-[11px] tracking-[0.2em] text-fog uppercase">
              The tin on its own
            </p>
            <dl className="mt-5 divide-y divide-frost/8 border-t border-frost/8">
              <Row k="The Ice Tin, one pack inside" v={moneyExact(pair.tin)} />
              <Row k="Shipping" v={moneyExact(SHIPPING_FLAT)} />
            </dl>
            <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-frost/8 pt-4">
              <span className="text-sm font-medium text-white-ice">Delivered</span>
              <span className="font-mono text-2xl tracking-tight text-white-ice tabular-nums">
                {moneyExact(pair.alone)}
              </span>
            </div>
            <div className="mt-auto pt-7">
            <Link
              href="/products/ice-tin"
              className="group flex items-center justify-center gap-2 rounded-full border border-frost/15 px-6 py-3.5 text-sm font-medium text-frost transition-all duration-300 ease-[var(--ease-glide)] hover:border-ice-500/50 hover:bg-slate-deep/40 active:scale-[0.98]"
            >
              See the tin
              <ArrowRightIcon
                size={14}
                weight="bold"
                className="transition-transform duration-300 ease-[var(--ease-glide)] group-hover:translate-x-1"
              />
            </Link>
            </div>
          </Reveal>

          <Reveal
            delay={110}
            className="relative flex flex-col rounded-[2rem] border border-ice-500/30 bg-ice-100/60 p-7 sm:p-8"
          >
            <div className="flex items-center gap-3">
              <Shot product={tin} />
              <span className="font-mono text-xl text-ice-700">+</span>
              <Shot product={pack} />
            </div>
            <p className="mt-6 font-mono text-[11px] tracking-[0.2em] text-ice-700 uppercase">
              The tin and three spare packs
            </p>
            <dl className="mt-5 divide-y divide-ice-500/12 border-t border-ice-500/15">
              <Row k="The Ice Tin, one pack inside" v={moneyExact(pair.tin)} tone="text-frost" />
              <Row k="Chillcore three-pack" v={moneyExact(pair.pack)} tone="text-frost" />
              <Row k="Ordered together" v={`−${moneyExact(BUNDLE_SAVING)}`} tone="text-ice-700" />
              <Row k="Shipping" v="Free" tone="text-ice-700" />
            </dl>
            <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-ice-500/15 pt-4">
              <span className="text-sm font-medium text-white-ice">Delivered</span>
              <span className="font-mono text-2xl tracking-tight text-white-ice tabular-nums">
                {moneyExact(pair.total)}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-frost">
              {money(pair.step)} more than the tin alone, for three spare packs
              worth {money(pair.pack)}: one in the tin, one in the freezer,
              one in reserve.
            </p>
            <div className="mt-7">
              <AddPairButton label={`Add both — ${moneyExact(pair.total)} delivered`} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
