"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { useCart } from "./cart/cart-context";

type State = "idle" | "adding" | "added";

/** Adds a real line to the bag, then slides the drawer open. */
export function AddButton({
  productId,
  label = "Add",
  openBag = true,
}: {
  productId: string;
  label?: string;
  openBag?: boolean;
}) {
  const cart = useCart();
  const [state, setState] = useState<State>("idle");
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const add = () => {
    if (state !== "idle") return;
    setState("adding");
    cart.add(productId);
    timers.current.push(
      window.setTimeout(() => {
        setState("added");
        if (openBag) cart.openDrawer();
      }, 420),
      window.setTimeout(() => setState("idle"), 2200),
    );
  };

  return (
    <button
      onClick={add}
      className={`flex min-h-11 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ease-[var(--ease-glide)] active:scale-[0.97] ${
        state === "added"
          ? "bg-ice-500 text-paper"
          : "bg-ink text-paper hover:bg-ice-700"
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
