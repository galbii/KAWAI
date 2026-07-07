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

/**
 * Canonical entity @ids. Reused across every page's JSON-LD so Google resolves
 * one Organization and one founder Person entity, no matter which page is
 * crawled. The Organization @id matches the node the koichi-kawai page has
 * always emitted (kawai-global is the manufacturer of record). The Person @id
 * lives on the founder page but is referenced from here as `founder`.
 */
export const ORG_ID = 'https://www.kawai-global.com/#organization'
export const koichiPersonId = (siteUrl: string) => `${siteUrl}/about/heritage/koichi-kawai#koichi-kawai`

/**
 * The single canonical schema.org Organization node for Kawai. Reference it as
 * `about`/`publisher` from any page's `@graph` (it carries its own `@id`, so
 * repeating it across pages is deduped by Google, not double-counted). Facts
 * verified against Wikidata / kawai-global.com/company/history.
 */
export function buildOrganizationNode(siteUrl: string) {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Kawai Musical Instruments',
    legalName: 'Kawai Musical Instruments Manufacturing Co., Ltd.',
    url: 'https://www.kawai-global.com/',
    logo: `${siteUrl}/images/logos/kawai-logo-red-2x.png`,
    foundingDate: '1927',
    foundingLocation: { '@type': 'Place', name: 'Hamamatsu, Shizuoka, Japan' },
    founder: { '@id': koichiPersonId(siteUrl) },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hamamatsu',
      addressRegion: 'Shizuoka',
      addressCountry: 'JP',
    },
    sameAs: [
      'https://en.wikipedia.org/wiki/Kawai_Musical_Instruments',
      'https://www.wikidata.org/wiki/Q1425561',
    ],
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
