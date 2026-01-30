/**
 * TechnicalShowcaseBlock - Wrapper for Marketing Technical Showcase Block
 *
 * Maps the CMS block data to the TechnicalShowcaseRenderer component.
 * This pattern follows the established block architecture:
 * - Block definition in src/blocks/marketing/TechnicalShowcase.ts
 * - Renderer component in src/components/blocks/marketing/TechnicalShowcaseRenderer.tsx
 * - Wrapper component (this file) bridges CMS data to renderer
 *
 * @see docs/BLOCKS.md for block system documentation
 */

import type { MarketingTechnicalShowcaseBlock } from '@/payload-types'
import { TechnicalShowcaseRenderer } from './marketing/TechnicalShowcaseRenderer'

interface TechnicalShowcaseBlockProps extends MarketingTechnicalShowcaseBlock {}

export function TechnicalShowcaseBlock(props: TechnicalShowcaseBlockProps) {
  return <TechnicalShowcaseRenderer {...props} />
}
