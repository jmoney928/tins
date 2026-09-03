"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { useCart } from "./cart/cart-context";

type State = "idle" | "adding" | "added";

/** Puts the tin and the three-pack in the bag together, then opens it. */
export function AddPairButton({ label }: { label: string }) {
  const cart = useCart();
  const [state, setState] = useState<State>("idle");
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const add = () => {
    if (state !== "idle") return;
    setState("adding");
    // "both" means both present, not two of each: a shopper who already
    // put a tin in the bag gets the pack added to it, not a second tin
    const has = (id: string) => cart.lines.some((l) => l.id === id);
    if (!has("ice-tin")) cart.add("ice-tin");
    if (!has("chillcore-3")) cart.add("chillcore-3");
    timers.current.push(
      window.setTimeout(() => {
        setState("added");
        cart.openDrawer();
      }, 420),
      window.setTimeout(() => setState("idle"), 2200),
    );
  };

  return (
    <button
      onClick={add}
      disabled={state !== "idle"}
      className={`flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-all duration-300 ease-[var(--ease-glide)] active:scale-[0.98] ${
        state === "added" ? "bg-ice-500 text-paper" : "bg-ink text-paper hover:bg-ice-700"
      }`}
    >
      {state === "adding" ? (
        <>
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-paper/35 border-t-paper" />
          Adding
        </>
      ) : state === "added" ? (
        <>
          <CheckIcon size={14} weight="bold" />
          In bag
        </>
      ) : (
        <>
          <PlusIcon size={14} weight="bold" />
          {label}
        </>
      )}
    </button>
  );
}
