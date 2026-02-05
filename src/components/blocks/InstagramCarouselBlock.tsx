import type { MarketingInstagramCarouselBlock } from '@/payload-types'
import { InstagramCarouselRenderer } from './marketing/InstagramCarouselRenderer'

/**
 * Instagram Carousel Block Wrapper
 *
 * Renders Instagram posts in an elegant carousel with keyboard navigation.
 * Designed with Japanese-inspired minimalist aesthetics for the Kawai brand.
 *
 * Features:
 * - Instagram embed integration via embed.js
 * - Arrow key navigation
 * - Touch/swipe support on mobile
 * - Auto-play with pause on hover
 * - Elegant animations via Framer Motion
 * - Multiple theme options (light, dark, red accent)
 * - Responsive design with mobile optimization
 *
 * @see docs/BLOCKS.md for usage guidelines
 */
export function InstagramCarouselBlock(props: MarketingInstagramCarouselBlock) {
  return <InstagramCarouselRenderer {...props} />
}
