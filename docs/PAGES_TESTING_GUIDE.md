# Pages Collection - Comprehensive Testing Guide

## Overview

This guide provides step-by-step instructions for testing the Pages collection with all available block types. The Pages collection supports 17 different block types across 4 categories (Content, Layout, Marketing, Product) plus legacy blocks.

**Current Status**: The Pages collection exists and is configured, but the frontend route `/pages/[slug]` does NOT exist yet. This means:
- ✅ You CAN create pages in Payload admin
- ✅ Pages will be saved to the database
- ❌ Pages CANNOT be viewed on the frontend (no route handler)
- ⚠️ You'll need to create the route handler first (see Setup section)

---

## Prerequisites

### 1. Setup Frontend Route Handler

**CRITICAL**: Before testing pages, you must create the route handler.

Create `/Users/chancenoonan/dev/code/KAWAI/src/app/(frontend)/pages/[slug]/page.tsx`:

```tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import type { Page } from '@/payload-types'
import { RenderBlocks } from '@/components/RenderBlocks'
import { RenderHero } from '@/components/RenderHero'

// ISR revalidation every 5 minutes
export const revalidate = 300

interface PageProps {
  params: Promise<{ slug: string }>
}

// Fetch page by slug
async function getPageBySlug(slug: string, isDraft: boolean = false): Promise<Page | null> {
  try {
    const { getPayload } = await import('payload')
    const configPromise = await import('@payload-config')
    const payload = await getPayload({ config: configPromise.default })

    const pages = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: slug },
        ...(isDraft ? {} : { _status: { equals: 'published' } }),
      },
      limit: 1,
      depth: 2,
      draft: isDraft,
      overrideAccess: isDraft,
    })

    return pages.docs[0] || null
  } catch (error) {
    console.error('Error fetching page:', error)
    return null
  }
}

// Generate metadata
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params
  const page = await getPageBySlug(params.slug)

  if (!page) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    }
  }

  return {
    title: page.title,
    description: `${page.title} - Kawai Pianos`,
  }
}

// Pre-generate published pages at build time
export async function generateStaticParams() {
  try {
    const { getPayload } = await import('payload')
    const configPromise = await import('@payload-config')
    const payload = await getPayload({ config: configPromise.default })

    const pages = await payload.find({
      collection: 'pages',
      where: { _status: { equals: 'published' } },
      limit: 500,
      select: { slug: true },
    })

    console.log(`✅ [SEO] Pre-rendering ${pages.docs.length} pages`)

    return pages.docs.map((page) => ({
      slug: page.slug,
    }))
  } catch (error) {
    console.error('❌ [SEO] Error generating static params for pages:', error)
    return []
  }
}

// Page component
export default async function PageDetail(props: PageProps) {
  const params = await props.params
  const { isEnabled: isDraftMode } = await draftMode()

  const page = await getPageBySlug(params.slug, isDraftMode)

  if (!page) {
    notFound()
  }

  console.log(`[Pages] Rendering page: "${page.title}" (${page.layout?.length || 0} blocks)`)

  return (
    <div className="min-h-screen bg-kawai-pearl">
      {/* Hero Section */}
      {page.hero && page.hero.type !== 'none' && (
        <RenderHero {...page.hero} />
      )}

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Page Title (if no hero or low-impact hero) */}
        {(!page.hero || page.hero.type === 'lowImpact' || page.hero.type === 'none') && (
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-kawai-black mb-4">
              {page.title}
            </h1>
            {page.category && (
              <span className="inline-block px-3 py-1 text-sm font-medium bg-kawai-red/10 text-kawai-red rounded-full">
                {page.category}
              </span>
            )}
          </div>
        )}

        {/* Render Blocks */}
        {page.layout && page.layout.length > 0 ? (
          <RenderBlocks blocks={page.layout} />
        ) : (
          <div className="bg-white rounded-lg p-8 text-center text-gray-500">
            <p>No content blocks have been added to this page yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
```

**Also create** `/Users/chancenoonan/dev/code/KAWAI/src/components/RenderHero.tsx`:

