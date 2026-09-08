import { NextResponse } from "next/server";
import { dbConfig, db } from "@/lib/db";
import { inspectKey } from "@/lib/stripe";
import { shopifyDiagnostics, shopifyAdminDiagnostics } from "@/lib/shopify";

export const dynamic = "force-dynamic";

/**
 * Operational readiness. Reports whether each dependency is configured and
 * reachable, and — when something is wrong — what the provider actually said.
 *
 * Nothing secret is returned: no keys, no connection strings, only the
 * provider's own error text, which is what makes a misconfiguration fixable
 * without shell access to production.
 */
/** Is the sending key real, and which domains may it send from? */
async function resendDiagnostics() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { state: "not configured" };
  try {
    const res = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(6000),
    });
    const text = await res.text();
    if (!res.ok) return { state: "rejected", status: res.status, said: text.slice(0, 200) };
    const parsed = JSON.parse(text) as { data?: { name: string; status: string }[] };
    return {
      state: "ok",
      from: process.env.ORDER_FROM_EMAIL ?? "Ice Tins Supply Co. <shop@icetins.com>",
      noticeTo: process.env.WAITLIST_NOTIFY_EMAIL ?? process.env.ORDER_REPLY_TO ?? "shop@icetins.com",
      domains: (parsed.data ?? []).map((d) => `${d.name}:${d.status}`),
    };
  } catch (err) {
    return { state: "unreachable", said: err instanceof Error ? err.message : String(err) };
  }
}

export async function GET() {
  const key = inspectKey();
  const cfg = dbConfig();

  const resend = await resendDiagnostics();
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

    // the waitlist is the only thing the site collects right now, so a
    // missing table is the most important thing this endpoint can report
    const read = await db().from("waitlist").select("email", { count: "exact", head: true });
    if (read.error) {
      supabase.waitlist = {
        state: "unavailable",
        error: read.error.message,
        hint: /does not exist|schema cache/i.test(read.error.message)
          ? "Run supabase/schema.sql in the SQL editor to create it."
          : undefined,
      };
    } else {
      const probe = "__healthcheck__@icetins.invalid";
      const full = await db()
        .from("waitlist")
        .upsert(
          { email: probe, source: "healthcheck", referrer: null, utm: null, fbp: null, fbc: null, user_agent: null, ip: null },
          { onConflict: "email", ignoreDuplicates: true },
        );
      const minimal = full.error
        ? await db().from("waitlist").upsert({ email: probe }, { onConflict: "email", ignoreDuplicates: true })
        : null;
      await db().from("waitlist").delete().eq("email", probe);

      supabase.waitlist = {
        state: "present",
        signups: read.count ?? 0,
        writable: !full.error,
        fullRowError: full.error?.message,
        minimalRowWritable: minimal ? !minimal.error : undefined,
        minimalRowError: minimal?.error?.message,
      };
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
    // the recovery table is newer than the rest of the schema, and a missing
    // one fails silently: checkout still succeeds, the row is simply never
    // written and nobody is ever reminded. Worth a probe of its own.
    const recovery = await db().from("abandoned_checkouts").select("id").limit(1);
    supabase.abandoned_checkouts = recovery.error
      ? /does not exist|schema cache/i.test(recovery.error.message)
        ? "missing — re-run supabase/schema.sql"
        : `unreadable: ${recovery.error.message}`
      : "present";

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
    // configuration only — whether Meta and Resend actually accept what we
    // send them is not something a health check can answer, and pretending
    // otherwise would be worse than saying nothing
    metaCapi: process.env.META_PIXEL_ID && process.env.META_CAPI_ACCESS_TOKEN
      ? "configured"
      : "missing META_PIXEL_ID or META_CAPI_ACCESS_TOKEN",
    email: resend,
    cronSecret: process.env.CRON_SECRET ? "set" : "missing",
    shopify: await shopifyDiagnostics(),
    shopifyAdmin: await shopifyAdminDiagnostics(),
    supabase,
  });
}
