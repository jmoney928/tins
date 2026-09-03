import {
  ArchiveIcon,
  SnowflakeIcon,
  WrenchIcon,
  TimerIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Flecks } from "./splatter";
import { Reveal } from "./reveal";

/**
 * The four blocks directly under the hero.
 *
 * Ordered by how strongly a buyer feels each one, which is not the order the
 * product was engineered in. Disposal comes first: every user meets the spent
 * pouch several times a day and has no good answer for it, while "warm by two
 * o'clock" is a preference people have already made peace with. Cold is the
 * second block, not the first — it is what makes the object worth its price
 * once someone is already interested, and it is the claim they doubt most.
 */
const BLOCKS = [
  {
    Icon: ArchiveIcon,
    title: "A dedicated floor for spent pouches",
    body: "The sealed upper floor holds up to fifteen used pouches, kept apart from the fresh ones and from everything else in a pocket or a bag. Empty it whenever convenient.",
  },
  {
    Icon: SnowflakeIcon,
    title: "Twenty-five pouches held cold",
    body: "A perforated tray sits directly over the frozen pack, holding fridge temperature for six hours. A warm pouch is a warm beer: the last one of the day tastes the same as the first.",
  },
  {
    Icon: WrenchIcon,
    title: "Machined for daily use",
    body: "6061-T6 aluminium with a Cerakote matte black finish, sealed to IPX6 on two silicone O-rings. The shell carries a lifetime warranty.",
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
