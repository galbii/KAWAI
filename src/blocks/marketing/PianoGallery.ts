import type { Block } from 'payload'
import { imageField } from '@/lib/payload/fields/media'

export const PianoGallery: Block = {
  slug: 'marketing-piano-gallery',
  labels: {
    singular: '🎨 Piano Gallery',
    plural: 'Piano Gallery Sections',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Piano+Gallery',
  imageAltText: 'Piano category grid with images and descriptions',
  interfaceName: 'MarketingPianoGalleryBlock',
  fields: [
    {
      name: 'galleryTitle',
      type: 'text',
      defaultValue: 'Explore Our Piano Categories',
      admin: { description: 'Gallery section title' },
    },
    {
      name: 'galleryDescription',
      type: 'textarea',
      defaultValue:
        'From classic grand pianos to cutting-edge digital instruments, explore our comprehensive collection of Kawai pianos. Each category offers unique features tailored to different playing styles and preferences.',
      admin: { description: 'Gallery section description' },
    },
    {
      name: 'pianoCategories',
      type: 'array',
      required: true,
      admin: { description: 'Piano category cards' },
      fields: [
        {
          name: 'model',
          type: 'text',
          required: true,
          admin: { description: 'Category model/type (e.g., "Digital Piano")' },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: { description: 'Category title' },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          admin: { description: 'Category description' },
        },
        imageField('image', { required: false }),
        {
          name: 'href',
          type: 'text',
          required: true,
          admin: { description: 'Link to category page' },
        },
      ],
      defaultValue: [
        {
          model: 'Digital Piano',
          title: 'Digital Excellence',
          description:
            'Experience authentic piano sound and touch with advanced digital technology.',
          href: '/pianos/digital',
        },
        {
          model: 'Grand Piano',
          title: 'Grand Tradition',
          description:
            'The pinnacle of piano craftsmanship, offering unparalleled tone and resonance.',
          href: '/pianos/grand',
        },
        {
          model: 'Upright Piano',
          title: 'Upright Innovation',
          description:
            'Space-saving design with full-size performance capabilities.',
          href: '/pianos/upright',
        },
        {
          model: 'Hybrid Piano',
          title: 'Hybrid Technology',
          description:
            'The perfect fusion of acoustic piano touch with digital versatility.',
          href: '/pianos/hybrid',
        },
      ],
    },
  ],
}