```tsx
import React from 'react'
import type { Page } from '@/payload-types'
import { LexicalSerializer } from '@/lib/lexical/LexicalSerializer'
import { MediaRenderer } from '@/components/ui/media/MediaRenderer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type HeroProps = NonNullable<Page['hero']>

export function RenderHero(hero: HeroProps) {
  const { type, richText, links, media } = hero

  if (type === 'none') return null

  const isHighImpact = type === 'highImpact'
  const isMediumImpact = type === 'mediumImpact'
  const isLowImpact = type === 'lowImpact'

  // High/Medium impact heroes need media
  if ((isHighImpact || isMediumImpact) && !media) {
    console.warn('[RenderHero] High/Medium impact hero requires media')
    return null
  }

  return (
    <section
      className={`relative ${
        isHighImpact ? 'min-h-[80vh]' : isMediumImpact ? 'min-h-[60vh]' : 'py-16'
      } flex items-center justify-center`}
    >
      {/* Background Media (High/Medium Impact) */}
      {(isHighImpact || isMediumImpact) && media && (
        <>
          <div className="absolute inset-0 z-0">
            <MediaRenderer
              media={media}
              preset="hero"
              priority={true}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 z-10 bg-black/50" />
        </>
      )}

      {/* Content */}
      <div
        className={`relative ${isHighImpact || isMediumImpact ? 'z-20 text-white' : 'z-10'} max-w-4xl mx-auto px-6 text-center`}
      >
        {richText && (
          <div
            className={`prose ${isHighImpact || isMediumImpact ? 'prose-invert' : ''} prose-lg max-w-none mb-8`}
          >
            <LexicalSerializer content={richText} />
          </div>
        )}

        {/* CTA Links */}
        {links && links.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center">
            {links.map((link, index) => {
              if (link.link?.type !== 'custom' || !link.link.url) return null

              return (
                <Button
                  key={index}
                  asChild
                  size="lg"
                  variant={index === 0 ? 'default' : 'outline'}
                >
                  <Link
                    href={link.link.url}
                    target={link.link.newTab ? '_blank' : undefined}
                    rel={link.link.newTab ? 'noopener noreferrer' : undefined}
                  >
                    {link.link.label}
                  </Link>
                </Button>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
```

### 2. Start Development Server

```bash
bun run dev
```

Access:
- **Payload Admin**: http://localhost:3000/admin
- **Frontend Pages**: http://localhost:3000/pages/[slug]

---

## Test Page Structure

Create a comprehensive test page with ALL block types to verify the system works correctly.

### Test Page Configuration

| Field | Value |
|-------|-------|
| **Title** | `Block System Test Page` |
| **Slug** | `test-blocks` |
| **Category** | `General` |
| **Tags** | `Getting Started`, `Digital Pianos` |

---

## Block Testing Checklist

### Hero Section (Page-Level)

Test all three hero variants:

#### ✅ Test 1: Low Impact Hero
- **Type**: Low Impact
- **Rich Text**:
  ```
  # Welcome to KAWAI Piano Gallery
  Discover our world-class piano collection
  ```
- **Links**:
  - Primary CTA: "Explore Pianos" → `/pianos`
  - Secondary CTA: "Find a Dealer" → `/find-a-dealer`

**Expected Output**:
- Simple hero section with white background
- Heading and subtitle visible
- Two CTA buttons (primary red, secondary outline)

---

#### ✅ Test 2: Medium Impact Hero
- **Type**: Medium Impact
- **Rich Text**:
  ```
  # Shigeru Kawai - The Pinnacle of Craftsmanship
  Experience unparalleled artistry in every note
  ```
- **Media**: Upload a grand piano image (1920x1080)
- **Links**: "Learn More" → `/pianos/shigeru-kawai`

**Expected Output**:
- Full-width hero with background image
- Dark overlay with white text
- Image should be sharp and properly sized
- CTA button overlays the image

---

#### ✅ Test 3: High Impact Hero
- **Type**: High Impact
- **Rich Text**:
  ```
  # The Art of Sound
  Kawai pianos - Where tradition meets innovation
  ```
