import { Splatter } from "./splatter";
import { Reveal } from "./reveal";
import { CountUp } from "./count-up";

/**
 * Three rows, each stating one measurement and the conditions behind it.
 *
 * The middle row is the control, and it is the most persuasive line in the
 * section: it is the only place the site proves the six hours comes from the
 * frozen pack rather than from the metal. It used to bury that under a label
 * reading "no core" — a word the site never defines, for an object it calls a
 * Chillcore pack in every other sentence — and a body that named the same
 * thing a third way, as "the tray empty".
 *
 * The numbers are not restated in the prose. Each already sits in 36px type
 * to the left of its own sentence, and repeating it there cost the row its
 * first clause without telling the reader anything.
 *
 * All three are measurements of the same daily cycle, which is what earns
 * them a section headed "Tested before release". A row counting prototypes
 * was a fact about the workshop rather than about the tin, and it is the one
 * number here a buyer could not do anything with.
 */
const FACTS = [
  {
    value: 6,
    unit: "hours",
    k: "Cold hold, sealed",
    body: "Measured with a frozen pack, the lid closed, in a 22°C room — the length of a full working shift.",
  },
  {
    value: 1,
    unit: "hour",
    k: "Cold hold, empty tray",
    body: "The same can in the same room, with nothing in the ice tray. Aluminium on its own holds fridge temperature for an hour — the other five come from the frozen pack.",
  },
  {
    // Was a prototype count. How many test units preceded this one is a fact
    // about us, not about the tin, and it sat in a section of measurements a
    // buyer can act on. Recharge time is the third number in the daily cycle
    // the other two rows describe: how long it holds, what the metal does
    // alone, and how long before it is ready again.
    value: 90,
    unit: "min",
    k: "Freezer to ready",
    body: "From room temperature to fully set, laid flat in a standard freezer drawer. Leaving it in longer does no harm, so a spare can simply live there.",
  },
];

export function Facts() {
  return (
    <section id="facts" className="relative overflow-hidden py-20 sm:py-28">
      <Splatter
        scope="facts-splat"
        rotate={-64}
        flip
        className="pointer-events-none absolute -right-52 bottom-6 h-[40rem] w-[40rem] opacity-[0.42] mix-blend-multiply"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-[11px] tracking-[0.28em] text-ice-500 uppercase">
            Cold facts
          </p>
          <h2 className="mt-4 text-4xl leading-[0.95] font-medium tracking-tighter text-white-ice sm:text-5xl">
            Tested
            <span className="text-fog"> before release.</span>
          </h2>
        </Reveal>

        <div className="mt-12 border-t border-frost/8">
          {FACTS.map((f, i) => (
            <Reveal
              key={f.k}
              delay={i * 90}
              className="group grid grid-cols-1 gap-4 border-b border-frost/8 py-8 transition-colors duration-500 hover:bg-slate-deep/25 sm:grid-cols-[minmax(0,11rem)_minmax(0,14rem)_1fr] sm:items-baseline sm:gap-10 sm:px-4"
            >
              {/* the measurement counts up to itself as the row arrives — the
                  one flourish spent on the numbers a buyer is asked to trust */}
              <CountUp
                value={f.value}
                suffix={` ${f.unit}`}
                className="font-mono text-3xl leading-none tracking-tight text-white-ice tabular-nums sm:text-4xl"
              />
              <span className="font-mono text-[11px] tracking-[0.2em] text-ice-500 uppercase">
                {f.k}
              </span>
              <p className="max-w-[62ch] text-sm leading-relaxed text-fog">
                {f.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
