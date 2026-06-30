# KAWAI Piano - Payload CMS Development Guide

You are an expert Payload CMS developer working on KAWAI, a production-grade piano retail platform built on Next.js 15 + Payload CMS 3.x + MongoDB Atlas + Cloudflare R2.

## Environment

- **Runtime**: Bun (mandatory — never use npm/yarn/pnpm)
- **Framework**: Next.js 15.x with App Router + Turbopack (`next dev --turbo`)
- **CMS**: Payload CMS 3.x (co-located in the same Next.js app)
- **Database**: MongoDB Atlas (mongoose adapter, IPv4 forced, minPoolSize: 1)
- **Storage**: Cloudflare R2 (S3-compatible, `forcePathStyle: true`)

### Commands

| Command | Purpose |
|---------|---------|
| `bun run dev` | Dev server (Turbopack) |
| `bun run build` | Production build + type generation |
| `bun run start` | Production server |
| `bun run lint` | ESLint + TypeScript |
| `bun run payload generate:importmap` | Regenerate admin import map after adding/moving admin components |
| `bun run seed` | Seed database (`PAYLOAD_SEED=true`) |

---

## Project Architecture

### Route Structure

```
src/app/
├── (frontend)/
│   ├── page.tsx
│   ├── pianos/         ← [category] handles BOTH category pages AND Shopify collection handles
│   ├── products/[slug]/
│   ├── store/[storeslug]/
│   │   ├── page.tsx
│   │   ├── signature/, signature2/
│   │   ├── university/
│   │   ├── gl-10-signature/
│   │   └── sk-experience/
│   ├── blog/[slug]/
│   ├── artists/[slug]/
│   ├── find-a-dealer/[slug]/
│   ├── concert-artist/
│   ├── namm-2026/
│   └── [...slug]/
└── (payload)/
    └── admin/, api/
```

**`pianos/[category]` is dual-purpose**: `isValidCategory(category)` → category page; else → `getCollectionByHandle(handle)` → Shopify collection page or 404. `generateStaticParams` at `src/app/(frontend)/pianos/[category]/page.tsx` includes BOTH `getCategorySlugs()` AND `getAllCollectionHandles()` — always keep both when modifying that file.

### Collections (15 total, in `src/collections/`)

**System**: `Users`, `Media`

**Pages**: `Pages` (general CMS pages, catch-all route), `HomePage` (singleton), `PianosPage` (singleton), `ConcertArtistPage` (singleton)

**Content**: `Storefronts` (dealer location pages), `Posts` (blog), `Categories` (post categories), `Artists`

**Commerce**: `Products` (piano models + accessories), `Collections` (Shopify-synced product collections)

**Business**: `Dealers` (dealer directory for `/find-a-dealer`)

**Integrations**: `ConstantContactSettings`, `ConstantContactCustomFields`

**Search**: `search` (auto-created by `@payloadcms/plugin-search`, indexes storefronts + products + pages)

### Plugins Active

- `@payloadcms/plugin-search` — indexes storefronts, products, pages with denormalized fields
- `@payloadcms/plugin-import-export` — bulk import/export
- `@payloadcms/storage-s3` — Cloudflare R2 for Media collection
- `pianosPageSeedPlugin` — seeds PianosPage initial data

**Search plugin + new collections**: Add new collections to the plugin's `collections` array normally. Exception: `storefronts` uses `skipSync: true` + a manual `afterChange` hook due to a plugin bug with polymorphic query parsing. Don't apply `skipSync` to other collections unless you hit the same error.

### Block Categories (`src/blocks/`)

Blocks are registered globally in `payload.config.ts` and referenced by slug in collections.

| Category | Prefix | Examples |
|----------|--------|---------|
| `content/` | `content-*` | Text, Image, Video, Code, Banner |
| `layout/` | `layout-*` | Columns, Spacer, HeroCarousel, VideoBackground, SideNavigation, CalendlyEmbed, BookingModal |
| `marketing/` | `marketing-*` | Hero, GrandHero, CallToAction, Testimonials, FindADealer, ContactForm, FeaturedModels, and more |
| `events/` | `events-*` | UniversityHero, EventOverview |
| `product/` | `product-*` | ProductHero, ProductDescription, Specifications, CollectionShowcase, FloatingAddToCart, and more |
| Legacy (root) | — | TextContent, Archive, Content, MediaBlock, Cta (backward compat) |

---

## Performance Patterns

### 1. globalThis Payload Singleton (HMR-safe)

Module-level caches are destroyed on every hot reload in dev, forcing a new Atlas TLS handshake (~2–4s). Anchor the instance to `globalThis` to survive HMR.

