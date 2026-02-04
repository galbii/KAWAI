import type { Block } from 'payload'
import { imageField } from '@/lib/payload/fields/media'

export const HeroCarousel: Block = {
  slug: 'marketing-hero-carousel',
  labels: {
    singular: '🎠 Hero Carousel',
    plural: 'Hero Carousels',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Hero+Carousel',
  imageAltText: 'Full-screen hero carousel with auto-play, touch navigation, and rich content slides. Perfect for hero sections, featured content, and announcements.',
  interfaceName: 'MarketingHeroCarouselBlock',
  fields: [
    {
      name: 'slides',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 10,
      labels: {
        singular: 'Slide',
        plural: 'Slides',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Main headline for this slide',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Supporting description text',
          },
        },
        imageField('backgroundImage', {
          required: false,
          admin: {
            description: 'Background image for this slide (recommended: 1920x1080px or larger). Click "Browse Media Library" to select from existing images or upload new ones.',
          },
        }),
        {
          name: 'category',
          type: 'select',
          required: true,
          defaultValue: 'news',
          options: [
            { label: 'News', value: 'news' },
            { label: 'Events', value: 'events' },
            { label: 'Promotions', value: 'promotions' },
            { label: 'New Arrivals', value: 'new-arrivals' },
            { label: 'Education', value: 'education' },
            { label: 'Announcement', value: 'announcement' },
          ],
          admin: {
            description: 'Category badge displayed on the slide',
          },
        },
        {
          name: 'ctaText',
          type: 'text',
          required: false,
          admin: {
            description: 'Call-to-action button text (e.g., "Learn More", "Shop Now", "Explore"). Leave empty to hide button.',
            placeholder: 'Learn More',
          },
        },
        {
          name: 'ctaLink',
          type: 'text',
          required: false,
          admin: {
            description: 'Call-to-action link URL - Required if CTA text is provided. Use internal paths (/products/ca-901) or external URLs (https://...)',
            placeholder: '/pianos/digital',
            condition: (data: any, siblingData: any) => {
              const ctaText = siblingData?.ctaText || data?.ctaText
              return Boolean(ctaText)
            },
          },
          validate: (value: string | null | undefined, { siblingData }: { siblingData: any }) => {
            // If ctaText is provided, ctaLink is required
            if (siblingData?.ctaText && !value) {
              return 'CTA Link is required when CTA Text is provided'
            }
            return true
          },
        },
        {
          name: 'ctaOpenInNewTab',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Open CTA link in a new tab (recommended for external links)',
            condition: (data: any, siblingData: any) => {
              const ctaText = siblingData?.ctaText || data?.ctaText
              const ctaLink = siblingData?.ctaLink || data?.ctaLink
              return Boolean(ctaText && ctaLink)
            },
          },
        },
      ],
      admin: {
        description: 'Add up to 10 carousel slides with images, titles, and call-to-actions',
      },
    },
    {
      name: 'settings',
      type: 'group',
      fields: [
        {
          name: 'autoPlayDuration',
          type: 'number',
          required: true,
          defaultValue: 7000,
          min: 2000,
          max: 30000,
          admin: {
            description: 'Auto-play duration in milliseconds (e.g., 7000 = 7 seconds per slide)',
            step: 1000,
          },
        },
        {
          name: 'enableAutoPlay',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable automatic slide transitions',
          },
        },
        {
          name: 'enableLoop',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Loop back to first slide after the last slide',
          },
        },
        {
          name: 'enableKeyboardNav',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable keyboard navigation (arrow keys and spacebar)',
          },
        },
        {
          name: 'enableTouchSwipe',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable touch/swipe navigation on mobile devices',
          },
        },
        {
          name: 'showNavigationDots',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show navigation dots at the bottom',
          },
        },
        {
          name: 'showPlayPauseButton',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show play/pause button for auto-play control',
          },
        },
        {
          name: 'enableKenBurnsEffect',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable subtle zoom animation on background images (Ken Burns effect)',
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
          name: 'height',
          type: 'select',
          defaultValue: 'screen',
          options: [
            { label: 'Full Screen', value: 'screen' },
            { label: 'Large (900px)', value: 'large' },
            { label: 'Medium (700px)', value: 'medium' },
            { label: 'Small (500px)', value: 'small' },
          ],
          admin: {
            description: 'Carousel height',
          },
        },
        {
          name: 'contentPosition',
          type: 'select',
          defaultValue: 'bottom-left',
          options: [
            { label: 'Bottom Left', value: 'bottom-left' },
            { label: 'Bottom Center', value: 'bottom-center' },
            { label: 'Bottom Right', value: 'bottom-right' },
            { label: 'Center Left', value: 'center-left' },
            { label: 'Center', value: 'center' },
            { label: 'Center Right', value: 'center-right' },
            { label: 'Top Left', value: 'top-left' },
            { label: 'Top Center', value: 'top-center' },
            { label: 'Top Right', value: 'top-right' },
          ],
          admin: {
            description: 'Position of the text content overlay',
          },
        },
        {
          name: 'overlayStyle',
          type: 'select',
          defaultValue: 'glassmorphism',
          options: [
            { label: 'Glassmorphism (Frosted Glass)', value: 'glassmorphism' },
            { label: 'Gradient Overlay', value: 'gradient' },
            { label: 'Solid Background', value: 'solid' },
            { label: 'None (Text Only)', value: 'none' },
          ],
          admin: {
            description: 'Style of content overlay/background',
          },
        },
      ],
      admin: {
        description: 'Visual styling and layout options',
      },
    },
  ],
}
