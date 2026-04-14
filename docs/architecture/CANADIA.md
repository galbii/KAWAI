# CANADIA — Canadian Site Strategy

Multi-region support for `cad.kawaipianos.com` using a lightweight site context pattern.
Centralizes design, pages, and blogs while routing pricing through a separate Canadian Shopify store.

---

## Overview

This is **not** a multi-tenant setup. The Payload `@payloadcms/plugin-multi-tenant` plugin is
designed for separate teams editing separate content (e.g., an agency managing multiple brands).
KAWAI's case is simpler: one content team, two regional storefronts, ~90% shared content.

The approach instead uses:
- **Next.js middleware** to detect the domain and stamp every request with a site identifier
- **Shopify client factory** to swap between US and CA stores based on that identifier
- **Lightweight Payload overrides** on existing collections for Canada-specific content
- **React context** to propagate site identity to client components (cart, pricing display)

---

## Architecture

```
cad.kawaipianos.com          kawaipianos.com
        │                           │
        └──────────┬────────────────┘
                   ▼
          Next.js Middleware
          (detects host, sets x-site header + cookie)
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
   site = 'ca'           site = 'us'
        │                     │
        ▼                     ▼
  CA Shopify Store      US Shopify Store
  (CAD pricing)         (USD pricing)
        │                     │
        └──────────┬──────────┘
                   ▼
           Payload CMS
       (shared content for both)
```

---

## Layer 1 — Next.js Middleware (Domain Detection)

Reads the `host` header and stamps every request before it hits any route or component.

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') ?? ''
  const site = hostname.startsWith('cad.') ? 'ca' : 'us'

  const response = NextResponse.next()
  response.headers.set('x-site', site)                           // server components
  response.cookies.set('site', site, { sameSite: 'lax' })       // client components
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/payload).*)'],
}
```

---

## Layer 2 — Site Utility (Server Components)

Read the site identifier in any server component or page.

```typescript
// src/lib/site.ts
import { headers } from 'next/headers'

export type Site = 'us' | 'ca'

export async function getSite(): Promise<Site> {
  const h = await headers()
  const site = h.get('x-site')
  return site === 'ca' ? 'ca' : 'us'
}

export function getCurrency(site: Site): 'USD' | 'CAD' {
  return site === 'ca' ? 'CAD' : 'USD'
}

export function getLocale(site: Site): string {
  return site === 'ca' ? 'en-CA' : 'en-US'
}
```

---

## Layer 3 — Shopify Client Factory

The existing `ShopifyClient` already supports `.withConfig()`. Add a factory function that
returns the correct store based on site context.

### New Environment Variables

```bash
# .env.local

# US store (existing)
SHOPIFY_STORE_DOMAIN=kawai-us.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_...
SHOPIFY_APP_CLIENT_SECRET=shpss_...

# CA store (new)
SHOPIFY_CA_STORE_DOMAIN=kawai-canada.myshopify.com
SHOPIFY_CA_STOREFRONT_ACCESS_TOKEN=shpat_...
SHOPIFY_CA_APP_CLIENT_SECRET=shpss_...
```

### Factory Function

```typescript
// src/lib/shopify/site-client.ts
import { ShopifyClient } from './client'
import type { Site } from '@/lib/site'

export function getShopifyClientForSite(site: Site): ShopifyClient {
  if (site === 'ca') {
    const domain = process.env.SHOPIFY_CA_STORE_DOMAIN
    const token = process.env.SHOPIFY_CA_STOREFRONT_ACCESS_TOKEN
    if (!domain || !token) throw new Error('Missing CA Shopify configuration')
    return new ShopifyClient({ storeDomain: domain, storefrontAccessToken: token })
  }
  return new ShopifyClient() // existing US defaults
}
```

### Usage in Pages

```typescript
// src/app/(frontend)/products/[slug]/page.tsx
import { getSite, getCurrency } from '@/lib/site'
import { getShopifyClientForSite } from '@/lib/shopify/site-client'
import { GET_PRODUCT } from '@/lib/shopify/queries'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const site = await getSite()
  const shopify = getShopifyClientForSite(site)
  const product = await shopify.query(GET_PRODUCT, { handle: params.slug })

  return (
    <ProductDetail
      product={product}
      site={site}
      currency={getCurrency(site)}
    />
  )
}
```

---

## Layer 4 — Payload Content Overrides

No multi-tenancy needed. Add lightweight Canada override fields to collections
that require regional variants. Leave blank to inherit US content.

### Products Collection

```typescript
// In src/collections/Products.ts — add to fields array
{
  name: 'canadaOverrides',
  type: 'group',
  label: '🍁 Canada Overrides',
  admin: {
    description: 'Leave blank to use the US content. Only fill in fields that differ for Canada.',
  },
  fields: [
    {
      name: 'msrp',
      type: 'number',
      label: 'MSRP (CAD)',
      admin: { description: 'Canadian MSRP in CAD. Leave blank to hide pricing on CA site.' },
    },
    {
      name: 'availability',
      type: 'select',
      label: 'CA Availability',
      options: ['available', 'discontinued', 'coming-soon', 'not-available'],
      admin: { description: 'Override availability status for the Canadian market.' },
    },
    {
      name: 'dealerNote',
      type: 'textarea',
      label: 'CA Dealer Note',
      admin: { description: 'Canada-specific note shown on the product page.' },
    },
  ],
},
```

### Dealers Collection

Add a `country` field so the dealer locator can filter by region:

```typescript
// In src/collections/Dealers.ts — add to fields array
{
  name: 'country',
  type: 'select',
  required: true,
  defaultValue: 'us',
  options: [
    { label: 'United States', value: 'us' },
    { label: 'Canada', value: 'ca' },
  ],
  admin: {
    position: 'sidebar',
    description: 'Controls which regional site this dealer appears on.',
  },
},
```

Then filter dealers by site in the find-a-dealer page:

```typescript
const site = await getSite()
const { docs: dealers } = await payload.find({
  collection: 'dealers',
  where: { country: { equals: site } },
})
```

---

## Layer 5 — Client-Side Site Context

For client components (cart, pricing display, header), pass site context from
the root server layout into the client tree via a provider.

```typescript
// src/components/providers/SiteProvider.tsx
'use client'
import { createContext, useContext } from 'react'
import type { Site } from '@/lib/site'

