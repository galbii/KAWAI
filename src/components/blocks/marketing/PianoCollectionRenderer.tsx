import type { MarketingPianoCollectionBlock } from '@/payload-types'
import { PianoCollection } from '@/components/homepage/piano-collection'
import type { PianoCollectionSectionData } from '@/lib/types/homepage'
import { getHomePageDataDirect } from '@/lib/payload/queries'

export async function PianoCollectionRenderer(props: MarketingPianoCollectionBlock) {
  // Check if the block has custom content that overrides CMS homepage defaults
  const hasBlockContent = !!(
    props.collectionSectionHeader ||
    props.collectionTitle ||
    props.collectionDescription ||
    props.collectionCta?.text ||
    props.collectionCta?.link ||
    props.featuredVideo?.youtubeId
  )

  let collectionData: PianoCollectionSectionData

  if (hasBlockContent) {
    // Block has its own content — use it directly, no DB call needed
    collectionData = {
      collectionSectionHeader: props.collectionSectionHeader ?? 'Featured Models',
      collectionTitle: props.collectionTitle ?? 'Kawai Piano Collection',
      collectionDescription: props.collectionDescription ?? '',
      collectionCta: {
        text: props.collectionCta?.text ?? 'Explore Collection',
        link: props.collectionCta?.link ?? '/pianos',
      },
      featuredVideo: {
        ...(props.featuredVideo?.youtubeId && {
          youtubeId: props.featuredVideo.youtubeId
        }),
        width: props.featuredVideo?.width ?? 560,
        height: props.featuredVideo?.height ?? 315,
      },
    }
  } else {
    // Fall back to CMS homepage defaults — use the shared cached query
    // (same unstable_cache entry as page.tsx, zero extra MongoDB roundtrips)
    const homePageData = await getHomePageDataDirect()
    const section = homePageData?.pianoCollectionSection

    collectionData = {
      collectionSectionHeader: section?.collectionSectionHeader ?? 'Featured Models',
      collectionTitle: section?.collectionTitle ?? 'Kawai Piano Collection',
      collectionDescription: section?.collectionDescription ?? '',
      collectionCta: {
        text: section?.collectionCta?.text ?? 'Explore Collection',
        link: section?.collectionCta?.link ?? '/pianos',
      },
      featuredVideo: {
        ...(section?.featuredVideo?.youtubeId && {
          youtubeId: section.featuredVideo.youtubeId
        }),
        width: section?.featuredVideo?.width ?? 560,
        height: section?.featuredVideo?.height ?? 315,
      },
    }
  }

  return <PianoCollection data={collectionData} />
}
