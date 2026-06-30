# About / Company Umbrella — Brand Redesign Spec

**Date:** 2026-06-30
**Owner:** Engineering (PM-driven)
**Goal:** Redesign the "about umbrella" pages to look brand- and company-representative, matching the design language of `/about` and the already-redesigned `/company/koichi-kawai`. **Information is preserved verbatim** — only design, presentation, and SEO change.

---

## Scope

Seven pages (koichi-kawai already redesigned, excluded):

1. `/technology` — **flagship** (built first, locks the pattern)
2. `/company`
3. `/company/our-philosophy`
4. `/company/awards`
5. `/the-winners-choice`
6. `/distinguished-owners`
7. `/institutions/epic-program`

**Out of scope:** `/about` itself, the Shigeru microsite (`/shigeru/about`), the CMS page `/instrumental-to-life`, and all child/subtopic pages (technology subtopics, other `/institutions/*`). These may become a phase 2.

---

## Decisions (locked in chat)

| Decision | Choice |
|---|---|
| Design intensity | **Brand system, unique per page** — compose each page from the shared brand kit; server-rendered, SEO-strong. NOT the `/about` scroll-jacking machinery. |
| Rollout | **Flagship first** (`/technology`), review, then batch the other 6. |
| Hero imagery | **Reuse existing R2 / site assets** — no new photography required. |
| Overriding constraint | **Developable and maintainable** — shared kit over bespoke sprawl; consistent structure; copy in data files. |

---

## Design DNA (every page inherits)

- **Cinematic dark foundation** — `kawai-black` canvas; full-bleed image hero with gradient scrim; light-weight serif display headline (`var(--font-brand-serif)`, clamp sizing); gold/red eyebrow hairline.
- **Tonal rhythm** — sections alternate `black ↔ pearl ↔ white` via `Section`, so each page reads like an editorial spread.
- **Motion as progressive enhancement** — `Reveal` (fade + rise on scroll-in), respects `prefers-reduced-motion`. The page is **server-rendered semantic HTML** with real, crawlable text — this is the key difference from `/about` (which hides its content in `sr-only`).
- **Strict brand palette** — `kawai-red` = accent/CTA; `kawai-gold` = premium/Shigeru; `kawai-pearl`/`white` = light sections; `kawai-black` = dark. No off-brand gray/yellow (current `/technology` violates this).
- **Semantics** — exactly one `<h1>` (the hero); ordered `<h2>`/`<h3>`; descriptive `alt`.

### The kit of parts (`@/components/brand`)

`BrandHero`, `Section`, `StatStrip`, `BrandTimeline`, `BrandEyebrow`, `BrandCTA`, `BrandArrowLink`, `Reveal`. Already built and exported from `src/components/brand/index.ts`. Pages compose these; bespoke pieces only when content genuinely needs them.

---

## SEO standard (every page gets all of it)

Matching the koichi-kawai bar:

1. `generateMetadata()` — title, description, `keywords`, `alternates.canonical`, and **`alternates.languages = getSiteAlternates(path)`** (hreflang; several pages are missing this today).
2. OpenGraph + Twitter card (`summary_large_image`).
3. **schema.org JSON-LD** appropriate to the page (`Organization` / `ItemList` / `Article` / `Service`) **+ a `BreadcrumbList`** on every page.
4. `export const revalidate = 3600` (ISR), consistent with the rest of `(frontend)/`.

---

## Maintainability architecture

**Consistent per-page structure** so any developer can pick up any page:

```
src/app/(frontend)/<page>/
  page.tsx        ← server component: generateMetadata, JSON-LD, composition only
  _data.ts        ← page copy/content arrays (verbatim) + SEO constants (title, desc, keywords)
  _components/     ← ONLY bespoke pieces not covered by @/components/brand
```

**Shared helpers (new, added once, used by all 7)** — avoids duplicating boilerplate:

- `src/components/brand/JsonLd.tsx` — `<JsonLd data={...} />` renders the `application/ld+json` script tag.
- `src/lib/brand/seo.ts` — `buildBreadcrumb(siteUrl, trail)` returns a `BreadcrumbList` object; small `pageMetadata()` helper to assemble the common metadata shape (canonical + hreflang + OG + Twitter) from per-page constants.
- `src/components/brand/images.ts` (or `src/lib/brand/images.ts`) — central `R2` base + registry of reused assets (soundboard, pianist, room, concert grand), so URLs aren't copy-pasted across pages. Existing assets, from `about/_components/images.ts`:
  - `soundboard: ${R2}/1024-685-max.jpg`
  - `warmPianist: ${R2}/250829_0113-1.webp`
  - `luxeRoom: ${R2}/MS130_RGB_image_04.webp`
  - `upright: ${R2}/1024-683-madx.webp`
  - `collectionsBg: ${R2}/MP7SE_location_red.webp`
  - (R2 base: `https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media`)

