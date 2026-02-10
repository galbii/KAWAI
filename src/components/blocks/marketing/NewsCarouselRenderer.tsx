import type { MarketingNewsCarouselBlock } from '@/payload-types'
import { NewsCarousel } from '@/components/homepage/news-carousel'
import type { NewsCarouselSectionData, NewsItem } from '@/lib/types/homepage'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function NewsCarouselRenderer(props: MarketingNewsCarouselBlock) {
  const payload = await getPayload({ config })

  let newsItems: NewsItem[] = []

  // Always fetch HomePage news items first
  const homePage = await payload.find({
    collection: 'home-page',
    limit: 1,
    depth: 2, // Populate media relationships
  })

  const homePageData = homePage.docs[0]

  // Add homepage news items
  if (homePageData?.newsItems && Array.isArray(homePageData.newsItems)) {
    const homePageNewsItems: NewsItem[] = homePageData.newsItems.map((item: any) => ({
      title: item.title,
      description: item.description,
      image: item.image ?? null,
      category: item.category,
      ...(item.link && { link: item.link }),
    }))

    newsItems = homePageNewsItems
  }

  // Append block news items if they exist (always additive)
  if (props.newsItems && Array.isArray(props.newsItems) && props.newsItems.length > 0) {
    const blockNewsItems: NewsItem[] = props.newsItems.map((item) => ({
      title: item.title,
      description: item.description,
      image: item.image ?? null,
      category: item.category,
      ...(item.link && { link: item.link }),
    }))

    newsItems = [...newsItems, ...blockNewsItems]
  }

  // Use block autoPlayDuration if set, otherwise use homepage value, otherwise default to 7000
  const autoPlayDuration =
    props.autoPlayDuration ??
    homePageData?.autoPlayDuration ??
    7000

  const carouselData: NewsCarouselSectionData = {
    autoPlayDuration,
    newsItems,
  }

  return <NewsCarousel data={carouselData} />
}
