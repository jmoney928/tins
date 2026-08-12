import { STEPS } from "@/lib/products";
import { CoreStage } from "./core-stage";
import { Splatter } from "./splatter";

export function ColdSystem() {
  return (
    <section id="cold" className="relative overflow-hidden py-24 sm:py-32">
      <Splatter
        scope="cold-bg"
        rotate={140}
        className="pointer-events-none absolute top-4 -left-60 h-[40rem] w-[40rem] opacity-[0.38] mix-blend-multiply"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-16 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
        <div className="lg:order-2">
          <p className="font-mono text-[11px] tracking-[0.28em] text-ice-500 uppercase">
            The cold system
          </p>
          <h2 className="mt-4 max-w-[15ch] text-4xl leading-[0.95] font-medium tracking-tighter text-white-ice sm:text-5xl lg:text-[3.4rem]">
            One floor
            <span className="text-fog"> is a freezer.</span>
          </h2>
          <p className="mt-6 max-w-[50ch] text-base leading-relaxed text-fog">
            We split a can into three floors — 8 mm of spent, 20 mm of fresh,
            13 mm of ice — and kept the diameter standard. Nothing else close.
          </p>

          <ol className="mt-12 border-t border-frost/8">
            {STEPS.map((s) => (
              <li
                key={s.n}
                className="group grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-3 border-b border-frost/8 py-7 transition-colors duration-500 hover:bg-slate-deep/25 sm:grid-cols-[auto_1fr_auto] sm:gap-x-10"
              >
                <span className="font-mono text-sm text-ice-700 transition-colors duration-500 group-hover:text-ice-300">
                  {s.n}
                </span>
                <h3 className="text-2xl leading-tight tracking-tight text-white-ice">
                  {s.title}
                </h3>
                <span className="col-start-2 font-mono text-sm text-ice-300 sm:col-start-3 sm:row-start-1 sm:text-base">
                  {s.stat}
                </span>
                <p className="col-start-2 max-w-[52ch] text-sm leading-relaxed text-fog sm:col-span-2">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:order-1">
          <CoreStage />
        </div>
      </div>
    </section>
  );
}
