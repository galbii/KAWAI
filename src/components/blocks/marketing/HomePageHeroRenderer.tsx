import type { MarketingHomePageHeroBlock } from '@/payload-types'
import { HomeHero } from '@/components/homepage/HomeHero'
import type { HeroSectionData } from '@/lib/types/homepage'

export function HomePageHeroRenderer(props: MarketingHomePageHeroBlock) {
  const heroData: HeroSectionData = {
    locationText: props.locationText || '',
    establishedText: props.establishedText || 'Est. 1927 • Lake St. Louis, Missouri',
    description: props.description || 'Every musician harbors a vision. Every performance seeks perfection. At Kawai Piano Gallery, we understand that finding the right piano is a deeply personal journey.',
    primaryCta: {
      text: props.primaryCta?.text || 'View Our Piano Collection',
      link: props.primaryCta?.link || '/pianos',
    },
    secondaryCta: {
      text: props.secondaryCta?.text || 'Visit Our St. Louis Piano Gallery',
      link: props.secondaryCta?.link || '/contact',
    },
    backgroundVideo: props.backgroundVideo || null,
    tracking: props.tracking, // Pass tracking config to HomeHero
  }

  return <HomeHero data={heroData} />
}
