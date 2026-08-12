# ICETINS

Marketing + storefront front-end for icetins.com — a machined aluminium snus can split into three floors: spent pouches on top, fresh pouches in the middle, a slim ice pack underneath. Same 72.4 × 23.5 mm footprint as an ordinary can.

```bash
npm run dev     # http://localhost:3000
npm run build
```

## Design system

Light ice: white page, blue splatters, single accent. Everything is tokenised in [globals.css](src/app/globals.css) under `@theme`.

| Token | Value | Use |
| --- | --- | --- |
| `void` / `paper` | `#ffffff` | page base |
| `abyss` / `slate-deep` / `rime` | | raised surfaces, hover fills |
| `fog` → `frost` → `white-ice` | `#5f7386` → `#10203a` | text ramp, low to high emphasis |
| `ink` | `#10203a` | primary buttons, headings — pulled from the badge |
| `ice-100` → `ice-700` | | the only accent, deep enough to read on white |

The ramp names carry over from the earlier dark build with their meanings inverted, so component classes stayed stable through the switch. Shadows are tinted to the ice hue — neutral grey shadows go muddy against a cool white.

- **Type**: Geist for everything, Geist Mono for numbers, specs, eyebrows and labels. Hierarchy comes from weight and colour rather than size — the H1 tops out at `4.4rem`.
- **No photography.** Everything is vector: [tin-puck.tsx](src/components/tin-puck.tsx) (top-down case), [ice-core.tsx](src/components/ice-core.tsx) (the freezable gel disc, drawn with fracture facets so it reads frozen rather than as a blue button), and [cutaway.tsx](src/components/cutaway.tsx) (sectioned shop drawing of all three floors, drawn near true proportion — wide and flat — because the flatness *is* the argument; its callout numbers key to the list beside it). Adding a finish means adding colour stops in [products.ts](src/lib/products.ts), not sourcing a photo.
- **Splatters** ([splatter.tsx](src/components/splatter.tsx)) carry the playful half of the brand. Three layers, and the split is load-bearing: overlapping *lobes* that a gooey SVG filter fuses into one body, *arms* as radiating ellipses with bulbed tips — these are what make it read as a thrown splash instead of a blob — and *spray* circles drawn **outside** the filter, because anything under ~10px is destroyed by the blur/threshold pass. On white they use `mix-blend-multiply` with saturated stops at 0.4–0.8 opacity, which is what lets them read as ink rather than haze. (On the earlier dark base the rule was inverted: `mix-blend-screen`, since near-white stops turned to grey haze and dark stops read as shadow.)
- **Motion**: pointer-driven values (hero tilt, magnetic buttons, card spotlight) run on Framer `useMotionValue`/`useSpring` and never touch React state. Load-in reveals are pure CSS via the `cascade` utility and a `--index` custom property, so they cost nothing on the server-rendered sections.
- **Grain** is a single fixed, `pointer-events-none` plate at `z-50` — never inside a scrolling container.

## Product photography

Studio renders live in the repo root as source (`threelayer.jpeg`, `topoftin.jpeg`, `xray.jpeg`). They ship on a near-white studio backdrop (`#f1f0ee`), which shows as a grey square against the page, so the background is **keyed out** rather than used as-is:

```bash
magick threelayer.jpeg \
  \( +clone -colorspace gray -level 78%,95% -negate \) \
  -alpha off -compose CopyOpacity -composite \
  -trim +repage -resize 1400x1400\> public/three-layer.png
```

The luminance ramp (78–95%) is the important part: a hard `-fuzz` key clips the soft contact shadows, while the ramp keeps them as a gradient and leaves the product's specular highlights opaque. Re-run it for any new render.

## Brand assets

The supplied emblem (`ICE_TINS_emblem_logo_2K_202608051901.jpeg`) is a circular badge on a white JPEG background, which cannot sit on a dark page as-is. It is processed into transparent PNGs committed under `public/`:

| Asset | Source | Used by |
| --- | --- | --- |
| `logo-emblem-{256,512,1024}.png` | full badge, white keyed out, circular alpha | footer lockup (52px), OG image |
| `logo-compact-{128,256,512}.png` | inner reticle only | nav lockup (30px), favicon |
| `src/app/icon.png` | compact @256 | favicon, auto-detected by Next |
| `src/app/opengraph-image.png` / `twitter-image.png` | composed 1200×630 | link previews, auto-detected |

The full badge's ring text is illegible under ~44px, so [brand-mark.tsx](src/components/brand-mark.tsx) swaps to the compact reticle below that threshold automatically. Regenerate from the source JPEG if the logo changes.

