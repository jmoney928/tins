import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client, using the service-role key.
 *
 * Never import this into a client component. The service key bypasses RLS,
 * and every table in schema.sql has RLS on with no policies — so the browser
 * cannot reach this data even if the anon key were exposed.
 */
let client: SupabaseClient | null = null;

export type DbConfig =
  | { state: "ready" }
  | { state: "absent" }
  | { state: "partial"; missing: string };

/**
 * Half-configured is a mistake, not a mode. Treating it as "absent" would
 * silently fall back to in-memory stock — which is exactly the failure this
 * store exists to prevent — so it is reported separately and fails closed.
 */
export function dbConfig(): DbConfig {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (url && key) return { state: "ready" };
  if (!url && !key) return { state: "absent" };
  return { state: "partial", missing: url ? "SUPABASE_SERVICE_ROLE_KEY" : "SUPABASE_URL" };
}

export const dbConfigured = () => dbConfig().state === "ready";

export function db(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key)
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must both be set.",
    );

  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
