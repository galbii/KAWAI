import type { Block } from 'payload'
import { imageField } from '@/lib/payload/fields/media'

export const InstrumentalToLife: Block = {
  slug: 'marketing-i2l',
  labels: {
    singular: '🎹 Instrumental To Life',
    plural: 'Instrumental To Life Blocks',
  },
  imageURL: 'https://via.placeholder.com/600x400?text=Instrumental+To+Life',
  imageAltText:
    'Premium video carousel showcasing YouTube videos with Kawai branding. Features elegant transitions, Japanese-inspired minimalism, and full-screen video viewing. Perfect for brand storytelling and product showcases.',
  interfaceName: 'MarketingI2LBlock',
  admin: {
    group: '🎯 Marketing',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Instrumental To Life',
      admin: {
        description: 'Main section heading (default: "Instrumental To Life")',
      },
    },
    {
      name: 'subheading',
      type: 'text',
      defaultValue: 'Join Kawai artists exploring a modern take on music, performance, and the piano technology.',
      admin: {
        description: 'Subheading or tagline displayed below the logo',
        placeholder: 'Join Kawai artists exploring a modern take on music, performance, and the piano technology.',
      },
    },
    imageField('logo', {
      required: false,
      admin: {
        description:
          'Custom Kawai logo image (optional). If not provided, the default Kawai logo will be used. Recommended: SVG or PNG with transparent background, minimum 200px width.',
      },
    }),
    {
      name: 'videos',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 6,
      labels: {
        singular: 'Video',
        plural: 'Videos',
      },
      fields: [
        {
          name: 'youtubeUrl',
          type: 'text',
          required: true,
          admin: {
            description:
              'YouTube video URL (e.g., https://youtube.com/watch?v=dQw4w9WgXcQ or https://youtu.be/dQw4w9WgXcQ)',
            placeholder: 'https://youtube.com/watch?v=...',
          },
          validate: (value: string | null | undefined) => {
            if (!value) return 'YouTube URL is required'

            // Validate YouTube URL format
            const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/
            if (!youtubeRegex.test(value)) {
              return 'Please enter a valid YouTube URL'
            }

            return true
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Video title displayed in the card',
            placeholder: 'Shigeru Kawai SK-EX: A Masterpiece in Motion',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          maxLength: 200,
          admin: {
            description: 'Short video description (max 200 characters)',
            placeholder: 'Witness the meticulous craftsmanship that goes into every Shigeru Kawai piano...',
          },
        },
        imageField('thumbnailOverride', {
          required: false,
          admin: {
            description:
              'Optional custom thumbnail image. If not provided, YouTube default thumbnail will be used. Recommended: 16:9 aspect ratio, minimum 1280x720px.',
          },
        }),
        {
          name: 'category',
          type: 'select',
          required: true,
          defaultValue: 'performance',
          options: [
            { label: 'Performance', value: 'performance' },
            { label: 'Craftsmanship', value: 'craftsmanship' },
            { label: 'Artist Story', value: 'artist-story' },
            { label: 'Product Demo', value: 'product-demo' },
            { label: 'Behind The Scenes', value: 'behind-scenes' },
            { label: 'Education', value: 'education' },
          ],
          admin: {
            description: 'Video category for filtering and organization',
          },
        },
        {
          name: 'duration',
          type: 'text',
          admin: {
            description: 'Video duration displayed on thumbnail (e.g., "3:45")',
            placeholder: '3:45',
          },
        },
        {
          name: 'ctaText',
          type: 'text',
          required: false,
          admin: {
            description: 'Optional call-to-action button text (e.g., "Learn More", "Explore This Piano")',
            placeholder: 'Learn More',
          },
        },
        {
          name: 'ctaUrl',
          type: 'text',
          required: false,
          admin: {
            description: 'CTA button destination URL (e.g., /products/sk-ex, /pianos/grand). Required if CTA text is provided.',
            placeholder: '/products/sk-ex',
            condition: (data: any) => Boolean(data?.ctaText),
          },
          validate: (value: string | null | undefined, { data }: { data: any }) => {
            // If CTA text is provided, CTA URL is required
            if (data?.ctaText && !value) {
              return 'CTA URL is required when CTA text is provided'
            }
            return true
          },
        },
        {
          name: 'ctaVariant',
          type: 'select',
          required: false,
          defaultValue: 'default',
          options: [
            { label: 'Primary (Red background)', value: 'default' },
            { label: 'Secondary (Outline)', value: 'outline' },
          ],
          admin: {
            description: 'CTA button style variant',
            condition: (data: any) => Boolean(data?.ctaText),
          },
        },
        {
          name: 'ctaOpenInNewTab',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Open CTA link in a new tab (recommended for external links)',
            condition: (data: any) => Boolean(data?.ctaText),
          },
        },
      ],
      admin: {
        description: 'Add up to 6 YouTube videos for the carousel. Each video can have its own call-to-action button.',
      },
    },
    {
      name: 'settings',
      type: 'group',
      fields: [
        {
          name: 'layout',
          type: 'select',
          required: true,
          defaultValue: 'carousel',
          options: [
            { label: 'Carousel (Side-scroll)', value: 'carousel' },
            { label: 'Grid (2 columns)', value: 'grid-2' },
            { label: 'Grid (3 columns)', value: 'grid-3' },
          ],
          admin: {
            description: 'Display layout for videos',
          },
        },
        {
          name: 'autoScroll',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Enable automatic scrolling through videos (carousel mode only)',
            condition: (data: any) => {
              const layout = data?.settings?.layout || data?.layout
              return layout === 'carousel'
            },
          },
        },
        {
          name: 'autoScrollDuration',
          type: 'number',
          required: false,
          defaultValue: 5000,
          min: 3000,
          max: 15000,
          admin: {
            description: 'Auto-scroll duration in milliseconds (3-15 seconds)',
            step: 1000,
            condition: (data: any) => {
              const autoScroll = data?.settings?.autoScroll || data?.autoScroll
              return autoScroll === true
            },
          },
        },
        {
          name: 'enableKeyboardNav',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable keyboard navigation (arrow keys) for carousel',
          },
        },
      ],
      admin: {
        description: 'Carousel behavior and display settings',
      },
    },
    {
      name: 'styling',
      type: 'group',
      fields: [
        {
          name: 'theme',
          type: 'select',
          required: true,
          defaultValue: 'dark',
          options: [
            { label: 'Dark Theme (Black background)', value: 'dark' },
            { label: 'Light Theme (Pearl background)', value: 'light' },
          ],
          admin: {
            description: 'Color theme for the section',
          },
        },
        {
          name: 'showCategoryBadges',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Display category badges on video cards',
          },
        },
        {
          name: 'showDuration',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Display video duration on thumbnails',
          },
        },
      ],
      admin: {
        description: 'Visual styling options',
      },
    },
  ],
}
