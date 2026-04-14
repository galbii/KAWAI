# KAWAI Canada Expansion — Implementation Plan

Multi-tenant Payload CMS + separate Canadian Shopify store, served at `cad.kawai.com`.

---

## Overview

One codebase, one Payload CMS instance, two storefronts. `kawai.com` serves US customers in USD. `cad.kawai.com` serves Canadian customers in CAD. Routing is determined entirely by the incoming hostname — no duplicate apps, no separate deployments.

| Layer | US | Canada |
|---|---|---|
| URL | `kawai.com` | `cad.kawai.com` |
| CMS | Payload — KAWAI US tenant | Payload — KAWAI Canada tenant |
| Commerce | `kawai.myshopify.com` (USD) | `kawai-ca.myshopify.com` (CAD) |
| Customers/CRM | US Shopify customers | CA Shopify customers |
| Admin | Same Payload admin, US tenant selected | Same Payload admin, CA tenant selected |

---

## Architecture

### Request Flow

```
User visits cad.kawai.com/products/gx-7
  │
  ├── Next.js middleware
  │     reads host: "cad.kawai.com"
  │     sets header: x-tenant: "cad.kawai.com"
  │     sets header: x-shopify-region: "ca"
  │
  ├── next.config.ts rewrite
  │     /products/gx-7  →  /cad.kawai.com/products/gx-7
  │
  ├── page.tsx
  │     reads x-tenant     → queries Payload (CA tenant scoped)
  │     reads x-shopify-region → queries CA Shopify store (CAD pricing)
  │
  └── Response: Canadian product page, CAD prices, CA dealers
```

### Content Scoping

**Tenant-scoped (separate per region):**
- `pages` — CA homepage, about, landing pages
- `storefronts` — Canadian dealer locations only
- `posts` — Canadian blog, events, news
- `navigation` — CA nav (global-like per tenant)
- `HomePage`, `PianosPage` singletons (one per tenant via `isGlobal: true`)

**Shared across tenants:**
- `media` — piano images and videos (upload once, use in both regions)
- `artists` — global artist roster
- `categories` — post categories

**Products:** Same Payload product structure, but each tenant's product pages query their own Shopify store for pricing.

---

## Phase 1 — Infrastructure

### 1. Create the Canadian Shopify Store

1. Create a new Shopify store (`kawai-ca.myshopify.com`)
2. Set store currency to CAD
3. Set Canadian prices per product (independent from USD — not auto-converted)
4. Install the same Shopify apps as the US store (if applicable)
5. Configure Shopify Payments CA for CAD checkout and settlement
6. Generate Storefront API access token and Admin API credentials

### 2. Add Environment Variables

```bash
# .env.local — add these alongside existing SHOPIFY_* vars

# CA Shopify — Storefront API (public, NEXT_PUBLIC safe)
NEXT_PUBLIC_SHOPIFY_CA_STORE_DOMAIN=kawai-ca.myshopify.com
NEXT_PUBLIC_SHOPIFY_CA_STOREFRONT_ACCESS_TOKEN=ca_storefront_token_here

# CA Shopify — Admin API (server-side only)
SHOPIFY_CA_STORE_DOMAIN=kawai-ca.myshopify.com
SHOPIFY_CA_APP_API_KEY=ca_app_client_id_here
SHOPIFY_CA_APP_CLIENT_SECRET=shpss_ca_client_secret_here
```

### 3. Install Multi-Tenant Plugin

```bash
bun add @payloadcms/plugin-multi-tenant
```

### 4. Add Tenants Collection + Plugin to `payload.config.ts`

```typescript
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'

// Add to collections array:
const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: { group: 'System', useAsTitle: 'name' },
  access: { create: adminOnly, read: authenticated, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'name', type: 'text', required: true },    // "KAWAI US", "KAWAI Canada"
    { name: 'domain', type: 'text', required: true },  // "kawai.com", "cad.kawai.com"
  ],
}

// Add to plugins array:
multiTenantPlugin({
  collections: {
    pages: {},
    storefronts: {},
    posts: {},
    categories: {},
    'home-page': { isGlobal: true },
    'pianos-page': { isGlobal: true },
    navigation: { isGlobal: true },
    media: { useTenantAccess: false },   // shared — no tenant filter on media
    artists: { useTenantAccess: false }, // shared global roster
  },
  userHasAccessToAllTenants: (user) => user?.role === 'admin',
})
```

