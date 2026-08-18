import "server-only";
import { money } from "./catalog";
import { leadTimeLabel, transitLabel, SHIPS_FROM_STOCK } from "./fulfilment";

/**
 * Transactional email through Resend.
 *
 * The order confirmation did not exist — the webhook carried a TODO where it
 * should have been — while the success page told every buyer "a confirmation
 * is on its way". This closes that, and it is also the first owned channel
 * this shop has: without a confirmation there is no thread to reply to, no
 * shipping notice, and nothing to recover an abandoned checkout with.
 *
 * Called from the Stripe webhook, so like the Meta reporter it must never
 * throw — a failed send is logged and swallowed rather than turned into a 500
 * that makes Stripe retry an order we already settled.
 */

const ENDPOINT = "https://api.resend.com/emails";

/** Overridable, because the verified sending domain is a Resend-side setting. */
const FROM = process.env.ORDER_FROM_EMAIL ?? "Ice Tins Supply Co. <shop@icetins.com>";
const REPLY_TO = process.env.ORDER_REPLY_TO ?? "shop@icetins.com";

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

type Line = { name: string; qty: number; total_amount: number };

export type OrderEmail = {
  to: string;
  reference: string;
  lines: Line[];
  total: number;
  currency: string;
  shippingName?: string | null;
};

export async function sendOrderEmail(order: OrderEmail): Promise<boolean> {
  if (!emailConfigured()) {
    console.warn("[email] RESEND_API_KEY is not set — no confirmation sent for", order.reference);
    return false;
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [order.to],
        reply_to: REPLY_TO,
        subject: `Order ${order.reference} — we have it`,
        text: plain(order),
        html: html(order),
      }),
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) {
      console.error(
        `[email] Resend rejected ${order.reference} (${res.status}):`,
        (await res.text()).slice(0, 300),
      );
      return false;
    }
    return true;
  } catch (err) {
    console.error(
      `[email] send failed for ${order.reference}:`,
      err instanceof Error ? err.message : String(err),
    );
    return false;
  }
}

/**
 * The lead time is stated here in the same words as the product page, from
 * the same constant. A confirmation email is the worst possible place for a
 * buyer to learn something they were not told before paying.
 */
const timing = () =>
  SHIPS_FROM_STOCK
    ? `It leaves Vancouver within ${leadTimeLabel()}, then ${transitLabel()} in transit. You will get a tracking number the morning it ships.`
    : `Yours is machined to order. Current lead time is ${leadTimeLabel()} to dispatch, then ${transitLabel()} in transit — you will get a tracking number the morning it leaves Vancouver.`;

function plain(o: OrderEmail) {
  const items = o.lines
    .map((l) => `  ${l.name} x${l.qty}   ${money(l.total_amount)}`)
    .join("\n");

  return [
    `Thanks${o.shippingName ? `, ${o.shippingName.split(" ")[0]}` : ""} — that is yours.`,
    "",
    `Order ${o.reference}`,
    "",
    items,
    "",
    `Total   ${money(o.total)} ${o.currency.toUpperCase()}`,
    "",
    timing(),
    "",
    "One Chillcore ice pack ships inside the tin. Ninety minutes in any freezer drawer and it is ready.",
    "",
    `Reply to this email if anything needs changing — the address on it is a real inbox.`,
    "",
    "Ice Tins Supply Co.",
    "8105 North Fraser Way, Burnaby, BC V5J 5M8",
  ].join("\n");
}

function html(o: OrderEmail) {
  const rows = o.lines
    .map(
      (l) => `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #e6eaec;color:#111a1f;">
          ${escape(l.name)} <span style="color:#7c8a91;">&times;${l.qty}</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #e6eaec;text-align:right;color:#111a1f;font-variant-numeric:tabular-nums;">
          ${money(l.total_amount)}
        </td>
      </tr>`,
    )
    .join("");

  return `<!doctype html>
<html><body style="margin:0;background:#f4f6f7;padding:32px 16px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111a1f;line-height:1.6;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e6eaec;border-radius:4px;padding:32px;">
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#7c8a91;">Order ${escape(o.reference)}</p>
    <h1 style="margin:0 0 20px;font-size:26px;letter-spacing:-.02em;">That is yours.</h1>

    <table style="width:100%;border-collapse:collapse;font-size:14px;">${rows}
      <tr>
        <td style="padding:14px 0 0;font-weight:600;">Paid</td>
        <td style="padding:14px 0 0;text-align:right;font-weight:600;font-variant-numeric:tabular-nums;">
          ${money(o.total)} ${escape(o.currency.toUpperCase())}
        </td>
      </tr>
    </table>

    <p style="margin:24px 0 0;font-size:14px;color:#55636a;">${escape(timing())}</p>
    <p style="margin:16px 0 0;font-size:14px;color:#55636a;">
      One Chillcore ice pack ships inside the tin. Ninety minutes in any freezer drawer and it is ready.
    </p>
    <p style="margin:16px 0 0;font-size:14px;color:#55636a;">
      Reply to this email if anything needs changing — the address on it is a real inbox.
    </p>

    <p style="margin:28px 0 0;padding-top:16px;border-top:1px solid #e6eaec;font-size:12px;color:#7c8a91;">
      Ice Tins Supply Co. &middot; 8105 North Fraser Way, Burnaby, BC V5J 5M8<br>
      We sell empty machined cans and ice packs &mdash; never nicotine or tobacco, in any form.
    </p>
  </div>
</body></html>`;
}

