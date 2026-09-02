/**
 * Shopify custom pixel — reports Purchase to Meta from Shopify's checkout.
 *
 * Paste into: Shopify admin → Settings → Customer events → Add custom pixel.
 * Name it "Meta Purchase". Set its permission to whatever your consent
 * configuration requires, then Save and Connect.
 *
 * Why this exists: with checkout on Shopify, our Stripe webhook no longer
 * fires, and that webhook was what reported Purchase to Meta. This replaces
 * the browser half of it without connecting any Facebook account to the
 * store — it only needs the pixel id, which is already public in the site's
 * page source.
 *
 * The event id is derived from the Shopify order, so when the server-side
 * copy is added later (orders/paid → Conversions API) Meta will collapse the
 * two into one conversion rather than counting the sale twice.
 *
 * Limitation worth knowing: this is the browser copy only. It is subject to
 * the same blocking and tracking prevention as any browser pixel, which is
 * roughly the 20–30% the server-side copy exists to recover. Adding the
 * webhook later closes that gap.
 */

const PIXEL_ID = "4563845340565065";

/* eslint-disable */
!(function (f, b, e, v, n, t, s) {
  if (f.fbq) return;
  n = f.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  };
  if (!f._fbq) f._fbq = n;
  n.push = n;
  n.loaded = !0;
  n.version = "2.0";
  n.queue = [];
  t = b.createElement(e);
  t.async = !0;
  t.src = v;
  s = b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t, s);
})(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
/* eslint-enable */

fbq("init", PIXEL_ID);

analytics.subscribe("checkout_completed", (event) => {
  const checkout = event.data.checkout;
  if (!checkout) return;

  const lines = checkout.lineItems ?? [];

  // SKUs, because they are the ids this shop already uses everywhere else —
  // the same values the site sends on ViewContent and AddToCart, so Meta sees
  // one product identity across the whole funnel rather than two.
  const contentIds = lines
    .map((l) => l.variant && l.variant.sku)
    .filter(Boolean);

  fbq(
    "track",
    "Purchase",
    {
      value: checkout.totalPrice && checkout.totalPrice.amount,
      currency: checkout.totalPrice && checkout.totalPrice.currencyCode,
      content_type: "product",
      content_ids: contentIds,
      contents: lines.map((l) => ({
        id: (l.variant && l.variant.sku) || "",
        quantity: l.quantity,
      })),
      num_items: lines.reduce((n, l) => n + (l.quantity || 0), 0),
    },
    {
      // shared with the future server-side copy so Meta de-duplicates
      // the order webhook keys on checkout_token too, so the browser and
      // server copies of this sale carry the same id and Meta merges them
      eventID: "purchase." + checkout.token,
    },
  );
});
