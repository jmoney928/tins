import "server-only";
import { db, dbConfig } from "./db";
import { sendNotice } from "./email";
import { addContact, audienceConfigured } from "./resend-audience";

/**
 * The waitlist, and the promise that an address given to us is not lost.
 *
 * One record per person, keyed on the address, so signing up twice does not
 * create a second row and does not overwrite where the first one came from.
 *
 * A single store would make every signup only as reliable as that store, so
 * the address is offered to every store that is configured and the signup
 * counts as saved if any of them took it: the Resend audience the launch
 * email will be sent to, and the database that can be queried and segmented.
 * If none can take it, it is emailed to the shop inbox instead, and it is
 * logged under a fixed prefix regardless. Only when all of that fails does
 * the visitor get an error, because only then have we actually lost it.
 */

export type Signup = {
  email: string;
  /** which part of the site it came from, for reading later */
  source: string;
  referrer?: string;
  utm?: string;
  fbp?: string;
  fbc?: string;
  userAgent?: string;
  ip?: string;
};

export type SaveResult = {
  /** false only when nothing at all captured it */
  saved: boolean;
  /** which stores took it, joined — "resend+database", "email", "none" */
  via: string;
  /** total on the list, when a store could answer */
  count: number | null;
  /** why nothing took it, when nothing did */
  reason?: string;
};

const dbReady = () => dbConfig().state === "ready";

export function normaliseEmail(raw: string) {
  return raw.trim().toLowerCase();
}

export function looksLikeEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254;
}

/**
 * The row, then the address alone.
 *
 * The address is the only part that matters. A row refused for anything else
 * — a column this code knows about and the table does not, a missing unique
 * constraint behind the upsert — is retried bare rather than losing the
 * person over their referrer.
 */
async function toDatabase(email: string, input: Signup): Promise<{ ok: boolean; reason?: string }> {
  const full = await db()
    .from("waitlist")
    .upsert(
      {
        email,
        source: input.source.slice(0, 60),
        referrer: input.referrer?.slice(0, 500) ?? null,
        utm: input.utm?.slice(0, 500) ?? null,
        fbp: input.fbp?.slice(0, 200) ?? null,
        fbc: input.fbc?.slice(0, 200) ?? null,
        user_agent: input.userAgent?.slice(0, 500) ?? null,
        ip: input.ip?.slice(0, 60) ?? null,
      },
      // the first signup keeps its source and its date; a repeat is not a new
      // person and must not overwrite where the first one came from
      { onConflict: "email", ignoreDuplicates: true },
    );
  if (!full.error) return { ok: true };

  const bare = await db()
    .from("waitlist")
    .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });
  if (!bare.error) {
    console.warn(`[waitlist] saved ${email} without its metadata:`, full.error.message);
    return { ok: true };
  }

  const plain = await db().from("waitlist").insert({ email });
  if (!plain.error) return { ok: true };

  return { ok: false, reason: `database: ${full.error.message}` };
}

export async function saveSignup(input: Signup): Promise<SaveResult> {
  const email = normaliseEmail(input.email);

  // the backstop that cannot fail: whatever else happens, the address is in
  // the platform log under a fixed prefix
  console.log(`[waitlist] signup email=${email} source=${input.source}`);

  const kept: string[] = [];
  const failures: string[] = [];

  if (audienceConfigured()) {
    const r = await addContact(email);
    if (r.ok) kept.push("resend");
    else failures.push(r.reason ?? "resend refused the contact");
  }

  if (dbReady()) {
    const r = await toDatabase(email, input);
    if (r.ok) kept.push("database");
    else failures.push(r.reason ?? "the database refused the row");
  }

  if (kept.length) {
    if (failures.length) console.warn(`[waitlist] partial save for ${email}:`, failures.join(" | "));
    return { saved: true, via: kept.join("+"), count: await count() };
  }

  // no store could take it, so it goes somewhere a person will see it
  const mailed = await sendNotice({
    subject: `Waitlist signup: ${email}`,
    text: [
      `${email} joined the waitlist.`,
      `Source: ${input.source}`,
      input.utm ? `Campaign: ${input.utm}` : null,
      input.referrer ? `Referrer: ${input.referrer}` : null,
      "",
      "This arrived by email because no store could be written to:",
      failures.join("\n") || "nothing was configured",
      "",
      "Add it to the list by hand, and check /api/health for the reason.",
    ]
      .filter(Boolean)
      .join("\n"),
  });

  if (mailed.sent) return { saved: true, via: "email", count: null };

  console.error(`[waitlist] NOT SAVED anywhere but the log: ${email}`);
  return {
    saved: false,
    via: "none",
    count: null,
    reason: [...failures, mailed.reason].filter(Boolean).join(" | ") || "nothing is configured",
  };
}

/** How many are on the list. Null when no store can answer. */
export async function count(): Promise<number | null> {
  if (!dbReady()) return null;
  const { count: n, error } = await db()
    .from("waitlist")
    .select("email", { count: "exact", head: true });
  return error ? null : (n ?? null);
}
