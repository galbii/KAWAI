import type { MarketingPianoCollectionBlock } from '@/payload-types'
import { PianoCollectionRenderer } from './marketing/PianoCollectionRenderer'

export function PianoCollectionBlock(props: MarketingPianoCollectionBlock) {
  return <PianoCollectionRenderer {...props} />
}