- **Media**: Upload a different image (concert hall setting)
- **Links**:
  - "Explore Grand Pianos" → `/pianos/grand`
  - "Watch Video" → `https://youtube.com/watch?v=example`

**Expected Output**:
- Large hero section (80vh height)
- Dramatic image with overlay
- White text with excellent contrast
- Two CTA buttons

---

### Content Blocks

#### ✅ Test 4: Text Block (`content-text`)

Add block with:
- **Content**:
  ```
  KAWAI has been a leading manufacturer of acoustic and digital pianos
  since 1927. Our commitment to excellence is reflected in every instrument
  we create, from entry-level digital pianos to world-class concert grands.
  ```
- **Alignment**: Left

**Expected Output**:
- Paragraph rendered with proper typography
- Left-aligned text
- Readable line height and spacing

**Variants to Test**:
- Center alignment
- Right alignment
- Justify alignment

---

#### ✅ Test 5: Image Block (`content-image`)

Add block with:
- **Image**: Upload a CA901 digital piano product image
- **Alt Text**: "KAWAI CA901 Digital Piano"
- **Caption**: "The CA901 features wooden keys and Grand Feel action"
- **Size**: Medium

**Expected Output**:
- Image displays at correct size
- Caption appears below image
- Alt text is set (check HTML inspector)
- Image is lazy-loaded (check network tab)

**Variants to Test**:
- Small size (400px)
- Large size (full width)
- With and without caption

---

#### ✅ Test 6: Video Block (`content-video`)

Add block with:
- **Video URL**: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- **Title**: "KAWAI SK-EX Concert Grand Performance"
- **Description**: "Watch renowned pianist perform on our flagship model"

**Expected Output**:
- YouTube video embeds correctly
- Responsive iframe sizing
- Title and description display above video

**Variants to Test**:
- Vimeo URL
- Direct video file URL (if supported)

---

#### ✅ Test 7: Code Block (`content-code`)

Add block with:
- **Language**: TypeScript
- **Code**:
  ```typescript
  // Example: Filtering pianos by category
  const digitalPianos = pianos.filter(
    (piano) => piano.category === 'digital'
  )
  ```
- **Show Line Numbers**: Yes

**Expected Output**:
- Syntax highlighted code
- Line numbers visible
- Proper indentation preserved
- Copy button (if implemented)

---

#### ✅ Test 8: Banner Block (`content-banner`)

Add block with:
- **Type**: Info
- **Title**: "New Product Launch"
- **Message**: "The all-new CA901 is now available at select dealers. Contact us for more information."
- **CTA**: "Learn More" → `/products/ca901`

**Expected Output**:
- Info banner with blue accent
- Title in bold
- CTA button with proper styling
- Dismissible (if implemented)

**Variants to Test**:
- Warning banner (yellow)
- Error banner (red)
- Success banner (green)

---

### Layout Blocks

#### ✅ Test 9: Columns Block (`layout-columns`)

Add block with **2 columns**:

**Column 1 (50% width)**:
- Add `content-image` block (piano image)
- Add `content-text` block with product description

**Column 2 (50% width)**:
- Add `content-text` block with specifications
- Add `content-banner` block (info)

**Layout Settings**:
- Gap: Medium
- Vertical Align: Top
- Background Color: Light Gray

**Expected Output**:
- Two equal-width columns on desktop
- Stacks on mobile (< 768px)
- Medium gap between columns
- Light gray background

**Variants to Test**:
- 3 columns (33% + 33% + 33%)
- Asymmetric layout (66% + 33%)
- 4 columns (25% each)

---

#### ✅ Test 10: Spacer Block (`layout-spacer`)

Add block with:
- **Height**: Large (4rem)

**Expected Output**:
- Visible vertical space (64px)
- No content or borders

**Test by placing spacers**:
- Between two text blocks
- After a columns block
- Before a marketing hero

---

#### ✅ Test 11: Divider Block (`layout-divider`)

Add block with:
- **Style**: Solid
- **Color**: Dark Gray

**Expected Output**:
- Horizontal line across full width
- Dark gray color
- Proper spacing above and below

**Variants to Test**:
- Dashed style
- Dotted style
- Light color

