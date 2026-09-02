import "server-only";

/**
 * Shopify Storefront API client.
 *
 * Headless: Shopify owns the catalogue, inventory, discounts and checkout;
 * this repo keeps the storefront it already has. Products are read from here
 * rather than from lib/catalog.ts, and a cart is created here to obtain the
 * checkoutUrl that replaces the Stripe session.
 *
 * Nothing in this file is wired into a page yet. It is inert until
 * SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_TOKEN are set, so the live
 * Stripe path keeps working untouched while this is brought up.
 */

/**
 * Shopify supports each version for a year and warns before removing one.
 * Overridable because a stale pin here fails at runtime rather than at build,
 * which is the worst way to find out.
 */
const API_VERSION = process.env.SHOPIFY_API_VERSION ?? "2026-01";

/**
 * Two kinds of Storefront token, and which one you need depends on something
 * that has nothing to do with code: whether the online store still has its
 * password page up.
 *
 *   public  (X-Shopify-Storefront-Access-Token) — browser-safe, and refused
 *           while the storefront is password-protected
 *   private (Shopify-Storefront-Private-Token)  — server-only, and reads a
 *           password-protected store perfectly well
 *
 * icetins.myshopify.com is password-protected today, so the private token is
 * the one that works. Every call here is server-side regardless, so the
 * private token is preferred whenever it is present.
 */
export function shopifyConfigured() {
  return Boolean(
    process.env.SHOPIFY_STORE_DOMAIN &&
      (process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN || process.env.SHOPIFY_STOREFRONT_TOKEN),
  );
}

function authHeaders(): Record<string, string> {
  const priv = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
  if (priv) return { "Shopify-Storefront-Private-Token": priv };
  return { "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_STOREFRONT_TOKEN! };
}

function endpoint() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN!.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  return `https://${domain}/api/${API_VERSION}/graphql.json`;
}

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

/**
 * One place where a Storefront call can fail, so every caller gets the same
 * treatment: GraphQL errors are surfaced rather than swallowed, because a
 * partial `data` alongside `errors` is Shopify's normal way of reporting a
 * bad field and silently returning half a product is worse than throwing.
 */
export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  init?: { cache?: RequestCache; revalidate?: number },
): Promise<T> {
  if (!shopifyConfigured()) {
    throw new Error(
      "Set SHOPIFY_STORE_DOMAIN plus SHOPIFY_STOREFRONT_PRIVATE_TOKEN (or SHOPIFY_STOREFRONT_TOKEN).",
    );
  }

  const res = await fetch(endpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ query, variables }),
    ...(init?.revalidate !== undefined
      ? { next: { revalidate: init.revalidate } }
      : { cache: init?.cache ?? "no-store" }),
  });

  if (!res.ok) {
    const body = (await res.text()).slice(0, 400);
    throw new Error(`Shopify ${res.status}: ${body}`);
  }

  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length) {
    throw new Error(`Shopify GraphQL: ${json.errors.map((e) => e.message).join("; ")}`);
  }
  if (!json.data) throw new Error("Shopify returned no data.");
  return json.data;
}

/**
 * A single call that answers "is this wired up correctly", for the health
 * endpoint. Reports what it can rather than throwing, because a diagnostic
 * that fails the same way as a real outage is not a diagnostic.
 */
type DiagnosticsData = {
  shop: { name: string; paymentSettings: { currencyCode: string } };
  products: {
    nodes: {
      handle: string;
      title: string;
      variants: {
        nodes: {
          id: string;
          sku: string | null;
          quantityAvailable?: number | null;
          availableForSale: boolean;
          price: { amount: string };
          compareAtPrice: { amount: string } | null;
        }[];
      };
    }[];
  };
};