The canonical implementation lives in `src/lib/payload/queries.ts` as `getPayloadClient()`. **Always use `getPayloadClient()` — never call `getPayload({ config })` directly in page files.**

### 2. `unstable_cache` for Server Component Queries

Wrap Payload queries in `unstable_cache` to cache across requests and enable tag-based on-demand revalidation.

```typescript
function getDealerBySlug(slug: string) {
  return unstable_cache(
    async () => { /* payload.find(...) */ },
    [`storefront-${slug}`],
    { tags: [`storefront-${slug}`, 'storefronts'], revalidate: 3600 }
  )()
}
```

**Type annotation gotcha**: Inline `Promise<{ ... } | null>` inside `unstable_cache` throws a parse error — extract to a named type alias before the function.

### 3. Cache Tag Naming Convention

| Data | Tag(s) |
|------|--------|
| Homepage | `home-page` |
| Piano catalog page | `pianos-page` |
| All storefronts | `storefronts` |
| One storefront | `storefront-{slug}` |
| All products | `products` |
| One product | `product-{slug}` |
| Blog posts | `posts` |
| Artists | `artists` |
| Dealers | `dealers` |

Tag keys must be **globally unique** — collisions cause unrelated caches to invalidate together.

### 4. Depth Rules

| Situation | `depth` | Reason |
|-----------|---------|--------|
| `generateStaticParams` / slug lists | `0` | Only IDs needed, no population |
| List queries (cards, grids) | `1` | Populate one level (e.g. featured image) |
| Pages/singletons with blocks + Media | `1` | ⚠️ See depth trap below — Media has no relationships |
| Products / storefronts with nested docs | `2` | Justified only when referenced docs themselves have relationships |
| Storefronts (complex nested data) | `3` | Explicitly justified in `queries.ts` |

**Never use `depth: 3` or higher without justification** — each level multiplies MongoDB lookups recursively. Always use `depth: 1` for `home-page` and `pianos-page` (see depth:2 gotcha below).

### 5. Always `select` on Bulk Queries

```typescript
// ❌ Fetches entire document including all block content
await payload.find({ collection: 'dealers', limit: 1000 })

// ✅ Only fetch fields you use
await payload.find({
  collection: 'dealers',
  where: { isActive: { equals: true } },
  select: { dealerName: true, slug: true, coordinates: true, contactInfo: true },
  depth: 0,
  limit: 1000,
})
```

### 6. ISR Pattern for Dynamic Pages

For pages with `generateStaticParams`, use `revalidate` + on-demand `revalidateTag` (via `/api/revalidate`):

```typescript
// src/app/(frontend)/products/[slug]/page.tsx
export const revalidate = 3600  // Fallback: rebuild every hour

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'products',
    select: { slug: true },  // Only slug needed
    depth: 0,
    limit: 1000,
  })
  return result.docs.map(d => ({ slug: d.slug }))
}
```

### 7. Import Map

Run `bun run payload generate:importmap` after adding or moving admin components (`autoGenerate: false` in `payload.config.ts`).

### 8. Layout Architecture — Never Call `headers()` in `(frontend)/layout.tsx`

Calling `headers()` (or `cookies()`) in `src/app/(frontend)/layout.tsx` forces the entire frontend route tree into dynamic rendering — Cloudflare returns `BYPASS` for every page. Use `usePathname()` in a client shell component instead (see `NammAwareShell`). Wrap data-fetching layout components in `<Suspense fallback={null}>`.

### 9. Cloudflare Edge Caching

**BYPASS instead of HIT**: Next.js RSC adds `Vary: RSC, Next-Router-State-Tree, ...` — Cloudflare refuses to cache these. Fix in dashboard (not code): Cloudflare → Caching → Cache Rules → add those headers to the Cache Key.

---

## TypeScript Best Practices

`strict`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess` are all enabled. Array access returns `T | undefined` — always use `?.` or `?? default`.

### Null Safety Patterns

Relationship fields (e.g. `featuredImage`) type as `Media | string | null` — use a type guard:
```typescript
function isMediaObject(media: Media | string | null): media is Media {
  return typeof media === 'object' && media !== null && 'url' in media
}
```

Array access always returns `T | undefined` (`noUncheckedIndexedAccess`) — use `items[0]?.name ?? 'Default'`.

### Path Aliases

```typescript
import type { Product, Media } from '@/payload-types'   // Generated types
import { cn, formatPrice } from '@/lib/utils'
import { imageField } from '@/lib/payload/fields'
import { anyone, authenticated, adminOnly } from '@/lib/payload/access'
```

---

## Security Patterns

### 1. Local API Access Control

```typescript
// ❌ SECURITY BUG — user param is ignored, runs as admin
await payload.find({ collection: 'products', user: someUser })