---

### Marketing Blocks

#### ✅ Test 12: Marketing Hero Block (`marketing-hero`)

Add block with:
- **Data Source**: Manual
- **Title**: "Experience the CA Series"
- **Subtitle**: "Digital Pianos Reimagined"
- **Description**: "Featuring Grand Feel action and beautiful wooden keys"
- **Primary CTA**: "View Models" → `/pianos/digital`
- **Secondary CTA**: "Compare Pianos" → `/pianos/compare`
- **Media Type**: Image
- **Background Image**: Upload CA series lifestyle image
- **Overlay**: Enable, Dark, 50% opacity
- **Height**: Medium (600px)
- **Content Alignment**: Center
- **Vertical Alignment**: Center

**Expected Output**:
- Hero section with background image
- Dark overlay for text contrast
- White text centered on image
- Two CTA buttons (primary red, secondary white outline)
- 600px height

**Variants to Test**:
- Left-aligned content
- Large height (800px)
- Video background instead of image

---

#### ✅ Test 13: Call to Action Block (`marketing-cta`)

Add block with:
- **Headline**: "Find Your Perfect Piano"
- **Description**: "Our piano experts are ready to help you choose the right instrument for your needs."
- **Button Text**: "Schedule a Consultation"
- **Button Link**: `/contact`
- **Background Color**: Brand Red
- **Text Color**: White

**Expected Output**:
- Full-width CTA section
- Red background with white text
- Button prominently displayed
- Responsive padding

**Variants to Test**:
- Light background with dark text
- Multiple CTA buttons
- With and without description

---

#### ✅ Test 14: Testimonials Block (`marketing-testimonials`)

Add block with 3 testimonials:

**Testimonial 1**:
- **Quote**: "The CA901 is the best digital piano I've ever played. The action feels incredibly realistic."
- **Author**: "Sarah Johnson"
- **Role**: "Piano Teacher"
- **Image**: Upload headshot

**Testimonial 2**:
- **Quote**: "KAWAI's Grand Feel technology is revolutionary. It's like playing a real grand piano."
- **Author**: "Michael Chen"
- **Role**: "Concert Pianist"
- **Image**: Upload headshot

**Testimonial 3**:
- **Quote**: "We chose KAWAI for our music school, and our students love the authentic feel of the keys."
- **Author**: "Emily Rodriguez"
- **Role**: "Music Director"
- **Image**: Upload headshot

**Expected Output**:
- Three testimonial cards in a row (desktop)
- Stacks on mobile
- Photos display as circles
- Quotes with quotation marks
- Author name and role displayed

---

### Product Blocks (if product reference is available)

#### ✅ Test 15: Product Showcase Block (`product-showcase`)

Add block with:
- **Piano Model**: Select "CA901" (or any piano from the dropdown)
- **Override Title**: (leave empty to use product title)
- **Override Description**: (leave empty to use product description)

**Expected Output**:
- Product card with image
- Product name and short description
- "Learn More" button linking to product page
- Auto-populated from product data

---

#### ✅ Test 16: Product Hero Block (`product-hero`)

Add block with:
- **Piano Model**: Select "SK-EX"
- **Background Image**: Override with custom image
- **CTA Text**: "Hear the SK-EX"
- **CTA Link**: `/pianos/shigeru-kawai/sk-ex`

**Expected Output**:
- Full-width hero with product name
- Custom background image
- Product tagline and description
- CTA button

---

### Legacy Blocks (Backward Compatibility)

#### ✅ Test 17: CTA Block (`cta`) - Legacy

Add block with:
- **Rich Text**: "Get started with KAWAI pianos today"
- **Links**: "Contact Us" → `/contact`

**Expected Output**:
- Simple CTA section
- Text and button rendered correctly
- Backward compatible with old content

---

## Testing Checklist - Visual Inspection

### Desktop (1920x1080)
- [ ] All blocks render without errors
- [ ] Images load correctly and are optimized
- [ ] Text is readable with proper contrast
- [ ] Buttons have hover states
- [ ] Spacing between blocks is consistent
- [ ] Hero sections are full-width
- [ ] Columns display side-by-side
- [ ] Navigation header is visible

