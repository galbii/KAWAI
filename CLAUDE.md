# KAWAI Piano - Payload CMS Development Guide

You are an expert Payload CMS developer working on KAWAI, a production-grade piano retail platform built on Next.js 15 + Payload CMS 3.x + MongoDB Atlas + Cloudflare R2.

## Environment

- **Runtime**: Bun (mandatory — never use npm/yarn/pnpm)
- **Framework**: Next.js 15.4 with App Router + Turbopack (`next dev --turbo`)
- **CMS**: Payload CMS 3.52 (co-located in the same Next.js app)
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

**Always run `bun run build` before considering code complete.**

---

## Project Architecture

### Route Structure

```
src/app/
├── (frontend)/                      # Public website (Next.js routes)
│   ├── page.tsx                     # Homepage (/)
│   ├── pianos/                      # Piano catalog (/pianos, /pianos/[category])
│   ├── products/[slug]/             # Product pages (ISR, revalidate: 3600)
│   ├── store/[storeslug]/           # Dealer storefronts (/store/st-louis)
│   │   ├── page.tsx                 # Main storefront page
│   │   ├── signature/, signature2/  # Premium experience pages
│   │   ├── university/              # University event pages
│   │   ├── gl-10-signature/         # GL-10 product experience
│   │   └── sk-experience/           # SK experience page
│   ├── blog/[slug]/                 # Blog posts
│   ├── artists/[slug]/              # Artist pages
│   ├── find-a-dealer/[slug]/        # Dealer detail pages
│   ├── concert-artist/              # Concert Artist CA page
│   ├── namm-2026/                   # NAMM event pages
│   └── [...slug]/                   # Catch-all (Pages collection)
└── (payload)/                       # Payload Admin + REST + GraphQL APIs
    └── admin/, api/
```

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
- `payloadCloudPlugin` — **currently disabled** (S3 plugin conflict)

### Block Categories (`src/blocks/`)

Blocks are registered globally in `payload.config.ts` and referenced by slug in collections.

| Category | Prefix | Examples |
|----------|--------|---------|
| `content/` | `content-*` | Text, Image, Video, Code, Banner |
| `layout/` | `layout-*` | Columns, Spacer, Divider, HeroCarousel, VideoBackground, BrandIntro, BottomLeftPopup, SideNavigation, CalendlyEmbed, BookingModal |
| `marketing/` | `marketing-*` | Hero, GrandHero, CallToAction, Testimonials, InstrumentalToLife, TechnicalShowcase, FindADealer, ThreeDViewer, InstagramCarousel, ArtistCarousel, HomePageHero, Showroom, PianoCollection, PianoGallery, NewsCarousel, ContactForm, StorefrontLocations, FeaturedModels |
| `events/` | `events-*` | UniversityHero, EventOverview |
| `product/` | `product-*` | ProductShowcase, ProductHero, ProductDescription, ImageGallery, FeaturesList, Specifications, TechnicalSpecifications, CollectionShowcase, FloatingAddToCart, ProductFeatureSlides |
| Legacy (root) | — | TextContent, Hello, Archive, Content, MediaBlock, Cta (keep for backward compat) |

---

## Performance Patterns

### 1. globalThis Payload Singleton (HMR-safe)

Module-level caches are destroyed on every hot reload in dev, forcing a new Atlas TLS handshake (~2–4s). Anchor the instance to `globalThis` to survive HMR.

**Canonical pattern** (`src/lib/payload/queries.ts`):

```typescript
import 'server-only'
import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '@/payload.config'

declare global {
  // eslint-disable-next-line no-var
  var __payloadInstance: Promise<Payload> | undefined
}

async function getPayloadClient(): Promise<Payload> {
  if (process.env.NODE_ENV === 'development') {
    if (!globalThis.__payloadInstance) {
      globalThis.__payloadInstance = getPayload({ config })
    }
    return globalThis.__payloadInstance
  }
  return getPayload({ config }) // Production: internal module cache is sufficient
}
```

**Use this function** for all server-side queries in `src/lib/payload/queries.ts`. Do not call `getPayload({ config })` directly in page files.

