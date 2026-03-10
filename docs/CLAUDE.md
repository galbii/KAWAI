# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Kawai Piano website** built with Next.js 15, Payload CMS v3, and Tailwind CSS. The site showcases Kawai's piano collection, heritage, and innovation with a sophisticated Japanese-inspired design system.

## Development Commands

**This project uses Bun as the primary package manager and runtime. NEVER use npm or yarn commands.**

**IMPORTANT: Do not start development servers (`bun run dev`) or run builds (`bun run build`) unless explicitly asked by the user.**

```bash
# Install dependencies
bun install

# Development server with Turbopack (only when user requests)
bun run dev

# Production build (only when user requests)
bun run build

# Start production server (only when user requests)
bun run start

# Linting (safe to run for code quality)
bun run lint

# Add new dependencies
bun add <package>            # Production dependency
bun add -d <package>         # Development dependency

# Remove dependencies
bun remove <package>

# Update dependencies
bun update

# Check for outdated packages
bun outdated

# Reproducible installs (CI/CD)
bun ci
```

## Architecture

### Framework Stack
- **Next.js 15** with App Router (`src/app/`)
- **Payload CMS v3** for content management
- **MongoDB** as the database (via Mongoose adapter)
- **Tailwind CSS v4** for styling
- **TypeScript 5** for comprehensive type safety
- **Bun** as package manager and runtime (not npm)

### Project Structure

**Next.js App Router Routing:**
- Each page is located at `src/app/[route]/page.tsx`
- Pages follow App Router directory structure:
  - `/` → `src/app/page.tsx`
  - `/pianos` → `src/app/pianos/page.tsx` 
  - `/pianos/digital` → `src/app/pianos/digital/page.tsx`
  - `/product/[model]` → `src/app/product/[model]/page.tsx` (specific piano models)

```
src/
├── app/                    # Next.js App Router pages
│   ├── (payload)/         # Payload admin routes (grouped route)
│   │   └── admin/[[...segments]]/page.tsx  # Payload CMS admin
│   ├── pianos/            # Piano catalog pages
│   │   ├── digital/page.tsx # Digital piano category
│   │   ├── grand/page.tsx # Grand piano category
│   │   ├── hybrid/page.tsx # Hybrid piano category
│   │   ├── upright/page.tsx # Upright piano category
│   │   ├── shigeru-kawai/ # Premium series
│   │   │   └── page.tsx   # Series overview
│   │   ├── compare/page.tsx # Piano comparison tool
│   │   ├── search/page.tsx  # Piano search
│   │   └── page.tsx       # Main piano catalog
│   ├── product/           # Individual piano model pages
│   │   └── [model]/page.tsx # Dynamic route for specific models (e.g., /product/ca901, /product/sk-ex)
│   ├── about/page.tsx     # About page
│   ├── showroom/page.tsx  # Showroom info
│   └── layout.tsx         # Root layout with fonts and metadata
├── collections/           # Payload CMS collections
├── components/            # React components
│   ├── forms/            # Form components
│   ├── layout/           # Header, footer, navigation
│   ├── piano/            # Piano-specific components
│   └── ui/               # Reusable UI components
├── globals/              # Payload global configurations
├── lib/                  # Utilities and configurations
└── translations/         # i18n JSON files
```

### CMS Architecture

Payload CMS manages the following content types:

**Core Collections:**
- `Pianos` - Main piano catalog with specifications, pricing, media
- `PianoCategories` - Piano categories (Grand, Upright, Digital, etc.)
- `PianoSeries` - Piano series (Shigeru Kawai, GX, CA, etc.)
- `Technologies` - Kawai innovations (Millennium III, Grand Feel III)
- `Artists` - Endorsed artists and testimonials
- `Awards` - Industry awards and recognitions

**Content Collections:**
- `Pages` - Static pages and landing pages
- `Posts` - Blog posts and news
- `Media` - Images, videos, audio samples, brochures

**Configuration:**
- Admin accessible at `/admin`
- API routes at `/api`
- Database connection via `DATABASE_URI` environment variable
- Media uploads handled by Sharp
- **TypeScript Types**: Payload generates types automatically to `types/payload-types.ts`

