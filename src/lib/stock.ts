import { CATALOG } from "./catalog";
import { db, dbConfigured } from "./db";

/**
 * Drop allocation.
 *
 * Backed by Supabase when it is configured. Without it we fall back to an
 * in-memory map so the site still runs locally — but that map resets on every
 * restart and is per-instance, so it must never be what production uses.
 */

const fallback = new Map<string, number>(
  Object.values(CATALOG).map((p) => [
    p.id,
    p.remaining ?? Number.POSITIVE_INFINITY,
  ]),
);

export type StockRead =
  | { ok: true; remaining: number }
  | { ok: false; reason: string };

/** How many are left. Unlimited products report Infinity. */
export async function remaining(sku: string): Promise<StockRead> {
  if (!dbConfigured()) {
    console.warn(
      "[stock] Supabase is not configured — using the in-memory fallback. Do not ship a drop on this.",
    );
    return { ok: true, remaining: fallback.get(sku) ?? 0 };
  }

  const { data, error } = await db()
    .from("products")
    .select("remaining")
    .eq("sku", sku)
    .maybeSingle();

  if (error) {
    console.error("[stock] read failed:", error.message);
    // fail closed — never sell stock we could not verify
    return { ok: false, reason: "Could not check availability right now." };
  }
  if (!data) return { ok: false, reason: "That product is not on sale." };

  return {
    ok: true,
    remaining: data.remaining === null ? Number.POSITIVE_INFINITY : data.remaining,
  };
}

export type SettleLine = {
  sku: string;
  name: string;
  qty: number;
  unit_amount: number;
  total_amount: number;
};

export type SettleInput = {
  sessionId: string;
  paymentIntent: string | null;
  email: string | null;
  name: string | null;
  currency: string;
  subtotal: number | null;
  shipping: number | null;
  total: number | null;
  shippingName: string | null;
  address: Record<string, unknown> | null;
  lines: SettleLine[];
};

/**
 * Records the order and decrements stock in one transaction.
 * Returns false when the session was already settled (a webhook retry).
 */
export async function settleOrder(input: SettleInput): Promise<boolean> {
  if (!dbConfigured()) {
    for (const l of input.lines) {
      const now = fallback.get(l.sku);
      if (now !== undefined && now !== Number.POSITIVE_INFINITY)
        fallback.set(l.sku, Math.max(0, now - l.qty));
    }
    console.warn("[stock] settled in memory only — Supabase is not configured");
    return true;
  }

  const { data, error } = await db().rpc("settle_order", {
    p_session_id: input.sessionId,
    p_payment_intent: input.paymentIntent,
    p_email: input.email,
    p_name: input.name,
    p_currency: input.currency,
    p_subtotal: input.subtotal,
    p_shipping: input.shipping,
    p_total: input.total,
    p_shipping_name: input.shippingName,
    p_address: input.address,
    p_lines: input.lines,
  });

  if (error) throw new Error(`settle_order failed: ${error.message}`);
  return Boolean((data as { applied?: boolean } | null)?.applied);
}
