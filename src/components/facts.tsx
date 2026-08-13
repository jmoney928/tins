import { Splatter } from "./splatter";

const FACTS = [
  {
    n: "6 hours",
    k: "Cold hold, sealed",
    body: "Frozen core, closed lid, 22°C room. That is a full shift, a flight to Lisbon, or a very long night out.",
  },
  {
    n: "1 hour",
    k: "Cold hold, no core",
    body: "The same can with the tray empty. The metal alone buys you an hour. The ice pack is the other five.",
  },
  {
    n: "31",
    k: "Prototypes before this",
    body: "Thirty-one machined test units since last spring. Nine of them leaked, four cracked a thread, and one is still in a freezer in Malmö.",
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
            We froze a lot of them
            <span className="text-fog"> first.</span>
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
