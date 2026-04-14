import type { MarketingNewsCarouselBlock } from '@/payload-types'
import { NewsCarousel } from '@/components/homepage/news-carousel'
import type { NewsCarouselSectionData, NewsItem } from '@/lib/types/homepage'
import { getHomePageDataDirect } from '@/lib/payload/queries'

export async function NewsCarouselRenderer(props: MarketingNewsCarouselBlock) {
  // Use the shared cached query instead of a raw uncached getPayload() call.
  // getHomePageDataDirect is wrapped in unstable_cache (TTL 300s, tag 'home-page')
  // so this is a cache hit on any warm request — zero extra MongoDB roundtrips.
  const homePageData = await getHomePageDataDirect()
  const carouselSection = homePageData?.newsCarouselSection

  let newsItems: NewsItem[] = []

  if (carouselSection?.newsItems && Array.isArray(carouselSection.newsItems)) {
    newsItems = carouselSection.newsItems.map((item: any) => ({
      title: item.title,
      description: item.description,
      image: item.image ?? null,
      category: item.category,
      ...(item.link && { link: item.link }),
    }))
  }

  // Append block-level news items if provided (always additive)
  if (props.newsItems && Array.isArray(props.newsItems) && props.newsItems.length > 0) {
    const blockNewsItems: NewsItem[] = props.newsItems.map((item: any) => ({
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
