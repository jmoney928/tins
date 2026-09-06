import Image from "next/image";
import { Reveal } from "./reveal";

const STEPS = [
  {
    n: "1",
    title: "Freeze the ice pack",
    body: "It takes ninety minutes. Most people just leave it in the freezer overnight.",
    src: "/ice-packs.jpg",
    alt: "Three Chillcore ice packs stacked",
  },
  {
    n: "2",
    title: "Drop it in the bottom",
    body: "The ice pack sits in the base. Your snus goes on the floor above it.",
    src: "/three-layer-gallery.jpg",
    alt: "The Ice Tin taken apart, showing the ice pack tray at the bottom",
  },
  {
    n: "3",
    title: "Go",
    body: "Work, the gym, the hill. Every pouch is still cold six hours later.",
    src: "/life-work.jpg",
    alt: "A hand setting the Ice Tin down on a truck tailgate",
  },
];

/** Three steps, three photographs, one line each. */
export function HowItWorks() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-[11px] tracking-[0.28em] text-ice-500 uppercase">
            How it works
          </p>
          <h2 className="mt-4 text-4xl leading-[0.95] font-medium tracking-tighter text-balance text-white-ice sm:text-5xl">
            Three steps, every morning.
          </h2>
        </Reveal>

        <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 100} className="flex flex-col">
              <div className="overflow-hidden rounded-[1.75rem] bg-ink">
                <Image
                  src={s.src}
                  alt={s.alt}
                  width={1000}
                  height={1000}
                  sizes="(max-width: 640px) 92vw, 30vw"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <div className="mt-5 flex items-start gap-4">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-ink font-mono text-sm text-paper">
                  {s.n}
                </span>
                <div>
                  <h3 className="text-xl leading-tight font-medium tracking-tight text-white-ice">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-fog">{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
