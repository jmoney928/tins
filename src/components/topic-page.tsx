import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { FrostField } from "./frost-field";
import { ProductNav } from "./pdp/product-nav";
import { SiteFooter } from "./site-footer";
import { currentPrice, money } from "@/lib/catalog";
import { Reveal } from "./reveal";

/**
 * Shell for the topic pages that used to be homepage anchors.
 *
 * Each one is a real URL with its own title, description and canonical, so
 * the cold system, the construction and the field notes can rank for what
 * they are actually about instead of competing inside a single document.
 *
 * ProductNav rather than SiteNav, same as InfoPage: the full nav's links
 * point at these pages, and a page linking to itself in its own header is
 * noise.
 */
export function TopicPage({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FrostField />
      <ProductNav />

      <main className="pt-24 sm:pt-28">
        {children}

        {/* every topic page ends where the site wants the reader to go */}
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
          <Reveal>
          <div className="glass-edge flex flex-col items-start gap-6 rounded-[2rem] bg-abyss/80 p-8 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <h2 className="text-2xl leading-tight tracking-tight text-white-ice sm:text-3xl">
                One tin, one ice pack in the box.
              </h2>
              <p className="mt-2 text-sm text-fog">
                Machined in Vancouver. Free shipping when a tin and a pack
                ship together, and a 30-day cold-or-refund guarantee.
              </p>
            </div>
            <Link
              href="/products/ice-tin"
              className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-ink px-7 py-4 text-sm font-medium text-paper transition-colors duration-300 ease-[var(--ease-glide)] hover:bg-ice-700 active:scale-[0.98]"
            >
              See the tin
              <span className="font-mono text-xs opacity-65">
                {money(currentPrice("ice-tin"))}
              </span>
              <ArrowRightIcon
                size={15}
                weight="bold"
                className="transition-transform duration-300 ease-[var(--ease-glide)] group-hover:translate-x-1"
              />
            </Link>
          </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
