import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { RenderBlocks } from '@/components/RenderBlocks'
import type { Page } from '@/payload-types'
import { CategoryHero } from "@/components/piano/category-hero"
import { UnifiedPianoSeries } from "@/components/piano/unified-piano-series"
import { CategoryCTA } from "@/components/piano/category-cta"
import { CollectionPageContent } from '@/components/piano/collection-page-content'
import { AdminBarDoc } from '@/components/layout/AdminBarDoc'
import {
  isValidCategory,
  getCategoryConfig,
  getCategorySlugs,
  getCategoryHeroTitle,
  getCategoryHeroImage,
  getCategoryStats,
  getCategoryCTA,
} from '@/lib/data'
import {
  getCollectionByHandle,
  getAllCollectionHandles,
  getProductsByCollectionHandle,
  getFeaturedCollections,
  getPayloadClient,
} from '@/lib/payload/queries'
import { buildFeaturedMap, featuredRank, sortByFeatured } from '@/lib/piano/featured-sort'
import { getCMSPageMetadata } from '@/lib/seo/cms-page-metadata'
import type { Product } from '@/payload-types'
import { getSite, getSiteUrl, getSiteAlternates, localeFromSite, type Locale } from '@/lib/site-context'

export const revalidate = 3600

// Route parameters interface
interface CategoryPageParams {
  params: Promise<{
    category: string
  }>
}

/**
 * Generate static parameters for all valid piano categories AND all collection handles.
 * This enables static generation for /pianos/digital, /pianos/grand, AND /pianos/ca-series, etc.
 */
export async function generateStaticParams(): Promise<Array<{ category: string }>> {
  const categoryParams = getCategorySlugs().map((category) => ({ category }))

  let collectionParams: Array<{ category: string }> = []
  try {
    const handles = await getAllCollectionHandles()
    collectionParams = handles.map((handle) => ({ category: handle }))
  } catch {
    // Non-fatal: collections can fall back to on-demand rendering
  }

  return [...categoryParams, ...collectionParams]
}

/**
 * Dynamic metadata generation for SEO optimization.
 * Handles both category pages and collection pages.
 */
