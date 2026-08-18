import "server-only";
import { createHash } from "node:crypto";

/**
 * Meta Conversions API — the server-side half of the pixel.
 *
 * The browser pixel is the only thing reporting conversions today, and it is
 * the half that gets blocked: content blockers, iOS tracking prevention and a
 * closed tab during the Stripe redirect all remove real sales from the ledger
 * Meta optimises against. Every event we care about is therefore sent twice —
 * once from the browser, once from here — sharing an `event_id` so Meta
 * collapses the pair into one conversion.
 *
 * Nothing in this file may throw. It is called from the Stripe webhook, where
 * an exception would return a 500, and Stripe would then retry a payment we
 * have already settled.
 */

const GRAPH = "https://graph.facebook.com/v21.0";

export function metaConfigured() {
  return Boolean(process.env.META_PIXEL_ID && process.env.META_CAPI_ACCESS_TOKEN);
}

/** Meta wants SHA-256 of a trimmed, lower-cased value. Never send raw PII. */
const hash = (value?: string | null) => {
  const v = value?.trim().toLowerCase();
  return v ? createHash("sha256").update(v).digest("hex") : undefined;
};

/** Digits only, country code included, then hashed. */
const hashPhone = (value?: string | null) => {
  const digits = value?.replace(/\D/g, "");
  return digits ? createHash("sha256").update(digits).digest("hex") : undefined;
};

export type MetaUser = {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
  country?: string | null;
  /** our own stable anonymous id, so sessions stitch to purchases */
  externalId?: string | null;
  /** _fbp / _fbc browser cookies — sent raw, these are not PII */
  fbp?: string | null;
  fbc?: string | null;
  ip?: string | null;
  userAgent?: string | null;
};

export type MetaEvent = {
  eventName: "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase";
  /** shared with the browser copy of the same event, so Meta de-duplicates */
  eventId: string;
  eventTime?: number;
  eventSourceUrl?: string | null;
  actionSource?: "website" | "system_generated";
  user: MetaUser;
  value?: number;
  currency?: string;
  contents?: { id: string; quantity: number; item_price?: number }[];
};

function userData(u: MetaUser) {
  // Meta ignores undefined keys; sending them empty hurts match quality
  const d: Record<string, unknown> = {
    em: hash(u.email),
    ph: hashPhone(u.phone),
    fn: hash(u.firstName),
    ln: hash(u.lastName),
    ct: hash(u.city?.replace(/\s/g, "")),
    st: hash(u.region),
    zp: hash(u.postalCode?.replace(/\s/g, "")),
    country: hash(u.country),
    external_id: hash(u.externalId),
    fbp: u.fbp || undefined,
    fbc: u.fbc || undefined,
    client_ip_address: u.ip || undefined,
    client_user_agent: u.userAgent || undefined,
  };
  for (const k of Object.keys(d)) if (d[k] === undefined) delete d[k];
  return d;
}

/**
 * Fire and forget. Returns whether Meta accepted it, for logging only —
 * callers must not branch on failure in a way that fails their own request.
 */
export async function sendMetaEvent(event: MetaEvent): Promise<boolean> {
  if (!metaConfigured()) return false;

  const custom: Record<string, unknown> = {};
  if (event.value !== undefined) custom.value = event.value;
  if (event.currency) custom.currency = event.currency.toUpperCase();
  if (event.contents?.length) {
    custom.contents = event.contents;
    custom.content_ids = event.contents.map((c) => c.id);
    custom.content_type = "product";
    custom.num_items = event.contents.reduce((n, c) => n + c.quantity, 0);
  }

  const payload = {
    data: [
      {
        event_name: event.eventName,
        event_id: event.eventId,
        event_time: event.eventTime ?? Math.floor(Date.now() / 1000),
        action_source: event.actionSource ?? "website",
        event_source_url: event.eventSourceUrl || undefined,
        user_data: userData(event.user),
        custom_data: Object.keys(custom).length ? custom : undefined,
      },
    ],
  };

  try {
    const res = await fetch(
      `${GRAPH}/${process.env.META_PIXEL_ID}/events?access_token=${encodeURIComponent(
        process.env.META_CAPI_ACCESS_TOKEN!,
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        // a slow Graph API must never hold up a Stripe webhook
        signal: AbortSignal.timeout(4000),
      },
    );

    if (!res.ok) {
      console.error(
        `[meta capi] ${event.eventName} rejected (${res.status}):`,
        (await res.text()).slice(0, 400),
      );
      return false;
    }
    return true;
  } catch (err) {
    console.error(
      `[meta capi] ${event.eventName} failed:`,
      err instanceof Error ? err.message : String(err),
    );
    return false;
  }
}
