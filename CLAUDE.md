# KAWAI Piano - Payload CMS Development Guide

You are an expert Payload CMS developer working on KAWAI, a production-grade piano retail platform. Follow these rules when developing.

## Environment

- **Runtime**: Bun (mandatory - never use npm)
- **Package Manager**: Bun (use `bun` instead of npm/yarn/pnpm)
- **Database**: MongoDB Atlas (via mongoose adapter)
- **Storage**: Cloudflare R2 (S3-compatible)
- **Common Commands**:
  - `bun run dev` - Start development server
  - `bun run build` - Production build + type generation
  - `bun run start` - Production server
  - `bun run lint` - ESLint + TypeScript checks
  - `bun run seed` - Seed database (with PAYLOAD_SEED=true)

## Core Principles

1. **TypeScript-First**: Always use TypeScript with proper types from Payload
2. **Security-Critical**: Follow all security patterns, especially access control
3. **Type Generation**: Types auto-generate on build; import from `@/payload-types`
4. **Transaction Safety**: Always pass `req` to nested operations in hooks
5. **Access Control**: Understand Local API bypasses access control by default
6. **Context Flags**: Use context flags to prevent infinite hook loops
7. **Server-First**: All components are Server Components by default

### Code Validation

```bash
# Validate TypeScript
bun run lint

# Build with type checking
bun run build
```

## Project Structure

```
src/
├── app/
│   ├── (frontend)/              # Public website routes
│   │   ├── page.tsx             # Homepage (/)
│   │   ├── pianos/              # Piano catalog (/pianos)
│   │   │   └── [category]/      # Category pages (digital, grand, etc.)
│   │   ├── products/            # Product pages (/products)
│   │   │   └── [slug]/          # Individual product
│   │   ├── [slug]/              # Dynamic dealer pages (/st-louis)
│   │   ├── artists/             # Artist directory
│   │   ├── blog/                # Blog posts
│   │   ├── find-a-dealer/       # Dealer locator with map
│   │   └── api/                 # Frontend API routes
│   │       └── revalidate/      # On-demand ISR revalidation
│   └── (payload)/               # CMS & API routes
│       ├── admin/               # Payload admin UI (/admin)
│       └── api/                 # Payload REST/GraphQL APIs
├── collections/                 # Payload CMS collections (14 total)
├── blocks/                      # Content block definitions
├── components/                  # React components (organized by domain)
│   ├── ui/                      # Shared reusable UI (button, card, dialog, etc.)
│   │   ├── media/               # Media optimization components
│   │   ├── animations/          # Animation components
│   │   └── 3d-viewer/           # 3D piano viewer
│   ├── layout/                  # Header, footer, navigation
│   ├── forms/                   # Contact forms (React Hook Form + Zod)
│   ├── piano/                   # Piano-specific components
│   ├── blocks/                  # Block renderers
│   ├── namm/                    # NAMM event components
│   └── admin/                   # Custom admin components
├── lib/                         # Utilities and integrations
│   ├── payload/                 # Payload CMS utilities
│   │   ├── client.ts            # Payload instance
│   │   ├── queries.ts           # Direct database queries
│   │   └── server.ts            # Server-side utilities
│   ├── data/                    # Static data and seed utilities
│   │   ├── categories.ts        # Piano category definitions
│   │   ├── fallback-data.ts     # Fallback data for SSR
│   │   └── default-productlines.ts
│   ├── shopify/                 # Shopify integration (well-organized)
│   ├── constantcontact/         # Constant Contact CRM integration
│   ├── media/                   # R2 image optimization
│   ├── seo/                     # SEO utilities and schemas
│   ├── actions/                 # Server Actions
│   └── utils.ts                 # General utilities (cn, formatPrice, etc.)
├── hooks/                       # Custom React hooks (consolidated)
├── types/                       # TypeScript type definitions
│   ├── common/                  # Shared utility types
│   ├── domains/                 # Business domain types (piano, dealer, etc.)
│   └── integrations/            # Third-party integration types
├── plugins/                     # Payload plugins
└── payload.config.ts            # Main Payload configuration
```

## Code Organization Principles

### 1. Component Organization

**CRITICAL: Never duplicate UI components in page-specific folders**

```typescript
// ❌ WRONG: Duplicating shared components in page folders
src/app/(frontend)/[slug]/some-page/_components/ui/button.tsx  // DON'T DO THIS
src/app/(frontend)/[slug]/some-page/_components/ui/card.tsx    // DON'T DO THIS

// ✅ CORRECT: Use shared components from @/components/ui
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
```

