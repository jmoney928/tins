/**
 * Writes a Shopify product CSV from lib/catalog.ts.
 *
 * The import route needs no Admin token and no app scopes — the file is
 * dragged into Products → Import. Same source as the API seeder, so the
 * catalogue still starts identical to the site rather than retyped.
 *
 *   node --experimental-strip-types scripts/shopify-csv.ts > shopify-products.csv
 */
import { CATALOG, LAUNCH_PRICING, currentPrice } from "../src/lib/catalog.ts";

const ORIGIN = process.env.SITE_ORIGIN ?? "https://www.icetins.com";

const COLUMNS = [
  "Handle", "Title", "Body (HTML)", "Vendor", "Type", "Tags", "Published",
  "Option1 Name", "Option1 Value",
  "Variant SKU", "Variant Inventory Tracker", "Variant Inventory Qty",
  "Variant Inventory Policy", "Variant Fulfillment Service",
  "Variant Price", "Variant Compare At Price",
  "Variant Requires Shipping", "Variant Taxable",
  "Image Src", "Image Position", "Image Alt Text", "Status",
];

/** RFC 4180: quote everything, double the quotes inside. */
const cell = (v: string | number | null | undefined) =>
  `"${String(v ?? "").replace(/"/g, '""')}"`;
const row = (r: Record<string, string | number | null | undefined>) =>
  COLUMNS.map((c) => cell(r[c])).join(",");

const dollars = (cents: number) => (cents / 100).toFixed(2);

const rows: string[] = [];

function product(id: string, handle: string) {
  const p = CATALOG[id];
  const price = currentPrice(id);
  const compareAt = LAUNCH_PRICING && price < p.price ? dollars(p.price) : "";

  const bodyHtml =
    `<p>${p.blurb}</p><ul>${p.points.map((x) => `<li>${x}</li>`).join("")}</ul>`;

  // First row carries the product and its variant; the remaining rows repeat
  // the handle and add one image each, which is how Shopify's importer
  // attaches a gallery.
  rows.push(row({
    Handle: handle,
    Title: p.name,
    "Body (HTML)": bodyHtml,
    Vendor: "Ice Tins Supply Co.",
    Type: "Snus tin case",
    Tags: "machined, aluminium, cooled, snus tin",
    Published: "TRUE",
    "Option1 Name": "Title",
    "Option1 Value": "Default Title",
    "Variant SKU": p.id,
    "Variant Inventory Tracker": p.remaining === null ? "" : "shopify",
    "Variant Inventory Qty": p.remaining === null ? "" : p.remaining,
    "Variant Inventory Policy": "deny",
    "Variant Fulfillment Service": "manual",
    "Variant Price": dollars(price),
    "Variant Compare At Price": compareAt,
    "Variant Requires Shipping": "TRUE",
    "Variant Taxable": "TRUE",
    "Image Src": `${ORIGIN}${p.gallery[0]}`,
    "Image Position": 1,
    "Image Alt Text": p.galleryAlt[0] ?? p.name,
    Status: "active",
  }));

  p.gallery.slice(1).forEach((g, i) => {
    rows.push(row({
      Handle: handle,
      "Image Src": `${ORIGIN}${g}`,
      "Image Position": i + 2,
      "Image Alt Text": p.galleryAlt[i + 1] ?? p.name,
    }));
  });
}

product("ice-tin", "ice-tin");
product("chillcore-3", "chillcore-three-pack");

console.log([COLUMNS.map(cell).join(","), ...rows].join("\n"));
