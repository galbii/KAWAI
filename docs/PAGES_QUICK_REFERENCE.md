# Pages Collection - Quick Reference Card

**One-page reference for developers working with the Pages collection.**

---

## Files You Need

```bash
# Create these files first
src/app/(frontend)/pages/[slug]/page.tsx      # Route handler
src/components/RenderHero.tsx                 # Hero renderer

# Already exist
src/collections/Pages/index.ts                # Collection config
src/components/RenderBlocks.tsx               # Block renderer
src/components/blocks/*.tsx                   # 17 block components
src/blocks/**/*.ts                            # 17 block definitions
```

---

## Quick Setup (3 Steps)

```bash
# 1. Copy route handler code from PAGES_TESTING_GUIDE.md
#    Create: src/app/(frontend)/pages/[slug]/page.tsx

# 2. Copy RenderHero code from PAGES_TESTING_GUIDE.md
#    Create: src/components/RenderHero.tsx

# 3. Start server and test
bun run dev
# Visit: http://localhost:3000/pages/test-blocks
```

---

## Collection Fields

| Field | Type | Purpose |
|-------|------|---------|
| `title` | text | Page title (required) |
| `slug` | text | URL slug (auto-generated) |
| `category` | select | General/FAQ/Legal/Support |
| `tags` | multi-select | 11 predefined tags |
| `hero` | group | Low/Medium/High impact hero |
| `layout` | blocks | Array of content blocks |
| `publishedAt` | date | Publish timestamp |
| `_status` | select | draft/published |

---

## Hero Variants

| Type | Height | Media | Use Case |
|------|--------|-------|----------|
| `none` | - | No | Simple pages |
| `lowImpact` | 16rem | No | Minimal header |
| `mediumImpact` | 60vh | Yes | Standard landing |
| `highImpact` | 80vh | Yes | Dramatic header |

---

## Block Types (17 Total)

### Content (5)
```typescript
'content-text'      // Rich text paragraphs
'content-image'     // Photos with captions
'content-video'     // YouTube/Vimeo embeds
'content-code'      // Syntax-highlighted code
'content-banner'    // Info/warning/error alerts
```

### Layout (3)
```typescript
'layout-columns'    // 2-4 column grids
'layout-spacer'     // Vertical spacing
'layout-divider'    // Horizontal lines
```

### Marketing (3)
```typescript
'marketing-hero'    // Full-width hero sections
'marketing-cta'     // Call-to-action buttons
'marketing-testimonials' // Customer quotes
```

### Product (5)
```typescript
'product-showcase'  // Product cards
'product-hero'      // Product headers
'product-gallery'   // Photo galleries
'product-features'  // Feature lists
'product-specs'     // Technical specs
```

### Legacy (1)
```typescript
'cta'              // Old CTA block
```

---

## Common Code Patterns

### Fetch Page
```typescript
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })
const { docs } = await payload.find({
  collection: 'pages',
  where: { slug: { equals: 'test-blocks' } },
  depth: 2,  // CRITICAL: Populate relationships
  limit: 1,
})

const page = docs[0]
```

### Render Page
```tsx
import { RenderBlocks } from '@/components/RenderBlocks'
import { RenderHero } from '@/components/RenderHero'

export default async function PageDetail({ params }) {
  const page = await getPageBySlug(params.slug)

  return (
    <div>
      {page.hero && <RenderHero {...page.hero} />}
      <RenderBlocks blocks={page.layout} />
    </div>
  )
}
```

### Add Block Component
```tsx
// 1. Create component
// src/components/blocks/YourBlock.tsx
'use client'
export function YourBlock({ title, content }) {
  return <div>{content}</div>
}

// 2. Import in RenderBlocks
import { YourBlock } from './blocks/YourBlock'

// 3. Add to mapping
const blockComponents = {
  'category-your-block': YourBlock,
  // ...
}
```

---

## Database Schema

```typescript
// MongoDB document structure
{
  _id: ObjectId,
  title: string,
  slug: string,
  category: 'general' | 'faq' | 'legal' | 'support',
  tags: string[],
  _status: 'draft' | 'published',

  hero: {
    type: 'none' | 'lowImpact' | 'mediumImpact' | 'highImpact',
    richText: LexicalJSON,
    links: LinkArray,
    media?: MediaRelationship
  },

  layout: [
    {
      blockType: string,
      id: string,
      // ... block-specific fields
    }
  ],

  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## RenderBlocks Flow

```typescript
// 1. Receive blocks array
blocks: Page['layout']

