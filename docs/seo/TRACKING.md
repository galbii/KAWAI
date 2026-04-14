# Analytics Tracking System

**Complete guide to KAWAI's CMS-driven, multi-platform analytics tracking system.**

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Quick Start](#quick-start)
4. [Development Guide](#development-guide)
5. [Field Factories Reference](#field-factories-reference)
6. [Tracking Functions Reference](#tracking-functions-reference)
7. [Type System](#type-system)
8. [Event Mapping](#event-mapping)
9. [Troubleshooting](#troubleshooting)
10. [Maintenance](#maintenance)

---

## Overview

### What is it?

A **4-layer tracking system** that allows content editors to configure analytics tracking per block instance without code changes. Events are automatically sent to PostHog, Google Analytics 4, and Meta Pixel with UTM attribution.

### Key Features

- ✅ **CMS-Driven** - Editors enable/disable tracking per block
- ✅ **Multi-Platform** - PostHog + GA4 + Meta Pixel from single API
- ✅ **Type-Safe** - Full TypeScript support with Payload generated types
- ✅ **Attribution** - Auto-includes UTM parameters from session
- ✅ **Event Mapping** - Intelligent mapping to platform-specific events
- ✅ **Reusable** - Field factories for consistent implementation
- ✅ **Flexible** - Per-block customization via overrides

### When to Use

**DO use tracking for:**
- CTA buttons and promotional banners
- Form submissions and lead generation
- Video engagement and media interactions
- Block impressions and visibility tracking
- Navigation and user journey events

**DON'T track:**
- User authentication or personal data
- Backend operations or system events
- Admin UI interactions
- Server-side processes

---

## Architecture

### The 4 Layers

```
┌─────────────────────────────────────────────────┐
│  1. FIELD LAYER                                 │
│     src/lib/payload/fields/tracking.ts          │
│     → Field factories create CMS UI             │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  2. BLOCK LAYER                                 │
│     src/blocks/marketing/*.ts                   │
│     → Blocks import and configure fields        │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  3. ANALYTICS LIBRARY                           │
│     src/lib/analytics/unified-tracking.ts       │
│     → Reads CMS config, fires events            │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  4. RENDERER LAYER                              │
│     src/components/blocks/marketing/*Renderer   │
│     → Wires tracking to user interactions       │
└─────────────────────────────────────────────────┘
```

### Data Flow

```typescript
// 1. CMS Admin: Editor enables tracking
tracking: {
  enabled: true,
  category: 'lead',
  conversionValue: 25
}

// 2. Block Definition: Field factory generates CMS fields
trackingField({ defaultEnabled: true })

// 3. Renderer: Passes CMS config to tracking function
trackCTAClick({
  blockType: 'marketing-find-a-dealer',
  blockData: { tracking }, // ← CMS config
  ctaText: 'Find a Dealer',
  destination: '/find-a-dealer'
})

// 4. Unified Tracking: Enriches and fires to platforms
→ PostHog: find-a-dealer_cta_click
→ GA4: find_location
→ Meta Pixel: FindLocation
```

---

## Quick Start

### Adding Tracking to a New Block (3 Steps)

#### Step 1: Add Tracking Field to Block Definition

```typescript
// src/blocks/marketing/MyNewBlock.ts
import type { Block } from 'payload'
import { trackingField } from '@/lib/payload/fields/tracking'

export const MyNewBlock: Block = {
  slug: 'marketing-my-new-block',
  interfaceName: 'MarketingMyNewBlockBlock',
  fields: [
    // ... your content fields
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

    // ✅ Add tracking field
    trackingField({
      defaultEnabled: true,
      showAdvanced: false,
      overrides: {
        fields: [
          {
            name: 'category',
            type: 'select',
            defaultValue: 'conversion', // Custom default for this block
            options: [
              { label: 'Engagement', value: 'engagement' },
              { label: 'Conversion', value: 'conversion' },
              { label: 'Lead Generation', value: 'lead' },
            ],
          },
          {
            name: 'conversionValue',
            type: 'number',
            defaultValue: 50, // Estimated value
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

#### Step 2: Regenerate Payload Types

```bash
# Clear cache and rebuild to regenerate types
rm -rf .next && bun run build

# Or start dev server (generates types on startup)
bun run dev
```

#### Step 3: Add Tracking to Renderer

```typescript
// src/components/blocks/marketing/MyNewBlockRenderer.tsx
'use client'

import type { MarketingMyNewBlockBlock } from '@/payload-types'
import { trackCTAClick } from '@/lib/analytics/unified-tracking'
import Link from 'next/link'

export function MyNewBlockRenderer({
  ctaText,
  ctaLink,
  tracking, // ← Tracking config from CMS
}: MarketingMyNewBlockBlock) {

  const handleClick = () => {
    trackCTAClick({
      blockType: 'marketing-my-new-block',
      blockData: { tracking },
      ctaText: ctaText || '',
      destination: ctaLink || '',
      additionalProps: {
        // Add runtime context
        component: 'MyNewBlock',
      },
    })
  }

  return (
    <section>
      <Link href={ctaLink} onClick={handleClick}>
        {ctaText}
      </Link>
    </section>
  )
}
```

**That's it!** Editors can now configure tracking in the CMS admin UI.

---

## Development Guide

### Field Factory Pattern

Field factories create **reusable, configurable tracking field groups** that generate CMS UI and merge with base fields.

#### How `trackingField()` Works

```typescript
// Base field structure
const baseField = {
  name: 'tracking',
  type: 'group',
  fields: [
    { name: 'enabled', type: 'checkbox', defaultValue: true },
    { name: 'eventName', type: 'text' },
    { name: 'category', type: 'select', defaultValue: 'engagement' },
    { name: 'conversionValue', type: 'number' },
  ]
}

// Your overrides
const overrides = {
  fields: [
    { name: 'category', defaultValue: 'lead' }, // Override default
    { name: 'conversionValue', defaultValue: 25 }, // Override default
  ]
}

// Result after deepMerge (by field name)
{
  fields: [
    { name: 'enabled', type: 'checkbox', defaultValue: true }, // ✅ Kept
    { name: 'eventName', type: 'text' }, // ✅ Kept
    { name: 'category', type: 'select', defaultValue: 'lead' }, // ✅ Merged
    { name: 'conversionValue', type: 'number', defaultValue: 25 }, // ✅ Merged
  ]
}
```

#### The `deepMerge` Algorithm

```typescript
// When merging fields arrays:
// 1. Start with all base fields
// 2. For each override field:
//    - If field name exists → merge properties
//    - If field name is new → append to array
// 3. Return merged result

// Example:
baseFields = [
  { name: 'enabled', type: 'checkbox' },
  { name: 'category', defaultValue: 'engagement' }
]

overrideFields = [
  { name: 'category', defaultValue: 'lead' }, // Exists → merge
  { name: 'customProp', type: 'text' } // New → append
]

result = [
  { name: 'enabled', type: 'checkbox' }, // Kept from base
  { name: 'category', defaultValue: 'lead' }, // Merged (override wins)
  { name: 'customProp', type: 'text' } // Appended
]
```

### Customization Patterns

#### Pattern 1: Override Field Defaults

```typescript
trackingField({
  defaultEnabled: true,
  overrides: {
    fields: [
      {
        name: 'category',
        defaultValue: 'lead', // Change default category
      },
      {
        name: 'conversionValue',
        defaultValue: 100, // Change default value
      },
    ],
  },
})
```

#### Pattern 2: Restrict Category Options

```typescript
trackingField({
  overrides: {
    fields: [
      {
        name: 'category',
        type: 'select',
        defaultValue: 'lead',
        options: [
          // Only show relevant categories
          { label: 'Lead Generation', value: 'lead' },
          { label: 'Conversion', value: 'conversion' },
        ],
      },
    ],
  },
})
```

#### Pattern 3: Add Custom Description

```typescript
trackingField({
  overrides: {
    fields: [
      {
        name: 'conversionValue',
        type: 'number',
        defaultValue: 25,
        admin: {
          description: 'Estimated value of dealer locator click (used for ROI)', // Custom help text
        },
      },
    ],
  },
})
```

#### Pattern 4: Enable Advanced Mode

```typescript
trackingField({
  showAdvanced: true, // Shows customProperties JSON field
  overrides: {
    admin: {
      description: 'Advanced tracking with custom properties',
    },
  },
})
```

### Renderer Patterns

#### Pattern 1: Simple CTA Click

```typescript
const handleClick = () => {
  trackCTAClick({
    blockType: 'marketing-find-a-dealer',
    blockData: { tracking },
    ctaText: 'Find a Dealer',
    destination: '/find-a-dealer',
  })
}
```

#### Pattern 2: Multiple Buttons (Array)

```typescript
{buttons.map((button, index) => (
  <Button
    key={index}
    onClick={() => {
      trackCTAClick({
        blockType: 'marketing-cta',
        blockData: { ctaTracking: button.ctaTracking }, // Each button has own config
        ctaText: button.text || '',
        destination: button.link || '',
        position: index, // Track which button
        additionalProps: {
          button_style: button.style,
          button_size: button.size,
        },
      })
    }}
  >
    {button.text}
  </Button>
))}
```

#### Pattern 3: Block Impression on Mount

```typescript
'use client'
import { useEffect } from 'react'
import { trackBlockImpression } from '@/lib/analytics/unified-tracking'

export function HeroRenderer({ tracking, ...props }) {
  useEffect(() => {
    trackBlockImpression({
      blockType: 'marketing-hero',
      blockData: { impressionTracking: tracking },
    })
  }, []) // Run once on mount

  return <div>...</div>
}
```

#### Pattern 4: Form Interaction

```typescript
const handleSubmit = async (data) => {
  // Track form start on first interaction
  trackFormInteraction({
    blockType: 'marketing-contact-form',
    blockData: { tracking },
    action: 'form_start',
  })

  // Submit form...
  await submitForm(data)

  // Track successful submission
  trackFormInteraction({
    blockType: 'marketing-contact-form',
    blockData: { tracking },
    action: 'form_submit',
    additionalProps: {
      form_fields: Object.keys(data).length,
    },
  })
}
```

---

## Field Factories Reference

### `trackingField(options)`

General-purpose tracking for any block.

**Parameters:**
```typescript
{
  name?: string                  // Field name (default: 'tracking')
  defaultEnabled?: boolean       // Enable by default (default: true)
  showAdvanced?: boolean         // Show customProperties JSON (default: false)
  overrides?: Partial<GroupField> // Deep merge custom config
}
```

**Generated Fields:**
- `enabled` (checkbox) - Enable/disable tracking
- `eventName` (text) - Custom event name override
- `category` (select) - Event category (engagement/conversion/lead/navigation/media)
- `conversionValue` (number) - Dollar value for ROI tracking
- `customProperties` (json) - Advanced custom properties (if `showAdvanced: true`)

**Example:**
```typescript
trackingField({
  defaultEnabled: true,
  showAdvanced: false,
})
```

---

### `ctaTrackingField()`

Specialized tracking for CTA buttons with **complete GA4 and Meta Pixel standard event integration**.

**Parameters:** None (uses defaults from `trackingField`)

**Additional Fields:**
- `trackAsConversion` (checkbox) - Send conversion event to Meta/GA
- `ga4EventType` (select) - **NEW!** Map to GA4 recommended events (24 options)
  - E-commerce: add_to_cart, begin_checkout, purchase, refund, etc.
  - Lead Generation: generate_lead, qualify_lead, close_convert_lead, etc.
  - Engagement: select_content, select_promotion, search, login, etc.
  - Gaming: earn_virtual_currency, level_up, post_score, etc.
- `metaEventType` (select) - **EXPANDED!** Map to Meta Pixel standard events (17 options)
  - Lead & Registration: Lead, CompleteRegistration, StartTrial, Subscribe, etc.
  - E-commerce: AddToCart, InitiateCheckout, Purchase, etc.
  - Engagement: ViewContent, Search, Contact, etc.
  - Location & Services: FindLocation, Schedule, etc.
  - Other: CustomizeProduct, Donate, Custom, etc.

**Use in array fields:**
```typescript
{
  name: 'buttons',
  type: 'array',
  fields: [
    { name: 'text', type: 'text' },
    { name: 'link', type: 'text' },
    ctaTrackingField(), // ← Track each button individually with full event control
  ]
}
```

**CMS Configuration Example:**
Editors can now choose specific events for each platform:
- GA4: "Generate Lead" for lead forms, "Purchase" for checkout buttons
- Meta: "Lead" for contact forms, "Schedule" for appointment booking

---

### `videoTrackingField()`

Track video engagement metrics.

**Additional Fields:**
- `trackPlayPause` (checkbox) - Track play/pause events
- `trackProgress` (checkbox) - Track 25%, 50%, 75%, 100% milestones

**Example:**
```typescript
{
  name: 'videos',
  type: 'array',
  fields: [
    { name: 'youtubeUrl', type: 'text' },
    videoTrackingField(),
  ]
}
```

---

### `trackImpressionField(options)`

Track block visibility/impressions.

**Parameters:**
```typescript
{
  trackViewport?: boolean      // Only track when visible (default: true)
  viewportThreshold?: number   // % visible required (default: 0.5)
}
```

**Additional Fields:**
- `trackViewport` (checkbox) - Only track when visible
- `viewportThreshold` (number) - Percentage visible required (0-1)

**Example:**
```typescript
trackImpressionField({
  trackViewport: true,
  viewportThreshold: 0.5, // 50% visible
})
```

---

## Tracking Functions Reference

### `trackWithConfig(context, options?)`

**Core tracking function.** Checks CMS config, enriches data, fires to all platforms.

**Parameters:**
```typescript
{
  blockType: string               // Block slug
  blockData: BlockWithTracking    // Block data with tracking config
  action: TrackingAction          // Event action type
  label?: string                  // Human-readable label
  position?: number               // Block position (0-indexed)
  additionalProps?: Record<string, any> // Runtime context
  trackingFieldName?: 'tracking' | 'ctaTracking' | 'videoTracking' | 'impressionTracking'
}

// Options
{
  skipPostHog?: boolean
  skipGA?: boolean
  skipMeta?: boolean
  metaEventName?: string
  debug?: boolean
}
```

**Actions:**
- `cta_click` - CTA/button clicks
- `impression` - Block visibility
- `video_play`, `video_pause`, `video_progress`, `video_complete`
- `form_start`, `form_submit`
- `engagement`, `navigation`

---

### `trackCTAClick(params)`

**Convenience function for CTA tracking.**

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

---

### `trackBlockImpression(params)`

**Track block impressions (visibility).**

```typescript
trackBlockImpression({
  blockType: 'marketing-hero',
  blockData: { impressionTracking: tracking },
  position: 0,
})
```

---

### `trackVideoInteraction(params)`

**Track video engagement.**

```typescript
trackVideoInteraction({
  blockType: 'content-video',
  blockData: { videoTracking },
  action: 'video_play',
  videoId: 'dQw4w9WgXcQ',
  videoTitle: 'Artist Performance',
  progress: 0.5, // For video_progress
})
```

---

### `trackFormInteraction(params)`

**Track form interactions.**

```typescript
trackFormInteraction({
  blockType: 'marketing-contact-form',
  blockData: { tracking },
  action: 'form_submit',
  formName: 'Contact Us',
})
```

---

## Type System

### TypeScript Strict Mode

This project uses **strict TypeScript** with `exactOptionalPropertyTypes: true`. This means:

```typescript
// ❌ Wrong: Optional properties can't be undefined
interface Wrong {
  tracking?: BlockTrackingConfig
}

// ✅ Correct: Explicitly allow undefined
interface Correct {
  tracking?: BlockTrackingConfig | undefined
}
```

### Key Interfaces

#### `BlockTrackingConfig`

```typescript
interface BlockTrackingConfig {
  enabled?: boolean | null
  eventName?: string | null
  category?: 'engagement' | 'conversion' | 'lead' | 'navigation' | 'media' | null
  conversionValue?: number | null
  customProperties?: Record<string, any> | null
}
```

#### `BlockWithTracking`

```typescript
type BlockWithTracking = {
  tracking?: BlockTrackingConfig | undefined
  ctaTracking?: CTATrackingConfig | undefined
  videoTracking?: VideoTrackingConfig | undefined
  impressionTracking?: BlockTrackingConfig | undefined
}
```

#### `TrackingContext`

```typescript
interface TrackingContext {
  blockType: string
  blockData: BlockWithTracking
  action: TrackingAction
  label?: string | undefined
  position?: number | undefined
  additionalProps?: Record<string, any> | undefined
  trackingFieldName?: 'tracking' | 'ctaTracking' | 'videoTracking' | 'impressionTracking' | undefined
}
```

### Payload Generated Types

Payload generates types with `| null` for optional fields:

```typescript
// Generated by Payload
export interface MarketingFindADealerBlock {
  tracking?: {
    enabled?: boolean | null
    category?: ('engagement' | 'conversion' | 'lead' | 'navigation') | null
    conversionValue?: number | null
  }
}
```

**Why `| null`?** Payload uses JSON Schema which represents optional fields as `T | null | undefined`.

---

## Event Mapping

### Event Data Structure

All events include:

```typescript
{
  // Core Properties
  block_type: 'marketing-find-a-dealer',
  action: 'cta_click',
  label: 'Find a Dealer',
  category: 'lead',
  value: 25,
  position: 0,

  // Page Context
  page_path: '/st-louis',
  page_url: 'https://kawai.com/st-louis',
  referrer: 'https://google.com',
  timestamp: '2026-02-09T12:34:56.789Z',

  // UTM Attribution (auto-included from session)
  utm_source: 'google',
  utm_medium: 'cpc',
  utm_campaign: 'spring-sale',
  utm_content: 'piano-ad',
  utm_term: 'kawai+piano',

  // CMS Custom Properties
  ...trackingConfig?.customProperties,

  // Runtime Additional Props
  theme: 'light',
  has_background: true,
}
```

### Platform Mappings

#### Google Analytics 4

**Priority System:**
1. **CMS Configuration First** - If editor sets `ga4EventType` in CMS, that event is used
2. **Smart Fallback** - Otherwise, intelligent mapping based on context
3. **Generic Default** - Falls back to generic event if no match

**Available GA4 Standard Events (24 total):**

**E-commerce Events** (8 events)
| Event | Use Case |
|-------|----------|
| `add_payment_info` | User adds payment details during checkout |
| `add_shipping_info` | User provides shipping information |
| `add_to_cart` | Item added to shopping cart |
| `add_to_wishlist` | Item added to wishlist |
| `begin_checkout` | Checkout process initiated |
| `purchase` | Transaction completed |
| `refund` | Items refunded |
| `remove_from_cart` | Item removed from cart |

**Lead Generation Events** (5 events)
| Event | Use Case |
|-------|----------|
| `generate_lead` | **Recommended for CTAs** - Lead form submitted |
| `qualify_lead` | User meets lead qualification criteria |
| `disqualify_lead` | User marked as unqualified lead |
| `close_convert_lead` | Lead converts to customer |
| `close_unconvert_lead` | Lead marked as not converted |

**Engagement Events** (6 events)
| Event | Use Case |
|-------|----------|
| `select_content` | User selects specific content |
| `select_item` | Item selected from list |
| `select_promotion` | Promotional offer selected |
| `search` | Search query performed |
| `login` | User authentication |
| `join_group` | User joins group/team |

**Gaming Events** (5 events)
| Event | Use Case |
|-------|----------|
| `earn_virtual_currency` | Virtual currency earned |
| `level_start` | Game level begins |
| `level_end` | Game level ends |
| `level_up` | Player advances level |
| `post_score` | Game score submitted |

**Auto-Mapping (Fallback):**
| Action | Default GA4 Event | Context |
|--------|-------------------|---------|
| `cta_click` (find-a-dealer) | `find_location` | Location-related CTAs |
| `cta_click` (lead/contact) | `generate_lead` | Lead generation CTAs |
| `cta_click` (other) | `select_promotion` | General CTAs |
| `form_submit` | `generate_lead` | Form submissions |
| `form_start` | `begin_checkout` | Form initiation |
| `video_play` | `video_start` | Video playback |
| `video_complete` | `video_complete` | Video completion |
| `impression` | `view_promotion` | Block visibility |

📚 **Reference:** [Google Analytics 4 Recommended Events](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)

---

#### Meta Pixel

**Priority System:**
1. **CMS Configuration First** - If editor sets `metaEventType` in CMS, that event is used
2. **Smart Fallback** - Otherwise, intelligent mapping based on context
3. **Custom Default** - Falls back to custom event if no match

**Available Meta Standard Events (17 total):**

**Lead & Registration Events** (5 events)
| Event | Use Case |
|-------|----------|
| `Lead` | **Recommended for CTAs** - Lead form submission |
| `CompleteRegistration` | User signs up for service/newsletter |
| `SubmitApplication` | Application submitted |
| `StartTrial` | Free trial initiated |
| `Subscribe` | Subscription started |

**E-commerce Events** (5 events)
| Event | Use Case |
|-------|----------|
| `AddPaymentInfo` | Payment details added during checkout |
| `AddToCart` | Item added to cart |
| `AddToWishlist` | Item added to wishlist |
| `InitiateCheckout` | Checkout process begins |
| `Purchase` | Transaction completed |

**Engagement Events** (3 events)
| Event | Use Case |
|-------|----------|
| `ViewContent` | Content viewing/page view |
| `Search` | Search performed |
| `Contact` | Customer reaches out to business |

**Location & Services Events** (2 events)
| Event | Use Case |
|-------|----------|
| `FindLocation` | Dealer/store locator used |
| `Schedule` | Appointment/demo scheduled |

**Other Events** (2 events)
| Event | Use Case |
|-------|----------|
| `CustomizeProduct` | Product customized with configurator |
| `Donate` | Donation made |

**Auto-Mapping (Fallback):**
| Action | Default Meta Event | Context |
|--------|-------------------|---------|
| `cta_click` (find-a-dealer) | `FindLocation` | Dealer locator |
| `cta_click` (lead/contact) | `Lead` | Lead generation |
| `cta_click` (conversion) | `Lead` | Conversion events |
| `form_submit` | `Lead` | Form submissions |
| `form_start` | `InitiateCheckout` | Form initiation |
| `video_play` | `VideoView` | Video engagement |

📚 **Reference:** [Meta Pixel Standard Events](https://madgicx.com/blog/facebook-pixel-events)

---

## Troubleshooting

### Type Error: Property 'tracking' does not exist

**Cause:** Payload types haven't regenerated after adding tracking field.

**Solution:**
```bash
# Clear cache and rebuild
rm -rf .next && bun run build

# Or restart dev server
bun run dev
```

---

### Type Error: 'undefined' is not assignable to type

**Cause:** Missing `| undefined` on optional properties with `exactOptionalPropertyTypes: true`.

**Solution:** Add `| undefined` to interface:
```typescript
// ❌ Wrong
interface Wrong {
  tracking?: BlockTrackingConfig
}

// ✅ Correct
interface Correct {
  tracking?: BlockTrackingConfig | undefined
}
```

---

### Tracking Field Only Has 2 Properties Instead of 4

**Cause:** `deepMerge` replaced fields array instead of merging (fixed in recent update).

**Verify fix:**
```bash
bun -e "
import { trackingField } from './src/lib/payload/fields/tracking.ts';
const result = trackingField({ overrides: { fields: [{ name: 'category' }] } });
console.log('Fields:', result.fields.map(f => f.name));
"
# Should output: Fields: [ 'enabled', 'eventName', 'category', 'conversionValue' ]
```

---

### Events Not Firing

**Debug checklist:**
1. ✅ Check browser console (dev mode logs all events)
2. ✅ Verify `tracking.enabled === true` in CMS
3. ✅ Check `posthog.__loaded === true` in browser console — **not** `window.posthog` (see note below)
4. ✅ Verify `typeof window !== 'undefined'` (client-side only)
5. ✅ Check for CSP blocking scripts

> **⚠️ Critical: `window.posthog` is always `undefined` in this codebase.**
>
> posthog-js only sets `window.posthog` when loaded as a legacy `<script>` tag. We use ES module imports (`import posthog from 'posthog-js'`), so the singleton lives in the module cache, **not** on `window`. `unified-tracking.ts` uses `posthog.__loaded` + direct module capture — never `window.posthog`. If you see a utility function checking `window.posthog`, it is a bug and will silently drop all PostHog events.

**Enable debug mode:**
```typescript
trackCTAClick({
  // ...
}, {
  debug: true // Logs all events to console
})
```

---

### Missing UTM Parameters

**Cause:** UTM parameters not stored in session.

**Verify:**
```javascript
// In browser console
console.log(sessionStorage.getItem('utm_params'))
```

**Solution:** UTM tracking is automatic via `src/lib/shopify/utm-tracking.ts`. Ensure it's loaded on page load.

---

## Maintenance

### Adding New Event Actions

1. Update `TrackingAction` type:
```typescript
// src/lib/analytics/unified-tracking.ts
export type TrackingAction =
  | 'cta_click'
  | 'impression'
  | 'video_play'
  | 'my_new_action' // ← Add here
```

2. Add GA4 mapping:
```typescript
function mapToGA4Event(action, category, blockType) {
  // ...
  if (action === 'my_new_action') return 'my_ga4_event'
  // ...
}
```

3. Add Meta Pixel mapping:
```typescript
function mapToMetaEvent(action, category, blockType, trackingConfig) {
  // ...
  if (action === 'my_new_action') return 'MyMetaEvent'
  // ...
}
```

---

### Adding New Field Factory

1. Create factory function:
```typescript
// src/lib/payload/fields/tracking.ts
export const myCustomTrackingField = (): GroupField => {
  const baseTracking = trackingField({
    name: 'myCustomTracking',
    defaultEnabled: true,
  })

  return deepMerge(baseTracking, {
    label: '🎯 My Custom Tracking',
    fields: [
      {
        name: 'customOption',
        type: 'checkbox',
        label: 'Enable custom feature',
        admin: {
          condition: (data: any, siblingData: any) => siblingData?.enabled === true,
        },
      },
    ],
  } as Partial<GroupField>)
}
```

2. Export from module:
```typescript
// src/lib/payload/fields/tracking.ts
export { myCustomTrackingField } from './tracking'
```

3. Update interfaces:
```typescript
// src/lib/analytics/unified-tracking.ts
export interface MyCustomTrackingConfig extends BlockTrackingConfig {
  customOption?: boolean | null
}

export type BlockWithTracking = {
  // ...
  myCustomTracking?: MyCustomTrackingConfig | undefined
}
```

---

### Updating Platform SDKs

**PostHog:**
```bash
bun add posthog-js@latest
```

**Google Analytics:**
Update script tag in `app/layout.tsx` or relevant layout:
```tsx
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${NEXT_PUBLIC_GA_ID}`}
  strategy="afterInteractive"
/>
```

**Meta Pixel:**
Update script tag in `app/layout.tsx`:
```tsx
<Script id="meta-pixel" strategy="afterInteractive">
  {`!function(f,b,e,v,n,t,s){...}('${NEXT_PUBLIC_META_PIXEL_ID}')`}
</Script>
```

---

### Testing Tracking

#### Manual Testing (Browser DevTools)

```javascript
// 1. Enable debug mode in console
localStorage.setItem('debug_tracking', 'true')

// 2. Interact with tracked elements

// 3. Check console logs
// Look for: 📊 [Unified Tracking] Event: ...

// 4. Verify in Network tab
// PostHog: /decide, /capture
// GA4: /collect
// Meta: /tr
```

#### Automated Testing

> **⚠️ Do NOT use `window.posthog = mockPostHog`** — `unified-tracking.ts` uses the imported posthog module singleton, not `window.posthog`. Mock the module instead.

```typescript
// tests/tracking.test.ts
import { trackCTAClick } from '@/lib/analytics/unified-tracking'

// ✅ Correct: mock the posthog-js module, not window.posthog
const mockCapture = jest.fn()
jest.mock('posthog-js', () => ({
  __loaded: true,
  capture: mockCapture,
}))

describe('Tracking System', () => {
  beforeEach(() => {
    mockCapture.mockClear()
  })

  it('should track CTA click when enabled', () => {
    trackCTAClick({
      blockType: 'test-block',
      blockData: {
        tracking: {
          enabled: true,
          category: 'engagement',
        },
      },
      ctaText: 'Test Button',
      destination: '/test',
    })

    expect(mockCapture).toHaveBeenCalledWith(
      'test-block_cta_click',
      expect.objectContaining({
        block_type: 'test-block',
        action: 'cta_click',
        label: 'Test Button',
      })
    )
  })

  it('should NOT track when disabled', () => {
    trackCTAClick({
      blockType: 'test-block',
      blockData: {
        tracking: {
          enabled: false,
        },
      },
      ctaText: 'Test Button',
      destination: '/test',
    })

    expect(mockCapture).not.toHaveBeenCalled()
  })

  it('should NOT track when posthog is not yet initialised', () => {
    // Simulate posthog not loaded (e.g. early SSR hydration)
    jest.resetModules()
    jest.mock('posthog-js', () => ({ __loaded: false, capture: mockCapture }))

    trackCTAClick({
      blockType: 'test-block',
      blockData: { tracking: { enabled: true } },
      ctaText: 'Test',
      destination: '/test',
    })

    expect(mockCapture).not.toHaveBeenCalled()
  })
})
```

---

## Best Practices

### DO ✅

- ✅ Use tracking field factories for all blocks
- ✅ Always pass `blockData: { tracking }` from renderer
- ✅ Set appropriate `conversionValue` per block type
- ✅ Use descriptive labels (button text, form name)
- ✅ Test tracking in development (check console logs)
- ✅ Use `ctaTrackingField()` for buttons in arrays
- ✅ Add `| undefined` to optional properties
- ✅ Regenerate types after changing block definitions

### DON'T ❌

- ❌ Hardcode tracking without CMS configuration
- ❌ Track personal/sensitive data in custom properties
- ❌ Skip UTM attribution (automatic via unified tracking)
- ❌ Use generic event names (be specific)
- ❌ Call tracking functions on SSR (check `typeof window`)
- ❌ Forget to check `tracking.enabled === false`
- ❌ Override base fields without understanding deepMerge
- ❌ Use `window.posthog` — always `undefined` with ES module imports. Use `import posthog from 'posthog-js'` + check `posthog.__loaded`
- ❌ Mock `window.posthog` in tests — mock the `posthog-js` module instead (`jest.mock('posthog-js', ...)`)

---

## Resources

- **Main Documentation:** `docs/CLAUDE.md` - Block Development & Analytics Tracking section
- **Payload CMS Docs:** https://payloadcms.com/docs
- **PostHog Docs:** https://posthog.com/docs
- **GA4 Events Reference:** https://developers.google.com/analytics/devguides/collection/ga4/reference/events
- **Meta Pixel Reference:** https://developers.facebook.com/docs/meta-pixel/reference

---

## Changelog

### 2026-03-10 - v1.2.0 - PostHog Module Fix + ProductHero Impression Tracking

**Fixed:**
- **`window.posthog` was always `undefined`** — posthog-js v3 with ES module imports does NOT attach to `window`. The `trackWithConfig()` guard `if (window.posthog)` was silently dropping **all** PostHog events across the entire app. Fixed by importing the posthog module singleton directly and checking `posthog.__loaded` instead.
- **ProductHero block had no automatic impression tracking** — no `trackBlockImpression()` call existed anywhere in `ProductHeroBlock.tsx`, so the block never sent any automatic event on view.
- **`impressionTracking` field missing from CMS schema** — `ProductHero.ts` only registered `ctaTrackingField()`. Added `trackImpressionField()` so editors can configure impression tracking per block instance.

**Updated:**
- `src/lib/analytics/unified-tracking.ts` — replaced `window.posthog` with `import posthog from 'posthog-js'` + `posthog.__loaded` guard
- `src/blocks/product/ProductHero.ts` — added `trackImpressionField({ trackViewport: true, viewportThreshold: 0.5 })`
- `src/components/blocks/ProductHeroBlock.tsx` — added `impressionTracking` prop + mount `useEffect` calling `trackBlockImpression()`
- Documentation updated throughout to reflect correct posthog usage pattern

**Impact:**
- PostHog now receives events from **all** blocks that use `trackWithConfig` (CTA clicks, form submissions, video interactions, impressions) — these were all silently failing before
- ProductHero blocks now fire `product-hero_impression` on mount with `product_name` and `product_slug` context
- Test examples updated to use `jest.mock('posthog-js')` instead of the now-incorrect `window.posthog` assignment

---

### 2026-02-10 - v1.1.0 - Complete Standard Events Integration

**Added:**
- **GA4 Event Type Selector** - `ctaTrackingField()` now includes `ga4EventType` with 24 GA4 recommended events
  - E-commerce events (8): add_to_cart, begin_checkout, purchase, refund, etc.
  - Lead generation events (5): generate_lead, qualify_lead, close_convert_lead, etc.
  - Engagement events (6): select_content, select_promotion, search, login, etc.
  - Gaming events (5): earn_virtual_currency, level_up, post_score, etc.
- **Expanded Meta Pixel Events** - `metaEventType` expanded from 5 to 17 standard events
  - Lead & Registration (5): Lead, CompleteRegistration, StartTrial, Subscribe, etc.
  - E-commerce (5): AddToCart, InitiateCheckout, Purchase, etc.
  - Engagement (3): ViewContent, Search, Contact
  - Location & Services (2): FindLocation, Schedule
  - Other (2): CustomizeProduct, Donate
- **Priority System** - Tracking now checks CMS config first, then falls back to intelligent auto-mapping
- **Enhanced Documentation** - Complete event reference tables with use cases

**Updated:**
- `CTATrackingConfig` interface to include `ga4EventType` field
- `mapToGA4Event()` function to check for CMS-configured event type before auto-mapping
- Documentation with comprehensive event tables organized by category
- References to official Google and Meta documentation

**Impact:**
- Editors can now choose specific standard events per CTA without code changes
- Better conversion tracking for ads optimization
- Platform-specific event mapping for improved reporting
- Maintains backward compatibility with smart fallbacks

---

### 2026-02-09 - v1.0.0

**Added:**
- Initial tracking system implementation
- Field factories: `trackingField`, `ctaTrackingField`, `videoTrackingField`, `trackImpressionField`
- Unified tracking library with multi-platform support
- Auto UTM attribution

**Fixed:**
- `deepMerge` now properly merges field arrays by name (no longer replaces)
- Added `| undefined` to all optional properties for `exactOptionalPropertyTypes: true`
- Added `| null` to all tracking interfaces to match Payload generated types
- Fixed duplicate `value` property in GA4 tracking

---

**Questions?** Check the [Troubleshooting](#troubleshooting) section or review `docs/CLAUDE.md`.
