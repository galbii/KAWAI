# Shigeru Kawai Microsite — Branding Guidelines

This document is the single source of truth for visual design, typography, color, and component patterns across the Shigeru Kawai microsite (`/shigeru/*`). Follow it consistently so every new page or component looks like it belongs to the same premium world.

---

## Aesthetic Direction

**Tone**: Ultra-premium Japanese craftsmanship. Cinematic. Restrained. Dark.

The Shigeru Kawai microsite is a distinct sub-brand within the Kawai platform. It lives in deep black backgrounds, gold accents, and generous white space. Every design decision should reinforce the idea of a singular, handcrafted object made by artisans — not a product catalog.

**What it is not**: busy, colorful, playful, or generic. No gradients that aren't purposeful. No rounded hero cards. No stock-photo energy.

---

## Typography

### Primary Display Font — Oswald

Oswald is the main display and navigation font for the entire Shigeru microsite. Use it for all headings, eyebrows, nav labels, badges, CTAs, and any text that needs visual weight or identity.

```tsx
// Inline style shorthand used throughout the microsite
const f = { fontFamily: 'var(--font-oswald)' }

// Applied via style prop
<h2 style={{ fontFamily: 'var(--font-oswald)' }}>Concert Grands</h2>

// Or via Tailwind arbitrary value
<p className="font-[family-name:var(--font-oswald)]">Artists</p>
```

**CSS variable**: `--font-oswald`
**Loaded in**: `src/app/layout.tsx` as a Next.js font with `variable: '--font-oswald'`
**Character**: Condensed, bold, uppercase-friendly. Pairs authority with elegance.

**Oswald use cases:**
- Section eyebrows (`text-[10px] tracking-[0.45em] uppercase`)
- Navigation links (`text-[13px] font-semibold tracking-[0.06em] uppercase`)
- CTA buttons (`text-[12–13px] font-semibold tracking-[0.08–0.1em] uppercase`)
- Stat numbers and labels
- Card titles and dealer names
- Map badges and UI labels

### Secondary Font — Brand Luxury (Cormorant Garamond)

Use sparingly for editorial headings and pull quotes that need an Italian serif feel. Never use it for UI chrome or navigation.

```tsx
<h2 style={{ fontFamily: 'var(--font-brand-luxury)' }} className="font-light italic">
  Arrange a Private Audition
</h2>
```

**CSS variable**: `--font-brand-luxury`
**Use cases**: Section headlines with italic weight (`font-light italic`), success state copy, hero sub-headings that feel more intimate than a nav label.

### Body / UI Text — Brand Sans (Inter)

For body copy, form labels, descriptions, and any text that prioritizes readability over identity.

```tsx
<p style={{ fontFamily: 'var(--font-brand-sans)' }} className="text-white/40 text-sm leading-relaxed">
  Shigeru Kawai grand pianos are available by private appointment…
</p>
```

**CSS variable**: `--font-brand-sans`
**Use cases**: Body paragraphs, form inputs, fine print, email links, supporting copy under headings.

### Typography Scale

| Role | Size | Tracking | Weight | Font |
|------|------|----------|--------|------|
| Eyebrow | `10px` | `0.45em` | `400` | Oswald |
| Nav link | `13px` | `0.06em` | `600` | Oswald |
| CTA button | `12–13px` | `0.08–0.1em` | `600` | Oswald |
| Badge / label | `9–10px` | `0.2–0.35em` | `400` | Oswald |
| Section heading | `clamp(2rem, 4.5vw, 3.2rem)` | default | `300` italic | Brand Luxury |
| Hero heading | `clamp(2.6rem, 6vw, 5rem)` | `0.02em` | `700` | Oswald |
| Body copy | `13–14px` | default | `400` | Brand Sans |
| Fine print | `10–12px` | `0.15em` | `400` | Brand Sans |

**All nav and eyebrow text is `uppercase`.** Body copy is sentence case.

---

## Color Palette

### Core Colors

| Name | Value | Usage |
|------|-------|-------|
| `kawai-gold` | `#d5c78c` | Primary accent — borders, active states, CTAs, eyebrows |
| Page background | `#0a0a0a` | All section backgrounds |
| Hero background | `#060606` | Hero specifically (slightly deeper) |
| Card background | `#0e0e0e` | Card and surface backgrounds |
| `white` | `#ffffff` | Primary text (with opacity modifiers) |

### Gold Opacity Scale

Use `kawai-gold` with Tailwind opacity modifiers — never hardcode rgba values for gold:

