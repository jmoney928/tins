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
    k: "Cold all day",
    body: "In your pocket, snus is warm by lunch. In the tin, the last pouch at dinner is as cold as the first one in the morning.",
  },
  {
    k: "It stays shut",
    body: "It screws closed. No rain, no sweat, no pocket fluff gets in, and the cold does not get out.",
  },
  {
    k: "It is yours for good",
    body: "The can your snus comes in is packaging. This one is solid aluminium, and if the shell ever fails we replace it.",
  },
];

export function Why() {
  return (
    <section id="why" className="py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.28em] text-ice-500 uppercase">
            Why cold
          </p>
          <h2 className="mt-4 text-4xl leading-[0.95] font-medium tracking-tighter text-balance text-white-ice sm:text-5xl">
            Warm snus is not good snus.
          </h2>
          <p className="mt-6 max-w-[48ch] text-base leading-relaxed text-fog">
            A warm beer is still a beer, but nobody wants one. Snus is the
            same. It tastes better cold and it lasts longer cold. This tin
            is a small fridge that goes in your pocket with it.
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