**Component hierarchy:**
1. `@/components/ui/` - Shared, reusable UI primitives (Button, Card, Dialog, Input)
2. `@/components/{domain}/` - Domain-specific components (piano/, forms/, layout/)
3. `page/_components/` - ONLY for truly page-specific, non-reusable components

### 2. Import Patterns

**Always use path aliases:**

```typescript
// ✅ Preferred imports
import { Button, Card, Dialog } from '@/components/ui'
import { useScrollAnimation, useAudioPlayer } from '@/hooks'
import { getProducts, transformProduct } from '@/lib/shopify'
import { cn, formatPrice } from '@/lib/utils'
import type { Product, Media } from '@/payload-types'

// ❌ Avoid relative imports across directories
import Button from '../../../components/ui/button'
```

### 3. Barrel Exports

**Every directory should have an index.ts barrel export:**

```typescript
// src/components/ui/index.ts
export { Button } from './button'
export { Card, CardHeader, CardContent } from './card'
export { Dialog, DialogContent, DialogTitle } from './dialog'
// ... etc
```

**Benefits:**
- Cleaner imports: `import { Button, Card } from '@/components/ui'`
- Easier refactoring
- Clear public API for each module

### 4. Integration Organization

**Each integration should be self-contained in its own folder:**

```
lib/shopify/           # ✅ Good: Well-organized integration
├── index.ts           # Barrel export with documentation
├── client.ts          # API client
├── types.ts           # Type definitions
├── queries.ts         # GraphQL queries
├── products.ts        # Product operations
├── cart.ts            # Cart operations
└── customers.ts       # Customer operations
```

**Rules for integrations:**
- Single folder per integration (`lib/shopify/`, `lib/constantcontact/`)
- Single API route prefix (`/api/constant-contact/`, not multiple)
- Types co-located with implementation
- Comprehensive barrel export

### 5. Hooks Organization

**All hooks live in `src/hooks/`:**

```typescript
// ✅ Correct: Import from centralized hooks
import { useScrollAnimation, useAudioPlayer } from '@/hooks'

// ❌ Wrong: Page-specific hooks folder
import { useAnimation } from '../_components/hooks/useAnimation'
```

**Exception:** Hooks with tightly-coupled page dependencies may remain page-local, but this should be rare.

## Form & Modal System

KAWAI includes a reusable form and modal system that eliminates code duplication and provides consistent user experiences across all forms.

### Modal Component

Generic modal wrapper around Radix Dialog with auto-show and variants.

**Usage:**
```tsx
import { Modal } from '@/components/ui/modal'
import { useModal } from '@/hooks'

const { isOpen, close } = useModal({
  autoShow: { delay: 2000 }
})

<Modal isOpen={isOpen} onClose={close} size="lg">
  <h2>Modal Content</h2>
</Modal>
```

**Variants:**
- `size`: sm | md | lg | xl | full
- `layout`: centered | split (for image + content)

### FormField Component

Reusable form input with label, icon, error, and help text.

**Usage:**
```tsx
import { FormField } from '@/components/ui/form-field'
import { UserIcon } from '@heroicons/react/24/outline'

<FormField
  name="firstName"
  label="First Name"
  placeholder="John"
  required
  icon={UserIcon}
  register={register}
  error={errors.firstName}
/>
```

### FormAlert Component

Consistent feedback for all states.

**Usage:**
```tsx
import { FormAlert } from '@/components/ui/form-alert'

<FormAlert
  variant="success"
  title="Success!"
  message="Form submitted successfully."
/>
```

**Variants:** success | error | warning | info

### useModal Hook

State management for modals with auto-show and localStorage persistence.

**Usage:**
```tsx
import { useModal } from '@/hooks'

const { isOpen, open, close, toggle } = useModal({
  autoShow: {
    delay: 1000,
    storageKey: 'modal-shown' // Optional: don't show again
  },
  onOpen: () => console.log('Opened'),
  onClose: () => console.log('Closed')
})
```

### Composing Custom Forms

SimpleCustomerSignup sub-components can be used independently:

```tsx
import { Modal } from '@/components/ui/modal'
import { SimpleCustomerSignupForm } from '@/components/forms/SimpleCustomerSignupForm'

<Modal isOpen={isOpen} onClose={close}>
  <SimpleCustomerSignupForm
    storefrontSlug="custom-location"
    onSuccess={() => setIsOpen(false)}
  />
</Modal>
```

