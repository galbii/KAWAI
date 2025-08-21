# KAWAI Piano Website - AI Agent Context

## Core Technology Stack
- **Framework**: Next.js 15 with React 19 (ESM modules)
- **CMS**: Payload CMS 3.52+ with MongoDB 
- **Storage**: Cloudflare R2 via `@payloadcms/storage-s3` adapter
- **Package Manager**: **Bun** (NEVER use npm - use `bun run` commands)
- **Image Processing**: Sharp.js + Cloudflare Image Resizing
- **Styling**: Tailwind CSS 4.1+ with custom brand components
- **TypeScript**: Full type safety with auto-generated payload-types.ts

## Build Commands
```bash
bun run dev          # Development server
bun run build        # Production build 
bun run start        # Production server
bun run lint         # ESLint check
bun run seed         # Seed database with demo data
```

## Architecture Overview

### Media System (Critical) - Unified R2 Optimization
- **Direct R2 URLs**: Bypasses Payload proxying (`disablePayloadAccessControl: true`)
- **Unified Processing**: ALL media (Payload objects + strings) use R2 optimization pipeline
- **Custom URL Generation**: `generateFileURL` function in payload.config.ts:71-108  
- **Smart Optimization**: Piano-specific responsive presets in src/lib/media/r2-utils.ts
- **Progressive Enhancement**: LQIP, lazy loading, error retry logic for all media
- **Components**: MediaRenderer (auto-detection), ResponsiveImage (unified optimization)

### Collections Structure
```
src/collections/
├── Media.ts           # Advanced media with variants, video metadata, SEO
├── Products.ts        # Dynamic pages with blocks, pricing, finishes
├── PianoModels.ts     # Model specs, features, gallery
├── PianosPage.ts      # CMS-driven piano category pages
├── Productlines.ts    # Product series/categories
└── Users.ts           # Admin users
```

### Content Blocks System
```
src/blocks/
├── Hero.ts            # Hero sections with media
├── ProductShowcase.ts # Product displays
├── ImageGallery.ts    # Media galleries
├── FeaturesList.ts    # Feature lists
├── Specifications.ts  # Technical specs
├── CallToAction.ts    # CTA sections
├── Testimonials.ts    # Reviews/testimonials
└── TextContent.ts     # Rich text content
```

### Frontend Architecture
```
src/app/(frontend)/   # Public website
├── page.tsx         # Homepage
├── pianos/
│   ├── page-cms.tsx    # CMS-driven piano pages (primary)
│   ├── digital/        # Digital piano category
│   ├── grand/          # Grand piano category
│   ├── hybrid/         # Hybrid piano category
│   └── upright/        # Upright piano category
└── [other pages]/

src/app/(payload)/    # Admin interface
├── admin/           # Payload admin UI
└── api/             # Payload API routes
```

## Environment Configuration

### Required Environment Variables
```bash
# Database
DATABASE_URI=mongodb+srv://...
PAYLOAD_SECRET=your-secret-key

# Cloudflare R2 Storage  
S3_ACCESS_KEY_ID=your-r2-access-key
S3_SECRET_ACCESS_KEY=your-r2-secret-key
S3_ENDPOINT=https://account-id.r2.cloudflarestorage.com
S3_BUCKET=your-bucket-name
S3_REGION=auto

# Frontend R2 Access (Critical)
NEXT_PUBLIC_S3_PUBLIC_URL=https://pub-subdomain.r2.dev
```

## Media System Implementation

