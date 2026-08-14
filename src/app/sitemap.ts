import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/products/ice-tin`,
      lastModified: now,
      changeFrequency: "daily", // stock count changes on every order
      priority: 0.9,
    },
  ];
}
