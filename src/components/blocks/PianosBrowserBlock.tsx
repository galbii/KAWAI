import type { MarketingPianosBrowserBlock } from '@/payload-types'
import { PianosBrowserRenderer } from './marketing/PianosBrowserRenderer'

export function PianosBrowserBlock(props: MarketingPianosBrowserBlock) {
  return <PianosBrowserRenderer {...props} />
}
