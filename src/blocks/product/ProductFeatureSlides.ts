import type { Block } from 'payload'
import { imageField, videoField } from '@/lib/payload/fields'

export const ProductFeatureSlides: Block = {
  slug: 'product-feature-slides',
  labels: {
    singular: '🎬 Feature Slides',
    plural: 'Feature Slides',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Feature+Slides',
  imageAltText:
    'Scroll-driven fullscreen feature showcase — each feature becomes its own immersive slide, triggered by scroll.',
  interfaceName: 'ProductFeatureSlidesBlock',
  fields: [
    // Optional section header
    {
      name: 'sectionHeader',
      type: 'group',
      admin: {
        description: 'Optional section label shown above the slides',
      },
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          admin: {
            description: 'Small uppercase label above the heading (e.g. "Key Features")',
          },
        },
        {
          name: 'heading',
          type: 'text',
          admin: {
            description: 'Main section heading',
          },
        },
        {
          name: 'subheading',
          type: 'text',
          admin: {
            description: 'Optional supporting subheading',
          },
        },
      ],
    },

    // Features array — each becomes one fullscreen slide
    {
      name: 'features',
      type: 'array',
      maxRows: 10,
      labels: {
        singular: 'Feature Slide',
        plural: 'Feature Slides',
      },
      admin: {
        description: 'Each feature becomes one fullscreen scroll-driven slide. Lead with media.',
      },
      fields: [
        // Feature label / tag
        {
          name: 'tag',
          type: 'text',
          admin: {
            description: 'Small badge label (e.g. "Innovation", "Craftsmanship", "Sound")',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Feature headline shown on the slide',
          },
        },
        {
          name: 'subtitle',
          type: 'text',
          admin: {
            description: 'Optional supporting line below the title',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Feature description — keep to 2–3 sentences for best readability',
          },
        },

        // Media type selection
        {
          name: 'mediaType',
          type: 'select',
          defaultValue: 'image',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'YouTube Video', value: 'youtube' },
            { label: 'Video File', value: 'video' },
          ],
          admin: {
            description: 'Choose the media type for this slide — image or video fills the background',
          },
        },

        // Image (shown when mediaType === 'image')
        imageField('image', {
          admin: {
            description: 'Feature background image (recommended 1920×1080px or larger)',
            condition: (_data: unknown, siblingData: Record<string, unknown>) =>
              siblingData?.mediaType === 'image' || !siblingData?.mediaType,
          },
        }),

        // YouTube URL (shown when mediaType === 'youtube')
        {
          name: 'youtubeUrl',
          type: 'text',
          admin: {
            description: 'YouTube URL (auto-plays muted in the background)',
            condition: (_data: unknown, siblingData: Record<string, unknown>) =>
              siblingData?.mediaType === 'youtube',
          },
        },

        // Video file (shown when mediaType === 'video')
        videoField('video', {
          admin: {
            description: 'Video file upload — MP4 recommended, keep under 20MB',
            condition: (_data: unknown, siblingData: Record<string, unknown>) =>
              siblingData?.mediaType === 'video',
          },
        }),

        // Overlay darkness over media for text contrast
        {
          name: 'overlayOpacity',
          type: 'number',
          min: 0,
          max: 80,
          defaultValue: 40,
          admin: {
            description: 'Overlay darkness (0–80). Increase for better text contrast.',
          },
        },

        // Copy side override
        {
          name: 'contentSide',
          type: 'select',
          defaultValue: 'default',
          options: [
            { label: 'Default (alternates left / right)', value: 'default' },
            { label: 'Left',  value: 'left' },
            { label: 'Right', value: 'right' },
          ],
          admin: {
            description: 'Override which side the copy appears on. Leave as Default to alternate automatically.',
          },
        },

        // Optional CTA
        {
          name: 'cta',
          type: 'group',
          admin: {
            description: 'Optional call-to-action link for this slide',
          },
          fields: [
            {
              name: 'text',
              type: 'text',
              admin: {
                description: 'Button label (leave empty to hide)',
              },
            },
            {
              name: 'link',
              type: 'text',
              admin: {
                description: 'Destination URL',
                condition: (_data: unknown, siblingData: Record<string, unknown>) =>
                  Boolean(siblingData?.text),
              },
            },
            {
              name: 'openInNewTab',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Open link in a new tab',
                condition: (_data: unknown, siblingData: Record<string, unknown>) =>
                  Boolean(siblingData?.text),
              },
            },
          ],
        },
      ],
    },

    // Global theme
    {
      name: 'theme',
      type: 'select',
      defaultValue: 'dark',
      options: [
        { label: 'Dark (white text)', value: 'dark' },
        { label: 'Light (dark text)', value: 'light' },
      ],
      admin: {
        description: 'Text colour theme — applied across all slides',
      },
    },

    // Progress indicator style
    {
      name: 'progressIndicator',
      type: 'select',
      defaultValue: 'dots',
      options: [
        { label: 'Dots', value: 'dots' },
        { label: 'Lines', value: 'lines' },
        { label: 'Numbers', value: 'numbers' },
        { label: 'None', value: 'none' },
      ],
      admin: {
        description: 'Progress indicator style shown on the side of the slides',
      },
    },
  ],
}
