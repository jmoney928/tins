import { Reveal } from "./reveal";

/**
 * Why the thing exists, before what it is made of.
 *
 * The site used to go straight from the headline to the engineering, which
 * assumes the reader already agrees there is a problem. Most do not: a
 * warm pouch is a thing people have made peace with. The beer comparison
 * is here because it is the one everybody already holds — nobody needs the
 * difference between a warm beer and a cold one explained, and a pouch is
 * the same object in the same respect.
 */
const PROBLEMS = [
  {
    k: "Warm by midday",
    body: "A pocket sits at body temperature. By early afternoon the moisture has left the pouch and the flavour has gone flat, so the last five are never the ones paid for. The tin holds fridge temperature for six hours; the pouch taken at six is the pouch taken at one.",
  },
  {
    k: "Nowhere for the spent ones",
    body: "A used pouch goes back under the lid with the fresh, into a pocket, or over a shoulder. The sealed upper floor takes up to fifteen of them, away from the fresh ones and from everything else in the pocket.",
  },
  {
    k: "The can gives up",
    body: "Plastic lids crack, cardboard swells, and a can is replaced every few weeks without anyone thinking of it as a cost. This one is machined from solid aluminium and the shell is warranted for life.",
  },
];

export function Why() {
  return (
    <section id="why" className="py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.28em] text-ice-500 uppercase">
            Why it exists
          </p>
          <h2 className="mt-4 text-4xl leading-[0.95] font-medium tracking-tighter text-balance text-white-ice sm:text-5xl">
            A pouch is like a beer.
            <span className="text-fog"> It is better cold.</span>
          </h2>
          <p className="mt-6 max-w-[48ch] text-base leading-relaxed text-fog">
            Nobody chooses a warm beer, and nobody would choose a warm pouch
            either. The difference is that a beer is cold when it is handed
            over and a pouch is carried around all day in a pocket, so warm is
            simply what a pouch has been. The tin is the fridge that goes in
            the pocket with it.
          </p>
        </Reveal>

        <div className="divide-y divide-frost/8 border-t border-frost/8">
          {PROBLEMS.map((p, i) => (
            <Reveal
              key={p.k}
              delay={i * 90}
              className="grid grid-cols-1 gap-3 py-7 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-10"
            >
              <h3 className="text-lg leading-tight tracking-tight text-white-ice">
                {p.k}
              </h3>
              <p className="max-w-[58ch] text-sm leading-relaxed text-fog">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
