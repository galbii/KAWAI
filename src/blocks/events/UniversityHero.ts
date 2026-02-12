import type { Block } from 'payload'
import { imageField } from '@/lib/payload/fields'
import { ctaTrackingField } from '@/lib/payload/fields/tracking'

export const UniversityHero: Block = {
  slug: 'events-university-hero',
  labels: {
    singular: '🎓 University Hero',
    plural: 'University Hero Sections',
  },
  imageURL: 'https://via.placeholder.com/800x600?text=University+Hero',
  imageAltText:
    'Versatile hero section supporting single centered logo or dual partnership logos (e.g., Kawai X SHSU). Perfect for university collaborations, institutional partnerships, educational programs, or standalone brand showcases.',
  interfaceName: 'EventsUniversityHeroBlock',
  fields: [
    // Logos Configuration
    {
      type: 'collapsible',
      label: 'Logos',
      admin: {
        description: 'Configure logo(s) - single logo for centered display or dual logos for partnership layout',
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            imageField('leftLogo', {
              required: true,
              admin: {
                description: 'Primary logo (e.g., Kawai logo) - recommended: square or horizontal, transparent PNG',
              },
            }),
            imageField('rightLogo', {
              required: false,
              admin: {
                description: 'Secondary logo (e.g., University logo) - leave empty for single centered logo layout',
              },
            }),
          ],
        },
        {
          name: 'singleLogoText',
          type: 'textarea',
          maxLength: 150,
          admin: {
            description: 'Text to display below logo when using single-logo mode (1-2 sentences)',
            placeholder: 'Experience world-class pianos at our showroom',
            condition: (data: any, siblingData: any) => !siblingData?.rightLogo,
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'logoSize',
              type: 'select',
              defaultValue: 'medium',
              options: [
                { label: 'Small (80px)', value: 'small' },
                { label: 'Medium (120px)', value: 'medium' },
                { label: 'Large (160px)', value: 'large' },
                { label: 'Extra Large (200px)', value: 'xlarge' },
              ],
              admin: {
                description: 'Logo height (both logos will be this size)',
              },
            },
            {
              name: 'logoSpacing',
              type: 'select',
              defaultValue: 'medium',
              options: [
                { label: 'Tight (2rem)', value: 'tight' },
                { label: 'Medium (4rem)', value: 'medium' },
                { label: 'Loose (6rem)', value: 'loose' },
              ],
              admin: {
                description: 'Spacing between logos and the "X" separator',
              },
            },
          ],
        },
        {
          name: 'showSeparator',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show separator between logos (only applies to dual-logo mode)',
            condition: (data: any, siblingData: any) => !!siblingData?.rightLogo,
          },
        },
        {
          name: 'separatorStyle',
          type: 'select',
          defaultValue: 'x',
          options: [
            { label: 'X (uppercase)', value: 'x' },
            { label: '× (times symbol)', value: 'times' },
            { label: '+ (plus)', value: 'plus' },
            { label: '& (ampersand)', value: 'ampersand' },
          ],
          admin: {
            description: 'Separator character between logos',
            condition: (data: any, siblingData: any) =>
              !!siblingData?.rightLogo && siblingData?.showSeparator === true,
          },
        },
      ],
    },

    // Content Configuration
    {
      type: 'collapsible',
      label: 'Content',
      admin: {
        description: 'Hero content: subheading and call-to-action buttons',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'heading',
          type: 'text',
          admin: {
            description:
              'Optional main heading above logos (e.g., "Partnership Announcement")',
            placeholder: 'Partnership Announcement',
          },
        },
        {
          type: 'collapsible',
          label: 'Text Styling',
          admin: {
            description: 'Customize the appearance of heading and text below logos (applies to both)',
            initCollapsed: true,
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'subheadingFont',
                  type: 'select',
                  defaultValue: 'inherit',
                  options: [
                    { label: 'Inherit (Use Global Text Color)', value: 'inherit' },
                    { label: 'Inter (Sans Serif)', value: 'inter' },
                    { label: 'Playfair Display (Serif)', value: 'playfair' },
                    { label: 'Crimson Text (Serif)', value: 'crimson' },
                  ],
                  admin: {
                    description: 'Font family for heading and text',
                  },
                },
                {
                  name: 'subheadingSize',
                  type: 'select',
                  defaultValue: 'default',
                  options: [
                    { label: 'Small (16px/18px)', value: 'small' },
                    { label: 'Default (18px/20px)', value: 'default' },
                    { label: 'Large (20px/24px)', value: 'large' },
                    { label: 'Extra Large (24px/28px)', value: 'xlarge' },
                    { label: 'Huge (28px/32px)', value: 'huge' },
                  ],
                  admin: {
                    description: 'Font size for text (mobile/desktop)',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'subheadingColor',
                  type: 'select',
                  defaultValue: 'inherit',
                  options: [
                    { label: 'Inherit (Use Global Text Color)', value: 'inherit' },
                    { label: 'White', value: 'white' },
                    { label: 'Black', value: 'black' },
                    { label: 'Kawai Charcoal', value: 'charcoal' },
                    { label: 'Kawai Red', value: 'red' },
                    { label: 'Kawai Gold', value: 'gold' },
                    { label: 'Orange', value: 'orange' },
                  ],
                  admin: {
                    description: 'Text color (applies to heading and text, overrides global)',
                  },
                },
                {
                  name: 'textWeight',
                  type: 'select',
                  defaultValue: 'normal',
                  options: [
                    { label: 'Normal (400)', value: 'normal' },
                    { label: 'Medium (500)', value: 'medium' },
                    { label: 'Semibold (600)', value: 'semibold' },
                    { label: 'Bold (700)', value: 'bold' },
                    { label: 'Extra Bold (800)', value: 'extrabold' },
                  ],
                  admin: {
                    description: 'Font weight for heading and text',
                  },
                },
              ],
            },
          ],
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
                    placeholder: 'Learn More',
                  },
                },
                {
                  name: 'link',
                  type: 'text',
                  admin: {
                    description: 'Button destination URL',
                    placeholder: '/partnerships/university',
                    condition: (data: any, siblingData: any) => !!siblingData?.text,
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'openInNewTab',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Open link in new browser tab',
                    condition: (data: any, siblingData: any) => !!siblingData?.text,
                  },
                },
                {
                  name: 'style',
                  type: 'select',
                  defaultValue: 'primary',
                  options: [
                    { label: 'Primary (Filled Red)', value: 'primary' },
                    { label: 'Outline', value: 'outline' },
                  ],
                  admin: {
                    description: 'Button style',
                    condition: (data: any, siblingData: any) => !!siblingData?.text,
                  },
                },
              ],
            },

            // Analytics & Tracking
            ctaTrackingField(),
          ],
          admin: {
            description: 'Primary call-to-action button',
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
                    placeholder: 'Contact Us',
                  },
                },
                {
                  name: 'link',
                  type: 'text',
                  admin: {
                    description: 'Button destination URL',
                    placeholder: '/contact',
                    condition: (data: any, siblingData: any) => !!siblingData?.text,
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'openInNewTab',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Open link in new browser tab',
                    condition: (data: any, siblingData: any) => !!siblingData?.text,
                  },
                },
                {
                  name: 'style',
                  type: 'select',
                  defaultValue: 'outline',
                  options: [
                    { label: 'Primary (Filled Red)', value: 'primary' },
                    { label: 'Outline', value: 'outline' },
                  ],
                  admin: {
                    description: 'Button style',
                    condition: (data: any, siblingData: any) => !!siblingData?.text,
                  },
                },
              ],
            },

            // Analytics & Tracking
            ctaTrackingField(),
          ],
          admin: {
            description: 'Secondary call-to-action button (optional)',
          },
        },
      ],
    },

    // Background Configuration
    {
      type: 'collapsible',
      label: 'Background & Style',
      admin: {
        description: 'Configure background image, overlay, and visual styling',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'youtubeUrl',
          type: 'text',
          admin: {
            description:
              'YouTube video URL for background (takes priority over image if filled). Supports youtube.com/watch, youtu.be, embed formats.',
            placeholder: 'https://www.youtube.com/watch?v=...',
          },
        },
        {
          name: 'videoZoom',
          type: 'number',
          min: 1,
          max: 2,
          defaultValue: 1,
          admin: {
            step: 0.05,
            description: 'Video zoom level (1 = normal, 1.5 = 150%, 2 = 200%). Use to crop/fill viewport.',
            condition: (data: any, siblingData: any) => !!siblingData?.youtubeUrl,
          },
        },
        imageField('backgroundImage', {
          admin: {
            description:
              'Background image - used if no YouTube URL is provided (recommended: 1920x1080 or higher, landscape orientation)',
          },
        }),
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
              defaultValue: 0.6,
              admin: {
                step: 0.05,
                description: 'Overlay opacity (0 = transparent, 1 = fully opaque)',
                condition: (data: any, siblingData: any) => siblingData?.overlayColor !== 'none',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'height',
              type: 'select',
              defaultValue: 'medium',
              required: true,
              options: [
                { label: 'Compact (60vh)', value: 'compact' },
                { label: 'Medium (70vh)', value: 'medium' },
                { label: 'Large (80vh)', value: 'large' },
                { label: 'Full Viewport (100vh)', value: 'viewport' },
              ],
              admin: {
                description: 'Hero section height',
              },
            },
            {
              name: 'contentAlignment',
              type: 'select',
              defaultValue: 'center',
              required: true,
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
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
              name: 'textColor',
              type: 'select',
              defaultValue: 'white',
              options: [
                { label: 'White', value: 'white' },
                { label: 'Black', value: 'black' },
                { label: 'Kawai Charcoal', value: 'charcoal' },
              ],
              admin: {
                description: 'Text color',
              },
            },
          ],
        },
      ],
    },

    // Advanced Settings
    {
      type: 'collapsible',
      label: 'Advanced',
      admin: {
        description: 'Optional visual enhancements',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'enableGlassmorphism',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description:
              'Wrap content in frosted glass card (glassmorphism effect)',
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
      ],
    },
  ],
}