### 2. `unstable_cache` for Server Component Queries

Wrap Payload queries in `unstable_cache` to cache across requests and enable tag-based on-demand revalidation.

**Per-call pattern** (when cache key depends on arguments):

```typescript
// src/components/layout/header-dynamic.tsx
function getDealerLocationBySlug(slug: string) {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config })
      const result = await payload.find({
        collection: 'storefronts',
        where: { slug: { equals: slug }, isActive: { equals: true } },
        limit: 1,
        select: { locationName: true, slug: true },  // Always select only needed fields
      })
      return result.docs[0] ?? null
    },
    [`header-storefront-${slug}`],                         // Unique key array
    { tags: [`storefront-${slug}`, 'storefronts'], revalidate: 3600 }
  )()
}
```

**Module-level pattern** (for queries with no dynamic args):

```typescript
const getHomePageNewsItems = unstable_cache(
  async () => { /* ... */ },
  ['header-news-items'],
  { tags: ['home-page'], revalidate: 300 }
)
```

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
| Detail pages with nested media | `2` | Max for most cases |
| Storefronts (complex nested data) | `3` | Explicitly justified in `queries.ts` |

**Never use `depth: 3` or higher without justification** — each level multiplies MongoDB lookups recursively.

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

### 7. CRITICAL: `force-dynamic` Cancels `revalidate`

```typescript
// ❌ WRONG — force-dynamic disables all caching, revalidate is ignored
export const dynamic = 'force-dynamic'
export const revalidate = 3600  // This does nothing

// ✅ CORRECT — use one or the other
export const revalidate = 3600  // ISR (preferred for most pages)
// OR
export const dynamic = 'force-dynamic'  // Only for truly real-time pages (e.g. /admin)
```

### 8. Import Map

The admin import map (`autoGenerate: false` in `payload.config.ts`) must be regenerated manually after adding or moving admin components:

```bash
bun run payload generate:importmap
```

---

## TypeScript Best Practices

### Strict Settings

```json
{
  "strict": true,
  "exactOptionalPropertyTypes": true,
  "noUncheckedIndexedAccess": true
}
```

- Array access always returns `T | undefined`
- All nullable types must be explicitly handled
- No implicit `any`

### Null Safety Patterns

```typescript
// Browser APIs
if (!window.visualViewport) return
const viewport = window.visualViewport
const height = viewport.height

// Relationship fields (Media | string | null)
function isMediaObject(media: Media | string | null): media is Media {
  return typeof media === 'object' && media !== null && 'url' in media
}

// Array access
const name = items[0]?.name ?? 'Default'

// Optional refs
inputRef.current?.focus()
```

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

```typescript
// ❌ Missing req — runs in a separate transaction
async ({ doc, req }) => {
  await req.payload.update({ collection: 'productlines', id: doc.productline, data: { lastUpdated: new Date() } })
}

// ✅ Pass req to maintain atomicity
async ({ doc, req }) => {
  await req.payload.update({ collection: 'productlines', id: doc.productline, data: { lastUpdated: new Date() }, req })
}
```

### 3. Prevent Infinite Hook Loops

```typescript
// ✅ Use context flag to guard self-triggering updates
async ({ doc, req, context }) => {
  if (context.skipHook) return doc
  await req.payload.update({
    collection: 'products', id: doc.id,
    data: { updatedAt: new Date() },
    context: { skipHook: true }, req,
  })
}
```

### 4. Access Control Functions

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

The CSP is a structured TypeScript object — one array per directive. **Adding a new third-party service = add its domain to the right array.**

```typescript
// src/lib/csp.ts
'script-src': [
  "'self'",
  "'unsafe-inline'",
  'https://www.googletagmanager.com',
  'https://new-analytics-tool.com',  // ← add here
],
'frame-src': [
  'https://calendly.com',
  'https://new-embed.com',           // ← add here
],
```

Directive cheatsheet:
- `script-src` — JS files and inline scripts
- `style-src` — CSS files and inline styles
- `img-src` — images (including CSS background-image)
- `font-src` — web fonts
- `frame-src` — iframes this page embeds (YouTube, Calendly, HubSpot forms)
- `connect-src` — fetch/XHR/WebSocket (API calls the browser makes)
- `media-src` — video and audio
- `worker-src` — Web Workers

