import type { MarketingShowroomBlock } from '@/payload-types'
import { ShowroomRenderer } from './marketing/ShowroomRenderer'

export function ShowroomBlock(props: MarketingShowroomBlock) {
  return <ShowroomRenderer {...props} />
}
