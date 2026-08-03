import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload/queries'
import { getSite, getSiteUrl, getSiteAlternates, type Site } from '@/lib/site-context'
import { SHIGERU_MODELS } from '@/app/(shigeru-website)/shigeru/_data/models'

// Regenerate every hour so CMS changes (new blog posts, artists, dealers) appear quickly
export const revalidate = 3600

type SitemapEntry = MetadataRoute.Sitemap[number]

interface AddOptions {
  changeFrequency?: SitemapEntry['changeFrequency']
  priority?: number
  lastModified?: Date
  /**
   * `true` = skip this URL on the CA sitemap and do NOT emit en-CA hreflang.
   * Use for routes that are functionally US-only (US dealers, US showrooms,
   * US-only campaigns, NAMM, careers, etc.). On the US sitemap a US-only URL
   * is still listed, but without an `en-CA` alternate.
   */
  usOnly?: boolean
}

/**
 * Build a sitemap URL entry with consistent hreflang handling.
 *
 * - Bilingual paths automatically get `<xhtml:link rel="alternate" hreflang="...">`
 *   pointing at the en-US, en-CA, and x-default variants via `getSiteAlternates`.
 * - US-only paths are dropped entirely from the CA sitemap and emit no en-CA
 *   alternate on the US sitemap (sending Google to a non-existent CA URL would
 *   create misleading hreflang signals).
 */
function pushUrl(
  out: MetadataRoute.Sitemap,
  site: Site,
  path: string,
  options: AddOptions = {},
): void {
  if (options.usOnly && site === 'cad') return

  const entry: SitemapEntry = { url: `${getSiteUrl(site)}${path}` }
  if (options.changeFrequency !== undefined) entry.changeFrequency = options.changeFrequency
  if (options.priority !== undefined) entry.priority = options.priority
  if (options.lastModified !== undefined) entry.lastModified = options.lastModified
  if (!options.usOnly) {
    entry.alternates = { languages: getSiteAlternates(path) }
  }

  out.push(entry)
}