// ✅ Enforces user permissions
await payload.find({ collection: 'products', user: someUser, overrideAccess: false })

// ✅ Intentional admin bypass (no user)
await payload.find({ collection: 'products' })
```

**Rule**: Always set `overrideAccess: false` when passing `user` to Local API.

### 2. Transaction Safety in Hooks

Always pass `req` to nested Payload operations inside hooks — without it, the operation runs in a separate transaction. Use `context.skipHook: true` to prevent infinite hook loops.

### 3. Access Control Functions

Located in `src/lib/payload/access/index.ts`:

```typescript
export const anyone: Access = () => true
export const authenticated: Access = ({ req: { user } }) => Boolean(user)
export const adminOnly: Access = ({ req: { user } }) => user?.role === 'admin'
export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }  // Note: _status (with underscore) for versioned collections
}
```

### Collection Access Matrix

| Collection | Create | Read | Update | Delete |
|------------|--------|------|--------|--------|
| Users | adminOnly | authenticated | adminOnly | adminOnly |
| Media | authenticated | anyone | authenticated | authenticated |
| Products | authenticated | anyone | authenticated | adminOnly |
| Storefronts | authenticated | anyone | authenticated | adminOnly |
| Posts | authenticated | authenticatedOrPublished | authenticated | adminOnly |
| Artists | authenticated | anyone | authenticated | adminOnly |
| Dealers | authenticated | anyone | authenticated | adminOnly |

---

## HTTP Security Architecture

All security lives in three files. Touch only the relevant one:

| What you need to do | File |
|---|---|
| Add a new third-party domain (script, image, frame, etc.) | `src/lib/csp.ts` |
| Change HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy | `next.config.ts` → `headers()` |
| Change Payload-level security (maxDepth, graphQL, serverURL) | `src/payload.config.ts` |
| Change login brute-force protection or cookie settings | `src/collections/Users.ts` → `auth:` |
| Add a new route-level guard (block unauthenticated access to an API route) | `src/middleware.ts` |

### Content Security Policy — `src/lib/csp.ts`

Structured TypeScript object — one array per directive. Add a new third-party domain to the right array. `'unsafe-eval'` is added to `script-src` automatically in dev only. The admin panel (`/admin/*`) uses a separate `ADMIN_CSP` constant — don't tighten it.

### Payload-level hardening — `src/payload.config.ts`

`serverURL` anchors CSRF; `maxDepth: 3` caps recursive lookup abuse; `graphQL: { disable: true }` in prod kills the playground. No `cors:` or `csrf:` arrays — co-located app, adding them breaks admin auth.

### Login protection — `src/collections/Users.ts`

`maxLoginAttempts: 5`, `lockTime: 1hr`, `cookies.secure` in prod.

### Route guards — `src/middleware.ts`

`/api/access` is blocked for unauthenticated requests (exposes full schema). Any new route guard must also be added to the middleware matcher array.

---

## Collection Patterns

### Media Field Factories (`src/lib/payload/fields/`)

**Never manually create `type: 'upload'` fields.** Always use these factories — they wire in the custom MediaSelectorButton admin component:

```typescript
import { imageField, videoField, mediaField, mediaArrayField } from '@/lib/payload/fields'

imageField('featuredImage', { required: true, admin: { description: 'Hero image (1920x1080px)' } })
videoField('demoVideo')
mediaField('attachment')
mediaArrayField('gallery', { maxRows: 12 })
```

### Collection Template

```typescript
import type { CollectionConfig } from 'payload'
import { imageField } from '@/lib/payload/fields'
import { anyone, authenticated, adminOnly } from '@/lib/payload/access'

export const MyCollection: CollectionConfig = {
  slug: 'my-collection',
  admin: { useAsTitle: 'name', group: 'Content', defaultColumns: ['name', 'status', 'updatedAt'] },
  access: { create: authenticated, read: anyone, update: authenticated, delete: adminOnly },
  hooks: { afterChange: [revalidateMyPage] },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true, index: true },  // Always index slug
    { name: 'status', type: 'select', options: ['active', 'draft'], index: true },
    imageField('featuredImage', { required: true }),
  ],
}
```

### Adding New Blocks

1. Create `src/blocks/{category}/YourBlock.ts`
2. Use slug `{category}-{name}`, interfaceName `{Category}{Name}Block`
3. Update barrel export `src/blocks/{category}/index.ts`
4. Import and add to `blocks` array in `src/payload.config.ts`
5. Reference in collections via `blockReferences: ['category-name']`

---

## Hooks: On-Demand Revalidation

`afterChange` hooks POST to `/api/revalidate` to bust the Next.js Data Cache.

**Canonical pattern** (copy for every new collection):
```typescript
const revalidateMyPage = async ({ doc }: { doc: MyType }) => {
  fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: process.env.REVALIDATION_SECRET, tag: `my-collection-${doc.slug}` }),
  }).catch(err => console.error('Revalidation failed:', err))
  return doc
}
```

Rules: pass `req` to nested operations, guard with `context.skipHook`, fire-and-forget (never `await` the fetch), always return `doc`.

---

## Component Organization

### Hierarchy

1. `src/components/ui/` — Shared UI primitives (Button, Card, Dialog, FormField, FormAlert, Modal)
2. `src/components/{domain}/` — Domain components (piano/, forms/, layout/, homepage/, namm/, etc.)
3. `page/_components/` — Only for truly page-specific, non-reusable components

**Never duplicate components into page-local folders.** Always import from `@/components/ui`.

### Forms & Modals

Use shared primitives: `Modal`, `FormField`, `FormAlert` from `@/components/ui/`, `useModal` from `@/hooks`. Never build one-off form/modal patterns in page files.

### NavigationContext — Dealer Location System

`src/contexts/NavigationContext.tsx` tracks whether a user entered via a dealer storefront (`/store/st-louis`) or the main site (`/`). The logo, nav links, and back buttons use this to return users to their origin.

**Key facts:**
- `origin.isDealerLocation` is always `false` on the server — it's only populated client-side from `sessionStorage` in a `useEffect`
- `isInitialized` is `false` on first render (server + initial client), becomes `true` after the `useEffect` fires
- The sessionStorage key is `kawai-navigation-origin`

**Critical: hydration mismatch guard**

Any component that conditionally renders based on `origin.isDealerLocation` MUST use a `mounted` guard to match SSR output:

```tsx
const { origin, isInitialized } = useNavigationContext()
const [mounted, setMounted] = useState(false)
useEffect(() => { setMounted(true) }, [])

// ❌ Renders differently on server vs client if user visited a storefront before
const isDealerPage = origin.isDealerLocation

// ✅ Server and initial client both get false; switches after mount
const isDealerPage = mounted && origin.isDealerLocation
```

This pattern is already applied in `KawaiLogo` — follow it for any new component using `origin.isDealerLocation`.

---

## Accessibility (WCAG 2.1 AA)

The site is held to WCAG 2.1 **Level AA** (ADA matter). These conventions prevent the regressions that an audit flags — follow them when adding pages, blocks, or form controls.

### Headings — exactly one `<h1>` per page, no skipped levels

- **Every page needs exactly one `<h1>`.** Block-rendered/CMS templates (`pianos/page.tsx`, `artists/page.tsx`, `store/[storeslug]/page.tsx`) must render an explicit page `h1` themselves — `RenderBlocks` only promotes the **index-0 block of specific types** (`layout-hero-carousel`, `product-hero`, `product-hero-carousel`, `marketing-dealer-map`) to `h1` via `headingLevel: index === 0 ? 'h1' : 'h2'`. If the top block isn't one of those, add a `<h1 className="sr-only">{title}</h1>` in the template.
- **Shared/reused section components must accept a `headingLevel` prop — never hardcode `<h1>`.** A component used both as a standalone page and as an embedded block will emit duplicate `h1`s otherwise. Canonical examples: `DealerMapBlock → DealerFinderClient → DealerFinderMobile`, and `FeaturedCollectionsCarousel`. New hero-type blocks must opt into the `RenderBlocks` `headingLevel` wiring.
- **List/card item names are NOT headings.** Dealer names, product-card titles, etc. render as `<div>`/`<span>`, not `<h2>` — hundreds of item headings destroy screen-reader heading navigation.
- **Rich-text bodies never emit an `h1`.** `RichTextContentBlock` installs a Lexical `heading` converter that demotes in-body `h1→h2` (a body block always sits under the page `h1`). FAQ answers normalize via a heading-offset (`makeAnswerConverters`). Don't revert these.
- **Global/footer section headings are `h2`** (footer columns, "Stay Connected"). They were `h3` and caused `h1→h3` skips on sparse pages.

### Forms — every control has a programmatic label

Never ship placeholder-only inputs. Every `input`/`select`/`textarea` needs an `aria-label` or an associated `<label>`. Model: the dealer-search field's `aria-label="Search dealers by city or state"`.

### Contrast (1.4.3) — 4.5:1 normal / 3:1 large

- Standard tokens on solid backgrounds already pass. **Text over images/video must have a scrim/overlay guaranteeing 4.5:1** — automated tools can't measure these, so verify visually.
- Brand red on dark backgrounds uses **`kawai-red-400`**, not `kawai-red` (the brand red is only ~3.6:1 on `kawai-black`).

## Media System (Cloudflare R2)

### Usage

```typescript
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'

const imageProps = getImagePropsWithFallback(
  cmsImage,                              // Media | string | null
  '/images/defaults/piano-fallback.jpg', // Fallback
  'hero',                                // Preset: hero | gallery | thumbnail | card
  { priority: true, sizes: '(max-width: 768px) 100vw, 50vw' }
)
return <Image {...imageProps} alt={piano.name} />
```

### R2 Config Notes

- `forcePathStyle: true` — required for Cloudflare R2
- `disablePayloadAccessControl: true` — serves files directly from R2 CDN
- `generateFileURL` constructs `${NEXT_PUBLIC_S3_PUBLIC_URL}/media/{filename}`

---

## Integrations

### `queries.ts` vs `client.ts` — Critical Distinction

**`src/lib/payload/queries.ts`** — Local API (direct MongoDB, server-only). Use `getPayloadClient()` for all server components, RSC, and Server Actions.

**`src/lib/payload/client.ts`** — HTTP REST client (fetch-based). Use ONLY in Client Components. Never call from Server Components — it creates a self-fetch loop.

---

### Server Actions (`src/lib/actions/`)

All lead capture and form submissions use Server Actions with `'use server'` + Zod validation.

| File | Purpose |
|------|---------|
| `contact-form.ts` | Main contact form → Shopify customer upsert |
| `contact-form-with-utm.ts` | Contact form with UTM tracking |
| `simple-customer-signup.ts` | Newsletter/lead signup → Shopify |
| `sync-product-shopify.ts` | Admin action: sync product to Shopify |
| `shopify-navigation.ts` | Fetch mega-menu data server-side |
| `payload-products-navigation.ts` | Fetch product navigation from Payload |

**Lead capture flow** (contact form → CRM):
```
User submits form
  → Server Action (Zod validation)
    → upsertCustomer() in src/lib/shopify/customers.ts
      → Shopify Admin API (customerSet mutation — create OR update in one call)
        → Customer tagged with storefront slug (e.g. "st-louis")
```
Note: Constant Contact was removed from this flow — Shopify is now the single CRM.

---

### Shopify (`src/lib/shopify/`)

**Purpose**: Product catalog sync, customer CRM, cart, navigation mega-menu.

| File | Purpose |
|------|---------|
| `client.ts` | Storefront API (public, no auth) |
| `admin-client.ts` | Admin API (OAuth, server-side only) |
| `customers.ts` | `upsertCustomer()` — creates or updates via `customerSet` mutation |
| `navigation.ts` | Mega menu extraction |
| `sync-to-payload.ts` | Product sync to CMS |

Required env vars: `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_APP_API_KEY`, `SHOPIFY_APP_CLIENT_SECRET`

### Constant Contact (`src/lib/constantcontact/`)

**Legacy** — Shopify is the primary CRM for new leads. CC handles existing list management only. Collections: `ConstantContactSettings` (OAuth tokens), `ConstantContactCustomFields` (field mapping). Admin hooks: `useConstantContact`, `useConstantContactForm`.

### Analytics

**PostHog** — initialized in TWO places (intentional, guarded against double-init):
1. `src/lib/instrumentation-client.ts` — Next.js auto-runs this on client boot (captures exceptions, debug mode)
2. `src/app/providers.tsx` (`PHProvider`) — wraps app in `PostHogProvider` for React hooks

```typescript
// providers.tsx — always guard against double-init from instrumentation-client.ts
if (posthog.__loaded) return  // ← REQUIRED — never remove this guard
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, { ... })
```

Proxied via `/ingest/*` rewrites in `next.config.js` to bypass ad blockers. Required env vars: `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`.

- **Google Analytics**: `NEXT_PUBLIC_GA_ID`
- **Meta Pixel**: `NEXT_PUBLIC_META_PIXEL_ID` — initialized via `<Script strategy="afterInteractive">` in `src/components/MetaPixel.tsx`. Do NOT add a `useEffect` that also calls `fbq('init')` — that causes duplicate pixel warnings.

---

## Styling System

### Overview

This project uses **Tailwind CSS v4** with a CSS-first configuration. There is **no `tailwind.config.js`** — all theme tokens are defined in CSS files using the `@theme` directive.

```
src/app/globals.css          # @theme tokens, @source safelist, base styles (570 lines)
src/styles/brand-components.css   # @utility brand component classes (398 lines)
src/app/(frontend)/styles.css     # Frontend page-specific overrides (165 lines)
```

Campaign-specific CSS files (e.g. `es60-*.css`) live alongside their page components.

### Brand Color Tokens

Defined in `globals.css` under `@theme`. Auto-generates `bg-*`, `text-*`, `border-*` utilities.

| Token | Value | Usage |
|-------|-------|-------|
| `kawai-red` | `#E11922` | Primary CTA, accent, logo color |
| `kawai-black` | `#1E1B16` | Main text, headings |
| `kawai-charcoal` | `#2C2C2C` | Secondary text, UI chrome |
| `kawai-pearl` | `#FAF8F5` | Page backgrounds, cards |
| `kawai-neutral` | `#DBDBDB` | Borders, dividers |
| `kawai-gold` | `#d5c78c` | Shigeru Kawai premium accent |

Each has a full 50–900 scale (`kawai-red-500`, etc.). Campaign-specific tokens use the `es60-` prefix. New colors go in `globals.css` under `@theme` — auto-generates `bg-*`, `text-*`, `border-*` utilities.

**Contrast (WCAG AA):** text needs 4.5:1 (3:1 for large text). Brand `kawai-red` is only ~3.6:1 on `kawai-black` — use `kawai-red-400` for red text on dark. Text over images/video needs a scrim guaranteeing 4.5:1 (not machine-verifiable — check visually). See the Accessibility section.

### Styling Patterns

Use `cn()` from `@/lib/utils` (clsx + twMerge) for conditional classes. Use CVA (`class-variance-authority`) for variant props — brand variant names: `primary`, `secondary`, `ghost`. Complex multi-property brand components go in `src/styles/brand-components.css` as `@utility` classes.

### Critical: `@source inline()` Safelist

Dynamic class names (e.g. `bg-${color}`) won't be generated in production — add them to the `@source inline()` safelist in `globals.css`.

### Critical: CSS File Isolation — Tailwind v4

Every CSS file using `@apply` or `@layer` needs its own `@import "tailwindcss"` at the top. PostCSS compiles files independently — they cannot inherit Tailwind from another file.

`prefers-reduced-motion` is handled globally in `globals.css` — no per-component guards needed.

---

## API Routes

### On-Demand Revalidation

```
POST /api/revalidate
Body: { "secret": "...", "tag": "storefront-st-louis" }
  OR: { "secret": "...", "path": "/products/gx-7" }
```

### Frontend Data APIs

```
GET /api/home-page        → Homepage CMS data
GET /api/pianos-page      → Piano catalog data
GET /api/piano-categories → Category filter data
GET /api/featured-models  → Featured pianos
```

---

## Development Workflow

### Environment Variables

See `.env.example` for the full list. Key groups: `DATABASE_URI`, `PAYLOAD_SECRET`, `S3_*` (R2), `NEXT_PUBLIC_S3_PUBLIC_URL`, `REVALIDATION_SECRET`, `NEXT_PUBLIC_SITE_URL`, `SHOPIFY_*`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_POSTHOG_KEY`.

Access:
- App: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`
- GraphQL: `http://localhost:3000/api/graphql-playground`

---

## Multi-Domain Site Context (cad.kawaius.com)

The site serves two domains from a single Next.js codebase. Middleware detects the domain and sets an `x-site` header on every request.

### How it works

**Middleware** (`src/middleware.ts`):
```typescript
const host = request.headers.get('host') ?? ''
const site = host.startsWith('ca.') ? 'cad' : 'us'
requestHeaders.set('x-site', site)
```

**Utility** (`src/lib/site-context.ts`) — the single source of truth:
```typescript
import { getSite, getSiteName, getSiteUrl, getSiteAlternates } from '@/lib/site-context'
```
- `getSite()` — async, server-only, returns `'us' | 'cad'`
- `getSiteName(site)` — `'Kawai America'` or `'Kawai Canada'`
- `getSiteUrl(site)` — `'https://www.kawaius.com'` or `'https://ca.kawaius.com'`
- `getSiteAlternates(path)` — hreflang object for `alternates.languages` in metadata

### CA Shopify: Pricing & Checkout Only

There are **two separate Shopify stores**: US (`kawaius.myshopify.com`) and CA (`kawai-canada.myshopify.com`).

**Architectural rule**: All product content (descriptions, images, product structure, metafields) lives in US Shopify / Payload CMS. The CA Shopify store is used **exclusively for CAD pricing display and CA checkout**. No content is replicated to CA Shopify.

When on `ca.kawaius.com`, `BlockRenderer` calls `getProductByModel(model, 'cad')` which:
1. Uses the US Admin API to resolve `custom.model` → product handle (US has "use as identifier" set on the metafield)
2. Uses the CA Admin API to fetch the product by that handle, returning CA pricing

Cart functions (`src/lib/shopify/cart.ts`) auto-detect the site from `window.location.hostname` and route to the correct Shopify Storefront API — no prop threading required. localStorage cart keys are namespaced (`kawai_shopify_cart_id` for US, `kawai_shopify_cart_id_ca` for CA) so carts never bleed across stores.

**Why two-step CA product lookup?** Shopify's `productByIdentifier(customId: ...)` requires the metafield definition to have a "use as identifier" flag set in Shopify Admin. The CA store was created without this flag. Instead of `productByIdentifier` on CA, we use `productByHandle` — which has no such requirement — with the handle resolved first via the US store.

### Patterns

**Server Components** — call `getSite()` directly:
```typescript
const site = await getSite()
if (site === 'cad') { /* Canada-specific logic */ }
```

**Already-fetched headers** (e.g. inside `HeaderDynamic` which fetches `headers()` at the top) — read directly, don't call `getSite()`:
```typescript
const site = headersList.get('x-site') ?? 'us'
```

**Client Components** — cannot use `getSite()`. Create a thin server wrapper that reads `getSite()` and passes `site` as a prop. See `src/components/blocks/ProductHeroBlockWrapper.tsx` as the pattern.

```typescript
// Server wrapper pattern (ProductHeroBlockWrapper.tsx)
export async function ProductHeroBlockWrapper(props: Props) {
  const site = await getSite()  // 'us' | 'cad'
  return <ProductHeroBlock {...props} site={site} />
}

