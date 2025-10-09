import type { MetadataRoute } from 'next'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import type { Product, DealerLocation, LandingPage } from '@/payload-types'

// Get the site URL from environment or use default
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'

/**
 * Dynamic sitemap generation for KAWAI Piano website
 *
 * Includes:
 * - Static pages (homepage, core content)
 * - Dynamic product pages from Payload CMS
 * - Dealer location pages
 * - Active campaign landing pages
 * - Piano category pages
 *
 * Automatically regenerates on build and with ISR
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const payload = await getPayloadHMR({ config: configPromise })

    // Initialize sitemap array
    const sitemap: MetadataRoute.Sitemap = []

    // ==========================================
    // STATIC ROUTES - High Priority Core Pages
    // ==========================================

    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${SITE_URL}/pianos`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${SITE_URL}/piano-finder`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${SITE_URL}/find-my-piano`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${SITE_URL}/pianos/compare`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${SITE_URL}/pianos/search`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${SITE_URL}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${SITE_URL}/artists`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${SITE_URL}/technology`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${SITE_URL}/showroom`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${SITE_URL}/guides`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      },
    ]

    sitemap.push(...staticRoutes)

    // ==========================================
    // PIANO CATEGORY PAGES - Main Categories
    // ==========================================

    const categoryRoutes: MetadataRoute.Sitemap = [
      {
        url: `${SITE_URL}/pianos/digital`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${SITE_URL}/pianos/grand`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${SITE_URL}/pianos/upright`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${SITE_URL}/pianos/hybrid`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${SITE_URL}/pianos/shigeru-kawai`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
      },
      {
        url: `${SITE_URL}/pianos/shigeru-kawai/sk-ex`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.75,
      },
      {
        url: `${SITE_URL}/pianos/digital/ca901`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
    ]

    sitemap.push(...categoryRoutes)

    // ==========================================
    // DYNAMIC PRODUCT PAGES - From CMS
    // ==========================================

    try {
      const productsResult = await payload.find({
        collection: 'products',
        where: {
          and: [
            {
              status: {
                equals: 'active',
              },
            },
            {
              discontinued: {
                not_equals: true,
              },
            },
          ],
        },
        limit: 1000,
        select: {
          slug: true,
          updatedAt: true,
          visibility: true,
        },
      })

      const productRoutes: MetadataRoute.Sitemap = productsResult.docs
        .filter((product: any) => {
          // Only include products that should show in catalog
          return product.visibility?.showInCatalog !== false
        })
        .map((product: any) => ({
          url: `${SITE_URL}/products/${product.slug}`,
          lastModified: new Date(product.updatedAt),
          changeFrequency: 'weekly' as const,
          // Featured products get higher priority
          priority: product.visibility?.featured ? 0.9 : 0.7,
        }))

      sitemap.push(...productRoutes)
      console.log(`✅ Added ${productRoutes.length} product pages to sitemap`)
    } catch (error) {
      console.error('❌ Error fetching products for sitemap:', error)
    }

    // ==========================================
    // DEALER LOCATION PAGES - Dynamic Locations
    // ==========================================

    try {
      const dealersResult = await payload.find({
        collection: 'dealer-locations',
        where: {
          isActive: {
            equals: true,
          },
        },
        limit: 500,
        select: {
          slug: true,
          updatedAt: true,
        },
      })

      const dealerRoutes: MetadataRoute.Sitemap = dealersResult.docs.map((dealer: any) => ({
        url: `${SITE_URL}/${dealer.slug}`,
        lastModified: new Date(dealer.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))

      sitemap.push(...dealerRoutes)
      console.log(`✅ Added ${dealerRoutes.length} dealer location pages to sitemap`)
    } catch (error) {
      console.error('❌ Error fetching dealer locations for sitemap:', error)
    }

    // ==========================================
    // CAMPAIGN LANDING PAGES - Active Campaigns
    // ==========================================

    try {
      const landingPagesResult = await payload.find({
        collection: 'landing-pages',
        where: {
          and: [
            {
              status: {
                equals: 'active',
              },
            },
            {
              'seo.noIndex': {
                not_equals: true,
              },
            },
          ],
        },
        limit: 500,
        select: {
          slug: true,
          dealerLocation: true,
          updatedAt: true,
        },
        depth: 1,
      })

      const landingPageRoutes: MetadataRoute.Sitemap = landingPagesResult.docs
        .filter((page: any) => {
          // Ensure we have both slugs
          return page.slug && page.dealerLocation?.slug
        })
        .map((page: any) => ({
          url: `${SITE_URL}/${page.dealerLocation.slug}/${page.slug}`,
          lastModified: new Date(page.updatedAt),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }))

      sitemap.push(...landingPageRoutes)
      console.log(`✅ Added ${landingPageRoutes.length} landing pages to sitemap`)
    } catch (error) {
      console.error('❌ Error fetching landing pages for sitemap:', error)
    }

    // ==========================================
    // SPECIAL EXPERIENCE PAGES - Known Routes
    // ==========================================

    // Add known dealer-specific experience pages (these are special routes)
    // Note: These should only be added if they exist in your routing
    // Adjust based on your actual dealer slugs

    console.log(`✅ Sitemap generated with ${sitemap.length} total URLs`)

    return sitemap

  } catch (error) {
    console.error('❌ Critical error generating sitemap:', error)

    // Fallback to basic static sitemap if CMS fails
    return [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${SITE_URL}/pianos`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${SITE_URL}/piano-finder`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
    ]
  }
}