/** One reminder, and the sign-off says so, because it is true. */
const SIGNOFF = "This is the only reminder we will send about this bag.";

const OPENING =
  "You left this in your bag. The link below picks up exactly where you stopped — and if it was the price or a question that stopped you, just reply. This is a real inbox.";

export type RecoveryEmail = {
  to: string;
  lines: Line[];
  subtotal: number;
  currency: string;
  url: string;
};

/**
 * The abandoned-checkout reminder. One per bag.
 *
 * Deliberately short and free of manufactured urgency: the bag is still
 * there, here is the link, reply if something stopped you.
 */
export async function sendRecoveryEmail(o: RecoveryEmail): Promise<boolean> {
  if (!emailConfigured()) {
    console.warn("[email] RESEND_API_KEY is not set — no reminder sent to", o.to);
    return false;
  }

  const subject = "Your bag is still here";

  const items = o.lines.map((l) => `  ${l.name} x${l.qty}   ${money(l.total_amount)}`).join("\n");

  const text = [
    OPENING,
    "",
    items,
    "",
    `Subtotal   ${money(o.subtotal)} ${o.currency.toUpperCase()}`,
    "",
    `Finish here: ${o.url}`,
    "",
    "Ice Tins Supply Co. — Vancouver, BC",
    SIGNOFF,
  ].join("\n");

  const rows = o.lines
    .map(
      (l) => `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #e6eaec;color:#111a1f;">
          ${escape(l.name)} <span style="color:#7c8a91;">&times;${l.qty}</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #e6eaec;text-align:right;color:#111a1f;">
          ${money(l.total_amount)}
        </td>
      </tr>`,
    )
    .join("");

  const html = `<!doctype html>
<html><body style="margin:0;background:#f4f6f7;padding:32px 16px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111a1f;line-height:1.6;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e6eaec;border-radius:4px;padding:32px;">
    <h1 style="margin:0 0 16px;font-size:24px;letter-spacing:-.02em;">${escape(subject)}</h1>
    <p style="margin:0 0 20px;font-size:14px;color:#55636a;">${escape(OPENING)}</p>

    <table style="width:100%;border-collapse:collapse;font-size:14px;">${rows}
      <tr>
        <td style="padding:14px 0 0;font-weight:600;">Subtotal</td>
        <td style="padding:14px 0 0;text-align:right;font-weight:600;">${money(o.subtotal)} ${escape(o.currency.toUpperCase())}</td>
      </tr>
    </table>

    <p style="margin:26px 0 0;">
      <a href="${escape(o.url)}" style="display:inline-block;background:#111a1f;color:#ffffff;text-decoration:none;padding:13px 26px;border-radius:999px;font-size:14px;font-weight:600;">
        Finish checkout
      </a>
    </p>

    <p style="margin:28px 0 0;padding-top:16px;border-top:1px solid #e6eaec;font-size:12px;color:#7c8a91;">
      Ice Tins Supply Co. &middot; 8105 North Fraser Way, Burnaby, BC V5J 5M8<br>
      ${escape(SIGNOFF)}
    </p>
  </div>
</body></html>`;

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to: [o.to], reply_to: REPLY_TO, subject, text, html }),
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) {
      console.error(
        `[email] reminder rejected for ${o.to} (${res.status}):`,
        (await res.text()).slice(0, 300),
      );
      return false;
    }
    return true;
  } catch (err) {
    console.error(
      `[email] reminder failed for ${o.to}:`,
      err instanceof Error ? err.message : String(err),
    );
    return false;
  }
}

const escape = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