### TypeScript Architecture

**⚠️ CRITICAL: This project uses TypeScript STRICT MODE**

The project is configured with `"strict": true` in `tsconfig.json`, which enforces:
- **All function parameters MUST have explicit types** - No implicit `any`
- **Strict null checks** - Must handle `null` and `undefined` explicitly
- **No implicit `this`** - All `this` usage must be typed
- **Strict property initialization** - Class properties must be initialized

**Common Strict Mode Requirements:**

```typescript
// ❌ WRONG - Will cause build errors in strict mode
const validate = (value) => {  // Error: Parameter 'value' implicitly has an 'any' type
  return value.length > 0
}

// ✅ CORRECT - Explicit type annotation required
const validate = (value: string | null | undefined) => {
  if (!value) return false
  return value.length > 0
}

// ❌ WRONG - Implicit any in callback
items.map(item => item.name)  // If 'item' type can't be inferred

// ✅ CORRECT - Explicit type in callback
items.map((item: Product) => item.name)

// ❌ WRONG - Nullable property access without check
const name = user.profile.name  // Error if profile can be null

// ✅ CORRECT - Optional chaining or null check
const name = user.profile?.name ?? 'Unknown'
```

**Type Organization:**
- **Custom Types**: Centralized in `src/lib/types.ts` with comprehensive interfaces
- **Payload Types**: Auto-generated to `types/payload-types.ts` (configured in `payload.config.ts`)
- **Component Types**: Inline types for component props using Next.js and React types
- **API Types**: Server action and route handler types using Next.js Request/Response types

**Key Type Definitions:**
- `Piano`, `Series`, `Category`, `Media` - Core content types
- `FilterCriteria`, `SearchFilters` - Search and filtering interfaces
- `StructuredData` - SEO and schema markup types
- Global window extensions for analytics (GTM, Facebook Pixel)

**Payload CMS Validation Functions:**
When writing validation functions for Payload fields, always type parameters explicitly:

```typescript
// ✅ CORRECT - Properly typed validation function
{
  name: 'fieldName',
  type: 'text',
  validate: (value: string | null | undefined, { data }: { data: any }) => {
    if (!value) return true // Optional field
    if (value.length < 3) return 'Must be at least 3 characters'
    return true
  }
}

// ❌ WRONG - Will fail in strict mode
validate: (value) => value.length > 3  // Error: implicit any
```

### Design System

The site uses a **Japanese-inspired design system** with Kawai brand colors:

**Brand Colors:**
- Kawai Red: `#e21d30` (primary accent)
- Kawai Black: `#1a1a1a` (primary text)
- Kawai Pearl: `#fafafa` (background)
- Kawai Gold: Custom accent for premium elements

**Typography:**
- **Inter** - Primary font for body text and UI
- **Crimson Text** - Elegant serif for headings and brand elements

**CSS Architecture (Tailwind v4 Simplified):**
- **@theme in globals.css**: Design tokens auto-generate utilities (`--color-kawai-red` → `bg-kawai-red`, `text-kawai-red`)
- **Minimal Custom CSS**: Only 3-4 complex components use `@utility` directive
- **Generated Utilities First**: Use `bg-kawai-red hover:bg-kawai-red-600` instead of custom classes
- **@apply for Simple Components**: Cards, layouts use `@apply` with generated utilities

### Key Features

**Piano Catalog:**
- Dynamic piano listing with filtering and search
- Comparison tool for multiple piano models
- Detailed specifications and media galleries
- Price calculations and availability by region
- SEO-optimized pages for each piano model

**Content Management:**
- Rich media support (images, audio samples, videos)
- Multilingual content (English/Japanese)
- Award and endorsement tracking
- Technology showcase integration

## Environment Setup

Required environment variables:
```bash
PAYLOAD_SECRET=your_payload_secret
DATABASE_URI=mongodb://localhost:27017/kawai-piano
```

## File Naming Conventions

- Use **kebab-case** for file names (`piano-finder.tsx`)
- Use **PascalCase** for component names (`PianoFinder`)
- Use **camelCase** for utility functions and variables
- Collection files use **PascalCase** (`Pianos.ts`)

