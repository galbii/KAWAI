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

### Media System (Critical)
- **Direct R2 URLs**: Bypasses Payload proxying (`disablePayloadAccessControl: true`)
- **Custom URL Generation**: `generateFileURL` function in payload.config.ts:71-108
- **Smart Optimization**: Piano-specific responsive presets in src/lib/media/r2-utils.ts
- **Progressive Enhancement**: LQIP, lazy loading, error retry logic
- **Components**: MediaRenderer (auto-detection), ResponsiveImage (performance optimized)

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

### Key Files
- **src/payload.config.ts:71-108** - R2 storage configuration
- **src/lib/media/r2-utils.ts** - R2 optimization utilities
- **src/components/ui/media/MediaRenderer.tsx** - Universal media component
- **src/components/ui/media/ResponsiveImage.tsx** - Optimized image component
- **next.config.js:10-16** - R2 domain whitelist for Next.js Image

### Media Responsive Presets
```typescript
PIANO_RESPONSIVE_PRESETS = {
  hero: [320w, 768w, 1024w, 1440w, 1920w],    # Hero images
  gallery: [300w, 600w, 800w, 1200w],        # Gallery images  
  thumbnail: [150w, 200w, 250w],             # Thumbnails
  card: [280w, 400w, 500w]                   # Product cards
}
```

### Usage Patterns
```tsx
// Auto-detecting media renderer
<MediaRenderer media={mediaItem} preset="gallery" priority={index < 3} />

// Optimized responsive image
<ResponsiveImage 
  media={heroImage} 
  preset="hero" 
  priority={true}
  aspectRatio="16/9"
/>
```

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

### Media System Rules
- **R2 URLs are direct** - don't proxy through Payload
- **Responsive presets** are piano-optimized
- **Environment variables** must be properly configured
- **File paths** use forward slashes consistently

### Performance Rules
- **Hero images** should use `priority={true}`
- **Below-fold images** should lazy load
- **Large images** should use appropriate presets
- **Error states** should be user-friendly

## Troubleshooting

### Common Issues
1. **Images not loading**: Check NEXT_PUBLIC_S3_PUBLIC_URL configuration
2. **Build failures**: Ensure bun is used instead of npm
3. **Type errors**: Run `bun run build` to regenerate payload-types.ts
4. **Media errors**: Verify R2 credentials and bucket configuration

### Debug Tools
- **R2 URL validation**: Built into r2-utils.ts
- **Performance monitoring**: Image load time tracking
- **Development logging**: Console warnings for missing media
- **Error boundaries**: Visual feedback for component failures

This system is optimized for piano retail with sophisticated media handling, content management flexibility, and performance optimization for high-quality product imagery.