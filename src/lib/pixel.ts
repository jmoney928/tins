declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * The Meta Pixel only ever fired PageView — no AddToCart, InitiateCheckout,
 * or Purchase — which means every campaign reads zero Results no matter
 * how the site actually performs, because the events that would report a
 * conversion were never sent. This is the one call site for all of them.
 */
export function trackPixel(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", event, params);
}