### Form Development Guidelines

**DO:**
- ✅ Use `<FormField>` for all form inputs (eliminates duplication)
- ✅ Use `<FormAlert>` for all feedback messages
- ✅ Use `<Modal>` for all modal dialogs
- ✅ Use `useModal` for modal state management
- ✅ Compose forms from sub-components

**DON'T:**
- ❌ Create custom input components (use FormField)
- ❌ Duplicate modal logic (use Modal + useModal)
- ❌ Hardcode feedback styling (use FormAlert variants)
- ❌ Create monolithic form components (extract sub-components)

### 6. API Route Naming

**Use kebab-case for all API routes:**

```
/api/constant-contact/    ✅ Correct
/api/constantcontact/     ❌ Wrong (camelCase)
/api/ConstantContact/     ❌ Wrong (PascalCase)
```

## CRITICAL SECURITY PATTERNS

### 1. Local API Access Control (MOST IMPORTANT)

```typescript
// ❌ SECURITY BUG: Access control bypassed
await payload.find({
  collection: 'products',
  user: someUser, // Ignored! Operation runs with ADMIN privileges
})

// ✅ SECURE: Enforces user permissions
await payload.find({
  collection: 'products',
  user: someUser,
  overrideAccess: false, // REQUIRED when passing user
})

// ✅ Administrative operation (intentional bypass)
await payload.find({
  collection: 'products',
  // No user, overrideAccess defaults to true - use for admin tasks
})
```

**Rule**: When passing `user` to Local API, ALWAYS set `overrideAccess: false`

### 2. Transaction Safety in Hooks

```typescript
// ❌ DATA CORRUPTION RISK: Separate transaction
hooks: {
  afterChange: [
    async ({ doc, req }) => {
      await req.payload.update({
        collection: 'productlines',
        id: doc.productline,
        data: { lastUpdated: new Date() },
        // Missing req - runs in separate transaction!
      })
    },
  ],
}

// ✅ ATOMIC: Same transaction
hooks: {
  afterChange: [
    async ({ doc, req }) => {
      await req.payload.update({
        collection: 'productlines',
        id: doc.productline,
        data: { lastUpdated: new Date() },
        req, // Maintains atomicity
      })
    },
  ],
}
```

**Rule**: ALWAYS pass `req` to nested operations in hooks

### 3. Prevent Infinite Hook Loops

```typescript
// ❌ INFINITE LOOP
hooks: {
  afterChange: [
    async ({ doc, req }) => {
      await req.payload.update({
        collection: 'products',
        id: doc.id,
        data: { viewCount: doc.viewCount + 1 },
        req,
      }) // Triggers afterChange again!
    },
  ],
}

// ✅ SAFE: Use context flag
hooks: {
  afterChange: [
    async ({ doc, req, context }) => {
      if (context.skipRevalidation) return doc

      await req.payload.update({
        collection: 'products',
        id: doc.id,
        data: { viewCount: doc.viewCount + 1 },
        context: { skipRevalidation: true },
        req,
      })
    },
  ],
}
```

## Access Control Patterns

### Reusable Access Functions

Create these in `src/lib/payload/access/` for consistency:

```typescript
import type { Access } from 'payload'

// Anyone (public)
export const anyone: Access = () => true

// Authenticated only
export const authenticated: Access = ({ req: { user } }) => Boolean(user)

// Admin only
export const adminOnly: Access = ({ req: { user } }) => {
  return user?.role === 'admin'
}

// Authenticated or published content
export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) return true
  return { status: { equals: 'published' } }
}
```

### Current Collection Access Patterns

| Collection | Create | Read | Update | Delete |
|------------|--------|------|--------|--------|
| **Users** | admin | authenticated | admin | admin |
| **Media** | authenticated | anyone | authenticated | authenticated |
| **Products** | authenticated | anyone | authenticated | admin |
| **Productlines** | authenticated | anyone | authenticated | admin |
| **Storefronts** | authenticated | anyone | authenticated | admin |
| **Posts** | authenticated | authenticatedOrPublished | authenticated | admin |
| **Artists** | authenticated | anyone | authenticated | admin |
| **Dealers** | authenticated | anyone | authenticated | admin |

### Field-Level Access

```typescript
// Field access ONLY returns boolean (no query constraints)
{
  name: 'internalNotes',
  type: 'textarea',
  access: {
    read: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
  },
}
```

## Collections

### Current Collections (14 total)

