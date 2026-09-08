"use client";

import { useId, useRef, useState } from "react";
import { ArrowRightIcon, CheckIcon } from "@phosphor-icons/react/dist/ssr";
import { trackPixel } from "@/lib/pixel";

type State = "idle" | "sending" | "done";

/**
 * The one thing the site asks for while there is nothing to sell.
 *
 * It appears wherever a buy button used to, so a visitor convinced at any
 * point on the page can act there rather than hunting for a form. Each copy
 * names its own `source`, which is stored with the address — it is the only
 * way to learn which part of the page actually persuades anyone.
 */
export function WaitlistForm({
  source,
  tone = "light",
  label = "Join the waitlist",
  note,
  className = "",
}: {
  source: string;
  /** "dark" for the hero, which sits on the cave */
  tone?: "light" | "dark";
  label?: string;
  note?: string;
  className?: string;
}) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);

  const dark = tone === "dark";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "sending" || state === "done") return;
    setError("");
    setState("sending");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source,
          company: honeypot.current?.value ?? "",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Try again.");
        setState("idle");
        return;
      }
      setCount(typeof data.count === "number" ? data.count : null);
      setState("done");
      trackPixel("Lead");
    } catch {
      setError("No connection. Check your network and try again.");
      setState("idle");
    }
  };

  if (state === "done") {
    return (
      <div className={className}>
        <p
          className={`flex items-start gap-2.5 rounded-2xl border px-4 py-3.5 text-sm leading-relaxed ${
            dark
              ? "border-ice-300/30 bg-white/10 text-ice-100"
              : "border-ice-500/25 bg-ice-100/70 text-ice-700"
          }`}
        >
          <CheckIcon
            size={15}
            weight="bold"
            className={`mt-0.5 shrink-0 ${dark ? "text-ice-300" : "text-ice-700"}`}
          />
          <span>
            <span className="font-medium">You are on the list.</span> We will email
            you the day it opens.
            {count !== null && count >= 25 && ` You are one of ${count} waiting.`}
          </span>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={className} noValidate>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor={id} className="sr-only">
          Email address
        </label>
        <input
          id={id}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          /* text-base, not text-sm: iOS Safari zooms the viewport whenever a
             focused field is under 16px, and it does not zoom back out */
          className={`min-h-13 w-full flex-1 rounded-full border px-5 py-3.5 text-base outline-none transition-colors duration-300 ${
            dark
              ? "border-white/25 bg-white/10 text-white placeholder:text-ice-100/50 focus:border-ice-300"
              : "border-frost/15 bg-paper/70 text-frost placeholder:text-fog/60 focus:border-ice-500/60"
          }`}
        />

        {/* not shown to anyone, not announced to a screen reader */}
        <input
          ref={honeypot}
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="pointer-events-none absolute h-0 w-0 opacity-0"
        />

        <button
          type="submit"
          disabled={state === "sending"}
          className={`group flex min-h-13 shrink-0 items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-all duration-300 ease-[var(--ease-glide)] active:scale-[0.98] disabled:opacity-70 ${
            dark
              ? "bg-ice-100 text-ink hover:bg-white"
              : "bg-ink text-paper hover:bg-ice-700"
          }`}
        >
          {state === "sending" ? (
            <>
              <span
                className={`h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] ${
                  dark ? "border-ink/30 border-t-ink" : "border-paper/35 border-t-paper"
                }`}
              />
              Adding you
            </>
          ) : (
            <>
              {label}
              <ArrowRightIcon
                size={14}
                weight="bold"
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </>
          )}
        </button>
      </div>

      {error ? (
        <p role="alert" className={`mt-2.5 text-xs ${dark ? "text-ice-100" : "text-[#a33e37]"}`}>
          {error}
        </p>
      ) : (
        note && (
          <p className={`mt-2.5 text-xs ${dark ? "text-ice-100/70" : "text-fog"}`}>{note}</p>
        )
      )}
    </form>
  );
}
