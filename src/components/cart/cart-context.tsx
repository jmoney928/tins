"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CATALOG,
  SHIPPING_FLAT,
  CURRENCY_LABEL,
  freeShippingToday,
  currentPrice,
  bundleSaving,
  qualifiesForFreeShipping,
  type Product,
} from "@/lib/catalog";
import { trackPixel } from "@/lib/pixel";

const KEY = "icetins:cart";

export type Line = { id: string; qty: number };
export type FullLine = Line & { product: Product; total: number };

type CartValue = {
  lines: FullLine[];
  count: number;
  subtotal: number;
  /** tin + refill pack, deducted once — 0 when the bag does not qualify */
  saving: number;
  /** true when the bag has earned free shipping (the pair, not a total) */
  freeShipping: boolean;
  shipping: number;
  /** the one-day free-shipping offer shown when the cart drawer opens */
  freeShippingPromo: boolean;
  total: number;
  /** false until localStorage has been read, so SSR and first paint agree */
  ready: boolean;
  drawerOpen: boolean;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const Ctx = createContext<CartValue | null>(null);

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used inside <CartProvider>");
  return v;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // hydrate once, dropping anything no longer in the catalogue
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Line[];
        setLines(
          parsed.filter(
            (l) => l && typeof l.id === "string" && CATALOG[l.id] && l.qty > 0,
          ),
        );
      }
    } catch {
      /* corrupt payload — start empty rather than throw on load */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const add = useCallback((id: string, qty = 1) => {
    const product = CATALOG[id];
    if (!product) return;
    setLines((prev) => {
      const hit = prev.find((l) => l.id === id);
      if (!hit) return [...prev, { id, qty }];
      return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l));
    });
    trackPixel("AddToCart", {
      lines: [{ id, qty }],
      currency: CURRENCY_LABEL,
      value: (currentPrice(id) * qty) / 100,
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, qty: Math.min(qty, 99) } : l)),
    );
  }, []);

  const remove = useCallback(
    (id: string) => setLines((prev) => prev.filter((l) => l.id !== id)),
    [],
  );

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartValue>(() => {
    const full: FullLine[] = lines.map((l) => ({
      ...l,
      product: CATALOG[l.id],
      total: currentPrice(l.id) * l.qty,
    }));
    const subtotal = full.reduce((n, l) => n + l.total, 0);
    const saving = bundleSaving(lines);
    const promo = freeShippingToday();
    // free shipping is earned by the tin-and-pack pair, not by order size
    const freeShip = qualifiesForFreeShipping(lines);
    const goods = subtotal - saving;
    const shipping = goods === 0 || promo || freeShip ? 0 : SHIPPING_FLAT;

    return {
      lines: full,
      count: full.reduce((n, l) => n + l.qty, 0),
      subtotal,
      saving,
      shipping,
      freeShipping: freeShip,
      freeShippingPromo: promo,
      total: goods + shipping,
      ready,
      drawerOpen,
      add,
      setQty,
      remove,
      clear,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    };
  }, [lines, ready, drawerOpen, add, setQty, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
