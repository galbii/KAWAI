import React from 'react'
import type { LayoutHeroCarouselBlock as HeroCarouselBlockType } from '@/payload-types'
import { LayoutHeroCarouselRenderer } from './layout/LayoutHeroCarouselRenderer'

interface HeroCarouselBlockProps extends HeroCarouselBlockType {}

/**
 * HeroCarouselBlock - Wrapper component for layout-hero-carousel block
 *
 * This component wraps the LayoutHeroCarouselRenderer and provides
 * the interface between RenderBlocks and the actual renderer.
 *
 * The renderer is a client component with full carousel functionality:
 * - Auto-play with configurable duration
 * - Touch/swipe navigation
 * - Keyboard navigation
 * - Navigation dots and play/pause controls
 * - Ken Burns effect on images
 * - Glassmorphism/gradient overlays
 * - Customizable positioning and styling
 *
 * @see src/components/blocks/layout/LayoutHeroCarouselRenderer.tsx
 * @see src/blocks/layout/HeroCarousel.ts
 */
export function HeroCarouselBlock(props: HeroCarouselBlockProps) {
  return <LayoutHeroCarouselRenderer {...props} />
}