### Tablet (768px)
- [ ] Layout adapts to tablet screen size
- [ ] Columns stack appropriately
- [ ] Text remains readable
- [ ] Images resize correctly
- [ ] Buttons are touch-friendly (min 44px)
- [ ] Hero sections scale properly

### Mobile (375px)
- [ ] All content stacks vertically
- [ ] Text is legible without zooming
- [ ] Images fit within viewport
- [ ] Buttons are full-width or centered
- [ ] No horizontal scrolling
- [ ] Hero heights are reduced appropriately

---

## Testing Checklist - Technical Verification

### Console Logs
- [ ] No JavaScript errors in browser console
- [ ] RenderBlocks logs show all blocks being rendered
- [ ] Block types logged match expected types
- [ ] No warnings about missing components

**Expected Console Output**:
```
🎨 [RenderBlocks] Starting render...
🎨 [RenderBlocks] Blocks received: 17
🎨 [RenderBlocks] Block types: content-text, content-image, content-video, ...
🎨 [RenderBlocks] Rendering block 0: content-text
🎨 [RenderBlocks] ✅ Rendering content-text with component TextBlock
...
```

### Network Tab
- [ ] Page loads in under 3 seconds (3G throttling)
- [ ] Images are lazy-loaded (below the fold)
- [ ] No 404 errors for assets
- [ ] Media files use WebP format (where supported)
- [ ] Fonts load correctly

### HTML Inspector
- [ ] Semantic HTML tags used (`<section>`, `<article>`, `<h1>-<h6>`)
- [ ] Images have `alt` attributes
- [ ] Links have descriptive text (no "click here")
- [ ] Proper heading hierarchy (no skipping levels)
- [ ] ARIA labels present where needed

### React DevTools
- [ ] All block components render in component tree
- [ ] Props are passed correctly to block components
- [ ] No unnecessary re-renders
- [ ] Keys are unique for mapped blocks
- [ ] Client components marked with `'use client'`

---

## Common Issues and Solutions

### Issue 1: Block Not Rendering

**Symptoms**:
- Block appears in admin but not on frontend
- Console warning: `Unmapped block type: "block-slug"`

**Root Causes**:
1. Block component not imported in `RenderBlocks.tsx`
2. Block slug mismatch in `blockComponents` mapping
3. Block not registered in `payload.config.ts`

**Solution**:
```tsx
// 1. Check RenderBlocks.tsx has import
import { YourBlock } from './blocks/YourBlock'

// 2. Check blockComponents mapping
const blockComponents = {
  'your-block-slug': YourBlock,  // Slug must match exactly
  // ...
}

// 3. Verify payload.config.ts registration
blocks: [YourBlockDefinition, ...]
```

---

### Issue 2: Images Not Displaying

**Symptoms**:
- Broken image icon
- 404 error in Network tab

**Root Causes**:
1. Media relationship not populated (depth issue)
2. Image URL not resolved correctly
3. Media not uploaded to Cloudflare R2

**Solution**:
```tsx
// Ensure depth: 2 in page query
const page = await payload.find({
  collection: 'pages',
  depth: 2,  // Critical for media relationships
})

// Use MediaRenderer for consistent image handling
import { MediaRenderer } from '@/components/ui/media/MediaRenderer'

<MediaRenderer media={block.image} preset="card" />
```

---

### Issue 3: Columns Not Stacking on Mobile

**Symptoms**:
- Columns remain side-by-side on mobile
- Horizontal scrolling on small screens

**Root Cause**:
- Missing responsive Tailwind classes

**Solution**:
```tsx
// In ColumnsBlock.tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Columns stack on mobile, side-by-side on tablet+ */}
</div>
```

---

### Issue 4: Hero Media Not Loading

**Symptoms**:
- Hero text visible but background image missing
- `admin.condition` preventing media field

**Root Cause**:
- Hero field has conditional logic requiring `type` to be set

**Solution**:
```tsx
// Ensure hero.type is 'highImpact' or 'mediumImpact'
{
  name: 'media',
  admin: {
    condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
  }
}
```

