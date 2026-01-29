/**
 * InstrumentalToLifeBlock - Wrapper for Marketing I2L Block
 *
 * Maps the CMS block data to the MarketingI2LRenderer component.
 * This pattern follows the established block architecture:
 * - Block definition in src/blocks/marketing/InstrumentalToLife.ts
 * - Renderer component in src/components/blocks/marketing/MarketingI2LRenderer.tsx
 * - Wrapper component (this file) bridges CMS data to renderer
 *
 * @see docs/BLOCKS.md for block system documentation
 */

import type { MarketingI2LBlock } from '@/payload-types'
import { MarketingI2LRenderer } from './marketing/MarketingI2LRenderer'

interface InstrumentalToLifeBlockProps extends MarketingI2LBlock {}

export function InstrumentalToLifeBlock(props: InstrumentalToLifeBlockProps) {
  return <MarketingI2LRenderer {...props} />
}
