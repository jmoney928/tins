import { Splatter } from "./splatter";

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
 */
const FACTS = [
  {
    n: "6 hours",
    k: "Cold hold, sealed",
    body: "Measured with a frozen pack, the lid closed, in a 22°C room — the length of a full working shift.",
  },
  {
    n: "1 hour",
    k: "Cold hold, empty tray",
    body: "The same can in the same room, with nothing in the ice tray. Aluminium on its own holds fridge temperature for an hour — the other five come from the frozen pack.",
  },
  {
    n: "31",
    k: "Prototypes before this",
    // The old version read as a census — thirty-one units, then nine, four
    // and one accounted for — which leaves seventeen unexplained for any
    // reader who adds up. Specifics that do not reconcile invite exactly the
    // scrutiny they fail. These are the outcomes worth naming, not a tally.
    body: "Machined and carried through the same conditions before the shell was signed off. Nine leaked at the seam, four cracked a thread, and one has been on continuous cold test since the first batch.",
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
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] tracking-[0.28em] text-ice-500 uppercase">
            Cold facts
          </p>
          <h2 className="mt-4 text-4xl leading-[0.95] font-medium tracking-tighter text-white-ice sm:text-5xl">
            Tested
            <span className="text-fog"> before release.</span>
          </h2>
        </div>

        <div className="mt-12 border-t border-frost/8">
          {FACTS.map((f) => (
            <div
              key={f.k}
              className="group grid grid-cols-1 gap-4 border-b border-frost/8 py-8 transition-colors duration-500 hover:bg-slate-deep/25 sm:grid-cols-[minmax(0,11rem)_minmax(0,14rem)_1fr] sm:items-baseline sm:gap-10 sm:px-4"
            >
              <span className="font-mono text-3xl leading-none tracking-tight text-white-ice tabular-nums sm:text-4xl">
                {f.n}
              </span>
              <span className="font-mono text-[11px] tracking-[0.2em] text-ice-500 uppercase">
                {f.k}
              </span>
              <p className="max-w-[62ch] text-sm leading-relaxed text-fog">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
