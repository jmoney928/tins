import { CARRIERS } from "@/lib/testers";
import { Reveal } from "./reveal";

const NOTES = CARRIERS.slice(0, 3);

/**
 * Three tester notes, quoted as written, no star ratings.
 *
 * Shared by the home page and the product page so the proof a shopper
 * meets before the offer is the same proof they meet beside the button.
 * The heading differs per page; the field-notes page owns the full set.
 */
export function FieldNotes({ title }: { title: string }) {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.28em] text-ice-500 uppercase">
            Field notes
          </p>
          <h2 className="mt-4 max-w-[22ch] text-3xl leading-[0.95] font-medium tracking-tighter text-white-ice sm:text-4xl">
            {title}
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {NOTES.map((c, i) => (
            <Reveal
              as="figure"
              key={c.name}
              delay={i * 100}
              className="glass-edge flex flex-col justify-between rounded-[1.75rem] bg-paper/75 p-6 backdrop-blur-sm sm:p-7"
            >
              <blockquote className="text-base leading-snug tracking-tight text-frost">
                &ldquo;{c.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3 border-t border-frost/8 pt-5">
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br ${c.tint} font-mono text-[11px]`}
                >
                  {c.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm text-white-ice">{c.name}</span>
                  <span className="block font-mono text-[11px] text-fog">
                    {c.role} — {c.city}
                  </span>
                </span>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
