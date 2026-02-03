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
| 🎹 Brand Intro | `layout-brand-intro` | Full-screen brand intro overlay with fade animation | Homepage splash, brand moments, elegant page intros |
| 💬 Bottom Popup | `layout-bottom-left-popup` | Bottom corner notification popup with Japanese minimalist design | Announcements, promotions, gentle CTAs, newsletter signups |
| 📐 Columns | `layout-columns` | Multi-column layouts (2-4 columns) | Side-by-side content, comparisons |
| ↕️ Spacer | `layout-spacer` | Vertical spacing with adjustable height | Add breathing room between sections |
| ➖ Divider | `layout-divider` | Horizontal visual separators | Section breaks, visual separation |
| 🎠 Hero Carousel | `layout-hero-carousel` | Full-screen hero carousel with auto-play, touch/keyboard navigation | Hero sections, featured announcements, news rotators |
| 🎬 Video Background | `layout-video-background` | Full-screen video background with glassmorphism sidebar | Impactful hero sections, immersive brand storytelling |

**Brand Intro Features:**
- Full-screen overlay with Kawai logo and "Instrumental to Life" tagline
- Elegant three-phase animation: Fade in → Display → Fade out
- Configurable timing for each animation phase (200-10000ms)
- Optional session-based showing (only once per browser session)
- Click-to-skip functionality for user control
- Body scroll locking during animation
- Multiple background colors (black, kawai-black, kawai-charcoal, white)
- Adjustable logo size (small, medium, large, extra large)
- Custom logo upload or default Kawai text logo
- Japanese-inspired minimalist aesthetic
- **Best Practice**: Should be the FIRST block on a page for optimal effect

**Bottom Popup Features:**
- Japanese minimalist design inspired by 行灯 (andon) paper lanterns
- Refined glassmorphism with subtle grain texture and inner glow
- Customizable content: icon, title, message, CTA button
- Four visual themes: Light (frosted pearl), Dark (charcoal glass), Red Accent, Gold Accent
- Position control: bottom-left or bottom-right
- Three size options: compact (280px), medium (360px), large (420px)
- Multiple animation styles: slide, fade, bounce (spring physics), scale
- Auto-show delay (0-30 seconds) and auto-dismiss timer
- Session-based persistence (show once per session)
- Dismissible with close button and Escape key support
- Progress bar indicator for auto-dismiss countdown
- Noto Serif JP typography for Japanese refinement
- Accessibility-friendly with ARIA labels and keyboard navigation
- Custom storage key for tracking multiple popup campaigns
- Z-index control for stacking order

**Where to use:**
- Homepage as an elegant entrance experience
- Special event or campaign landing pages
- Product launch pages
- Brand-focused pages
- Important announcements

**Other Layout Blocks:**
- Page builder areas
- Complex layouts requiring grid structures
- Footer areas in blog posts (to organize related content)
- Hero sections for dynamic, rotating content

**Example usage:**
```typescript
{
  name: 'footerBlocks',
  type: 'blocks',
  blockReferences: ['layout-columns', 'layout-spacer', 'layout-divider'],
  blocks: []
}

// For hero sections with carousel
{
  name: 'heroSection',
  type: 'blocks',
  blockReferences: ['layout-hero-carousel'],
  blocks: [],
  maxRows: 1, // Only one hero carousel per page
  admin: {
    description: 'Add a full-screen hero carousel with rotating content'
  }
}

// For hero sections with video background
{
  name: 'heroSection',
  type: 'blocks',
  blockReferences: ['layout-video-background'],
  blocks: [],
  maxRows: 1, // Only one video background per page
  admin: {
    description: 'Add a full-screen video background with glassmorphism sidebar'
  }
}
```

**Hero Carousel Features:**
- Auto-play with configurable duration (2-30 seconds)
- Touch/swipe navigation for mobile devices
- Keyboard navigation (arrow keys, spacebar)
- Navigation dots and play/pause controls
- Ken Burns effect (subtle zoom animation on images)
- Multiple overlay styles (glassmorphism, gradient, solid, none)
- Customizable content positioning (9 positions)
- Configurable heights (full screen, large, medium, small)
- Up to 10 slides per carousel
- **CTA buttons per slide** with customizable text, links, and target options
- Accessibility-friendly with ARIA labels and reduced motion support

**Important: CTA Button Setup**
- Each slide can have a CTA button
- In the CMS admin, fill in both "CTA Text" (e.g., "Learn More") and "CTA Link" (e.g., "/products/ca-901")
- CTA Link is **required** when CTA Text is provided (validation enforced)
- Use "CTA Open In New Tab" for external links
- Leave CTA Text empty to hide the button for that slide

