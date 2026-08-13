import { STEPS } from "@/lib/products";
import { CoreStage } from "./core-stage";
import { Splatter } from "./splatter";

/**
 * The one dark band on the page.
 *
 * Everything else runs white-to-pale-blue, so this is where the scroll gets its
 * punctuation — and it is the right section to spend it on, because "one floor
 * is a freezer" is the claim the product rests on. Colours are explicit rather
 * than tokenised: the palette is semantic for a light page, so inverting it
 * here would mean fighting the tokens instead of using them.
 */
export function ColdSystem() {
  return (
    <section
      id="cold"
      className="relative isolate overflow-hidden bg-ink py-24 sm:py-32"
    >
      {/* on dark the splash screens rather than multiplies */}
      <Splatter
        scope="cold-bg"
        rotate={140}
        from="#a9dcea"
        to="#2e9dc8"
        className="pointer-events-none absolute top-0 -left-56 h-[38rem] w-[38rem] opacity-[0.16] mix-blend-screen"
      />
      <Splatter
        scope="cold-bg-2"
        rotate={-40}
        flip
        from="#8fd2e8"
        to="#1d7ba1"
        className="pointer-events-none absolute -right-64 -bottom-40 h-[34rem] w-[34rem] opacity-[0.12] mix-blend-screen"
      />
      <div className="pointer-events-none absolute top-1/2 left-[20%] h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(46,157,200,0.30),transparent_62%)] blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-16 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
        <div className="lg:order-2">
          <p className="font-mono text-[11px] tracking-[0.28em] text-ice-300 uppercase">
            The cold system
          </p>
          <h2 className="mt-4 max-w-[15ch] text-4xl leading-[0.95] font-medium tracking-tighter text-white sm:text-5xl lg:text-[3.4rem]">
            One floor
            <span className="text-ice-300/75"> is a freezer.</span>
          </h2>
          <p className="mt-6 max-w-[50ch] text-base leading-relaxed text-ice-100/75">
            We split a can into three floors — 8 mm of spent, 20 mm of fresh,
            13 mm of ice — and kept the diameter standard. Nothing else close.
          </p>

          <ol className="mt-12 border-t border-white/12">
            {STEPS.map((s) => (
              <li
                key={s.n}
                className="group grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-3 border-b border-white/12 py-7 transition-colors duration-500 hover:bg-white/[0.04] sm:grid-cols-[auto_1fr_auto] sm:gap-x-10"
              >
                <span className="font-mono text-sm text-ice-500 transition-colors duration-500 group-hover:text-ice-300">
                  {s.n}
                </span>
                <h3 className="text-2xl leading-tight tracking-tight text-white">
                  {s.title}
                </h3>
                <span className="col-start-2 font-mono text-sm text-ice-300 sm:col-start-3 sm:row-start-1 sm:text-base">
                  {s.stat}
                </span>
                <p className="col-start-2 max-w-[52ch] text-sm leading-relaxed text-ice-100/65 sm:col-span-2">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:order-1">
          <CoreStage onDark />
        </div>
      </div>
    </section>
  );
}
