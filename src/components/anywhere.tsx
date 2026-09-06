import Image from "next/image";
import { Reveal } from "./reveal";

const PLACES = [
  { src: "/life-work.jpg", alt: "The Ice Tin on a truck tailgate", label: "On the job" },
  { src: "/life-gym.jpg", alt: "The Ice Tin tossed onto a gym bench", label: "At the gym" },
  { src: "/life-climb.jpg", alt: "The Ice Tin on a rock beside climbing boots and a rope", label: "Up the hill" },
];

/** Where it goes. Three photographs, three words each. */
export function Anywhere() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-[11px] tracking-[0.28em] text-ice-500 uppercase">
            Where it goes
          </p>
          <h2 className="mt-4 text-4xl leading-[0.95] font-medium tracking-tighter text-balance text-white-ice sm:text-5xl">
            Anywhere you go, it stays cold.
          </h2>
          <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-fog">
            It is the same size as a normal can. Same pocket, same bag. The
            only difference is what is inside when you open it.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {PLACES.map((p, i) => (
            <Reveal as="figure" key={p.src} delay={i * 100} className="relative overflow-hidden rounded-[1.75rem] bg-ink">
              <Image
                src={p.src}
                alt={p.alt}
                width={1000}
                height={1200}
                sizes="(max-width: 640px) 92vw, 30vw"
                className="aspect-[4/5] w-full object-cover"
              />
              <figcaption className="absolute bottom-4 left-4 rounded-full bg-paper/90 px-4 py-2 text-sm font-medium text-white-ice backdrop-blur-md">
                {p.label}
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