---

### Issue 5: TypeScript Errors After Adding Block

**Symptoms**:
- Build fails with type errors
- `Property 'blockType' does not exist`

**Root Cause**:
- Types not regenerated after adding new block

**Solution**:
```bash
# Regenerate Payload types
bun run build

# Or manually trigger type generation (if available)
bun run payload generate:types
```

---

### Issue 6: Blocks Not Saving in Admin

**Symptoms**:
- Block appears to save but disappears after refresh
- Validation errors not showing

**Root Causes**:
1. Required field missing
2. Block not registered globally
3. Hook preventing save

**Solution**:
```typescript
// 1. Check required fields
{
  name: 'content',
  type: 'richText',
  required: true,  // Add if critical
}

// 2. Verify global registration
export default buildConfig({
  blocks: [YourBlock],  // Must be in this array
})

// 3. Check hooks for skipRevalidation flag
hooks: {
  beforeChange: [(args) => {
    if (args.context.skipRevalidation) return args.data
    // ... hook logic
  }]
}
```

---

## Performance Testing

### Lighthouse Audit Targets

Run Lighthouse audit on test page:

```bash
# Using Chrome DevTools
# 1. Open page in Chrome
# 2. Open DevTools (F12)
# 3. Go to "Lighthouse" tab
# 4. Run audit for "Performance", "Accessibility", "Best Practices", "SEO"
```

**Target Scores**:
- **Performance**: 90+ (desktop), 70+ (mobile)
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 95+

**Common Issues**:
- Images not optimized → Use WebP format
- Large CLS (Cumulative Layout Shift) → Add width/height to images
- Slow TTI (Time to Interactive) → Reduce JavaScript bundle size
- Missing alt text → Add to all images

---

### Page Weight Analysis

**Acceptable Targets**:
- Total page size: < 2MB
- JavaScript bundle: < 500KB
- CSS bundle: < 100KB
- Images (total): < 1MB
- Initial load time: < 3s (3G)

**How to Check**:
```bash
# Using Chrome DevTools Network tab
# 1. Open Network tab
# 2. Throttle to "Slow 3G"
# 3. Refresh page
# 4. Check "Transferred" column at bottom
```

---

## Debugging Workflow

### Step 1: Check Browser Console

```javascript
// Look for RenderBlocks logs
🎨 [RenderBlocks] Starting render...
🎨 [RenderBlocks] Blocks received: X
🎨 [RenderBlocks] Block types: content-text, marketing-hero, ...

// Look for error messages
❌ [RenderBlocks] Unmapped block type: "unknown-block"
❌ [RenderBlocks] No component found for block type: "content-image"
```

### Step 2: Verify Database

```bash
# Connect to MongoDB
# Check if page saved correctly

# Example query (adjust for your setup)
db.pages.findOne({ slug: 'test-blocks' })
```

**Verify**:
- `layout` field contains block array
- Each block has `blockType` field
- Block data is present (not empty objects)

### Step 3: Check Component Mapping

```tsx
// src/components/RenderBlocks.tsx
const blockComponents = {
  'content-text': TextBlock,  // Ensure slug matches exactly
  'content-image': ImageBlock,
  // ... all blocks must be listed here
}
```

### Step 4: Inspect React DevTools

```
1. Install React DevTools extension
2. Open DevTools → React tab
3. Find RenderBlocks component
4. Inspect props.blocks array
5. Verify each block has correct structure
```

---

## Automated Testing (Future)

### Unit Tests (Jest + React Testing Library)

```typescript
// Example test for TextBlock component
import { render, screen } from '@testing-library/react'
import { TextBlock } from '@/components/blocks/TextBlock'

describe('TextBlock', () => {
  it('renders text content with correct alignment', () => {
    render(
      <TextBlock
        content="Test content"
        alignment="center"
      />
    )

    const element = screen.getByText('Test content')
    expect(element).toHaveClass('text-center')
  })
})
```

### E2E Tests (Playwright)

