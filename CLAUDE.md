# KAWAI Piano Website - Developer Guide

> A modern piano retail website built with Next.js 15, Payload CMS, and advanced media optimization

## 🚀 Quick Start

### Getting Started
```bash
# Install dependencies
bun install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# Start development
bun run dev
```

### Core Commands
```bash
bun run dev          # Development server (http://localhost:3000)
bun run build        # Production build 
bun run start        # Production server
bun run lint         # ESLint check
bun run seed         # Seed database with demo data
```

### Technology Stack
- **Framework**: Next.js 15 + React 19 (Server Components + App Router)
- **CMS**: Payload CMS 3.52+ with MongoDB 
- **Storage**: Cloudflare R2 + Image Resizing
- **Package Manager**: **Bun** (⚠️ Never use npm)
- **Styling**: Tailwind CSS 4.1+
- **TypeScript**: Full type safety with auto-generated types

## 🏗️ Architecture Overview

### Project Structure
```
src/
├── app/
│   ├── (frontend)/          # 🌐 Public website
│   │   ├── page.tsx         # Homepage
│   │   ├── pianos/          # Piano categories & models
│   │   ├── artists/         # Artist pages
│   │   └── guides/          # User guides
│   └── (payload)/           # 🔧 CMS Admin
│       ├── admin/           # Payload admin UI
│       └── api/             # API routes
├── collections/             # 📊 CMS Collections
├── blocks/                  # 🧩 Content Blocks
├── components/              # ⚛️ React Components
│   ├── ui/                  # Reusable UI
│   ├── piano/               # Piano-specific
│   └── layout/              # Layout components
└── lib/                     # 🛠️ Utilities
    └── media/               # Media optimization
```

## 🎯 Development Workflow

### Adding New Content
1. **Piano Models**: Edit `src/collections/PianoModels.ts`
2. **Product Pages**: Use blocks in `src/blocks/`
3. **Media**: Upload via admin at `/admin/collections/media`

### Creating Components
```bash
# UI components
src/components/ui/[ComponentName].tsx

# Piano-specific
src/components/piano/[ComponentName].tsx

# Layout components  
src/components/layout/[ComponentName].tsx
```

### Environment Setup
```bash
# Required Variables
DATABASE_URI=mongodb+srv://...
PAYLOAD_SECRET=your-secret-key
NEXT_PUBLIC_S3_PUBLIC_URL=https://pub-subdomain.r2.dev
S3_ACCESS_KEY_ID=your-r2-access-key
S3_SECRET_ACCESS_KEY=your-r2-secret-key
S3_ENDPOINT=https://account-id.r2.cloudflarestorage.com
S3_BUCKET=your-bucket-name
S3_REGION=auto
```

## 📱 Media System (Core Feature)

### How It Works
```
📷 Upload → 🗄️ Payload CMS → ☁️ Cloudflare R2 → 🚀 Optimized Images
```

**Key Principle**: All media uses the same optimization pipeline, whether from CMS or direct URLs.

### Usage Examples
```tsx
// ✅ Auto-detecting media renderer
<MediaRenderer media={mediaItem} preset="gallery" priority={index < 3} />

// ✅ Direct responsive image  
<ResponsiveImage 
  media={heroImage}        // Can be Media object OR string URL
  preset="hero" 
  priority={true}
  aspectRatio="16/9"
/>
```

### Responsive Presets
```typescript
PIANO_RESPONSIVE_PRESETS = {
  hero: [320w, 768w, 1024w, 1440w, 1920w],    // Hero images
  gallery: [300w, 600w, 800w, 1200w],        // Gallery images  
  thumbnail: [150w, 200w, 250w],             // Thumbnails
  card: [280w, 400w, 500w]                   // Product cards
}
```

### Key Files
- `src/lib/media/r2-utils.ts` - Optimization utilities
- `src/components/ui/media/MediaRenderer.tsx` - Auto-detection
- `src/components/ui/media/ResponsiveImage.tsx` - Unified optimization
- `src/payload.config.ts:71-108` - R2 configuration

## 📊 CMS Collections Reference

### Data Hierarchy
```
Users → Media → Productlines → PianoModels → Products → PianosPage
```

### Collection Guide
| Collection | Purpose | Key Fields |
|------------|---------|------------|
| **Media** | Images, videos, assets | `mediaType`, `variants`, `seo` |
| **Users** | Admin authentication | `email`, `roles` |
| **Productlines** | Piano series (CA, SK) | `name`, `category`, `pianoModels` |
| **PianoModels** | Individual pianos | `specs`, `pricing`, `gallery` |
| **Products** | Dynamic pages | `blocks[]`, `pricing`, `seo` |
| **PianosPage** | Main piano page | `hero`, `categories`, `cta` |