## Development Guidelines

### Bun Best Practices - CRITICAL
- **NEVER use npm or yarn commands** - this project exclusively uses Bun
- **Use `bun run` prefix** for all script execution instead of npm/yarn
- **Use `bun add`** instead of `npm install` for adding packages
- **Use `bun install`** instead of `npm install` for installing dependencies
- **Prefer `bun ci`** in CI/CD environments for reproducible builds
- **Use `bun add -d`** for development dependencies (shorter than `--dev`)
- **Trust packages when needed** with `bun pm trust <package>` for lifecycle scripts
- **Check package versions** with `bun pm version` for version management
- **Use absolute paths** in file operations when working with Bun APIs
- **Leverage Bun's speed** - installs are significantly faster than npm/yarn
- **IMPORTANT: Only run `bun run dev` or `bun run build` when explicitly requested by the user**

### TypeScript Best Practices - CRITICAL

**⚠️ STRICT MODE REQUIREMENTS:**
- **ALL function parameters MUST be explicitly typed** - Build will fail with implicit `any` errors
- **Always type validation functions** - Especially for Payload CMS field validators
- **Type callback functions** - Map, filter, reduce callbacks need explicit types when inference fails
- **Handle nullable values** - Use optional chaining (`?.`) and nullish coalescing (`??`)
- **Never use `any`** - Use `unknown` if type is truly unknown, then narrow with type guards

**Type Safety Standards:**
- **Maintain Strict Type Safety**: Always use proper TypeScript types, never use `any`
- **Use Project Type Definitions**: Import types from `src/lib/types.ts` for consistency
- **Path Aliases**: Use `@/` for absolute imports (configured in `tsconfig.json`)
- **Component Props**: Always type component props using interfaces or type aliases
- **Payload Types**: Import generated Payload types from `types/payload-types.ts` when available
- **Next.js Types**: Use official Next.js types for pages, API routes, and configuration
- **Type-Only Imports**: Use `import type` for type-only imports to optimize bundles
- **Strict Configuration**: Never modify `tsconfig.json` strict settings or disable type checking
- **Performance**: Leverage `skipLibCheck: true` for faster compilation (already configured)

**Before Writing Any Code:**
1. ✅ Check if function parameters are explicitly typed
2. ✅ Verify callback functions have type annotations
3. ✅ Handle potential `null`/`undefined` values
4. ✅ Use type guards for runtime type narrowing
5. ✅ Run `bun run lint` to catch TypeScript errors early

### Component Organization
- Place piano-specific components in `src/components/piano/`
- Use the established UI component library in `src/components/ui/`
- Layout components go in `src/components/layout/`

### Utility Functions
- Piano-specific utilities are in `src/lib/utils.ts`
- Functions include price formatting, piano model formatting, search/filter logic
- Use existing utilities before creating new ones

### TypeScript Development Workflow
- **Type Checking**: Use `bun run lint` to check for TypeScript errors
- **Auto-completion**: Leverage IDE TypeScript integration for better DX
- **Type Generation**: Payload CMS types are auto-generated on build
- **Import Organization**: Use `@/` path aliases for clean imports
- **Type Safety**: All API endpoints, components, and utilities should be fully typed

### Content Management
- All content should be manageable via Payload admin
- Use relationships between collections (piano → series → category)
- Media assets should be uploaded through the CMS
- **Type Safety**: Use generated Payload types for all CMS data operations

### SEO and Performance
- All pages include comprehensive metadata using Next.js typed metadata API
- Images are optimized using Sharp
- Use Next.js Image component for all media with proper TypeScript props
- Implement proper semantic HTML structure with TypeScript JSX types

## Common Tasks