**Rules:** no new one-off UI primitives when a brand component fits; no inline content arrays in `page.tsx` (move to `_data.ts`); keep `page.tsx` to composition + metadata so it stays readable.

---

## Per-page concepts (copy preserved verbatim)

### 1. `/technology` — flagship — "Engineered by Science"
- **Current state:** worst offender — gray/yellow palette, lucide icons, generic gradients, **no metadata at all**.
- **Hero:** `BrandHero`, image `soundboard` (action/soundboard macro), eyebrow "Innovation", serif headline, CTAs to `#technologies` / `/pianos`.
- **Body:** the 6 technologies as alternating full-width feature blocks (`Section` tone alternating black/pearl; image or YouTube embed one side, copy + elegant two-column Features/Benefits lists the other). Keep the Millennium III YouTube embed. "Learn more" → existing `detailPath`.
- **Proven by Science:** the 3 research highlights as a dark stat-backed band (StatStrip-style figures: "10×", "61+", "Decades").
- **Coda:** innovation-philosophy + CTA band.
- **SEO:** add full metadata + hreflang + `ItemList` (technologies) + `BreadcrumbList` JSON-LD.

### 2. `/company` — "Crafting Inspiration Since 1927"
- Hero (`warmPianist` or `luxeRoom`) → narrative `Section` → `StatStrip` (1927 / 2.4M+ / 50+ / Worldwide) → divisions reimagined as editorial chapter cards (imagery + hover) → CTA. `Organization` + `BreadcrumbList` JSON-LD.

### 3. `/company/our-philosophy` — editorial manifesto
- Hero → large pull-quote ("Crafting Inspiration") → 4 core beliefs as numbered editorial rows (01–04, alternating) → properly framed video (real embed when available, branded placeholder otherwise) → "A Living Philosophy" coda → CTA. `Article`/`AboutPage` + `BreadcrumbList`.

### 4. `/company/awards` — "An Award-Winning History"
- Hero → `StatStrip` (50+ Awards / 25+ Years) → awards-by-year as a refined vertical `BrandTimeline` (year markers down a rail, award cards reveal per year) → CTA. `ItemList` + `BreadcrumbList`.

### 5. `/the-winners-choice` — competition prestige
- Hero (concert grand) → narrative → 15 competitions as a **gold-accented honor roll** (prestige treatment, prize per row) → CTA to Shigeru concert grand. `ItemList` + `BreadcrumbList`.

### 6. `/distinguished-owners` — "A Global Community of Excellence"
- Hero → `StatStrip` (2.4M+ pianos, etc.) → the long name lists restyled as prestigious multi-column directories with category eyebrows + hairline dividers → International Presence on dark → CTA. `BreadcrumbList` (+ optional `ItemList`).

### 7. `/institutions/epic-program` — elite institutional (Shigeru **gold** palette)
- Hero → about narrative → 3 benefits as refined cards → current partners grid → eligibility + contact CTA band (keep tel + financial-assistance link). Gold-leaning accents to signal Shigeru elite. `Service`/`Offer` + `BreadcrumbList`.

---

## Acceptance criteria (per page)

- [ ] All existing copy present and unchanged (data arrays preserved).
- [ ] Composed from `@/components/brand`; bespoke code only where justified.
- [ ] On-brand palette only (no gray/yellow); dark↔light tonal rhythm.
- [ ] One `<h1>`, ordered headings, descriptive `alt`, crawlable text (no content hidden in `sr-only`).
- [ ] Full `generateMetadata` incl. canonical + hreflang; OG + Twitter; JSON-LD incl. `BreadcrumbList`.
- [ ] `export const revalidate = 3600`.
- [ ] `bun run lint` clean (ESLint + TypeScript, strict).
- [ ] Page copy/content arrays live in `_data.ts`; `page.tsx` is composition + metadata.

## Process

Flagship `/technology` → user reviews live page → batch the remaining 6 to match. Per the project's less-ceremony preference, no intermediate spec-review gates; review happens on the flagship and on the finished batch.
