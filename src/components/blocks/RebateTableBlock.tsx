import type { MarketingRebateTableBlock } from '@/payload-types'
import { RebateTableRenderer } from './marketing/RebateTableRenderer'

export async function RebateTableBlock(props: MarketingRebateTableBlock) {
  return <RebateTableRenderer {...props} />
}