| Class | Use case |
|-------|----------|
| `text-kawai-gold` | Active states, primary CTA text |
| `text-kawai-gold/70` | Eyebrow labels, location text in cards |
| `text-kawai-gold/65` | Popup website links |
| `text-kawai-gold/60` | "Featured" badge text |
| `text-kawai-gold/50` | Secondary links (email, website) at rest |
| `border-kawai-gold/40` | CTA button borders at rest |
| `border-kawai-gold/30` | Subtle borders (header pill, CTA secondary) |
| `border-kawai-gold/25` | Featured card border at rest |
| `border-kawai-gold/20` | Dividers, decorative rules, vertical separators |
| `bg-kawai-gold/10` | Active tab fill, CTA hover fill |
| `bg-kawai-gold/[0.04–0.06]` | Subtle hover fills |

### White Opacity Scale

| Class | Use case |
|-------|----------|
| `text-white` / `text-white/90` | Primary text, active nav |
| `text-white/85` | Nav hover state |
| `text-white/60` | Mobile nav items at rest |
| `text-white/55` | Desktop nav links at rest |
| `text-white/40` | Supporting body copy, phone numbers |
| `text-white/35` | Descriptions, supporting copy |
| `text-white/25–30` | Labels, fine print |
| `text-white/20` | Very subdued labels |
| `border-white/[0.05–0.08]` | Hairline structural borders |
| `border-white/15` | Form input bottom borders |

---

## Glassmorphism — Header Pill

The floating pill header uses a consistent glassmorphism style. Reference this when building any floating UI panel:

```typescript
const pillStyle: React.CSSProperties = {
  background: 'rgba(8, 8, 8, 0.72)',
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '56px',
  boxShadow: '0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)',
}
```

For dropdown panels (slightly less transparent, smaller radius):
```typescript
const dropdownStyle: React.CSSProperties = {
  background: 'rgba(8, 8, 8, 0.88)',
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)',
}
```

For popup cards (dark background, gold border):
```typescript
// ShigeruDealerMap popup inner card
background: 'rgba(10,10,10,0.97)'
border: '1px solid rgba(213,199,140,0.2)'
borderRadius: '10px'
```

For mobile overlay:
```typescript
background: 'rgba(6,6,6,0.97)'
backdropFilter: 'blur(32px)'
```

---

## Component Patterns

### CTA Buttons

**Primary (gold outlined, fill on hover):**
```tsx
<Link
  href="/shigeru/models"
  style={{ fontFamily: 'var(--font-oswald)', borderRadius: '4px' }}
  className="inline-flex items-center gap-3 bg-kawai-gold/[0.12] hover:bg-kawai-gold/[0.22] border border-kawai-gold/40 hover:border-kawai-gold/80 text-kawai-gold text-[13px] font-semibold tracking-[0.1em] uppercase px-8 py-3.5 transition-all duration-300"
>
  Explore the Collection
</Link>
```

**Secondary (white outlined):**
```tsx
<Link
  href="/shigeru/dealers"
  style={{ fontFamily: 'var(--font-oswald)', borderRadius: '4px' }}
  className="inline-flex items-center gap-3 border border-white/15 hover:border-white/35 text-white/55 hover:text-white/85 text-[13px] font-semibold tracking-[0.1em] uppercase px-8 py-3.5 transition-all duration-300"
>
  Find an Authorized Dealer
</Link>
```

**Pill (header / mobile bottom):**
```tsx
<Link
  href="/shigeru/contact"
  style={{ fontFamily: 'var(--font-oswald)', borderRadius: '999px' }}
  className="inline-flex items-center border border-kawai-gold/30 hover:border-kawai-gold/65 text-kawai-gold text-[12px] font-semibold tracking-[0.08em] uppercase px-5 py-2 transition-all duration-300 hover:bg-kawai-gold/[0.06]"
>
  Contact
</Link>
```

**Form submit (square, no border-radius):**
```tsx
<button
  className="inline-flex items-center gap-3 border border-kawai-gold/40 hover:border-kawai-gold text-kawai-gold hover:bg-kawai-gold/5 px-9 py-4 transition-all duration-300"
  style={{ fontFamily: 'var(--font-brand-sans)', fontSize: '0.625rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}
>
  Send Inquiry
</button>
```

### Eyebrow Labels

```tsx
<p
  className="text-kawai-gold/70 text-[10px] tracking-[0.45em] uppercase mb-6"
  style={{ fontFamily: 'var(--font-oswald)' }}
>
  Shigeru Kawai · North America
</p>
```

