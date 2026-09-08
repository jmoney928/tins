import "server-only";
import { db, dbConfig } from "./db";
import { sendNotice } from "./email";

/**
 * The waitlist, and the promise that an address given to us is not lost.
 *
 * One row per person, keyed on the address, so signing up twice does not
 * create a second row and does not overwrite where the first one came from.
 *
 * A single store would make every signup only as reliable as that store. So
 * the address is written to Supabase, and if that write cannot happen — the
 * table is not there yet, the project is unreachable, the key was rotated —
 * it is emailed to the shop inbox instead and logged in a form that can be
 * grepped out of the platform logs. Only when every one of those fails does
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
  /** where it ended up, for the health check and the logs */
  via: "database" | "email" | "log" | "none";
  /** total on the list, when the store could answer */
  count: number | null;
};

const ready = () => dbConfig().state === "ready";

export function normaliseEmail(raw: string) {
  return raw.trim().toLowerCase();
}

export function looksLikeEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254;
}

export async function saveSignup(input: Signup): Promise<SaveResult> {
  const email = normaliseEmail(input.email);

  // the backstop that cannot fail: whatever else happens, the address is in
  // the platform log under a fixed prefix
  console.log(`[waitlist] signup email=${email} source=${input.source}`);

  if (ready()) {
    const { error } = await db()
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
        // the first signup keeps its source and its date; a repeat is not a
        // new person and must not overwrite where the first one came from
        { onConflict: "email", ignoreDuplicates: true },
      );

    if (!error) return { saved: true, via: "database", count: await count() };

    console.error(`[waitlist] database write failed for ${email}:`, error.message);
  }

  // the store could not take it, so it goes somewhere a person will see it
  const mailed = await sendNotice({
    subject: `Waitlist signup: ${email}`,
    text: [
      `${email} joined the waitlist.`,
      `Source: ${input.source}`,
      input.utm ? `Campaign: ${input.utm}` : null,
      input.referrer ? `Referrer: ${input.referrer}` : null,
      "",
      "This arrived by email because the database could not be written to.",
      "Add it to the list by hand, and check /api/health for the reason.",
    ]
      .filter(Boolean)
      .join("\n"),
  });

  if (mailed) return { saved: true, via: "email", count: null };

  console.error(`[waitlist] NOT SAVED anywhere but the log: ${email}`);
  return { saved: false, via: "log", count: null };
}

/** How many are on the list. Null when the store cannot answer. */
export async function count(): Promise<number | null> {
  if (!ready()) return null;
  const { count: n, error } = await db()
    .from("waitlist")
    .select("email", { count: "exact", head: true });
  return error ? null : (n ?? null);
}
