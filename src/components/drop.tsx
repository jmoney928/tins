"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightIcon, SnowflakeIcon, WarningCircleIcon } from "@phosphor-icons/react/dist/ssr";

/** [label, date, is the live one] */
const DROPS: [string, string, boolean][] = [
  ["Drop 01", "1 Sep", true],
  ["Drop 02", "1 Oct", false],
  ["Drop 03", "1 Nov", false],
];

type Status =
  | { s: "idle" }
  | { s: "sending" }
  | { s: "error"; message: string }
  | { s: "done"; position: number };

export function Drop() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ s: "idle" });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status.s === "sending") return;
    setStatus({ s: "sending" });

    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus({ s: "error", message: data.error ?? "Something broke. Try again." });
        return;
      }
      setStatus({ s: "done", position: data.position });
    } catch {
      setStatus({ s: "error", message: "No connection. Check your network." });
    }
  };

  const invalid = status.s === "error";

  return (
    <section id="drop" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="glass-edge relative overflow-hidden rounded-[2.5rem] bg-abyss/80 px-6 py-14 backdrop-blur-md sm:px-14 sm:py-20">
        <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(46,157,200,0.28),transparent_65%)] blur-2xl" />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_minmax(0,26rem)] lg:gap-20">
          <div>
            <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.28em] text-ice-500 uppercase">
              <SnowflakeIcon size={13} weight="light" />
              Drop 01 — 1 September
            </p>
            <h2 className="mt-5 max-w-[18ch] text-4xl leading-[0.95] font-medium tracking-tighter text-white-ice sm:text-5xl">
              340 units.
              <span className="text-fog"> Then we do it again.</span>
            </h2>
            <p className="mt-6 max-w-[48ch] text-sm leading-relaxed text-fog">
              Drop 01 opens 1 September, 340 tins. After that a new
              drop lands on the first of every month — new colourways, same
              three floors, never a restock of the last one.
            </p>

            <ul className="mt-8 flex flex-wrap gap-2">
              {DROPS.map(([n, when, live]) => (
                <li
                  key={n as string}
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] uppercase ${
                    live ? "bg-ink text-paper" : "border border-frost/12 text-fog"
                  }`}
                >
                  {live && (
                    <span className="animate-breathe h-1.5 w-1.5 rounded-full bg-ice-300" />
                  )}
                  {n} — {when}
                </li>
              ))}
            </ul>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {status.s === "done" ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 110, damping: 18 }}
                className="flex flex-col justify-center rounded-2xl border border-ice-500/30 bg-ice-100 p-7"
              >
                <SnowflakeIcon size={22} weight="thin" className="text-ice-700" />
                <p className="mt-4 text-lg tracking-tight text-white-ice">
                  You are in.
                </p>
                <p className="mt-2 text-sm leading-relaxed text-fog">
                  Number{" "}
                  <span className="font-mono text-ice-700">
                    {status.position.toLocaleString()}
                  </span>{" "}
                  in the queue for Drop 01. Watch for a message from
                  drops@icetins.com — move it out of Promotions.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={submit}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ type: "spring", stiffness: 110, damping: 18 }}
                className="flex flex-col justify-center gap-2"
                noValidate
              >
                <label
                  htmlFor="drop-email"
                  className="font-mono text-[11px] tracking-[0.2em] text-fog uppercase"
                >
                  Email
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="drop-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status.s === "error") setStatus({ s: "idle" });
                    }}
                    placeholder="you@domain.com"
                    aria-invalid={invalid}
                    aria-describedby="drop-help"
                    className={`w-full rounded-full border bg-paper px-5 py-3.5 text-sm text-frost transition-colors duration-300 outline-none placeholder:text-fog/55 ${
                      invalid
                        ? "border-[#b4463f]/70"
                        : "border-frost/12 focus:border-ice-500"
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={status.s === "sending"}
                    className="group flex shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-paper transition-all duration-300 ease-[var(--ease-glide)] hover:bg-ice-700 active:scale-[0.98] disabled:opacity-70"
                  >
                    {status.s === "sending" ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-paper/35 border-t-paper" />
                        Adding
                      </>
                    ) : (
                      <>
                        Notify me
                        <ArrowRightIcon
                          size={14}
                          weight="bold"
                          className="transition-transform duration-300 ease-[var(--ease-glide)] group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </button>
                </div>

                <p
                  id="drop-help"
                  className={`mt-1 flex items-start gap-1.5 text-xs leading-relaxed ${
                    invalid ? "text-[#a33e37]" : "text-fog/80"
                  }`}
                  role={invalid ? "alert" : undefined}
                >
                  {invalid && (
                    <WarningCircleIcon
                      size={13}
                      weight="fill"
                      className="mt-0.5 shrink-0"
                    />
                  )}
                  {invalid
                    ? status.message
                    : "Two emails per drop. Unsubscribe in one click."}
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