### Architecture Overview
The media system uses a **unified optimization pipeline** where all media types flow through the same R2 optimization system:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│  Payload CMS    │    │  ResponsiveImage │    │  Cloudflare R2 +    │
│  Media Objects  │───▶│  Component       │───▶│  Image Resizing     │
│  + String URLs  │    │  (Unified Path)  │    │  Transformations    │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
```

### Key Files
- **src/payload.config.ts:71-108** - R2 storage configuration with `generateFileURL`
- **src/lib/media/r2-utils.ts** - R2 optimization utilities and responsive presets
- **src/components/ui/media/MediaRenderer.tsx** - Universal media component (auto-detection)
- **src/components/ui/media/ResponsiveImage.tsx** - **UNIFIED** optimization for all media types
- **next.config.js:10-16** - R2 domain whitelist for Next.js Image

### Media Processing Flow
1. **Payload CMS**: Stores files in R2, generates basic URLs via `generateFileURL`
2. **Frontend Components**: Extract filename from any media source
3. **R2 Utils**: Apply responsive presets, transformations, and progressive enhancement
4. **Cloudflare**: Delivers optimized images with on-the-fly resizing

### Media Responsive Presets
```typescript
PIANO_RESPONSIVE_PRESETS = {
  hero: [320w, 768w, 1024w, 1440w, 1920w],    # Hero images
  gallery: [300w, 600w, 800w, 1200w],        # Gallery images  
  thumbnail: [150w, 200w, 250w],             # Thumbnails
  card: [280w, 400w, 500w]                   # Product cards
}
```

### Critical Implementation Details
- **ALL media uses `getOptimizedImageProps()`** - No separate code paths
- **Media objects** and **string URLs** both get responsive presets + LQIP + lazy loading
- **Cloudflare transformations** applied automatically (WebP/AVIF, quality, fit)
- **Error handling** with retry logic and fallback images

### Usage Patterns
```tsx
// Auto-detecting media renderer - works with ANY media type
<MediaRenderer media={mediaItem} preset="gallery" priority={index < 3} />

// Direct responsive image - unified optimization for Payload objects or strings  
<ResponsiveImage 
  media={heroImage}        // Can be Media object OR string URL
  preset="hero" 
  priority={true}
  aspectRatio="16/9"
