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
  FREE_SHIPPING_OVER,
  SHIPPING_FLAT,
  type Product,
} from "@/lib/catalog";

const KEY = "icetins:cart";

export type Line = { id: string; qty: number };
export type FullLine = Line & { product: Product; total: number };

type CartValue = {
  lines: FullLine[];
  count: number;
  subtotal: number;
  shipping: number;
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
    if (!CATALOG[id]) return;
    setLines((prev) => {
      const hit = prev.find((l) => l.id === id);
      if (!hit) return [...prev, { id, qty }];
      return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l));
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
      total: CATALOG[l.id].price * l.qty,
    }));
    const subtotal = full.reduce((n, l) => n + l.total, 0);
    const shipping =
      subtotal === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FLAT;

    return {
      lines: full,
      count: full.reduce((n, l) => n + l.qty, 0),
      subtotal,
      shipping,
      total: subtotal + shipping,
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
