import {
  DropIcon,
  SnowflakeIcon,
  WrenchIcon,
  TimerIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Flecks } from "./splatter";
import { Reveal } from "./reveal";

/**
 * The four blocks directly under the hero.
 *
 * Cold first, because it is the claim the product rests on and the one a
 * buyer doubts most; the seal second, because it is what makes the cold
 * possible. A spent-pouch floor used to lead this row. Every tin on the
 * market has one, and leading with a feature the reader already owns
 * reads as not knowing the category.
 */
const BLOCKS = [
  {
    Icon: SnowflakeIcon,
    title: "Twenty-five pouches held cold",
    body: "A perforated tray sits directly over the frozen pack, holding fridge temperature for six hours. A warm pouch is a warm beer: the last one of the day tastes the same as the first.",
  },
  {
    Icon: DropIcon,
    title: "Sealed on two O-rings",
    body: "Each floor closes onto its own silicone O-ring, rated to IPX6. The seal is what keeps the cold in for a full shift, and it keeps rain, sweat and a wet pocket out.",
  },
  {
    Icon: WrenchIcon,
    title: "Machined for daily use",
    body: "Cut from solid 6061-T6 aluminium with a Cerakote matte black finish. It does not crack, swell or lose its thread, and the shell carries a lifetime warranty.",
  },
  {
    Icon: TimerIcon,
    title: "Ready in ninety minutes",
    body: "The Chillcore pack sets in ninety minutes in a standard freezer drawer. Freeze one overnight and swap it in the morning; a three-pack keeps a spare ready so there is never a wait.",
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="relative overflow-hidden py-20 sm:py-24">
      <Flecks
        scope="benefits-flecks"
        className="pointer-events-none absolute -top-6 left-10 h-44 w-44 -rotate-12 opacity-50 mix-blend-multiply"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[2rem] bg-frost/8 sm:grid-cols-2 lg:grid-cols-4">
          {BLOCKS.map(({ Icon, title, body }, i) => (
            <div key={title} className="bg-void p-7 sm:p-8">
              {/* the cell stays put and its contents rise into it, so the
                  grid's hairlines never read as grey placeholder cards */}
              <Reveal delay={i * 70} className="flex flex-col gap-4">
                <Icon size={22} weight="light" className="text-ice-500" />
                <h3 className="text-lg leading-tight tracking-tight text-white-ice">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-fog">{body}</p>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
