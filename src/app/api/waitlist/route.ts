import { NextResponse, type NextRequest } from "next/server";
import { COOKIE } from "@/lib/attribution";
import { looksLikeEmail, normaliseEmail, saveSignup } from "@/lib/waitlist";

export const dynamic = "force-dynamic";

/**
 * Joining the waitlist.
 *
 * Deliberately permissive about the same person arriving twice — the store
 * collapses duplicates itself — and deliberately strict about writing: a 200
 * from here means the address is somewhere a human can get it back, and
 * nothing else.
 */

/**
 * A small brake, not a wall.
 *
 * The unique address is what actually stops a flood filling the table; this
 * only stops one client hammering the route. It lives in the instance's
 * memory, so it is per-instance and resets on a cold start — enough to be
 * worth having and not worth pretending is more than it is.
 */
const SEEN = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 6;

function tooMany(ip: string) {
  const now = Date.now();
  const hits = (SEEN.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  SEEN.set(ip, hits);
  if (SEEN.size > 5000) SEEN.clear();
  return hits.length > MAX_PER_WINDOW;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  let body: { email?: unknown; source?: unknown; company?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  // a field no person can see and no person fills in; a bot that fills it is
  // told everything went well and nothing is written
  if (typeof body.company === "string" && body.company.trim()) {
    return NextResponse.json({ ok: true, count: null });
  }

  const raw = typeof body.email === "string" ? body.email : "";
  const email = normaliseEmail(raw);
  if (!looksLikeEmail(email)) {
    return NextResponse.json(
      { error: "That email does not look right. Check it and try again." },
      { status: 400 },
    );
  }

  if (tooMany(ip)) {
    return NextResponse.json(
      { error: "Too many tries. Wait a minute and try again." },
      { status: 429 },
    );
  }

  const result = await saveSignup({
    email,
    source: typeof body.source === "string" && body.source ? body.source : "unknown",
    referrer: request.headers.get("referer") ?? undefined,
    utm: request.cookies.get(COOKIE.utm)?.value,
    fbp: request.cookies.get(COOKIE.fbp)?.value,
    fbc: request.cookies.get(COOKIE.fbc)?.value,
    userAgent: request.headers.get("user-agent") ?? undefined,
    ip,
  });

  if (!result.saved) {
    // never tell someone they are on a list they are not on, and say what
    // stopped it — a store nobody can see failing is a store that stays broken
    console.error(`[waitlist] refused ${email}: ${result.reason ?? "unknown"}`);
    return NextResponse.json(
      {
        error: "We could not save that just now. Try again in a moment.",
        diagnostic: result.reason,
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, count: result.count });
}