The CSS utility class `sk-eyebrow` from `shigeru.css` provides the font-size, tracking, transform, and line-height:
```tsx
<p className="sk-eyebrow text-kawai-gold mb-6" style={{ fontFamily: 'var(--font-oswald)' }}>
  Section Title
</p>
```

### Gold Divider / Rule

```tsx
<span className="sk-rule w-10" />         // Uses .sk-rule from shigeru.css
// or inline:
<span className="block h-px w-12 bg-kawai-gold/30" aria-hidden />
// Vertical version:
<span className="block w-px h-3 bg-kawai-gold/20" aria-hidden />
```

### Cards

```tsx
<div
  className={[
    'group relative bg-[#0e0e0e] border transition-colors duration-300 p-6 flex flex-col gap-4',
    isFeatured
      ? 'border-kawai-gold/25 hover:border-kawai-gold/55'
      : 'border-white/[0.06] hover:border-white/[0.14]',
  ].join(' ')}
>
  {/* Featured gold left accent */}
  {isFeatured && <span className="absolute left-0 top-4 bottom-4 w-px bg-kawai-gold/35" aria-hidden />}
</div>
```

Cards have **no border-radius** — sharp edges match the precision of instrument craftsmanship.

### Section Layout

Use the `sk-section` utility class from `shigeru.css` for vertical rhythm:
```tsx
<section className="bg-[#0a0a0a] sk-section">
  <div className="max-w-6xl mx-auto">
    {/* content */}
  </div>
</section>
```

Max widths:
- Standard sections: `max-w-6xl` (`72rem`)
- Wide sections: `max-w-screen-xl`
- Content text: `max-w-md` or `max-w-sm` for body copy columns

### Form Inputs

Minimalist bottom-border only, no box:
```tsx
<input
  className="bg-transparent border-b border-white/15 focus:border-kawai-gold text-white text-sm py-3 outline-none placeholder:text-white/20 transition-colors duration-300"
  style={{ fontFamily: 'var(--font-brand-sans)' }}
/>
```

---

## Animation

All motion uses **Framer Motion**. Import as `import { motion, AnimatePresence } from 'framer-motion'`.

### Standard Easing

```typescript
// Page/section reveals, dropdowns, overlays
ease: [0.25, 0.46, 0.45, 0.94]  // matches --ease-elegant CSS variable

// Duration reference:
// Fast UI (dropdown): 0.16–0.18s
// Medium (overlay fade): 0.22s
// Staggered items: 0.26s with delay: i * 0.05 + 0.05
```

### Dropdown (Resources menu)
```tsx
initial={{ opacity: 0, y: -8 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -8 }}
transition={{ duration: 0.16, ease: [0.25, 0.46, 0.45, 0.94] }}
```

### Mobile overlay
```tsx
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
```

### Staggered list items (mobile nav)
```tsx
initial={{ opacity: 0, x: -12 }}
animate={{ opacity: 1, x: 0 }}
transition={{ delay: i * 0.05 + 0.05, duration: 0.26, ease: [0.25, 0.46, 0.45, 0.94] }}
```

### Filter tab content swap
```tsx
// Always key the container by the active filter, wrap in AnimatePresence mode="wait"
<AnimatePresence mode="wait">
  <motion.div
    key={region}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.18, ease: 'easeInOut' }}
  >
    {items}
  </motion.div>
</AnimatePresence>
```

### Marker scale on select
```tsx
<div style={{ transform: isSelected ? 'scale(1.3)' : 'scale(1)', transition: 'transform 0.15s ease' }}>
```

---

## Map Styling

The dealer map uses **react-map-gl/maplibre** with OpenFreeMap positron tiles, CSS-inverted to dark.

```typescript
// Tile source — already in CSP connect-src
const MAP_STYLE = 'https://tiles.openfreemap.org/styles/positron'
```

The canvas is inverted to dark via the `.sk-map-dark` class in `shigeru.css`:
```css
.sk-map-dark .maplibregl-canvas {
  filter: invert(1) hue-rotate(180deg) saturate(0.5) brightness(0.82);
}
```

Always wrap the Map container with `className="sk-map-dark"`. DOM overlays (markers, popups) are unaffected by this filter.

