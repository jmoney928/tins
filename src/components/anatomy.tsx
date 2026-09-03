import { SPECS } from "@/lib/products";
import Image from "next/image";
import { Flecks } from "./splatter";
import { Reveal } from "./reveal";

const LAYERS = [
  {
    n: "01",
    title: "Spent floor, on top",
    body: "Holds roughly fifteen used pouches, which compress as they stack, behind its own O-ring rather than a snap lid.",
  },
  {
    n: "02",
    title: "Pouch floor, middle",
    body: "Twenty-five pouches sit flat on a perforated floor, so the cold passes straight up from the tray beneath rather than travelling around the walls. This is the floor opened in normal use.",
  },
  {
    n: "03",
    title: "Ice tray, underneath",
    body: "The slim Chillcore pack seats into the base and locks flat. It makes no contact with the pouches; the aluminium conducts the cold.",
  },
  {
    n: "04",
    title: "Two seals, one turn",
    body: "Each floor opens on a double-start thread in 0.6 of a turn and closes onto its own silicone O-ring. These seals are what sustain the six-hour hold.",
  },
];

export function Anatomy() {
  return (
    <section id="anatomy" className="relative overflow-hidden py-20 sm:py-28">
      <Flecks
        scope="anat-flecks"
        className="pointer-events-none absolute top-14 right-8 h-52 w-52 rotate-45 opacity-60 mix-blend-multiply"
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* sectioned drawing — sticky on desktop */}
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <p className="font-mono text-[11px] tracking-[0.28em] text-ice-500 uppercase">
            Anatomy
          </p>
          <h2 className="mt-4 text-4xl leading-[0.95] font-medium tracking-tighter text-white-ice sm:text-5xl">
            Every floor
            <span className="text-fog"> has a function.</span>
          </h2>

          {/* multiply drops the render's white ground into the page and leaves
              its blue wash reading as part of the ambient field */}
          <div className="relative mt-12">
            <Image
              src="/xray-section.png"
              alt="Cross-section of the can: 0.8 cm spent-pouch floor, 2.0 cm pouch floor, 1.3 cm ice tray, 6.8 cm across"
              width={1500}
              height={1055}
              sizes="(max-width: 1024px) 92vw, 42vw"
              className="h-auto w-full mix-blend-multiply"
            />
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-frost/8">
            {SPECS.map((s) => (
              <div key={s.k} className="bg-void p-4">
                <dt className="font-mono text-[11px] tracking-[0.18em] text-fog uppercase sm:text-[10px]">
                  {s.k}
                </dt>
                <dd
                  className={`mt-1.5 text-sm text-frost ${s.mono ? "font-mono" : ""}`}
                >
                  {s.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* layer notes — divided rows, no cards */}
        <ul className="divide-y divide-frost/8 border-t border-frost/8">
          {LAYERS.map((l, i) => (
            <Reveal
              as="li"
              key={l.n}
              delay={i * 80}
              className="group grid grid-cols-[auto_1fr] gap-6 py-9 transition-colors duration-500 hover:bg-slate-deep/25 sm:gap-10"
            >
              <span className="font-mono text-sm text-ice-700 transition-colors duration-500 group-hover:text-ice-300">
                {l.n}
              </span>
              <div>
                <h3 className="text-2xl leading-tight tracking-tight text-white-ice sm:text-3xl">
                  {l.title}
                </h3>
                <p className="mt-3 max-w-[54ch] text-sm leading-relaxed text-fog">
                  {l.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
