import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'

// Regenerate every hour so CMS changes (new blog posts, artists, dealers) appear quickly
export const revalidate = 3600

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
    const payload = await getPayloadClient()
    const sitemap: MetadataRoute.Sitemap = []

    // Fetch active redirect sources upfront — these URLs must not appear in the sitemap
    const redirectSources = await getRedirectSourcePaths()

    // ==========================================
    // STATIC ROUTES — Core / High Priority
    // ==========================================

    sitemap.push(
      { url: SITE_URL, changeFrequency: 'daily', priority: 1.0 },
      { url: `${SITE_URL}/pianos`, changeFrequency: 'daily', priority: 0.9 },
      { url: `${SITE_URL}/find-my-piano`, changeFrequency: 'weekly', priority: 0.9 },
      { url: `${SITE_URL}/piano-finder`, changeFrequency: 'weekly', priority: 0.9 },
    )

    // ==========================================
    // STATIC ROUTES — Piano Categories
    // ==========================================

    sitemap.push(
      { url: `${SITE_URL}/pianos/digital`, changeFrequency: 'weekly', priority: 0.85 },
      { url: `${SITE_URL}/pianos/grand`, changeFrequency: 'weekly', priority: 0.85 },
      { url: `${SITE_URL}/pianos/upright`, changeFrequency: 'weekly', priority: 0.85 },
      { url: `${SITE_URL}/pianos/hybrid`, changeFrequency: 'weekly', priority: 0.85 },
      { url: `${SITE_URL}/pianos/shigeru-kawai`, changeFrequency: 'weekly', priority: 0.9 },
      { url: `${SITE_URL}/pianos/shigeru-kawai/sk-ex`, changeFrequency: 'monthly', priority: 0.75 },
      { url: `${SITE_URL}/pianos/digital/ca901`, changeFrequency: 'monthly', priority: 0.7 },
      { url: `${SITE_URL}/pianos/search`, changeFrequency: 'weekly', priority: 0.7 },
      { url: `${SITE_URL}/pianos/compare`, changeFrequency: 'weekly', priority: 0.65 },
      { url: `${SITE_URL}/pianos/accessories`, changeFrequency: 'weekly', priority: 0.65 },
    )

    // ==========================================
    // STATIC ROUTES — Product / Marketing
    // ==========================================

    sitemap.push(
      { url: `${SITE_URL}/concert-artist`, changeFrequency: 'monthly', priority: 0.8 },
      { url: `${SITE_URL}/concert-artist-ca`, changeFrequency: 'monthly', priority: 0.7 },
      { url: `${SITE_URL}/the-winners-choice`, changeFrequency: 'monthly', priority: 0.7 },
      { url: `${SITE_URL}/distinguished-owners`, changeFrequency: 'monthly', priority: 0.65 },
      { url: `${SITE_URL}/rebate`, changeFrequency: 'weekly', priority: 0.75 },
    )

    // ==========================================
    // STATIC ROUTES — Content / SEO
    // ==========================================

    sitemap.push(
      { url: `${SITE_URL}/blog`, changeFrequency: 'daily', priority: 0.8 },
      { url: `${SITE_URL}/artists`, changeFrequency: 'weekly', priority: 0.75 },
      { url: `${SITE_URL}/guides`, changeFrequency: 'weekly', priority: 0.7 },
      { url: `${SITE_URL}/glossary`, changeFrequency: 'monthly', priority: 0.55 },
      { url: `${SITE_URL}/news`, changeFrequency: 'daily', priority: 0.7 },
    )

    // ==========================================
    // STATIC ROUTES — Technology Sub-Pages
    // ==========================================

    sitemap.push(
      { url: `${SITE_URL}/technology`, changeFrequency: 'monthly', priority: 0.7 },
      { url: `${SITE_URL}/technology/carbon-fiber-technology`, changeFrequency: 'monthly', priority: 0.65 },
      { url: `${SITE_URL}/technology/sound-technology`, changeFrequency: 'monthly', priority: 0.65 },
      { url: `${SITE_URL}/technology/wooden-key-actions`, changeFrequency: 'monthly', priority: 0.65 },
      { url: `${SITE_URL}/technology/piano-action`, changeFrequency: 'monthly', priority: 0.65 },
      { url: `${SITE_URL}/technology/soundboard-speaker-system`, changeFrequency: 'monthly', priority: 0.65 },
      { url: `${SITE_URL}/technology/abs`, changeFrequency: 'monthly', priority: 0.6 },
    )

    // ==========================================
    // STATIC ROUTES — Company
    // ==========================================

    sitemap.push(
      { url: `${SITE_URL}/company`, changeFrequency: 'monthly', priority: 0.65 },
      { url: `${SITE_URL}/company/awards`, changeFrequency: 'monthly', priority: 0.6 },
      { url: `${SITE_URL}/company/our-philosophy`, changeFrequency: 'monthly', priority: 0.6 },
      { url: `${SITE_URL}/company/koichi-kawai`, changeFrequency: 'monthly', priority: 0.6 },
      { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.65 },
    )

    // ==========================================
    // STATIC ROUTES — Institutions
    // ==========================================

    sitemap.push(
      { url: `${SITE_URL}/institutions/epic-program`, changeFrequency: 'monthly', priority: 0.65 },
      { url: `${SITE_URL}/institutions/testimonial-videos`, changeFrequency: 'monthly', priority: 0.6 },
      { url: `${SITE_URL}/institutions/financial-assistance`, changeFrequency: 'monthly', priority: 0.65 },
      { url: `${SITE_URL}/institutions/institutional-fleet`, changeFrequency: 'monthly', priority: 0.6 },
      { url: `${SITE_URL}/institutions/loan-programs`, changeFrequency: 'monthly', priority: 0.65 },
    )

    // ==========================================
    // STATIC ROUTES — Dealer / Location Discovery
    // ==========================================

    sitemap.push(
      { url: `${SITE_URL}/find-a-dealer`, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${SITE_URL}/showroom`, changeFrequency: 'monthly', priority: 0.7 },
    )

    // ==========================================
    // STATIC ROUTES — Utility
    // ==========================================

    sitemap.push(
      { url: `${SITE_URL}/warranty-registration`, changeFrequency: 'yearly', priority: 0.5 },
      { url: `${SITE_URL}/warranty`, changeFrequency: 'yearly', priority: 0.45 },
      { url: `${SITE_URL}/faq`, changeFrequency: 'monthly', priority: 0.6 },
      { url: `${SITE_URL}/careers`, changeFrequency: 'weekly', priority: 0.6 },
      { url: `${SITE_URL}/technical-support-division`, changeFrequency: 'monthly', priority: 0.55 },
      { url: `${SITE_URL}/digital-piano-rebate`, changeFrequency: 'monthly', priority: 0.65 },
      { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    )

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

      const faqRoutes: MetadataRoute.Sitemap = faqsResult.docs
        .filter((f: any) => f.slug)
        .map((f: any) => ({
          url: `${SITE_URL}/faq/${f.slug}`,
          lastModified: new Date(f.updatedAt),
          changeFrequency: 'monthly' as const,
          priority: 0.55,
        }))

      sitemap.push(...faqRoutes)
      console.log(`✅ Sitemap: ${faqRoutes.length} FAQ pages`)
    } catch (err) {
      console.error('❌ Sitemap: faqs fetch failed', err)
    }

    // ==========================================
    // STATIC ROUTES — NAMM 2026 Event Pages
    // ==========================================

    sitemap.push(
      { url: `${SITE_URL}/namm-2026`, changeFrequency: 'daily', priority: 0.9 },
      { url: `${SITE_URL}/namm-2026/dealer`, changeFrequency: 'weekly', priority: 0.7 },
      { url: `${SITE_URL}/namm-2026/artists`, changeFrequency: 'weekly', priority: 0.7 },
      { url: `${SITE_URL}/namm-2026/experience`, changeFrequency: 'weekly', priority: 0.7 },
    )

    // ==========================================
    // DYNAMIC — Products (from CMS)
    // ==========================================

    try {
      const productsResult = await payload.find({
        collection: 'products',
        where: { status: { equals: 'active' } },
        limit: 1000,
        select: { slug: true, updatedAt: true, visibility: true },
        depth: 0,
      })

      const productRoutes: MetadataRoute.Sitemap = productsResult.docs
        .filter((p: any) => p.visibility?.showInCatalog !== false)
        .map((p: any) => ({
          url: `${SITE_URL}/products/${p.slug}`,
          lastModified: new Date(p.updatedAt),
          changeFrequency: 'weekly' as const,
          priority: p.visibility?.featured ? 0.9 : 0.7,
        }))

      sitemap.push(...productRoutes)
      console.log(`✅ Sitemap: ${productRoutes.length} products`)
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

      const postRoutes: MetadataRoute.Sitemap = postsResult.docs
        .filter((p: any) => p.slug)
        .map((p: any) => ({
          url: `${SITE_URL}/blog/${p.slug}`,
          lastModified: new Date(p.publishedDate ?? p.updatedAt),
          changeFrequency: 'monthly' as const,
          priority: 0.65,
        }))

      sitemap.push(...postRoutes)
      console.log(`✅ Sitemap: ${postRoutes.length} blog posts`)
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

      const artistRoutes: MetadataRoute.Sitemap = artistsResult.docs
        .filter((a: any) => a.slug)
        .map((a: any) => ({
          url: `${SITE_URL}/artists/${a.slug}`,
          lastModified: new Date(a.updatedAt),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }))

      sitemap.push(...artistRoutes)
      console.log(`✅ Sitemap: ${artistRoutes.length} artist profiles`)
    } catch (err) {
      console.error('❌ Sitemap: artists fetch failed', err)
    }

    // ==========================================
    // DYNAMIC — Dealer Profiles (from CMS)
    // ==========================================

    try {
      const dealersResult = await payload.find({
        collection: 'dealers',
        where: { isActive: { equals: true } },
        limit: 1000,
        select: { slug: true, updatedAt: true },
        depth: 0,
      })

      const dealerRoutes: MetadataRoute.Sitemap = dealersResult.docs
        .filter((d: any) => d.slug)
        .map((d: any) => ({
          url: `${SITE_URL}/find-a-dealer/${d.slug}`,
          lastModified: new Date(d.updatedAt),
          changeFrequency: 'monthly' as const,
          priority: 0.65,
        }))

      sitemap.push(...dealerRoutes)
      console.log(`✅ Sitemap: ${dealerRoutes.length} dealer profiles`)
    } catch (err) {
      console.error('❌ Sitemap: dealers fetch failed', err)
    }

    // ==========================================
    // DYNAMIC — Storefronts / Store Location Pages
    // ==========================================

    try {
      const storefrontsResult = await payload.find({
        collection: 'storefronts',
        where: { isActive: { equals: true } },
        limit: 500,
        select: { slug: true, updatedAt: true },
        depth: 0,
      })

      const storefrontRoutes: MetadataRoute.Sitemap = storefrontsResult.docs.map((s: any) => ({
        url: `${SITE_URL}/store/${s.slug}`,
        lastModified: new Date(s.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))

      sitemap.push(...storefrontRoutes)
      console.log(`✅ Sitemap: ${storefrontRoutes.length} storefronts`)
    } catch (err) {
      console.error('❌ Sitemap: storefronts fetch failed', err)
    }

    // ==========================================
    // DYNAMIC — Shopify Collections (from CMS)
    // ==========================================

    try {
      const collectionsResult = await payload.find({
        collection: 'collections',
        limit: 500,
        select: { handle: true, updatedAt: true },
        depth: 0,
      })

      const collectionRoutes: MetadataRoute.Sitemap = collectionsResult.docs
        .filter((c: any) => c.handle)
        .map((c: any) => ({
          url: `${SITE_URL}/pianos/${c.handle}`,
          lastModified: new Date(c.updatedAt),
          changeFrequency: 'weekly' as const,
          priority: 0.75,
        }))

      sitemap.push(...collectionRoutes)
      console.log(`✅ Sitemap: ${collectionRoutes.length} collections`)
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

      const pageRoutes: MetadataRoute.Sitemap = pagesResult.docs
        .filter((p: any) => p.slug)
        .map((p: any) => ({
          url: `${SITE_URL}/${p.slug}`,
          lastModified: new Date(p.updatedAt),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }))

      sitemap.push(...pageRoutes)
      console.log(`✅ Sitemap: ${pageRoutes.length} CMS pages`)
    } catch (err) {
      console.error('❌ Sitemap: pages fetch failed', err)
    }

    // ==========================================
    // DYNAMIC — Job Listings (from CMS)
    // ==========================================

    try {
      const jobsResult = await payload.find({
        collection: 'jobs',
        where: { status: { equals: 'open' } },
        limit: 500,
        select: { slug: true, updatedAt: true },
        depth: 0,
      })

      const jobRoutes: MetadataRoute.Sitemap = jobsResult.docs
        .filter((j: any) => j.slug)
        .map((j: any) => ({
          url: `${SITE_URL}/careers/${j.slug}`,
          lastModified: new Date(j.updatedAt),
          changeFrequency: 'weekly' as const,
          priority: 0.55,
        }))

      sitemap.push(...jobRoutes)
      console.log(`✅ Sitemap: ${jobRoutes.length} job listings`)
    } catch (err) {
      console.error('❌ Sitemap: jobs fetch failed', err)
    }

    // ==========================================
    // DYNAMIC — Technical Support Hubs (from CMS)
    // ==========================================

    try {
      const hubsResult = await payload.find({
        collection: 'support-groups',
        where: { isActive: { equals: true } },
        limit: 100,
        select: { slug: true, updatedAt: true },
        depth: 0,
      })

      const hubRoutes: MetadataRoute.Sitemap = hubsResult.docs
        .filter((h: any) => h.slug)
        .map((h: any) => ({
          url: `${SITE_URL}/technical-support-division/${h.slug}`,
          lastModified: new Date(h.updatedAt),
          changeFrequency: 'monthly' as const,
          priority: 0.5,
        }))

      sitemap.push(...hubRoutes)
      console.log(`✅ Sitemap: ${hubRoutes.length} support hubs`)
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

    console.log(`✅ Sitemap total: ${filtered.length} URLs`)
    return filtered

  } catch (err) {
    console.error('❌ Sitemap: critical failure, returning fallback', err)

    return [
      { url: SITE_URL, changeFrequency: 'daily', priority: 1.0 },
      { url: `${SITE_URL}/pianos`, changeFrequency: 'daily', priority: 0.9 },
      { url: `${SITE_URL}/find-a-dealer`, changeFrequency: 'weekly', priority: 0.8 },
    ]
  }
}
