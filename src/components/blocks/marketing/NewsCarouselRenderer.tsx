import type { MarketingNewsCarouselBlock } from '@/payload-types'
import { NewsCarousel } from '@/components/homepage/news-carousel'
import type { NewsCarouselSectionData } from '@/lib/types/homepage'

export function NewsCarouselRenderer(props: MarketingNewsCarouselBlock) {
  const carouselData: NewsCarouselSectionData = {
    autoPlayDuration: props.autoPlayDuration || 7000,
    newsItems: props.newsItems.map((item) => ({
      title: item.title,
      description: item.description,
      image: item.image || null,
      category: item.category,
      ...(item.link && { link: item.link }),
    })),
  }

  return <NewsCarousel data={carouselData} />
}
