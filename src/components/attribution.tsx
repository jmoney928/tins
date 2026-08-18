"use client";

import { useEffect } from "react";
import {
  ATTRIBUTION_MAX_AGE,
  COOKIE,
  buildFbc,
  newEventId,
  packUtm,
} from "@/lib/attribution";

function read(name: string) {
  return document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function write(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${ATTRIBUTION_MAX_AGE}; SameSite=Lax`;
}

/**
 * Captures the click identity on landing, once, into first-party cookies.
 *
 * Meta's pixel writes `_fbp` itself but only writes `_fbc` when it happens to
 * be loaded before the URL is cleaned, so the click id is written here from
 * `fbclid` directly. Campaign tags are stored first-touch — the ad that
 * introduced someone is the one that earned the sale, not whichever link they
 * happened to arrive on a week later.
 *
 * No network calls and no state: these cookies are read server-side by the
 * checkout API, which is what carries them through Stripe to the webhook.
 */
export function Attribution() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const fbclid = params.get("fbclid");
    if (fbclid && !read(COOKIE.fbc)) write(COOKIE.fbc, buildFbc(fbclid));

    if (!read(COOKIE.externalId)) write(COOKIE.externalId, newEventId());

    if (!read(COOKIE.utm)) {
      const utm = packUtm(params);
      if (utm) write(COOKIE.utm, encodeURIComponent(utm));
    }
  }, []);

  return null;
}
