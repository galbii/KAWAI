import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Banner: Block = {
  slug: 'content-banner',
  labels: {
    singular: '📢 Banner',
    plural: 'Banners',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Banner',
  imageAltText: 'Add attention-grabbing banners for important messages (info, warning, error, success)',
  interfaceName: 'ContentBannerBlock',
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Warning', value: 'warning' },
        { label: 'Error', value: 'error' },
        { label: 'Success', value: 'success' },
      ],
      required: true,
      admin: {
        description: 'Banner style determines the color scheme and icon',
      },
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
      label: false,
      required: true,
      admin: {
        description: 'Banner message content with rich text formatting',
      },
    },
  ],
}
