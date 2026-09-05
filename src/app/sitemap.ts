import type { MetadataRoute } from "next";
import { CONTENT_UPDATED, LEGAL_UPDATED_ISO, SITE_URL } from "@/lib/seo";

/**
 * Topic pages, split out of the homepage anchors so each can rank for what
 * it is about. Ranked above the utility pages because they carry real
 * commercial intent.
 */
const TOPIC_PAGES = ["cold-system", "build", "field-notes", "guarantee"];

const INFO_PAGES = [
  "shipping-returns",
  "warranty",
  "ice-pack-care",
  "workshop",
  "stockists",
  "press",
  "careers",
];

/**
 * Indexed, but at the bottom. These have to be reachable — Meta's ad review
 * looks for a privacy policy on the advertised domain, and a page no crawler
 * can find is a page that review may not find either — while never competing
 * with the pages that sell anything.
 */
const LEGAL_PAGES = ["privacy", "terms", "cookies"];

export default function sitemap(): MetadataRoute.Sitemap {
  // the two selling pages render live pricing per request; everything else
  // moves only when its content does
  const now = new Date();
  const content = new Date(CONTENT_UPDATED);
  const legal = new Date(LEGAL_UPDATED_ISO);
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/products/ice-tin`,
      lastModified: now,
      changeFrequency: "daily", // live pricing, rendered per request
      priority: 0.9,
    },
    ...TOPIC_PAGES.map((slug) => ({
      url: `${SITE_URL}/${slug}`,
      lastModified: content,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...INFO_PAGES.map((slug) => ({
      url: `${SITE_URL}/${slug}`,
      lastModified: content,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    })),
    ...LEGAL_PAGES.map((slug) => ({
      url: `${SITE_URL}/${slug}`,
      lastModified: legal,
      changeFrequency: "yearly" as const,
      priority: 0.1,
    })),
  ];
}