export async function shopifyDiagnostics(): Promise<Record<string, unknown>> {
  if (!shopifyConfigured()) {
    return {
      state: "not configured",
      domain: process.env.SHOPIFY_STORE_DOMAIN ? "set" : "missing",
      token: "missing SHOPIFY_STOREFRONT_PRIVATE_TOKEN (or SHOPIFY_STOREFRONT_TOKEN)",
    };
  }

  const tokenKind = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN ? "private" : "public";

  /**
   * quantityAvailable needs its own scope, and Shopify refuses the whole
   * query when it is absent rather than omitting the field. So it is asked
   * for optionally: if the token cannot read inventory we say so and report
   * everything else, because a diagnostic that returns nothing over one
   * missing scope is worse than one that returns most of the answer.
   */
  const withInventory = async (inventory: boolean) => {
    const qty = inventory ? "quantityAvailable" : "";
    return shopifyFetch<DiagnosticsData>(
      `query Diagnostics {
         shop { name paymentSettings { currencyCode } }
         products(first: 20) {
           nodes {
             handle
             title
             variants(first: 5) {
               nodes {
                 id
                 sku
                 ${qty}
                 availableForSale
                 price { amount }
                 compareAtPrice { amount }
               }
             }
           }
         }
       }`,
    );
  };

  let inventoryReadable = true;
  try {
    let data: DiagnosticsData;
    try {
      data = await withInventory(true);
    } catch (err) {
      if (!/unauthenticated_read_product_inventory/.test(String(err))) throw err;
      inventoryReadable = false;
      data = await withInventory(false);
    }

    return {
      state: "connected",
      tokenKind,
      inventoryScope: inventoryReadable
        ? "granted"
        : "missing unauthenticated_read_product_inventory — stock counts unavailable",
      shop: data.shop.name,
      currency: data.shop.paymentSettings.currencyCode,
      // enough to confirm an import actually mapped: a product that exists
       // but carries no SKU, no price or no stock is not a usable catalogue
      products: data.products.nodes.map((p) => ({
        handle: p.handle,
        title: p.title,
        sku: p.variants.nodes[0]?.sku ?? null,
        price: p.variants.nodes[0]?.price.amount ?? null,
        compareAt: p.variants.nodes[0]?.compareAtPrice?.amount ?? null,
        available: p.variants.nodes[0]?.availableForSale ?? null,
        stock: p.variants.nodes[0]?.quantityAvailable ?? null,
        variants: p.variants.nodes.length,
      })),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      state: "unreachable",
      tokenKind,
      error: message.slice(0, 300),
      // the single most common cause on a store that is not open yet
      hint: /unauthorized|401|403/i.test(message)
        ? "A public Storefront token is refused while the store has its password page up — use the private token."
        : undefined,
    };
  }
}

/**
 * The Admin API half, for the health endpoint.
 *
 * Reports whether the token authenticates and exactly which scopes it was
 * granted, so a missing one is named rather than discovered later as a webhook
 * that quietly delivers blank customer fields.
 *
 * The token itself never leaves Vercel — this asks Shopify what it can do and
 * reports the answer.
 */
const ADMIN_SCOPES_NEEDED = ["read_orders", "read_products", "read_inventory"];

