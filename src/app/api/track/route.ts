import { NextResponse, type NextRequest } from "next/server";
import { CATALOG, currentPrice } from "@/lib/catalog";
import { COOKIE } from "@/lib/attribution";
import { sendMetaEvent, metaConfigured } from "@/lib/meta";

export const dynamic = "force-dynamic";

/**
 * The server half of a browser event.
 *
 * The browser has already fired this event with an `eventID`; we re-send the
 * same id from here so Meta counts one. What the server adds is the part the
 * browser cannot be trusted for: the real IP and user agent, and the _fbp /
 * _fbc cookies read server-side rather than through whatever the page's
 * JavaScript survived.
 *
 * Values are never taken from the request body — a client that can post its
 * own `value` can post any number into your ROAS. The price comes from the
 * catalog, the same records Stripe is charged from.
 */

const ALLOWED = new Set(["ViewContent", "AddToCart", "InitiateCheckout"] as const);
type Allowed = "ViewContent" | "AddToCart" | "InitiateCheckout";

type Line = { id: string; qty: number };

function readLines(input: unknown): Line[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter(
      (l): l is { id: string; qty: number } =>
        !!l &&
        typeof l === "object" &&
        typeof (l as Line).id === "string" &&
        CATALOG[(l as Line).id] !== undefined &&
        Number.isFinite((l as Line).qty),
    )
    .map((l) => ({ id: l.id, qty: Math.min(Math.max(Math.trunc(l.qty), 1), 99) }))
    .slice(0, 10);
}

export async function POST(request: NextRequest) {
  let body: {
    event?: string;
    eventId?: string;
    url?: string;
    params?: { lines?: unknown };
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed body." }, { status: 400 });
  }

  const event = body.event;
  const eventId = body.eventId;
  if (!event || !ALLOWED.has(event as Allowed) || typeof eventId !== "string" || !eventId) {
    return NextResponse.json({ error: "Unsupported event." }, { status: 400 });
  }

  // validated first, so the endpoint behaves the same whether or not the
  // Conversions API happens to be configured in this environment
  if (!metaConfigured()) return NextResponse.json({ ok: false, reason: "not configured" });

  const lines = readLines(body.params?.lines);
  const contents = lines.map((l) => ({
    id: l.id,
    quantity: l.qty,
    item_price: currentPrice(l.id) / 100,
  }));
  const value = lines.reduce((n, l) => n + (currentPrice(l.id) * l.qty) / 100, 0);

  // Meta's own verdict is surfaced rather than swallowed: "the token is set"
  // and "Meta accepted the event" are different claims, and only the second
  // one means anything. Reveals nothing a page visitor could not already tell
  // from whether conversions appear.
  const delivered = await sendMetaEvent({
    eventName: event as Allowed,
    eventId,
    eventSourceUrl: typeof body.url === "string" ? body.url.slice(0, 500) : null,
    user: {
      fbp: request.cookies.get(COOKIE.fbp)?.value ?? null,
      fbc: request.cookies.get(COOKIE.fbc)?.value ?? null,
      externalId: request.cookies.get(COOKIE.externalId)?.value ?? null,
      ip:
        request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
        request.headers.get("x-real-ip"),
      userAgent: request.headers.get("user-agent"),
    },
    ...(contents.length ? { contents, value, currency: "CAD" } : {}),
  });

  return NextResponse.json({ ok: true, delivered });
}