### 5. Create Tenant Records

In the Payload admin, create two tenant records:

| name | domain |
|---|---|
| KAWAI US | kawai.com |
| KAWAI Canada | cad.kawai.com |

Then migrate all existing content documents to the KAWAI US tenant (the plugin adds a `tenant` relationship field — bulk update via the import/export plugin or a migration script).

### 6. DNS Configuration

Add a CNAME record:
```
cad.kawai.com  →  CNAME  →  kawai.com (or your Vercel/hosting deployment URL)
```

---

## Phase 2 — Routing

### 1. Update `next.config.ts` Rewrites

```typescript
// next.config.ts
async rewrites() {
  return {
    beforeFiles: [
      {
        source: '/((?!admin|api|_next|favicon).*)',
        destination: '/:tenantDomain/:path*',
        has: [{ type: 'host', value: '(?<tenantDomain>.+)' }],
      },
    ],
  }
},
```

This captures the hostname into `tenantDomain` and prepends it to all non-admin, non-API paths. The Payload admin at `/admin` is excluded — it runs on both domains but is only used at `kawai.com/admin`.

### 2. Update `middleware.ts`

```typescript
// src/middleware.ts — extend the existing middleware

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const isCanada = host.startsWith('cad.')
  const region = isCanada ? 'ca' : 'us'

  const response = NextResponse.next()

  // Pass tenant and region to server components via headers
  response.headers.set('x-tenant-domain', host)
  response.headers.set('x-shopify-region', region)

  // Preserve existing pathname header (already in middleware.ts)
  response.headers.set('x-pathname', request.nextUrl.pathname)

  return response
}
```

### 3. Route Group Structure

Add a `[tenantDomain]` dynamic segment to handle the rewritten paths:

```
src/app/
├── (frontend)/                   # Existing US routes (unchanged for now)
│   ├── page.tsx
│   ├── products/[slug]/
│   └── store/[storeslug]/
└── [tenantDomain]/               # Multi-tenant routes (new)
    └── (frontend)/
        ├── layout.tsx            # Reads x-tenant-domain, provides TenantContext
        ├── page.tsx
        └── products/[slug]/
```

Alternatively, update the existing `(frontend)` layout to read the `x-tenant-domain` header and provide context — avoids duplicating route files.

---

## Phase 3 — Shopify Client Factory

### 1. Create `src/lib/shopify/regional-clients.ts`

```typescript
import { ShopifyClient } from './client'
import { ShopifyAdminClient } from './admin-client'

type Region = 'us' | 'ca'

const storefrontClients: Partial<Record<Region, ShopifyClient>> = {}
const adminClients: Partial<Record<Region, ShopifyAdminClient>> = {}

export function getShopifyClient(region: Region): ShopifyClient {
  if (!storefrontClients[region]) {
    storefrontClients[region] =
      region === 'ca'
        ? new ShopifyClient({
            storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_CA_STORE_DOMAIN!,
            storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_CA_STOREFRONT_ACCESS_TOKEN!,
          })
        : new ShopifyClient() // uses existing default env vars
  }
  return storefrontClients[region]!
}

export function getShopifyAdminClient(region: Region): ShopifyAdminClient {
  if (!adminClients[region]) {
    adminClients[region] =
      region === 'ca'
        ? new ShopifyAdminClient({
            storeDomain: process.env.SHOPIFY_CA_STORE_DOMAIN!,
          })
        : new ShopifyAdminClient() // uses existing default env vars
  }
  return adminClients[region]!
}
```

### 2. Update Server Actions for CA Lead Capture

```typescript
// src/lib/actions/contact-form.ts
import { getShopifyAdminClient } from '@/lib/shopify/regional-clients'
import { headers } from 'next/headers'

export async function submitContactForm(data: ContactFormData) {
  const region = (await headers()).get('x-shopify-region') as 'us' | 'ca' ?? 'us'
  const adminClient = getShopifyAdminClient(region)

  await upsertCustomer(adminClient, {
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    tags: [data.storefrontSlug, `market-${region}`],
  })
}
```

