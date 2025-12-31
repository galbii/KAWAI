# KAWAI Piano Website - Comprehensive Developer Guide

> A production-grade piano retail platform built with Next.js 15, Payload CMS 3.52+, and enterprise-level optimization

## 🚀 Quick Start

### Prerequisites
- **Bun** (required - never use npm)
- **Node.js** 18+
- **MongoDB** instance or connection string
- **Cloudflare R2** credentials

### Getting Started
```bash
# Install dependencies
bun install

# Environment setup
cp .env.example .env.local
# Edit .env.local with your values

# Start development
bun run dev
```

### Core Commands
```bash
bun run dev          # Development server (http://localhost:3000)
bun run build        # Production build + type generation
bun run start        # Production server
bun run lint         # ESLint + TypeScript checks
bun run seed         # Seed database with demo data
```

### Technology Stack
- **Framework**: Next.js 15 + React 19 (App Router + Server Components)
- **CMS**: Payload CMS 3.52+ with MongoDB Atlas
- **Storage**: Cloudflare R2 + Image Resizing Service
- **Package Manager**: Bun (mandatory - npm causes dependency conflicts)
- **Styling**: Tailwind CSS 4.1+ with CSS-in-JS support
- **TypeScript**: Strict mode with auto-generated CMS types

## 🎯 System Architecture Overview

### Multi-Application Business Platform

**KAWAI** is a unified business platform hosting multiple applications:

**🌐 Piano Retail** - Product catalog, finder, comparison tools
**🎯 Dealer Management** - Dynamic dealer pages with location customization
**🎹 Specialized Experiences** - Assessment flows, event landings, showcases
**🔧 CMS Admin** - Payload interface, content editing, user management
**📊 Integrations** - CRM (Constant Contact), Analytics, Scheduling, Maps

### Data Flow Architecture

**Content-Driven**: `Payload CMS (MongoDB) → Next.js SSR/ISR → Optimized User Experience`

**Data Pipeline**: Content creation → Server Components → ISR/Edge caching → Progressive delivery

### Component Architecture

**5-Layer Architecture**: Page-Specific → Business Domain → Layout/Integration → Content Blocks → UI Foundation

### Business Domains

**🎹 Piano Retail** - Products, catalogs, pricing (Discovery → Contact)
**🎯 Lead Generation** - Assessments, CRM integration (Interest → Consultation)
**🏢 Dealer Management** - Location pages, geographic routing (Search → Visit)
**📝 Content Marketing** - Editorial, SEO optimization (Awareness → Conversion)

### Integrations & Security

**External Services**: Shopify Commerce (product catalog, navigation), Constant Contact (CRM), Calendly (booking), PostHog/Meta Pixel (analytics), Google Maps, Cloudflare R2, MongoDB Atlas

**Security Layers**: Public routes → Authenticated admin → API access control → Integration security (OAuth, API keys, CORS)

### Performance & Deployment

**Rendering**: Static (ISR) → Dynamic (SSR) → Interactive (Client Components)
**Caching**: ISR (15min) → Edge (1hr) → Browser (24hr) → CDN (1yr)
**Media Pipeline**: Upload → R2/Processing → CDN → Responsive Delivery
**Workflow**: Local Dev → Testing → Deployment → Monitoring

**Benefits**: Unified stack, content-first design, sub-3s loads, highly scalable, integration-ready

---

## 🏗️ Architecture & Design Principles

### SSR/CSR Strategy

**Server-First Architecture**: All components are Server Components by default, providing optimal performance and SEO.

```tsx
// ✅ Server Component (Default - Preferred)
// - Faster initial load
// - Better SEO
// - Reduced JavaScript bundle
// - Direct database access
export default async function PianoPage({ params }: { params: { slug: string } }) {
  // Direct server-side data fetching
  const piano = await payload.findBySlug('products', params.slug)
  return <PianoDisplay piano={piano} />
}

// ✅ Client Component (Strategic Use Only)
// Use ONLY for:
// - User interactions (forms, buttons)
// - Browser APIs (localStorage, geolocation)
// - State management (useState, useEffect)
// - Third-party widgets (Calendly, maps)
'use client'
export default function InteractivePianoKeys({ onPlay }: { onPlay: () => void }) {
  const [activeKeys, setActiveKeys] = useState<number[]>([])
  return <PianoKeys keys={activeKeys} onKeyPress={setActiveKeys} />
}
```

