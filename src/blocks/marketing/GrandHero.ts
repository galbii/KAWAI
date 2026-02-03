import type { Block } from 'payload'

export const GrandHero: Block = {
  slug: 'marketing-grand-hero',
  labels: {
    singular: '✨ Grand Hero',
    plural: 'Grand Hero Sections',
  },
  imageURL: 'https://via.placeholder.com/800x600?text=Grand+Hero+Section',
  imageAltText:
    'Cinematic full-viewport hero section with media background. Japanese-inspired minimalist design featuring glassmorphism content cards, large serif typography, and refined animations. Perfect for impactful landing pages and premium product launches.',
  interfaceName: 'MarketingGrandHeroBlock',
  fields: [
    // Media Background Configuration
    {
      type: 'collapsible',
      label: 'Media Background',
      admin: {
        description: 'Configure background image or video with overlay settings',
      },
      fields: [
        {
          name: 'mediaType',
          type: 'select',
          required: true,
          defaultValue: 'image',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
            { label: 'None (Solid Color)', value: 'none' },
          ],
          admin: {
            description: 'Type of background media',
          },
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          maxDepth: 0,
          admin: {
            description:
              'Background image (recommended: 1920x1080 or higher, landscape orientation)',
            condition: (data: any, siblingData: any) => siblingData?.mediaType === 'image',
          },
        },
        {
          name: 'videoUrl',
          type: 'text',
          admin: {
            description:
              'Direct video URL (checked first - e.g., CDN link to MP4 file). If provided, this takes priority over uploaded video.',
            placeholder: 'https://cdn.example.com/videos/hero-background.mp4',
            condition: (data: any, siblingData: any) => siblingData?.mediaType === 'video',
          },
        },
        {
          name: 'backgroundVideo',
          type: 'upload',
          relationTo: 'media',
          maxDepth: 0,
          admin: {
            description:
              'Fallback: Upload video file (used if Video URL is empty). Recommended: MP4, 1920x1080, under 10MB.',
            condition: (data: any, siblingData: any) => siblingData?.mediaType === 'video',
          },
        },
        {
          name: 'backgroundColor',
          type: 'select',
          defaultValue: 'charcoal',
          options: [
            { label: 'Kawai Charcoal (#2C2C2C)', value: 'charcoal' },
            { label: 'Kawai Pearl (#F8F8F8)', value: 'pearl' },
            { label: 'Black (#000000)', value: 'black' },
            { label: 'White (#FFFFFF)', value: 'white' },
          ],
          admin: {
            description: 'Solid background color (used when media type is "None")',
            condition: (data: any, siblingData: any) => siblingData?.mediaType === 'none',
          },
        },
        {
          name: 'enableParallax',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description:
              'Enable subtle parallax effect on background (slight movement on scroll)',
            condition: (data: any, siblingData: any) =>
              siblingData?.mediaType === 'image' || siblingData?.mediaType === 'video',
          },
        },
        {
          name: 'videoZoom',
          type: 'number',
          min: 100,
          max: 150,
          defaultValue: 110,
          admin: {
            description: 'Video zoom percentage (100 = no zoom, 110 = 10% zoom, 120 = 20% zoom)',
            step: 5,
            condition: (data: any, siblingData: any) => siblingData?.mediaType === 'video',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'overlayColor',
              type: 'select',
              defaultValue: 'dark',
              options: [
                { label: 'Dark Overlay', value: 'dark' },
                { label: 'Light Overlay', value: 'light' },
                { label: 'Kawai Red', value: 'red' },
                { label: 'None', value: 'none' },
              ],
              admin: {
                description: 'Overlay color for better text readability',
              },
            },
            {
              name: 'overlayOpacity',
              type: 'number',
              min: 0,
              max: 1,
              defaultValue: 0.5,
              admin: {
                step: 0.05,
                description: 'Overlay opacity (0 = transparent, 1 = fully opaque)',
                condition: (data: any, siblingData: any) => siblingData?.overlayColor !== 'none',
              },
            },
          ],
        },
      ],
    },

    // Content Configuration
    {
      type: 'collapsible',
      label: 'Content',
      admin: {
        description: 'Hero content: eyebrow, headline, description, and CTAs',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          admin: {
            description:
              'Small uppercase label above main heading (e.g., "Introducing", "New Arrival")',
            placeholder: 'Crafted in Japan',
          },
        },
        {
          name: 'heading',
          type: 'text',
          admin: {
            description: 'Main headline - displayed in large serif typography (Playfair Display)',
            placeholder: 'Experience the Art of Piano Craftsmanship',
          },
        },
        {
          name: 'subheading',
          type: 'text',
          admin: {
            description: 'Optional subheading below main headline',
            placeholder: 'Shigeru Kawai SK-EX Concert Grand',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          maxLength: 300,
          admin: {
            description: 'Supporting paragraph (2-3 sentences recommended, max 300 characters)',
            placeholder:
              'Discover how Japanese precision and musical passion unite to create instruments that inspire generations of pianists.',
          },
        },
        {
          name: 'primaryCta',
          type: 'group',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  admin: {
                    description: 'Primary button text (leave empty to hide)',
                    placeholder: 'Explore Collection',
                  },
                },
                {
                  name: 'link',
                  type: 'text',
                  admin: {
                    description: 'Button destination URL',
                    placeholder: '/pianos/grand',
                    condition: (data: any, siblingData: any) => !!siblingData?.text,
                  },
                },
              ],
            },
            {
              name: 'openInNewTab',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Open link in new browser tab',
                condition: (data: any, siblingData: any) => !!siblingData?.text,
              },
            },
          ],
          admin: {
            description: 'Primary call-to-action button (filled Kawai Red style)',
          },
        },
        {
          name: 'secondaryCta',
          type: 'group',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  admin: {
                    description: 'Secondary button text (leave empty to hide)',
                    placeholder: 'Watch Video',
                  },
                },
                {
                  name: 'link',
                  type: 'text',
                  admin: {
                    description: 'Button destination URL',
                    placeholder: '/videos/demo',
                    condition: (data: any, siblingData: any) => !!siblingData?.text,
                  },
                },
              ],
            },
            {
              name: 'openInNewTab',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Open link in new browser tab',
                condition: (data: any, siblingData: any) => !!siblingData?.text,
              },
            },
          ],
          admin: {
            description: 'Secondary call-to-action button (outline style)',
          },
        },
      ],
    },

    // Layout & Style Configuration
    {
      type: 'collapsible',
      label: 'Layout & Style',
      admin: {
        description: 'Positioning, sizing, and visual effects',
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'height',
              type: 'select',
              defaultValue: 'viewport',
              required: true,
              options: [
                { label: 'Full Viewport (100vh)', value: 'viewport' },
                { label: 'Large (90vh)', value: 'large' },
                { label: 'Medium (80vh)', value: 'medium' },
                { label: 'Compact (70vh)', value: 'compact' },
              ],
              admin: {
                description: 'Hero section height',
              },
            },
            {
              name: 'contentPosition',
              type: 'select',
              defaultValue: 'center',
              required: true,
              options: [
                { label: 'Left Aligned', value: 'left' },
                { label: 'Center Aligned', value: 'center' },
                { label: 'Right Aligned', value: 'right' },
              ],
              admin: {
                description: 'Horizontal alignment of content',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'verticalAlignment',
              type: 'select',
              defaultValue: 'center',
              required: true,
              options: [
                { label: 'Top', value: 'top' },
                { label: 'Center', value: 'center' },
                { label: 'Bottom', value: 'bottom' },
              ],
              admin: {
                description: 'Vertical alignment of content within hero',
              },
            },
            {
              name: 'contentMaxWidth',
              type: 'select',
              defaultValue: 'medium',
              options: [
                { label: 'Small (600px)', value: 'small' },
                { label: 'Medium (800px)', value: 'medium' },
                { label: 'Large (1000px)', value: 'large' },
                { label: 'Extra Large (1200px)', value: 'xlarge' },
              ],
              admin: {
                description: 'Maximum width of content container',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'enableGlassmorphism',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description:
                  'Enable glassmorphism card around content (frosted glass effect with grain texture)',
              },
            },
            {
              name: 'showScrollIndicator',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show animated scroll indicator at bottom of hero',
              },
            },
          ],
        },
        {
          name: 'textColor',
          type: 'select',
          defaultValue: 'auto',
          options: [
            { label: 'Auto (based on background)', value: 'auto' },
            { label: 'White', value: 'white' },
            { label: 'Black', value: 'black' },
            { label: 'Kawai Charcoal', value: 'charcoal' },
          ],
          admin: {
            description: 'Text color (auto detects based on overlay darkness)',
          },
        },
      ],
    },

    // Advanced Effects
    {
      type: 'collapsible',
      label: 'Advanced Effects',
      admin: {
        description: 'Optional visual enhancements and animations',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'enableParticles',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description:
              'Enable subtle floating particle effect (use sparingly for premium feel)',
          },
        },
        {
          name: 'animationStyle',
          type: 'select',
          defaultValue: 'fade-up',
          options: [
            { label: 'Fade + Slide Up', value: 'fade-up' },
            { label: 'Fade In', value: 'fade' },
            { label: 'Scale + Fade', value: 'scale' },
            { label: 'None', value: 'none' },
          ],
          admin: {
            description: 'Content entrance animation style',
          },
        },
        {
          name: 'animationDuration',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'Fast (600ms)', value: 'fast' },
            { label: 'Medium (900ms)', value: 'medium' },
            { label: 'Slow (1200ms)', value: 'slow' },
          ],
          admin: {
            description: 'Animation speed',
            condition: (data: any, siblingData: any) => siblingData?.animationStyle !== 'none',
          },
        },
      ],
    },
  ],
}
