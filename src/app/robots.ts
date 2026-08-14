import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * No disallow list for AI crawlers (GPTBot, ClaudeBot, PerplexityBot,
 * Google-Extended, etc.) — being answerable by them is the point, not a
 * risk to block. Only checkout and API routes are excluded: real pages
 * with nothing for a crawler or an answer engine to index.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
