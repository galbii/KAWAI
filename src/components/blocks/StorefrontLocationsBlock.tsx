import type { MarketingStorefrontLocationsBlock } from '@/payload-types'
import { StorefrontLocationsRenderer } from './marketing/StorefrontLocationsRenderer'

export function StorefrontLocationsBlock(props: MarketingStorefrontLocationsBlock) {
  return <StorefrontLocationsRenderer {...props} />
}