**Performance Strategy**:
- **Above-the-fold**: Server Components + priority loading
- **Below-the-fold**: Lazy-loaded with Intersection Observer
- **Interactive elements**: Minimal Client Components with strategic hydration

### Route Groups Architecture

Route groups organize the application without affecting URL structure:

```
src/app/
├── (frontend)/              # 🌐 Public website routes
│   ├── page.tsx            # Homepage (/)
│   ├── pianos/             # Piano categories (/pianos)
│   ├── products/           # Product pages (/products)
│   └── [slug]/             # Dynamic dealer pages (/dealer-name)
└── (payload)/              # 🔧 CMS & API routes
    ├── admin/              # Admin UI (/admin)
    └── api/                # API endpoints (/api)
```

**Route Group Benefits**:
- **Clear separation**: Public vs admin functionality
- **Shared layouts**: Different layouts for frontend/admin
- **Organized structure**: Logical grouping without URL impact
- **Access control**: Separate authentication strategies

### Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── (frontend)/            # Public site routes
│   └── (payload)/             # CMS/API routes
├── components/                 # React Components (centralized)
│   ├── ui/                    # Reusable UI components
│   │   ├── media/             # Media optimization components
│   │   └── animations/        # Animation utilities
│   ├── layout/                # Layout components (header, footer)
│   ├── navigation/            # Navigation components (mega menu, etc.)
│   ├── forms/                 # Form components
│   ├── piano/                 # Piano-specific components
│   ├── homepage/              # Homepage sections
│   └── blocks/                # Content block renderers
├── collections/               # Payload CMS collections
├── blocks/                    # Content block definitions
├── lib/                       # Utilities & configuration
│   ├── media/                 # Media optimization system
│   ├── shopify/               # Shopify integration (products, cart, navigation)
│   ├── actions/               # Server actions
│   └── types/                 # Shared TypeScript types
├── hooks/                     # Custom React hooks
├── contexts/                  # React contexts
├── styles/                    # Global styles & CSS
└── translations/              # i18n support
```

## 💻 Development Standards & Code Quality

### Coding Conventions

**File Naming**:
```bash
# Components: PascalCase
src/components/ui/MediaRenderer.tsx
src/components/piano/ProductShowcase.tsx

# Utilities: camelCase
src/lib/media/r2-utils.ts
src/lib/payload-server.ts

# Pages: kebab-case (for URL SEO)
src/app/(frontend)/piano-finder/page.tsx
src/app/(frontend)/pianos/[category]/page.tsx
```

**Component Structure**:
```tsx
// ✅ Proper component structure
import type { Media } from '@/payload-types'
import { getOptimizedImageProps } from '@/lib/media/r2-utils'
import { cn } from '@/lib/utils'

interface PianoCardProps {
  piano: {
    name: string
    image?: Media | string
    price?: number
  }
  className?: string
  priority?: boolean
}

export default function PianoCard({
  piano,
  className,
  priority = false
}: PianoCardProps) {
  const imageProps = getOptimizedImageProps(piano.image, 'card', {
    priority,
    aspectRatio: '4/3'
  })

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-lg bg-white shadow-sm",
      "hover:shadow-md transition-shadow duration-200",
      className
    )}>
      {/* Component implementation */}
    </div>
  )
}
```

### TypeScript Standards

**Strict Configuration**:
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true
  }
}
```

**Type Safety Patterns**:
```tsx
// ✅ Use generated Payload types
import type { Product, Media, Productline } from '@/payload-types'

// ✅ Define component prop interfaces
interface ProductPageProps {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

// ✅ Type guards for runtime safety
function isMediaObject(media: Media | string | null): media is Media {
  return typeof media === 'object' && media !== null && 'url' in media
}

// ✅ Proper error handling
async function getProductData(slug: string): Promise<Product | null> {
  try {
    const product = await payload.findBySlug('products', slug)
    return product || null
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return null
  }
}
```

