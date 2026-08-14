import { CATALOG } from "./catalog";
import { db, dbConfig } from "./db";

/**
 * Stock levels.
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
  const cfg = dbConfig();

  if (cfg.state === "partial" || cfg.state === "malformed") {
    console.error(
      "[stock]",
      cfg.state === "partial" ? `${cfg.missing} is missing` : cfg.problem,
      "— refusing to guess at stock.",
    );
    return { ok: false, reason: "Could not check availability right now." };
  }

  if (cfg.state === "absent") {
    console.warn(
      "[stock] Supabase is not configured — using the in-memory fallback. Do not launch on this.",
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
  const cfg = dbConfig();

  if (cfg.state === "partial" || cfg.state === "malformed")
    // throw so the webhook 500s and Stripe retries once this is fixed
    throw new Error(
      cfg.state === "partial"
        ? `${cfg.missing} is missing — cannot record the order.`
        : cfg.problem,
    );

  if (cfg.state === "absent") {
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
