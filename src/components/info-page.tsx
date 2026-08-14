import { FrostField } from "./frost-field";
import { ProductNav } from "./pdp/product-nav";
import { SiteFooter } from "./site-footer";

/**
 * Shared shell for footer utility pages — shipping, warranty, careers, etc.
 * Reuses ProductNav rather than the full SiteNav: those links anchor into
 * homepage sections (#cold, #anatomy…) that don't exist here.
 */
export function InfoPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <FrostField />
      <ProductNav />

      <main className="pt-24 sm:pt-28">
        <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
          <p className="font-mono text-[11px] tracking-[0.28em] text-ice-500 uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl leading-[0.95] font-medium tracking-tighter text-white-ice sm:text-5xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-5 max-w-[56ch] text-sm leading-relaxed text-fog">{intro}</p>
          )}

          <div className="mt-12 flex flex-col gap-10">{children}</div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