**Video Background Features:**
- **Dual video sources**: YouTube embeds OR direct MP4 files
- YouTube URL parsing (supports youtube.com/watch, youtu.be, embed URLs)
- Full-screen video background with auto-play, loop, and mute
- Refined glassmorphism sidebar with elegant blur and transparency
- Sidebar positioning (left or right)
- Customizable overlay opacity for video brightness control
- Includes: heading (large serif), subheading (uppercase label), description
- **Dual CTA buttons**: Primary (filled red) + optional Secondary (outline white)
- Japanese-inspired minimalist aesthetic with purposeful animations
- Staggered reveal animations for refined presentation
- Responsive design with mobile optimizations
- **Toggleable scroll indicator** for UX guidance (can be hidden)
- Uses Kawai brand colors (red, gold) with sophisticated accents

### Marketing Blocks (`src/blocks/marketing/`)

Conversion-focused promotional blocks designed to drive user actions.

| Block | Slug | Purpose | Best For |
|-------|------|---------|----------|
| 🎯 Hero | `marketing-hero` | Large hero sections with headlines and CTAs | Page headers, landing page banners |
| ✨ Grand Hero | `marketing-grand-hero` | Cinematic full-viewport hero with media backgrounds | Premium landing pages, product launches, impactful brand moments |
| 📣 Call to Action | `marketing-cta` | Prominent CTA buttons/sections | Lead generation, conversions |
| ⭐ Testimonials | `marketing-testimonials` | Customer testimonials and reviews | Building trust, social proof |
| 🎹 Instrumental To Life | `marketing-i2l` | Premium YouTube video carousel with Kawai branding | Brand storytelling, product showcases, artist features |
| 🎬 Technical Showcase | `marketing-technical-showcase` | Alternating video demonstrations and product comparisons | Product launches, technology showcases, detailed feature comparisons |
| 📍 Find a Dealer | `marketing-find-a-dealer` | Simple, elegant dealer locator CTA | Directing users to find authorized dealers, store locator pages |
| 🎹 3D Model Viewer | `marketing-3d-viewer` | Interactive 3D piano model viewer with floating button | Product pages, piano showcase pages, immersive product experiences |

**Grand Hero Features:**
- **Full-viewport cinematic design** with configurable heights (100vh, 90vh, 80vh, 70vh)
- **Dual media support**: Background images OR videos (MP4/YouTube)
- **Flexible video sources**: YouTube embeds, direct MP4 URLs (priority), or file upload (fallback)
- **Media upload field** for CMS-managed backgrounds
- **Configurable overlay** with color options (dark, light, Kawai red, none) and opacity control
- **Subtle parallax effect** on background (optional, disabled by default)
- **Glassmorphism content card** with frosted glass effect and grain texture
- **Content positioning**: Left, center, or right alignment
- **Vertical alignment**: Top, center, or bottom positioning
- **Typography hierarchy**: Eyebrow label, large serif headline (Playfair Display), subheading, description
- **Dual CTA buttons**: Primary (filled Kawai Red) + Secondary (outline style)
- **Staggered entrance animations**: Fade + slide up, fade, or scale effects with configurable duration
- **Animated scroll indicator** with chevron icon
- **Optional floating particles** for premium atmosphere (use sparingly)
- **Auto text color detection** based on overlay darkness
- **Japanese-inspired minimalist aesthetic** with refined elegance
- **Mobile-responsive** with optimized typography scaling
- **Accessibility**: Proper ARIA labels, keyboard navigation support
- **Performance optimized**: Next.js Image for images, native HTML5 video with autoplay/loop/mute

**Grand Hero Design Philosophy:**
The Grand Hero block embodies "Refined Monumentality" – a marriage of Japanese wabi-sabi minimalism and European luxury. It uses generous negative space, subtle material textures (grain overlays, glassmorphism), and purposeful restraint to create an elegant, memorable first impression. Think Muji meets Steinway Hall.

**Grand Hero Best Practices:**
- Use high-quality background images (1920x1080 or higher)
- **For videos**: Supports YouTube URLs (auto-detected), direct MP4 URLs, or file upload
- YouTube videos are automatically optimized (autoplay, mute, loop, no controls)
- For direct MP4 files: Keep under 10MB, use H.264 codec
- Enable glassmorphism for better text readability over busy backgrounds
- Use parallax sparingly – it works best with static landscape photos
- Choose overlay opacity based on background brightness (lighter backgrounds = darker overlay)
- Keep headline text concise (5-10 words maximum for impact)
- Use particles effect only for premium/luxury contexts
- Test on mobile to ensure text remains readable