### Package Management with Bun (NOT npm/yarn)
```bash
# ALWAYS use Bun commands - NEVER npm or yarn
bun add react-query              # Production dependency (NOT npm install)
bun add -d @types/node          # Development dependency (NOT npm install --save-dev)
bun add react@18.2.0            # Specific version
bun add git+ssh://git@github.com/owner/repo.git  # Git dependency

# Clean installs for CI/CD
bun ci                          # Equivalent to npm ci

# Check and update packages
bun outdated                    # Check for updates
bun update                      # Update all packages
bun update react               # Update specific package

# Package management utilities
bun pm trust <package>         # Trust package for lifecycle scripts
bun pm version patch          # Bump version and create git tag

# INCORRECT COMMANDS - DO NOT USE:
# npm install                   # ❌ Use "bun install" instead
# npm run dev                   # ❌ Use "bun run dev" instead
# yarn add                      # ❌ Use "bun add" instead
```

### TypeScript Development Tasks
```bash
# Type checking and linting
bun run lint                    # Runs ESLint with TypeScript rules

# Adding typed dependencies
bun add @types/package-name -d  # Add TypeScript type definitions
bun add zod                     # Add runtime type validation library

# Generating Payload types
# Types are auto-generated during build process to types/payload-types.ts
# Manual generation (if needed): bun run payload generate:types
```

### Adding New Piano Models
1. Use Payload admin to create new piano entry
2. Associate with appropriate series and category using typed relationships
3. Upload media assets (images, brochures, audio)
4. Define specifications and features with proper TypeScript interfaces
5. Set pricing and availability using typed fields
6. **Type Safety**: Use `Piano` interface from `src/lib/types.ts` for consistency

### Modifying Design System
- Update brand colors in `src/app/globals.css`
- Brand elements use Kawai Red (`#E11922`) as primary accent
- Typography combines Inter (body) + Crimson Text (headings)
- Use existing Kawai utility classes (`kawai-red`, `kawai-heading`, etc.)

### Adding New Collections
1. Create collection file in `src/collections/` with proper TypeScript interfaces
2. Import and register in `payload.config.ts` 
3. Generate TypeScript types with Payload (automatic on build)
4. **Type Safety**: Define custom interfaces in `src/lib/types.ts` for additional type safety
5. Use generated Payload types for database operations

### Creating New Components
```tsx
// Example: Properly typed React component
import type { Piano } from '@/lib/types'
import type { FC } from 'react'

interface PianoCardProps {
  piano: Piano
  className?: string
  onClick?: (pianoId: string) => void
}

const PianoCard: FC<PianoCardProps> = ({ piano, className, onClick }) => {
  // Component implementation
}

export default PianoCard
```

### API Route Development
```ts
// Example: Typed Next.js API route
import type { NextRequest } from 'next/server'
import type { Piano } from '@/lib/types'

export async function GET(request: NextRequest) {
  // Properly typed API logic
  const pianos: Piano[] = await fetchPianos()
  return Response.json(pianos)
}
```

## Tailwind v4 Component Usage

### Use Generated Utilities (Preferred)
```tsx
// Good: Use auto-generated utilities from @theme
<button className="bg-kawai-red hover:bg-kawai-red-600 text-white px-6 py-3 rounded-md">
  Explore Pianos
</button>

<div className="bg-kawai-pearl border border-kawai-neutral/30 p-8 rounded-lg">
  <h2 className="text-kawai-black font-bold text-2xl mb-4">Piano Collection</h2>
  <p className="text-kawai-black/80">Discover our instruments...</p>
</div>
```

### Use Custom Components (When Complex)
```tsx
// For complex multi-property components
<button className="btn-brand-primary">
  Complex Button with Gradient & Animation
</button>

<nav className="nav-brand-trigger">
  Navigation with Underline Animation
</nav>
```

### Available Auto-Generated Utilities
From `@theme` configuration, you automatically get:
- **Colors**: `bg-kawai-red`, `text-kawai-black`, `border-kawai-pearl`
- **Spacing**: `p-brand-lg`, `m-brand-xl`, `gap-brand-md`
- **Typography**: `font-brand-serif`, `font-brand-sans`
- **Shadows**: `shadow-brand-medium`, `shadow-brand-premium`

## Block Development & Analytics Tracking

### Overview

KAWAI uses a **reusable field factory pattern** for adding analytics tracking to Payload CMS blocks. This system allows marketers to configure tracking per block instance while developers maintain type-safe, consistent implementations.

