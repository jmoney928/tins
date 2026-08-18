import { NextResponse, type NextRequest } from "next/server";
import { dueForReminder, markReminded, type AbandonedRow } from "@/lib/abandoned";
import { sendRecoveryEmail, emailConfigured } from "@/lib/email";

export const dynamic = "force-dynamic";
// sending is sequential and rate-limited by the provider, so give it room
export const maxDuration = 60;

/**
 * Sends the abandoned-checkout reminders — one per bag, once a day.
 *
 * Driven by Vercel Cron rather than a timer inside the app: a serverless
 * function has no life between requests, so "send this later" has to come
 * from outside. A daily run is what the Hobby plan allows, so this sends a
 * single reminder rather than pretending to a two-stage sequence whose two
 * sends would land within hours of each other.
 *
 * Vercel sends `Authorization: Bearer $CRON_SECRET` when the variable is set.
 * Without it this endpoint would be an open mail trigger, so an unset secret
 * refuses to run rather than defaulting to open.
 */
function authorised(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

/**
 * A recovery URL only exists once Stripe has expired the session, and its
 * existence is therefore proof the original checkout link is dead. So prefer
 * it when it is there, and fall back to the still-live session otherwise.
 */
function linkFor(row: AbandonedRow) {
  return row.recovery_url ?? row.checkout_url ?? null;
}

async function run() {
  const rows = await dueForReminder();
  let sent = 0;
  let skipped = 0;

  for (const row of rows) {
    const url = linkFor(row);
    if (!url) {
      skipped++;
      continue;
    }

    // claim it first: a crash between sending and stamping would otherwise
    // mail the same person again on the next run
    if (!(await markReminded(row.id))) {
      skipped++;
      continue;
    }

    const ok = await sendRecoveryEmail({
      to: row.email,
      lines: row.lines.map((l) => ({
        name: l.name,
        qty: l.qty,
        total_amount: l.total_amount,
      })),
      subtotal: row.subtotal_cents ?? 0,
      currency: row.currency,
      url,
    });
    if (ok) sent++;
  }

  return { considered: rows.length, sent, skipped };
}

export async function GET(request: NextRequest) {
  if (!authorised(request)) {
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });
  }
  if (!emailConfigured()) {
    return NextResponse.json({ error: "RESEND_API_KEY is not set." }, { status: 503 });
  }

  const result = await run();
  console.log("[cron abandoned]", JSON.stringify(result));

  return NextResponse.json({ ok: true, ...result });
}
