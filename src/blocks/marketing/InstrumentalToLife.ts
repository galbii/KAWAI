import type { Block } from 'payload'
import { imageField } from '@/lib/payload/fields/media'
import { videoTrackingField, ctaTrackingField, trackImpressionField } from '@/lib/payload/fields/tracking'

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
      name: 'sectionLabel',
      type: 'text',
      required: true,
      defaultValue: 'Instrumental To Life',
      admin: {
        description: 'Small uppercase section label displayed above the main content (e.g., "INSTRUMENTAL TO LIFE", "ARTIST STORIES", "PERFORMANCE SERIES")',
        placeholder: 'Instrumental To Life',
      },
    },
    {
      name: 'subheading',
      type: 'text',
      defaultValue: 'Join Kawai artists exploring a modern take on music, performance, and the piano technology.',
      admin: {
        description: 'Subheading or tagline displayed below the Kawai logo',
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
          name: 'eyebrowText',
          type: 'text',
          label: 'Eyebrow Label',
          required: false,
          admin: {
            description: 'Small uppercase text displayed above the video title (e.g., "ARTIST SPOTLIGHT", "BEHIND THE SCENES"). Leave empty to use the global section label.',
            placeholder: 'Artist Spotlight',
          },
        },
        {
          name: 'ctaText',
          type: 'text',
          label: 'CTA Button Text',
          required: false,
          admin: {
            description: 'Optional call-to-action button text displayed below the video description. Leave empty to hide the button for this video.',
            placeholder: 'Learn More',
          },
        },
        {
          name: 'ctaUrl',
          type: 'text',
          label: 'CTA Link URL',
          required: false,
          admin: {
            description: 'Button destination URL - can be internal (/products/sk-ex) or external (https://example.com). Required when CTA text is provided.',
            placeholder: '/products/sk-ex',
            condition: (_, siblingData) => Boolean(siblingData?.ctaText),
          },
          validate: (value: string | null | undefined, { siblingData }: any) => {
            // If CTA text is provided, CTA URL is required
            if (siblingData?.ctaText && !value) {
              return 'CTA URL is required when CTA text is provided'
            }
            return true
          },
        },
        {
          name: 'ctaVariant',
          type: 'select',
          label: 'CTA Button Style',
          required: false,
          defaultValue: 'default',
          options: [
            { label: 'Primary (Red background)', value: 'default' },
            { label: 'Secondary (White outline)', value: 'outline' },
          ],
          admin: {
            description: 'Visual style of the CTA button',
            condition: (_, siblingData) => Boolean(siblingData?.ctaText),
          },
        },
        {
          name: 'ctaOpenInNewTab',
          type: 'checkbox',
          label: 'Open Link in New Tab',
          defaultValue: false,
          admin: {
            description: 'Check this to open the link in a new browser tab. Recommended for external links to keep users on your site.',
            condition: (_, siblingData) => Boolean(siblingData?.ctaText),
          },
        },
        {
          name: 'secondaryCtaText',
          type: 'text',
          label: 'Secondary CTA Button Text',
          required: false,
          admin: {
            description: 'Optional secondary call-to-action button displayed alongside the primary CTA. Renders as a white outline button.',
            placeholder: 'Watch More',
          },
        },
        {
          name: 'secondaryCtaUrl',
          type: 'text',
          label: 'Secondary CTA Link URL',
          required: false,
          admin: {
            description: 'Destination URL for the secondary button. Can be internal (/artists) or external.',
            placeholder: '/artists',
            condition: (_, siblingData) => Boolean(siblingData?.secondaryCtaText),
          },
          validate: (value: string | null | undefined, { siblingData }: any) => {
            if (siblingData?.secondaryCtaText && !value) {
              return 'Secondary CTA URL is required when secondary CTA text is provided'
            }
            return true
          },
        },
        {
          name: 'secondaryCtaOpenInNewTab',
          type: 'checkbox',
          label: 'Open Secondary Link in New Tab',
          defaultValue: false,
          admin: {
            description: 'Open the secondary CTA link in a new browser tab.',
            condition: (_, siblingData) => Boolean(siblingData?.secondaryCtaText),
          },
        },
        videoTrackingField(),
        ctaTrackingField(),
      ],
      admin: {
        description: 'Add up to 6 YouTube videos. Each video displays separately with its own title, description, and optional call-to-action button.',
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
    trackImpressionField({ trackViewport: true, viewportThreshold: 0.3 }),
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