export async function generateMetadata({ params }: CategoryPageParams): Promise<Metadata> {
  const { category } = await params
  const site = await getSite()
  const siteUrl = getSiteUrl(site)

  // Category metadata
  if (isValidCategory(category)) {
    const categoryConfig = getCategoryConfig(category)
    if (!categoryConfig) return { title: 'Piano Category Not Found' }

    const stats = getCategoryStats(category)
    const canonicalUrl = `${siteUrl}/pianos/${category}`

    const baseMetadata: Metadata = {
      title: categoryConfig.metaTitle,
      description: categoryConfig.metaDescription,
      keywords: categoryConfig.seoKeywords,
      openGraph: {
        title: categoryConfig.metaTitle,
        description: categoryConfig.metaDescription,
        type: 'website',
        url: canonicalUrl,
        siteName: 'Kawai Piano',
        images: [
          {
            url: getCategoryHeroImage(category),
            width: 1200,
            height: 630,
            alt: `${categoryConfig.name} - ${categoryConfig.shortDescription}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: categoryConfig.metaTitle,
        description: categoryConfig.metaDescription,
        images: [getCategoryHeroImage(category)],
      },
      alternates: {
        canonical: canonicalUrl,
        languages: getSiteAlternates(`/pianos/${category}`),
      },
      other: {
        'price-range': categoryConfig.priceRange,
        'piano-category': categoryConfig.name,
        'model-count': stats.totalModels?.toString() || '0',
      },
    }

    // Overlay any SEO fields set on the matching Pages collection doc
    return getCMSPageMetadata(`pianos/${category}`, baseMetadata, localeFromSite(site))
  }

  // Collection metadata
  const collection = await getCollectionByHandle(category)
  if (collection) {
    const canonicalUrl = `${siteUrl}/pianos/${category}`
    const description =
      collection.description ||
      collection.subheading ||
      `Browse all ${collection.title} models from Kawai Piano.`

    return {
      title: `${collection.title} — Kawai Piano`,
      description,
      openGraph: {
        title: `${collection.title} — Kawai Piano`,
        description,
        type: 'website',
        url: canonicalUrl,
        siteName: 'Kawai Piano',
        ...(collection.imageUrl
          ? { images: [{ url: collection.imageUrl, width: 1200, height: 630, alt: collection.title }] }
          : {}),
      },
      twitter: {
        card: 'summary_large_image',
        title: `${collection.title} — Kawai Piano`,
        description,
      },
      alternates: {
        canonical: canonicalUrl,
        languages: getSiteAlternates(`/pianos/${category}`),
      },
    }
  }

  return {
    title: 'Not Found',
    description: 'The page you are looking for does not exist.',
  }
}

/**
 * Dynamic Piano Category / Collection Page
 *
 * Handles two types of routes under /pianos/[category]:
 *  1. Piano type categories: /pianos/digital, /pianos/grand, /pianos/hybrid, /pianos/upright
 *  2. Shopify collection pages: /pianos/ca-series, /pianos/gx-series, etc.
 *
 * Static named routes (digital/, grand/, search/, compare/, shigeru-kawai/)
 * always take priority over this dynamic segment in Next.js App Router.
 */
function getCMSCategoryPage(slug: string): Promise<Page | null> {
  return unstable_cache(
    async () => {
      try {
        const payload = await getPayloadClient()
        const result = await payload.find({
          collection: 'pages',
          where: {
            slug: { equals: `pianos/${slug}` },
            _status: { equals: 'published' },
          },
          depth: 1,
          limit: 1,
        })
        return result.docs[0] ?? null
      } catch {
        return null
      }
    },
    [`cms-category-page-${slug}`],
    { tags: ['pages'], revalidate: 3600 },
  )()
}

export default async function CategoryPage({ params }: CategoryPageParams) {
  const { category } = await params
  const site = await getSite()

  // Check for a CMS page overriding this category route (slug: "pianos/digital" etc.)
  const cmsPage = await getCMSCategoryPage(category)
  if (cmsPage?.layout && cmsPage.layout.length > 0) {
    return <RenderBlocks blocks={cmsPage.layout} />
  }

  // ── Piano Category Pages ────────────────────────────────────────────────────
  if (isValidCategory(category)) {
    const categoryConfig = getCategoryConfig(category)
    if (!categoryConfig) notFound()

    const stats = getCategoryStats(category)
    const heroTitle = getCategoryHeroTitle(category)
    const ctaText = getCategoryCTA(category)

    let series: any[] = []
    let error: string | null = null

    try {
      const getCategoryProducts = (cat: string) =>
        unstable_cache(
          async () => {
            const payload = await getPayloadClient()
            const { docs } = await payload.find({
              collection: 'products',
              where: {
                and: [
                  { status: { equals: 'active' } },
                  { 'visibility.showInCatalog': { equals: true } },
                  { type: { equals: cat } },
                ],
              },
              select: {
                model: true,
                name: true,
                slug: true,
                imageUrl: true,
                description: true,
                visibility: true,
                shopifyCollections: true,
              },
              depth: 0,
              sort: 'visibility.sortOrder',
              limit: 100,
            })
            return docs
          },
          [`category-products-${cat}`],
          { tags: ['products'], revalidate: 3600 },
        )()

      const products = await getCategoryProducts(category)

      // Float products whose collection is featured (then by collectionPriority).
      // Stable, so visibility.sortOrder is preserved as the tiebreak within a tier.
      const featuredMap = buildFeaturedMap(await getFeaturedCollections())
      const sortedProducts = sortByFeatured(products, featuredMap)

      const seriesMap = new Map<string, any>()

      sortedProducts.forEach((product) => {
        const seriesName = product.model?.match(/^[A-Z]+/)?.[0] || categoryConfig!.name || 'Other'

        if (!seriesMap.has(seriesName)) {
          seriesMap.set(seriesName, {
            name: `${seriesName} Series`,
            description: categoryConfig!.shortDescription,
            pianos: [],
            slides: [],
            // Track the best featured rank across this series' products so the
            // series tabs themselves order featured-first, by priority.
            _rank: { boosted: false, priority: 0 },
          })
        }

        const entry = seriesMap.get(seriesName)!
        const rank = featuredRank(product, featuredMap)
        if (rank.boosted && (!entry._rank.boosted || rank.priority > entry._rank.priority)) {
          entry._rank = rank
        }

        entry.pianos.push({
          slug: product.slug,
          name: product.name,
          series: `${seriesName} Series`,
          rating: 4.5,
          reviews: 0,
          badge: undefined,
          image: product.imageUrl ? { url: product.imageUrl } : undefined,
          description: product.description,
          keyFeatures: []
        })
      })

      series = Array.from(seriesMap.values()).sort((a, b) => {
        if (a._rank.boosted !== b._rank.boosted) return a._rank.boosted ? -1 : 1
        return b._rank.priority - a._rank.priority
      })
    } catch (err) {
      console.error(`Failed to fetch ${category} category data:`, err)
      error = `Failed to load ${categoryConfig!.name.toLowerCase()} piano data`
    }

    const heroStats = [
      {
        label: "Piano Series",
        value: stats.totalModels ? Math.ceil(stats.totalModels / 3).toString() : (series.length || 4).toString()
      },
      {
        label: `${categoryConfig!.name.replace(' Pianos', '')} Models`,
        value: stats.totalModels?.toString() || (series.reduce((acc, s) => acc + (s.pianos?.length || 0), 0) || 12).toString()
      },
      {
        label: "Price Range",
        value: categoryConfig!.priceRange?.split(' - ')[0]?.replace('$', '') || 'Contact for pricing'
      }
    ]

    return (
      <div className="min-h-screen">
        <CategoryHero
          category={categoryConfig!.name}
          title={heroTitle}
          description={categoryConfig!.description}
          backgroundImage={getCategoryHeroImage(category)}
          stats={heroStats}
        />

        {error ? (
          <section className="py-16 lg:py-24 bg-kawai-pearl text-center">
            <div className="max-w-4xl mx-auto px-6">
              <div className="bg-kawai-red/10 border border-kawai-red/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-kawai-red mb-2">Unable to load product data</h3>
                <p className="text-kawai-black/70">{error}</p>
                <p className="text-sm text-kawai-black/60 mt-2">
                  Please try refreshing the page or contact support if the issue persists.
                </p>
              </div>
            </div>
          </section>
        ) : (
          <UnifiedPianoSeries
            title={`Explore ${categoryConfig!.name} Series`}
            description={`Discover our complete collection of ${categoryConfig!.name.toLowerCase()} series. Each series showcases distinct technologies and features for different musical needs.`}
            series={series}
            categorySlug={category}
          />
        )}

        <CategoryCTA
          category={categoryConfig!.name}
          title={`Experience ${categoryConfig!.name.replace(' Pianos', '')} Excellence`}
          description={`Visit our showroom to experience the ${categoryConfig!.keyFeatures.slice(0, 2).join(', ')} and discover why ${categoryConfig!.name.toLowerCase()} are trusted by musicians worldwide.`}
          ctaText={ctaText}
          backgroundTheme={categoryConfig!.colorTheme.primary}
        />
      </div>
    )
  }

  // ── Collection Pages ────────────────────────────────────────────────────────
  const [collection, products] = await Promise.all([
    getCollectionByHandle(category),
    getProductsByCollectionHandle(category, site),
  ])

  if (!collection) notFound()

  return (
    <>
      <AdminBarDoc
        collection="collections"
        id={String(collection.id)}
        collectionLabels={{ singular: 'Collection', plural: 'Collections' }}
      />
      <CollectionPageContent collection={collection} products={products} site={site} />
    </>
  )
}
