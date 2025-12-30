# Blog System Documentation

> A complete guide to the KAWAI Piano Website blog system built with Payload CMS 3.52+ and Next.js 15

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Posts Collection](#posts-collection)
4. [Modular Block System](#modular-block-system)
5. [Frontend Pages](#frontend-pages)
6. [Lexical Rich Text](#lexical-rich-text)
7. [Revalidation System](#revalidation-system)
8. [Creating Blog Posts](#creating-blog-posts)
9. [Customization Guide](#customization-guide)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The blog system provides a full-featured content management solution for publishing articles, news, guides, and educational content about pianos with a **modular, composable block architecture**.

### Key Features

✅ **Modular Block System** - Atomic blocks (Image, Text, Video, Spacer, Divider) that can be composed together
✅ **Flexible Columns** - Multi-column layouts that accept any atomic blocks
✅ **Inline Block Embedding** - Add blocks directly within Lexical rich text editor
✅ **SEO Optimization** - Full metadata support, Open Graph images, canonical URLs
✅ **Automatic Publishing** - On-demand revalidation with 5-minute ISR cache
✅ **Category System** - Organize posts by education, product news, artists, maintenance, etc.
✅ **Author Management** - Relationship to Users collection
✅ **Draft Workflow** - Draft → Published → Scheduled → Archived status flow

### Technology Stack

- **CMS**: Payload CMS 3.52+ with MongoDB
- **Editor**: Lexical (official Payload rich text editor) with BlocksFeature
- **Frontend**: Next.js 15 App Router with React Server Components
- **Rendering**: ISR (Incremental Static Regeneration) with on-demand revalidation
- **Styling**: Tailwind CSS with custom prose typography

---

## Architecture

### Data Flow

```
Content Editor creates post in Payload CMS
    ↓
Posts collection with BlocksFeature enabled in Lexical editor
    ↓
Atomic blocks (Image, Text, Video, Spacer, Divider) embedded inline
    ↓
Columns block contains nested atomic blocks
    ↓
Posts collection saves (beforeChange: auto-generate slug, set publishedDate)
    ↓
afterChange hook triggers revalidation
    ↓
Revalidation API called for /blog and /blog/{slug}
    ↓
Next.js revalidatePath() clears ISR cache
    ↓
Pages regenerate on next visit
    ↓
LexicalSerializer renders content + embedded blocks to JSX
    ↓
User sees published blog post
```

### File Structure

```
src/
├── collections/
│   └── Posts.ts                          # Blog posts collection with BlocksFeature
├── blocks/
│   ├── Image.ts                          # Image block (atomic)
│   ├── Text.ts                           # Text block (atomic)
│   ├── Video.ts                          # Video block (atomic)
│   ├── Spacer.ts                         # Spacer block (atomic)
│   ├── Divider.ts                        # Divider block (atomic)
│   ├── Columns.ts                        # Columns block (compositional)
│   └── index.ts                          # Block exports
├── app/(frontend)/
│   └── blog/
│       ├── page.tsx                      # Blog index (/blog)
│       └── [slug]/
│           └── page.tsx                  # Blog detail (/blog/{slug})
├── components/
│   ├── blog/
│   │   └── BlogCard.tsx                  # Blog listing card
│   └── blocks/
│       ├── ImageBlock.tsx                # Image renderer
│       ├── TextBlock.tsx                 # Text renderer
│       ├── VideoBlock.tsx                # Video renderer
│       ├── SpacerBlock.tsx               # Spacer renderer
│       ├── DividerBlock.tsx              # Divider renderer
│       └── ColumnsBlock.tsx              # Columns renderer (recursive)
├── lib/
│   ├── lexical/
│   │   └── LexicalSerializer.tsx         # Lexical → JSX converter with block support
│   └── blocks/
│       └── BlockRenderer.tsx             # Block rendering system
└── app/api/
    └── revalidate/
        └── route.ts                      # On-demand revalidation API
```

---

## Posts Collection

**Location**: `src/collections/Posts.ts`

### Field Structure

The Posts collection uses a **tab-based interface** with three main tabs:

#### 1. Content Tab

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | text | ✅ | Post title/headline |
| `slug` | text | ✅ | URL-friendly identifier (auto-generated) |
| `excerpt` | textarea | ❌ | Short summary (max 300 chars) |
| `featuredImage` | upload → media | ❌ | Hero image for post |
| `content` | richText (Lexical + BlocksFeature) | ✅ | Main post content with **embedded blocks** |

**New in Modular Architecture**: The `content` field now uses **BlocksFeature** to allow inline embedding of:
- Image blocks
- Text blocks
- Video blocks
- Spacer blocks
- Divider blocks
- Columns blocks (with nested atomic blocks)

**Removed**: The separate `layout` field has been removed. All content is now managed within the single `content` Lexical editor for a more unified editing experience.

#### 2. Settings Tab

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `author` | relationship → users | ✅ | Post author |
| `categories` | select (hasMany) | ❌ | Post categories |
| `tags` | text | ❌ | Comma-separated tags |
| `status` | select | ✅ | Draft/Published/Scheduled/Archived |
| `publishedDate` | date | ❌ | Publication date (auto-set on publish) |
| `featured` | checkbox | ❌ | Feature on homepage/blog landing |

#### 3. SEO Tab

| Field | Type | Description |
|-------|------|-------------|
| `seo.metaTitle` | text | Custom meta title (defaults to post title) |
| `seo.metaDescription` | textarea | Meta description (max 160 chars) |
| `seo.keywords` | text | SEO keywords (comma-separated) |
| `seo.ogImage` | upload → media | Social sharing image |

### BlocksFeature Configuration

```typescript
editor: lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    BlocksFeature({
      blocks: ['image', 'text', 'video', 'spacer', 'divider', 'columns'],
    }),
  ],
})
```

This configuration enables inline block embedding directly in the Lexical editor using Payload's BlocksFeature.

### Categories

Available post categories:

- **Piano Education** (`education`) - Learning resources, tutorials
- **Product News** (`product-news`) - New piano releases, updates
- **Artist Spotlights** (`artists`) - Featured artists, performances
- **Maintenance & Care** (`maintenance`) - Piano care tips
- **Buying Guides** (`buying-guides`) - Piano purchasing advice
- **Events** (`events`) - Concerts, recitals, workshops
- **Company News** (`company-news`) - Business announcements
- **Technology** (`technology`) - Piano technology innovations

### Hooks

#### beforeChange Hook

Auto-generates URL-friendly slugs and sets publish dates:

```typescript
beforeChange: [
  async ({ data, operation }) => {
    // Auto-generate slug from title
    if (data.title && !data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
    }

    // Set publishedDate on first publish
    if (data.status === 'published' && !data.publishedDate) {
      data.publishedDate = new Date().toISOString()
    }

    return data
  }
]
```

#### afterChange Hook

Triggers on-demand revalidation for **multiple paths**:

```typescript
afterChange: [
  async ({ doc, context }) => {
    // Only revalidate if post is published
    if (doc.status !== 'published') return doc

    // Revalidate both the post page AND the blog index
    const pathsToRevalidate = [
      { slug: doc.slug, type: 'post' },  // /blog/{slug}
      { path: '/blog' },                 // /blog index
    ]

    // Background revalidation (non-blocking)
    pathsToRevalidate.forEach((params) => {
      fetch(`${baseURL}/api/revalidate`, {
        method: 'POST',
        body: JSON.stringify({
          secret: process.env.REVALIDATION_SECRET,
          ...params,
        }),
      })
    })

    return doc
  }
]
```

### Access Control

```typescript
access: {
  read: ({ req: { user } }) => {
    // Public users: only published posts
    if (!user) {
      return { status: { equals: 'published' } }
    }
    // Admins: all posts
    return true
  }
}
```

---

## Modular Block System

The blog uses a **modular, composable block architecture** with atomic blocks that can be used individually or composed together in columns.

### Philosophy

**Atomic Blocks** → Small, single-purpose, reusable
**Compositional Blocks** → Container blocks that accept atomic blocks
**Flexibility** → Mix and match blocks for any layout

### Atomic Blocks

#### 1. Image Block

**Location**: `src/blocks/Image.ts`

**Purpose**: Display images with captions and sizing options

**Fields**:
- `image` (upload) - Image file (required)
- `alt` (text) - Alt text for accessibility (required)
- `caption` (text) - Optional caption below image
- `size` (select) - small (400px), medium (600px), large (800px), full
- `alignment` (select) - left, center, right

**Use Cases**:
- Standalone featured images
- Inline images within columns
- Image-text side-by-side layouts

#### 2. Text Block

**Location**: `src/blocks/Text.ts`

**Purpose**: Simple rich text content with basic formatting

**Fields**:
- `content` (richText) - Lexical editor with basic formatting (required)
- `alignment` (select) - left, center, right, justify

**Features**:
- Headings, bold, italic, lists, links
- Simpler than main content editor
- Perfect for columns

**Use Cases**:
- Text in multi-column layouts
- Simple formatted text sections
- Caption-heavy content

#### 3. Video Block

**Location**: `src/blocks/Video.ts`

**Purpose**: Embed videos from upload, YouTube, or Vimeo

**Fields**:
- `source` (select) - upload, youtube, vimeo (required)
- `videoFile` (upload) - For uploaded videos
- `videoUrl` (text) - For YouTube/Vimeo embeds
- `posterImage` (upload) - Thumbnail for uploaded videos
- `controls` (checkbox) - Show video controls
- `autoplay` (checkbox) - Autoplay on load (muted)
- `loop` (checkbox) - Loop video
- `caption` (text) - Optional caption

**Use Cases**:
- Piano performance videos
- Product demonstrations
- YouTube/Vimeo embeds
- Looping background videos

#### 4. Spacer Block

**Location**: `src/blocks/Spacer.ts`

**Purpose**: Add vertical spacing between content

**Fields**:
- `height` (select) - xs (8px), small (16px), medium (32px), large (64px), xl (96px)

**Use Cases**:
- Breathing room between sections
- Visual separation
- Layout control

#### 5. Divider Block

**Location**: `src/blocks/Divider.ts`

**Purpose**: Horizontal dividing lines

**Fields**:
- `style` (select) - solid, dashed, dotted
- `color` (select) - default (light gray), dark, brand (kawai-red)
- `width` (select) - full, 75%, 50%, 25%
- `spacing` (select) - small (1rem), medium (2rem), large (4rem)

**Use Cases**:
- Section breaks
- Visual separators
- Content organization

### Compositional Blocks

#### Columns Block

**Location**: `src/blocks/Columns.ts`

**Purpose**: Multi-column layouts (1-4 columns) that accept atomic blocks

**Fields**:
- `columns` (array) - Up to 4 columns
  - `width` (select) - 25%, 33%, 50%, 66%, 75%, 100%
  - `content` (blocks) - **Accepts atomic blocks** (Image, Text, Video, Spacer, Divider)
- `layout` (group)
  - `gap` (select) - small (0.5rem), medium (1rem), large (2rem)
  - `verticalAlign` (select) - top, center, bottom
  - `backgroundColor` (select) - transparent, white, light, dark

**Use Cases**:
- Image + text side-by-side (50% / 50%)
- Three-column feature lists (33% / 33% / 33%)
- Asymmetric layouts (66% / 33%)
- Nested content structures

**Example Composition**:
```
Columns Block (2 columns, 50% each):
  Column 1:
    - Image Block (piano photo)
    - Spacer Block (medium)
    - Text Block (description)
  Column 2:
    - Text Block (features list)
    - Divider Block (solid, medium)
    - Video Block (YouTube embed)
```

### Block Rendering

All blocks are rendered using the **LexicalSerializer** when embedded in rich text content.

**Rendering Flow**:
1. Lexical content with embedded blocks
2. LexicalSerializer encounters block node
3. Custom block converter renders appropriate block component
4. For Columns blocks, recursively renders nested atomic blocks
5. Final JSX output

---

## Frontend Pages

### Blog Index (`/blog`)

**Location**: `src/app/(frontend)/blog/page.tsx`

**Features**:
- Server Component with ISR (5-minute cache)
- Grid layout: 3 columns (desktop), 2 (tablet), 1 (mobile)
- BlogCard components for each post
- Category filtering via query params (`?category=education`)
- SEO metadata generation

**Key Code**:
```typescript
export const revalidate = 300 // 5-minute cache

async function getPosts(category?: string) {
  const payload = await getPayload({ config })

  const posts = await payload.find({
    collection: 'posts',
    where: {
      status: { equals: 'published' },
      ...(category && { categories: { contains: category } })
    },
    sort: '-publishedDate',
    limit: 50
  })

  return posts.docs
}
```

**URL Examples**:
- `/blog` - All posts
- `/blog?category=education` - Education posts only

### Blog Detail (`/blog/[slug]`)

**Location**: `src/app/(frontend)/blog/[slug]/page.tsx`

**Features**:
- Server Component with ISR (5-minute cache)
- `generateStaticParams()` for SEO (pre-renders all published posts)
- Full SEO metadata with Open Graph support
- Featured image hero
- Author, date, categories display
- Rich text content rendering with **embedded blocks** (LexicalSerializer)

**Key Code**:
```typescript
export const revalidate = 300

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const posts = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    limit: 500
  })

  return posts.docs.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug)

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    openGraph: {
      title: post.title,
      images: [post.seo?.ogImage || post.featuredImage]
    }
  }
}
```

### BlogCard Component

**Location**: `src/components/blog/BlogCard.tsx`

Reusable card component for blog listings:

**Features**:
- Featured image with Next.js Image optimization
- Title with 2-line truncation
- Excerpt with 3-line truncation
- Category badges (max 2 displayed)
- Formatted published date
- "Read more →" link with hover effects

**Styling**: KAWAI brand colors (kawai-red, kawai-charcoal, kawai-pearl)

---

## Lexical Rich Text

### LexicalSerializer

**Location**: `src/lib/lexical/LexicalSerializer.tsx`

Converts Lexical JSON to JSX using custom converters, **including embedded blocks**.

**Key Converters**:

#### 1. Upload Node (Images)
```typescript
upload: ({ node }) => {
  if (node.relationTo === 'media' && typeof node.value === 'object') {
    const { url, alt, width, height } = node.value
    return <Image src={url} alt={alt} width={width} height={height} />
  }
}
```

#### 2. Link Node
```typescript
...LinkJSXConverter({
  internalDocToHref: ({ linkNode }) => {
    const { relationTo, value } = linkNode.fields.doc
    switch (relationTo) {
      case 'posts': return `/blog/${value.slug}`
      case 'products': return `/products/${value.slug}`
      default: return `/${value.slug}`
    }
  }
})
```

#### 3. Headings
```typescript
h1: ({ node, nodesToJSX }) => (
  <h1 className="text-4xl md:text-5xl font-bold text-kawai-charcoal mb-6">
    {nodesToJSX({ nodes: node.children })}
  </h1>
)
```

#### 4. Embedded Blocks (NEW - Modular Architecture)
```typescript
blocks: {
  // Atomic blocks
  image: ({ node }) => <ImageBlock {...node.fields} />,
  text: ({ node }) => <TextBlock {...node.fields} />,
  video: ({ node }) => <VideoBlock {...node.fields} />,
  spacer: ({ node }) => <SpacerBlock {...node.fields} />,
  divider: ({ node }) => <DividerBlock {...node.fields} />,
  // Compositional blocks
  columns: ({ node }) => <ColumnsBlock {...node.fields} />,
}
```

**Typography**: Uses Tailwind prose classes for readable formatting.

### Block Components

#### ImageBlock Component

**Location**: `src/components/blocks/ImageBlock.tsx`

Client Component that renders images with:
- Next.js Image optimization
- R2 CDN integration (`getImagePropsWithFallback`)
- Size classes (small → max-w-md, medium → max-w-2xl, large → max-w-4xl)
- Alignment (left → mr-auto, center → mx-auto, right → ml-auto)
- Optional captions

#### TextBlock Component

**Location**: `src/components/blocks/TextBlock.tsx`

Client Component that renders rich text with:
- LexicalSerializer for nested content
- Alignment classes
- Tailwind prose typography

#### VideoBlock Component

**Location**: `src/components/blocks/VideoBlock.tsx`

Client Component that renders videos from:
- YouTube embeds (extracts video ID from URL)
- Vimeo embeds (extracts video ID from URL)
- Uploaded video files (HTML5 video element)
- Poster images, autoplay, loop controls

#### SpacerBlock Component

**Location**: `src/components/blocks/SpacerBlock.tsx`

Simple Client Component that renders spacing divs with height classes:
- xs → h-2 (8px)
- small → h-4 (16px)
- medium → h-8 (32px)
- large → h-16 (64px)
- xl → h-24 (96px)

#### DividerBlock Component

**Location**: `src/components/blocks/DividerBlock.tsx`

Client Component that renders HR elements with:
- Style classes (solid, dashed, dotted)
- Color classes (default, dark, brand)
- Width classes (full, 75%, 50%, 25%)
- Spacing classes (small → my-4, medium → my-8, large → my-16)

#### ColumnsBlock Component (Recursive)

**Location**: `src/components/blocks/ColumnsBlock.tsx`

Client Component that renders multi-column layouts with:
- Responsive flexbox grid
- Gap, vertical alignment, background color options
- **Recursive rendering** of nested atomic blocks
- Width mapping (25 → w-1/4, 50 → w-1/2, etc.)

**Nested Block Rendering**:
```typescript
const NESTED_BLOCK_COMPONENTS = {
  image: ImageBlock,
  text: TextBlock,
  video: VideoBlock,
  spacer: SpacerBlock,
  divider: DividerBlock,
}

// Recursively render each nested block
column.content.map((block) => {
  const BlockComponent = NESTED_BLOCK_COMPONENTS[block.blockType]
  return <BlockComponent key={block.id} {...block} />
})
```

---

## Revalidation System

### How It Works

The blog uses **on-demand ISR revalidation** to ensure content updates appear immediately:

1. **ISR Cache**: Pages are statically generated and cached for 5 minutes
2. **On-Demand Revalidation**: When a post is published/updated, cache is cleared immediately
3. **Automatic Regeneration**: Next visit triggers fresh page generation

### Multiple Path Revalidation

When a post changes, **two paths** are revalidated:

```typescript
const pathsToRevalidate = [
  { slug: doc.slug, type: 'post' },  // Individual post: /blog/{slug}
  { path: '/blog' },                 // Blog index: /blog
]
```

**Why both paths?**
- Blog index needs to show new/updated posts in the listing
- Individual post page needs fresh content

### Revalidation API

**Location**: `src/app/api/revalidate/route.ts`

**Endpoint**: `POST /api/revalidate`

**Request Body**:
```json
{
  "secret": "your-revalidation-secret",
  "slug": "my-blog-post",
  "type": "post"
}
```

**OR**:
```json
{
  "secret": "your-revalidation-secret",
  "path": "/blog"
}
```

**Response**:
```json
{
  "revalidated": true,
  "path": "/blog/my-blog-post",
  "timestamp": "2025-12-30T12:00:00.000Z"
}
```

### Environment Variables

Required in `.env.local`:

```bash
# On-Demand Revalidation Secret (min 32 characters)
REVALIDATION_SECRET=your-secure-random-string-here

# Site URL for revalidation requests
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Production: https://yourdomain.com
```

### Security

- **Secret-based authentication** prevents unauthorized revalidation
- **Background fetch** doesn't block CMS save operations
- **Error handling** logs failures but doesn't throw (non-blocking)
- **Context flag** prevents infinite loops (`skipRevalidation`)

---

## Creating Blog Posts

### Step-by-Step Guide

#### 1. Access Payload Admin

Navigate to: `http://localhost:3000/admin`

Go to: **Content Collections → Posts**

#### 2. Create New Post

Click: **"Create New Post"**

#### 3. Content Tab

**Required**:
- **Title**: "Welcome to Our Blog"
- **Content**: Add rich text with headings, lists, images, links

**Using Modular Blocks in Content**:
1. Position cursor in Lexical editor
2. Click "Add Block" button (or use `/` slash command)
3. Select block type:
   - **Image** - Add standalone images with captions
   - **Text** - Add formatted text sections
   - **Video** - Embed YouTube/Vimeo or upload videos
   - **Spacer** - Add vertical spacing
   - **Divider** - Add horizontal rules
   - **Columns** - Create multi-column layouts
4. Configure block settings
5. For Columns blocks:
   - Add columns (up to 4)
   - Set width for each column
   - Click "Add block" within each column
   - Add Image, Text, Video, Spacer, or Divider blocks
   - Configure gap, alignment, background color

**Optional**:
- **Excerpt**: "Discover the world of KAWAI pianos..."
- **Featured Image**: Upload hero image

**Slug**: Auto-generated from title (editable if needed)

#### 4. Settings Tab

**Required**:
- **Author**: Select your user
- **Status**: **Published** (critical for public visibility)

**Optional**:
- **Categories**: Select "Piano Education", "Product News", etc.
- **Tags**: "digital piano, beginner, tutorial"
- **Featured**: Check to feature on homepage
- **Published Date**: Auto-set on first publish (can override)

#### 5. SEO Tab

**Optional** (uses smart defaults):
- **Meta Title**: Custom title for search engines
- **Meta Description**: Custom description (max 160 chars)
- **Keywords**: "kawai piano, digital piano buying guide"
- **OG Image**: Custom social sharing image

#### 6. Save & Publish

Click: **"Save"**

**What happens**:
1. `beforeChange` hook generates slug if empty
2. `beforeChange` hook sets publishedDate if first publish
3. Post saved to database
4. `afterChange` hook triggers revalidation
5. `/blog` and `/blog/{slug}` cache cleared
6. Post appears on frontend immediately

### Example Blog Post Structures

#### Example 1: Simple Text Post

```
Title: "5 Tips for Piano Beginners"

Content (Lexical):
  - Heading: "Introduction"
  - Paragraph: "Starting your piano journey..."

  - Spacer Block (medium)

  - Heading: "Tip 1: Practice Daily"
  - Paragraph: "Consistency is key..."
  - Image Block: Piano practice setup (medium, center)

  - Spacer Block (small)

  - Heading: "Tip 2: Focus on Technique"
  - Paragraph: "Proper hand position..."

  [... more tips ...]
```

#### Example 2: Product Feature with Columns

```
Title: "Introducing the KAWAI CA99"

Content (Lexical):
  - Heading: "The Ultimate Digital Piano Experience"
  - Paragraph: "We're excited to announce..."

  - Columns Block (2 columns, 50% each, medium gap):
      Column 1:
        - Image Block: CA99 product photo (full, center)
      Column 2:
        - Text Block:
            "Grand Feel III Action
             88-key wooden keyboard
             Bluetooth connectivity
             ..."

  - Spacer Block (large)

  - Heading: "Key Features"
  - Paragraph: "The CA99 includes..."

  - Divider Block (solid, brand color, full width, medium spacing)

  - Video Block: YouTube demo (https://youtube.com/watch?v=...)
```

#### Example 3: Multi-Column Feature Comparison

```
Title: "Digital vs Acoustic Pianos: A Complete Guide"

Content (Lexical):
  - Heading: "Introduction"
  - Paragraph: "Choosing between digital and acoustic..."

  - Columns Block (3 columns, 33% each, large gap, light background):
      Column 1:
        - Text Block: "Digital Pianos"
        - Divider Block (thin, dark, 50%)
        - Text Block:
            "✓ Portable
             ✓ Affordable
             ✓ Headphone friendly
             ..."
      Column 2:
        - Text Block: "Acoustic Pianos"
        - Divider Block (thin, dark, 50%)
        - Text Block:
            "✓ Authentic touch
             ✓ Classic sound
             ✓ Investment value
             ..."
      Column 3:
        - Text Block: "Hybrid Pianos"
        - Divider Block (thin, dark, 50%)
        - Text Block:
            "✓ Best of both
             ✓ Premium experience
             ✓ Modern technology
             ..."
```

---

## Customization Guide

### Adding New Atomic Blocks

To create a new atomic block (e.g., "Quote" block):

**Step 1: Create Block Definition**

`src/blocks/Quote.ts`:
```typescript
import type { Block } from 'payload'

export const Quote: Block = {
  slug: 'quote',
  interfaceName: 'QuoteBlock',
  fields: [
    {
      name: 'text',
      type: 'textarea',
      required: true,
    },
    {
      name: 'author',
      type: 'text',
    },
  ],
}
```

**Step 2: Create Block Component**

`src/components/blocks/QuoteBlock.tsx`:
```typescript
'use client'

import type { QuoteBlock as QuoteBlockType } from '@/payload-types'

export function QuoteBlock({ text, author }: QuoteBlockType) {
  return (
    <blockquote className="border-l-4 border-kawai-red pl-6 italic">
      <p className="text-lg">{text}</p>
      {author && <footer className="mt-2">— {author}</footer>}
    </blockquote>
  )
}
```

**Step 3: Register Block**

In `src/blocks/index.ts`:
```typescript
export { Quote } from './Quote'
```

In `src/payload.config.ts`:
```typescript
import { Quote } from './blocks'

blocks: [
  // ... existing blocks
  Quote,
]
```

**Step 4: Add to LexicalSerializer**

In `src/lib/lexical/LexicalSerializer.tsx`:
```typescript
import { QuoteBlock } from '@/components/blocks/QuoteBlock'

blocks: {
  // ... existing blocks
  quote: ({ node }) => <QuoteBlock {...node.fields} />,
}
```

**Step 5: Enable in Posts Collection**

In `src/collections/Posts.ts`:
```typescript
BlocksFeature({
  blocks: ['image', 'text', 'video', 'spacer', 'divider', 'columns', 'quote'],
})
```

**Step 6: Regenerate Types**

```bash
bun x payload generate:types
```

### Adding New Categories

**File**: `src/collections/Posts.ts`

```typescript
{
  name: 'categories',
  type: 'select',
  hasMany: true,
  options: [
    // ... existing categories
    { label: 'Your New Category', value: 'new-category' },
  ]
}
```

### Customizing Block Styling

**Example - Customize ImageBlock**:

`src/components/blocks/ImageBlock.tsx`:
```typescript
// Change size mappings
const sizeClasses = {
  small: 'max-w-sm',    // Smaller than default
  medium: 'max-w-3xl',  // Larger than default
  large: 'max-w-6xl',   // Much larger
  full: 'w-full',
}

// Add border or shadow
<Image
  {...imageProps}
  className="w-full h-auto object-cover rounded-lg border-2 border-kawai-red shadow-lg"
/>
```

---

## Troubleshooting

### Posts Not Appearing on Frontend

**Symptoms**: Created post with blocks, but doesn't show on `/blog`

**Checklist**:
1. ✅ **Status is "Published"** (not Draft)
2. ✅ **Types regenerated** after creating new blocks (`bun x payload generate:types`)
3. ✅ **Server restarted** after configuration changes
4. ✅ **Cache cleared** (wait 5 minutes or trigger revalidation)

### Embedded Blocks Not Rendering

**Symptoms**: Blocks show as empty or missing in blog post

**Checks**:
1. ✅ **BlocksFeature enabled** in Posts collection Lexical editor
2. ✅ **Block slug matches** in BlocksFeature configuration
3. ✅ **Block converter added** to LexicalSerializer
4. ✅ **Block component imported** in LexicalSerializer
5. ✅ **Types regenerated** after adding new blocks

**Debug Block Rendering**:
```typescript
// In LexicalSerializer.tsx
blocks: {
  myBlock: ({ node }) => {
    console.log('Rendering myBlock:', node.fields)
    return <MyBlockComponent {...node.fields} />
  }
}
```

### Columns Block Not Showing Nested Blocks

**Symptoms**: Columns render but nested blocks don't appear

**Checks**:
1. ✅ **Atomic blocks added** to column content field
2. ✅ **blockReferences includes** atomic block slugs in Columns block definition
3. ✅ **Block components mapped** in ColumnsBlock NESTED_BLOCK_COMPONENTS
4. ✅ **Recursive rendering** working correctly

**Debug Columns Rendering**:
```typescript
// In ColumnsBlock.tsx
{content.map((block) => {
  console.log('Rendering nested block:', block.blockType, block)
  const BlockComponent = NESTED_BLOCK_COMPONENTS[block.blockType]

  if (!BlockComponent) {
    console.warn('No component for block type:', block.blockType)
    return null
  }

  return <BlockComponent key={block.id} {...block} />
})}
```

### Images Not Loading in Image Blocks

**Symptoms**: Image blocks show broken images

**Checks**:
1. ✅ **R2 credentials** configured in `.env.local`
2. ✅ **getImagePropsWithFallback** imported correctly
3. ✅ **Media uploaded** to Payload CMS
4. ✅ **Fallback image exists** at path specified

### TypeScript Errors After Adding Blocks

**Symptoms**: Build fails with type errors for new blocks

**Solution**:
```bash
# Regenerate Payload types
bun x payload generate:types

# Or run full build
bun run build
```

**Check**:
- ✅ `src/payload-types.ts` includes new block interfaces
- ✅ Import paths use `@/payload-types`
- ✅ Block component props match generated interfaces

---

## Performance Optimization

### ISR Cache Strategy

**Current Configuration**:
- **Revalidate**: 300 seconds (5 minutes)
- **On-Demand**: Immediate on content change
- **generateStaticParams**: Pre-renders all published posts

**Optimize for Traffic**:

**High Traffic** (lots of readers, few updates):
```typescript
export const revalidate = 3600 // 1 hour
```

**High Update Frequency** (many posts published daily):
```typescript
export const revalidate = 60 // 1 minute
```

### Block Rendering Performance

**Modular blocks are optimized for performance**:
- ✅ Client Components only where needed
- ✅ Server Components for static content
- ✅ Lazy loading for heavy blocks (videos)
- ✅ Next.js Image optimization for all image blocks

**Best Practices**:
- Use Spacer blocks instead of empty Text blocks
- Optimize image uploads before adding to Image blocks
- Use Divider blocks for visual separation (lighter than images)

---

## Production Deployment

### Environment Variables

Required for production:

```bash
# Database
DATABASE_URI=mongodb+srv://user:pass@cluster.mongodb.net/kawai

# Payload
PAYLOAD_SECRET=your-32-char-secret

# Revalidation
REVALIDATION_SECRET=your-32-char-revalidation-secret
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# R2 Storage
NEXT_PUBLIC_S3_PUBLIC_URL=https://your-bucket.r2.cloudflarestorage.com
S3_BUCKET=your-bucket-name
S3_ENDPOINT=https://your-account.r2.cloudflarestorage.com
S3_REGION=auto
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
```

### Pre-Deploy Checklist

- [ ] All modular blocks registered in payload.config.ts
- [ ] Block components created and imported in LexicalSerializer
- [ ] `bun x payload generate:types` completed successfully
- [ ] Test posts with embedded blocks created and visible
- [ ] Columns blocks with nested blocks render correctly
- [ ] Images in Image blocks load from R2/CDN
- [ ] Videos in Video blocks play correctly (YouTube/Vimeo/upload)
- [ ] Revalidation tested and working for both /blog and /blog/{slug}
- [ ] Mobile responsive (test columns stacking on mobile)
- [ ] Lighthouse score >90

---

## Support & Resources

### Documentation Links

- [Payload CMS Docs](https://payloadcms.com/docs)
- [Payload BlocksFeature](https://payloadcms.com/docs/lexical#blocks-feature)
- [Lexical Editor](https://lexical.dev/)
- [Next.js ISR](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [KAWAI Architecture](../CLAUDE.md)

### Internal Resources

- **Main Architecture**: `CLAUDE.md`
- **Block System**: `src/lib/blocks/BlockRenderer.tsx`
- **Media System**: `src/lib/media/r2-utils.ts`

---

**Last Updated**: December 30, 2025
**Version**: 2.0.0 (Modular Block Architecture)
**Author**: KAWAI Development Team
