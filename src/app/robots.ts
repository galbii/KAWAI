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
        allow: [
          '/',
          '/api/feeds/', // Google Merchant Center feed must be publicly crawlable
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/_next/data/*',
          '/ingest/*',
        ],
      },
      // ─── Google Shopping crawlers ──────────────────────────────────────────────
      // AdsBot-Google fetches the GMC product feed on a daily schedule.
      // Must be explicitly allowed on /api/feeds/* — the wildcard /api/* block
      // above would otherwise prevent GMC from reading the feed.
      {
        userAgent: ['AdsBot-Google', 'Googlebot'],
        allow: ['/api/feeds/'],
        disallow: ['/admin/*', '/api/*'],
      },
      // ─── AI citation & search agents ──────────────────────────────────────────
      // These are the retrieval/search crawlers that power ChatGPT Browse,
      // Claude's web tool, Perplexity, Google AI Overviews, and Meta AI.
      // Explicit allow overrides any upstream "Block AI Bots" firewall rules
      // (e.g. Cloudflare Security → Bots → AI crawlers) for these agents.
      // NOTE: If Cloudflare "Block AI Bots" is enabled it will prepend its own
      // Disallow rules that override this file — turn it off in the dashboard.
      {
        userAgent: [
          'GPTBot',           // OpenAI general crawler (indexing + search)
          'OAI-SearchBot',    // OpenAI ChatGPT Search / Browse retrieval agent
          'ChatGPT-User',     // OpenAI ChatGPT real-time retrieval
          'ClaudeBot',        // Anthropic Claude web tool
          'PerplexityBot',    // Perplexity AI search crawler
          'meta-externalagent', // Meta AI (Facebook/Instagram AI features)
          'Applebot',         // Apple Spotlight / Safari Suggestions (not training)
        ],
        allow: '/',
        disallow: ['/admin/*', '/api/*'],
      },
      // ─── AI training-only agents (block) ──────────────────────────────────────
      // Applebot-Extended is Apple Intelligence training — distinct from regular
      // Applebot (search/citation). Block training; allow citation above.
      {
        userAgent: ['Applebot-Extended'],
        disallow: ['/'],
      },
    ],
    // Only real XML sitemaps belong in the Sitemap directive — declaring
    // llms.txt here caused Google Search Console sitemap parse errors.
    // llms.txt / llms-full.txt are discovered by convention at their
    // well-known paths per the llmstxt.org spec; no directive needed.
    sitemap: [`${baseUrl}/sitemap.xml`],
  }
}