**Key Components:**
- `src/lib/payload/fields/tracking.ts` - Reusable tracking field factories
- `src/lib/analytics/unified-tracking.ts` - Centralized tracking utility
- Block renderers use `trackWithConfig()` to respect CMS settings

### Tracking Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Payload CMS Admin                                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Marketing Block Instance                          │  │
│  │  - Heading, CTA Text, etc.                        │  │
│  │  - 📊 Analytics & Tracking                        │  │
│  │    ✅ Enable tracking                             │  │
│  │    Category: Lead Generation                      │  │
│  │    Conversion Value: $25                          │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  Frontend Renderer                                      │
│  import { trackCTAClick } from '@/lib/analytics'        │
│                                                         │
│  trackCTAClick({                                        │
│    blockType: 'marketing-find-a-dealer',                │
│    blockData: { tracking },  ← Reads CMS config        │
│    ctaText: 'Find a Dealer',                            │
│    destination: '/find-a-dealer',                       │
│  })                                                     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  Unified Tracking Utility                               │
│  - Checks if tracking.enabled === true                  │
│  - Auto-includes UTM attribution from session           │
│  - Fires to PostHog, GA4, Meta Pixel                    │
│  - Respects category & conversion value from CMS        │
└─────────────────────────────────────────────────────────┘
```

### Adding Tracking to a New Block

**Step 1: Import tracking field factory**

```typescript
// src/blocks/marketing/MyNewBlock.ts
import type { Block } from 'payload'
import { trackingField } from '@/lib/payload/fields/tracking'

export const MyNewBlock: Block = {
  slug: 'marketing-my-new-block',
  interfaceName: 'MarketingMyNewBlockBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'ctaText',
      type: 'text',
      required: true,
    },
    {
      name: 'ctaLink',
      type: 'text',
      required: true,
    },

    // ✅ ADD TRACKING FIELD
    trackingField({
      defaultEnabled: true,
      showAdvanced: false,
      overrides: {
        fields: [
          {
            name: 'category',
            type: 'select',
            defaultValue: 'conversion',
            options: [
              { label: 'Engagement', value: 'engagement' },
              { label: 'Conversion', value: 'conversion' },
              { label: 'Lead Generation', value: 'lead' },
            ],
          },
          {
            name: 'conversionValue',
            type: 'number',
            defaultValue: 50,
            admin: {
              description: 'Estimated lead value in USD',
            },
          },
        ],
      },
    }),
  ],
}
```

**Step 2: Update block renderer**

```tsx
// src/components/blocks/marketing/MyNewBlockRenderer.tsx
import type { MarketingMyNewBlockBlock } from '@/payload-types'
import { trackCTAClick } from '@/lib/analytics/unified-tracking'

