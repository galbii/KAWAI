import type { Block } from 'payload'
import type { Media } from '@/payload-types'
import { imageField } from '@/lib/payload/fields/media'

export const TechnicalShowcase: Block = {
  slug: 'marketing-technical-showcase',
  labels: {
    singular: '🎬 Technical Showcase',
    plural: 'Technical Showcase Blocks',
  },
  imageURL: 'https://via.placeholder.com/600x400?text=Technical+Showcase',
  imageAltText:
    'Video demonstration with product comparison table below. Features YouTube video embed and side-by-side product specifications. Perfect for product launches and technology showcases.',
  interfaceName: 'MarketingTechnicalShowcaseBlock',
  admin: {
    group: '🎯 Marketing',
  },
  fields: [
    // Video Section
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: {
        description: 'Main heading (e.g., "Grand Feel III Action Technology")',
        placeholder: 'Revolutionary Piano Technology',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      maxLength: 300,
      admin: {
        description: 'Description about the products being showcased (max 300 characters)',
        placeholder:
          'Experience the most advanced wooden-key action in a digital piano, with let-off simulation and counterweights.',
      },
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'YouTube video URL (e.g., https://youtube.com/watch?v=... or https://youtu.be/...)',
        placeholder: 'https://youtube.com/watch?v=...',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return 'YouTube URL is required'

        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/
        if (!youtubeRegex.test(value)) {
          return 'Please enter a valid YouTube URL'
        }

        return true
      },
    },
    imageField('videoThumbnail', {
      required: false,
      admin: {
        description:
          'Optional custom video thumbnail. If not provided, YouTube default will be used. Recommended: 16:9 aspect ratio, minimum 1280x720px.',
      },
    }),
    {
      name: 'videoDuration',
      type: 'text',
      admin: {
        description: 'Video duration displayed on thumbnail (e.g., "3:45", "12:30")',
        placeholder: '3:45',
      },
    },
    // Products Section
    {
      name: 'products',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 4,
      labels: {
        singular: 'Product',
        plural: 'Products',
      },
      admin: {
        description: 'Add 2-4 products to compare side-by-side below the video',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Product name (e.g., "CA-901", "CN-301")',
            placeholder: 'CA-901',
          },
        },
        {
          name: 'imageUrl',
          type: 'text',
          admin: {
            description: 'Product image URL (e.g., https://example.com/image.jpg) - Takes priority over uploaded image',
            placeholder: 'https://example.com/product-image.jpg',
          },
        },
        imageField('image', {
          required: false,
          admin: {
            description: 'Fallback: Upload product image if URL not provided (recommended: square aspect ratio, minimum 600x600px)',
          },
          validate: (value: unknown, { siblingData }: { siblingData: any }) => {
            // Require either imageUrl or uploaded image
            if (!siblingData?.imageUrl && !value) {
              return 'Either Image URL or uploaded image is required'
            }
            return true
          },
        }),
        {
          name: 'url',
          type: 'text',
          admin: {
            description: 'Product page URL (e.g., "/products/ca-901")',
            placeholder: '/products/ca-901',
          },
        },
        {
          name: 'badge',
          type: 'text',
          admin: {
            description: 'Optional badge text (e.g., "Popular", "Best Value", "Premium")',
            placeholder: 'Popular',
          },
        },
        {
          name: 'features',
          type: 'array',
          required: true,
          minRows: 1,
          maxRows: 12,
          labels: {
            singular: 'Feature',
            plural: 'Features',
          },
          admin: {
            description: 'Technical specifications and features for this product',
          },
          fields: [
            {
              name: 'text',
              type: 'textarea',
              required: true,
              maxLength: 200,
              admin: {
                description: 'Feature description (e.g., "Grand Feel III Wooden-Key Action", "88 weighted keys", "256-note polyphony")',
                placeholder: 'Grand Feel III Wooden-Key Action',
              },
            },
            {
              name: 'highlight',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Highlight this feature with gold accent',
              },
            },
          ],
        },
      ],
    },
    // Settings
    {
      name: 'settings',
      type: 'group',
      fields: [
        {
          name: 'theme',
          type: 'select',
          required: true,
          defaultValue: 'dark',
          options: [
            { label: 'Dark Theme (Charcoal background)', value: 'dark' },
            { label: 'Light Theme (Pearl background)', value: 'light' },
          ],
          admin: {
            description: 'Color theme for the block',
          },
        },
        {
          name: 'enableAnimations',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable scroll-triggered animations',
          },
        },
      ],
      admin: {
        description: 'Block settings',
      },
    },
  ],
}
