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

### Shopify (`src/lib/shopify/`)

**Purpose**: Product catalog sync, customer CRM, cart, navigation mega-menu.

| File | Purpose |
|------|---------|
| `client.ts` | Storefront API (public) |
| `admin-client.ts` | Admin API (server-side) |
| `customers.ts` | Customer upsert (lead capture) |
| `navigation.ts` | Mega menu extraction |
| `sync-to-payload.ts` | Product sync to CMS |

### Analytics

- **PostHog**: `posthog-js` — proxied via `/ingest/*` rewrites in `next.config.js`
- **Google Analytics**: `NEXT_PUBLIC_GA_ID`
- **Meta Pixel**: `NEXT_PUBLIC_META_PIXEL_ID` (isolated via `src/lib/integrations/facebook-pixel-isolation.ts`)

### Google Maps

Dealer locator at `/find-a-dealer`. Uses `@vis.gl/react-google-maps` + `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`. Dealer coordinates stored in `Dealers` collection.

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