**Naming**: the badge reads *Ice Tins Supply Co.*, so the wordmark, footer and metadata use that. The domain stays icetins.com.

## Structure

Server components by default; interactivity is isolated to leaves.

```
src/app/
  layout.tsx          fonts, metadata, OG
  page.tsx            section composition
  api/notify/route.ts drop-list signup
src/components/
  frost-field.tsx     drifting mesh background + grain          (server)
  splatter.tsx        gooey ice splash + loose spray            (server)
  brand-mark.tsx      emblem + wordmark lockup                  (server)
  site-nav.tsx        glass pill nav, full-screen mobile menu   (client)
  hero.tsx            3-child grid so the object stays above    (server)
    puck-stage.tsx    the fold on mobile — tilt + float         (client)
  ticker.tsx          seamless marquee band                     (client)
  cold-system.tsx     the core feature: freeze / seat / carry   (server)
    core-stage.tsx    floating core + breathing splash          (client)
  collection.tsx      asymmetric bento of four finishes         (server)
    finish-card.tsx   spotlight border, per-finish splash       (client)
    add-button.tsx    shared idle/adding/added cycle            (client)
  anatomy.tsx         sticky cutaway + divided layer notes      (server)
  facts.tsx           test-result rows, no card containers      (server)
  carriers.tsx        snap-scroll testimonial rail              (client)
  drop.tsx            signup with loading/error/success         (client)
  site-footer.tsx     nav columns + compliance copy             (server)
```

## Interaction states

Wired, not decorative:

- **Add to bag** — idle → spinner → "In bag" → reverts after 2.6s. Shared by the finish cards and the Chillcore three-pack.
- **Sold out** (Whiteout) — desaturated product, disabled control, swaps to "Notify me".
- **Drop signup** — posts to `/api/notify`, which returns real `400` (empty / malformed), `409` (already subscribed) and `200` responses. Errors render inline under the input with `aria-invalid` and `role="alert"`; success replaces the form with a queue position.

## Compliance

There is no age gate — the product is an empty metal case. The footer states that no nicotine or tobacco is sold or shipped; keep that line if the storefront goes live in regulated markets.

## Buying flow

Cart state lives in [cart-context.tsx](src/components/cart/cart-context.tsx) — a client provider in the root layout, persisted to `localStorage` under `icetins:cart`, with a `ready` flag so SSR and first paint agree before the stored bag applies. Lines store only `{id, qty}`; names, prices and art join from [catalog.ts](src/lib/catalog.ts) at read time, so a price change never strands a stale cart. **Money is in cents everywhere.**

```
Add to bag ─→ drawer ─→ /checkout ─→ POST /api/checkout ─→ Stripe Checkout (hosted)
                                            │                      │
                                    reprices from catalogue,   customer pays
                                    checks allocation,             │
                                    creates Session         ┌──────┴──────┐
                                                            ▼             ▼
                                              /checkout/success    POST /api/webhooks/stripe
                                              (display only)       (fulfilment — authoritative)
```

### Two rules this is built around

**Never trust a client total.** [/api/checkout](src/app/api/checkout/route.ts) takes only `{id, qty}` pairs, rebuilds the basket from the catalogue, recomputes shipping, checks the Drop 01 allocation, and charges Stripe from *those* numbers.

**Never fulfil on a redirect.** A shopper can close the tab before `/checkout/success` loads, so the success page is display-only — it retrieves the session and renders it. Stock is decremented in [the webhook](src/app/api/webhooks/stripe/route.ts), which verifies the Stripe signature against the **raw** body and is idempotent on session id, because Stripe retries until it gets a 2xx.

The bag is cleared on the success page, not before the redirect — backing out of Stripe leaves it intact.

### Environment

Copy `.env.example` to `.env.local`:

| Variable | Where it comes from |
| --- | --- |
| `STRIPE_SECRET_KEY` | Dashboard → Developers → API keys (`sk_test_…`) |
| `STRIPE_WEBHOOK_SECRET` | `stripe listen` locally, or the endpoint's signing secret in production |
| `NEXT_PUBLIC_SITE_URL` | Optional; inferred from request headers when unset |

Locally, forward events so fulfilment fires:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Test cards: `4242 4242 4242 4242` succeeds, `4000 0000 0000 9995` is declined, `4000 0025 0000 3155` forces a 3DS challenge.

Without keys the routes return a clear `503` rather than crashing, so the site still runs and demos.

## Not yet built

Order persistence and transactional email (the webhook has the hook for both), a durable stock store — [stock.ts](src/lib/stock.ts) is an in-memory `Map`, so it resets on restart and two instances would oversell — and a real provider behind `/api/notify`.
