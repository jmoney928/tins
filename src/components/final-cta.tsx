import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { AddButton } from "./add-button";
import { Reveal } from "./reveal";
import { CATALOG, money } from "@/lib/catalog";
import { dispatchShort } from "@/lib/fulfilment";
import { GUARANTEE_SHORT } from "@/lib/guarantee";

/**
 * The last ask on a page. On the home page it adds the tin directly; on the
 * product page it returns the reader to the buy box, where quantity and the
 * pack offer live.
 */
export function FinalCta({
  price,
  compareAt,
  action,
}: {
  price: number;
  compareAt?: number | null;
  action: "add" | "top";
}) {
  const tin = CATALOG["ice-tin"];
  const onSale = compareAt !== null && compareAt !== undefined && compareAt > price;

  return (
    <section className="mx-auto mt-4 max-w-7xl px-4 pb-8 sm:mt-8 sm:px-6">
      <Reveal className="glass-edge relative overflow-hidden rounded-[2.5rem] bg-abyss/80 px-6 py-14 text-center backdrop-blur-md sm:px-14 sm:py-16">
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(46,157,200,0.22),transparent_65%)] blur-3xl" />
        <div className="relative">
          <h2 className="mx-auto max-w-[24ch] text-3xl leading-[0.95] font-medium tracking-tighter text-white-ice sm:text-4xl">
            Order the Ice Tin.
          </h2>
          <p className="mx-auto mt-4 max-w-[46ch] text-sm leading-relaxed text-fog">
            {onSale ? (
              <>
                <span className="text-frost">{money(price)} CAD</span>{" "}
                <span className="text-fog line-through decoration-fog/50">
                  {money(compareAt)}
                </span>{" "}
                at launch — one tin, one ice pack in the box. {dispatchShort()}
              </>
            ) : (
              `${money(price)} CAD, one tin, one ice pack in the box. ${dispatchShort()}`
            )}
          </p>

          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            {action === "add" ? (
              <>
                <AddButton
                  productId={tin.id}
                  label={`Add to bag — ${money(price)}`}
                  className="px-8 py-4"
                />
                <Link
                  href="/products/ice-tin"
                  className="group flex items-center justify-center gap-2 rounded-full border border-frost/12 px-7 py-4 text-sm text-frost transition-all duration-300 ease-[var(--ease-glide)] hover:border-ice-500/40 hover:bg-slate-deep/40 active:scale-[0.98]"
                >
                  See the tin
                  <ArrowRightIcon
                    size={14}
                    weight="bold"
                    className="transition-transform duration-300 ease-[var(--ease-glide)] group-hover:translate-x-1"
                  />
                </Link>
              </>
            ) : (
              <Link
                href="#top"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-ink px-8 py-4 text-sm font-medium text-paper transition-colors duration-300 ease-[var(--ease-glide)] hover:bg-ice-700 active:scale-[0.98]"
              >
                Get the tin
                <ArrowRightIcon
                  size={15}
                  weight="bold"
                  className="transition-transform duration-300 ease-[var(--ease-glide)] group-hover:translate-x-1"
                />
              </Link>
            )}
          </div>
          <p className="mt-5 text-xs text-fog">{GUARANTEE_SHORT}</p>
        </div>
      </Reveal>
    </section>
  );
}
