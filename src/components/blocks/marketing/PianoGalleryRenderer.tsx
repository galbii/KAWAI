import type { MarketingPianoGalleryBlock } from '@/payload-types'
import { PianoGallery } from '@/components/homepage/piano-gallery'
import type { PianoGallerySectionData } from '@/lib/types/homepage'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function PianoGalleryRenderer(props: MarketingPianoGalleryBlock) {
  const payload = await getPayload({ config })

  // Check if block has any custom content
  const hasBlockContent = !!(
    props.galleryTitle ||
    props.galleryDescription ||
    (props.pianoCategories && props.pianoCategories.length > 0)
  )

  let galleryData: PianoGallerySectionData

  if (hasBlockContent) {
    // Use block values
    galleryData = {
      galleryTitle: props.galleryTitle ?? 'Explore Our Piano Collection',
      galleryDescription: props.galleryDescription ?? '',
      pianoCategories: props.pianoCategories
        ? props.pianoCategories.map((cat) => ({
            model: cat.model,
            title: cat.title,
            description: cat.description,
            image: cat.image ?? null,
            href: cat.href,
          }))
        : [],
    }
  } else {
    // Fetch from HomePage tab
    const homePage = await payload.find({
      collection: 'home-page',
      limit: 1,
      depth: 2, // Populate media relationships for category images
    })

    const homePageData = homePage.docs[0]

    galleryData = {
      galleryTitle: homePageData?.galleryTitle ?? 'Explore Our Piano Collection',
      galleryDescription: homePageData?.galleryDescription ?? '',
      pianoCategories: homePageData?.pianoCategories
        ? homePageData.pianoCategories.map((cat: any) => ({
            model: cat.model,
            title: cat.title,
            description: cat.description,
            image: cat.image ?? null,
            href: cat.href,
          }))
        : [],
    }
  }

  return <PianoGallery data={galleryData} />
}