**Gold pin SVG** (use for all map markers):
```tsx
function GoldPin({ active, featured }: { active?: boolean; featured?: boolean | null }) {
  const fill = active ? '#d5c78c' : featured ? 'rgba(213,199,140,0.8)' : 'rgba(213,199,140,0.5)'
  return (
    <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
      <path d="M11 0C4.925 0 0 4.925 0 11c0 7.333 11 17 11 17S22 18.333 22 11C22 4.925 17.075 0 11 0Z" fill={fill} />
      <circle cx="11" cy="11" r="4" fill="#0a0a0a" />
    </svg>
  )
}
```

---

## Logo

Use the R2-hosted webp. Always wrap in a `<Link href="/shigeru">`.

```tsx
<Image
  src="https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/Shigeru%20Kawai%20logo.webp"
  alt="Shigeru Kawai"
  width={0}
  height={0}
  sizes="180px"
  priority
  className="h-[44px] w-auto object-contain"
/>
```

`width={0} height={0}` with `w-auto` lets Next.js Image respect the natural aspect ratio. `sizes="180px"` prevents unnecessary large downloads.

---

## Background Overlays (Hero / Full-bleed Sections)

For full-bleed video or image sections, use these layered overlays:

```tsx
{/* Grounds content at the bottom */}
<div
  aria-hidden="true"
  className="absolute inset-0 pointer-events-none"
  style={{
    background: 'linear-gradient(to top, rgba(6,6,6,0.92) 0%, rgba(6,6,6,0.45) 35%, rgba(6,6,6,0.15) 60%, rgba(6,6,6,0.25) 100%)',
  }}
/>
{/* Vignette edges */}
<div
  aria-hidden="true"
  className="absolute inset-0 pointer-events-none"
  style={{
    background: 'radial-gradient(ellipse 110% 100% at 50% 50%, transparent 55%, rgba(6,6,6,0.65) 100%)',
  }}
/>
```

For atmospheric section glows (subtle top-of-section gold bloom):
```tsx
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-0"
  style={{
    background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(213,199,140,0.055) 0%, transparent 70%)',
  }}
/>
```

---

## CSS Utilities (`shigeru.css`)

Imported once in `src/app/(shigeru-website)/layout.tsx`. Don't put layout or spacing here — that belongs in Tailwind. These are only for patterns that repeat verbatim.

| Class | Purpose |
|-------|---------|
| `.sk-font` | Apply Oswald as font-family |
| `.sk-eyebrow` | Eyebrow label typography (10px, 0.45em tracking, uppercase, Oswald) |
| `.sk-rule` | Gold horizontal rule (1px, kawai-gold at 40% opacity) |
| `.sk-section` | Standard section padding (7rem top/bottom, responsive) |
| `.sk-scroll-hide` | Hide scrollbar cross-browser (carousels) |
| `.sk-map-dark` | Dark-invert the MapLibre canvas for the dealer map |

---

## Navigation Structure

```
/shigeru                  — Home
/shigeru/models           — Concert Grands
/shigeru/dealers          — Authorized Dealers
/shigeru/artists          — Artists          ┐
/shigeru/artisans         — Artisans          ├─ Resources dropdown
/shigeru/institutions     — Institutions     ┘
/shigeru/contact          — Contact (pill CTA, not a nav link)
```

---

## Dos and Don'ts

**Do:**
- Use `var(--font-oswald)` for all display text, nav, badges, and CTAs
- Use `kawai-gold` (never hardcode `#d5c78c` inline — use the Tailwind token)
- Keep backgrounds `#0a0a0a` for sections, `#0e0e0e` for cards/surfaces
- Use sharp edges (no `rounded-xl`) on cards and form elements
- Apply `uppercase` + wide tracking to all Oswald labels
- Use `transition-all duration-300` for hover state animations
- Use `aria-hidden="true"` on all decorative elements
- Use `sr-only` for SEO-rich content in video hero sections

**Don't:**
- Don't use `Inter` / `--font-brand-sans` for headings or CTAs — that's the main Kawai site
- Don't use rounded corners on dealer cards or section containers
- Don't use `kawai-red` anywhere on the Shigeru microsite — it belongs to the main brand
- Don't use `gray-*` Tailwind utilities — use `white/[opacity]` instead
- Don't hardcode hex values — use `kawai-gold` tokens and `white` with opacity
- Don't add gradients for decoration without a specific atmospheric purpose
- Don't use `font-bold` with Brand Luxury (Cormorant) — it looks wrong; use `font-light italic`
- Don't use `force-dynamic` on pages that can be statically cached (use `revalidate: 3600`)
