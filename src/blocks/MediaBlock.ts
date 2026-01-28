import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'mediaUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'Enter a URL or click "Browse Media Library" to select from your media',
        placeholder: 'https://example.com/image.jpg',
        components: {
          beforeInput: ['/components/admin/MediaUrlSelectorButton#MediaUrlSelectorButton'],
        },
      },
      validate: (value: unknown) => {
        if (!value || typeof value !== 'string') {
          return 'Media URL is required'
        }
        // Validate URL format
        try {
          // Allow relative URLs (starting with /) or full URLs
          if (value.startsWith('/')) {
            return true
          }
          new URL(value)
          return true
        } catch {
          return 'Please enter a valid URL (e.g., https://example.com/image.jpg or /media/image.jpg)'
        }
      },
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Describe the image for accessibility and SEO',
        placeholder: 'A beautiful Kawai grand piano in a concert hall',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Optional caption to display below the media',
        placeholder: 'Photo by John Doe',
      },
    },
  ],
}
