# Payload Blocks System

Guide to the block system organization and usage in KAWAI CMS.

## Overview

Blocks are modular content components that can be added to pages, posts, and products. They are organized by purpose into categories and registered globally for optimal performance.

**Key Architecture:**
- Blocks are defined once in `payload.config.ts` under the global `blocks` array
- Collections reference blocks by slug using `blockReferences` (not direct imports)
- All blocks use category-prefixed slugs for clear organization
- Blocks include emoji labels for visual identification in the admin UI

## Block Categories

### Content Blocks (`src/blocks/content/`)

Blog article and editorial content blocks designed for inline use in rich text editors.

| Block | Slug | Purpose | Best For |
|-------|------|---------|----------|
| 📝 Text | `content-text` | Rich text paragraphs with formatting | Article body content, sections |
| 📷 Image | `content-image` | Images with captions and alt text | Visual content with context |
| 🎥 Video | `content-video` | Embedded videos (YouTube, Vimeo, etc.) | Video tutorials, demos |
| 💻 Code | `content-code` | Syntax-highlighted code snippets | Technical tutorials, documentation |
| 📢 Banner | `content-banner` | Info/warning/success banners | Important notices, alerts |

**Where to use:**
- Blog posts (inline in rich text via `BlocksFeature`)
- Article pages and content-heavy pages
- Anywhere you need editorial content with rich formatting

**Example usage in Posts collection:**
```typescript
{
  name: 'content',
  type: 'richText',
  editor: lexicalEditor({
    features: [
      BlocksFeature({
        blocks: ['content-text', 'content-image', 'content-video', 'content-code', 'content-banner']
      })
    ]
  })
}
```

### Layout Blocks (`src/blocks/layout/`)

Structural blocks for organizing content into complex layouts.

| Block | Slug | Purpose | Best For |
|-------|------|---------|----------|
| 📐 Columns | `layout-columns` | Multi-column layouts (2-4 columns) | Side-by-side content, comparisons |
| ↕️ Spacer | `layout-spacer` | Vertical spacing with adjustable height | Add breathing room between sections |
| ➖ Divider | `layout-divider` | Horizontal visual separators | Section breaks, visual separation |

**Where to use:**
- Page builder areas
- Complex layouts requiring grid structures
- Footer areas in blog posts (to organize related content)

**Example usage:**
```typescript
{
  name: 'footerBlocks',
  type: 'blocks',
  blockReferences: ['layout-columns', 'layout-spacer', 'layout-divider'],
  blocks: []
}
```

### Marketing Blocks (`src/blocks/marketing/`)

Conversion-focused promotional blocks designed to drive user actions.

| Block | Slug | Purpose | Best For |
|-------|------|---------|----------|
| 🎯 Hero | `marketing-hero` | Large hero sections with headlines and CTAs | Page headers, landing page banners |
| 📣 Call to Action | `marketing-cta` | Prominent CTA buttons/sections | Lead generation, conversions |
| ⭐ Testimonials | `marketing-testimonials` | Customer testimonials and reviews | Building trust, social proof |

**Where to use:**
- Landing pages
- Post header/footer areas (promotional content)
- Storefronts and dealer pages
- Any conversion-focused page

**Example usage in Posts:**
```typescript
{
  name: 'headerBlocks',
  type: 'blocks',
  blockReferences: ['marketing-hero', 'content-banner'],
  blocks: [],
  admin: {
    description: 'Optional: Add promotional content before the article'
  }
}
```

### Product Blocks (`src/blocks/product/`)

Product-specific showcase blocks that automatically pull data from the product document.

| Block | Slug | Purpose | Best For |
|-------|------|---------|----------|
| 🎹 Product Showcase | `product-showcase` | Compact product highlights with image | Product cards, featured products |
| 🏆 Product Hero | `product-hero` | Full-width product hero with auto-data | Product landing pages (auto-added to new products) |
| 🖼️ Image Gallery | `product-gallery` | Product photo galleries | Multiple product images, 360° views |
| ✨ Features List | `product-features` | Feature highlights with icons | Product benefits, key features |
| 📋 Specifications | `product-specs` | Technical specifications table | Detailed product specifications |

