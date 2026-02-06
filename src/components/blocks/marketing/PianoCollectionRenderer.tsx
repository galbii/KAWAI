import type { MarketingPianoCollectionBlock } from '@/payload-types'
import { PianoCollection } from '@/components/homepage/piano-collection'
import type { PianoCollectionSectionData } from '@/lib/types/homepage'

export function PianoCollectionRenderer(props: MarketingPianoCollectionBlock) {
  const collectionData: PianoCollectionSectionData = {
    collectionSectionHeader: props.collectionSectionHeader || 'Featured Models',
    collectionTitle: props.collectionTitle || 'Kawai Piano Collection',
    collectionDescription: props.collectionDescription || '',
    collectionCta: {
      text: props.collectionCta?.text || 'Explore Collection',
      link: props.collectionCta?.link || '/pianos',
    },
    featuredVideo: {
      ...(props.featuredVideo?.youtubeId && { youtubeId: props.featuredVideo.youtubeId }),
      width: props.featuredVideo?.width || 560,
      height: props.featuredVideo?.height || 315,
    },
  }

  return <PianoCollection data={collectionData} />
}
