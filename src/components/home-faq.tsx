import { Reveal } from "./reveal";
import { GUARANTEE_MEDIUM } from "@/lib/guarantee";
import { dispatchShort } from "@/lib/fulfilment";

/**
 * The four questions that stop a first-time buyer, answered in the order
 * they are usually asked. Written afresh rather than copied from the
 * product page's FAQ, which owns the full list and the structured data.
 */
function questions() {
  return [
    {
      q: "Does it really stay cold all day?",
      a: "Six hours at fridge temperature in a 22°C room with a frozen pack and the lid closed, which is a full shift. The same tin with the tray empty holds for about an hour, so the cold is the pack, not the metal.",
    },
    {
      q: "How long until it arrives?",
      a: `Each tin is machined to order. ${dispatchShort()} A tracking number is emailed the morning it leaves.`,
    },
    {
      q: "What if it is not for me?",
      a: GUARANTEE_MEDIUM,
    },
    {
      q: "Is there anything in it?",
      a: "No. Ice Tins Supply Co. sells empty machined cans and ice packs only, and does not sell, ship or supply nicotine or tobacco in any form.",
    },
  ];
}

export function HomeFaq() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.28em] text-ice-500 uppercase">
            Before you order
          </p>
          <h2 className="mt-4 max-w-[22ch] text-3xl leading-[0.95] font-medium tracking-tighter text-white-ice sm:text-4xl">
            Four things people ask first.
          </h2>
        </Reveal>

        <Reveal as="dl" delay={80} className="mt-10 divide-y divide-frost/8 border-t border-frost/8">
          {questions().map((f) => (
            <div
              key={f.q}
              className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-[minmax(0,22rem)_1fr] sm:gap-10"
            >
              <dt className="text-base font-medium text-white-ice">{f.q}</dt>
              <dd className="max-w-[58ch] text-sm leading-relaxed text-fog">{f.a}</dd>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
