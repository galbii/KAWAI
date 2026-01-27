# Pages Collection - Frontend Rendering Guide

## Overview

This document explains how to render the Pages collection dynamically on the KAWAI frontend. The implementation follows Payload CMS best practices and integrates seamlessly with KAWAI's existing architecture.

## Architecture

### Component Hierarchy

```
app/(frontend)/(pages)/[slug]/page.tsx
├── Hero Component (conditional)
│   ├── Low Impact (text only)
│   ├── Medium Impact (text + image)
│   └── High Impact (fullscreen background)
└── RenderBlocks Component
    ├── ArchiveBlock (posts grid)
    ├── ContentBlock (flexible columns)
    ├── MediaBlock (images)
    └── CtaBlock (call-to-action)
```

### File Structure

```
src/
├── app/(frontend)/(pages)/[slug]/page.tsx  # Dynamic page route
├── components/
│   ├── Hero.tsx                 # Hero section renderer
│   ├── RenderBlocks.tsx         # Block orchestrator
│   ├── RichText.tsx             # Lexical content renderer
│   ├── CMSLink.tsx              # Link component (internal/external)
│   └── blocks/
│       ├── ArchiveBlock.tsx     # Posts archive
│       ├── ContentBlock.tsx     # Flexible columns
│       ├── MediaBlock.tsx       # Image/media display
│       └── CtaBlock.tsx         # Call-to-action
└── collections/Pages/
    ├── index.ts                 # Collection config
    └── hooks/
        ├── populatePublishedAt.ts
        └── revalidatePage.ts
```

## Key Components

### 1. RenderBlocks - Block Orchestrator

**Location**: `src/components/RenderBlocks.tsx`

Maps block types to their React components and renders them dynamically.

```tsx
import { RenderBlocks } from '@/components/RenderBlocks'

<RenderBlocks blocks={page.layout} />
```

**How it works**:
- Maps `blockType` to component (e.g., `cta` → `CtaBlock`)
- Passes all block data as props
- Renders blocks in order
- Logs warnings for unhandled block types (dev only)

### 2. Hero Component

**Location**: `src/components/Hero.tsx`

Renders hero sections with 4 impact levels:

- **none**: No hero displayed
- **lowImpact**: Simple centered text with links
- **mediumImpact**: Text + image side-by-side
- **highImpact**: Full-screen background image with overlay

```tsx
import { Hero } from '@/components/Hero'

<Hero hero={page.hero} />
```

### 3. Block Components

All blocks are **Server Components** that can fetch data directly from Payload.

#### ArchiveBlock

Displays a grid of posts with category filtering.

```tsx
// Fetches posts from Payload
// Supports collection query or manual selection
// Shows featured images, titles, excerpts, dates
```

#### ContentBlock

Flexible column layout with rich text and optional links.

```tsx
// Supports: 1/3, 1/2, 2/3, full-width columns
// Responsive grid (4 cols → 12 cols on lg screens)
// Each column can have rich text + link
```

#### MediaBlock

Simple image/media display with Next.js Image optimization.

```tsx
// Uses Next.js Image for optimization
// Responsive sizing
// Optional caption support
```

#### CtaBlock

Call-to-action section with rich text and link groups.

```tsx
// Gradient background
// Centered layout
// Multiple action buttons
// Appearance variants (default, outline)
```

### 4. Shared Components

#### RichText

Renders Payload's Lexical rich text content.

```tsx
import { RichText } from '@/components/RichText'

<RichText
  data={lexicalData}
  className="prose"
  enableGutter={true}
/>
```

#### CMSLink

Handles both internal (pages/posts) and external URLs.

```tsx
import { CMSLink } from '@/components/CMSLink'

// From link field
<CMSLink {...link} />

// Manual
<CMSLink
  type="reference"
  reference={{ value: page, relationTo: 'pages' }}
  label="Learn More"
  appearance="default"
/>
```

## Data Flow

### 1. Page Request

```
User visits /about
  ↓
app/(frontend)/(pages)/[slug]/page.tsx
  ↓
Fetch page by slug from Payload
  ↓
Check if page exists (404 if not)
  ↓
Render Hero + Blocks
```

### 2. Static Generation (Build Time)

```
generateStaticParams()
  ↓
Query all published pages
  ↓
Generate static routes for each
  ↓
Pre-render HTML for SEO
  ↓
Enable ISR (revalidate: 3600)
```

### 3. Draft Mode (Preview)

```
Admin clicks preview in CMS
  ↓
Next.js draft mode enabled
  ↓
Fetch with draft: true
  ↓
Show unpublished content
  ↓
overrideAccess: true (bypass access control)
```

## Integration with Existing Routes

### Current Structure

```
/                      → HomePage (global singleton)
/[slug]                → Storefronts (dealer locations)
/blog/[slug]           → Posts
/products/[slug]       → Products
/pianos/[category]     → Piano categories
```

### Adding Pages Collection

**Option 1: Separate Route Group** (Current Implementation)
```
/(pages)/[slug]        → Pages collection
```

Pros:
- No conflicts with storefronts
- Clear separation

Cons:
- Pages need a route group prefix

**Option 2: Unified Route** (Recommended for Production)

Modify `/[slug]/page.tsx` to check both Pages and Storefronts:

