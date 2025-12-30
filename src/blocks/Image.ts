import type { Block } from 'payload'

export const Image: Block = {
  slug: 'image',
  imageURL: 'https://via.placeholder.com/300x200?text=Image',
  imageAltText: 'Image block for displaying images with captions',
  interfaceName: 'ImageBlock',
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Upload an image',
      },
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Alternative text for accessibility (describe the image)',
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
        description: 'Image display size',
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
        description: 'Image alignment',
      },
    },
  ],
}