`'unsafe-eval'` is added to `script-src` automatically in dev only (Turbopack needs it for source maps). Never add it for production.

**Admin CSP**: The Payload admin panel (`/admin/*`) gets a separate relaxed policy (`ADMIN_CSP` constant). Don't tighten it — the admin UI requires `unsafe-inline` and `unsafe-eval` to function.

### Payload-level hardening — `src/payload.config.ts`

```typescript
serverURL: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
// ↑ anchors CSRF protection — Payload auto-includes it in the allowlist

maxDepth: 3,
// ↑ caps ?depth= query param to prevent recursive MongoDB lookup abuse

graphQL: { disable: process.env.NODE_ENV === 'production' },
// ↑ kills GraphQL entirely in prod (no playground, no introspection)
```

No `cors:` or `csrf:` arrays — this is a co-located app. Adding them would break admin panel auth by replacing Payload's automatic same-origin allowlist.

### Login protection — `src/collections/Users.ts`

```typescript
auth: {
  maxLoginAttempts: 5,          // lock after 5 failed attempts
  lockTime: 60 * 60 * 1000,    // 1 hour lockout
  cookies: { secure: process.env.NODE_ENV === 'production' },
}
```

### Route guards — `src/middleware.ts`

`/api/access` is blocked for unauthenticated requests (it exposes the full schema structure). Pattern for adding more guards:

```typescript
if (pathname === '/api/your-route') {
  const token = request.cookies.get('payload-token')
  if (!token) return NextResponse.json({ errors: [{ message: 'Unauthorized' }] }, { status: 401 })
  return NextResponse.next()
}
```

The middleware matcher explicitly includes `/api/access` — any new route guard you add must also be in the matcher array.

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

```typescript
import type { CollectionAfterChangeHook } from 'payload'

export const revalidateStorefront: CollectionAfterChangeHook = async ({ doc, context }) => {
  if (context.skipRevalidation) return doc
  if (!doc.isActive) return doc

  const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Fire-and-forget — never await, never block the CMS save
  fetch(`${baseURL}/api/revalidate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.REVALIDATION_SECRET,
      tag: `storefront-${doc.slug}`,
    }),
  }).catch((err) => console.error('Revalidation error:', err))

  return doc
}
```

Hook rules:
1. Always pass `req` to nested Payload operations
2. Use context flags to prevent infinite loops
3. Fire-and-forget for revalidation (never await)
4. Never throw — log and return doc

---

## Component Organization

### Hierarchy

1. `src/components/ui/` — Shared UI primitives (Button, Card, Dialog, FormField, FormAlert, Modal)
2. `src/components/{domain}/` — Domain components (piano/, forms/, layout/, homepage/, namm/, etc.)
3. `page/_components/` — Only for truly page-specific, non-reusable components

**Never duplicate components into page-local folders.** Always import from `@/components/ui`.

### Forms & Modals

```tsx
import { Modal } from '@/components/ui/modal'
import { FormField } from '@/components/ui/form-field'
import { FormAlert } from '@/components/ui/form-alert'
import { useModal } from '@/hooks'

const { isOpen, open, close } = useModal({ autoShow: { delay: 2000 } })

<Modal isOpen={isOpen} onClose={close} size="lg">
  <FormField name="email" label="Email" register={register} error={errors.email} />
  <FormAlert variant="success" title="Sent!" message="We'll be in touch." />
</Modal>
```

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

### Server vs Client Components

All components are Server Components by default. Add `'use client'` only for:
- `useState`, `useEffect`, `useRef`
- Browser APIs (localStorage, geolocation)
- Third-party widgets (Calendly, Google Maps)

```tsx
// ✅ Server Component — can call Payload directly
import { getPayloadClient } from '@/lib/payload/queries'

