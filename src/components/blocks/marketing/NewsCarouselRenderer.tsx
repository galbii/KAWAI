import type { MarketingNewsCarouselBlock } from '@/payload-types'
import { NewsCarousel } from '@/components/homepage/news-carousel'
import type { NewsCarouselSectionData, NewsItem } from '@/lib/types/homepage'
import { getHomePageDataDirect } from '@/lib/payload/queries'
import { getSite } from '@/lib/site-context'
import { exclusiveSite, isAvailableOnSite } from '@/lib/site-availability'

export async function NewsCarouselRenderer(props: MarketingNewsCarouselBlock) {
  // Use the shared cached query instead of a raw uncached getPayload() call.
  // getHomePageDataDirect is wrapped in unstable_cache (TTL 300s, tag 'home-page')
  // so this is a cache hit on any warm request — zero extra MongoDB roundtrips.
  const homePageData = await getHomePageDataDirect()
  const carouselSection = homePageData?.newsCarouselSection

  const homeRows: any[] = Array.isArray(carouselSection?.newsItems) ? carouselSection.newsItems : []
  const blockRows: any[] = Array.isArray(props.newsItems) ? props.newsItems : []

  // US-only / Canada-only items. headers() is read only when one exists, so a
  // carousel with no region-exclusive item stays statically renderable.
  const site = [...homeRows, ...blockRows].some((row) => exclusiveSite(row))
    ? await getSite()
    : null
  const onThisSite = (row: any) => site === null || isAvailableOnSite(row, site)

  let newsItems: NewsItem[] = []

  if (homeRows.length > 0) {
    newsItems = homeRows.filter(onThisSite).map((item: any) => ({
      title: item.title,
      description: item.description,
      image: item.image ?? null,
      category: item.category,
      ...(item.link && { link: item.link }),
    }))
  }

  // Append block-level news items if provided (always additive)
  if (blockRows.length > 0) {
    const blockNewsItems: NewsItem[] = blockRows.filter(onThisSite).map((item: any) => ({
      title: item.title,
      description: item.description,
      image: item.image ?? null,
      category: item.category,
      ...(item.link && { link: item.link }),
      ...(item.videoUrl && { videoUrl: item.videoUrl, videoSource: 'youtube' as const }),
      ...(item.youtubeZoom != null && { youtubeZoom: item.youtubeZoom }),
    }))
    newsItems = [...newsItems, ...blockNewsItems]
  }

  // Every item was for the other site — render nothing rather than letting
  // NewsCarousel fall back to its placeholder slides
  if (newsItems.length === 0 && homeRows.length + blockRows.length > 0) return null

  const autoPlayDuration =
    props.autoPlayDuration ??
    carouselSection?.autoPlayDuration ??
    7000

  const carouselData: NewsCarouselSectionData = {
    autoPlayDuration,
    newsItems,
  }

  return <NewsCarousel data={carouselData} />
}