// 2. Map each block
blocks.map((block) => {
  const { blockType } = block

  // 3. Look up component
  const Block = blockComponents[blockType]

  // 4. Render with props
  return <Block {...block} />
})
```

---

## Console Debugging

### Expected Logs
```
✅ 🎨 [RenderBlocks] Starting render...
✅ 🎨 [RenderBlocks] Blocks received: 5
✅ 🎨 [RenderBlocks] Block types: content-text, content-image, ...
✅ 🎨 [RenderBlocks] Rendering block 0: content-text
✅ 🎨 [RenderBlocks] ✅ Rendering content-text with component TextBlock
```

### Error Indicators
```
❌ [RenderBlocks] Unmapped block type: "unknown-block"
❌ [RenderBlocks] No component found for: "content-image"
❌ TypeError: Cannot read property 'url' of undefined
```

---

## Common Issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| 404 error | Route not created | Create `pages/[slug]/page.tsx` |
| Block empty | Component not mapped | Add to `blockComponents` |
| Image broken | depth < 2 | Set `depth: 2` in query |
| Hero missing | Type not set | Set to mediumImpact/highImpact |
| TypeScript error | Types not generated | Run `bun run build` |
| Won't save | Not registered | Add to `payload.config.ts` |

---

## Performance Targets

| Metric | Target |
|--------|--------|
| TTFB | < 200ms |
| FCP | < 1.8s |
| TTI | < 3.0s |
| Lighthouse | 90+ |
| Page Weight | < 2MB |

---

## Testing Checklist

```
□ Create route handler
□ Create RenderHero component
□ Start dev server
□ Create test page in admin
□ Add blocks from each category
□ View on frontend
□ Check console logs
□ Test on mobile/tablet/desktop
□ Run Lighthouse audit
□ Verify ISR revalidation
```

---

## API Endpoints

```bash
# Admin
GET  /admin/collections/pages               # List pages
POST /admin/api/pages                       # Create page
GET  /admin/api/pages/:id                   # Get page
PUT  /admin/api/pages/:id                   # Update page
DELETE /admin/api/pages/:id                 # Delete page

# Frontend (Public)
GET  /pages/:slug                           # View page

# Revalidation
POST /api/revalidate                        # On-demand ISR
```

---

## Environment Variables

```bash
DATABASE_URI=mongodb+srv://...              # Required
PAYLOAD_SECRET=your-secret-32-chars         # Required
REVALIDATION_SECRET=your-secret-32-chars    # Required
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Required
S3_ACCESS_KEY_ID=...                        # For media
S3_SECRET_ACCESS_KEY=...                    # For media
S3_ENDPOINT=...                             # Cloudflare R2
S3_BUCKET=kawaicms                          # R2 bucket
```

---

## Useful Commands

```bash
# Development
bun run dev                    # Start dev server
bun run lint                   # Type check + lint

# Build
bun run build                  # Production build + type gen

# Database
# Connect to MongoDB to inspect data

# Testing
# Create test page in admin
# Visit http://localhost:3000/pages/test-blocks
```

---

## Key Files Reference

```bash
# Collection Config
src/collections/Pages/index.ts

# Hooks
src/collections/Pages/hooks/revalidatePage.ts
src/collections/Pages/hooks/populatePublishedAt.ts

# Route Handler (needs creation)
src/app/(frontend)/pages/[slug]/page.tsx

# Renderers
src/components/RenderBlocks.tsx
src/components/RenderHero.tsx (needs creation)

