# NAMM 2026 Landing Page Components

High-conversion sections for the NAMM trade show landing page built with Next.js 15, TypeScript, and Tailwind CSS.

## Components Overview

### 1. FeaturedProductsSection

**Purpose**: Showcase key pianos that will be at NAMM 2026 (highest conversion intent)

**File**: `src/components/namm/FeaturedProductsSection.tsx`

**Features**:
- Responsive grid layout (1/2/4 columns)
- Product cards with hover effects (lift, shadow, scale)
- Optimized images with lazy loading
- Scroll-triggered animations
- TypeScript interfaces for CMS integration

**Usage**:
```tsx
import { FeaturedProductsSection } from '@/components/namm'

// With default data
<FeaturedProductsSection />

// With custom data (CMS integration ready)
<FeaturedProductsSection
  title="Custom Title"
  subtitle="Custom subtitle"
  products={[
    {
      name: "Piano Name",
      category: "Piano Category",
      description: "Piano description",
      features: ["Feature 1", "Feature 2", "Feature 3"],
      imageUrl: "/path/to/image.jpg",
      productPageSlug: "piano-slug"
    }
  ]}
/>
```

**Default Products**:
1. Shigeru Kawai SK-EX Concert Grand
2. Novus NV6 Hybrid Piano
3. Novus NV12 Hybrid Piano
4. CA99 Digital Piano

---

### 2. BoothExperienceSection

**Purpose**: Communicate why visitors should prioritize the Kawai booth

**File**: `src/components/namm/BoothExperienceSection.tsx`

**Features**:
- 6 experience highlights in responsive grid
- Scroll-triggered fade-in animations
- Icon/emoji-based visual hierarchy
- Call-to-action banner with event details
- Hover effects on feature cards

**Usage**:
```tsx
import { BoothExperienceSection } from '@/components/namm'

// With default data
<BoothExperienceSection />

// With custom data (CMS integration ready)
<BoothExperienceSection
  title="Custom Title"
  subtitle="Custom subtitle"
  features={[
    {
      icon: "🎹",
      title: "Feature Title",
      description: "Feature description"
    }
  ]}
/>
```

---

## TypeScript Interfaces

**ProductCardProps**:
```typescript
interface ProductCardProps {
  name: string
  category: string
  description: string
  features: string[]
  imageUrl: string
  productPageSlug: string
}
```

**BoothFeature**:
```typescript
interface BoothFeature {
  icon: string
  title: string
  description: string
}
```

---

## Required Placeholder Images

Create these placeholder images for development:

**Path**: `/public/images/placeholders/`

1. **piano-grand.jpg** - Concert grand piano (4:3 ratio, ~1200x900px)
2. **piano-hybrid.jpg** - Hybrid piano (4:3 ratio, ~1200x900px)
3. **piano-upright-hybrid.jpg** - Upright hybrid piano (4:3 ratio, ~1200x900px)
4. **piano-digital.jpg** - Digital piano (4:3 ratio, ~1200x900px)

---

## CMS Integration Guide

### Future Integration with Payload CMS

**Fetch Data Server-Side**:
```typescript
// src/app/(frontend)/namm-2026/page.tsx
import { getPayloadClient } from '@/lib/payload-server'
import { FeaturedProductsSection } from '@/components/namm'

export default async function NAMMPage() {
  const payload = await getPayloadClient()
  const nammPage = await payload.findGlobal({ slug: 'namm-page' })

  const products = nammPage.featuredProducts.map(product => ({
    name: product.name,
    category: product.category.name,
    description: product.shortDescription,
    features: product.keyFeatures,
    imageUrl: product.media.featuredImage.url,
    productPageSlug: product.slug
  }))

  return (
    <>
      <FeaturedProductsSection products={products} />
      <BoothExperienceSection features={nammPage.boothFeatures} />
    </>
  )
}
```

---

## Performance Characteristics

### Lighthouse Scores (Target)
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

### Loading Strategy
- Server Components by default
- Client-side hydration for animations only
- Lazy loading for images
- Progressive enhancement approach

---

## SEO Keywords (Naturally Integrated)

**FeaturedProductsSection**:
- NAMM 2026, NAMM Show, piano exhibition
- Concert grand piano, hybrid piano technology, digital piano innovation
- Shigeru Kawai, PentaDrive hybrid system, Grand Feel action
- Piano demonstration, piano showcase, professional piano

**BoothExperienceSection**:
- NAMM 2026 booth, piano demonstration, live performance
- Piano showcase, trade show, music exhibition
- Hybrid piano, concert grand, digital piano
- NAMM Show 2026, Anaheim Convention Center