/>
```

### Maintenance Guidelines
- **Never bypass `getOptimizedImageProps()`** - all media must use this function
- **Always use presets** - don't hardcode image dimensions
- **Test with both Media objects and string URLs** - system handles both identically
- **Environment variables are critical** - `NEXT_PUBLIC_S3_PUBLIC_URL` must be set

## Development Patterns

### Collection Schema Pattern
Collections use TypeScript with rich field types:
- **Conditional fields** based on mediaType/category
- **Relationship fields** for cross-references
- **Upload fields** with R2 integration
- **Block fields** for dynamic page building
- **SEO metadata groups**

### Component Patterns
- **Server Components** for data fetching (page-server.tsx)
- **Client Components** for interactivity ('use client')
- **Error Boundaries** with graceful fallbacks
- **Loading States** with skeleton UIs
- **Progressive Enhancement** (works without JS)

### File Organization
```
src/
├── app/              # Next.js App Router
├── collections/      # Payload CMS collections
├── blocks/          # Reusable content blocks
├── components/      # React components
│   ├── ui/          # Reusable UI components
│   ├── homepage/    # Homepage-specific
│   ├── piano/       # Piano-specific components
│   └── layout/      # Layout components
├── lib/             # Utilities and hooks
│   ├── media/       # Media system utilities
│   └── [other]/     # Other utilities
└── styles/          # Custom CSS and brand components
```

## Content Management

### CMS-Driven Pages
- **src/app/(frontend)/pianos/page-cms.tsx** - Primary piano pages with blocks
- **Dynamic blocks** for flexible page building
- **SEO optimization** with meta fields
- **Media variants** for responsive design

### Admin Experience
- **Payload Admin** at `/admin` route
- **Organized by groups**: Products, Media, Content
- **Rich text editor** with Lexical
- **Conditional fields** based on content type
- **File upload** directly to R2

## Performance Optimizations

### Image Optimization
- **Cloudflare Image Resizing** for on-demand transformations
- **WebP/AVIF** format conversion
- **Smart lazy loading** with Intersection Observer
- **LQIP placeholders** for progressive loading
- **Error retry logic** with exponential backoff

### Build Optimizations
- **ESM modules** for tree shaking
- **Dynamic imports** for code splitting
- **Image optimization** via Next.js Image
- **Static generation** where possible

## Testing & Quality

### Code Quality
- **TypeScript strict mode** enabled
- **ESLint** configured (ignored during builds for deployment)
- **Auto-generated types** from Payload schema
- **Component prop validation**

### Error Handling
- **Media load errors** with fallback images
- **Network timeouts** with retry logic
- **Missing environment variables** with helpful errors
- **Development debugging** with console warnings

## Important Constraints

### Development Rules
- **NEVER use npm** - always use `bun run` commands
- **ALWAYS prefer editing existing files** over creating new ones
- **NEVER create documentation files** unless explicitly requested
- **Use existing components** before creating new ones

### Media System Rules (Updated Architecture)
- **R2 URLs are direct** - don't proxy through Payload (`disablePayloadAccessControl: true`)
- **ALL media uses unified pipeline** - both Payload objects and strings go through `getOptimizedImageProps()`
- **Always use responsive presets** - never hardcode dimensions, leverage PIANO_RESPONSIVE_PRESETS
- **Environment variables critical** - `NEXT_PUBLIC_S3_PUBLIC_URL` must be properly configured
- **File paths** use forward slashes consistently
- **Never create separate optimization paths** - maintain the unified system

### Performance Rules
- **Hero images** should use `priority={true}`
- **Below-fold images** should lazy load
- **Large images** should use appropriate presets
- **Error states** should be user-friendly

## Troubleshooting

### Common Issues
1. **Images not loading**: Check NEXT_PUBLIC_S3_PUBLIC_URL configuration
2. **Media not optimized**: Ensure all images use MediaRenderer or ResponsiveImage components
3. **Build failures**: Ensure bun is used instead of npm
4. **Type errors**: Run `bun run build` to regenerate payload-types.ts
5. **Media errors**: Verify R2 credentials and bucket configuration
6. **Inconsistent optimization**: Check that `getOptimizedImageProps()` is being used

### Debug Tools & Monitoring
- **R2 URL validation**: Built into r2-utils.ts (`isR2Url()`, `validateMediaUrl()`)
- **Performance monitoring**: Image load time tracking via `trackImageLoad()`
- **Development warnings**: Console warnings for missing media or invalid URLs
- **Error boundaries**: Visual feedback for component failures
- **Network tab**: Verify R2 URLs include transformation parameters (width, quality, format)

### Media System Verification
To verify the unified media system is working:
1. **Check URLs in browser Network tab** - should see R2 URLs with `?width=` parameters
2. **Verify responsive behavior** - different image sizes loaded at different breakpoints  
3. **Confirm LQIP loading** - blurred placeholder briefly visible before full image
4. **Test with both Media objects and string URLs** - both should produce optimized results

## Recent Updates (August 2025)

### Media System Unification
**Problem Solved**: Media objects from Payload collections were bypassing R2 optimization and using basic Next.js Image rendering, while string URLs got full R2 optimization with responsive presets and progressive enhancement.

**Solution Implemented**:
- **Unified ResponsiveImage component** (src/components/ui/media/ResponsiveImage.tsx:217) - removed dual code paths
- **All media types** now use `getOptimizedImageProps()` for consistent R2 optimization
- **Enhanced r2-utils.ts** to better handle Media object metadata (dimensions, alt text)
- **Removed debug system** to prevent undefined media errors

**Key Changes**:
```typescript
// Before: Separate handling
if (isMediaObject) { /* Basic Next.js Image */ }
else if (isStringUrl) { /* R2 optimization */ }

// After: Unified handling  
if ((isMediaObject && mediaUrl) || (isStringUrl && mediaUrl)) {
  // ALL media uses getOptimizedImageProps() for R2 optimization
}
```

**Impact**:
- ✅ Payload collection media now gets responsive presets, LQIP, lazy loading
- ✅ Consistent Cloudflare Image Resizing for all media
- ✅ Better performance and user experience across the site
- ✅ Simpler, more maintainable codebase with single optimization pipeline

---

This system is optimized for piano retail with sophisticated media handling, content management flexibility, and performance optimization for high-quality product imagery.