export async function shopifyAdminDiagnostics(): Promise<Record<string, unknown>> {
  const token = process.env.SHOPIFY_ADMIN_TOKEN;
  const domain = process.env.SHOPIFY_STORE_DOMAIN;

  if (!domain || !token) {
    return {
      state: "not configured",
      token: token ? "set" : "missing SHOPIFY_ADMIN_TOKEN",
      webhookSecret: process.env.SHOPIFY_WEBHOOK_SECRET ? "set" : "missing SHOPIFY_WEBHOOK_SECRET",
    };
  }

  const host = domain.replace(/^https?:\/\//, "").replace(/\/+$/, "");

  try {
    const res = await fetch(`https://${host}/admin/api/${API_VERSION}/graphql.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
      body: JSON.stringify({
        query: `query { currentAppInstallation { accessScopes { handle } } shop { name } }`,
      }),
      signal: AbortSignal.timeout(6000),
    });

    const text = await res.text();
    if (!res.ok) {
      return { state: "unreachable", error: `${res.status}: ${text.slice(0, 200)}` };
    }

    const json = JSON.parse(text) as {
      data?: {
        currentAppInstallation: { accessScopes: { handle: string }[] } | null;
        shop: { name: string };
      };
      errors?: { message: string }[];
    };

    if (json.errors?.length) {
      return { state: "error", error: json.errors.map((e) => e.message).join("; ").slice(0, 250) };
    }

    const granted = (json.data?.currentAppInstallation?.accessScopes ?? []).map((s) => s.handle);
    const missing = ADMIN_SCOPES_NEEDED.filter((s) => !granted.includes(s));

    return {
      state: "connected",
      shop: json.data?.shop.name,
      webhookSecret: process.env.SHOPIFY_WEBHOOK_SECRET ? "set" : "missing SHOPIFY_WEBHOOK_SECRET",
      scopes: granted,
      missingScopes: missing.length ? missing : "none",
      // Shopify blanks customer fields on order payloads unless protected
      // customer data access is approved in the app config — a separate
      // switch from scopes, and one that fails silently
      note: "Protected customer data access must also be approved for order webhooks to include email and address.",
    };
  } catch (err) {
    return {
      state: "unreachable",
      error: (err instanceof Error ? err.message : String(err)).slice(0, 250),
    };
  }
}

/* ─────────────────────────── products ─────────────────────────── */

export type ShopifyVariant = {
  id: string;
  title: string;
  /** deliberately matches the ids used in lib/catalog.ts, so no lookup table */
  sku: string | null;
  availableForSale: boolean;
  quantityAvailable: number | null;
  /** cents, to match the rest of this codebase — Shopify returns decimals */
  price: number;
  compareAtPrice: number | null;
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  images: { url: string; altText: string | null }[];
  variants: ShopifyVariant[];
};

const PRODUCT_FIELDS = `
  id
  handle
  title
  description
  images(first: 12) { nodes { url altText } }
  variants(first: 20) {
    nodes {
      id
      title
      sku
      availableForSale
      quantityAvailable
      price { amount currencyCode }
      compareAtPrice { amount currencyCode }
    }
  }
`;

/** Shopify money comes back as a decimal string; this codebase counts cents. */
const toCents = (amount?: string | null) =>
  amount == null ? null : Math.round(Number(amount) * 100);

type RawProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  images: { nodes: { url: string; altText: string | null }[] };
  variants: {
    nodes: {
      id: string;
      title: string;
      sku: string | null;
      availableForSale: boolean;
      quantityAvailable: number | null;
      price: { amount: string };
      compareAtPrice: { amount: string } | null;
    }[];
  };
};

function normalise(p: RawProduct): ShopifyProduct {
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    description: p.description,
    images: p.images.nodes,
    variants: p.variants.nodes.map((v) => ({
      id: v.id,
      title: v.title,
      sku: v.sku,
      availableForSale: v.availableForSale,
      quantityAvailable: v.quantityAvailable,
      price: toCents(v.price.amount)!,
      compareAtPrice: toCents(v.compareAtPrice?.amount),
    })),
  };
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<{ product: RawProduct | null }>(
    `query Product($handle: String!) { product(handle: $handle) { ${PRODUCT_FIELDS} } }`,
    { handle },
    // stock moves, so this is read fresh; wrap in a cache with a short
    // revalidate once the pages are actually reading from it
    { cache: "no-store" },
  );
  return data.product ? normalise(data.product) : null;
}

export async function listProducts(first = 20): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{ products: { nodes: RawProduct[] } }>(
    `query Products($first: Int!) { products(first: $first) { nodes { ${PRODUCT_FIELDS} } } }`,
    { first },
  );
  return data.products.nodes.map(normalise);
}

/* ──────────────────────────── cart ────────────────────────────── */

export type CartLine = { variantId: string; quantity: number };

/**
 * Attribution has to survive the hand-off to Shopify's checkout, exactly as
 * it currently survives the hand-off to Stripe. Cart attributes are the
 * equivalent of the Stripe session metadata we use today: they ride with the
 * order and come back on the order webhook, which is what lets a purchase be
 * traced to the ad that produced it.
 */
export type CartAttributes = Record<string, string>;

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  /**
   * What Shopify will actually charge, including any automatic discount it
   * decided to apply. Worth having: the checkout page computes its total in
   * the browser, so scraping the HTML cannot tell a discounted cart from an
   * undiscounted one — but the cart mutation says so plainly.
   */
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
  };
  discountAllocations: { discountedAmount: { amount: string } }[];
  discountCodes: { code: string; applicable: boolean }[];
};

/**
 * Discount codes applied to every cart, from SHOPIFY_DISCOUNT_CODES
 * (comma-separated).
 *
 * Shopify offers two kinds of discount and they are identical to configure
 * except for one toggle: an automatic one applies itself, a coded one waits
 * for someone to type the code. Attaching the codes here makes that toggle
 * irrelevant — an automatic discount still applies on its own, and a coded
 * one is applied for the shopper, who never sees a code box or has to know
 * one exists.
 *
 * Codes that do not apply are reported by Shopify as inapplicable rather than
 * failing the cart, so a stale code costs nothing.
 */
function configuredDiscountCodes(): string[] {
  return (process.env.SHOPIFY_DISCOUNT_CODES ?? "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
}

export async function createCart(
  lines: CartLine[],
  attributes: CartAttributes = {},
  buyerEmail?: string | null,
): Promise<ShopifyCart> {
  const codes = configuredDiscountCodes();
  const data = await shopifyFetch<{
    cartCreate: {
      cart: ShopifyCart | null;
      userErrors: { field: string[] | null; message: string }[];
    };
  }>(
    `mutation CartCreate($input: CartInput!) {
       cartCreate(input: $input) {
         cart {
           id
           checkoutUrl
           totalQuantity
           cost {
             subtotalAmount { amount currencyCode }
             totalAmount { amount currencyCode }
           }
           discountAllocations { discountedAmount { amount } }
           discountCodes { code applicable }
         }
         userErrors { field message }
       }
     }`,
    {
      input: {
        lines: lines.map((l) => ({ merchandiseId: l.variantId, quantity: l.quantity })),
        attributes: Object.entries(attributes)
          .filter(([, value]) => Boolean(value))
          .map(([key, value]) => ({ key, value: value.slice(0, 255) })),
        ...(codes.length ? { discountCodes: codes } : {}),
        ...(buyerEmail ? { buyerIdentity: { email: buyerEmail } } : {}),
      },
    },
  );

  const { cart, userErrors } = data.cartCreate;
  if (userErrors?.length) {
    throw new Error(`Shopify cart: ${userErrors.map((e) => e.message).join("; ")}`);
  }
  if (!cart) throw new Error("Shopify returned no cart.");
  return cart;
}