export default async function ProductsPage() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: { status: { equals: 'active' } },
    select: { name: true, slug: true, imageUrl: true },
    depth: 1,
    limit: 50,
  })
  return <ProductGrid products={docs} />
}
```

---

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

**`src/lib/payload/queries.ts`** — Local API (direct MongoDB, server-only)
- Uses `getPayloadClient()` → `getPayload({ config })` → Mongoose
- Zero HTTP overhead — use this for ALL server components, RSC, and Server Actions
- The `getPayloadClient` export is the canonical way to access Payload

**`src/lib/payload/client.ts`** — HTTP REST client (fetch-based, works client+server)
- Uses `fetch()` to call Payload's REST API via HTTP
- Use this ONLY in Client Components that can't import `server-only` modules
- ❌ Never call `client.ts` functions from Server Components — it's a self-fetch loop

```typescript
// ✅ Server Component, Server Action, API route
import { getPayloadClient } from '@/lib/payload/queries'
const payload = await getPayloadClient()
const { docs } = await payload.find({ collection: 'products', ... })

// ✅ Client Component needing CMS data (rare — prefer passing data as props)
import { getProductBySlug } from '@/lib/payload/client'
```

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

**Purpose**: Legacy CRM integration (email lists, contact management). Currently supplementary — Shopify is the primary CRM for new leads.

| File | Purpose |
|------|---------|
| `client.ts` | API client with rate limiting |
| `auth.ts` + `auth-helpers.ts` | OAuth2 token management |
| `credentials.ts` | Token storage (from `ConstantContactSettings` collection) |
| `lists.ts` | List membership and contact creation |
| `custom-fields.ts` | Maps `ConstantContactCustomFields` collection to API |
| `music-school-export.ts` | Bulk export for music school programs |

**Admin UI hooks**: `useConstantContact`, `useConstantContactForm` in `@/hooks`
**Admin routes**: `/api/constant-contact/contacts`, `/api/constant-contact/lists`
**Collections used**: `ConstantContactSettings` (OAuth tokens + config), `ConstantContactCustomFields` (field mapping)

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

### Google Maps

Dealer locator at `/find-a-dealer`. Uses `@vis.gl/react-google-maps` + `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`. Dealer coordinates stored in `Dealers` collection.

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

Each has a full 50–900 scale (`kawai-red-500`, `kawai-black-900`, etc.). Campaign-specific tokens use the `es60-` prefix.

**Usage:**
```html
<div class="bg-kawai-pearl text-kawai-black border border-kawai-neutral">
  <button class="bg-kawai-red text-white hover:bg-kawai-red-700">Buy Now</button>
</div>
```

**Adding a new color:**
```css
/* globals.css — inside @theme */
--color-kawai-navy: #1B2A4A;
```
This auto-generates `bg-kawai-navy`, `text-kawai-navy`, `border-kawai-navy`. If used only in dynamic class strings, also add it to the `@source inline()` safelist.

### Typography

5 Google Fonts are loaded in `src/app/layout.tsx` as Next.js font variables:

| CSS Variable | Font | Use Case |
|---|---|---|
| `--font-inter` → `--font-brand-sans` | Inter | Body text, UI, navigation |
| `--font-crimson` → `--font-brand-serif` / `--font-brand-luxury` | Crimson Text | Editorial headings, product copy |
| `--font-playfair` | Playfair Display | Legacy/sparse use |
| `--font-cormorant` → `--font-family-cormorant` | Cormorant Garamond | Artist carousel, Japanese aesthetic sections |
| `--font-noto` → `--font-family-noto` | Noto Sans | Supplementary sans-serif |

**Only Inter is preloaded** (the others have `preload: false` to avoid font preload spam). All five still load — preload only controls eagerness.

**Usage in Tailwind:**
```html
<h1 class="font-[family-name:var(--font-brand-luxury)]">Concert Grand</h1>
<p class="font-[family-name:var(--font-brand-sans)]">Natural sound technology...</p>
```

Custom utility classes from `brand-components.css` (e.g. `kawai-heading`, `heading-brand-hero`) apply fonts automatically.

### Component Styling Approach

#### 1. Generated utilities (preferred — 80% of styling)

Use Tailwind utilities generated from `@theme` tokens directly:
```html
<div class="bg-kawai-pearl text-kawai-black shadow-brand-medium rounded-lg p-6">
```

#### 2. `cn()` for conditional/merged classes

```typescript
import { cn } from '@/lib/utils'  // clsx + tailwind-merge

