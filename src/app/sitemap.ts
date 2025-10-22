import type { MetadataRoute } from 'next'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import type { Product, Storefront } from '@/payload-types'

// Get the site URL from environment or use default
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'

/**
 * Dynamic sitemap generation for KAWAI Piano website
 *
 * Includes:
 * - Static pages (homepage, core content)
 * - Dynamic product pages from Payload CMS
 * - Dealer location pages
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
    // STOREFRONT LOCATION PAGES - Dynamic Locations
    // ==========================================

    try {
      const storefrontsResult = await payload.find({
        collection: 'storefronts',
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

      const storefrontRoutes: MetadataRoute.Sitemap = storefrontsResult.docs.map((storefront: any) => ({
        url: `${SITE_URL}/${storefront.slug}`,
        lastModified: new Date(storefront.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))

      sitemap.push(...storefrontRoutes)
      console.log(`✅ Added ${storefrontRoutes.length} storefront location pages to sitemap`)
    } catch (error) {
      console.error('❌ Error fetching storefront locations for sitemap:', error)
    }

    // ==========================================
    // CAMPAIGN LANDING PAGES - REMOVED
    // ==========================================
    // Landing pages collection has been removed from the system

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