### Content Blocks Available
| Block Type | Use Case | Key Props |
|------------|----------|-----------|
| **Hero** | Page headers | `title`, `media`, `cta` |
| **ProductShowcase** | Piano displays | `product`, `layout`, `pricing` |
| **ImageGallery** | Photo galleries | `images[]`, `layout`, `carousel` |
| **FeaturesList** | Feature lists | `features[]`, `icons`, `layout` |
| **Specifications** | Technical specs | `categories[]`, `downloadPDF` |
| **CallToAction** | CTAs | `title`, `description`, `buttons[]` |
| **Testimonials** | Reviews | `testimonials[]`, `layout` |
| **TextContent** | Rich text | `content`, `sidebar` |

## 🛠️ Common Development Patterns

### Component Types
```tsx
// ✅ Server Component (default)
export default async function PianoPage({ params }) {
  const data = await getPianoData(params.slug)
  return <PianoDisplay data={data} />
}

// ✅ Client Component
'use client'
export default function InteractivePiano({ onPlay }) {
  const [isPlaying, setIsPlaying] = useState(false)
  return <PianoKeys onClick={() => setIsPlaying(!isPlaying)} />
}
```

### Data Fetching Patterns
```tsx
// ✅ CMS with fallback
const data = await getCMSData() || FALLBACK_DATA

// ✅ API route usage
const response = await fetch('/api/pianos-page')
const data = await response.json()
```

### Block Development
```typescript
// src/blocks/MyBlock.ts
export const MyBlock: Block = {
  slug: 'myBlock',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'content', type: 'textarea' }
  ]
}
```

## 🐛 Troubleshooting Guide

### Common Issues & Solutions

| Issue | Check | Solution |
|-------|-------|----------|
| **Images not loading** | `NEXT_PUBLIC_S3_PUBLIC_URL` | Verify environment variable |
| **Media not optimized** | Component usage | Use `MediaRenderer` or `ResponsiveImage` |
| **Build failures** | Package manager | Use `bun run build` (never npm) |
| **Type errors** | Generated types | Run `bun run build` to regenerate |
| **CMS connection** | Database | Check `DATABASE_URI` connection |

### Debug Tools
- **Network Tab**: Look for R2 URLs with `?width=` parameters
- **Console**: Check for media warnings in development
- **Admin Panel**: Verify uploads at `/admin/collections/media`

### Performance Checks
1. **Images load with LQIP** (blurred placeholder first)
2. **Different sizes** at different breakpoints  
3. **WebP/AVIF formats** in modern browsers
4. **Lazy loading** for below-fold images

## ⚙️ Configuration References

### Media System Rules
- ✅ **Always use presets** - never hardcode dimensions
- ✅ **All media through unified pipeline** - use `getOptimizedImageProps()`
- ✅ **Hero images** - set `priority={true}`
- ❌ **Never bypass optimization** - don't use raw URLs

### Development Rules
- ✅ **Use Bun** - `bun run dev`, `bun run build`
- ✅ **Edit existing files** - prefer modification over creation
- ✅ **TypeScript strict** - maintain type safety
- ❌ **Never use npm** - will cause dependency conflicts

## 🚨 Quick Reference

### Essential Commands
```bash
bun run dev          # Start development server
bun run build        # Build for production  
bun run lint         # Check code quality
bun run seed         # Populate with demo data
```

### Key URLs
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **API**: http://localhost:3000/api

### Essential Files
| File | Purpose |
|------|---------|
| `src/payload.config.ts` | CMS configuration & R2 setup |
| `src/lib/media/r2-utils.ts` | Media optimization logic |
| `src/components/ui/media/` | Media components |
| `src/collections/` | CMS data models |
| `src/blocks/` | Content block definitions |

## 📋 Development Checklist

### Before Starting
- [ ] Environment variables configured
- [ ] Database connection tested  
- [ ] R2 storage credentials verified
- [ ] `bun install` completed

### When Adding Features
- [ ] Use existing components first
- [ ] Follow TypeScript patterns
- [ ] Test with both CMS and fallback data
- [ ] Verify media optimization works
- [ ] Run `bun run build` to check types

### Before Deployment
- [ ] All environment variables set in production
- [ ] `bun run build` passes
- [ ] Media loads from R2 correctly
- [ ] CMS admin panel accessible
- [ ] Performance checks completed

---

## 🎹 About This System

**KAWAI Piano Website** - A production-grade piano retail platform featuring:
- ⚡ **Next.js 15** with React 19 Server Components
- 🎛️ **Payload CMS 3.52+** with advanced content management  
- 📱 **Unified Media System** with Cloudflare R2 optimization
- 🎨 **Component-based architecture** with TypeScript safety
- 🚀 **Performance-first design** with responsive images and progressive enhancement

*Built for scalability, maintainability, and exceptional user experience.*
- memorize do not start and develoipment servers