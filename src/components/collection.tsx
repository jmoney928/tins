import Image from "next/image";
import { CheckIcon } from "@phosphor-icons/react/dist/ssr";
import { CATALOG, CURRENCY_LABEL, money } from "@/lib/catalog";
import { AddButton } from "./add-button";
import { QuickView } from "./quick-view";

export function Collection() {
  // one source of truth: the same records Stripe is charged from
  const tin = CATALOG["ice-tin"];
  const core = CATALOG["chillcore-3"];

  return (
    <section id="collection" className="relative overflow-hidden py-20 sm:py-28">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* centred, to break the left-head / right-body pattern used elsewhere */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] tracking-[0.28em] text-ice-500 uppercase">
            The tin
          </p>
          <h2 className="mt-4 text-4xl leading-[0.95] font-medium tracking-tighter text-white-ice sm:text-5xl">
            One can.
            <span className="text-fog"> Made properly.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[46ch] text-sm leading-relaxed text-fog">
            We make one tin and the packs that go in it. No colourways to pick
            between and nothing bolted on — just the thing, machined once and
            machined right.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          {/* the lid, shot dark — the one place the page goes to black */}
          <div className="relative overflow-hidden rounded-[2rem] bg-ink">
            <Image
              src="/tin-lid.jpg"
              alt="The engraved Ice Tins Supply Co. lid, machined matte black aluminium"
              width={1000}
              height={1000}
              sizes="(max-width: 1024px) 92vw, 46vw"
              className="h-full w-full object-cover"
            />
            <span className="absolute top-6 left-6 rounded-full border border-white/15 bg-ink/70 px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-ice-300 uppercase backdrop-blur-md">
              {tin.remaining} left in Drop 01
            </span>
          </div>

          <div className="glass-edge flex flex-col rounded-[2rem] bg-paper/75 p-8 backdrop-blur-sm sm:p-10">
            <h3 className="text-2xl leading-tight tracking-tight text-white-ice">
              {tin.name}
            </h3>
            <p className="mt-2 font-mono text-[11px] tracking-[0.14em] text-ice-700 uppercase">
              {tin.tagline}
            </p>
            <p className="mt-4 max-w-[40ch] text-sm leading-relaxed text-fog">
              {tin.blurb}
            </p>

            <ul className="mt-8 flex flex-col gap-3.5 border-t border-frost/8 pt-8">
              {tin.points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-frost">
                  <CheckIcon
                    size={14}
                    weight="bold"
                    className="mt-1 shrink-0 text-ice-500"
                  />
                  {p}
                </li>
              ))}
            </ul>

            <div className="mt-auto flex items-center justify-between gap-4 border-t border-frost/8 pt-8">
              <span className="font-mono text-2xl tracking-tight text-white-ice">
                {money(tin.price)}
                <span className="ml-2 text-xs text-fog">{CURRENCY_LABEL}</span>
              </span>
              <div className="flex items-center gap-3">
                <QuickView productId="ice-tin" />
                <AddButton productId="ice-tin" label="Add to bag" />
              </div>
            </div>
          </div>
        </div>

        {/* the refill, kept deliberately short — it is an add-on, not a rival */}
        <div className="glass-edge mt-5 flex flex-col gap-6 rounded-[2rem] bg-paper/75 p-6 backdrop-blur-sm sm:flex-row sm:items-center sm:gap-8 sm:p-7">
          <div className="relative h-20 w-24 shrink-0">
            <Image
              src={core.image!}
              alt={core.name}
              width={856}
              height={900}
              sizes="96px"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-lg leading-tight tracking-tight text-white-ice">
              {core.name}
            </h3>
            <p className="mt-1.5 max-w-[46ch] text-sm leading-relaxed text-fog">
              {core.tagline}
            </p>
          </div>

          <dl className="hidden items-center gap-6 xl:flex">
            {core.specs.slice(0, 3).map((s) => (
              <div key={s.k}>
                <dt className="font-mono text-[10px] tracking-[0.16em] text-fog uppercase">
                  {s.k}
                </dt>
                <dd className="mt-1 font-mono text-sm text-frost">{s.v}</dd>
              </div>
            ))}
          </dl>

          <div className="flex shrink-0 items-center justify-between gap-5 border-t border-frost/8 pt-5 sm:border-t-0 sm:pt-0">
            <span className="font-mono text-lg tracking-tight text-white-ice">
              {money(core.price)}
              <span className="ml-2 text-xs text-fog">{CURRENCY_LABEL}</span>
            </span>
            <div className="flex items-center gap-3">
              <QuickView productId="chillcore-3" className="hidden sm:flex" />
              <AddButton productId="chillcore-3" label="Add pack" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