export function MyNewBlockRenderer({
  heading,
  ctaText,
  ctaLink,
  tracking, // ← Tracking config from CMS
}: MarketingMyNewBlockBlock) {

  const handleCTAClick = () => {
    trackCTAClick({
      blockType: 'marketing-my-new-block',
      blockData: { tracking },
      ctaText: ctaText || '',
      destination: ctaLink || '',
      additionalProps: {
        heading,
      },
    })
  }

  return (
    <section>
      <h2>{heading}</h2>
      <Link href={ctaLink} onClick={handleCTAClick}>
        {ctaText}
      </Link>
    </section>
  )
}
```

### Available Tracking Field Factories

#### `trackingField(options)`
General-purpose tracking for any block.

```typescript
trackingField({
  name: 'tracking',              // Field name (default: 'tracking')
  defaultEnabled: true,          // Enable by default
  showAdvanced: false,           // Show JSON custom properties field
  overrides: {                   // Deep merge custom fields
    fields: [
      // Custom fields specific to this block
    ]
  }
})
```

**Generated Fields:**
- `enabled` (checkbox) - Enable/disable tracking
- `eventName` (text) - Custom event name override
- `category` (select) - Event category (engagement/conversion/lead/navigation/media)
- `conversionValue` (number) - Dollar value for ROI tracking
- `customProperties` (json) - Advanced custom properties (if `showAdvanced: true`)

#### `ctaTrackingField()`
Specialized tracking for call-to-action buttons with Meta Pixel integration.

```typescript
ctaTrackingField()
```

**Additional Fields:**
- `trackAsConversion` (checkbox) - Send conversion event to Meta/GA
- `metaEventType` (select) - Map to Meta Pixel standard events (Lead, Schedule, FindLocation, ViewContent)

**Use in array fields:**
```typescript
{
  name: 'buttons',
  type: 'array',
  fields: [
    { name: 'text', type: 'text' },
    { name: 'link', type: 'text' },
    ctaTrackingField(), // ← Track each button individually
  ]
}
```

#### `videoTrackingField()`
Track video engagement metrics.

```typescript
videoTrackingField()
```

**Additional Fields:**
- `trackPlayPause` (checkbox) - Track play/pause events
- `trackProgress` (checkbox) - Track 25%, 50%, 75%, 100% milestones

#### `trackImpressionField(options)`
Track block visibility/impressions.

```typescript
trackImpressionField({
  trackViewport: true,
  viewportThreshold: 0.5,
})
```

**Additional Fields:**
- `trackViewport` (checkbox) - Only track when visible
- `viewportThreshold` (number) - Percentage visible required (0-1)

### Unified Tracking Functions

All tracking functions respect CMS configuration and auto-include UTM attribution.

#### `trackWithConfig(context, options?)`
Core tracking function. Use for custom tracking scenarios.

```typescript
import { trackWithConfig } from '@/lib/analytics/unified-tracking'

trackWithConfig({
  blockType: 'marketing-hero',
  blockData: { tracking },
  action: 'impression',
  label: 'Homepage Hero',
  position: 0,
  additionalProps: {
    theme: 'dark',
    has_video: true,
  },
})
```

**Actions:**
- `cta_click` - CTA/button clicks
- `impression` - Block visibility
- `video_play`, `video_pause`, `video_progress`, `video_complete` - Video events
- `form_start`, `form_submit` - Form interactions
- `engagement` - General interactions
- `navigation` - Navigation clicks

#### `trackCTAClick(params)`
Convenience function for CTA tracking.

```typescript
trackCTAClick({
  blockType: 'marketing-find-a-dealer',
  blockData: { tracking },
  ctaText: 'Find a Dealer',
  destination: '/find-a-dealer',
  position: 0,
  additionalProps: { theme: 'red' },
})
```

#### `trackBlockImpression(params)`
Track block impressions (visibility).

```typescript
trackBlockImpression({
  blockType: 'marketing-hero',
  blockData: { impressionTracking },
  position: 0,
})
```

#### `trackVideoInteraction(params)`
Track video engagement.

```typescript
trackVideoInteraction({
  blockType: 'marketing-i2l',
  blockData: { videoTracking },
  action: 'video_play',
  videoId: 'dQw4w9WgXcQ',
  videoTitle: 'Artist Performance',
  progress: 0.5, // For video_progress events
})
```

#### `trackFormInteraction(params)`
Track form interactions.

```typescript
trackFormInteraction({
  blockType: 'marketing-contact-form',
  blockData: { tracking },
  action: 'form_submit',
  formName: 'Contact Us',
})
```

### Event Data Structure

All tracking events include:

**Core Properties:**
- `block_type` - Block slug
- `action` - Event action type
- `label` - Human-readable label
- `category` - Event category from CMS
- `value` - Conversion value from CMS
- `position` - Block position on page

**Page Context:**
- `page_path` - Current pathname
- `page_url` - Full URL
- `referrer` - Referrer URL or 'direct'
- `timestamp` - ISO timestamp

**UTM Attribution** (auto-included from session):
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

**Custom Properties:**
- CMS `customProperties` (if configured)
- Runtime `additionalProps` (from renderer)

---

**📚 For complete tracking system documentation, see [docs/TRACKING.md](./TRACKING.md)**

This section provides a quick reference. For comprehensive guides on:
- Architecture deep-dive
- Field factory internals (`deepMerge` algorithm)
- Advanced customization patterns
- Complete troubleshooting guide
- Maintenance and testing procedures

**→ See the full [Tracking System Documentation](./TRACKING.md)**

---

### Analytics Platform Integration

Events are automatically sent to all configured platforms:

#### PostHog
```typescript
// unified-tracking.ts uses the imported module singleton — NOT window.posthog
// window.posthog is always undefined with ES module imports (posthog-js v3+)
import posthog from 'posthog-js'

