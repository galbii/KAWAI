import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'

/**
 * Robots.txt configuration for KAWAI Piano website
 *
 * Instructs search engine crawlers:
 * - Allow indexing of all public content
 * - Block admin and API routes
 * - Point to sitemap for efficient crawling
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/_next/*',
          '/ingest/*',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