// Client component receives site prop
function ProductHeroBlock({ site = 'us', ...props }) {
  // Use site === 'cad' for Canada-specific conditional logic
}
```

**Cart functions are site-aware automatically** — all exported functions detect site from `window.location.hostname` internally. No prop threading needed.

### What's already implemented

| Feature | File | What changes on CA domain |
|---------|------|--------------------------|
| Page title suffix | `src/app/layout.tsx` | "Kawai Canada" instead of "Kawai America" |
| hreflang + canonical | All `generateMetadata` in `(frontend)/` | `en-CA` / `en-US` alternates |
| Sitemap | `src/app/sitemap.ts` | Domain-aware base URL + alternates |
| Robots.txt | `src/app/robots.ts` | Points to correct domain's sitemap |
| Product Hero | `src/components/blocks/ProductHeroBlockWrapper.tsx` | Shows CA price from CA Shopify + CA checkout cart |
| Header branding | `src/components/layout/header-dynamic.tsx` | Shows "Canada Music" in logo |
| Cart routing | `src/lib/shopify/cart.ts` | All cart operations use CA Storefront API |
| Cart storage | `src/lib/shopify/cart-storage.ts` | localStorage keyed `_ca` suffix, separate from US cart |

### Adding new Canada-specific behavior

For server components, it's one check:
```typescript
const site = await getSite()
if (site === 'cad') { /* Canada-specific */ }
```

For client components, follow the `ProductHeroBlockWrapper` pattern — server wrapper passes `site` prop down. Use `site === 'cad'` rather than an `isCanada` boolean.

### Adding hreflang to a new page

Every new page in `(frontend)/` needs `generateMetadata` with `getSiteAlternates('/your-path')`. Without this, the new page breaks `en-CA`/`en-US` alternates. See any existing page for the pattern.

---

## Common Gotchas

| Gotcha | Detail |
|--------|--------|
| **`force-dynamic` cancels `revalidate`** | Use one or the other — never both on the same page |
| **`depth: 3+` causes recursive MongoDB lookups** | Always use the lowest depth that satisfies the query |
| **Local API bypasses access control** | Set `overrideAccess: false` whenever passing `user` |
| **Missing `req` in hook operations** | Breaks transaction atomicity — always pass `req` |
| **Hook infinite loops** | Guard with context flags (`context.skipHook`) |
| **`_status` vs `status`** | Versioned collections use `_status` (with underscore) |
| **Import map not regenerated** | Run `bun run payload generate:importmap` after adding admin components |
| **`unstable_cache` key collisions** | Keys are global — always namespace them (e.g. `header-storefront-{slug}`) |
| **npm instead of bun** | Always use `bun` — npm causes dependency conflicts |
| **Top-level `console.log` in payload.config.ts** | Runs on every worker spawn — use sparingly |
| **`searchPlugin` + `storefronts`** | Storefronts use `skipSync: true` and a manual afterChange hook — the search plugin has a bug with polymorphic query parsing on the storefronts collection |
| **`origin.isDealerLocation` in render** | Always gate on `mounted` state — server always renders `false`, client reads from sessionStorage. Skipping the guard causes React hydration error #418 |
| **PostHog double-init** | `instrumentation-client.ts` auto-runs on client boot. `PHProvider` must check `if (posthog.__loaded) return` before calling `posthog.init()` |
| **Meta Pixel duplicate** | `MetaPixel.tsx` uses `<Script>` for init — never add a `useEffect` that also calls `fbq('init')`. The Script is the single init point |
| **`client.ts` in Server Components** | `src/lib/payload/client.ts` uses `fetch()` — calling it from a Server Component creates a self-fetch HTTP loop. Use `queries.ts` instead |
| **Constant Contact is legacy** | New lead capture uses Shopify via `src/lib/actions/contact-form.ts`. CC integration still exists for list management but is not the primary CRM |
| **`headers()` in `(frontend)/layout.tsx`** | Any call to `headers()` or `cookies()` in the frontend layout forces every page dynamic — Cloudflare returns `BYPASS`. Use `usePathname()` in a client shell component instead (see `NammAwareShell`) |
| **Cloudflare BYPASS vs DYNAMIC** | `BYPASS` = cache rule fired but refused due to `Vary` header containing RSC headers. Fix: add RSC variant headers to Cloudflare Cache Key in dashboard. Not a code change. |
| **PPR requires Next.js canary** | `experimental.ppr` throws a hard build error on stable Next.js 15.x. Do not add it until upgrading to canary. Suspense boundaries are still correct prep work. |
| **`unstable_cache` inline type annotation** | `async (): Promise<{ field: string } \| null>` inside an `unstable_cache` argument fails to parse with "Expected ',', got ':'". Extract to a named type alias before the function. |
| **`depth: 2` on block-heavy singletons** | On `home-page` / `pianos-page` with 15+ blocks × 3 images: depth:2 fires 45–90 wasted MongoDB roundtrips (round 2 inspects Media docs that have no relationships). Use `depth: 1`. |
| **YouTube iframe cycling** | Auto-rotating carousels using `AnimatePresence` + `setInterval` remount the YouTube player every rotation. Pause the interval when the current slide has a `videoId` to prevent full player destruction/recreation. |
| **Tailwind v4 CSS file isolation** | Each CSS file using `@apply` or `@layer` must have its own `@import "tailwindcss"`. Files cannot inherit Tailwind from another file — PostCSS compiles them independently. Missing import = build error "Cannot apply unknown utility class". |
| **CA `productByIdentifier` limitation** | Shopify's `productByIdentifier(customId: ...)` requires the metafield definition to have "use as identifier" enabled in Shopify Admin. The CA store was created without this. CA product lookup uses a two-step approach: US Admin API resolves model→handle, CA Admin API fetches by handle via `productByHandle`. |
| **CA cart auto-detection** | Cart functions in `cart.ts` and `cart-storage.ts` detect site from `window.location.hostname` internally — no `site` prop threading to callers. US cart key: `kawai_shopify_cart_id`. CA cart key: `kawai_shopify_cart_id_ca`. |
| **CA `site` prop, not `isCanada`** | Client components use `site?: 'us' \| 'cad'` prop (not a boolean `isCanada`). Server wrappers read `getSite()` and pass it down. The `'cad'` value is the discriminant — compare with `site === 'cad'`. |
| **Placeholder ≠ label** | A `placeholder` is not an accessible name. Every form control needs `aria-label` or `<label>` (WCAG 1.3.1/3.3.2/4.1.2). See Accessibility section. |
| **Hardcoded `<h1>` in shared components** | A component reused as both a page and an embedded block emits duplicate `h1`s. Thread a `headingLevel` prop instead (e.g. `DealerFinderClient`, `FeaturedCollectionsCarousel`). |
| **Block-rendered pages missing an `h1`** | `RenderBlocks` only promotes index-0 of specific block types to `h1`. CMS/block templates (`/pianos`, `/artists`, `/store/*`) must add their own `<h1 className="sr-only">`. |
| **Footer/global headings are `h2`** | Footer columns and "Stay Connected" are `h2`, not `h3` — as `h3` they caused `h1→h3` skips on sparse pages (FAQ, etc.). |

---

## Business Context

**KAWAI** is a unified platform for Kawai Piano Corporation — piano retail, dealer management, lead generation, and content marketing. Product lines: Digital (CA/CN/ES/KDP), Hybrid (Novus/AnyTime), Grand (SK/GX/GL), Upright (K/ND).

Payload Docs: https://payloadcms.com/docs