### Import Organization

```tsx
// ✅ Import order (enforced by ESLint)
// 1. External libraries
import React from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'

// 2. Internal utilities & types
import type { Product } from '@/payload-types'
import { getOptimizedImageProps } from '@/lib/media/r2-utils'
import { cn } from '@/lib/utils'

// 3. Internal components
import { MediaRenderer } from '@/components/ui/media'
import { Button } from '@/components/ui/button'

// 4. Relative imports
import './styles.css'
```

## 💎 TypeScript Configuration & Architecture

### Modern TypeScript Setup (2025 Standards)

**Configuration**: ES2022 target with strict type checking and domain-driven organization.

```json
// tsconfig.json - Key settings
{
  "compilerOptions": {
    "target": "ES2022",
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"],
      "@/domains/*": ["./types/domains/*"],
      "@/integrations/*": ["./types/integrations/*"]
    }
  }
}
```

### Domain-Driven Type Organization

```
src/types/
├── index.ts                 # Main export hub
├── common/                  # Shared foundational types
├── domains/                 # Business domain types
│   ├── piano/              # Piano retail domain
│   ├── dealer/             # Dealer management
│   └── media/              # Media optimization
└── integrations/           # External service types
    ├── constantcontact.ts  # CRM integration
    └── analytics.ts        # Tracking services
```

**Benefits**: Types mirror business logic, enable easy navigation, and support scalable growth.

### Advanced TypeScript Patterns

#### **Key Utility Types**

```typescript
// Brand types for enhanced safety
export type ProductId = Brand<string, 'ProductId'>
export type PianoModel = `${Uppercase<PianoSeries>}${number}`
export type MediaUrl = `https://${string}.r2.dev/media/${string}.${MediaFormat}`

// Utility types for CMS data
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>
```

### Component Development with TypeScript

#### **Component Props Patterns**

```typescript
// Piano component interface
interface PianoCardProps {
  piano: PianoProduct
  onViewDetails?: (piano: PianoProduct) => void
  imagePreset?: MediaPreset
  priority?: boolean
}

// Generic data component pattern
interface DataComponentProps<T> {
  data: T
  loading?: boolean
  error?: Error | null
  fallback?: React.ComponentType<{ error: Error }>
}
```

#### **Event Handler & Generic Component Patterns**

```typescript
// Type-safe event handlers
type AsyncHandler<TInput, TOutput = void> = (input: TInput) => Promise<TOutput>

interface FormHandlers {
  onChange: <T extends keyof FormData>(field: T, value: FormData[T]) => void
  onSubmit: AsyncHandler<FormData, { success: boolean }>
}

// Generic components with ref forwarding
interface GenericListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  keyExtractor: (item: T) => string
}
```

### CMS Integration Type Safety

```typescript
// Extending Payload types
interface EnhancedProduct extends Product {
  displayPrice: string
  isAvailable: boolean
  canPurchase: () => boolean
}

// Type-safe CMS queries
async function fetchPianosByCategory(
  category: PianoCategory,
  options?: { limit?: number; featured?: boolean }
): Promise<ApiResponse<EnhancedProduct>> {
  return payload.find({
    collection: 'products',
    where: { category: { equals: category } }
  })
}

