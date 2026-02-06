import type { MarketingPianoGalleryBlock } from '@/payload-types'
import { PianoGallery } from '@/components/homepage/piano-gallery'
import type { PianoGallerySectionData } from '@/lib/types/homepage'

export function PianoGalleryRenderer(props: MarketingPianoGalleryBlock) {
  const galleryData: PianoGallerySectionData = {
    galleryTitle: props.galleryTitle || 'Explore Our Piano Collection',
    galleryDescription: props.galleryDescription || '',
    pianoCategories: props.pianoCategories.map((cat) => ({
      model: cat.model,
      title: cat.title,
      description: cat.description,
      image: cat.image || null,
      href: cat.href,
    })),
  }

  return <PianoGallery data={galleryData} />
}
