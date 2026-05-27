import 'server-only'
import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload/queries'
import type { Locale } from '@/lib/site-context'

/**
 * Fetches a page from the Pages collection by slug and overlays any CMS SEO
 * fields on top of the provided fallback metadata. If the page doesn't exist
 * or has no SEO fields filled, the fallback is returned unchanged.
 *
 * Pass the current request locale so the CA domain receives any en-CA SEO
 * overrides set in the admin (with automatic fallback to en-US for blanks).
 *
 * Usage in a page file:
 *   const site = await getSite()
 *   return getCMSPageMetadata('artists', baseMetadata, localeFromSite(site))
 *
 * The CMS page slug must match the slug entered in the Pages collection admin.
 * Only fields that have been filled in the CMS SEO tab will override the fallback.
 */
export async function getCMSPageMetadata(
  slug: string,
  fallback: Metadata,
  locale: Locale = 'en-US',
): Promise<Metadata> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: slug },
        _status: { equals: 'published' },
      },
      limit: 1,
      depth: 1,
      locale,
    })

    const page = result.docs[0]
    if (!page?.seo) return fallback

    const seo = page.seo

    // If no SEO fields have been filled, return fallback unchanged
    const hasSEOData =
      seo.metaTitle ||
      seo.metaDescription ||
      seo.keywords ||
      seo.openGraphTitle ||
      seo.openGraphDescription ||
      seo.openGraphImage

    if (!hasSEOData) return fallback

    // Resolve OG image URL from populated Media object
    const ogImage = seo.openGraphImage
    const ogImageUrl =
      ogImage && typeof ogImage === 'object' && 'url' in ogImage && ogImage.url
        ? ogImage.url
        : undefined

    const merged: Metadata = { ...fallback }

    // Title: use { absolute } so the root layout template isn't re-applied on top
    if (seo.metaTitle) {
      merged.title = { absolute: seo.metaTitle }
    }

    if (seo.metaDescription) {
      merged.description = seo.metaDescription
    }

    if (seo.keywords) {
      merged.keywords = seo.keywords
    }

    // Only touch openGraph if there's something to override
    if (seo.openGraphTitle || seo.openGraphDescription || ogImageUrl) {
      const fallbackOG =
        fallback.openGraph && typeof fallback.openGraph === 'object' ? fallback.openGraph : {}
      merged.openGraph = {
        type: 'website',
        ...fallbackOG,
        ...(seo.openGraphTitle ? { title: seo.openGraphTitle } : {}),
        ...(seo.openGraphDescription ? { description: seo.openGraphDescription } : {}),
        ...(ogImageUrl ? { images: [{ url: ogImageUrl }] } : {}),
      }
      // Mirror to twitter card
      const fallbackTwitter =
        fallback.twitter && typeof fallback.twitter === 'object' ? fallback.twitter : {}
      merged.twitter = {
        card: 'summary_large_image',
        ...fallbackTwitter,
        ...(seo.openGraphTitle ? { title: seo.openGraphTitle } : {}),
        ...(seo.openGraphDescription ? { description: seo.openGraphDescription } : {}),
        ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
      }
    }

    return merged
  } catch {
    return fallback
  }
}