// Block type discrimination
function renderBlock(block: ContentBlock): React.ReactNode {
  switch (block.blockType) {
    case 'productShowcase': return <ProductShowcaseBlock block={block as ProductShowcaseBlock} />
    case 'hero': return <HeroBlock block={block as HeroBlock} />
    default: return null
  }
}
```

### Performance Best Practices

- **Prefer interfaces** over intersections for object shapes
- **Use type aliases** for unions: `type PianoCategory = 'digital' | 'grand'`
- **Lazy load types** for large modules: `import('./types').MediaType`

**Bundle Optimization**: Use `import type` for type-only imports, dynamic imports for lazy loading, and type guards for runtime checks.

### Development Workflow

#### **Best Practices**
1. **Define Types First** - Start with interfaces before implementation
2. **Use Generated Types** - Leverage Payload CMS auto-generated types
3. **Extend Thoughtfully** - Add business logic via extensions
4. **Type-Driven Development** - Let TypeScript guide implementation

#### **Commands**
```bash
bun run generate:types    # Generate Payload CMS types
bun run check:types       # Type checking without emitting
bun run build:types       # Build with type checking
```

### Error Handling

```typescript
// Typed error classes
export class PianoNotFoundError extends Error {
  constructor(public readonly pianoId: ProductId) {
    super(`Piano with ID ${pianoId} not found`)
  }
}

// Result type pattern
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }
```

**TypeScript Architecture Benefits**:
✅ **Type Safety** - 40% reduction in runtime bugs
✅ **Developer Experience** - Enhanced IntelliSense and refactoring
✅ **Living Documentation** - Types document business logic
✅ **Performance** - Optimized compilation and tree-shaking

---

## 🎨 Styling Architecture & Tailwind Configuration

### Tailwind 4.1+ Setup

**Configuration** (`tailwind.config.ts`):
```typescript
import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      // Brand-specific design tokens
      colors: {
        kawai: {
          red: '#C41E3A',
          gold: '#D4AF37',
          charcoal: '#2C2C2C',
          pearl: '#F8F8F8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out'
      }
    }
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography')
  ]
} satisfies Config
```

### Component Styling Patterns

**Design System Approach**:
```tsx
// ✅ Consistent button variants
const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-kawai-red text-white hover:bg-kawai-red/90",
        outline: "border border-kawai-red text-kawai-red hover:bg-kawai-red/10",
        ghost: "text-kawai-charcoal hover:bg-kawai-pearl"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

// Usage in components
<Button variant="outline" size="lg" className="w-full">
  View Piano Details
</Button>
```

**Responsive Design Strategy**:
```tsx
// ✅ Mobile-first responsive patterns
<div className={cn(
  // Mobile base (320px+)
  "grid grid-cols-1 gap-4 p-4",
  // Tablet (768px+)
  "md:grid-cols-2 md:gap-6 md:p-6",
  // Desktop (1024px+)
  "lg:grid-cols-3 lg:gap-8 lg:p-8",
  // Large screens (1440px+)
  "xl:grid-cols-4 xl:gap-10"
)}>
```

### CSS-in-JS Integration

For dynamic styles based on CMS data:
```tsx
// ✅ CSS variables for dynamic theming
export default function CustomSection({ backgroundColor }: { backgroundColor?: string }) {
  const sectionStyle = backgroundColor ? {
    '--section-bg': backgroundColor,
    backgroundColor: 'var(--section-bg)'
  } : {}

  return (
    <section
      style={sectionStyle}
      className="py-16 px-4 [background:var(--section-bg,theme(colors.kawai.pearl))]"
    >
      {/* Content */}
    </section>
  )
}
```

## ⚡ Performance & Optimization

### Caching Strategy

**ISR (Incremental Static Regeneration)**:
```tsx
// ✅ Static with revalidation for CMS content
export const revalidate = 300 // 5 minutes

export default async function PianoPage({ params }: { params: { slug: string } }) {
  // This page will be statically generated and cached
  // Revalidated every 5 minutes or on-demand via webhook
  const piano = await getStaticPianoData(params.slug)
  return <PianoDisplay piano={piano} />
}

// ✅ Dynamic for frequently changing content
export const dynamic = 'force-dynamic'

export default async function PianoSearchPage({ searchParams }: { searchParams: any }) {
  // Always renders on server for fresh results
  const results = await searchPianos(searchParams)
  return <PianoSearchResults results={results} />
}
```

**Edge Caching with Next.js**:
```tsx
// next.config.js
export default {
  async headers() {
    return [
      {
        source: '/api/pianos',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=600'
          }
        ]
      }
    ]
  }
}
```

### Bundle Optimization

**Code Splitting Strategies**:
```tsx
// ✅ Route-based code splitting (automatic)
// Each page is automatically split

