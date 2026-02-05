import type { Block } from 'payload'

export const ArtistCarousel: Block = {
  slug: 'marketing-artist-carousel',
  labels: {
    singular: '🎹 Artist Carousel',
    plural: 'Artist Carousels',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Artist+Carousel',
  imageAltText: 'Artist carousel showcasing KAWAI artists with elegant transitions and keyboard navigation. Japanese-inspired minimalist design.',
  interfaceName: 'MarketingArtistCarouselBlock',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      required: false,
      admin: {
        description: 'Small text above the heading (e.g., "Instrumental to Life")',
        placeholder: 'Instrumental to Life',
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: false,
      admin: {
        description: 'Main heading (e.g., "Featured Artists", "World-Class Performers")',
        placeholder: 'Featured Artists',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Supporting text below the heading',
        placeholder: 'Discover the talented artists who bring KAWAI pianos to life',
      },
    },
    {
      name: 'artists',
      type: 'relationship',
      relationTo: 'artists',
      required: true,
      hasMany: true,
      minRows: 1,
      maxRows: 12,
      admin: {
        description: 'Select artists to feature in the carousel (up to 12). Artists will display in the order selected.',
      },
      // Limit depth to avoid over-fetching nested data
      maxDepth: 2,
    },
    {
      name: 'displayMode',
      type: 'select',
      defaultValue: 'card',
      options: [
        { label: 'Card View (Image + Bio)', value: 'card' },
        { label: 'Featured View (Large Image + Full Info)', value: 'featured' },
        { label: 'Minimal (Name + Genre)', value: 'minimal' },
      ],
      admin: {
        description: 'How artist information should be displayed',
      },
    },
    {
      name: 'showBio',
      type: 'select',
      defaultValue: 'short',
      options: [
        { label: 'Short Bio', value: 'short' },
        { label: 'Full Bio', value: 'full' },
        { label: 'No Bio', value: 'none' },
      ],
      admin: {
        description: 'Which biography field to display',
        condition: (data: any) => data.displayMode === 'card' || data.displayMode === 'featured',
      },
    },
    {
      name: 'showSocialLinks',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Display artist social media links',
      },
    },
    {
      name: 'showGenre',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Display artist genre badge',
      },
    },
    {
      name: 'showInstrument',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Display artist instrument type',
      },
    },
    {
      name: 'showRecentWork',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Display recent work/performances section (subtle CTA)',
      },
    },
    {
      name: 'maxRecentWorkItems',
      type: 'number',
      defaultValue: 2,
      min: 1,
      max: 3,
      admin: {
        description: 'Maximum number of recent work items to display per artist',
        condition: (data: any) => data.showRecentWork === true,
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
            description: 'Automatically advance to next artist after a delay',
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
            description: 'Loop back to first artist after the last one',
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
          name: 'colorScheme',
          type: 'select',
          defaultValue: 'kawai-red',
          options: [
            { label: '🔴 KAWAI Red - Classic Brand', value: 'kawai-red' },
            { label: '✨ Gold Luxury - Premium Elegance', value: 'gold-luxury' },
            { label: '🌊 Ocean Blue - Modern & Clean', value: 'ocean-blue' },
            { label: '🌅 Sunset Warmth - Inviting & Vibrant', value: 'sunset-warmth' },
            { label: '🌿 Sage Serenity - Natural & Calm', value: 'sage-serenity' },
            { label: '🌸 Cherry Blossom - Delicate & Refined', value: 'cherry-blossom' },
          ],
          admin: {
            description: 'Choose a color scheme for the heading and carousel styling. Each scheme has unique eyebrow, heading gradient, and accent colors.',
          },
        },
        {
          name: 'theme',
          type: 'select',
          defaultValue: 'light',
          options: [
            { label: 'Light Background', value: 'light' },
            { label: 'Dark Background', value: 'dark' },
            { label: 'Transparent Background', value: 'transparent' },
          ],
          admin: {
            description: 'Background theme for the carousel section',
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
            placeholder: 'View All Artists',
            condition: (data: any, siblingData: any) => siblingData?.enabled === true,
          },
        },
        {
          name: 'url',
          type: 'text',
          required: false,
          admin: {
            description: 'CTA button link URL',
            placeholder: '/artists',
            condition: (data: any, siblingData: any) => siblingData?.enabled === true,
          },
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          defaultValue: false,
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
