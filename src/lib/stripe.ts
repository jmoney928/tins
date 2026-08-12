import Stripe from "stripe";

/**
 * Server-only Stripe client. Never import this into a client component —
 * the secret key must not reach the browser.
 */
let client: Stripe | null = null;

/** Secret keys are sk_…; restricted keys are rk_… Publishable keys are not. */
export type KeyProblem =
  | { ok: true }
  | { ok: false; reason: "missing" | "blank" | "publishable" | "shape"; saw: string };

/**
 * Validates the *shape* of the key before we ever call Stripe. Pasting the
 * publishable key into STRIPE_SECRET_KEY is the single most common setup
 * mistake and otherwise surfaces as an opaque 502 at the first API call.
 */
export function inspectKey(): KeyProblem {
  const raw = process.env.STRIPE_SECRET_KEY;
  if (raw === undefined) return { ok: false, reason: "missing", saw: "unset" };

  const key = raw.trim();
  if (!key) return { ok: false, reason: "blank", saw: "empty or whitespace" };
  if (key.startsWith("pk_"))
    return { ok: false, reason: "publishable", saw: key.slice(0, 3) };
  if (!key.startsWith("sk_") && !key.startsWith("rk_"))
    return { ok: false, reason: "shape", saw: key.slice(0, 3) };

  return { ok: true };
}

export function stripe(): Stripe {
  if (client) return client;

  const check = inspectKey();
  if (!check.ok) throw new Error(`STRIPE_SECRET_KEY is invalid (${check.reason}).`);

  // trim guards against a trailing newline from a copy-paste
  client = new Stripe(process.env.STRIPE_SECRET_KEY!.trim());
  return client;
}

export const stripeConfigured = () => inspectKey().ok;

/** Human-readable, safe to log. Never includes the key itself. */
export function keyDiagnosis(check: KeyProblem): string {
  if (check.ok) return "STRIPE_SECRET_KEY looks well-formed.";
  switch (check.reason) {
    case "missing":
      return "STRIPE_SECRET_KEY is not set in this environment.";
    case "blank":
      return "STRIPE_SECRET_KEY is set but empty or whitespace-only.";
    case "publishable":
      return "STRIPE_SECRET_KEY holds a publishable key (pk_…). It needs the secret key (sk_…) from Developers -> API keys.";
    default:
      return `STRIPE_SECRET_KEY does not look like a Stripe key (starts with "${check.saw}"). Expected sk_… or rk_….`;
  }
}

/** Absolute origin for Stripe's redirect URLs. */
export function siteOrigin(request: Request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  const h = request.headers;
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}
