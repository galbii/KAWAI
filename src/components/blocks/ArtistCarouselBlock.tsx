import type { MarketingArtistCarouselBlock } from '@/payload-types'
import { ArtistCarouselRenderer } from './marketing/ArtistCarouselRenderer'

/**
 * Artist Carousel Block Wrapper
 *
 * Renders KAWAI artists in an elegant carousel with keyboard navigation.
 * Designed with Japanese-inspired minimalist aesthetics for the Kawai brand.
 *
 * Features:
 * - Artist selection via Payload relationship field
 * - Multiple display modes (card, featured, minimal)
 * - Arrow key navigation
 * - Touch/swipe support on mobile
 * - Auto-play with pause on hover
 * - Elegant animations via Framer Motion
 * - Multiple theme options (light, dark, red accent)
 * - Responsive design with mobile optimization
 * - Social media links integration
 *
 * @see docs/BLOCKS.md for usage guidelines
 */
export function ArtistCarouselBlock(props: MarketingArtistCarouselBlock) {
  return <ArtistCarouselRenderer {...props} />
}
