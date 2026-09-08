"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  CATALOG,
  FREE_SHIPPING_OVER,
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
const CODE_KEY = "icetins:code";
const HOLD_KEY = "icetins:hold";
const RELEASED_KEY = "icetins:released";

/**
 * How long a bag is held.
 *
 * The timer in the drawer is only honest if something actually happens when
 * it runs out, so it does: the bag is released — emptied — and offered back
 * with one tap. That is the whole difference between a countdown and a
 * decoration, and it is what lets the drawer say "held" without lying.
 */
export const HOLD_MINUTES = 15;

export type Line = { id: string; qty: number };
export type FullLine = Line & { product: Product; total: number };

export type CodeState =
  | { status: "checking"; code: string }
  | { status: "applied"; code: string; discount: number; total: number }
  | { status: "invalid"; code: string; reason: string }
  | { status: "unverified"; code: string; reason: string };

type CartValue = {
  lines: FullLine[];
  count: number;
  subtotal: number;
  /** tin + refill pack, deducted once — 0 when the bag does not qualify */
  saving: number;
  /** everything taken off: Shopify's figure once a code is applied, else the pair saving */
  discount: number;
  /** true when the bag has earned free shipping */
  freeShipping: boolean;
  /** cents still to add before shipping is free; 0 once it is */
  toFreeShipping: number;
  shipping: number;
  /** the one-day free-shipping offer shown when the cart drawer opens */
  freeShippingPromo: boolean;
  total: number;
  /** false until localStorage has been read, so SSR and first paint agree */
  ready: boolean;
  drawerOpen: boolean;
  /** the discount code, in whatever state the last check left it */
  code: CodeState | null;
  applyCode: (code: string) => void;
  removeCode: () => void;
  /** when the hold on this bag ends, as a timestamp; null when the bag is empty */
  holdUntil: number | null;
  /** a bag that was released when its hold ran out, offered back */
  released: Line[] | null;
  restore: () => void;
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

const readJson = <T,>(key: string): T | null => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const validLines = (raw: unknown): Line[] =>
  Array.isArray(raw)
    ? (raw as Line[]).filter(
        (l) => l && typeof l.id === "string" && CATALOG[l.id] && l.qty > 0,
      )
    : [];

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [code, setCode] = useState<CodeState | null>(null);
  const [holdUntil, setHoldUntil] = useState<number | null>(null);
  const [released, setReleased] = useState<Line[] | null>(null);

  // hydrate once, dropping anything no longer in the catalogue
  useEffect(() => {
    setLines(validLines(readJson<Line[]>(KEY)));
    const savedCode = readJson<string>(CODE_KEY);
    if (savedCode) setCode({ status: "checking", code: savedCode });
    setHoldUntil(readJson<number>(HOLD_KEY));
    const rel = validLines(readJson<Line[]>(RELEASED_KEY));
    setReleased(rel.length ? rel : null);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines, ready]);

  useEffect(() => {
    if (!ready) return;
    if (holdUntil === null) window.localStorage.removeItem(HOLD_KEY);
    else window.localStorage.setItem(HOLD_KEY, JSON.stringify(holdUntil));
  }, [holdUntil, ready]);

  useEffect(() => {
    if (!ready) return;
    if (released === null) window.localStorage.removeItem(RELEASED_KEY);
    else window.localStorage.setItem(RELEASED_KEY, JSON.stringify(released));
  }, [released, ready]);

  useEffect(() => {
    if (!ready) return;
    const keep = code && code.status !== "invalid" ? code.code : null;
    if (keep) window.localStorage.setItem(CODE_KEY, JSON.stringify(keep));
    else window.localStorage.removeItem(CODE_KEY);
  }, [code, ready]);

  // the hold starts with the first item and is refreshed by every addition;
  // an empty bag holds nothing
  const touchHold = useCallback(() => {
    setHoldUntil(Date.now() + HOLD_MINUTES * 60_000);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (lines.length === 0) setHoldUntil(null);
  }, [lines.length, ready]);

  // when the hold runs out the bag is released, and kept aside to restore
  useEffect(() => {
    if (!ready || holdUntil === null) return;
    const release = () => {
      setLines((prev) => {
        if (prev.length) setReleased(prev);
        return [];
      });
      setHoldUntil(null);
    };
    const remaining = holdUntil - Date.now();
    if (remaining <= 0) {
      release();
      return;
    }
    const t = window.setTimeout(release, remaining);
    return () => window.clearTimeout(t);
  }, [holdUntil, ready]);

  const restore = useCallback(() => {
    setReleased((rel) => {
      if (rel) {
        setLines(rel);
        touchHold();
      }
      return null;
    });
  }, [touchHold]);

  const add = useCallback(
    (id: string, qty = 1) => {
      const product = CATALOG[id];
      if (!product) return;
      setLines((prev) => {
        const hit = prev.find((l) => l.id === id);
        if (!hit) return [...prev, { id, qty }];
        return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l));
      });
      setReleased(null);
      touchHold();
      trackPixel("AddToCart", {
        lines: [{ id, qty }],
        currency: CURRENCY_LABEL,
        value: (currentPrice(id) * qty) / 100,
      });
    },
    [touchHold],
  );

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

  const clear = useCallback(() => {
    setLines([]);
    setCode(null);
    setReleased(null);
  }, []);

  /**
   * A code is checked against Shopify with the bag as it stands, and checked
   * again whenever the bag changes, so the saving on screen is always the
   * saving for these lines. The result of a stale check is thrown away.
   */
  const checkSeq = useRef(0);
  const verify = useCallback(async (candidate: string, forLines: Line[]) => {
    const seq = ++checkSeq.current;
    setCode({ status: "checking", code: candidate });
    if (forLines.length === 0) {
      setCode(null);
      return;
    }
    try {
      const res = await fetch("/api/discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: forLines, code: candidate }),
      });
      const data = await res.json();
      if (seq !== checkSeq.current) return;
      if (!res.ok) {
        setCode({ status: "unverified", code: candidate, reason: data.error ?? "Could not check that code." });
        return;
      }
      if (data.applicable) {
        setCode({ status: "applied", code: data.code, discount: data.discount, total: data.total });
      } else {
        setCode({ status: "invalid", code: candidate, reason: data.reason ?? "That code does not apply." });
      }
    } catch {
      if (seq !== checkSeq.current) return;
      setCode({ status: "unverified", code: candidate, reason: "No connection. Try again." });
    }
  }, []);

  const applyCode = useCallback(
    (raw: string) => {
      const candidate = raw.trim().toUpperCase();
      if (!candidate) return;
      void verify(candidate, lines);
    },
    [lines, verify],
  );

  const removeCode = useCallback(() => {
    checkSeq.current++;
    setCode(null);
  }, []);

  // re-check a kept code when the bag changes, after the bag settles
  const codeName = code && code.status !== "invalid" ? code.code : null;
  useEffect(() => {
    if (!ready || !codeName) return;
    const t = window.setTimeout(() => void verify(codeName, lines), 350);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, ready, codeName, verify]);

  const value = useMemo<CartValue>(() => {
    const full: FullLine[] = lines.map((l) => ({
      ...l,
      product: CATALOG[l.id],
      total: currentPrice(l.id) * l.qty,
    }));
    const subtotal = full.reduce((n, l) => n + l.total, 0);
    const saving = bundleSaving(lines);
    const promo = freeShippingToday();
    const freeShip = qualifiesForFreeShipping(lines);
    // with a verified code, Shopify's total discount replaces our arithmetic
    const discount = code?.status === "applied" ? Math.min(code.discount, subtotal) : saving;
    const goods = subtotal - discount;
    const shipping = goods === 0 || promo || freeShip ? 0 : SHIPPING_FLAT;

    return {
      lines: full,
      count: full.reduce((n, l) => n + l.qty, 0),
      subtotal,
      saving,
      discount,
      shipping,
      freeShipping: freeShip,
      toFreeShipping: freeShip || promo ? 0 : Math.max(0, FREE_SHIPPING_OVER - subtotal),
      freeShippingPromo: promo,
      total: goods + shipping,
      ready,
      drawerOpen,
      code,
      applyCode,
      removeCode,
      holdUntil,
      released,
      restore,
      add,
      setQty,
      remove,
      clear,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    };
  }, [lines, ready, drawerOpen, code, applyCode, removeCode, holdUntil, released, restore, add, setQty, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
