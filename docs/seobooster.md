# SEO Booster — Research Landing Pages

## Overview

Five research-focused landing pages have been created to capture informational search traffic and funnel visitors into the product catalog. These pages are positioned under their parent category in the URL hierarchy to build topical authority.

The core strategy is a hub-and-spoke model:

```
/pianos/digital  (hub)
  ├── /pianos/digital/es-series   (spoke — captures ES research queries)
  └── /pianos/digital/ca-series   (spoke — captures CA research queries)

/pianos/grand    (hub)
  ├── /pianos/grand/gl-series         (spoke — captures entry grand queries)
  ├── /pianos/grand/gx-series         (spoke — captures professional grand queries)
  └── /pianos/grand/shigeru-kawai     (spoke — captures concert grand queries)
```

**Why this structure works:**
- URL hierarchy signals topic relevance to search engines (pianos → digital → es-series)
- Internal PageRank flows from the high-authority category pages down to the research pages
- The category pages (`/pianos/digital`, `/pianos/grand`) can link to these spokes, closing the internal link loop
- Research queries are separated from transactional queries — visitors in "research mode" land here, visitors ready to browse land on the category pages

---

## Funnel Logic

Each page follows the same funnel pattern:

```
Search query (informational intent)
  → Research landing page (educates, answers questions)
    → "Browse All [Digital/Grand] Pianos" CTA
      → Category page (/pianos/digital or /pianos/grand)
        → Product page (/products/[slug])
          → Find a Dealer / Contact
```

The research pages do not try to close a sale. They build trust and answer the question — then hand the visitor off to the category page when they are ready to compare models.

---

## Page 1: ES Portable Series

**URL:** `/pianos/digital/es-series`
**Funnel destination:** `/pianos/digital`

### Search Terms Targeted

| Intent | Queries |
|--------|---------|
| Branded research | kawai ES series, kawai ES920 review, kawai ES520 review |
| Category research | best portable digital piano, portable piano with weighted keys |
| Comparison | kawai ES920 vs yamaha P-125, kawai portable piano review |
| Long-tail FAQ | does kawai ES920 have weighted keys, kawai ES series for live performance, kawai ES520 beginners |

### Content Strategy

The ES Series page targets musicians who are comparing portable digital pianos and want to understand what makes Kawai different before committing. The page explains Responsive Hammer Compact action (the key differentiator), stage connectivity, and who the instrument is best suited for.

**FAQ schema targets:**
- "Does the Kawai ES Series have weighted keys?" — high-volume, captures comparison shoppers
- "What is the difference between ES520 and ES920?" — captures model-specific research
- "Can I use the Kawai ES Series for live performance?" — captures gigging musician segment
- "Is the ES Series suitable for beginners?" — captures parent/beginner searches
- "Does the Kawai ES920 have built-in speakers?" — captures practical spec queries

### Funnel Notes

The ES page positions the series as a specialist instrument — great for gigging and portability, but steers beginners toward KDP. This prevents low-intent visits from clogging dealer inquiries and improves conversion quality on the main digital catalog.

---

## Page 2: CA Concert Artist Series

**URL:** `/pianos/digital/ca-series`
**Funnel destination:** `/pianos/digital`

### Search Terms Targeted

| Intent | Queries |
|--------|---------|
| Branded research | kawai CA series, kawai concert artist, kawai CA901 review, kawai CA401 review |
| Category research | wooden key digital piano, best digital piano with wooden keys, grand feel action |
| Comparison | kawai CA vs roland HP, kawai CA series vs yamaha CSP |
| Long-tail FAQ | what is grand feel action, kawai CA series worth it, CA401 vs CA701 difference |

### Content Strategy

The CA page targets serious players — typically those coming from an acoustic background or advanced students — who are researching the best digital piano for classical practice. The page leads with Grand Feel wooden key action as the defining differentiator, then explains SK-EX sampling and resonance modeling as secondary reasons to choose the CA over lower series.

**FAQ schema targets:**
- "What is Grand Feel wooden key action?" — defines the core differentiator for uninitiated searches
- "Is the CA Series worth upgrading to from the CN Series?" — captures existing Kawai customers considering an upgrade
- "What is the difference between CA401, CA701, and CA901?" — high-intent model comparison query
- "Can I practice silently with the CA Series?" — captures apartment/late-night practice segment
- "Does the CA Series accurately replicate acoustic grand piano sound?" — handles skeptical researcher

### Funnel Notes

The CA page filters for high-intent visitors. Anyone who reads this page in full and clicks through to the catalog is likely a serious buyer. The page explicitly differentiates CA from CN (without recommending CN) to avoid cannibalizing the upper range.

---

## Page 3: GL Grand Series

**URL:** `/pianos/grand/gl-series`
**Funnel destination:** `/pianos/grand`

### Search Terms Targeted

| Intent | Queries |
|--------|---------|
| Branded research | kawai GL series, kawai GL-10 review, kawai GL-30 review, kawai grand piano price |
| Category research | entry level grand piano, first grand piano, affordable acoustic grand piano |
| Size/spec research | kawai grand piano sizes, 5 foot grand piano, salon grand piano |
| Long-tail FAQ | kawai GL-10 vs GL-50, is kawai GL series good for home, kawai GL series professional |

### Content Strategy

The GL page targets first-time grand piano buyers and upgraders from digital or upright instruments. The key educational job is explaining *why a grand piano is different* from an upright — longer keys, gravity return action, horizontal stringing — before presenting the GL Series as the accessible entry point to that experience.

The page positions GL as entry-level honestly, pointing serious players toward GX BLAK in the lineup section. This prevents post-purchase disappointment and builds brand trust.

