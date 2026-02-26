import type { ProductHeroCarouselBlock as ProductHeroCarouselBlockType } from '@/payload-types'
import { ProductHeroCarouselServerRenderer } from './product/ProductHeroCarouselServerRenderer'

interface ProductHeroCarouselBlockProps extends ProductHeroCarouselBlockType {}

/**
 * ProductHeroCarouselBlock — wrapper for product-hero-carousel
 *
 * Fetches slides from the Homepage news tab (same source as the News Carousel)
 * and renders them in a media-first, editorial hero carousel format.
 * Block-level slides are appended after the homepage items.
 *
 * @see src/components/blocks/product/ProductHeroCarouselServerRenderer.tsx
 * @see src/components/blocks/product/ProductHeroCarouselRenderer.tsx
 * @see src/blocks/product/ProductHeroCarousel.ts
 */
export function ProductHeroCarouselBlock(props: ProductHeroCarouselBlockProps) {
  return <ProductHeroCarouselServerRenderer {...props} />
}
