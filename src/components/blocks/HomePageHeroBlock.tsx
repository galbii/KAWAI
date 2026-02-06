import type { MarketingHomePageHeroBlock } from '@/payload-types'
import { HomePageHeroRenderer } from './marketing/HomePageHeroRenderer'

export function HomePageHeroBlock(props: MarketingHomePageHeroBlock) {
  return <HomePageHeroRenderer {...props} />
}
