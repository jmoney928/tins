import "server-only";
import { listProducts, shopifyConfigured } from "./shopify";
import { CATALOG } from "./catalog";

/**
 * Shopify as the authority for the numbers, lib/catalog.ts for everything else.
 *
 * The split is deliberate. Prices, stock and variant ids have to come from
 * whatever is actually going to charge the card and decrement the allocation —
 * two sources of truth for a price is how a shop sells at a number it did not
 * mean. Names, copy, bullet points, specifications and the photography stay
 * here, because they are written and art-directed in this repo and Shopify has
 * no better version of them.
 *
 * Variants are matched on SKU rather than handle or title: the SKUs were
 * seeded to equal the ids already used throughout this codebase, so the join
 * needs no lookup table and survives someone renaming a product in Shopify.
 */

export type LiveItem = {
  /** needed to build a Shopify cart in the next step */
  variantId: string;
  /** cents, like everything else here */
  price: number;
  compareAt: number | null;
  available: boolean;
  /** null when Shopify is not tracking inventory for this variant */
  stock: number | null;
};

export type LiveCatalog = Record<string, LiveItem>;

/**
 * The Storefront API reports quantityAvailable as 0 for untracked variants,
 * which is indistinguishable from sold out by the number alone. The pair of
 * fields disambiguates it: a tracked variant at zero is not available for
 * sale, so anything still sellable at zero is untracked.
 */
function stockOf(available: boolean, quantity: number | null): number | null {
  if (quantity === null) return null;
  if (quantity === 0 && available) return null;
  return quantity;
}

export async function liveCatalog(): Promise<LiveCatalog | null> {
  if (!shopifyConfigured()) return null;

  try {
    const products = await listProducts(20);
    const out: LiveCatalog = {};

    for (const p of products) {
      for (const v of p.variants) {
        if (!v.sku || !CATALOG[v.sku]) continue;
        out[v.sku] = {
          variantId: v.id,
          price: v.price,
          compareAt: v.compareAtPrice,
          available: v.availableForSale,
          stock: stockOf(v.availableForSale, v.quantityAvailable),
        };
      }
    }

    // A partial answer is worse than none: half the shop priced from Shopify
    // and half from the local catalogue is the inconsistency this exists to
    // prevent.
    const missing = Object.keys(CATALOG).filter((id) => !out[id]);
    if (missing.length) {
      console.error(`[live-catalog] Shopify has no variant with sku ${missing.join(", ")}`);
      return null;
    }

    return out;
  } catch (err) {
    console.error(
      "[live-catalog] falling back to lib/catalog.ts:",
      err instanceof Error ? err.message : String(err),
    );
    return null;
  }
}