**System**:
1. **Users** - Admin users with role-based access
2. **Media** - Cloudflare R2 storage with image optimization

**Commerce**:
3. **Products** - Piano models & all products (tabbed interface)
4. **Productlines** - Piano series/lines (CA, GX, SK, etc.)

**Content**:
5. **HomePage** - Global singleton for homepage
6. **PianosPage** - Global singleton for piano catalog
7. **Storefronts** - Dynamic dealer location pages
8. **Posts** - Blog articles with live preview
9. **Artists** - Endorsed artists & performers
10. **ConcertArtistPage** - Artist landing pages

**Business**:
11. **Dealers** - Dealer directory for locator map

**Integrations**:
12. **ConstantContactSettings** - CRM config (legacy)
13. **ConstantContactCustomFields** - CRM field mapping

**Campaigns**:
14. **KPM_Christmas2k25** - Campaign-specific leads

### Collection Pattern

```typescript
import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    group: 'Commerce',
    defaultColumns: ['name', 'type', 'category', 'status'],
  },
  access: {
    create: authenticated,
    read: anyone,
    update: authenticated,
    delete: adminOnly,
  },
  hooks: {
    afterChange: [revalidateProductPage],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Product Details',
          fields: [
            { name: 'type', type: 'select', options: ['piano', 'accessory', 'software'] },
            { name: 'name', type: 'text', required: true },
            { name: 'slug', type: 'text', unique: true, index: true },
            { name: 'category', type: 'select', options: ['digital', 'grand', 'hybrid', 'upright'] },
            { name: 'status', type: 'select', options: ['active', 'draft', 'discontinued'] },
            {
              name: 'productline',
              type: 'relationship',
              relationTo: 'productlines',
              admin: { condition: (data) => data.type === 'piano' },
            },
          ],
        },
        {
          label: 'Page Content',
          fields: [
            {
              name: 'pageContent',
              type: 'blocks',
              blocks: [ProductShowcase, Hero, ImageGallery, Specifications],
            },
          ],
        },
      ],
    },
  ],
}
```

## Hooks

### Hook Patterns Used in This Project

#### On-Demand Revalidation Hook

```typescript
// Pattern: Trigger Next.js ISR revalidation on content change
export const revalidateStorefront: CollectionAfterChangeHook = async ({
  doc,
  req,
  context,
}) => {
  // Prevent infinite loops
  if (context.skipRevalidation) return doc

  // Only revalidate active storefronts
  if (!doc.isActive) return doc

  const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Fire-and-forget pattern (don't block CMS save)
  fetch(`${baseURL}/api/revalidate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.REVALIDATION_SECRET,
      slug: doc.slug,
      type: 'storefront',
    }),
  })
    .then((res) => res.ok && console.log(`Revalidated /${doc.slug}`))
    .catch((err) => console.error('Revalidation error:', err))

  return doc
}
```

#### Multi-Path Revalidation

```typescript
// Pattern: Revalidate multiple pages when content changes
export const revalidateProduct: CollectionAfterChangeHook = async ({ doc }) => {
  const pathsToRevalidate = [
    `/products/${doc.slug}`,      // Product detail
    `/pianos/${doc.category}`,    // Category page
    '/',                          // Homepage (if featured)
  ]

  for (const path of pathsToRevalidate) {
    fetch(`${baseURL}/api/revalidate`, {
      method: 'POST',
      body: JSON.stringify({ secret, path }),
    }).catch((err) => console.error(`Failed to revalidate ${path}:`, err))
  }

  return doc
}
```

### Hook Best Practices

1. **Always pass `req`** to nested Payload operations
2. **Use context flags** to prevent infinite loops
3. **Fire-and-forget** for revalidation (don't await)
4. **Log errors gracefully** - don't throw, don't block saves
5. **Keep hooks focused** - one responsibility per hook

## Components

### Server vs Client Components

**All components are Server Components by default** (can use Local API directly):

```tsx
// Server Component (default) - src/app/(frontend)/pianos/page.tsx
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function PianosPage() {
  const payload = await getPayload({ config })
  const { docs: products } = await payload.find({
    collection: 'products',
    where: { type: { equals: 'piano' } },
    depth: 2,
  })

  return <ProductGrid products={products} />
}
```

**Client Components** need the `'use client'` directive:

```tsx
// Client Component - src/components/piano/PianoInteractive.tsx
'use client'
import { useState } from 'react'

