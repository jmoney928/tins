"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  XIcon,
  MinusIcon,
  PlusIcon,
  CheckIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useCart } from "./cart/cart-context";
import { ProductArt } from "./product-art";
import { CATALOG, money } from "@/lib/catalog";

/** Trigger + modal. Owns its own open state so it can sit anywhere. */
export function QuickView({
  productId,
  label = "Preview",
  className = "",
}: {
  productId: string;
  label?: string;
  className?: string;
}) {
  const product = CATALOG[productId];
  const cart = useCart();
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [shot, setShot] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setQty(1);
      setShot(0);
      setAdded(false);
    }
  }, [open]);

  const addAndOpenBag = () => {
    cart.add(product.id, qty);
    setAdded(true);
    window.setTimeout(() => {
      setOpen(false);
      cart.openDrawer();
    }, 550);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center gap-2 rounded-full border border-frost/12 px-5 py-2.5 text-sm text-frost transition-all duration-300 ease-[var(--ease-glide)] hover:border-ice-500/50 hover:bg-slate-deep/40 active:scale-[0.97] ${className}`}
      >
        <MagnifyingGlassIcon size={14} weight="bold" />
        {label}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[70] bg-ink/30 backdrop-blur-sm"
            />

            <motion.div
              role="dialog"
              aria-label={product.name}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.99 }}
              transition={{ type: "spring", stiffness: 160, damping: 24 }}
              className="fixed inset-x-4 top-1/2 z-[71] mx-auto max-h-[88dvh] w-auto max-w-4xl -translate-y-1/2 overflow-y-auto rounded-[2rem] border border-frost/10 bg-paper shadow-2xl sm:inset-x-6"
            >
              <button
                onClick={() => setOpen(false)}
                aria-label="Close preview"
                className="absolute top-5 right-5 z-10 rounded-full border border-frost/12 bg-paper/80 p-2 text-fog backdrop-blur transition-colors hover:text-frost"
              >
                <XIcon size={15} weight="bold" />
              </button>

              <div className="grid grid-cols-1 gap-0 md:grid-cols-[1fr_1fr]">
                <div className="p-5 sm:p-6">
                  <div className="overflow-hidden rounded-[1.5rem] bg-ink">
                    <ProductArt
                      product={product}
                      src={product.gallery[shot]}
                      sizes="(max-width: 768px) 90vw, 40vw"
                      className="aspect-square h-full w-full"
                    />
                  </div>

                  {product.gallery.length > 1 && (
                    <div className="mt-3 flex gap-3">
                      {product.gallery.map((g, i) => (
                        <button
                          key={g}
                          onClick={() => setShot(i)}
                          aria-label={`View image ${i + 1}`}
                          className={`h-16 w-16 overflow-hidden rounded-xl bg-ink transition-all duration-300 ${
                            i === shot
                              ? "ring-2 ring-ice-500"
                              : "opacity-60 hover:opacity-100"
                          }`}
                        >
                          <ProductArt
                            product={product}
                            src={g}
                            sizes="64px"
                            className="h-full w-full"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col p-6 sm:p-8 md:pl-2">
                  {product.remaining !== null && (
                    <p className="font-mono text-[10px] tracking-[0.2em] text-ice-700 uppercase">
                      {product.remaining} left in Drop 01
                    </p>
                  )}
                  <h2 className="mt-3 text-3xl leading-none tracking-tighter text-white-ice">
                    {product.name}
                  </h2>
                  <p className="mt-2 text-sm text-fog">{product.tagline}</p>
                  <p className="mt-5 text-sm leading-relaxed text-fog">
                    {product.blurb}
                  </p>

                  <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-frost/8">
                    {product.specs.slice(0, 6).map((s) => (
                      <div key={s.k} className="bg-paper px-4 py-3">
                        <dt className="font-mono text-[10px] tracking-[0.16em] text-fog uppercase">
                          {s.k}
                        </dt>
                        <dd className="mt-1 font-mono text-sm text-frost">
                          {s.v}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-auto flex flex-wrap items-center gap-4 border-t border-frost/8 pt-6">
                    <span className="font-mono text-2xl tracking-tight text-white-ice">
                      {money(product.price * qty)}
                    </span>

                    <div className="flex items-center rounded-full border border-frost/12">
                      <button
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        aria-label="One fewer"
                        className="px-3 py-2 text-fog transition-colors hover:text-frost"
                      >
                        <MinusIcon size={13} weight="bold" />
                      </button>
                      <span className="min-w-7 text-center font-mono text-sm text-frost">
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty((q) => Math.min(99, q + 1))}
                        aria-label="One more"
                        className="px-3 py-2 text-fog transition-colors hover:text-frost"
                      >
                        <PlusIcon size={13} weight="bold" />
                      </button>
                    </div>

                    <button
                      onClick={addAndOpenBag}
                      disabled={added}
                      className={`ml-auto flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 active:scale-[0.98] ${
                        added
                          ? "bg-ice-500 text-paper"
                          : "bg-ink text-paper hover:bg-ice-700"
                      }`}
                    >
                      {added ? (
                        <>
                          <CheckIcon size={14} weight="bold" />
                          In bag
                        </>
                      ) : (
                        "Add to bag"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
