import "server-only";
import { db, dbConfig } from "./db";

/**
 * Abandoned checkouts.
 *
 * Until now the shop only learned an email address from people who had
 * already paid — Stripe collected it on its own page — so everyone who
 * reached checkout and left was unreachable. The email is now asked for
 * before the redirect, which is what makes any of this possible.
 *
 * Every function here fails soft. A recovery row that cannot be written must
 * never cost a sale, and a reminder that cannot be sent must never break the
 * webhook that settles orders.
 */

export type AbandonedRow = {
  id: string;
  stripe_session_id: string;
  email: string;
  lines: { sku: string; name: string; qty: number; total_amount: number }[];
  subtotal_cents: number | null;
  currency: string;
  checkout_url: string | null;
  recovery_url: string | null;
  created_at: string;
  reminded_at: string | null;
};

export type RecordInput = {
  sessionId: string;
  email: string;
  lines: { sku: string; name: string; qty: number; total_amount: number }[];
  subtotalCents: number;
  currency: string;
  checkoutUrl: string | null;
  attribution: Record<string, string>;
};

function ready() {
  return dbConfig().state === "ready";
}

/** Called as the Stripe session is created. Never throws. */
export async function recordAbandoned(input: RecordInput): Promise<void> {
  if (!ready()) return;

  const { error } = await db()
    .from("abandoned_checkouts")
    .upsert(
      {
        stripe_session_id: input.sessionId,
        email: input.email.trim().toLowerCase(),
        lines: input.lines,
        subtotal_cents: input.subtotalCents,
        currency: input.currency,
        checkout_url: input.checkoutUrl,
        attribution: input.attribution,
      },
      { onConflict: "stripe_session_id" },
    );

  if (error) console.error("[abandoned] could not record:", error.message);
}

/**
 * The order came through. Marked rather than deleted so the recovery rate is
 * measurable — an abandoned checkout that later converts is the only number
 * that says whether these emails are worth sending.
 */
export async function markRecovered(sessionId: string): Promise<void> {
  if (!ready()) return;

  const { error } = await db()
    .from("abandoned_checkouts")
    .update({ recovered_at: new Date().toISOString() })
    .eq("stripe_session_id", sessionId)
    .is("recovered_at", null);

  if (error) console.error("[abandoned] could not mark recovered:", error.message);
}

/** Stripe expired the session and handed back a fresh link to the same bag. */
export async function attachRecoveryUrl(sessionId: string, url: string | null, email?: string | null) {
  if (!ready() || !url) return;

  const patch: Record<string, string> = { recovery_url: url };
  if (email) patch.email = email.trim().toLowerCase();

  const { error } = await db()
    .from("abandoned_checkouts")
    .update(patch)
    .eq("stripe_session_id", sessionId);

  if (error) console.error("[abandoned] could not attach recovery url:", error.message);
}

/**
 * Rows due the reminder.
 *
 * One send per abandoned bag, from a cron that runs once a day. The lower
 * bound keeps us off someone who is still mid-checkout; the upper bound
 * matters just as much, because without it a cron that had been down for a
 * week would mail everyone who abandoned during that week as though they had
 * just left.
 */
export async function dueForReminder(now = new Date()): Promise<AbandonedRow[] | null> {
  if (!ready()) return null;

  const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600_000).toISOString();

  const { data, error } = await db()
    .from("abandoned_checkouts")
    .select(
      "id, stripe_session_id, email, lines, subtotal_cents, currency, checkout_url, recovery_url, created_at, reminded_at",
    )
    .is("recovered_at", null)
    .is("reminded_at", null)
    .lt("created_at", hoursAgo(0.5))
    .gt("created_at", hoursAgo(48))
    .order("created_at", { ascending: true })
    .limit(200);

  if (error) {
    console.error("[abandoned] could not read due rows:", error.message);
    // null, not an empty list — "nothing to send" and "I could not look" are
    // different answers, and a run that cannot tell them apart reports
    // success while quietly sending nothing
    return null;
  }
  return (data ?? []) as AbandonedRow[];
}

/** Stamped before the send, so a crash mid-run cannot mail the same person twice. */
export async function markReminded(id: string): Promise<boolean> {
  if (!ready()) return false;

  const { data, error } = await db()
    .from("abandoned_checkouts")
    .update({ reminded_at: new Date().toISOString() })
    .eq("id", id)
    .is("reminded_at", null)
    .select("id");

  if (error) {
    console.error("[abandoned] could not stamp reminder:", error.message);
    return false;
  }
  // no row came back — another run claimed it first
  return (data ?? []).length > 0;
}