export function PianoKeys({ onPlay }: { onPlay: () => void }) {
  const [activeKeys, setActiveKeys] = useState<number[]>([])

  return (
    <div onClick={() => onPlay()}>
      {/* Interactive piano keys */}
    </div>
  )
}
```

### Use Client Components ONLY For

- User interactions (forms, buttons, clicks)
- Browser APIs (localStorage, geolocation)
- State management (useState, useEffect)
- Third-party widgets (Calendly, Google Maps, analytics)

## Media System (Cloudflare R2)

### Configuration

```typescript
// payload.config.ts
s3Storage({
  collections: {
    'media': {
      prefix: 'media',
      disablePayloadAccessControl: true,  // Use direct R2 URLs
      generateFileURL: ({ filename, prefix }) => {
        return `${NEXT_PUBLIC_S3_PUBLIC_URL}/${prefix}/${filename}`
      },
    },
  },
  bucket: process.env.S3_BUCKET,
  config: {
    endpoint: process.env.S3_ENDPOINT,  // Cloudflare R2
    region: 'auto',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,  // Required for R2
  },
})
```

### Image Optimization

```typescript
// src/lib/media/r2-utils.ts
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'

// Usage in components
const imageProps = getImagePropsWithFallback(
  cmsImage,                              // Media | string | null
  '/images/defaults/piano-fallback.jpg', // Fallback
  'hero',                                // Preset
  {
    priority: true,
    sizes: '(max-width: 768px) 100vw, 50vw',
  }
)

return <Image {...imageProps} alt={piano.name} />
```

### Responsive Presets

```typescript
export const PIANO_RESPONSIVE_PRESETS = {
  hero: [
    { breakpoint: 320, width: 320, quality: 75, format: 'webp' },
    { breakpoint: 768, width: 768, quality: 80, format: 'webp' },
    { breakpoint: 1440, width: 1440, quality: 90, format: 'webp' },
    { breakpoint: 1920, width: 1920, quality: 90, format: 'avif' },
  ],
  gallery: [
    { breakpoint: 300, width: 300, quality: 80 },
    { breakpoint: 600, width: 600, quality: 85 },
    { breakpoint: 1200, width: 1200, quality: 90 },
  ],
  thumbnail: [150, 200, 250],
  card: [280, 350, 420, 500],
} as const
```

## Integrations

### Shopify Integration

**Purpose**: Product catalog, navigation, customer management (CRM)

**Files**: `src/lib/shopify/`
- `client.ts` - Storefront API (public)
- `admin-client.ts` - Admin API (OAuth, server-side)
- `customers.ts` - Customer upsert for CRM
- `navigation.ts` - Mega menu data extraction

```typescript
// Server action - src/lib/actions/contact-form.ts
'use server'

import { upsertCustomer } from '@/lib/shopify/customers'

export async function submitContactForm(formData: FormData) {
  // Validate with Zod
  // Upsert customer to Shopify
  await upsertCustomer({
    email: formData.get('email') as string,
    firstName: formData.get('firstName') as string,
    tags: ['inquiry', 'piano-interest'],
  })
}
```

### Google Maps Integration

**Purpose**: Dealer locator map on `/find-a-dealer`

```typescript
// Uses @googlemaps/js-api-loader + @vis.gl/react-google-maps
// API Key: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
// Displays dealers from Dealers collection with lat/lng coordinates
```

### Analytics

- **PostHog**: Product analytics (`posthog-js`)
- **Google Analytics**: Pageviews, conversions (`NEXT_PUBLIC_GA_ID`)
- **Meta Pixel**: Facebook ads tracking (`NEXT_PUBLIC_META_PIXEL_ID`)

## Common Gotchas

1. **Local API Default**: Access control bypassed unless `overrideAccess: false`
2. **Transaction Safety**: Missing `req` in nested operations breaks atomicity
3. **Hook Loops**: Operations in hooks can trigger the same hooks
4. **Field Access**: Cannot use query constraints, only boolean
5. **Relationship Depth**: Default depth is 2, set to 0 for IDs only
6. **Type Generation**: Types auto-generate on build, not during dev
7. **MongoDB Transactions**: Require replica set configuration
8. **R2 URLs**: Must use `forcePathStyle: true` for Cloudflare R2
9. **Revalidation**: Don't await fetch - use fire-and-forget pattern
10. **Bun Only**: npm causes dependency conflicts - always use bun

## TypeScript Configuration

### Path Aliases

```json
{
  "compilerOptions": {
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "paths": {
      "@/*": ["./src/*"],
      "@/domains/*": ["./src/types/domains/*"],
      "@/integrations/*": ["./src/types/integrations/*"]
    }
  }
}
```

### Import Best Practices

```typescript
// ✅ Preferred - Use TypeScript path aliases
import type { Product, Media } from '@/payload-types'
import { getOptimizedImageProps } from '@/lib/media/r2-utils'
import { cn } from '@/lib/utils'

