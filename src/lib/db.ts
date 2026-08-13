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
  | { state: "ready"; url: string }
  | { state: "absent" }
  | { state: "partial"; missing: string }
  | { state: "malformed"; problem: string };

/**
 * Half-configured is a mistake, not a mode. Treating it as "absent" would
 * silently fall back to in-memory stock — which is exactly the failure this
 * store exists to prevent — so it is reported separately and fails closed.
 */
export function dbConfig(): DbConfig {
  const url = process.env.SUPABASE_URL?.trim().replace(/\/+$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url && !key) return { state: "absent" };
  if (!url || !key)
    return { state: "partial", missing: url ? "SUPABASE_SERVICE_ROLE_KEY" : "SUPABASE_URL" };

  // PostgREST appends /rest/v1 itself, so any path here breaks every request
  // with an opaque "Invalid path specified in request URL".
  if (url.startsWith("postgres"))
    return {
      state: "malformed",
      problem:
        "SUPABASE_URL is a Postgres connection string. It needs the API URL: https://<project-ref>.supabase.co",
    };

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { state: "malformed", problem: `SUPABASE_URL is not a URL: "${url.slice(0, 40)}"` };
  }

  if (parsed.pathname && parsed.pathname !== "/")
    return {
      state: "malformed",
      problem: `SUPABASE_URL must have no path, but has "${parsed.pathname}". Use https://${parsed.hostname.endsWith(".supabase.co") ? parsed.hostname : "<project-ref>.supabase.co"} — the Project URL under Settings -> API, not the dashboard address.`,
    };

  if (!parsed.hostname.endsWith(".supabase.co"))
    return {
      state: "malformed",
      problem: `SUPABASE_URL host is "${parsed.hostname}", expected <project-ref>.supabase.co`,
    };

  return { state: "ready", url };
}

export const dbConfigured = () => dbConfig().state === "ready";

export function db(): SupabaseClient {
  if (client) return client;
  const cfg = dbConfig();
  if (cfg.state !== "ready")
    throw new Error(
      cfg.state === "malformed"
        ? cfg.problem
        : "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must both be set.",
    );

  client = createClient(cfg.url, process.env.SUPABASE_SERVICE_ROLE_KEY!.trim(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
