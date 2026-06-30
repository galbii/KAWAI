import 'server-only'
import type { Metadata } from 'next'
import { getSite, getSiteUrl, getSiteAlternates } from '@/lib/site-context'

/**
 * Shared SEO helpers for the company / heritage / recognition pages, so each
 * page declares only its own facts and inherits the same canonical + hreflang +
 * OpenGraph + Twitter shape. Matches the koichi-kawai metadata bar.
 */

type PageMetaInput = {
  /** Absolute site path, e.g. '/technology'. Used for canonical + hreflang. */
  path: string
  title: string
  description: string
  keywords?: string[]
  ogType?: 'website' | 'article'
  /** Absolute image URL for OG / Twitter card (optional). */
  image?: string
  imageAlt?: string
}

/**
 * Build a complete Next.js Metadata object (canonical, hreflang, OG, Twitter)
 * from a small set of per-page facts. Conditionally spreads optional keys to
 * stay compatible with `exactOptionalPropertyTypes`.
 */
export async function buildPageMetadata(input: PageMetaInput): Promise<Metadata> {
  const site = await getSite()
  const url = getSiteUrl(site) + input.path
  const image = input.image
    ? [{ url: input.image, width: 1200, height: 630, alt: input.imageAlt ?? input.title }]
    : undefined

  return {
    title: input.title,
    description: input.description,
    ...(input.keywords ? { keywords: input.keywords } : {}),
    alternates: {
      canonical: url,
      languages: getSiteAlternates(input.path),
    },
    openGraph: {
      type: input.ogType ?? 'website',
      url,
      siteName: 'Kawai Pianos',
      title: input.title,
      description: input.description,
      ...(image ? { images: image } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
      ...(input.image ? { images: [input.image] } : {}),
    },
  }
}

type BreadcrumbStep = { name: string; path: string }

/**
 * Build a schema.org BreadcrumbList from a trail of steps. Always start with
 * Home. `siteUrl` is the absolute origin (from `getSiteUrl(site)`).
 */
export function buildBreadcrumb(siteUrl: string, trail: BreadcrumbStep[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((step, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: step.name,
      item: `${siteUrl}${step.path}`,
    })),
  }
}
