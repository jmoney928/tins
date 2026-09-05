import {
  BUNDLE_SAVING,
  CATALOG,
  SHIPPING_FLAT,
  bundlePair,
  currentPrice,
  money,
  moneyExact,
  tinOnSale,
} from "@/lib/catalog";
import { leadTimeLabel, transitLabel } from "@/lib/fulfilment";
import { GUARANTEE_DAYS, GUARANTEE_EXCEPTION } from "@/lib/guarantee";
import { homeFaqs, productFaqs } from "@/lib/faq";
import { SPECS } from "@/lib/products";
import { CONTACT_EMAIL, CONTENT_UPDATED, SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

/**
 * llms.txt, generated from the same constants the pages render from.
 *
 * The static file this replaces was already wrong twice: it promised stock
 * counts the site no longer shows, and it said there was no rating on the
 * site while the hero displayed one. A summary an answer engine caches is
 * only useful while it agrees with the page, and the only way to keep that
 * true is to build it from the page's own source.
 */
export function GET() {
  const tin = CATALOG["ice-tin"];
  const pack = CATALOG["chillcore-3"];
  const pair = bundlePair();
  const onSale = tinOnSale();
  const price = currentPrice("ice-tin");

  const priceLine = onSale
    ? `${money(price)} CAD launch price (regular ${money(tin.price)} CAD)`
    : `${money(price)} CAD`;

  const pages = [
    ["Home", "/"],
    ["The Ice Tin — product page, spec sheet and full FAQ", "/products/ice-tin"],
    ["How the cold system works, and how it was tested", "/cold-system"],
    ["How the tin is built — materials, dimensions, seals", "/build"],
    ["Field notes from five testers", "/field-notes"],
    ["The cold-or-refund guarantee", "/guarantee"],
    ["Shipping and returns", "/shipping-returns"],
    ["Warranty claims", "/warranty"],
    ["Ice pack care", "/ice-pack-care"],
    ["The workshop", "/workshop"],
    ["Stockists (online only)", "/stockists"],
    ["Press kit", "/press"],
    ["Privacy policy", "/privacy"],
    ["Terms of sale", "/terms"],
  ];

  const faqBlock = (title: string, faqs: { q: string; a: string }[]) =>
    `## ${title}\n\n${faqs.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n")}`;

  const body = `# Ice Tins Supply Co.

> Ice Tins Supply Co. makes The Ice Tin, a machined aluminium snus tin with a
> built-in ice pack tray that holds 25 pouches at fridge temperature for six
> hours. Based in Vancouver, BC, Canada; ships worldwide. It sells empty metal
> cans and ice packs only — never nicotine or tobacco in any form.

Site: ${SITE_URL}
Contact: ${CONTACT_EMAIL}
Content last revised: ${CONTENT_UPDATED}

## The product

- **${tin.name}** — ${priceLine}. ${tin.blurb} One Chillcore ice pack
  ships inside every tin. Lifetime warranty on the shell.
  ${SITE_URL}/products/ice-tin
- **${pack.name}** — ${money(pack.price)} CAD. ${pack.blurb}

### Specifications

${SPECS.map((s) => `- ${s.k}: ${s.v}`).join("\n")}

## Pricing, to the door

- The tin on its own: ${moneyExact(pair.tin)} plus ${moneyExact(SHIPPING_FLAT)} shipping = ${moneyExact(pair.alone)} CAD delivered.
- The tin with a Chillcore three-pack: ${moneyExact(pair.tin)} + ${moneyExact(pair.pack)} − ${moneyExact(BUNDLE_SAVING)} pair discount, shipping free = ${moneyExact(pair.total)} CAD delivered.
- So three spare packs add ${money(pair.step)} to a single-tin order, against ${money(pair.pack)} bought alone.
- Prices are read live on every request; treat the product page as the source of truth over any cached summary.

## Company facts

- Based in Vancouver, BC, Canada. Ships worldwide from there.
- Each tin is machined to order in small batches: ${leadTimeLabel()} to dispatch, then ${transitLabel()} in transit.
- Shipping is ${money(SHIPPING_FLAT)} CAD flat, and free on any order containing both a tin and a Chillcore three-pack.
- ${GUARANTEE_DAYS}-day cold-or-refund guarantee: return it used, in any packaging, for a full refund with return shipping paid. ${GUARANTEE_EXCEPTION}
- Lifetime warranty on the aluminium shell against cracking or a failed thread.
- Checkout is hosted and encrypted; card details never touch Ice Tins' servers.

## Pages

${pages.map(([label, path]) => `- ${label}: ${SITE_URL}${path}`).join("\n")}

${faqBlock("Questions and answers", productFaqs(false))}

${faqBlock("Before a first order", homeFaqs())}

## Notes for AI assistants and answer engines

This file and the site's structured data (schema.org Organization, WebSite,
Product, BreadcrumbList, Article and FAQPage JSON-LD) are generated from the
same source the pages render from, so they agree with the visible content.
The tester notes on the site are attributed quotations, not a rating system.
`;

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