```typescript
// Example E2E test
import { test, expect } from '@playwright/test'

test('test page renders all blocks', async ({ page }) => {
  await page.goto('/pages/test-blocks')

  // Check hero renders
  await expect(page.locator('h1')).toContainText('Block System Test Page')

  // Check text block renders
  await expect(page.locator('.prose')).toBeVisible()

  // Check image block renders
  await expect(page.locator('img[alt="KAWAI CA901 Digital Piano"]')).toBeVisible()

  // Check CTA block renders
  await expect(page.locator('a:has-text("Schedule a Consultation")')).toBeVisible()
})
```

---

## Success Criteria

### Functional Requirements

✅ **All blocks render correctly**:
- [ ] Content blocks (Text, Image, Video, Code, Banner)
- [ ] Layout blocks (Columns, Spacer, Divider)
- [ ] Marketing blocks (Hero, CTA, Testimonials)
- [ ] Product blocks (Showcase, Hero, Gallery, Features, Specs)
- [ ] Legacy blocks (CTA, Content, MediaBlock, Archive)

✅ **Responsive design works**:
- [ ] Desktop (1920px+)
- [ ] Tablet (768px - 1199px)
- [ ] Mobile (< 768px)

✅ **Accessibility standards met**:
- [ ] Semantic HTML
- [ ] Alt text on images
- [ ] Keyboard navigation
- [ ] Screen reader friendly

✅ **Performance targets achieved**:
- [ ] Lighthouse score 90+
- [ ] Page weight < 2MB
- [ ] Load time < 3s (3G)

---

## Next Steps After Testing

### 1. Create Production Test Page

Once all blocks work correctly, create a real test page:
- Title: "Piano Care Guide"
- Slug: `piano-care`
- Use a mix of blocks to create a realistic article
- Publish and verify on production

### 2. Migrate Existing Content

If you have content in other collections (Posts, Storefronts):
- Identify pages that should be in Pages collection
- Migrate block content
- Update internal links
- Set up redirects (if needed)

### 3. Documentation

Update these docs:
- `docs/BLOCKS.md` - Add any missing block documentation
- `docs/PAGES_TESTING_GUIDE.md` - Update with new findings
- `README.md` - Add Pages collection to feature list

### 4. SEO Optimization

- [ ] Add meta description field to Pages collection
- [ ] Implement OpenGraph image support
- [ ] Add JSON-LD structured data
- [ ] Set up XML sitemap generation
- [ ] Configure robots.txt rules

### 5. Analytics Integration

- [ ] Add PostHog tracking to page views
- [ ] Track block interactions (CTA clicks, video plays)
- [ ] Set up conversion funnels
- [ ] Configure custom events

---

## Appendix: Block Reference Quick Guide

| Block | Slug | Best For | Required Fields |
|-------|------|----------|----------------|
| Text | `content-text` | Paragraphs | content |
| Image | `content-image` | Photos | image |
| Video | `content-video` | Embeds | videoUrl |
| Code | `content-code` | Snippets | code, language |
| Banner | `content-banner` | Alerts | message, type |
| Columns | `layout-columns` | Grid | columns[] |
| Spacer | `layout-spacer` | Spacing | height |
| Divider | `layout-divider` | Separation | style |
| Hero | `marketing-hero` | Headers | content.title, media |
| CTA | `marketing-cta` | Conversion | headline, buttonText |
| Testimonials | `marketing-testimonials` | Social Proof | testimonials[] |
| Product Showcase | `product-showcase` | Product Cards | pianoModel |
| Product Hero | `product-hero` | Product Headers | pianoModel |
| Image Gallery | `product-gallery` | Photo Sets | images[] |
| Features List | `product-features` | Benefits | features[] |
| Specifications | `product-specs` | Tech Specs | specifications[] |

---

## Support

If you encounter issues not covered in this guide:

1. Check `docs/BLOCKS.md` for detailed block documentation
2. Review `src/components/RenderBlocks.tsx` for component mapping
3. Inspect browser console for error messages
4. Check Payload admin for validation errors
5. Consult CLAUDE.md for project conventions

**Common Resources**:
- Payload CMS Docs: https://payloadcms.com/docs
- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS Docs: https://tailwindcss.com/docs
- React Docs: https://react.dev