**Where to use:**
- Product pages (via `pageContent` field)
- Product-focused landing pages
- Product comparison pages

**Special behavior:**
- `product-hero` is **automatically added** to new products on creation
- Product blocks can access the parent product document data
- Supports optional overrides for custom content

**Example usage in Products collection:**
```typescript
{
  name: 'pageContent',
  type: 'blocks',
  blockReferences: [
    'product-showcase',
    'product-hero',
    'product-gallery',
    'product-features',
    'product-specs'
  ],
  blocks: []
}
```

## Usage Patterns in Collections

### Posts Collection

**Three block areas:**

1. **Article Content** (`content` field - rich text)
   - Inline blocks embedded in article flow
   - Available: Text, Image, Video, Code, Banner
   - Rendered within the article body

2. **Header Blocks** (`headerBlocks` field)
   - Before article content
   - Available: Hero, Banner
   - Use for promotional headers or important notices

3. **Footer Blocks** (`footerBlocks` field)
   - After article content
   - Available: CallToAction, Testimonials, Columns
   - Use for conversion elements and related content

**Example structure:**
```
┌─────────────────────────────┐
│ Header Blocks (optional)    │  <- marketing-hero, content-banner
├─────────────────────────────┤
│ Article Content (rich text) │  <- content-text, content-image, content-code
│ - Title                     │
│ - Featured Image            │
│ - Content (with inline      │
│   embedded blocks)          │
├─────────────────────────────┤
│ Footer Blocks (optional)    │  <- marketing-cta, marketing-testimonials
└─────────────────────────────┘
```

### Products Collection

**Single block area:**

- **Page Content** (`pageContent` field)
  - Full page builder for product pages
  - Available: All product blocks, plus Hero, TextContent, CallToAction, Testimonials
  - Auto-generates `product-hero` block for new products

**Example structure:**
```
┌─────────────────────────────┐
│ Product Hero (auto-added)   │  <- product-hero (uses product data)
├─────────────────────────────┤
│ Image Gallery               │  <- product-gallery
├─────────────────────────────┤
│ Features List               │  <- product-features
├─────────────────────────────┤
│ Specifications              │  <- product-specs
├─────────────────────────────┤
│ Call to Action              │  <- marketing-cta
└─────────────────────────────┘
```

## Global Block Registration

All blocks are registered once in `payload.config.ts` for optimal performance:

```typescript
// payload.config.ts
import {
  // Content blocks
  Text,
  Image,
  Video,
  Code,
  Banner,
  // Layout blocks
  Columns,
  Spacer,
  Divider,
  // Marketing blocks
  Hero,
  CallToAction,
  Testimonials,
  // Product blocks
  ProductShowcase,
  ProductHero,
  ImageGallery,
  FeaturesList,
  Specifications,
} from './blocks'

export default buildConfig({
  blocks: [
    // Register all blocks once
    Text,
    Image,
    Video,
    Code,
    Banner,
    Columns,
    Spacer,
    Divider,
    Hero,
    CallToAction,
    Testimonials,
    ProductShowcase,
    ProductHero,
    ImageGallery,
    FeaturesList,
    Specifications,
  ],
  collections: [...]
})
```

**Why global registration?**
- Blocks are defined once and referenced by slug everywhere
- Prevents duplication and improves bundle size
- Enables better type inference
- Allows blocks to be shared across collections

## Adding New Blocks

Follow these steps to add a new block to the system:

### 1. Choose Category

Determine which category your block belongs to:

- **Content** - Editorial/article content (text, images, media)
- **Layout** - Structural organization (columns, spacing)
- **Marketing** - Conversion-focused (heroes, CTAs, testimonials)
- **Product** - Product-specific features (showcases, specs, galleries)

