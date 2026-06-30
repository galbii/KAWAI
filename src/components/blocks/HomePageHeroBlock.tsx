import type { MarketingHomePageHeroBlock } from '@/payload-types'
import { HomePageHeroRenderer } from './marketing/HomePageHeroRenderer'

export function HomePageHeroBlock(props: MarketingHomePageHeroBlock & { headingLevel?: 'h1' | 'h2' }) {
  return <HomePageHeroRenderer {...props} />
}