**Instrumental To Life Features:**
- YouTube video carousel with up to 6 videos
- **Customizable section label** (the "INSTRUMENTAL TO LIFE" heading above videos)
- Custom Kawai logo upload or default logo
- Three layout modes: carousel, 2-column grid, 3-column grid
- Auto-scroll functionality with configurable duration
- Category badges (Performance, Craftsmanship, Artist Story, etc.)
- Video duration display on thumbnails
- **Per-video CTA buttons** with customizable text, URL, style, and new tab option
- Touch/swipe navigation for mobile
- Keyboard navigation (arrow keys)
- Light/dark theme options
- Japanese-inspired minimalist aesthetic

**CTA Configuration:**
Each video can have its own call-to-action button with:
- Custom button text (e.g., "Learn More", "Explore This Piano")
- Internal or external link URL
- Two style variants: Primary (red background) or Secondary (outline)
- Option to open in new tab (recommended for external links)
- Leave CTA text empty to hide the button for specific videos

**Technical Showcase Features:**
- Alternating video demonstrations and product comparison sections
- Video sections: YouTube embeds with custom thumbnails, duration badges, and CTAs
- Product comparison sections: Side-by-side comparison tables (2-4 products)
- Up to 12 feature rows per comparison with highlight categories
- Feature value icons (checkmark, X, dash) for quick visual scanning
- Glassmorphism cards with refined Japanese aesthetics
- Alternating left/right layouts for visual rhythm
- Light/dark theme options
- Staggered scroll-triggered animations
- Mobile-responsive with horizontal scroll for tables
- Row hover highlighting across all products
- Individual product badges (Popular, Best Value, Premium)
- Optional product pricing and links
- Compact spacing mode for tighter layouts

**Find a Dealer Features:**
- Simple, focused CTA block for dealer locator
- Customizable heading and supporting message
- Prominent CTA button with configurable text and link
- Map pin icon for visual identification
- Four theme variants: Light, Dark, Red Accent, Gold Accent
- Three alignment options: Left, Center, Right
- Optional background image with overlay
- Clean, minimalist design that doesn't distract from the CTA
- Mobile-optimized responsive layout
- Perfect for footer sections or dedicated dealer pages

**3D Model Viewer Features:**
- **Interactive 3D piano models** with server-side proxy for seamless embedding
- **Floating action button** with customizable position (bottom-left, bottom-right, bottom-center)
- **Customizable button text** and color themes (Blue, Kawai Red, Black, Gold)
- **Auto-open capability** via URL parameter (?mode=3d) for direct linking
- **Optional context section** to provide instructions or description
- **Multiple display modes**: Above button, below button, or separate section
- **Mobile control** with option to hide on mobile devices
- **Scroll indicator** option for top-of-page placement
- **GTM tracking integration** for analytics on viewer opens/closes
- **Keyboard shortcuts** (V to toggle, Escape to close)
- **Full-screen modal experience** with smooth Framer Motion animations
- **Error handling** with graceful fallback UI
- **Body scroll lock** during modal viewing
- **Accessibility-friendly** with ARIA labels and screen reader support
- **Performance optimized** with aggressive caching (15min HTML, 1yr assets)
- **Easy model selection** via model ID (ca901, gl-10, gx-7, sk-ex, etc.)

**3D Viewer Configuration:**
- Model ID: Required field specifying which piano model to display
- Product Name: Optional display name for analytics tracking
- Button Text: Customizable call-to-action text (default: "View in 3D")
- Button Position: Choose from bottom-left, bottom-right, or bottom-center
- Theme: Four color options (Blue, Kawai Red, Black, Gold)
- Auto-Open: Enable ?mode=3d URL parameter functionality
- Context Section: Optional text section with heading and description
- Hide on Mobile: Option to disable on mobile devices
- Scroll Indicator: Optional animated chevron for page guidance

**3D Viewer Best Practices:**
- Use clear, action-oriented button text (e.g., "Explore the CA901 in 3D")
- Enable auto-open for marketing campaigns with direct links
- Add context section for first-time users who may not understand the feature
- Choose button position that doesn't obscure important content
- Test on mobile devices to ensure good performance
- Use product name field for better analytics tracking

**Where to use:**
- Landing pages
- Post header/footer areas (promotional content)
- Storefronts and dealer pages
- Any conversion-focused page
- Brand story pages
- Artist showcase pages
- Product demonstration pages
- Product launch pages with video + specs
- Technology showcase pages (e.g., Grand Feel III Action)
- Piano series comparison pages
- **Product detail pages** (for 3D viewer block)
- **Piano showcase pages** (for 3D viewer block)
- **Model-specific landing pages** (for 3D viewer block)

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