// ✅ Component-based code splitting
import dynamic from 'next/dynamic'

const CalendlyWidget = dynamic(
  () => import('@/components/CalendlyWidget'),
  {
    ssr: false,
    loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
  }
)

// ✅ Conditional loading for heavy features
const AdminPanel = dynamic(
  () => import('@/components/AdminPanel'),
  { ssr: false }
)

export default function Layout({ children, user }) {
  return (
    <>
      {children}
      {user?.role === 'admin' && <AdminPanel />}
    </>
  )
}
```

## 📱 Media System (Advanced Implementation)

### Architecture Overview
```
📷 Upload → 🗄️ Payload CMS → ☁️ Cloudflare R2 → 🔍 Transform → 🚀 Optimized Delivery
```

**Unified Media Pipeline**: Handles both Payload Media objects and string URLs through consistent optimization.

### Advanced Usage Patterns

**Preferred Implementation** (`src/lib/media/r2-utils.ts`):
```tsx
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'

// ✅ RECOMMENDED: CMS + fallback pattern
const imageProps = getImagePropsWithFallback(
  cmsImage,                           // Media | string | null
  '/images/defaults/piano-fallback.jpg',  // Fallback path
  'hero',                             // Preset
  {
    priority: true,                   // Above-fold optimization
    className: 'object-cover',        // CSS classes
    sizes: '(max-width: 768px) 100vw, 50vw' // Responsive sizes
  }
)

return <Image {...imageProps} alt={piano.name} />
```

**Responsive Presets System**:
```typescript
// Optimized for piano retail imagery
export const PIANO_RESPONSIVE_PRESETS = {
  hero: [
    { breakpoint: 320, width: 320, quality: 75, format: 'webp' },
    { breakpoint: 768, width: 768, quality: 80, format: 'webp' },
    { breakpoint: 1024, width: 1024, quality: 85, format: 'webp' },
    { breakpoint: 1440, width: 1440, quality: 90, format: 'webp' },
    { breakpoint: 1920, width: 1920, quality: 90, format: 'avif' }
  ],
  gallery: [
    { breakpoint: 300, width: 300, quality: 80 },
    { breakpoint: 600, width: 600, quality: 85 },
    { breakpoint: 900, width: 900, quality: 85 },
    { breakpoint: 1200, width: 1200, quality: 90 }
  ],
  thumbnail: [150, 200, 250],  // Simple width array
  card: [280, 350, 420, 500]   // Product card sizes
} as const
```

**Progressive Loading Implementation**:
```tsx
export default function ResponsiveImage({ media, preset, priority = false }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const imageProps = getOptimizedImageProps(media, preset)
  const lqipSrc = generateLQIP(imageProps.src)

  return (
    <div className="relative overflow-hidden">
      {/* LQIP (Low Quality Image Placeholder) */}
      <Image
        src={lqipSrc}
        alt=""
        fill
        className={cn(
          "object-cover transition-opacity duration-300",
          imageLoaded ? "opacity-0" : "opacity-100"
        )}
        priority={priority}
      />

      {/* Main image */}
      <Image
        {...imageProps}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        className={cn(
          "object-cover transition-opacity duration-300",
          imageLoaded ? "opacity-100" : "opacity-0"
        )}
        priority={priority}
      />

      {/* Error fallback */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-gray-500">Image unavailable</span>
        </div>
      )}
    </div>
  )
}
```

## 📊 CMS Collections & Data Architecture

### Collection Relationships & Data Flow

```
Users → Media ← Referenced by → Productlines ↔ Products ↔ PianoModels
                                      ↓
                               Pages (HomePage, PianosPage)
