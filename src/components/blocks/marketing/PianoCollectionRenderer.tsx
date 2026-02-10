import type { MarketingPianoCollectionBlock } from '@/payload-types'
import { PianoCollection } from '@/components/homepage/piano-collection'
import type { PianoCollectionSectionData } from '@/lib/types/homepage'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function PianoCollectionRenderer(props: MarketingPianoCollectionBlock) {
  const payload = await getPayload({ config })

  // Check if block has any custom content
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
    // Use block values
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
    // Fetch from HomePage tab
    const homePage = await payload.find({
      collection: 'home-page',
      limit: 1,
      depth: 0,
    })

    const homePageData = homePage.docs[0]

    collectionData = {
      collectionSectionHeader: homePageData?.collectionSectionHeader ?? 'Featured Models',
      collectionTitle: homePageData?.collectionTitle ?? 'Kawai Piano Collection',
      collectionDescription: homePageData?.collectionDescription ?? '',
      collectionCta: {
        text: homePageData?.collectionCta?.text ?? 'Explore Collection',
        link: homePageData?.collectionCta?.link ?? '/pianos',
      },
      featuredVideo: {
        ...(homePageData?.featuredVideo?.youtubeId && {
          youtubeId: homePageData.featuredVideo.youtubeId
        }),
        width: homePageData?.featuredVideo?.width ?? 560,
        height: homePageData?.featuredVideo?.height ?? 315,
      },
    }
  }

  return <PianoCollection data={collectionData} />
}