if (posthog.__loaded) {
  posthog.capture(eventName, eventData)
}
```

#### Google Analytics 4
Maps to GA4 recommended events:
- `cta_click` → `select_promotion` or `find_location` or `generate_lead`
- `form_submit` → `generate_lead`
- `video_play` → `video_start`
- `impression` → `view_promotion`

```typescript
window.gtag('event', ga4EventName, {
  event_category: category,
  event_label: label,
  value,
  ...eventData,
})
```

#### Meta Pixel
Maps to Meta standard events:
- `cta_click` → `Lead`, `FindLocation`, or custom
- `form_submit` → `Lead`
- `video_play` → `VideoView`

```typescript
window.fbq('trackCustom', metaEventName, eventData)
```

### Tracking Best Practices

**DO:**
- ✅ Use `trackingField()` for all marketing blocks
- ✅ Always pass `blockData: { tracking }` from renderer
- ✅ Set appropriate default `conversionValue` per block type
- ✅ Use `ctaTrackingField()` for buttons in arrays
- ✅ Test tracking in development (events logged to console)
- ✅ Use descriptive labels (button text, form name, etc.)

**DON'T:**
- ❌ Hardcode tracking without CMS configuration
- ❌ Skip UTM attribution (automatic via unified tracking)
- ❌ Use generic event names (be specific)
- ❌ Track personal/sensitive data in custom properties
- ❌ Call tracking functions directly on SSR (check `typeof window`)

### Debugging Tracking

**Development Mode:**
All tracking events are logged to console:

```
📊 [Unified Tracking] Event: find-a-dealer_cta_click
{
  block_type: 'marketing-find-a-dealer',
  action: 'cta_click',
  label: 'Find a Dealer',
  category: 'lead',
  value: 25,
  utm_source: 'facebook',
  utm_campaign: 'spring-sale',
  ...
}
✅ [PostHog] Tracked: find-a-dealer_cta_click
✅ [GA4] Tracked: find_location
✅ [Meta Pixel] Tracked: FindLocation
```

**Testing Checklist:**
1. Open browser DevTools console
2. Interact with block (click CTA, play video, etc.)
3. Verify tracking logs appear
4. Check PostHog debugger (click icon in bottom-right)
5. Check GA4 DebugView (if `debug_mode=true` in URL)
6. Check Meta Pixel Helper Chrome extension

### Migration Guide

To add tracking to existing blocks:

1. **Update block definition** - Add `trackingField()`
2. **Update renderer** - Import tracking function, add onClick handler
3. **Rebuild types** - Run `bun run build` to regenerate Payload types
4. **Test in CMS** - Create test block, configure tracking, verify events
5. **Update documentation** - Note which blocks have tracking in BLOCKS.md

**Example Migration:**

```diff
// Block definition
import type { Block } from 'payload'
+ import { trackingField } from '@/lib/payload/fields/tracking'

export const ExistingBlock: Block = {
  slug: 'marketing-existing',
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'ctaLink', type: 'text' },
+   trackingField({ defaultEnabled: true }),
  ]
}

// Renderer
+ import { trackCTAClick } from '@/lib/analytics/unified-tracking'

- export function ExistingBlockRenderer({ heading, ctaLink }: Props) {
+ export function ExistingBlockRenderer({ heading, ctaLink, tracking }: Props) {
+   const handleClick = () => {
+     trackCTAClick({
+       blockType: 'marketing-existing',
+       blockData: { tracking },
+       ctaText: heading,
+       destination: ctaLink,
+     })
+   }

    return (
-     <Link href={ctaLink}>{heading}</Link>
+     <Link href={ctaLink} onClick={handleClick}>{heading}</Link>
    )
  }
```

This website emphasizes **Japanese craftsmanship**, **musical heritage**, and **innovative technology** in its content and design approach.