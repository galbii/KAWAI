import type { Block } from 'payload'
import { imageField, videoField } from '@/lib/payload/fields/media'

export const ProductHeroCarousel: Block = {
  slug: 'product-hero-carousel',
  labels: {
    singular: '🎬 Product Hero Carousel',
    plural: 'Product Hero Carousels',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Product+Hero+Carousel',
  imageAltText:
    'Media-first hero carousel — images, uploaded videos, or YouTube with zoom control. Clean visual presentation for product launches and premium showcases.',
  interfaceName: 'ProductHeroCarouselBlock',
  fields: [
    {
      name: 'slides',
      type: 'array',
      minRows: 0,
      maxRows: 10,
      labels: { singular: 'Slide', plural: 'Slides' },
      admin: {
        description: 'Additional slides appended after the Homepage news items. Leave empty to show only homepage news.',
      },
      fields: [
        // ── MEDIA TYPE ──────────────────────────────────────────────────
        {
          name: 'mediaType',
          type: 'select',
          required: true,
          defaultValue: 'image',
          options: [
            { label: '🖼️ Image', value: 'image' },
            { label: '🎬 Uploaded Video', value: 'video' },
            { label: '▶️ YouTube', value: 'youtube' },
          ],
          admin: {
            description: 'Choose the media type for this slide',
          },
        },

        // ── IMAGE ───────────────────────────────────────────────────────
        imageField('image', {
          required: false,
          admin: {
            description:
              'Background image for this slide (recommended: 1920×1080px or larger)',
            condition: (_data: any, siblingData: any) =>
              !siblingData?.mediaType || siblingData?.mediaType === 'image',
          },
        }),

        // ── UPLOADED VIDEO ──────────────────────────────────────────────
        videoField('videoFile', {
          required: false,
          admin: {
            description: 'Uploaded video file (MP4 recommended for best browser support)',
            condition: (_data: any, siblingData: any) =>
              siblingData?.mediaType === 'video',
          },
        }),

        // ── YOUTUBE ─────────────────────────────────────────────────────
        {
          name: 'youtubeUrl',
          type: 'text',
          required: false,
          admin: {
            description:
              'YouTube video URL — supports youtube.com/watch?v=..., youtu.be/..., or embed URLs',
            placeholder: 'https://www.youtube.com/watch?v=...',
            condition: (_data: any, siblingData: any) =>
              siblingData?.mediaType === 'youtube',
          },
        },
        {
          name: 'youtubeZoom',
          type: 'number',
          required: false,
          defaultValue: 1.15,
          min: 1.0,
          max: 2.5,
          admin: {
            description:
              'Zoom level for the YouTube background (1.0 = no zoom, 1.15 = default — crops YouTube UI from edges, 1.5 = tight crop)',
            step: 0.05,
            condition: (_data: any, siblingData: any) =>
              siblingData?.mediaType === 'youtube',
          },
        },

        // ── COPY ─────────────────────────────────────────────────────────
        {
          name: 'eyebrow',
          type: 'text',
          required: false,
          admin: {
            description:
              'Small label displayed above the title (e.g., "New Arrival", "Limited Edition")',
            placeholder: 'New Arrival',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: false,
          admin: {
            description:
              'Main headline — leave empty for a pure visual, text-free slide',
            placeholder: 'The Grand Experience',
          },
        },
        {
          name: 'subtitle',
          type: 'textarea',
          required: false,
          admin: {
            description: 'Supporting subtitle or short description',
          },
        },

        // ── CTA ──────────────────────────────────────────────────────────
        {
          name: 'ctaText',
          type: 'text',
          required: false,
          admin: {
            description: 'Call-to-action button text — leave empty to hide the button',
            placeholder: 'Explore Now',
          },
        },
        {
          name: 'ctaLink',
          type: 'text',
          required: false,
          admin: {
            description:
              'CTA destination URL — required when CTA text is set. Use internal paths (/products/sk-ex) or full URLs.',
            placeholder: '/products/sk-ex',
            condition: (_data: any, siblingData: any) => Boolean(siblingData?.ctaText),
          },
          validate: (value: string | null | undefined, { siblingData }: { siblingData: any }) => {
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
            description: 'Open link in a new tab (recommended for external URLs)',
            condition: (_data: any, siblingData: any) =>
              Boolean(siblingData?.ctaText && siblingData?.ctaLink),
          },
        },
        {
          name: 'ctaStyle',
          type: 'select',
          defaultValue: 'white',
          options: [
            { label: 'White (Default)', value: 'white' },
            { label: 'Kawai Red', value: 'red' },
            { label: 'Ghost / Outline', value: 'outline' },
          ],
          admin: {
            description: 'Button visual style',
            condition: (_data: any, siblingData: any) => Boolean(siblingData?.ctaText),
          },
        },
      ],
    },

    // ── SETTINGS ───────────────────────────────────────────────────────────
    {
      name: 'settings',
      type: 'group',
      admin: { description: 'Carousel behaviour and controls' },
      fields: [
        {
          name: 'autoPlayDuration',
          type: 'number',
          min: 2000,
          max: 30000,
          admin: {
            description: 'Auto-play duration per slide in milliseconds (leave empty to use Homepage setting, default: 7000ms)',
            step: 1000,
          },
        },
        {
          name: 'enableAutoPlay',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Automatically advance slides' },
        },
        {
          name: 'enableLoop',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Loop back to the first slide after the last' },
        },
        {
          name: 'enableKeyboardNav',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Arrow keys (←/→) and spacebar to play/pause' },
        },
        {
          name: 'enableTouchSwipe',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Swipe to navigate on touch devices' },
        },
        {
          name: 'showNavigationDots',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Show slide progress indicators at the bottom' },
        },
        {
          name: 'showArrows',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Show left/right arrow navigation buttons' },
        },
        {
          name: 'showPlayPauseButton',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Show play/pause control button' },
        },
        {
          name: 'enableKenBurnsEffect',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Subtle zoom animation on images (Ken Burns effect)' },
        },
      ],
    },

    // ── STYLING ────────────────────────────────────────────────────────────
    {
      name: 'styling',
      type: 'group',
      admin: { description: 'Visual height, content position, and overlay intensity' },
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
          admin: { description: 'Carousel height' },
        },
        {
          name: 'contentPosition',
          type: 'select',
          defaultValue: 'bottom-left',
          options: [
            { label: 'Bottom Left', value: 'bottom-left' },
            { label: 'Bottom Center', value: 'bottom-center' },
            { label: 'Center', value: 'center' },
            { label: 'Top Left', value: 'top-left' },
          ],
          admin: { description: 'Position of the text content' },
        },
        {
          name: 'overlayIntensity',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'None — Pure Visual', value: 'none' },
            { label: 'Subtle', value: 'subtle' },
            { label: 'Medium (Default)', value: 'medium' },
            { label: 'Heavy', value: 'heavy' },
          ],
          admin: {
            description:
              'Gradient overlay darkness — increase for better text legibility over bright images',
          },
        },
      ],
    },
  ],
}
