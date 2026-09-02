/**
 * Seeds the Shopify catalogue from lib/catalog.ts.
 *
 * One-off, and idempotent: it looks for an existing product with the same
 * handle before creating anything, so running it twice does not produce two
 * Ice Tins. Prices, copy and photographs all come from the records the live
 * site already renders, which is the point — a catalogue typed in by hand
 * would start drifting from the site on day one.
 *
 * A script rather than a route. Creating products is an administrative act
 * that should not be reachable over HTTP, and the Admin token has scopes the
 * storefront has no business holding.
 *
 *   SHOPIFY_STORE_DOMAIN=… SHOPIFY_ADMIN_TOKEN=… \
 *     node --experimental-strip-types scripts/seed-shopify.ts [--dry]
 */
import { CATALOG, LAUNCH_PRICING, currentPrice } from "../src/lib/catalog.ts";

/** Shopify fetches the photographs over HTTP, so they come from the live site. */
const SITE_ORIGIN_FOR_IMAGES = process.env.SITE_ORIGIN ?? "https://www.icetins.com";

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, "").replace(/\/+$/, "");
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const VERSION = process.env.SHOPIFY_API_VERSION ?? "2026-01";
const DRY = process.argv.includes("--dry");

if (!DOMAIN || !TOKEN) {
  console.error("Set SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_TOKEN.");
  process.exit(1);
}

async function admin<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(`https://${DOMAIN}/admin/api/${VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": TOKEN! },
    body: JSON.stringify({ query, variables }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Admin ${res.status}: ${text.slice(0, 500)}`);
  const json = JSON.parse(text) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
  if (!json.data) throw new Error("No data returned.");
  return json.data;
}

/** Shopify counts money in decimal strings; this codebase counts cents. */
const dollars = (cents: number) => (cents / 100).toFixed(2);

async function existingHandle(handle: string) {
  const d = await admin<{ productByHandle: { id: string; handle: string } | null }>(
    `query($handle: String!) { productByHandle(handle: $handle) { id handle } }`,
    { handle },
  );
  return d.productByHandle;
}

/** Inventory has to be assigned somewhere; a single-location shop has one. */
async function primaryLocationId() {
  const d = await admin<{ locations: { nodes: { id: string; name: string }[] } }>(
    `query { locations(first: 1) { nodes { id name } } }`,
  );
  const loc = d.locations.nodes[0];
  if (!loc) throw new Error("The store has no locations, so stock cannot be assigned.");
  return loc.id;
}

async function seed(id: string, handle: string, locationId: string) {
  const p = CATALOG[id];
  const already = await existingHandle(handle);
  if (already) {
    console.log(`  = ${handle} already exists (${already.id}) — leaving it alone`);
    return;
  }

  // The launch price is what the shop charges; the list price becomes the
  // compare-at, which is how Shopify natively renders the same offer the
  // site shows as "Launch price $49.99 — reg. $79.99".
  const price = currentPrice(id);
  const compareAt = LAUNCH_PRICING && price < p.price ? p.price : null;

  const input = {
    title: p.name,
    handle,
    descriptionHtml: `<p>${p.blurb}</p><ul>${p.points.map((x) => `<li>${x}</li>`).join("")}</ul>`,
    vendor: "Ice Tins Supply Co.",
    productType: "Snus tin case",
    status: "ACTIVE",
    // Shopify fetches these itself, which is why the site being live matters
    files: p.gallery.map((g, i) => ({
      originalSource: `${SITE_ORIGIN_FOR_IMAGES}${g}`,
      alt: p.galleryAlt[i] ?? p.name,
      contentType: "IMAGE",
    })),
    variants: [
      {
        price: dollars(price),
        ...(compareAt ? { compareAtPrice: dollars(compareAt) } : {}),
        inventoryItem: { sku: p.id, tracked: p.remaining !== null },
        ...(p.remaining !== null
          ? { inventoryQuantities: [{ locationId, name: "available", quantity: p.remaining }] }
          : {}),
      },
    ],
  };

  if (DRY) {
    console.log(`  + would create ${handle}:`, JSON.stringify(input, null, 2).slice(0, 600), "…");
    return;
  }

  const d = await admin<{
    productSet: { product: { id: string; handle: string } | null; userErrors: { field: string[]; message: string }[] };
  }>(
    `mutation Seed($input: ProductSetInput!) {
       productSet(input: $input, synchronous: true) {
         product { id handle }
         userErrors { field message }
       }
     }`,
    { input },
  );

  const errs = d.productSet.userErrors;
  if (errs?.length) throw new Error(errs.map((e) => `${e.field?.join(".")}: ${e.message}`).join("; "));
  console.log(`  + created ${d.productSet.product?.handle} (${d.productSet.product?.id})`);
}

const shop = await admin<{ shop: { name: string; currencyCode: string } }>(
  `query { shop { name currencyCode } }`,
);
console.log(`Shop: ${shop.shop.name} (${shop.shop.currencyCode})${DRY ? "  [dry run]" : ""}`);

const locationId = DRY ? "dry-run" : await primaryLocationId();

await seed("ice-tin", "ice-tin", locationId);
await seed("chillcore-3", "chillcore-three-pack", locationId);
console.log("Done.");