### 3. Consolidate `formatPrice`

The codebase currently has 3 separate `formatPrice` implementations. Replace the one in `src/lib/utils.ts` with a currency-aware version:

```typescript
export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
```

Pass `currency: 'CAD'` when rendering on `cad.kawai.com`.

---

## Phase 4 — Content Setup

### Canadian Payload Content to Create

With the KAWAI Canada tenant selected in the admin:

- **Homepage** — Canadian hero, Canadian promotions, CAD pricing CTAs
- **PianosPage** — Piano catalog with CA dealer references
- **Navigation** — CA-specific nav links (Canadian dealer finder, CA contact)
- **Storefronts** — Canadian dealer locations (Toronto, Vancouver, Montreal, etc.)
- **Posts** — Canadian events, music festival partnerships, conservatory news
- **Pages** — Canadian shipping/warranty page, Canadian contact page

### Content Differentiation Requirements (SEO Critical)

For hreflang to work and Google to serve CA pages to Canadian searchers, CA pages must have meaningful differences:

- CAD prices (not just a badge — actual Canadian pricing from CA Shopify store)
- Canadian dealer info and locations
- Canadian shipping, warranty, and return policies
- 1–2 Canada-specific paragraphs per major product page
- Canadian event and cultural references where relevant

---

## Phase 5 — SEO Setup

### hreflang Tags

Add to `<head>` on every page that has both a US and CA variant:

```tsx
// In layout.tsx or generateMetadata
<link rel="alternate" hreflang="en-US" href="https://kawai.com/products/gx-7" />
<link rel="alternate" hreflang="en-CA" href="https://cad.kawai.com/products/gx-7" />
<link rel="alternate" hreflang="x-default" href="https://kawai.com/products/gx-7" />
```

Rules:
- Tags must be **bidirectional** — US page lists CA, CA page lists US
- Every page must have a **self-referencing** tag
- Always include `x-default` pointing to the US page

### Google Search Console

1. Add `cad.kawai.com` as a new property in GSC (separate from `kawai.com`)
2. Submit `https://cad.kawai.com/sitemap.xml`
3. Set International Targeting → Country → Canada for the CA property
4. Monitor indexing separately for each property

### Sitemap

Generate separate sitemaps per tenant. The CA sitemap at `cad.kawai.com/sitemap.xml` should only include CA pages (tenant-filtered Payload query).

### Authority Building (Ongoing)

- Update Canadian dealer Google Business Profiles to link `cad.kawai.com`
- Outreach to Canadian music institutions for backlinks: Royal Conservatory, McGill, UBC Music, University of Toronto Faculty of Music
- Canadian music press: The WholeNote, Ludwig Van Montreal, La Scena Musicale
- Canadian piano competition sponsorships link to `cad.kawai.com`

---

## Admin Experience Summary

### Payload Admin (`kawai.com/admin`)

One admin URL for both regions. The multi-tenant plugin adds a tenant selector at the top of the sidebar.

**Editor workflow:**
1. Log into `kawai.com/admin`
2. Select tenant from dropdown: `KAWAI US` or `KAWAI Canada`
3. All collection list views automatically filter to the selected tenant
4. Editors cannot view or accidentally edit the other region's content
5. Super-admins (role: `admin`) can toggle freely between tenants
6. After saving a CA document, the `afterChange` revalidation hook fires and revalidates `cad.kawai.com` only

**Shared media workflow:**
- Upload piano images once — available in both US and CA page editors
- Media is not tenant-filtered (`useTenantAccess: false`)

---

## Canadian User Experience Summary

### What Changes at `cad.kawai.com`

| Element | kawai.com | cad.kawai.com |
|---|---|---|
| Prices | USD (e.g. $3,999) | CAD (e.g. $5,299) |
| Checkout | US Shopify checkout | CA Shopify checkout |
| Currency | USD | CAD |
| Dealer locator | US dealers | Canadian dealers only |
| Homepage/promos | US campaigns | Canadian campaigns |
| Blog/events | US events | Canadian events |
| Contact form leads | US Shopify CRM | CA Shopify CRM |
| Shipping/warranty | US policy | Canadian policy |

