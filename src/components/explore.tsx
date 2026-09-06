import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./reveal";

/**
 * Links out to the topic pages that used to be homepage anchors.
 *
 * These are summaries, not copies: the full sections live on their own URLs
 * now, and repeating them here would recreate the problem splitting them was
 * meant to solve — one document competing with itself for every query.
 *
 * The card titles deliberately differ from the headings on the pages they
 * link to. Reusing a page's own H2 as its teaser puts the two URLs back in
 * competition for the same phrase, which is the thing being fixed — and two
 * of them also repeated the eyebrow sitting directly above them, so the
 * reader met "cold system" and "field" twice in as many lines.
 */
const TOPICS = [
  {
    href: "/cold-system",
    eyebrow: "The cold system",
    title: "Six hours, and how we know",
    body: "Where the cold comes from, how long it lasts in a warm room, and what happens when the pack is left out. The testing behind the number, for anyone who wants to check it.",
  },
  {
    href: "/build",
    eyebrow: "The build",
    title: "What it is made of",
    body: "Cut from a solid block of aluminium and finished matte black. The size, the weight, the three floors and the seals, for anyone who likes to know exactly what they are holding.",
  },
  {
    href: "/field-notes",
    eyebrow: "Field notes",
    title: "A season of working shifts",
    body: "Reports from five testers who carried the tin through a full season of working shifts, across five cities and four trades.",
  },
];

export function Explore() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[2rem] bg-frost/8 sm:grid-cols-3">
          {TOPICS.map((t, i) => (
            <Link
              key={t.href}
              href={t.href}
              className="group block bg-void p-7 transition-colors duration-500 hover:bg-slate-deep/30 sm:p-8"
            >
              <Reveal delay={i * 80} className="flex flex-col gap-3">
              <p className="font-mono text-[11px] tracking-[0.24em] text-ice-500 uppercase">
                {t.eyebrow}
              </p>
              <h3 className="flex items-start gap-2 text-xl leading-tight tracking-tight text-white-ice">
                {t.title}
                <ArrowUpRightIcon
                  size={16}
                  weight="bold"
                  className="mt-1 shrink-0 text-fog transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ice-300"
                />
              </h3>
              <p className="text-sm leading-relaxed text-fog">{t.body}</p>
              </Reveal>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