const SiteContext = createContext<Site>('us')

export function SiteProvider({ site, children }: { site: Site; children: React.ReactNode }) {
  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>
}

export function useSite(): Site {
  return useContext(SiteContext)
}
```

```typescript
// src/app/(frontend)/layout.tsx
import { getSite } from '@/lib/site'
import { SiteProvider } from '@/components/providers/SiteProvider'

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite()

  return (
    <SiteProvider site={site}>
      {children}
    </SiteProvider>
  )
}
```

Usage in any client component:

```typescript
'use client'
import { useSite } from '@/components/providers/SiteProvider'

export function PriceDisplay({ usdPrice, cadPrice }: { usdPrice: number; cadPrice?: number }) {
  const site = useSite()
  const price = site === 'ca' ? cadPrice : usdPrice
  const currency = site === 'ca' ? 'CAD' : 'USD'

  if (!price) return <span>Contact dealer for pricing</span>

  return (
    <span>
      {new Intl.NumberFormat(site === 'ca' ? 'en-CA' : 'en-US', {
        style: 'currency',
        currency,
      }).format(price)}
    </span>
  )
}
```

---

## Content Sharing Matrix

| Content Type | Strategy |
|---|---|
| Blog posts | Fully shared — same content on both sites |
| Product pages | Shared layout, pricing from site-specific Shopify store |
| Product MSRP/notes | Optional `canadaOverrides` group in Payload |
| Dealer locator | Filter by `country` field on Dealers collection |
| Homepage | Shared — add `canadaHero` block overrides if needed |
| Artists / endorsed artists | Fully shared |
| Cart & checkout | Separate Shopify checkout URLs by site (handled by client factory) |
| Media / images | Fully shared from R2 |
| Admin panel | Single admin at `/admin` manages both regions |

---

## Implementation Checklist

- [ ] Create `src/middleware.ts` — detect `cad.` hostname, set `x-site` header + `site` cookie
- [ ] Create `src/lib/site.ts` — `getSite()`, `getCurrency()`, `getLocale()` utilities
- [ ] Create `src/lib/shopify/site-client.ts` — `getShopifyClientForSite(site)` factory
- [ ] Add CA env vars to `.env.local` and Vercel/hosting environment
- [ ] Add `canadaOverrides` group to **Products** collection
- [ ] Add `country` select field to **Dealers** collection
- [ ] Create `src/components/providers/SiteProvider.tsx` — client context provider
- [ ] Wire `SiteProvider` into `src/app/(frontend)/layout.tsx`
- [ ] Update product pages to use `getShopifyClientForSite()`
- [ ] Update dealer locator to filter by `country`
- [ ] Update `PriceDisplay` component to use site-aware currency formatting
- [ ] Configure DNS: point `cad.kawaipianos.com` to the same Vercel deployment

---

## DNS / Hosting Notes

Both `kawaipianos.com` and `cad.kawaipianos.com` point to the **same** Next.js deployment.
No separate deployments or repos needed. Add `cad.kawaipianos.com` as a custom domain
in your Vercel project settings alongside the primary domain.

Vercel automatically passes the correct `host` header, so the middleware will
correctly detect which site is being served.

---

## What We Are NOT Doing

- **No `@payloadcms/plugin-multi-tenant`** — that's for separate teams with separate logins
- **No duplicate content** — blogs, products, artists are authored once and shared
- **No separate deployments** — one codebase, one repo, one Vercel project
- **No separate databases** — one MongoDB Atlas instance, one Payload admin