# Block Definitions (CMS)
src/blocks/content/*.ts
src/blocks/layout/*.ts
src/blocks/marketing/*.ts
src/blocks/product/*.ts

# Block Components (Frontend)
src/components/blocks/TextBlock.tsx
src/components/blocks/ImageBlock.tsx
src/components/blocks/HeroBlock.tsx
# ... 14 more

# Config
payload.config.ts (global block registration)
```

---

## Block Component Template

```tsx
'use client'

import React from 'react'
import type { ContentYourBlockBlock } from '@/payload-types'

interface YourBlockProps extends ContentYourBlockBlock {}

export function YourBlock({
  title,
  content,
  // ... other props
}: YourBlockProps) {
  return (
    <div className="my-6">
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  )
}
```

---

## Block Definition Template

```typescript
import type { Block } from 'payload'

export const YourBlock: Block = {
  slug: 'category-your-block',
  labels: {
    singular: '🎨 Your Block',
    plural: 'Your Blocks',
  },
  imageURL: 'https://via.placeholder.com/300x200',
  imageAltText: 'Description of block purpose',
  interfaceName: 'CategoryYourBlockBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Block title',
      },
    },
    // ... more fields
  ],
}
```

---

## Testing URLs

```bash
# Admin
http://localhost:3000/admin
http://localhost:3000/admin/collections/pages

# Frontend (after route creation)
http://localhost:3000/pages/test-blocks
http://localhost:3000/pages/piano-care

# API
http://localhost:3000/api/pages
http://localhost:3000/api/revalidate

# Draft Preview
http://localhost:3000/api/draft?slug=test-blocks&secret=xxx
```

---

## Block Capabilities Matrix

| Block | Rich Text | Media | Nested | Responsive |
|-------|-----------|-------|--------|------------|
| Text | ✅ | ❌ | ❌ | ✅ |
| Image | ❌ | ✅ | ❌ | ✅ |
| Video | ❌ | ✅ | ❌ | ✅ |
| Code | ❌ | ❌ | ❌ | ✅ |
| Banner | ✅ | ❌ | ❌ | ✅ |
| Columns | ❌ | ❌ | ✅ | ✅ |
| Spacer | ❌ | ❌ | ❌ | ✅ |
| Divider | ❌ | ❌ | ❌ | ✅ |
| Hero | ✅ | ✅ | ❌ | ✅ |
| CTA | ✅ | ❌ | ❌ | ✅ |
| Testimonials | ❌ | ✅ | ❌ | ✅ |
| Product Showcase | ❌ | ✅ | ❌ | ✅ |
| Product Hero | ✅ | ✅ | ❌ | ✅ |
| Gallery | ❌ | ✅ | ❌ | ✅ |
| Features | ❌ | ✅ | ❌ | ✅ |
| Specs | ❌ | ❌ | ❌ | ✅ |

**Legend**: ✅ = Supported | ❌ = Not supported

---

## Responsive Breakpoints

```typescript
// Tailwind breakpoints
sm: '640px'   // Mobile landscape
md: '768px'   // Tablet portrait
lg: '1024px'  // Tablet landscape
xl: '1280px'  // Desktop
2xl: '1536px' // Large desktop

// Usage in blocks
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/pages-frontend-route

# Make changes
# ... create route handler
# ... create RenderHero

# Test locally
bun run dev
# Verify at http://localhost:3000/pages/test-blocks

# Commit
git add .
git commit -m "Add frontend route for Pages collection"

# Push
git push origin feature/pages-frontend-route

# Create PR
# ... review and merge
```

---

## Next Steps After Setup

1. ✅ Create test page with all block types
2. ✅ Verify rendering on all devices
3. ✅ Run Lighthouse audit
4. ✅ Test ISR revalidation
5. ✅ Create production content
6. ✅ Add SEO metadata
7. ✅ Set up analytics
8. ✅ Deploy to staging
9. ✅ User acceptance testing
10. ✅ Deploy to production

---

## Documentation Index

| Document | Purpose |
|----------|---------|
| `PAGES_TESTING_GUIDE.md` | Complete testing instructions (17 pages) |
| `PAGES_TESTING_CHECKLIST.md` | Quick checklist (4 pages) |
| `PAGES_COLLECTION_SUMMARY.md` | Overview and status (12 pages) |
| `PAGES_ARCHITECTURE_DIAGRAM.md` | Visual architecture (8 pages) |
| `PAGES_QUICK_REFERENCE.md` | This file - one-page reference |
| `BLOCKS.md` | Detailed block documentation |
| `test-page-sample.json` | Sample page for import |

---

## Support

**Quick Help**:
- Block not rendering? → Check `RenderBlocks.tsx` mapping
- Image broken? → Set `depth: 2` in query
- TypeScript error? → Run `bun run build`
- Page 404? → Create route handler

**Full Documentation**: See `docs/PAGES_TESTING_GUIDE.md`

---

**Last Updated**: 2026-01-28 | **Status**: ⚠️ Route Handler Needed
