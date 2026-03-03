# KAWAI Piano — Branding Consistency Guide

> Generated via automated audit · March 2026
> Current brand compliance: ~65% (target: 95%+)

---

## Table of Contents

1. [Brand Colors](#1-brand-colors)
2. [Typography](#2-typography)
3. [Spacing (Ma Scale)](#3-spacing-ma-scale)
4. [Shadows](#4-shadows)
5. [Buttons](#5-buttons)
6. [Cards](#6-cards)
7. [Section / Block Layout](#7-section--block-layout)
8. [Animations & Transitions](#8-animations--transitions)
9. [Dark Sections](#9-dark-sections)
10. [Campaign Namespaces](#10-campaign-namespaces)
11. [Known Violations & Remediation](#11-known-violations--remediation)

---

## 1. Brand Colors

### Primary Palette

| Token | Class | Hex | Usage |
|-------|-------|-----|-------|
| `--color-kawai-red` | `kawai-red` | `#E11922` | Primary CTA, accent, logo |
| `--color-kawai-black` | `kawai-black` | `#1E1B16` | Main text, dark sections |
| `--color-kawai-charcoal` | `kawai-charcoal` | `#2C2C2C` | Secondary text, UI chrome |
| `--color-kawai-pearl` | `kawai-pearl` | `#FAF8F5` | Page backgrounds, light cards |
| `--color-kawai-neutral` | `kawai-neutral` | `#DBDBDB` | Borders, dividers |
| `--color-kawai-gold` | `kawai-gold` | `#d5c78c` | Shigeru Kawai premium accent |

### Scale Variants

`kawai-red`, `kawai-black`, and `kawai-charcoal` have full **50–900** scales:

```
bg-kawai-red-50   → #fef2f2  (near-white red tint)
bg-kawai-red-500  → #E11922  (base brand red)
bg-kawai-red-700  → hover state for red buttons
bg-kawai-red-900  → deep red / dark accent
```

### Rules

```tsx
// ✅ Use brand tokens
<p className="text-kawai-black">...</p>
<div className="bg-kawai-pearl">...</div>
<button className="bg-kawai-red hover:bg-kawai-red-700">...</button>

// ❌ Never use raw Tailwind gray/red
<p className="text-gray-600">...</p>   // → text-kawai-charcoal
<p className="text-gray-900">...</p>   // → text-kawai-black
<p className="text-gray-500">...</p>   // → text-kawai-neutral-500
<div className="bg-gray-50">...</div>  // → bg-kawai-pearl
<div className="bg-gray-100">...</div> // → bg-kawai-pearl
<button className="bg-red-600">...</button> // → bg-kawai-red
```

### Gray-to-Brand Mapping (Global Find/Replace)

| Replace | With |
|---------|------|
| `text-gray-900` | `text-kawai-black` |
| `text-gray-700` | `text-kawai-black` |
| `text-gray-600` | `text-kawai-charcoal` |
| `text-gray-500` | `text-kawai-neutral-500` |
| `text-gray-400` | `text-kawai-neutral-400` |
| `text-gray-300` | `text-kawai-neutral-300` |
| `bg-gray-900` | `bg-kawai-black-900` |
| `bg-gray-800` | `bg-kawai-black-800` |
| `bg-gray-100` | `bg-kawai-pearl` |
| `bg-gray-50` | `bg-kawai-pearl` |
| `bg-red-500` / `bg-red-600` | `bg-kawai-red` |
| `bg-white` (as section bg) | `bg-kawai-pearl` |

### Status Colors (No Brand Equivalent — Raw Tailwind Allowed)

These UI states have no brand token yet. Raw Tailwind is acceptable until status tokens are defined:

| State | Acceptable Class |
|-------|-----------------|
| Success | `bg-emerald-600`, `text-green-700` |
| Warning | `bg-yellow-50`, `text-yellow-800` |
| Error | `bg-red-50`, `text-red-700` |
| Info | `bg-blue-50`, `text-blue-700` |

> **Note:** `bg-blue-500/600` used as a CTA button color has NO place in this design system. All CTAs should use `bg-kawai-red`.

### Gold Consistency

There are currently 3 different gold values in the codebase. Use only the brand token:

| Source | Value | Status |
|--------|-------|--------|
| `--color-kawai-gold` | `#d5c78c` | ✅ Official brand gold |
| University page `--tsu-gold` | `#FFD700` | ⚠️ TSU-specific only |
| Dealer map ring pulse | `#D4A555` | ❌ Replace with `kawai-gold` |

---

## 2. Typography

### Font Stack

| Variable | Font | Usage |
|----------|------|-------|
| `--font-brand-sans` | Inter | Body text, UI, navigation, labels |
| `--font-brand-serif` / `--font-brand-luxury` | Crimson Text | Headings, editorial, product copy |
| `--font-family-cormorant` | Cormorant Garamond | Artist carousel, Japanese aesthetic sections |
| `--font-family-noto` | Noto Sans | Supplementary/international text |
| `--font-buena-park` | Playfair Display | Legacy/sparse — avoid for new work |

### Applying Fonts

```tsx
// ✅ Correct — always use a CSS variable token for the font family
<h1 className="font-[family-name:var(--font-brand-luxury)]">Concert Grand</h1>
<p className="font-[family-name:var(--font-brand-sans)]">Natural sound technology</p>

// ❌ Never use font name directly
<h2 className="font-playfair">...</h2>       // Breaks in production
<h2 className="font-cormorant">...</h2>      // Breaks in production
<h2 className="font-noto">...</h2>           // Breaks in production
```

### Heading Hierarchy

Use these patterns consistently:

```tsx
// Page Hero (h1 equivalent)
<h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light font-[family-name:var(--font-brand-serif)] leading-tight tracking-tight">

// Section Title (h2 equivalent)
<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-brand-serif)] tracking-tight">

// Subsection (h3 equivalent)
<h3 className="text-xl md:text-2xl font-semibold font-[family-name:var(--font-brand-sans)]">

// Card Title
<h4 className="text-lg font-semibold font-[family-name:var(--font-brand-sans)]">
```

Or use the defined utility classes (preferred):

```tsx
<h1 className="heading-brand-hero text-5xl">...</h1>
<h2 className="heading-brand-section">...</h2>
<h2 className="heading-brand-luxury text-4xl">...</h2>
```

### Text Size Scale

Prefer standard Tailwind scale. Avoid arbitrary pixel sizes:

```tsx
// ✅ Use scale
<span className="text-xs">Fine print / metadata</span>  // 12px
<p className="text-sm">Secondary body</p>               // 14px
<p className="text-base">Body default</p>               // 16px
<p className="text-lg">Slightly elevated body</p>       // 18px

// ❌ Avoid arbitrary sizes (67 violations currently)
<span className="text-[10px]">...</span>  // Use text-xs
<span className="text-[9px]">...</span>   // Use text-xs
<span className="text-[15px]">...</span>  // Use text-sm
```

Exceptions: `text-[200px]` / `text-[300px]` for large decorative display text in `brand-philosophy.tsx` — acceptable.

### Letter Spacing

The standard Tailwind tracking scale is too coarse for this brand. Use these values only:

| Value | Usage |
|-------|-------|
| `tracking-tight` | Display headings |
| `tracking-normal` | Body text |
| `tracking-wide` | Navigation items |
| `tracking-wider` | Subheadings, labels |
| `tracking-widest` | All-caps UI labels |
| `tracking-[0.15em]` | CTA buttons (acceptable) |
| `tracking-[0.2em]` | Collection names (acceptable) |

> Do not introduce new arbitrary tracking values without adding them to this list.

### Font Weights

| Weight | Usage |
|--------|-------|
| `font-light` (300) | Hero headings, artistic/editorial text |
| `font-normal` (400) | Body text default |
| `font-medium` (500) | UI labels, secondary navigation |
| `font-semibold` (600) | Sub-headings, highlights, form labels |
| `font-bold` (700) | Primary headings, key content |

---

## 3. Spacing (Ma Scale)

Brand spacing follows a Japanese Ma (間) philosophy — intentional, harmonious white space.

### Scale Reference

| Token | Class | Value | Pixels |
|-------|-------|-------|--------|
| `--spacing-brand-xs` | `brand-xs` | 0.25rem | 4px |
| `--spacing-brand-sm` | `brand-sm` | 0.5rem | 8px |
| `--spacing-brand-md` | `brand-md` | 1rem | 16px |
| `--spacing-brand-lg` | `brand-lg` | 1.5rem | 24px |
| `--spacing-brand-xl` | `brand-xl` | 2rem | 32px |
| `--spacing-brand-2xl` | `brand-2xl` | 3rem | 48px |
| `--spacing-brand-3xl` | `brand-3xl` | 4rem | 64px |
| `--spacing-brand-4xl` | `brand-4xl` | 6rem | 96px |

### Section Vertical Padding

```tsx
// ✅ Use brand scale for section padding
<section className="py-brand-4xl">   // 96px — full-size sections
<section className="py-brand-3xl">   // 64px — standard sections
<section className="py-brand-2xl">   // 48px — compact sections
<section className="py-brand-xl">    // 32px — tight sections

// ❌ Avoid raw Tailwind for section spacing
<section className="py-16 lg:py-24">  // 64px–96px — use brand scale instead
<section className="py-12">           // 48px — use py-brand-2xl
<section className="py-24 lg:py-32">  // use py-brand-3xl or py-brand-4xl
```

### Element Spacing

```tsx
// Margin between elements
<h2 className="mb-brand-lg">Section Title</h2>   // 24px below heading
<p className="mb-brand-md">Description</p>        // 16px below copy

// Grid gaps
<div className="grid gap-brand-lg">...</div>      // 24px gap
<div className="grid gap-brand-xl">...</div>      // 32px gap
```

---

## 4. Shadows

Use brand shadow tokens — never raw Tailwind `shadow-*`:

| Token | Class | Usage |
|-------|-------|-------|
| `--shadow-brand-subtle` | `shadow-brand-subtle` | Cards at rest, inputs |
| `--shadow-brand-medium` | `shadow-brand-medium` | Cards on hover, modals |
| `--shadow-brand-premium` | `shadow-brand-premium` | Feature hero cards, elevated UI |
| `--shadow-brand-red-glow` | `shadow-brand-red-glow` | Primary CTA buttons |
| `--shadow-brand-cinematic` | `shadow-brand-cinematic` | Full-bleed cinematic sections |

```tsx
// ✅ Brand shadows
<div className="shadow-brand-subtle hover:shadow-brand-medium transition-shadow">

// ❌ Raw Tailwind
<div className="shadow-lg">    // Use shadow-brand-medium
<div className="shadow-sm">    // Use shadow-brand-subtle
<div className="shadow-xl">    // Use shadow-brand-premium
```

---

## 5. Buttons

### Primary Button

```tsx
// ✅ Preferred — use brand utility
<button className="btn-brand-primary">Shop Now</button>

// ✅ Acceptable — CMSLink default
<button className="inline-flex items-center justify-center rounded-md bg-kawai-red px-4 py-2 text-sm font-medium text-white hover:bg-kawai-red/90 transition-colors">

// ✅ Large CTA (hero)
<button className="bg-kawai-red text-white px-8 py-4 rounded-full font-medium tracking-[0.15em] hover:bg-kawai-red-700 transition-colors shadow-brand-red-glow">
```

### Secondary Button

```tsx
// ✅ Preferred — use brand utility
<button className="btn-brand-secondary">Learn More</button>

// ✅ Acceptable
<button className="border border-kawai-red text-kawai-red px-4 py-2 rounded-md hover:bg-kawai-red/10 transition-colors">
```

### Rules

```tsx
// ❌ Never mix brand and raw Tailwind tokens
<button className="bg-kawai-red hover:bg-red-700">    // WRONG — use hover:bg-kawai-red-700
<button className="bg-red-600 hover:bg-red-700">      // WRONG — use bg-kawai-red
<button className="bg-blue-500">                       // WRONG — no blue CTAs, use bg-kawai-red
```

### Hover State Standard

| State | Class |
|-------|-------|
| Primary hover | `hover:bg-kawai-red-700` or `hover:bg-kawai-red/90` |
| Secondary hover | `hover:bg-kawai-red/10` or `hover:border-kawai-red` |
| Ghost hover | `hover:text-kawai-red` or `hover:bg-kawai-pearl` |

---

## 6. Cards

### Card Variants

| Variant | Class | Background | Usage |
|---------|-------|-----------|-------|
| Intimate (light) | `card-brand-intimate` | `bg-kawai-pearl` | Standard content cards |
| News / Feature | `card-brand-news` | White | Blog posts, news items |
| Dynamic (dark) | `card-brand-dynamic` | `bg-kawai-black-800` | Dark-section feature cards |
| Cinematic (glass) | `card-brand-cinematic` | Translucent | Hero overlays, premium callouts |

```tsx
// ✅ Use brand card utilities
<div className="card-brand-intimate">...</div>
<div className="card-brand-news">...</div>

// ❌ Don't style cards ad-hoc
<div className="bg-white rounded-2xl shadow-lg border border-gray-100">  // Use card-brand-news
<div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200"> // Use card-brand-intimate
```

---

## 7. Section / Block Layout

### Container Standard

All content sections should use:

```tsx
<section className="py-brand-4xl">
  <div className="max-w-7xl mx-auto px-6">
    {/* content */}
  </div>
</section>
```

> Do not use `container mx-auto` — use explicit `max-w-7xl mx-auto px-6` for consistency.

### Narrow Content (CTAs, prose)

```tsx
<div className="max-w-4xl mx-auto px-6">
```

### Hero Heights

| Type | Classes |
|------|---------|
| Full-screen | `min-h-screen` |
| Large hero | `min-h-[600px] md:min-h-[800px] lg:min-h-[900px]` |
| Medium hero | `min-h-[400px] md:min-h-[600px]` |
| Compact hero | `min-h-[300px] md:min-h-[400px]` |

> Avoid hardcoded `h-[900px]` — use min-height so content can overflow gracefully.

### Background Overlays

```tsx
// ✅ Standard image overlay
<div className="absolute inset-0 bg-gradient-to-t from-kawai-black/80 via-kawai-black/40 to-transparent" />

// ✅ Solid color overlay
<div className="absolute inset-0 bg-kawai-black/60" />

// ❌ Don't duplicate overlay layers
<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30" />  // Inconsistent with brand
<div className="absolute inset-0 bg-black/40" />  // Second overlay — causes over-darkening
```

### Grid Patterns

| Columns | Classes |
|---------|---------|
| 1→2→3 | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-brand-lg` |
| 1→2→4 | `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-brand-lg` |
| 1→2 | `grid grid-cols-1 md:grid-cols-2 gap-brand-lg` |

---

## 8. Animations & Transitions

### Easing Curves

Always use brand easing — never Tailwind's default `ease-in-out` for brand transitions:

```tsx
// ✅ Use brand easing tokens
<div className="transition-transform duration-300 ease-[var(--ease-piano)]">
<div className="transition-opacity duration-500 ease-[var(--ease-elegant)]">

// Default easings (only for low-visibility elements)
<div className="transition-colors duration-200">
```

| Token | Value | Use |
|-------|-------|-----|
| `--ease-piano` | `cubic-bezier(0.4, 0, 0.2, 1)` | All UI interactions (hover, active, expand) |
| `--ease-elegant` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Content reveals, page transitions |

### Duration Standards

| Purpose | Duration |
|---------|----------|
| Color changes | `duration-200` |
| Transform/position | `duration-300` |
| Section reveals | `duration-500` |
| Carousel/slide transitions | `duration-700` to `duration-800` |
| Cinematic effects | `duration-1000`+ (via Framer Motion only) |

### Framer Motion

Use Framer Motion for complex sequences. Do not use `IntersectionObserver` + `setTimeout` for stagger effects:

```tsx
// ✅ Framer Motion for scroll-triggered animation
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
>

// ❌ Don't use IntersectionObserver for stagger
// (see FeaturedModelsRenderer.tsx — needs migration)
```

### Reduced Motion

Handled globally in `globals.css` — no per-component guards needed:

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

---

## 9. Dark Sections

### Approved Dark Background Colors

```tsx
// ✅ Brand-correct dark backgrounds
<section className="bg-kawai-black">       // #1E1B16 — primary dark
<section className="bg-kawai-black-900">   // deepest dark
<section className="bg-kawai-charcoal">    // #2C2C2C — slightly lighter dark

// ❌ Generic Tailwind dark grays
<section className="bg-gray-800">   // Use bg-kawai-black-800
<section className="bg-gray-900">   // Use bg-kawai-black-900
<section className="bg-slate-900">  // Use bg-kawai-black
```

### Text on Dark Backgrounds

```tsx
// ✅ Light text on dark
<p className="text-kawai-pearl">Primary text on dark</p>
<p className="text-white">High emphasis text</p>
<p className="text-kawai-neutral">Secondary/muted text on dark</p>

// ❌ Don't rely on default text color in dark sections
```

---

## 10. Campaign Namespaces

### ES60 Campaign

All ES60-specific colors live under `es60-` namespace:

```tsx
// ✅ Use ES60 CSS variables for ES60 components
<div className="text-es60-text-primary">...</div>     // #3C3530
<div className="bg-es60-primary-bg">...</div>         // #FAF8F5
<div className="text-es60-accent-earth">...</div>     // #8B7355

// ❌ Don't hardcode ES60 colors inline
<div style={{ color: '#3C3530' }}>...</div>           // Use text-es60-text-primary
<div style={{ backgroundColor: '#FAF8F5' }}>...</div> // Use bg-es60-primary-bg
```

ES60 colors must NOT be used outside ES60 campaign pages.

### University Event Pages

University pages use TSU-specific colors (`--tsu-maroon: #800000`, `--tsu-gold: #FFD700`). These are campus-specific and intentionally different from brand colors.

**Exception:** `--kawai-red` in `university/globals.css` is set to `#CC0000` — this is wrong and should be `#E11922`.

---

## 11. Known Violations & Remediation

### Priority 1 — Critical (Fix Immediately)

| File | Issue | Fix |
|------|-------|-----|
| `src/app/(frontend)/store/[storeslug]/university/globals.css` | `--kawai-red: #CC0000` (wrong hex) | Change to `#E11922` |
| `src/components/pages/es60/ES60Specifications.tsx:275–482` | 95+ inline `style={{color: '#...'}}` | Replace with `text-es60-*` classes |
| `src/components/pages/es60/ES60ValueProposition.tsx:191–279` | 80+ inline hex styles | Replace with `text-es60-*` classes |
| `src/components/cart/AddToCartButton.tsx:122` | `bg-red-600 hover:bg-red-600` | `bg-kawai-red hover:bg-kawai-red-700` |
| `src/components/pages/es60/CinematicTrigger.tsx:77,149,230` | `bg-red-600 hover:bg-red-700` | `bg-kawai-red hover:bg-kawai-red-700` |
| `src/components/pages/es60/MobileTouchInteractions.tsx` | `bg-red-500 hover:bg-red-600` | `bg-kawai-red hover:bg-kawai-red-700` |
| `src/components/pages/dallas-university/CountdownTimer.tsx:126` | `backgroundColor: '#800000'` | `className="bg-kawai-red-900"` |
| `src/components/pages/dallas-university/sections/AboutEventSection.tsx:131` | `backgroundColor: '#CC0000'` | `className="bg-kawai-red"` |

### Priority 2 — High

| File | Issue | Fix |
|------|-------|-----|
| `src/components/forms/ConstantContactForm.tsx:121` | `bg-kawai-red hover:bg-red-700` | `hover:bg-kawai-red-700` |
| `src/components/pages/signature/SignatureExperience.tsx:443` | `hover:bg-red-700` | `hover:bg-kawai-red-700` |
| `src/components/pages/dallas-university/ConsentBanner.tsx:143,171` | `font-playfair`, `hover:bg-red-700` | Use CSS var font, fix hover |
| `src/components/blocks/marketing/ArtistCarouselRenderer.tsx:480,522` | `font-cormorant`, `font-noto` | Use CSS variable font class, e.g. `font-[family-name:var(--font-family-cormorant)]` |
| `src/app/(frontend)/rebate/components/*` | `style={{ fontFamily: '...' }}` | Convert to Tailwind class |
| `src/components/search/SearchBar.tsx:926,939` | `fontFamily: 'var(--font-buena-park)'` | Use `--font-brand-luxury` alias |
| `src/app/globals.css:130–137` | Duplicate spacing token definition | Remove lines 130–137 |
| `src/components/blocks/layout/LayoutSpacerRenderer.tsx` | `h-2, h-4, h-8, h-16` raw values | Use `h-brand-*` equivalents |
| `src/components/blocks/layout/LayoutHeroCarouselRenderer.tsx:251–252` | Duplicate gradient overlays | Remove second overlay |

### Priority 3 — Medium (Batch Replace)

| Issue | Scale | Action |
|-------|-------|--------|
| `text-gray-600` → `text-kawai-charcoal` | 305 instances | Global find/replace |
| `text-gray-900` → `text-kawai-black` | 245 instances | Global find/replace |
| `text-gray-700` → `text-kawai-black` | 171 instances | Global find/replace |
| `text-gray-500` → `text-kawai-neutral-500` | 148 instances | Global find/replace |
| `bg-gray-50`/`bg-gray-100` → `bg-kawai-pearl` | 210 instances | Global find/replace |
| `bg-red-500`/`bg-red-600` → `bg-kawai-red` | 72 instances | Global find/replace |
| Card ad-hoc styling → `card-brand-*` | 20+ components | Component-by-component |
| Section `py-16/24/32` → `py-brand-*` | All blocks | Component-by-component |
| `--ease-piano` adoption in transitions | All blocks | Component-by-component |

### Priority 4 — Low / Long-term

| Issue | Action |
|-------|--------|
| `heading-brand-*` utilities underused | Audit all headings, adopt utilities |
| `text-brand-*` utilities defined but unused (4 utilities) | Either adopt or remove dead code |
| FeaturedModelsRenderer uses IntersectionObserver | Migrate to Framer Motion |
| Custom `3xl` breakpoint never used | Document intended use or remove |
| Prose `h4` uses sans font, breaking serif hierarchy | Fix `.prose h4` to use `--font-brand-serif` |
| HubSpot form hardcoded colors | Replace with brand tokens |
| Multiple scrollbar implementations | Consolidate to one |

---

## Quick Reference Cheatsheet

```tsx
// Colors
text-kawai-black       // Primary text
text-kawai-charcoal    // Secondary text
text-kawai-pearl       // Light text on dark
text-kawai-red         // Accent / CTA
text-kawai-gold        // Premium accent (Shigeru)
bg-kawai-pearl         // Light page background
bg-kawai-black         // Dark section
bg-kawai-red           // CTA / hero accent

// Typography
font-[family-name:var(--font-brand-sans)]    // Body, UI
font-[family-name:var(--font-brand-serif)]   // Headings
font-[family-name:var(--font-brand-luxury)]  // Luxury headings

// Spacing (section level)
py-brand-4xl → 96px   // Full sections
py-brand-3xl → 64px   // Standard sections
py-brand-2xl → 48px   // Compact sections
gap-brand-lg  → 24px  // Grid gaps

// Shadows
shadow-brand-subtle    // Cards at rest
shadow-brand-medium    // Hover state
shadow-brand-premium   // Elevated
shadow-brand-red-glow  // CTA button

// Components
btn-brand-primary      // Red CTA button
btn-brand-secondary    // Outline button
card-brand-intimate    // Light card (bg-pearl)
card-brand-news        // White feature card
card-brand-dynamic     // Dark card
card-brand-cinematic   // Glass card
```
