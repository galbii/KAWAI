# Pages Collection Routing Solution

## Problem Analysis

The original implementation tried to use a route group `/(pages)/[slug]` which conflicted with the existing `/[slug]` route for Storefronts because:

```
/(frontend)/(pages)/[slug]/page.tsx  → resolves to /[slug]
/(frontend)/[slug]/page.tsx          → resolves to /[slug]
```

**Route groups in Next.js are for organization only** - they don't create URL segments, causing both routes to resolve to the same URL pattern.

## Solution: Separate URL Prefix

Based on Context7 research of Payload CMS best practices, the solution is to use a **distinct URL prefix** for Pages collection.

### URL Structure

```
/                      → HomePage (global singleton)
/[slug]                → Storefronts (dealer locations)
/pages/[slug]          → Pages collection ✨ NEW
/blog/[slug]           → Posts
/products/[slug]       → Products
/pianos/[category]     → Piano categories
```

This approach:
- ✅ Eliminates routing conflicts
- ✅ Makes content type clear from URL
- ✅ Follows RESTful conventions
- ✅ Easy to understand and maintain

## Implementation Details

### 1. Page Route Location

**File**: `src/app/(frontend)/pages/[slug]/page.tsx`

Creates pages at `/pages/*` URLs:
- `/pages/about`
- `/pages/contact`
- `/pages/terms`
- `/pages/privacy`

### 2. Updated Configurations

#### Collection Preview URLs

**File**: `src/lib/payload/generatePreviewPath.ts`

```typescript
const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: '/blog',
  pages: '/pages',  // ← Updated from '' to '/pages'
}
```

#### Revalidation Hooks

**File**: `src/collections/Pages/hooks/revalidatePage.ts`

```typescript
// Before: const path = `/${doc.slug}`
// After:
const path = `/pages/${doc.slug}`
```

#### Link Generation

**File**: `src/components/CMSLink.tsx`

```typescript
// Generate path based on collection
if (relationTo === 'pages') {
  return `/pages/${doc.slug}`  // ← Updated from `/${doc.slug}`
}
if (relationTo === 'posts') {
  return `/blog/${doc.slug}`
}
```

### 3. Build Output

```
✅ [Pages] Pre-rendering 1 pages at /pages/* routes
├ ● /pages/[slug]                                  175 B         110 kB
├   └ /pages/instrumental-to-life
```

## Alternative Approaches Considered

### Option 1: Unified Route (Not Implemented)

Modify `/[slug]/page.tsx` to check both collections:

```tsx
// 1. Try Pages first
const page = await payload.find({ collection: 'pages', where: { slug } })
if (page.docs[0]) return <PageContent page={page.docs[0]} />

// 2. Fall back to Storefront
const storefront = await payload.find({ collection: 'storefronts', where: { slug } })
if (storefront.docs[0]) return <StorefrontContent storefront={storefront.docs[0]} />

// 3. 404
notFound()
```

**Pros**:
- Pages at root level (cleaner URLs)
- More flexible

**Cons**:
- More complex logic
- Potential slug conflicts
- Harder to debug
- Performance overhead (two queries)

**Decision**: Rejected in favor of explicit `/pages/` prefix for clarity and simplicity.

### Option 2: Route Groups (Failed)

Attempted: `/(pages)/[slug]`

**Why it failed**: Route groups are organizational only and don't create URL segments.

## Usage

### Creating a Page

1. Go to `/admin/collections/pages`
2. Click "Create New"
3. Add title and slug (e.g., "About Us", slug: "about")
4. Configure hero section
5. Add content blocks
6. Publish

### Accessing the Page

Visit `/pages/about`

### Preview URLs

When clicking "Preview" in the admin panel, you'll be redirected to:
```
/next/preview?slug=about&collection=pages&path=/pages/about&previewSecret=***
```

## Component Architecture

```
/pages/[slug]
├── generateStaticParams() - Pre-render all published pages
├── generateMetadata() - SEO meta tags
└── PageContent (Server Component)
    ├── Hero - 4 impact levels
    └── RenderBlocks
        ├── ArchiveBlock (posts grid)
        ├── ContentBlock (flexible columns)
        ├── MediaBlock (images)
        └── CtaBlock (call-to-action)
```

## Performance Features

### Static Site Generation (SSG)

```tsx
export async function generateStaticParams() {
  // Pre-generate all published pages at build time
  const pages = await payload.find({
    collection: 'pages',
    where: { _status: { equals: 'published' } },
  })

  return pages.docs.map(page => ({ slug: page.slug }))
}
```

### Incremental Static Regeneration (ISR)

```tsx
export const revalidate = 3600  // Revalidate every hour
```

### On-Demand Revalidation

Content changes trigger immediate revalidation via hooks:

```tsx
revalidatePath(`/pages/${doc.slug}`)
revalidateTag('pages-sitemap')
```

## Type Safety

All components are fully type-safe with TypeScript:
- Payload-generated types from `payload-types.ts`
- Strict mode enabled
- `exactOptionalPropertyTypes` support
- Proper null handling

## SEO Configuration

Each page automatically generates:
- Title and description
- Canonical URLs
- OpenGraph tags
- Twitter cards
- Proper indexing directives

## Testing Checklist

- [x] Build succeeds without routing conflicts
- [x] TypeScript compiles without errors
- [x] Pages pre-render at `/pages/*` routes
- [x] Preview URLs work correctly
- [x] Revalidation hooks fire on content changes
- [x] Links resolve to correct URLs
- [x] SEO metadata generates properly
- [x] Draft mode works for live preview

## Next Steps

1. **Test in production**: Deploy and verify pages work correctly
2. **Add more pages**: Create About, Contact, Terms, Privacy pages
3. **Update documentation**: Update any docs that reference page URLs
4. **Consider redirects**: If you had pages at root level before, add redirects:

```typescript
// next.config.js
redirects: async () => [
  {
    source: '/about',
    destination: '/pages/about',
    permanent: true,
  },
]
```

## Resources

- [Next.js Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [Payload Preview Configuration](https://payloadcms.com/docs/admin/preview)
- [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [KAWAI Pages Rendering Guide](./PAGES_COLLECTION_RENDERING.md)