// ✅ Type guards for runtime safety
function isMediaObject(media: Media | string | null): media is Media {
  return typeof media === 'object' && media !== null && 'url' in media
}

// ❌ Avoid relative imports across directories
import Product from '../../../collections/Products'
```

## Styling

### Tailwind CSS 4.1+

```typescript
// tailwind.config.ts
{
  theme: {
    extend: {
      colors: {
        kawai: {
          red: '#C41E3A',
          gold: '#D4AF37',
          charcoal: '#2C2C2C',
          pearl: '#F8F8F8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
}
```

### Component Variants Pattern

```tsx
import { cva } from 'class-variance-authority'

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-kawai-red text-white hover:bg-kawai-red/90",
        outline: "border border-kawai-red text-kawai-red hover:bg-kawai-red/10",
      },
      size: {
        default: "h-10 px-4 py-2",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)
```

## API Routes

### Revalidation API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/revalidate` | POST | On-demand ISR revalidation |

```typescript
// Request body
{
  "secret": "REVALIDATION_SECRET",
  "slug": "st-louis",
  "type": "storefront"
}
// OR
{
  "secret": "REVALIDATION_SECRET",
  "path": "/products/gx-7"
}
```

### Frontend Data APIs

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/home-page` | GET | Homepage data |
| `/api/pianos-page` | GET | Piano catalog data |
| `/api/piano-categories` | GET | Categories for filter |
| `/api/featured-models` | GET | Featured pianos |

## Development Workflow

### Starting Development

```bash
# Install dependencies
bun install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your values

# Start development
bun run dev

# Access points
# App: http://localhost:3000
# Admin: http://localhost:3000/admin
# GraphQL: http://localhost:3000/api/graphql-playground
```

### Environment Variables

```bash
# Database
DATABASE_URI=mongodb+srv://...

# Payload CMS
PAYLOAD_SECRET=your-secret-32-chars-minimum

# Cloudflare R2
S3_ACCESS_KEY_ID=your-r2-key
S3_SECRET_ACCESS_KEY=your-r2-secret
S3_ENDPOINT=https://{account}.r2.cloudflarestorage.com
S3_BUCKET=kawaicms
NEXT_PUBLIC_S3_PUBLIC_URL=https://pub-{account}.r2.dev

# Revalidation
REVALIDATION_SECRET=your-revalidation-secret-32-chars
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Shopify (if using)
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_APP_CLIENT_SECRET=shpss_...

# Analytics
NEXT_PUBLIC_GA_ID=G-xxxxxxxxxx
NEXT_PUBLIC_META_PIXEL_ID=your-pixel-id
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-maps-key
```

## Business Context

### KAWAI Piano Platform

KAWAI is a unified business platform for Kawai Piano Corporation:

- **Piano Retail**: Product catalog, finder, comparison tools
- **Dealer Management**: Dynamic dealer pages with location customization
- **Lead Generation**: Assessment flows, CRM integration (Shopify)
- **Content Marketing**: Blog, artist showcases, educational content

### Piano Product Lines

- **Digital**: CA Series, CN Series, ES Series, KDP Series ($999-$6,399)
- **Hybrid**: Novus Series, AnyTime Silent ($9,500-$14,500)
- **Grand**: Shigeru Kawai SK, GX Series, GL Series ($18,900-$200K+)
- **Upright**: K Series Professional, ND Series

### Key Data Flows

1. **Product Discovery**: Homepage → /pianos → /pianos/[category] → /products/[slug]
2. **Dealer Locator**: /find-a-dealer → Google Maps → Dealer detail
3. **Lead Capture**: Contact form → Shopify customer → CRM
4. **Content Updates**: CMS edit → afterChange hook → ISR revalidation

## Resources

- **Payload Docs**: https://payloadcms.com/docs
- **Payload LLM Context**: https://payloadcms.com/llms-full.txt
- **Project Admin**: http://localhost:3000/admin
- **GraphQL Playground**: http://localhost:3000/api/graphql-playground
- **Project Docs**: `/docs/` directory (Shopify, Constant Contact, etc.)
