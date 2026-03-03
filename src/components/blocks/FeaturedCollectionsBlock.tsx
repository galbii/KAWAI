import type { MarketingFeaturedCollectionsBlock } from '@/payload-types'
import { FeaturedCollectionsRenderer } from './marketing/FeaturedCollectionsRenderer'

export function FeaturedCollectionsBlock(props: MarketingFeaturedCollectionsBlock) {
  return <FeaturedCollectionsRenderer {...props} />
}