```tsx
// 1. Try to find a Page
const page = await payload.find({
  collection: 'pages',
  where: { slug: { equals: slug } },
  limit: 1,
})

if (page.docs.length > 0) {
  return <PageContent page={page.docs[0]} />
}

// 2. Fall back to Storefront
const storefront = await payload.find({
  collection: 'storefronts',
  where: { slug: { equals: slug } },
  limit: 1,
})

if (storefront.docs.length > 0) {
  return <StorefrontContent storefront={storefront.docs[0]} />
}

// 3. 404
notFound()
```

This allows pages at the root level without conflicts.

## Performance Optimizations

### 1. Static Site Generation (SSG)

```tsx
export async function generateStaticParams() {
  // Pre-generate all published pages at build time
  const pages = await payload.find({
    collection: 'pages',
    where: { _status: { equals: 'published' } },
    select: { slug: true },
  })

  return pages.docs.map(page => ({ slug: page.slug }))
}
```

### 2. Incremental Static Regeneration (ISR)

```tsx
// Revalidate every hour
export const revalidate = 3600
```

### 3. On-Demand Revalidation

Hooks trigger revalidation when content changes:

```tsx
// src/collections/Pages/hooks/revalidatePage.ts
export const revalidatePage: CollectionAfterChangeHook = ({ doc }) => {
  if (doc._status === 'published') {
    const path = doc.slug === 'home' ? '/' : `/${doc.slug}`
    revalidatePath(path)
    revalidateTag('pages-sitemap')
  }
}
```

### 4. Block References

Blocks are defined once in `payload.config.ts` and referenced by slug:

```tsx
// payload.config.ts
blocks: [Archive, Content, MediaBlock, Cta],

// Pages collection
{
  name: 'layout',
  type: 'blocks',
  blockReferences: ['archive', 'content', 'mediaBlock', 'cta'],
  blocks: [], // Required to be empty
}
```

This reduces client-side bundle size and improves performance.

## SEO Configuration

### Metadata Generation

```tsx
export async function generateMetadata({ params }) {
  const page = await getPage(params.slug)

  return {
    title: `${page.title} | KAWAI Pianos`,
    description: generateDescription(page),
    alternates: {
      canonical: `${siteUrl}/${page.slug}`
    },
    openGraph: { ... },
    twitter: { ... },
  }
}
```

### Structured Data

Add JSON-LD for rich results:

```tsx
<script type="application/ld+json">
  {JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": page.title,
    "url": `${siteUrl}/${page.slug}`,
    // ...
  })}
</script>
```

## Styling

### Tailwind CSS Integration

All components use KAWAI's existing Tailwind configuration:

```tsx
// Colors
bg-kawai-red           // #C41E3A
bg-kawai-gold          // #D4AF37
bg-kawai-charcoal      // #2C2C2C
bg-kawai-pearl         // #F8F8F8

// Utilities
container              // Responsive container
prose                  // Rich text styling
```

### Custom Styles

Add custom styles for rich text content:

```css
/* src/styles/richtext.css */
.richtext h1 {
  @apply text-4xl font-bold mb-6;
}

.richtext h2 {
  @apply text-3xl font-semibold mb-4;
}

.richtext p {
  @apply mb-4 text-gray-700;
}
```

## Testing

### 1. Create Test Page

1. Go to `/admin/collections/pages`
2. Click "Create New"
3. Add title: "Test Page"
4. Add slug: "test-page"
5. Configure hero (optional)
6. Add blocks (Archive, Content, CTA, Media)
7. Publish

### 2. Verify Rendering

Visit `/test-page` and verify:
- [ ] Hero renders correctly
- [ ] Blocks display in order
- [ ] Links work (internal/external)
- [ ] Images are optimized
- [ ] Responsive design works
- [ ] SEO meta tags are present

### 3. Test Draft Mode

1. Create a draft page (don't publish)
2. Click "Preview" in admin
3. Verify draft content displays
4. Check that draft is not accessible without preview token

## Troubleshooting

### Block Not Rendering

1. Check block is registered in `RenderBlocks.tsx`:
   ```tsx
   const blockComponents = {
     myBlock: MyBlockComponent, // Add here
   }
   ```

2. Verify blockType matches slug:
   ```tsx
   // Block config
   slug: 'myBlock'

   // Must match in RenderBlocks
   myBlock: MyBlockComponent
   ```

### Type Errors

Regenerate types after schema changes:
```bash
bun run build
```

### Revalidation Not Working

1. Check `REVALIDATION_SECRET` is set in `.env`
2. Verify hooks are firing:
   ```tsx
   console.log('Revalidating:', path)
   ```
3. Clear `.next` cache:
   ```bash
   rm -rf .next && bun run dev
   ```

## Future Enhancements

1. **Add More Blocks**
   - FAQ accordion
   - Testimonials slider
   - Video embed
   - Pricing tables

2. **SEO Plugin Integration**
   - Install `@payloadcms/plugin-seo`
   - Add meta fields to Pages collection
   - Generate OpenGraph images

3. **Analytics**
   - Track page views
   - Monitor conversion rates
   - A/B test hero variants

4. **Internationalization**
   - Multiple language support
   - Translated content
   - Locale-specific URLs

## Resources

- [Payload CMS Docs](https://payloadcms.com/docs)
- [Payload CMS LLM Context](https://payloadcms.com/llms-full.txt)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Incremental Static Regeneration](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [KAWAI CLAUDE.md](../CLAUDE.md)
