import {
  ArchiveIcon,
  SnowflakeIcon,
  WrenchIcon,
  TimerIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Flecks } from "./splatter";

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
    title: "The spent-pouch problem, solved",
    body: "A sealed top floor swallows used pouches — no wrappers, no cup holders, no putting it back in your cheek. Empty it when you empty your pockets.",
  },
  {
    Icon: SnowflakeIcon,
    title: "Twenty-five, always fresh",
    body: "A perforated tray sits over a slim frozen pack. Fridge temperature for six hours, so the last pouch tastes like the first — mint stays sharp, nothing dries out.",
  },
  {
    Icon: WrenchIcon,
    title: "Machined to outlast the habit",
    body: "6061-T6 aluminium, Cerakote matte black, sealed to IPX6 on two O-rings. Lifetime warranty on the shell. Buy it once.",
  },
  {
    Icon: TimerIcon,
    title: "Freezer to ready in 90 minutes",
    body: "Drop the pack in the freezer tonight, pocket it tomorrow. Ships worldwide from our Vancouver workshop.",
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
          {BLOCKS.map(({ Icon, title, body }) => (
            <div key={title} className="flex flex-col gap-4 bg-void p-7 sm:p-8">
              <Icon size={22} weight="light" className="text-ice-500" />
              <h3 className="text-lg leading-tight tracking-tight text-white-ice">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-fog">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