<div className={cn(
  "base-class px-4 py-2",
  isActive && "bg-kawai-red text-white",
  className  // Always accept and merge external className prop
)} />
```

#### 3. CVA for component variants

```typescript
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-all",
  {
    variants: {
      variant: {
        primary: "bg-kawai-red text-white hover:bg-kawai-red-700 shadow-brand-red-glow",
        secondary: "border border-kawai-neutral text-kawai-black hover:border-kawai-red",
        ghost: "text-kawai-charcoal hover:text-kawai-black hover:bg-kawai-pearl",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
)
```

#### 4. `@utility` for complex brand components

For multi-property components with pseudo-class logic that would be unwieldy as utility strings, define them in `brand-components.css`:

```css
/* src/styles/brand-components.css */
@utility card-brand-intimate {
  background: var(--color-kawai-pearl);
  border: 1px solid var(--color-kawai-neutral);
  box-shadow: var(--shadow-brand-subtle);
  border-radius: 0.5rem;
  transition: all 0.3s var(--ease-piano);

  &:hover {
    box-shadow: var(--shadow-brand-medium);
    transform: translateY(-2px);
  }
}
```

Then add the class name to the `@source inline()` safelist in `globals.css`.

### Shadow Scale

| Token | Usage |
|-------|-------|
| `shadow-brand-subtle` | Cards at rest, inputs |
| `shadow-brand-medium` | Cards on hover, modals |
| `shadow-brand-premium` | Feature hero cards, elevated UI |
| `shadow-brand-red-glow` | Primary CTA buttons |

### Custom Spacing (Brand Ma Scale)

Japanese Ma spacing philosophy — used for brand-aligned white space:

```html
<section class="py-brand-4xl">        <!-- 96px vertical padding -->
  <div class="mb-brand-xl gap-brand-lg">  <!-- 32px margin, 24px gap -->
```

Scale: `brand-xs` (4px) → `brand-sm` (8px) → `brand-md` (16px) → `brand-lg` (24px) → `brand-xl` (32px) → `brand-2xl` (48px) → `brand-3xl` (64px) → `brand-4xl` (96px)

### Animation Tokens

```css
/* Custom easing curves */
--ease-piano: cubic-bezier(0.4, 0, 0.2, 1)     /* Standard — most UI transitions */
--ease-elegant: cubic-bezier(0.25, 0.46, 0.45, 0.94)  /* Softer — content reveals */
```

Use in Tailwind: `transition-[transform] duration-300 ease-[var(--ease-piano)]`

Motion animations use Framer Motion (`motion.div`) for complex sequences — see `src/components/ui/animations/`.

### Custom Breakpoint

```css
--breakpoint-3xl: 120rem  /* 1920px — for very large display layouts */
```

Usage: `3xl:grid-cols-4`

### `@source inline()` Safelist

Tailwind v4 only generates utilities that it can statically scan in source files. Dynamic class names (built at runtime, e.g. `bg-${color}`) won't be generated unless added to the safelist in `globals.css`:

```css
@source inline("{bg-kawai-red, text-kawai-black, card-brand-intimate, ...}");
```

**Always add new dynamic class names here** — otherwise they'll work in dev (JIT scanning) but disappear in production builds.

### Accessibility

`prefers-reduced-motion` is handled globally in `globals.css` — all animation/transition durations are overridden to `0.01ms`. No per-component motion guards needed.

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

```bash
# Database
DATABASE_URI=mongodb+srv://...

# Payload
PAYLOAD_SECRET=your-secret-32-chars-minimum

# Cloudflare R2
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_ENDPOINT=https://{account}.r2.cloudflarestorage.com
S3_BUCKET=kawaicms
S3_REGION=auto
NEXT_PUBLIC_S3_PUBLIC_URL=https://pub-{account}.r2.dev

# Revalidation
REVALIDATION_SECRET=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Shopify
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_APP_CLIENT_SECRET=shpss_...

# Analytics
NEXT_PUBLIC_GA_ID=G-xxxxxxxxxx
NEXT_PUBLIC_META_PIXEL_ID=...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
```

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
const site = host.startsWith('cad.') ? 'cad' : 'us'
requestHeaders.set('x-site', site)
```

**Utility** (`src/lib/site-context.ts`) — the single source of truth:
```typescript
import { getSite, getSiteName, getSiteUrl, getSiteAlternates } from '@/lib/site-context'
```
- `getSite()` — async, server-only, returns `'us' | 'cad'`
- `getSiteName(site)` — `'Kawai America'` or `'Kawai Canada'`
- `getSiteUrl(site)` — `'https://www.kawaius.com'` or `'https://cad.kawaius.com'`
- `getSiteAlternates(path)` — hreflang object for `alternates.languages` in metadata

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

**Client Components** — cannot use `getSite()`. Create a thin server wrapper that reads `getSite()` and passes `isCanada` as a prop. See `src/components/blocks/ProductHeroBlockWrapper.tsx` as the pattern.

### What's already implemented

| Feature | File | What changes on CAD |
|---------|------|---------------------|
| Page title suffix | `src/app/layout.tsx` | "Kawai Canada" instead of "Kawai America" |
| hreflang + canonical | All `generateMetadata` in `(frontend)/` | `en-CA` / `en-US` alternates |
| Sitemap | `src/app/sitemap.ts` | Domain-aware base URL + alternates |
| Robots.txt | `src/app/robots.ts` | Points to correct domain's sitemap |
| Product Hero | `src/components/blocks/ProductHeroBlockWrapper.tsx` | Hides price, Buy Now, Add to Cart; shows Find a Dealer |
| Header branding | `src/components/layout/header-dynamic.tsx` | Shows "Canada Music" in logo |

### Adding new Canada-specific behavior

For server components, it's one check:
```typescript
const site = await getSite()
const isCanada = site === 'cad'
```

For client components, follow the `ProductHeroBlockWrapper` pattern — server wrapper passes `isCanada` prop down.

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
| **`searchPlugin` + `storefronts`** | Storefronts use `skipSync: true` and a manual afterChange hook due to a Payload 3.71.1 bug in polymorphic query parsing |
| **`origin.isDealerLocation` in render** | Always gate on `mounted` state — server always renders `false`, client reads from sessionStorage. Skipping the guard causes React hydration error #418 |
| **PostHog double-init** | `instrumentation-client.ts` auto-runs on client boot. `PHProvider` must check `if (posthog.__loaded) return` before calling `posthog.init()` |
| **Meta Pixel duplicate** | `MetaPixel.tsx` uses `<Script>` for init — never add a `useEffect` that also calls `fbq('init')`. The Script is the single init point |
| **`client.ts` in Server Components** | `src/lib/payload/client.ts` uses `fetch()` — calling it from a Server Component creates a self-fetch HTTP loop. Use `queries.ts` instead |
| **Constant Contact is legacy** | New lead capture uses Shopify via `src/lib/actions/contact-form.ts`. CC integration still exists for list management but is not the primary CRM |

---

## Business Context

**KAWAI** is a unified platform for Kawai Piano Corporation — piano retail, dealer management, lead generation, and content marketing.

### Product Lines

- **Digital**: CA, CN, ES, KDP Series ($999–$6,399)
- **Hybrid**: Novus, AnyTime Series ($9,500–$14,500)
- **Grand**: Shigeru Kawai SK, GX BLAK, GL Series ($18,900–$200K+)
- **Upright**: K Series, ND Series

### Key Data Flows

1. **Product Discovery**: `/` → `/pianos` → `/pianos/[category]` → `/products/[slug]`
2. **Dealer Storefronts**: `/store/[storeslug]` — fully CMS-driven, ISR
3. **Lead Capture**: Contact form → Shopify customer upsert → CRM
4. **Content Updates**: CMS save → `afterChange` hook → POST `/api/revalidate` → `revalidateTag`

### Resources

- Payload Docs: https://payloadcms.com/docs
- Payload LLM Context: https://payloadcms.com/llms-full.txt
- Project Admin: http://localhost:3000/admin