/** Fetch the set of active CMS redirect source paths so they can be excluded from the sitemap. */
async function getRedirectSourcePaths(): Promise<Set<string>> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'redirects',
      where: { isActive: { equals: true } },
      limit: 1000,
      select: { from: true },
      depth: 0,
    })
    return new Set(result.docs.map((r: any) => r.from as string))
  } catch {
    return new Set()
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const site = await getSite()
    const payload = await getPayloadClient()
    const sitemap: MetadataRoute.Sitemap = []
    const add = (path: string, opts?: AddOptions) => pushUrl(sitemap, site, path, opts)

    // Fetch active redirect sources upfront — these URLs must not appear in the sitemap
    const redirectSources = await getRedirectSourcePaths()

    // ==========================================
    // STATIC ROUTES — Core / High Priority
    // ==========================================

    add('/', { changeFrequency: 'daily', priority: 1.0 })
    add('/pianos', { changeFrequency: 'daily', priority: 0.9 })
    add('/find-my-piano', { changeFrequency: 'weekly', priority: 0.9, usOnly: true })
    add('/piano-finder', { changeFrequency: 'weekly', priority: 0.9, usOnly: true })

    // ==========================================
    // STATIC ROUTES — Piano Categories
    // ==========================================

    add('/pianos/digital', { changeFrequency: 'weekly', priority: 0.85 })
    add('/pianos/grand', { changeFrequency: 'weekly', priority: 0.85 })
    add('/pianos/upright', { changeFrequency: 'weekly', priority: 0.85 })
    add('/pianos/hybrid', { changeFrequency: 'weekly', priority: 0.85 })
    add('/pianos/shigeru-kawai', { changeFrequency: 'weekly', priority: 0.9 })
    add('/pianos/shigeru-kawai/sk-ex', { changeFrequency: 'monthly', priority: 0.75 })
    add('/pianos/digital/ca901', { changeFrequency: 'monthly', priority: 0.7 })
    // SEO research landing pages — capture informational queries, funnel to category pages
    add('/pianos/digital/es-series', { changeFrequency: 'monthly', priority: 0.8 })
    add('/pianos/digital/ca-series', { changeFrequency: 'monthly', priority: 0.8 })
    add('/pianos/grand/gl-series', { changeFrequency: 'monthly', priority: 0.8 })
    add('/pianos/grand/gx-series', { changeFrequency: 'monthly', priority: 0.8 })
    add('/pianos/grand/shigeru-kawai', { changeFrequency: 'monthly', priority: 0.85 })
    // /pianos/search and /pianos/compare are noindexed utility pages — excluded from sitemap
    add('/accessories', { changeFrequency: 'weekly', priority: 0.65 })

    // ==========================================
    // STATIC ROUTES — Shigeru Kawai sub-site
    // ==========================================

    add('/shigeru', { changeFrequency: 'weekly', priority: 0.9 })
    add('/shigeru/models', { changeFrequency: 'weekly', priority: 0.85 })
    for (const model of SHIGERU_MODELS) {
      add(`/shigeru/models/${model.slug}`, { changeFrequency: 'monthly', priority: 0.8 })
    }
    add('/shigeru/about', { changeFrequency: 'monthly', priority: 0.65 })
    add('/shigeru/artisans', { changeFrequency: 'monthly', priority: 0.6 })
    add('/shigeru/artists', { changeFrequency: 'monthly', priority: 0.65 })
    add('/shigeru/technology', { changeFrequency: 'monthly', priority: 0.65 })
    add('/shigeru/institutions', { changeFrequency: 'monthly', priority: 0.6 })
    add('/shigeru/dealers', { changeFrequency: 'weekly', priority: 0.7 })
    add('/shigeru/contact', { changeFrequency: 'yearly', priority: 0.5 })

    // ==========================================
    // STATIC ROUTES — Product / Marketing
    // ==========================================

    add('/concert-artist', { changeFrequency: 'monthly', priority: 0.8, usOnly: true })
    add('/concert-artist-ca', { changeFrequency: 'monthly', priority: 0.7, usOnly: true })
    add('/the-winners-choice', { changeFrequency: 'monthly', priority: 0.7, usOnly: true })
    add('/distinguished-owners', { changeFrequency: 'monthly', priority: 0.65, usOnly: true })

    // ==========================================
    // STATIC ROUTES — Content / SEO
    // ==========================================

    add('/blog', { changeFrequency: 'daily', priority: 0.8 })
    add('/artists', { changeFrequency: 'weekly', priority: 0.75 })
    add('/guides', { changeFrequency: 'weekly', priority: 0.7 })
    add('/glossary', { changeFrequency: 'monthly', priority: 0.55 })
    add('/news', { changeFrequency: 'daily', priority: 0.7 })

    // ==========================================
    // STATIC ROUTES — Technology Sub-Pages
    // ==========================================

    add('/technology', { changeFrequency: 'monthly', priority: 0.7 })
    add('/technology/carbon-fiber-technology', { changeFrequency: 'monthly', priority: 0.65 })
    add('/technology/sound-technology', { changeFrequency: 'monthly', priority: 0.65 })
    add('/technology/wooden-key-actions', { changeFrequency: 'monthly', priority: 0.65 })
    add('/technology/piano-action', { changeFrequency: 'monthly', priority: 0.65 })
    add('/technology/soundboard-speaker-system', { changeFrequency: 'monthly', priority: 0.65 })
    add('/technology/abs', { changeFrequency: 'monthly', priority: 0.6 })

    // ==========================================
    // STATIC ROUTES — Company
    // ==========================================

    add('/company', { changeFrequency: 'monthly', priority: 0.65 })
    add('/company/awards', { changeFrequency: 'monthly', priority: 0.6 })
    add('/company/our-philosophy', { changeFrequency: 'monthly', priority: 0.6 })
    add('/about', { changeFrequency: 'monthly', priority: 0.7 })
    add('/about/heritage', { changeFrequency: 'monthly', priority: 0.7 })
    add('/about/heritage/koichi-kawai', { changeFrequency: 'monthly', priority: 0.65 })
    add('/about/heritage/shigeru-kawai', { changeFrequency: 'monthly', priority: 0.6 })
    add('/about/heritage/hirotaka-kawai', { changeFrequency: 'monthly', priority: 0.6 })
    add('/about/heritage/kentaro-kawai', { changeFrequency: 'monthly', priority: 0.6 })
    add('/about/craftsmanship', { changeFrequency: 'monthly', priority: 0.7 })

    // ==========================================
    // STATIC ROUTES — Institutions
    // ==========================================

    add('/institutions/epic-program', { changeFrequency: 'monthly', priority: 0.65 })
    add('/institutions/testimonial-videos', { changeFrequency: 'monthly', priority: 0.6 })
    add('/institutions/financial-assistance', { changeFrequency: 'monthly', priority: 0.65 })
    add('/institutions/institutional-fleet', { changeFrequency: 'monthly', priority: 0.6 })
    add('/institutions/loan-programs', { changeFrequency: 'monthly', priority: 0.65 })

    // ==========================================
    // STATIC ROUTES — Dealer / Location Discovery (US-only)
    // ==========================================

    add('/find-a-dealer', { changeFrequency: 'weekly', priority: 0.8, usOnly: true })
    add('/showroom', { changeFrequency: 'monthly', priority: 0.7, usOnly: true })

    // ==========================================
    // STATIC ROUTES — Utility
    // ==========================================

    add('/warranty-registration', { changeFrequency: 'yearly', priority: 0.5, usOnly: true })
    add('/warranty', { changeFrequency: 'monthly', priority: 0.7 })
    add('/warranty/digital', { changeFrequency: 'monthly', priority: 0.7 })
    add('/warranty/acoustic', { changeFrequency: 'monthly', priority: 0.7 })
    add('/faq', { changeFrequency: 'monthly', priority: 0.6 })
    add('/careers', { changeFrequency: 'weekly', priority: 0.6, usOnly: true })
    add('/technical-support-division', { changeFrequency: 'monthly', priority: 0.55, usOnly: true })
    add('/digital-piano-rebate', { changeFrequency: 'monthly', priority: 0.65, usOnly: true })
    add('/privacy', { changeFrequency: 'yearly', priority: 0.3 })
    add('/return-policy', { changeFrequency: 'yearly', priority: 0.3 })
    add('/accessibility', { changeFrequency: 'yearly', priority: 0.3 })

    // ==========================================
    // STATIC ROUTES — NAMM 2026 Event Pages (US-only — NAMM is a US trade show)
    // ==========================================

    add('/namm-2026', { changeFrequency: 'daily', priority: 0.9, usOnly: true })
    add('/namm-2026/dealer', { changeFrequency: 'weekly', priority: 0.7, usOnly: true })
    add('/namm-2026/artists', { changeFrequency: 'weekly', priority: 0.7, usOnly: true })
    add('/namm-2026/experience', { changeFrequency: 'weekly', priority: 0.7, usOnly: true })

    // ==========================================
    // DYNAMIC — FAQ Pages (from CMS)
    // ==========================================

    try {
      const faqsResult = await payload.find({
        collection: 'faqs',
        where: { status: { equals: 'published' } },
        limit: 1000,
        select: { slug: true, updatedAt: true },
        depth: 0,
      })

      for (const f of faqsResult.docs as Array<{ slug?: string; updatedAt: string }>) {
        if (!f.slug) continue
        add(`/faq/${f.slug}`, {
          changeFrequency: 'monthly',
          priority: 0.55,
          lastModified: new Date(f.updatedAt),
        })
      }
      console.log(`✅ Sitemap: ${faqsResult.docs.length} FAQ pages`)
    } catch (err) {
      console.error('❌ Sitemap: faqs fetch failed', err)
    }

    // ==========================================
    // DYNAMIC — Products (from CMS) — bilingual (CA gets CAD pricing on same slugs)
    // ==========================================

    try {
      const productsResult = await payload.find({
        collection: 'products',
        where: { status: { equals: 'active' } },
        limit: 1000,
        select: { slug: true, updatedAt: true, featured: true, shopify: true },
        depth: 0,
      })

      for (const p of productsResult.docs as Array<{
        slug?: string
        updatedAt: string
        featured?: boolean
        shopify?: { shopifyStatus?: string }
      }>) {
        if (!p.slug) continue
        if (p.shopify?.shopifyStatus === 'UNLISTED') continue
        add(`/products/${p.slug}`, {
          changeFrequency: 'weekly',
          priority: p.featured ? 0.9 : 0.7,
          lastModified: new Date(p.updatedAt),
        })
      }
      console.log(`✅ Sitemap: ${productsResult.docs.length} products`)
    } catch (err) {
      console.error('❌ Sitemap: products fetch failed', err)
    }

    // ==========================================
    // DYNAMIC — Blog Posts (from CMS)
    // ==========================================

    try {
      const postsResult = await payload.find({
        collection: 'posts',
        where: { status: { equals: 'published' } },
        limit: 1000,
        select: { slug: true, updatedAt: true, publishedDate: true },
        depth: 0,
      })

      for (const p of postsResult.docs as Array<{ slug?: string; updatedAt: string; publishedDate?: string }>) {
        if (!p.slug) continue
        add(`/blog/${p.slug}`, {
          changeFrequency: 'monthly',
          priority: 0.65,
          lastModified: new Date(p.publishedDate ?? p.updatedAt),
        })
      }
      console.log(`✅ Sitemap: ${postsResult.docs.length} blog posts`)
    } catch (err) {
      console.error('❌ Sitemap: posts fetch failed', err)
    }

    // ==========================================
    // DYNAMIC — Artist Profiles (from CMS)
    // ==========================================

    try {
      const artistsResult = await payload.find({
        collection: 'artists',
        limit: 500,
        select: { slug: true, updatedAt: true },
        depth: 0,
      })

      for (const a of artistsResult.docs as Array<{ slug?: string; updatedAt: string }>) {
        if (!a.slug) continue
        add(`/artists/${a.slug}`, {
          changeFrequency: 'monthly',
          priority: 0.6,
          lastModified: new Date(a.updatedAt),
        })
      }
      console.log(`✅ Sitemap: ${artistsResult.docs.length} artist profiles`)
    } catch (err) {
      console.error('❌ Sitemap: artists fetch failed', err)
    }

    // ==========================================
    // DYNAMIC — Dealer Profiles (US-only — US dealers, not relevant on CA)
    // ==========================================

    try {
      const dealersResult = await payload.find({
        collection: 'dealers',
        where: { isActive: { equals: true } },
        limit: 1000,
        select: { slug: true, updatedAt: true },
        depth: 0,
      })

      for (const d of dealersResult.docs as Array<{ slug?: string; updatedAt: string }>) {
        if (!d.slug) continue
        add(`/find-a-dealer/${d.slug}`, {
          changeFrequency: 'monthly',
          priority: 0.65,
          lastModified: new Date(d.updatedAt),
          usOnly: true,
        })
      }
      console.log(`✅ Sitemap: ${dealersResult.docs.length} dealer profiles`)
    } catch (err) {
      console.error('❌ Sitemap: dealers fetch failed', err)
    }

    // ==========================================
    // DYNAMIC — Storefronts / Store Location Pages (US-only — physical US showrooms)
    // ==========================================

    try {
      const storefrontsResult = await payload.find({
        collection: 'storefronts',
        where: { isActive: { equals: true } },
        limit: 500,
        select: { slug: true, updatedAt: true },
        depth: 0,
      })

      for (const s of storefrontsResult.docs as Array<{ slug?: string; updatedAt: string }>) {
        if (!s.slug) continue
        add(`/store/${s.slug}`, {
          changeFrequency: 'monthly',
          priority: 0.7,
          lastModified: new Date(s.updatedAt),
          usOnly: true,
        })
      }
      console.log(`✅ Sitemap: ${storefrontsResult.docs.length} storefronts`)
    } catch (err) {
      console.error('❌ Sitemap: storefronts fetch failed', err)
    }

    // ==========================================
    // DYNAMIC — Music School pages (US-only — tied to US storefronts)
    // ==========================================

    try {
      const musicSchoolsResult = await payload.find({
        collection: 'music-schools',
        where: { isActive: { equals: true } },
        limit: 500,
        depth: 1,
        select: { serviceLocations: true, updatedAt: true, storefront: true },
      })

      let musicSchoolCount = 0
      let serviceAreaCount = 0

      for (const ms of musicSchoolsResult.docs) {
        const storefrontSlug =
          typeof ms.storefront === 'object' && ms.storefront !== null
            ? (ms.storefront as any).slug
            : null
        if (!storefrontSlug) continue

        const base = `/store/${storefrontSlug}/music-school`
        const lastMod = new Date((ms as any).updatedAt)

        // Core music school pages
        add(base, { changeFrequency: 'monthly', priority: 0.75, lastModified: lastMod, usOnly: true })
        add(`${base}/programs`, { changeFrequency: 'monthly', priority: 0.70, lastModified: lastMod, usOnly: true })
        add(`${base}/faculty`, { changeFrequency: 'monthly', priority: 0.60, lastModified: lastMod, usOnly: true })
        add(`${base}/policies`, { changeFrequency: 'yearly', priority: 0.50, lastModified: lastMod, usOnly: true })
        musicSchoolCount++

        // Service area landing pages
        const locations: Array<{ slug?: string }> = (ms as any).serviceLocations ?? []
        for (const loc of locations) {
          if (!loc.slug) continue
          add(`${base}/${loc.slug}`, {
            changeFrequency: 'monthly',
            priority: 0.75,
            lastModified: lastMod,
            usOnly: true,
          })
          serviceAreaCount++
        }
      }

      console.log(`✅ Sitemap: ${musicSchoolCount} music schools (${serviceAreaCount} service area pages)`)
    } catch (err) {
      console.error('❌ Sitemap: music schools fetch failed', err)
    }

    // ==========================================
    // DYNAMIC — Shopify Collections (from CMS) — bilingual
    // ==========================================

    try {
      const collectionsResult = await payload.find({
        collection: 'collections',
        limit: 500,
        select: { handle: true, updatedAt: true },
        depth: 0,
      })

      for (const c of collectionsResult.docs as Array<{ handle?: string; updatedAt: string }>) {
        if (!c.handle) continue
        add(`/pianos/${c.handle}`, {
          changeFrequency: 'weekly',
          priority: 0.75,
          lastModified: new Date(c.updatedAt),
        })
      }
      console.log(`✅ Sitemap: ${collectionsResult.docs.length} collections`)
    } catch (err) {
      console.error('❌ Sitemap: collections fetch failed', err)
    }

    // ==========================================
    // DYNAMIC — Pages Collection (catch-all routes)
    // Covers /explore, /instrumental-to-life, /contact, /guides/*, etc.
    // ==========================================

    try {
      const pagesResult = await payload.find({
        collection: 'pages',
        where: { _status: { equals: 'published' } },
        limit: 500,
        select: { slug: true, updatedAt: true },
        depth: 0,
      })

      for (const p of pagesResult.docs as Array<{ slug?: string; updatedAt: string }>) {
        if (!p.slug) continue
        add(`/${p.slug}`, {
          changeFrequency: 'monthly',
          priority: 0.6,
          lastModified: new Date(p.updatedAt),
        })
      }
      console.log(`✅ Sitemap: ${pagesResult.docs.length} CMS pages`)
    } catch (err) {
      console.error('❌ Sitemap: pages fetch failed', err)
    }

    // ==========================================
    // DYNAMIC — Job Listings (US-only — US employment)
    // ==========================================

    try {
      const jobsResult = await payload.find({
        collection: 'jobs',
        where: { status: { equals: 'open' } },
        limit: 500,
        select: { slug: true, updatedAt: true },
        depth: 0,
      })

      for (const j of jobsResult.docs as Array<{ slug?: string; updatedAt: string }>) {
        if (!j.slug) continue
        add(`/careers/${j.slug}`, {
          changeFrequency: 'weekly',
          priority: 0.55,
          lastModified: new Date(j.updatedAt),
          usOnly: true,
        })
      }
      console.log(`✅ Sitemap: ${jobsResult.docs.length} job listings`)
    } catch (err) {
      console.error('❌ Sitemap: jobs fetch failed', err)
    }

    // ==========================================
    // DYNAMIC — Technical Support Hubs (US-only — Kawai America TSD)
    // ==========================================

    try {
      const hubsResult = await payload.find({
        collection: 'support-groups',
        where: { isActive: { equals: true } },
        limit: 100,
        select: { slug: true, updatedAt: true },
        depth: 0,
      })

      for (const h of hubsResult.docs as Array<{ slug?: string; updatedAt: string }>) {
        if (!h.slug) continue
        add(`/technical-support-division/${h.slug}`, {
          changeFrequency: 'monthly',
          priority: 0.5,
          lastModified: new Date(h.updatedAt),
          usOnly: true,
        })
      }
      console.log(`✅ Sitemap: ${hubsResult.docs.length} support hubs`)
    } catch (err) {
      console.error('❌ Sitemap: support-groups fetch failed', err)
    }

    // ==========================================
    // FILTER — Exclude active CMS redirect sources
    // A URL that redirects elsewhere must not appear in the sitemap —
    // search engines should only index the canonical destination.
    // ==========================================

    const filtered = sitemap.filter((entry) => {
      try {
        const path = new URL(entry.url).pathname
        return !redirectSources.has(path)
      } catch {
        return true
      }
    })

    const excluded = sitemap.length - filtered.length
    if (excluded > 0) {
      console.log(`✅ Sitemap: excluded ${excluded} redirect source(s)`)
    }

    console.log(`✅ Sitemap total (${site}): ${filtered.length} URLs`)
    return filtered

  } catch (err) {
    console.error('❌ Sitemap: critical failure, returning fallback', err)

    const fallbackUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'
    return [
      { url: fallbackUrl, changeFrequency: 'daily', priority: 1.0 },
      { url: `${fallbackUrl}/pianos`, changeFrequency: 'daily', priority: 0.9 },
      { url: `${fallbackUrl}/find-a-dealer`, changeFrequency: 'weekly', priority: 0.8 },
    ]
  }
}
