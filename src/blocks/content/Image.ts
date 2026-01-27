import type { Block } from 'payload'

export const Image: Block = {
  slug: 'content-image',
  labels: {
    singular: '📷 Image',
    plural: 'Images',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Image',
  imageAltText: 'Add an image with optional caption and alt text for accessibility',
  interfaceName: 'ContentImageBlock',
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      maxDepth: 0, // Prevent deep media fetching
      required: true,
      admin: {
        description: 'Upload or select an image from media library',
      },
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Alt text for accessibility (required for SEO) - describe the image',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Optional caption displayed below the image',
      },
    },
    {
      name: 'size',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Small (400px)', value: 'small' },
        { label: 'Medium (600px)', value: 'medium' },
        { label: 'Large (800px)', value: 'large' },
        { label: 'Full Width', value: 'full' },
      ],
      admin: {
        description: 'Image display size on the page',
      },
    },
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
      admin: {
        description: 'Image alignment within the content area',
      },
    },
  ],
}
