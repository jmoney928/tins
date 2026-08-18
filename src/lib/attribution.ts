/**
 * Attribution identity — the thread that has to survive the trip out to
 * Stripe and back.
 *
 * A click arrives with `fbclid` in the URL. The browser pixel drops `_fbp`.
 * Both are first-party cookies on this domain, which means the checkout API
 * can read them server-side and hand them to Stripe as session metadata; the
 * webhook reads them back and can finally tell Meta which ad produced the
 * order. Without this, every server-side Purchase is unattributed.
 *
 * Deliberately free of server imports so the client capture component and the
 * route handlers can share one definition of the cookie names.
 */

export const COOKIE = {
  /** Meta's browser id, written by the pixel itself */
  fbp: "_fbp",
  /** Meta's click id, in the fb.1.<ts>.<fbclid> form Meta expects */
  fbc: "_fbc",
  /** ours: a stable anonymous id, so a session stitches to a later purchase */
  externalId: "it_eid",
  /** ours: first-touch campaign, so Supabase can grade Meta's homework */
  utm: "it_utm",
} as const;

/** Ninety days — Meta's click attribution window is shorter, but re-writes are cheap. */
export const ATTRIBUTION_MAX_AGE = 60 * 60 * 24 * 90;

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

/** Meta's required shape for a click id it did not set itself. */
export function buildFbc(fbclid: string, now: number = Date.now()) {
  return `fb.1.${now}.${fbclid}`;
}

/**
 * Stripe metadata values top out at 500 characters, so the campaign is stored
 * as one compact string rather than five keys.
 */
export function packUtm(params: URLSearchParams) {
  const parts: string[] = [];
  for (const k of UTM_KEYS) {
    const v = params.get(k);
    if (v) parts.push(`${k.slice(4)}=${encodeURIComponent(v.slice(0, 80))}`);
  }
  return parts.join("|");
}

export function unpackUtm(packed?: string | null): Record<string, string> {
  if (!packed) return {};
  const out: Record<string, string> = {};
  for (const part of packed.split("|")) {
    const i = part.indexOf("=");
    if (i > 0) out[`utm_${part.slice(0, i)}`] = decodeURIComponent(part.slice(i + 1));
  }
  return out;
}

/**
 * One id per event, shared between the browser copy and the server copy.
 * Purchase is keyed on the Stripe session instead — see `purchaseEventId` —
 * because the two senders never meet and cannot agree on a random value.
 */
export function newEventId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/** Derived on both sides from a value both sides already have. */
export function purchaseEventId(stripeSessionId: string) {
  return `purchase.${stripeSessionId}`;
}
