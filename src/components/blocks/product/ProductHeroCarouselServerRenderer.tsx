import type { ProductHeroCarouselBlock, Media } from '@/payload-types'
import { getHomePageDataDirect } from '@/lib/payload/queries'
import { ProductHeroCarouselRenderer } from './ProductHeroCarouselRenderer'
import type { ProductHeroSlideData } from './ProductHeroCarouselRenderer'

/**
 * ProductHeroCarouselServerRenderer
 *
 * Server component that fetches slides from the Homepage news tab (same
 * source as the News Carousel) and transforms them into the hero carousel
 * format. Block-level slides are appended after the homepage items.
 *
 * Uses the shared unstable_cache query to avoid a redundant MongoDB roundtrip
 * (same cache entry as NewsCarouselRenderer and other homepage block renderers).
 */
export async function ProductHeroCarouselServerRenderer(
  props: ProductHeroCarouselBlock & { headingLevel?: 'h1' | 'h2' }
) {
  const homePageData = await getHomePageDataDirect()
  const newsItems = homePageData?.newsCarouselSection?.newsItems
  let slides: ProductHeroSlideData[] = []

  // ── Map homepage news items → ProductHeroSlideData ────────────────────────
  if (newsItems && Array.isArray(newsItems)) {
    slides = newsItems.map((item: any): ProductHeroSlideData => ({
      mediaType: item.videoUrl ? 'youtube' : 'image',
      image: item.image ?? null,
      youtubeUrl: item.videoUrl ?? null,
      youtubeZoom: item.youtubeZoom ?? null,
      eyebrow: item.category ?? null,
      title: item.title ?? null,
      subtitle: item.description ?? null,
      ctaText: item.ctaText ?? null,
      ctaLink: item.link ?? null,
      ctaStyle: 'white',
    }))
  }

  // ── Append block-level slides (always additive) ───────────────────────────
  if (props.slides && Array.isArray(props.slides) && props.slides.length > 0) {
    const blockSlides: ProductHeroSlideData[] = props.slides.map((slide) => ({
      mediaType: (slide.mediaType ?? 'image') as ProductHeroSlideData['mediaType'],
      image: (slide.image as Media | string | null | undefined) ?? null,
      videoFile: (slide.videoFile as Media | string | null | undefined) ?? null,
      youtubeUrl: slide.youtubeUrl ?? null,
      youtubeZoom: slide.youtubeZoom ?? null,
      eyebrow: slide.eyebrow ?? null,
      title: slide.title ?? null,
      subtitle: slide.subtitle ?? null,
      ctaText: slide.ctaText ?? null,
      ctaLink: slide.ctaLink ?? null,
      ctaOpenInNewTab: slide.ctaOpenInNewTab ?? false,
      ctaStyle: (slide.ctaStyle as ProductHeroSlideData['ctaStyle']) ?? 'white',
    }))
    slides = [...slides, ...blockSlides]
  }

  // ── Resolve autoPlayDuration ──────────────────────────────────────────────
  const autoPlayDuration =
    props.settings?.autoPlayDuration ??
    homePageData?.newsCarouselSection?.autoPlayDuration ??
    7000

  return (
    <ProductHeroCarouselRenderer
      slides={slides}
      settings={{ ...props.settings, autoPlayDuration }}
      styling={props.styling ?? undefined}
      {...(props.headingLevel ? { headingLevel: props.headingLevel } : {})}
    />
  )
}
