/**
 * FindADealerBlock - Wrapper for Marketing Find a Dealer Block
 *
 * Simple, elegant CTA block for directing users to find authorized dealers.
 * Follows the established block architecture pattern.
 *
 * @see docs/BLOCKS.md for block system documentation
 */

import type { MarketingFindADealerBlock } from '@/payload-types'
import { FindADealerRenderer } from './marketing/FindADealerRenderer'

interface FindADealerBlockProps extends MarketingFindADealerBlock {}

export function FindADealerBlock(props: FindADealerBlockProps) {
  return <FindADealerRenderer {...props} />
}