### 2. Create Block File

Create file in appropriate folder: `src/blocks/{category}/YourBlock.ts`

```typescript
import type { Block } from 'payload'

export const YourBlock: Block = {
  slug: 'category-your-block',  // Use category prefix (e.g., 'content-quote')
  labels: {
    singular: '🎨 Your Block',  // Use emoji for visual ID
    plural: 'Your Blocks'
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Your+Block',
  imageAltText: 'Clear description of what this block does and when to use it',
  interfaceName: 'CategoryYourBlockBlock',  // e.g., ContentQuoteBlock
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Clear description for editors'
      }
    },
    // Add more fields as needed
  ]
}
```

### 3. Add to Barrel Export

Update `src/blocks/{category}/index.ts`:

```typescript
export { YourBlock } from './YourBlock'
```

### 4. Register Globally

Add to `src/payload.config.ts` blocks array:

```typescript
import { YourBlock } from '@/blocks/category'

export default buildConfig({
  blocks: [
    // ... existing blocks
    YourBlock,
  ],
})
```

### 5. Use in Collections

Reference by slug using `blockReferences`:

```typescript
{
  name: 'content',
  type: 'blocks',
  blockReferences: ['category-your-block'],  // Reference by slug
  blocks: []  // Must be empty when using blockReferences
}
```

Or in Lexical editor:

```typescript
{
  name: 'content',
  type: 'richText',
  editor: lexicalEditor({
    features: [
      BlocksFeature({
        blocks: ['category-your-block']
      })
    ]
  })
}
```

### 6. Document

Add your new block to this guide under the appropriate category section.

## Best Practices

### Block Design

✅ **DO:**
- Keep blocks focused on one purpose (single responsibility principle)
- Use clear, descriptive labels with emojis for visual identification
- Add `imageAltText` to describe block purpose and usage
- Include `admin.description` on all fields for editor guidance
- Use conditional fields (`admin.condition`) to hide irrelevant options
- Set `maxDepth: 0` on relationship fields to prevent deep fetching

❌ **DON'T:**
- Create mega-blocks with too many options (split into multiple blocks)
- Duplicate blocks across categories (choose one category)
- Forget to add admin descriptions (confusing for editors)
- Use generic slugs without category prefix

### Naming Conventions

✅ **DO:**
- Use category prefix: `content-`, `layout-`, `marketing-`, `product-`
- Use descriptive slugs: `content-image` not just `image`
- Use PascalCase for file/export: `ImageGallery.ts`, `export { ImageGallery }`
- Use kebab-case for slugs: `image-gallery`
- Use consistent interfaceName: `{Category}{Name}Block` (e.g., `ContentImageBlock`)

❌ **DON'T:**
- Use camelCase or snake_case for slugs
- Skip category prefixes (causes collisions)
- Use inconsistent naming across file/export/slug

### Performance

✅ **DO:**
- Use `blockReferences` instead of importing blocks directly
- Set `maxDepth: 0` on relationship fields in blocks
- Define blocks once in payload.config.ts, reference everywhere
- Use conditional fields to reduce data fetching

❌ **DON'T:**
- Import blocks directly into collection field definitions
- Allow unlimited depth on relationship fields
- Duplicate block definitions across collections

### Organization

✅ **DO:**
- Keep related blocks in the same category folder
- Update barrel exports (`index.ts`) when adding new blocks
- Document new blocks in this guide
- Use consistent emoji patterns for similar block types

❌ **DON'T:**
- Mix unrelated blocks in the same folder
- Skip barrel exports (breaks imports)
- Leave blocks undocumented

## Block Field Types Reference

Common field types used in blocks:

