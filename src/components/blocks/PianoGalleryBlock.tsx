import type { MarketingPianoGalleryBlock } from '@/payload-types'
import { PianoGalleryRenderer } from './marketing/PianoGalleryRenderer'

export function PianoGalleryBlock(props: MarketingPianoGalleryBlock) {
  return <PianoGalleryRenderer {...props} />
}
