import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { FrostField } from "@/components/frost-field";
import { ProductNav } from "@/components/pdp/product-nav";
import { SiteFooter } from "@/components/site-footer";

/** A 404 that keeps the visitor on the site, with the two links that matter. */
export default function NotFound() {
  return (
    <>
      <FrostField />
      <ProductNav />
      <main className="mx-auto flex min-h-[70dvh] max-w-3xl flex-col justify-center px-4 pt-28 pb-20 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.28em] text-ice-500 uppercase">
          404
        </p>
        <h1 className="mt-4 text-4xl leading-[0.95] font-medium tracking-tighter text-white-ice sm:text-5xl">
          That page is not here.
        </h1>
        <p className="mt-5 max-w-[48ch] text-sm leading-relaxed text-fog">
          The address may have changed or been typed wrongly. The tin, and
          everything about it, is one link away.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/products/ice-tin"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-medium text-paper transition-colors duration-300 hover:bg-ice-700"
          >
            See the tin
            <ArrowRightIcon size={14} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-frost/12 px-7 py-4 text-sm text-frost transition-colors duration-300 hover:border-ice-500/40"
          >
            Home
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
