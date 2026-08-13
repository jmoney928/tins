import { NextResponse } from "next/server";
import { dbConfig, db } from "@/lib/db";
import { inspectKey } from "@/lib/stripe";

export const dynamic = "force-dynamic";

/**
 * Operational readiness. Reports whether each dependency is configured and
 * reachable, and — when something is wrong — what the provider actually said.
 *
 * Nothing secret is returned: no keys, no connection strings, only the
 * provider's own error text, which is what makes a misconfiguration fixable
 * without shell access to production.
 */
export async function GET() {
  const key = inspectKey();
  const cfg = dbConfig();

  const supabase: Record<string, unknown> = { config: cfg.state };
  if (cfg.state === "partial") supabase.missing = cfg.missing;
  if (cfg.state === "malformed") supabase.problem = cfg.problem;

  if (cfg.state === "ready") {
    // does the table exist, and can we read it?
    const products = await db().from("products").select("sku, remaining");
    if (products.error) {
      supabase.reachable = false;
      supabase.error = products.error.message;
      supabase.hint = /does not exist|schema cache/i.test(products.error.message)
        ? "Run supabase/schema.sql in the SQL editor."
        : undefined;
    } else {
      supabase.reachable = true;
      supabase.products = products.data;
    }

    // does the settle_order function exist? call it with a bad payload on
    // purpose — a missing function and a rejected payload are different errors
    const rpc = await db().rpc("settle_order", {
      p_session_id: "__healthcheck__",
      p_payment_intent: null,
      p_email: null,
      p_name: null,
      p_currency: "cad",
      p_subtotal: 0,
      p_shipping: 0,
      p_total: 0,
      p_shipping_name: null,
      p_address: null,
      p_lines: [{ sku: "__nope__", name: "x", qty: 1, unit_amount: 0, total_amount: 0 }],
    });
    const msg = rpc.error?.message ?? "";
    supabase.settle_order = /could not find the function|does not exist/i.test(msg)
      ? "missing — run supabase/schema.sql"
      : /unknown sku/i.test(msg)
        ? "present (rejected the probe correctly)"
        : rpc.error
          ? `present, unexpected: ${msg}`
          : "present but accepted a bad probe — check the function body";
  }

  return NextResponse.json({
    stripe: key.ok ? "ready" : `not ready (${key.reason})`,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ? "set" : "missing",
    supabase,
  });
}