```typescript
// Text fields
{ name: 'title', type: 'text' }
{ name: 'description', type: 'textarea' }

// Rich text (inherits parent editor)
{ name: 'content', type: 'richText' }

// Media upload
{
  name: 'image',
  type: 'upload',
  relationTo: 'media',
  maxDepth: 0  // Prevent deep fetching
}

// Select dropdown
{
  name: 'variant',
  type: 'select',
  defaultValue: 'default',
  options: [
    { label: 'Default', value: 'default' },
    { label: 'Primary', value: 'primary' }
  ]
}

// Checkbox
{
  name: 'showTitle',
  type: 'checkbox',
  defaultValue: true
}

// Number
{
  name: 'columns',
  type: 'number',
  min: 2,
  max: 4,
  defaultValue: 3
}

// Group (nested fields)
{
  name: 'layout',
  type: 'group',
  fields: [
    { name: 'alignment', type: 'select', ... }
  ]
}

// Array (repeatable)
{
  name: 'items',
  type: 'array',
  maxRows: 10,
  fields: [
    { name: 'title', type: 'text' }
  ]
}

// Conditional fields
{
  name: 'customImage',
  type: 'upload',
  relationTo: 'media',
  admin: {
    condition: (data) => data.showImage === true
  }
}
```

## Migration Notes

### Legacy Blocks

The following legacy blocks remain in `src/blocks/` root for backward compatibility:

- `TextContent` - Legacy text block (migrate to `content-text`)
- `Hello` - Example block (deprecated)
- `Archive` - Collection archive block
- `Content` - Legacy content block
- `MediaBlock` - Legacy media block
- `Cta` - Legacy CTA block (migrate to `marketing-cta`)

**Migration strategy:**
1. Gradually migrate existing content to new blocks
2. Update references in collections
3. Deprecate legacy blocks once migration is complete
4. Remove legacy blocks in next major version

### blockReferences vs Direct Import

**Old pattern (deprecated):**
```typescript
import { Hero } from '@/blocks/marketing/Hero'

{
  name: 'content',
  type: 'blocks',
  blocks: [Hero]  // Direct import
}
```

**New pattern (current):**
```typescript
// Block registered globally in payload.config.ts

{
  name: 'content',
  type: 'blocks',
  blockReferences: ['marketing-hero'],  // Reference by slug
  blocks: []  // Required to be empty
}
```

**Benefits of blockReferences:**
- Better performance (blocks loaded once)
- Prevents bundle duplication
- Cleaner collection definitions
- Better type inference

## Troubleshooting

### Block not appearing in admin

**Causes:**
1. Block not registered in `payload.config.ts`
2. Block slug not in `blockReferences` array
3. Typo in block slug

**Solution:**
```typescript
// 1. Check payload.config.ts
blocks: [YourBlock]

// 2. Check collection field
blockReferences: ['category-your-block']  // Must match block slug exactly
```

### Type errors after adding block

**Cause:** Types not regenerated after adding new block

**Solution:**
```bash
bun run build  # Regenerates payload-types.ts
```

### Block fields not saving

**Causes:**
1. Missing `required: true` on critical fields
2. Validation errors not showing
3. Hook preventing save

**Solution:**
- Check browser console for errors
- Add `admin.description` to help editors
- Review collection hooks for context flags

### Performance issues with blocks

**Causes:**
1. Deep relationship fetching
2. Too many blocks on one page
3. Large media files in blocks

**Solution:**
```typescript
// Set maxDepth: 0 on relationships
{
  name: 'image',
  type: 'upload',
  relationTo: 'media',
  maxDepth: 0  // Prevents deep fetching
}
```

## Resources

- **Payload Blocks Documentation**: https://payloadcms.com/docs/fields/blocks
- **Lexical Editor**: https://payloadcms.com/docs/lexical
- **BlocksFeature**: https://payloadcms.com/docs/lexical/features/blocks
- **Project Structure**: See `CLAUDE.md` for full project organization
- **Component Renderers**: See `src/components/blocks/` for frontend block renderers
