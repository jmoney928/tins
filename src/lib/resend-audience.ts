import "server-only";

/**
 * The waitlist as a Resend audience.
 *
 * Resend is already the sending account, and a launch email has to be sent
 * from somewhere — so keeping the list in the same place as the thing that
 * will mail it removes an export, an import, and the chance of the two
 * drifting apart.
 *
 * Two keys, deliberately. The key that sends order confirmations is
 * restricted to sending, which is the right shape for a key that lives in a
 * webhook; managing contacts needs a broader one. Set
 * RESEND_CONTACTS_API_KEY to keep them apart, or leave it unset to reuse
 * RESEND_API_KEY when that key has full access.
 */

const ENDPOINT = "https://api.resend.com";

export function contactsKey() {
  return process.env.RESEND_CONTACTS_API_KEY ?? process.env.RESEND_API_KEY;
}

export function audienceId() {
  return process.env.RESEND_AUDIENCE_ID;
}

export function audienceConfigured() {
  return Boolean(contactsKey() && audienceId());
}

export type ContactResult = { ok: boolean; reason?: string };

/**
 * Adds one address to the audience. Never throws.
 *
 * An address already in the audience counts as success: the person asked to
 * be on the list and is on it, which is the only thing the caller needs to
 * know.
 */
export async function addContact(email: string): Promise<ContactResult> {
  const key = contactsKey();
  const id = audienceId();
  if (!key || !id) return { ok: false, reason: "RESEND_AUDIENCE_ID is not set" };

  try {
    const res = await fetch(`${ENDPOINT}/audiences/${id}/contacts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email, unsubscribed: false }),
      signal: AbortSignal.timeout(6000),
    });

    if (res.ok) return { ok: true };

    const said = (await res.text()).slice(0, 200);
    // already on the list is not a failure — they asked to be on it, and are
    if (res.status === 409 || /already exists/i.test(said)) return { ok: true };
    return { ok: false, reason: `Resend contacts ${res.status}: ${said}` };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : String(err) };
  }
}

/** For the health endpoint: can this key actually manage contacts? */
export async function audienceDiagnostics(): Promise<Record<string, unknown>> {
  const key = contactsKey();
  if (!key) return { state: "not configured", missing: "RESEND_API_KEY" };
  if (!audienceId())
    return {
      state: "not configured",
      missing: "RESEND_AUDIENCE_ID",
      hint: "Create an audience at resend.com/audiences and set its id.",
    };
  try {
    const res = await fetch(`${ENDPOINT}/audiences/${audienceId()}`, {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(6000),
    });
    const said = (await res.text()).slice(0, 200);
    if (!res.ok) {
      return {
        state: "rejected",
        status: res.status,
        said,
        hint: /restricted/i.test(said)
          ? "The key may only send. Create a full-access key at resend.com/api-keys and set RESEND_CONTACTS_API_KEY."
          : undefined,
      };
    }
    return { state: "ready" };
  } catch (err) {
    return { state: "unreachable", said: err instanceof Error ? err.message : String(err) };
  }
}
