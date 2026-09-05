import type { Metadata } from "next";

/**
 * One canonical origin for every absolute URL the site emits — metadata,
 * JSON-LD, sitemap, robots. www is what actually resolves (the apex
 * redirects to it), so pointing crawlers straight at www skips a hop.
 */
export const SITE_URL = "https://www.icetins.com";

export const ORG_NAME = "Ice Tins Supply Co.";
export const CONTACT_EMAIL = "shop@icetins.com";

/** Stable identifiers, so every page's graph points at the same entities. */
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const PRODUCT_ID = `${SITE_URL}/products/ice-tin#product`;
export const PACK_ID = `${SITE_URL}/products/ice-tin#chillcore-3`;

/**
 * Dates for the sitemap and Article markup. The sitemap used to stamp every
 * page with the request time, which told crawlers the whole site changed
 * every day — a signal that quickly stops meaning anything. These move when
 * the content does.
 */
export const CONTENT_PUBLISHED = "2026-08-12";
export const CONTENT_UPDATED = "2026-09-04";
export const LEGAL_UPDATED_ISO = "2026-09-03";

export const OG_DEFAULT = {
  url: "/og-default.png",
  width: 1200,
  height: 630,
  alt: "The Ice Tin, a machined aluminium snus tin with an ice pack in the base",
};

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

type OgImage = { url: string; width?: number; height?: number; alt: string };

/**
 * Every page's metadata through one door, so none of them can forget the
 * share image, the canonical or the Twitter card. A page that declared its
 * own openGraph block used to lose the site-wide image entirely, which is
 * how four topic pages shipped with no preview at all.
 */
export function pageMetadata({
  title,
  ogTitle,
  description,
  path,
  type = "website",
  image = OG_DEFAULT,
  noIndex = false,
}: {
  title: Metadata["title"];
  /** the plain-string title for share cards when `title` is not a string */
  ogTitle?: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: OgImage;
  noIndex?: boolean;
}): Metadata {
  const shareTitle = ogTitle ?? (typeof title === "string" ? title : ORG_NAME);
  const img = { ...image, url: absoluteUrl(image.url) };
  return {
    title,
    description,
    alternates: { canonical: path },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: shareTitle,
      description,
      url: path,
      type,
      siteName: ORG_NAME,
      locale: "en_CA",
      images: [img],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [img.url],
    },
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      ...trail.map((t, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: t.name,
        item: absoluteUrl(t.path),
      })),
    ],
  };
}

export function articleJsonLd({
  headline,
  description,
  path,
  image,
}: {
  headline: string;
  description: string;
  path: string;
  image: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${absoluteUrl(path)}#article`,
    headline,
    description,
    image: absoluteUrl(image),
    datePublished: CONTENT_PUBLISHED,
    dateModified: CONTENT_UPDATED,
    inLanguage: "en",
    mainEntityOfPage: absoluteUrl(path),
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}
