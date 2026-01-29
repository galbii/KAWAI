# Pages Collection - Quick Testing Checklist

**Quick reference for testing Pages collection blocks. See PAGES_TESTING_GUIDE.md for detailed instructions.**

---

## Pre-Flight Checklist

- [ ] Route handler created at `/src/app/(frontend)/pages/[slug]/page.tsx`
- [ ] RenderHero component created at `/src/components/RenderHero.tsx`
- [ ] Development server running (`bun run dev`)
- [ ] Admin accessible at http://localhost:3000/admin
- [ ] No TypeScript errors (`bun run lint`)

---

## Test Page Setup

Create page in Payload admin:

| Field | Value |
|-------|-------|
| Title | `Block System Test Page` |
| Slug | `test-blocks` |
| Category | General |
| Status | Published |

Access at: http://localhost:3000/pages/test-blocks

---

## Hero Variants (Page-Level)

- [ ] **Low Impact**: Simple hero, white background, no media required
- [ ] **Medium Impact**: 60vh hero, background image, dark overlay
- [ ] **High Impact**: 80vh hero, dramatic image, white text

---

## Content Blocks (5 blocks)

- [ ] **Text** (`content-text`): Rich text with alignment (left/center/right/justify)
- [ ] **Image** (`content-image`): Photo + caption + alt text + size (small/medium/large)
- [ ] **Video** (`content-video`): YouTube/Vimeo embed + title + description
- [ ] **Code** (`content-code`): Syntax highlighting + line numbers + language
- [ ] **Banner** (`content-banner`): Alert (info/warning/error/success) + title + CTA

---

## Layout Blocks (3 blocks)

- [ ] **Columns** (`layout-columns`): Multi-column (2-4 cols) + nested content + gap
- [ ] **Spacer** (`layout-spacer`): Vertical spacing (small/medium/large)
- [ ] **Divider** (`layout-divider`): Horizontal line (solid/dashed/dotted)

---

## Marketing Blocks (3 blocks)

- [ ] **Hero** (`marketing-hero`): Full-width hero + background media + CTAs + overlay
- [ ] **CTA** (`marketing-cta`): Call-to-action section + headline + button
- [ ] **Testimonials** (`marketing-testimonials`): Customer quotes + photos + names

---

## Product Blocks (5 blocks)

- [ ] **Showcase** (`product-showcase`): Product card + image + description
- [ ] **Hero** (`product-hero`): Product header + auto-data + background
- [ ] **Gallery** (`product-gallery`): Photo slider/grid
- [ ] **Features** (`product-features`): Feature list + icons
- [ ] **Specs** (`product-specs`): Technical specifications table

---

## Visual Inspection (All Devices)

### Desktop (1920x1080)
- [ ] All blocks render without errors
- [ ] Images sharp and optimized
- [ ] Text readable with good contrast
- [ ] Hover states work on buttons
- [ ] Spacing consistent between blocks

### Tablet (768px)
- [ ] Columns stack appropriately
- [ ] Hero heights scale down
- [ ] Text remains readable
- [ ] Buttons touch-friendly (44px min)

### Mobile (375px)
- [ ] All content stacks vertically
- [ ] No horizontal scrolling
- [ ] Images fit within viewport
- [ ] Text legible without zoom

---

## Console Verification

Expected logs:
```
✅ 🎨 [RenderBlocks] Starting render...
✅ 🎨 [RenderBlocks] Blocks received: X
✅ 🎨 [RenderBlocks] Block types: content-text, marketing-hero, ...
✅ 🎨 [RenderBlocks] ✅ Rendering [block-type] with component [ComponentName]
```

Red flags:
```
❌ [RenderBlocks] Unmapped block type
❌ [RenderBlocks] No component found
❌ TypeError: Cannot read property 'X' of undefined
```

---

## Network Tab Checks

- [ ] Page loads in < 3s (3G throttling)
- [ ] Images lazy-loaded (below fold)
- [ ] No 404 errors
- [ ] WebP format used (where supported)
- [ ] Total page weight < 2MB

---

## Accessibility Checks

- [ ] Images have alt text
- [ ] Headings follow hierarchy (H1 → H2 → H3)
- [ ] Links have descriptive text
- [ ] Buttons keyboard accessible
- [ ] Color contrast ratio ≥ 4.5:1

---

## Common Issues Quick Fix

| Symptom | Fix |
|---------|-----|
| Block not rendering | Check `RenderBlocks.tsx` mapping |
| Image broken | Verify depth: 2 in query |
| Columns don't stack | Add responsive classes |
| Hero media missing | Check `type` is highImpact/mediumImpact |
| TypeScript error | Run `bun run build` |
| Block won't save | Verify global registration in `payload.config.ts` |

---

## Performance Targets

### Lighthouse Scores
- [ ] Performance: 90+ (desktop), 70+ (mobile)
- [ ] Accessibility: 95+
- [ ] Best Practices: 95+
- [ ] SEO: 95+

### Page Weight
- [ ] Total: < 2MB
- [ ] JavaScript: < 500KB
- [ ] CSS: < 100KB
- [ ] Images: < 1MB

---

## Post-Testing Actions

- [ ] Create production test page (`piano-care` slug)
- [ ] Migrate existing content to Pages collection
- [ ] Update internal links
- [ ] Add SEO metadata (meta description, OG image)
- [ ] Set up analytics tracking
- [ ] Configure XML sitemap
- [ ] Test live preview functionality

---

## Block Count Summary

**Total: 17 block types**
- Content: 5
- Layout: 3
- Marketing: 3
- Product: 5
- Legacy: 1 (CTA)

---

## Quick Block Reference

| Need to add... | Use this block |
|----------------|----------------|
| Text paragraph | `content-text` |
| Photo with caption | `content-image` |
| YouTube video | `content-video` |
| Code snippet | `content-code` |
| Alert/notice | `content-banner` |
| Side-by-side content | `layout-columns` |
| Vertical space | `layout-spacer` |
| Section divider | `layout-divider` |
| Page header | `marketing-hero` |
| Button/CTA | `marketing-cta` |
| Customer quotes | `marketing-testimonials` |
| Product card | `product-showcase` |
| Product header | `product-hero` |
| Photo gallery | `product-gallery` |
| Feature list | `product-features` |
| Tech specs | `product-specs` |

---

## Next Steps

1. ✅ Create test page with all blocks
2. ✅ Verify each block renders correctly
3. ✅ Test on all device sizes
4. ✅ Run Lighthouse audit
5. ✅ Fix any issues found
6. ✅ Create production content
7. ✅ Deploy and monitor

---

**For detailed instructions, see**: `docs/PAGES_TESTING_GUIDE.md`
