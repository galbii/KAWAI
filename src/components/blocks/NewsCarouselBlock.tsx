import type { MarketingNewsCarouselBlock } from '@/payload-types'
import { NewsCarouselRenderer } from './marketing/NewsCarouselRenderer'

export function NewsCarouselBlock(props: MarketingNewsCarouselBlock) {
  return <NewsCarouselRenderer {...props} />
}
