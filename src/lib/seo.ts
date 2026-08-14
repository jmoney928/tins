/**
 * One canonical origin for every absolute URL the site emits — metadata,
 * JSON-LD, sitemap, robots. www is what actually resolves (the apex
 * redirects to it), so pointing crawlers straight at www skips a hop.
 */
export const SITE_URL = "https://www.icetins.com";

export const ORG_NAME = "Ice Tins Supply Co.";

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}