### What Stays the Same

- Brand design, typography, colors, animations
- Piano product catalog (same models)
- Artist pages (shared global roster)
- Core page structure and UX patterns

---

## SEO Trade-off Summary

### `cad.kawai.com` vs `kawai.com/ca/`

| Factor | `cad.kawai.com` (this plan) | `kawai.com/ca/` |
|---|---|---|
| Domain authority at launch | Zero — builds independently | Full inheritance from `kawai.com` |
| Ranking speed | 3–6 months to meaningful CA rankings | 4–8 weeks (leverages existing authority) |
| Geotargeting signal | Clear (subdomain + GSC country target) | Needs hreflang + GSC config |
| Duplicate content risk | Low (separate origin) | Higher (requires content differentiation) |
| Admin separation | Clean tenant isolation in Payload | Locale filtering — less visual separation |
| Operational complexity | Slightly higher | Lower |

The subdomain approach trades a slower SEO ramp-up for cleaner content separation and operational clarity. This is acceptable given the investment in Canadian backlink building and the long-term nature of the Canadian market expansion.

---

## Implementation Checklist

### Phase 1 — Infrastructure
- [ ] Create `kawai-ca.myshopify.com` and configure CAD pricing
- [ ] Install `@payloadcms/plugin-multi-tenant`
- [ ] Add `Tenants` collection to `payload.config.ts`
- [ ] Add plugin config to `payload.config.ts`
- [ ] Add CA env vars to `.env.local` and production environment
- [ ] Create US and CA tenant records in Payload admin
- [ ] Bulk-assign existing content to KAWAI US tenant
- [ ] Configure DNS CNAME for `cad.kawai.com`
- [ ] Run `bun run payload generate:importmap`

### Phase 2 — Routing
- [ ] Add host-capture `rewrites` to `next.config.ts`
- [ ] Extend `middleware.ts` with `x-tenant-domain` and `x-shopify-region` headers
- [ ] Add `[tenantDomain]` route group or update existing layout to read tenant header

### Phase 3 — Shopify
- [ ] Create `src/lib/shopify/regional-clients.ts` with `getShopifyClient(region)` factory
- [ ] Update `getShopifyAdminClient` usage in Server Actions to pass region
- [ ] Consolidate `formatPrice` to accept `currency` parameter
- [ ] Test CAD pricing end-to-end (product page → cart → checkout)

### Phase 4 — Content
- [ ] Create CA homepage, PianosPage, navigation in Payload (CA tenant)
- [ ] Add Canadian dealer storefronts
- [ ] Write Canadian-specific content for major product pages
- [ ] Add Canadian shipping/warranty/returns page

### Phase 5 — SEO
- [ ] Implement hreflang tags in `generateMetadata` for all shared page types
- [ ] Add `cad.kawai.com` to Google Search Console
- [ ] Submit CA sitemap
- [ ] Set country targeting in GSC for CA property
- [ ] Update Canadian dealer Google Business Profiles
- [ ] Begin Canadian institutional backlink outreach

---

## Key Files to Create/Modify

| File | Action | Notes |
|---|---|---|
| `src/collections/Tenants.ts` | Create | New tenants collection |
| `src/lib/shopify/regional-clients.ts` | Create | `getShopifyClient(region)` factory |
| `src/lib/actions/contact-form.ts` | Modify | Pass region to admin client |
| `src/lib/utils.ts` | Modify | Add `currency` param to `formatPrice` |
| `src/middleware.ts` | Modify | Add `x-tenant-domain`, `x-shopify-region` headers |
| `next.config.ts` | Modify | Add host-capture rewrites |
| `src/payload.config.ts` | Modify | Add Tenants collection + multiTenantPlugin |
| `src/app/[tenantDomain]/` | Create | Tenant-routed page components |

---

## References

- [Payload multi-tenant plugin docs](https://payloadcms.com/docs/plugins/multi-tenant)
- [Shopify Storefront API — international pricing](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/markets/international-pricing)
- [Google Search Central — managing multi-regional sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
- [Google hreflang documentation](https://developers.google.com/search/docs/specialty/international/localized-versions)
