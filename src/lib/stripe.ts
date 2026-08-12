import Stripe from "stripe";

/**
 * Server-only Stripe client. Never import this into a client component —
 * the secret key must not reach the browser.
 */
let client: Stripe | null = null;

export function stripe(): Stripe {
  if (client) return client;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to .env.local — see .env.example.",
    );
  }
  client = new Stripe(key);
  return client;
}

export const stripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY);

/** Absolute origin for Stripe's redirect URLs. */
export function siteOrigin(request: Request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  const h = request.headers;
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}
