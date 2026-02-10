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
      admin: {
        description: 'Gallery section title (leave empty to use Homepage tab data)',
      },
    },
    {
      name: 'galleryDescription',
      type: 'textarea',
      admin: {
        description: 'Gallery section description (leave empty to use Homepage tab data)',
      },
    },
    {
      name: 'pianoCategories',
      type: 'array',
      admin: {
        description: 'Piano category cards (leave empty to use Homepage tab data)',
      },
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
    },
  ],
}
