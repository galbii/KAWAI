import type { MetadataRoute } from 'next'
import { getSite, getSiteUrl } from '@/lib/site-context'

/**
 * Robots.txt configuration for KAWAI Piano website
 *
 * Instructs search engine crawlers:
 * - Allow indexing of all public content
 * - Block admin and API routes
 * - Point to sitemap for efficient crawling
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSite()
  const baseUrl = getSiteUrl(site)

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/_next/data/*',
          '/ingest/*',
          '/terms',
        ],
      },
      // Explicit rules for AI crawlers — signals intentional openness.
      // Some providers (OpenAI, Anthropic, Perplexity) check for explicit allowances
      // even when covered by the wildcard rule above.
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'meta-externalagent', 'Applebot'],
        allow: '/',
        disallow: ['/admin/*', '/api/*'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
