import type { Block } from 'payload'

export const InstagramCarousel: Block = {
  slug: 'marketing-instagram-carousel',
  labels: {
    singular: '📷 Instagram Carousel',
    plural: 'Instagram Carousels',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Instagram+Carousel',
  imageAltText: 'Instagram carousel with elegant transitions and keyboard navigation. Displays Instagram posts/videos with Japanese-inspired minimalist design.',
  interfaceName: 'MarketingInstagramCarouselBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: false,
      admin: {
        description: 'Optional heading above the carousel (e.g., "Follow Our Journey", "Artist Spotlights")',
        placeholder: 'Follow Our Journey',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Optional supporting text below the heading',
        placeholder: 'Experience the Kawai community through moments shared on Instagram',
      },
    },
    {
      name: 'instagramHandle',
      type: 'text',
      required: false,
      admin: {
        description: 'Optional Instagram handle to display (e.g., "@kawaipiano")',
        placeholder: '@kawaipiano',
      },
    },
    {
      name: 'posts',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 12,
      labels: {
        singular: 'Instagram Post',
        plural: 'Instagram Posts',
      },
      fields: [
        {
          name: 'instagramUrl',
          type: 'text',
          required: true,
          admin: {
            description: 'Instagram post or reel URL (e.g., https://www.instagram.com/p/ABC123/ or https://www.instagram.com/reels/ABC123/)',
            placeholder: 'https://www.instagram.com/reels/ABC123/',
          },
          validate: (value: string | null | undefined) => {
            if (!value) return 'Instagram URL is required'

            // Validate Instagram URL format (supports /p/, /reels/, /reel/, /tv/)
            const instagramUrlPattern = /^https?:\/\/(www\.)?instagram\.com\/(p|reels?|tv)\/[\w-]+\/?$/

            if (!instagramUrlPattern.test(value)) {
              return 'Please provide a valid Instagram post URL (e.g., https://www.instagram.com/p/ABC123/ or https://www.instagram.com/reels/ABC123/)'
            }

            return true
          },
        },
        {
          name: 'caption',
          type: 'textarea',
          required: false,
          admin: {
            description: 'Optional caption or context for this post',
            placeholder: 'Beautiful performance at Carnegie Hall...',
          },
        },
        {
          name: 'category',
          type: 'select',
          required: false,
          options: [
            { label: 'Performance', value: 'performance' },
            { label: 'Artist', value: 'artist' },
            { label: 'Education', value: 'education' },
            { label: 'Craftsmanship', value: 'craftsmanship' },
            { label: 'Community', value: 'community' },
            { label: 'Event', value: 'event' },
          ],
          admin: {
            description: 'Optional category badge for this post',
          },
        },
      ],
      admin: {
        description: 'Add Instagram posts (up to 12). Posts will display in the order added.',
      },
    },
    {
      name: 'settings',
      type: 'group',
      fields: [
        {
          name: 'autoPlay',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Automatically advance to next post after a delay',
          },
        },
        {
          name: 'autoPlayDuration',
          type: 'number',
          defaultValue: 8000,
          min: 3000,
          max: 30000,
          admin: {
            description: 'Auto-play duration in milliseconds (3-30 seconds)',
            step: 1000,
            condition: (data: any, siblingData: any) => siblingData?.autoPlay === true,
          },
        },
        {
          name: 'enableLoop',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Loop back to first post after the last one',
          },
        },
        {
          name: 'showNavigationArrows',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show previous/next arrow buttons',
          },
        },
        {
          name: 'showProgressIndicator',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show progress dots or counter below carousel',
          },
        },
        {
          name: 'enableKeyboardNav',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable arrow key navigation',
          },
        },
        {
          name: 'enableTouchSwipe',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable touch/swipe navigation on mobile',
          },
        },
      ],
      admin: {
        description: 'Carousel behavior and interaction settings',
      },
    },
    {
      name: 'styling',
      type: 'group',
      fields: [
        {
          name: 'theme',
          type: 'select',
          defaultValue: 'light',
          options: [
            { label: 'Light (Pearl Background)', value: 'light' },
            { label: 'Dark (Charcoal Background)', value: 'dark' },
            { label: 'Red Accent', value: 'red' },
            { label: 'Transparent', value: 'transparent' },
          ],
          admin: {
            description: 'Color theme for the carousel section',
          },
        },
        {
          name: 'layout',
          type: 'select',
          defaultValue: 'centered',
          options: [
            { label: 'Centered Focus', value: 'centered' },
            { label: 'Side Preview', value: 'side-preview' },
            { label: 'Full Width', value: 'full-width' },
          ],
          admin: {
            description: 'Layout style for the carousel',
          },
        },
        {
          name: 'spacing',
          type: 'select',
          defaultValue: 'comfortable',
          options: [
            { label: 'Compact', value: 'compact' },
            { label: 'Comfortable', value: 'comfortable' },
            { label: 'Spacious', value: 'spacious' },
          ],
          admin: {
            description: 'Vertical spacing around the carousel',
          },
        },
      ],
      admin: {
        description: 'Visual styling options',
      },
    },
    {
      name: 'ctaButton',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show a call-to-action button below the carousel',
          },
        },
        {
          name: 'text',
          type: 'text',
          required: false,
          admin: {
            description: 'CTA button text',
            placeholder: 'Follow Us on Instagram',
            condition: (data: any, siblingData: any) => siblingData?.enabled === true,
          },
        },
        {
          name: 'url',
          type: 'text',
          required: false,
          admin: {
            description: 'CTA button link URL',
            placeholder: 'https://instagram.com/kawaipiano',
            condition: (data: any, siblingData: any) => siblingData?.enabled === true,
          },
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Open link in new tab',
            condition: (data: any, siblingData: any) => siblingData?.enabled === true,
          },
        },
      ],
      admin: {
        description: 'Optional call-to-action button',
      },
    },
  ],
}