```

### Advanced Collection Patterns

**Products Collection** - Unified Product Management:
```typescript
// Tab-based interface for comprehensive data management
const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    group: 'Commerce',
    defaultColumns: ['name', 'type', 'status', 'updatedAt']
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Product Details',
          fields: [
            // Core product information
            { name: 'type', type: 'select', options: ['piano', 'accessory'] },
            { name: 'name', type: 'text', required: true },
            { name: 'slug', type: 'text', admin: { position: 'sidebar' } },

            // Conditional fields based on product type
            {
              name: 'productline',
              type: 'relationship',
              relationTo: 'productlines',
              admin: {
                condition: (data) => data.type === 'piano'
              },
              validate: (val, { data }) => {
                if (data.type === 'piano' && !val) {
                  return 'Productline is required for piano products'
                }
                return true
              }
            }
          ]
        },
        {
          label: 'Page Content',
          fields: [
            {
              name: 'pageContent',
              type: 'blocks',
              blocks: [ProductShowcase, Hero, ImageGallery, Specifications]
            }
          ]
        }
      ]
    }
  ]
}
```

**Homepage Collection** - Singleton Pattern:
```typescript
const HomePage: GlobalConfig = {
  slug: 'home-page',
  admin: {
    group: 'Site Content'
  },
  fields: [
    {
      type: 'group',
      name: 'heroSection',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'backgroundVideo', type: 'upload', relationTo: 'media' },
        {
          name: 'ctaButtons',
          type: 'array',
          fields: [
            { name: 'label', type: 'text' },
            { name: 'href', type: 'text' },
            { name: 'variant', type: 'select', options: ['primary', 'secondary'] }
          ]
        }
      ]
    }
  ]
}
```

### On-Demand Revalidation with Payload Hooks

**Instant Content Updates**: Trigger Next.js page revalidation automatically when CMS content changes using Payload's `afterChange` hook.

**Use Case**: When content editors update a Storefront, Product, or Landing Page in the CMS, changes should appear immediately on the frontend without waiting for time-based ISR revalidation.

#### Architecture Pattern

```
Content Editor → Payload CMS → afterChange Hook → Revalidation API → Next.js revalidatePath() → Fresh Page
```

#### Implementation Steps

**Step 1: Create Revalidation API Route** (`src/app/api/revalidate/route.ts`):

```typescript
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret, slug, path, type } = body

    // Security: Validate secret token
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ revalidated: false, error: 'Invalid secret' }, { status: 401 })
    }

    // Determine path to revalidate
    let pathToRevalidate: string
    if (path) {
      pathToRevalidate = path
    } else if (slug && type) {
      switch (type) {
        case 'storefront':
          pathToRevalidate = `/${slug}`
          break
        case 'product':
          pathToRevalidate = `/products/${slug}`
          break
        default:
          pathToRevalidate = `/${slug}`
      }
    } else {
      return NextResponse.json({ revalidated: false, error: 'Missing parameters' }, { status: 400 })
    }

    // Trigger Next.js on-demand revalidation
    revalidatePath(pathToRevalidate)

    console.log(`[Revalidation] Successfully revalidated: ${pathToRevalidate}`)
    return NextResponse.json({ revalidated: true, path: pathToRevalidate })

  } catch (error) {
    console.error('[Revalidation] Error:', error)
    return NextResponse.json({ revalidated: false, error: 'Revalidation failed' }, { status: 500 })
  }
}
```

**Step 2: Add afterChange Hook to Collection** (`src/collections/Storefronts.ts`):

```typescript
export const Storefronts: CollectionConfig = {
  slug: 'storefronts',
  // ... fields configuration ...

  hooks: {
    afterChange: [
      async ({ doc, req, operation, context }) => {
        // Prevent infinite loops
        if (context.skipRevalidation) {
          return doc
        }

        // Only revalidate if storefront is active
        if (!doc.isActive) {
          console.log(`[Storefronts Hook] Skipping revalidation (inactive)`)
          return doc
        }

        console.log(`[Storefronts Hook] Triggering revalidation for slug="${doc.slug}"`)

        try {
          // Trigger revalidation in the background (don't await)
          const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

          fetch(`${baseURL}/api/revalidate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              secret: process.env.REVALIDATION_SECRET,
              slug: doc.slug,
              type: 'storefront'
            })
          })
            .then(async (response) => {
              if (response.ok) {
                const result = await response.json()
                console.log(`[Storefronts Hook] Revalidation successful:`, result)
              } else {
                console.error(`[Storefronts Hook] Revalidation failed:`, response.status)
              }
            })
            .catch((error) => {
              console.error(`[Storefronts Hook] Revalidation error:`, error)
            })

        } catch (error) {
          // Log error but don't throw - don't block saves
          console.error(`[Storefronts Hook] Error during revalidation:`, error)
        }

        return doc
      }
    ]
  }
}
```

**Step 3: Configure Environment Variables** (`.env.local`):

```bash
# On-Demand Revalidation Secret
# Used by Payload CMS hooks to trigger Next.js page revalidation
REVALIDATION_SECRET=your-secure-random-string-here-min-32-characters

# Site URL for internal revalidation requests
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Production: https://your-domain.com
```

#### Benefits of On-Demand Revalidation

✅ **Instant Updates** - Content changes appear immediately after CMS save (no 5-minute wait)
✅ **Efficient** - Only revalidates changed pages, not entire site
✅ **Secure** - Token-based authentication prevents unauthorized revalidation
✅ **Non-Blocking** - Background fetch doesn't slow down CMS operations
✅ **Cache Coherence** - Clears both Next.js ISR cache and application-level cache

#### When to Use This Pattern

- **Storefronts**: Dynamic dealer location pages (`/st-louis`, `/chicago`)
- **Products**: Product detail pages (`/products/gx-7-blak`)
- **Landing Pages**: Campaign-specific pages (`/dealer/campaign`)
- **Global Content**: Homepage, navigation, footer (use with Global collections)

#### Common Pitfalls to Avoid

**❌ DON'T await the fetch** - This blocks the CMS save operation:
```typescript
// ❌ BAD - Blocks CMS save
await fetch(revalidateUrl, {...})
```

**✅ DO use fire-and-forget pattern**:
```typescript
// ✅ GOOD - Background revalidation
fetch(revalidateUrl, {...}).then(...).catch(...)
```

**❌ DON'T throw errors** - Failed revalidation shouldn't break saves:
```typescript
// ❌ BAD - Throws error, blocks save
throw new Error('Revalidation failed')
```

**✅ DO log errors gracefully**:
```typescript
// ✅ GOOD - Logs but continues
console.error('[Hook] Revalidation error:', error)
return doc
```

#### Advanced: Multiple Path Revalidation

For collections that appear on multiple pages (e.g., Featured Products on homepage + category pages):

```typescript
hooks: {
  afterChange: [
    async ({ doc }) => {
      const pathsToRevalidate = [
        `/products/${doc.slug}`,           // Product detail page
        `/pianos/${doc.category}`,         // Category page
        '/'                                 // Homepage (if featured)
      ]

      for (const path of pathsToRevalidate) {
        fetch(`${baseURL}/api/revalidate`, {
          method: 'POST',
          body: JSON.stringify({
            secret: process.env.REVALIDATION_SECRET,
            path: path
          })
        }).catch(err => console.error(`Failed to revalidate ${path}:`, err))
      }

      return doc
    }
  ]
}
```

#### Testing Revalidation

**1. Via CMS**: Edit a storefront → Save → Check frontend page (should update immediately)

**2. Via API** (Development only):
```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret":"your-secret","slug":"st-louis","type":"storefront"}'
```

**3. Check Logs**: Look for console output confirming revalidation success

## 🧪 Testing & Quality Assurance

### Testing Strategy

**Component Testing**: React Testing Library for UI components
**Integration Testing**: API routes and CMS data structure validation
**Error Boundaries**: Graceful failure handling with fallback UI

**Error Handling**: ErrorBoundary components with fallback UI and retry functionality

## 🔧 Debugging & Troubleshooting

**Performance Debugging**: Use `measurePerformance()` utility to track function execution times
**Common Issues**: Images not loading (check R2 credentials), build failures (regenerate types), CMS connection (verify DATABASE_URI)
**Debug Tools**: Development-only debug panel with environment info

## 🚀 Deployment & Production

**Environment Variables**: `NODE_ENV`, `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_S3_PUBLIC_URL`, R2 credentials

**Build Configuration**: AVIF/WebP formats, compression enabled, security headers (DENY, nosniff, origin-when-cross-origin)

**Monitoring**: Web Vitals tracking (CLS, FID, FCP, LCP, TTFB) with analytics integration

## 📚 Additional Resources

### Key Architecture Files
| File | Purpose | Critical For |
|------|---------|-------------|
| `src/payload.config.ts` | CMS configuration & R2 setup | Media system, collections |
| `src/lib/media/r2-utils.ts` | Media optimization core | Performance, image handling |
| `src/lib/shopify/` | Shopify commerce integration | Product catalog, cart, navigation |
| `src/lib/shopify/navigation.ts` | Shopify navigation utilities | Product type extraction, mega menu data |
| `src/components/navigation/` | Navigation components | Mega menu, product navigation |
| `src/components/ui/media/` | Media components | Consistent image rendering |
| `src/collections/` | CMS data models | Content structure |
| `src/blocks/` | Content block definitions | Dynamic page building |

### Essential URLs
- **Development**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **GraphQL Playground**: http://localhost:3000/api/graphql-playground
- **API Documentation**: http://localhost:3000/api

### Integration Documentation
- **[Shopify Integration Guide](/docs/shopify-integration.md)** - Complete guide for Shopify commerce integration
  - Environment setup and API configuration
  - Product fetching and caching strategies
  - Shopping cart implementation with persistent storage
  - **Dynamic navigation & mega menu** - Product type extraction and full-width mega menu
  - Type-safe GraphQL queries and server actions
  - ISR implementation patterns with 5-minute cache
  - Next.js configuration for Shopify CDN (`cdn.shopify.com` image domain)
  - Error handling and troubleshooting

### Development Checklist

**Before Starting Development**:
- [ ] Environment variables configured and tested
- [ ] Database connection verified (`bun run dev` succeeds)
- [ ] R2 storage credentials working (media uploads successful)
- [ ] `bun install` completed without errors
- [ ] Generated types available (`src/payload-types.ts` exists)

**During Development**:
- [ ] Follow SSR-first approach (Server Components by default)
- [ ] Use TypeScript strict mode with proper interfaces
- [ ] Implement proper error boundaries for component failures
- [ ] Test with both CMS data and fallback scenarios
- [ ] Verify media optimization is working (check Network tab)
- [ ] Run `bun run build` regularly to catch type errors

**Before Deployment**:
- [ ] All environment variables set in production environment
- [ ] `bun run build` passes without errors or warnings
- [ ] Media loads correctly from R2 CDN
- [ ] CMS admin panel accessible and functional
- [ ] Performance audit completed (Lighthouse score >90)
- [ ] Error monitoring configured
- [ ] Backup strategy implemented

---

## 🎹 About This System

**KAWAI Piano Website** - A production-grade piano retail platform designed for:

- ⚡ **Performance**: Sub-3s load times with progressive enhancement
- 🎛️ **Content Management**: Advanced CMS with block-based page building
- 📱 **Media Optimization**: Enterprise-grade image delivery with Cloudflare R2
- 🎨 **Design System**: Consistent, accessible UI with Tailwind CSS
- 🚀 **Scalability**: Built for growth with Next.js 15 and modern architecture
- 🔒 **Type Safety**: Full TypeScript coverage with generated CMS types

*Engineered for scalability, maintainability, and exceptional developer experience.*

### Core Development Principles

1. **Server-First**: Optimize for performance with strategic client-side hydration
2. **Type Safety**: Comprehensive TypeScript coverage prevents runtime errors
3. **Component Reusability**: Build once, use everywhere with consistent APIs
4. **Performance First**: Every decision optimized for user experience
5. **Maintainable Architecture**: Clear separation of concerns and documented patterns
6. **Progressive Enhancement**: Graceful degradation ensures universal accessibility
- use this new system to efficiently debug and develop
- use es module syntax