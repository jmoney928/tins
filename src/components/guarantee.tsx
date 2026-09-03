import { ShieldCheckIcon } from "@phosphor-icons/react/dist/ssr";
import {
  GUARANTEE_BODY,
  GUARANTEE_EXCEPTION,
  GUARANTEE_SHORT,
  GUARANTEE_TITLE,
} from "@/lib/guarantee";
import { Reveal } from "./reveal";

/**
 * The guarantee, given a section of its own.
 *
 * It earns the space because it answers the objection the whole page is
 * fighting: a stranger is being asked for $49.99 on a cold claim they cannot
 * check until they own the thing. The exception is present but set below the
 * promise, in smaller type — a nervous reader should meet the confidence
 * first and the footnote second.
 */
export function Guarantee() {
  return (
    <section id="guarantee" className="relative overflow-hidden py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
        <div className="glass-edge relative overflow-hidden rounded-[2rem] bg-abyss/80 p-8 backdrop-blur-md sm:p-12">
          <div className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(46,157,200,0.22),transparent_65%)] blur-3xl" />

          <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-[auto_1fr] sm:gap-10">
            <ShieldCheckIcon size={34} weight="thin" className="text-ice-500" />
            <div>
              <p className="font-mono text-[11px] tracking-[0.28em] text-ice-500 uppercase">
                The cold-or-refund guarantee
              </p>
              <h2 className="mt-4 max-w-[20ch] text-3xl leading-[0.98] font-medium tracking-tighter text-white-ice sm:text-4xl">
                {GUARANTEE_TITLE}
              </h2>
              <p className="mt-5 max-w-[62ch] text-sm leading-relaxed text-fog">
                {GUARANTEE_BODY}
              </p>
              <p className="mt-4 max-w-[62ch] text-xs leading-relaxed text-fog/70">
                {GUARANTEE_EXCEPTION}
              </p>
            </div>
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}

/** The one-line version, for a buy box or a checkout summary. */
export function GuaranteeLine({ className = "" }: { className?: string }) {
  return (
    <p className={`flex items-start gap-1.5 text-xs leading-relaxed text-fog ${className}`}>
      <ShieldCheckIcon size={13} weight="light" className="mt-0.5 shrink-0 text-ice-500" />
      {GUARANTEE_SHORT}
    </p>
  );
}