**FAQ schema targets:**
- "What sizes does the Kawai GL Series come in?" — captures size research queries
- "Is the GL Series a good choice for home use?" — captures practical homeowner segment
- "What is the difference between the GL-10 and GL-50?" — most common model comparison
- "Is the GL Series suitable for advanced or professional players?" — sets honest expectations
- "How does the GL Series compare to Kawai's professional grands?" — captures upgrade consideration queries

### Funnel Notes

GL visitors are often in early research — they may not have decided between upright, digital, or grand yet. The educational "why a grand piano" content serves double duty: it answers their question and reinforces the value of the acoustic grand format, moving them further down the consideration funnel.

---

## Page 4: GX BLAK Series

**URL:** `/pianos/grand/gx-series`
**Funnel destination:** `/pianos/grand`

### Search Terms Targeted

| Intent | Queries |
|--------|---------|
| Branded research | kawai GX BLAK, kawai GX BLAK series review, kawai GX-2 review, kawai GX-5 review |
| Category research | professional acoustic grand piano, millennium III action piano, ABS carbon piano action |
| Comparison | kawai GX vs yamaha C series, kawai GX BLAK vs steinway, kawai GX BLAK vs GL series |
| Long-tail FAQ | what is millennium III action, kawai GX BLAK sizes, kawai GX BLAK professional use |

### Content Strategy

The GX page targets serious pianists and institutions who already understand acoustic grands and are comparing professional-tier instruments. The page leads with Millennium III ABS-Carbon action — explaining both what it is and why it matters (climate stability, consistent touch) in practical terms.

The tone is more technical than the GL page. These visitors are further down the funnel and want specifics, not an introduction to grand pianos.

**FAQ schema targets:**
- "What is Millennium III ABS-Carbon action?" — core differentiator, high specificity search
- "What is the difference between GL and GX BLAK?" — in-range comparison, high conversion intent
- "What sizes does the GX BLAK Series come in?" — practical spec research
- "Is the GX BLAK suitable for professional concert use?" — institutional buyer segment
- "Why is ABS-Carbon used instead of wood for action parts?" — technically curious buyer, high engagement

### Funnel Notes

GX visitors are typically comparing 2–3 instruments across brands. The page does not claim superiority over competitors — it explains the Millennium III advantage factually and lets the visitor draw their own conclusion. This approach performs better for trust-based purchase decisions at this price point.

---

## Page 5: Shigeru Kawai

**URL:** `/pianos/grand/shigeru-kawai`
**Funnel destinations:** `/find-a-dealer` (primary), `/pianos/grand` (secondary)

### Search Terms Targeted

| Intent | Queries |
|--------|---------|
| Branded research | shigeru kawai, shigeru kawai review, shigeru kawai SK-EX, shigeru kawai piano |
| Provenance/story | japanese handcrafted piano, kawai ryuyo factory, individually voiced piano |
| Pricing research | shigeru kawai price, shigeru kawai cost, how much is a shigeru kawai piano |
| Comparison | shigeru kawai vs steinway, kawai concert grand piano |
| Long-tail FAQ | where are shigeru kawai made, shigeru kawai SK-EX competition, how to buy shigeru kawai |

### Content Strategy

The Shigeru Kawai page targets a narrower audience: concert pianists, serious collectors, and music institutions researching at the top of the market. The page leads with craft and provenance — Ryuyo factory, individual voicing, Tchaikovsky Competition — rather than specifications.

Pricing is intentionally withheld ("available by private appointment"), which is accurate and appropriate for instruments at this level. The FAQ answers the pricing question by explaining the private appointment process rather than deflecting.

**FAQ schema targets:**
- "Where are Shigeru Kawai pianos made?" — provenance research, high-trust builder
- "What is the Shigeru Kawai SK-EX?" — flagship model query
- "What is the difference between SK-3, SK-5, SK-6, and SK-EX?" — model comparison
- "What competitions feature the Shigeru Kawai piano?" — credibility/legitimacy query
- "How do I purchase a Shigeru Kawai piano?" — highest-intent query on the page

### Funnel Notes

The Shigeru Kawai funnel terminates at dealer contact, not at a product page. The purchase process for instruments at this level is inherently consultative — the page's job is to answer enough questions to prompt a dealer inquiry, not to substitute for one.

---

## Technical SEO Implementation

### Schema Markup

Each page uses `FAQPage` schema in the JSON-LD `@graph`, making all five pages eligible for Google's FAQ rich results. This typically increases CTR from search results by 20–30% for matching queries.

```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "...",
      "acceptedAnswer": { "@type": "Answer", "text": "..." }
    }
  ]
}
```

### Canonical URLs

Each page declares its own canonical URL matching the new path structure, preventing any duplicate content issues with the old `/pianos/[series]` paths.

### Caching

All pages use `export const revalidate = 3600` — ISR with a 1-hour TTL. Content is statically generated at build time and revalidated hourly, giving fast page loads without stale content risk.

### Old URLs

The old paths (`/pianos/es-series`, `/pianos/ca-series`, etc.) are now handled by the dynamic `[category]` route and serve as collection pages showing products from that series. This means the old URLs remain live and useful rather than returning 404s.

---

## Recommended Next Steps

1. **Add internal links from category pages** — `/pianos/digital` and `/pianos/grand` should link to these research pages. This closes the hub-and-spoke loop and passes PageRank down to the research pages.

2. **Submit updated sitemap** — Ensure the new URLs are included in `src/app/sitemap.ts` so they are indexed promptly.

3. **Monitor FAQ rich result eligibility** — Use Google Search Console to check whether the FAQPage schema is being picked up. Rich results typically appear within 2–4 weeks of indexing.

4. **Track research-to-category conversion** — Set up a PostHog funnel from each research page to the corresponding category page to measure how effectively the CTAs are converting research visitors into browsers.
