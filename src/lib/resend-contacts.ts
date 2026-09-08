import "server-only";

/**
 * The waitlist as Resend contacts.
 *
 * Resend is already the sending account, and a launch email has to be sent
 * from somewhere — so keeping the list in the same place that will mail it
 * removes an export, an import, and the chance of the two drifting apart.
 *
 * Audiences are not used. Resend deprecated them in favour of segments, and
 * a contact no longer belongs to one: POST /contacts takes an address and
 * nothing else is required. RESEND_SEGMENT_ID is optional, and only there so
 * a launch broadcast can be aimed at the waitlist rather than at everyone.
 *
 * Two keys, deliberately. The key that sends order confirmations is
 * restricted to sending, which is the right shape for a key living in a
 * webhook; managing contacts needs a broader one. Set
 * RESEND_CONTACTS_API_KEY to keep them apart, or leave it unset to reuse
 * RESEND_API_KEY once that key has full access.
 */

const ENDPOINT = "https://api.resend.com/contacts";

/**
 * Trimmed, because a key pasted into a dashboard field arrives with the
 * whitespace that came with it, and a leading space in an Authorization
 * header is a authentication failure that looks like a permissions one.
 */
export function contactsKey() {
  const key = process.env.RESEND_CONTACTS_API_KEY ?? process.env.RESEND_API_KEY;
  return key?.trim() || undefined;
}

/**
 * Which variable the key came from, and enough of it to tell two keys apart.
 *
 * Without this a missing RESEND_CONTACTS_API_KEY and a sending-only key are
 * the same error, because the missing one silently falls back to the key that
 * can only send. Never the key itself: the prefix every Resend key shares,
 * plus its length, which identifies it without revealing it — the same shape
 * the Stripe check here already reports.
 */
function keyOrigin() {
  const scoped = process.env.RESEND_CONTACTS_API_KEY?.trim() || undefined;
  const key = scoped ?? process.env.RESEND_API_KEY?.trim();
  return {
    variable: scoped
      ? "RESEND_CONTACTS_API_KEY"
      : "RESEND_API_KEY (RESEND_CONTACTS_API_KEY is not reaching this function)",
    looksLike: key ? `${key.slice(0, 5)}… ${key.length} chars` : "unset",
    // reported separately: a value that needed trimming is worth correcting
    // at the source even once the code stops caring
    hadWhitespace:
      (process.env.RESEND_CONTACTS_API_KEY ?? process.env.RESEND_API_KEY ?? "") !==
      (key ?? ""),
  };
}

export function contactsConfigured() {
  return Boolean(contactsKey());
}

export type ContactResult = { ok: boolean; reason?: string };

/**
 * Adds one address. Never throws.
 *
 * An address already stored counts as success: the person asked to be on the
 * list and is on it, which is the only thing the caller needs to know.
 */
export async function addContact(email: string): Promise<ContactResult> {
  const key = contactsKey();
  if (!key) return { ok: false, reason: "no Resend key set" };

  const segment = process.env.RESEND_SEGMENT_ID;

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        unsubscribed: false,
        ...(segment ? { segments: [segment] } : {}),
      }),
      signal: AbortSignal.timeout(6000),
    });

    if (res.ok) return { ok: true };

    const said = (await res.text()).slice(0, 200);
    // already stored is not a failure — they asked to be on the list, and are
    if (res.status === 409 || /already exists/i.test(said)) return { ok: true };
    return { ok: false, reason: `Resend contacts ${res.status}: ${said}` };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : String(err) };
  }
}

/** For the health endpoint: can this key actually manage contacts? */
export async function contactsDiagnostics(): Promise<Record<string, unknown>> {
  const key = contactsKey();
  const origin = keyOrigin();
  if (!key) return { state: "not configured", missing: "RESEND_API_KEY", ...origin };
  try {
    const res = await fetch(`${ENDPOINT}?limit=1`, {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(6000),
    });
    const said = (await res.text()).slice(0, 200);
    if (!res.ok) {
      return {
        state: "rejected",
        status: res.status,
        said,
        ...origin,
        hint: /restricted/i.test(said)
          ? "That key may only send. Create a Full access key at resend.com/api-keys and set RESEND_CONTACTS_API_KEY."
          : undefined,
      };
    }
    return {
      state: "ready",
      ...origin,
      segment: process.env.RESEND_SEGMENT_ID ? "set" : "none (contacts are stored unsegmented)",
    };
  } catch (err) {
    return { state: "unreachable", said: err instanceof Error ? err.message : String(err) };
  }
}
