import type { MarketingPianoGalleryBlock } from '@/payload-types'
import { PianoGallery } from '@/components/homepage/piano-gallery'
import type { PianoGallerySectionData } from '@/lib/types/homepage'
import { getHomePageDataDirect } from '@/lib/payload/queries'

export async function PianoGalleryRenderer(props: MarketingPianoGalleryBlock) {
  // Check if the block has custom content that overrides CMS homepage defaults
  const hasBlockContent = !!(
    props.galleryTitle ||
    props.galleryDescription ||
    (props.pianoCategories && props.pianoCategories.length > 0)
  )

  let galleryData: PianoGallerySectionData

  if (hasBlockContent) {
    // Block has its own content — use it directly, no DB call needed
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
    // Fall back to CMS homepage defaults — use the shared cached query
    // (same unstable_cache entry as page.tsx, zero extra MongoDB roundtrips)
    const homePageData = await getHomePageDataDirect()
    const section = homePageData?.pianoGallerySection

    galleryData = {
      galleryTitle: section?.galleryTitle ?? 'Explore Our Piano Collection',
      galleryDescription: section?.galleryDescription ?? '',
      pianoCategories: section?.pianoCategories
        ? section.pianoCategories.map((cat: any) => ({
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
