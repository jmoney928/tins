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
    k: "Warm by lunch",
    body: "A pocket is warm. By lunch the pouch you reach for has gone soft and flat, and the last five of the day are never as good as the first. In the tin, every one of them is the first.",
  },
  {
    k: "It stays shut",
    body: "A snap lid pops open in a bag and lets the air in. This one screws closed on a rubber seal, so the cold stays in and the rain, sweat and pocket lint stay out.",
  },
  {
    k: "It is yours",
    body: "The can your pouches come in is packaging. It pops open in a bag, cracks in a back pocket and goes in the bin with the last pouch. This one is cut from a solid block of aluminium and covered for as long as you own it.",
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
            Nobody orders a warm beer. Nobody would choose a warm pouch
            either, but a pouch spends the day in a pocket, so warm is simply
            what it has always been. This is the tin that changes that: a
            small fridge that goes in the pocket with them.
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
