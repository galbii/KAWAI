import type { Block } from 'payload'
import { imageField } from '@/lib/payload/fields'

export const UniversityEventHero: Block = {
  slug: 'university-event-hero',
  labels: {
    singular: '🎓 University Event Hero',
    plural: 'University Event Hero Sections',
  },
  imageURL: 'https://via.placeholder.com/800x600?text=University+Event+Hero',
  imageAltText:
    'Full-viewport hero section for university piano sale events. Supports dual partner logos, headline text, video or image background, overlay controls, and CTA buttons.',
  interfaceName: 'UniversityEventHeroBlock',
  fields: [
    // Logos
    {
      type: 'collapsible',
      label: 'Logos',
      admin: {
        description: 'Configure dual partner logos (e.g. Kawai × University)',
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            imageField('leftLogo', {
              required: true,
              admin: {
                description:
                  'Left partner logo (e.g. Kawai) — transparent PNG recommended',
              },
            }),
            imageField('rightLogo', {
              required: false,
              admin: {
                description:
                  'Right partner logo (e.g. University) — leave empty for single-logo mode',
              },
            }),
          ],
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
                description: 'Logo height (applies to both logos)',
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
                description: 'Separator character between logos (dual-logo mode only)',
                condition: (_data: any, siblingData: any) => !!siblingData?.rightLogo,
              },
            },
          ],
        },
      ],
    },

    // Content
    {
      type: 'collapsible',
      label: 'Content',
      admin: {
        description: 'Eyebrow, headline, subheadline, and supporting message',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          admin: {
            description:
              'Small uppercase text above the logos (e.g. "Texas Southern University is proud to present")',
            placeholder: 'Texas Southern University is proud to present',
          },
        },
        {
          name: 'headline',
          type: 'text',
          admin: {
            description:
              'Main headline text (optional — logos are the primary visual when omitted)',
            placeholder: 'Exclusive Piano Sale Event',
          },
        },
        {
          name: 'subheadline',
          type: 'textarea',
          maxLength: 300,
          admin: {
            description:
              'Supporting text below logos/headline — event dates, description, value prop',
            placeholder: 'December 4–7, 2025 · Special event pricing · Free delivery & tuning',
          },
        },
        {
          name: 'supportingMessage',
          type: 'text',
          admin: {
            description:
              'Optional italic note below the CTA buttons (e.g. "Your purchase supports the Music Department")',
            placeholder: 'Your purchase supports the TSU Music Department',
          },
        },
      ],
    },

    // CTAs
    {
      type: 'collapsible',
      label: 'CTAs',
      admin: {
        description: 'Primary and secondary call-to-action buttons',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'primaryCta',
          type: 'group',
          admin: {
            description: 'Primary call-to-action button (e.g. Book Appointment)',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  admin: {
                    description: 'Button label (leave empty to hide)',
                    placeholder: 'Book Appointment',
                  },
                },
                {
                  name: 'link',
                  type: 'text',
                  admin: {
                    description: 'Button URL',
                    placeholder: '#book',
                    condition: (_data: any, siblingData: any) => !!siblingData?.text,
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'style',
                  type: 'select',
                  defaultValue: 'primary',
                  options: [
                    { label: 'Primary (Filled Red)', value: 'primary' },
                    { label: 'Outline', value: 'outline' },
                    { label: 'White Frosted', value: 'frosted' },
                  ],
                  admin: {
                    description: 'Button visual style',
                    condition: (_data: any, siblingData: any) => !!siblingData?.text,
                  },
                },
                {
                  name: 'openInNewTab',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Open in new tab',
                    condition: (_data: any, siblingData: any) => !!siblingData?.text,
                  },
                },
              ],
            },
            {
              name: 'scrollToId',
              type: 'text',
              admin: {
                description:
                  'Scroll to element with this ID on click instead of navigating (overrides link)',
                placeholder: 'featured-deals',
                condition: (_data: any, siblingData: any) => !!siblingData?.text,
              },
            },
          ],
        },
        {
          name: 'secondaryCta',
          type: 'group',
          admin: {
            description: 'Secondary call-to-action button (e.g. View Piano Collection)',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  admin: {
                    description: 'Button label (leave empty to hide)',
                    placeholder: 'View Piano Collection',
                  },
                },
                {
                  name: 'link',
                  type: 'text',
                  admin: {
                    description: 'Button URL',
                    placeholder: '#featured-deals',
                    condition: (_data: any, siblingData: any) => !!siblingData?.text,
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'style',
                  type: 'select',
                  defaultValue: 'frosted',
                  options: [
                    { label: 'Primary (Filled Red)', value: 'primary' },
                    { label: 'Outline', value: 'outline' },
                    { label: 'White Frosted', value: 'frosted' },
                  ],
                  admin: {
                    description: 'Button visual style',
                    condition: (_data: any, siblingData: any) => !!siblingData?.text,
                  },
                },
                {
                  name: 'openInNewTab',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Open in new tab',
                    condition: (_data: any, siblingData: any) => !!siblingData?.text,
                  },
                },
              ],
            },
            {
              name: 'scrollToId',
              type: 'text',
              admin: {
                description:
                  'Scroll to element with this ID on click instead of navigating (overrides link)',
                placeholder: 'featured-deals',
                condition: (_data: any, siblingData: any) => !!siblingData?.text,
              },
            },
          ],
        },
      ],
    },

    // Background & Style
    {
      type: 'collapsible',
      label: 'Background & Style',
      admin: {
        description: 'Video URL, fallback image, overlay, and layout settings',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'backgroundVideoUrl',
          type: 'text',
          admin: {
            description:
              'Direct MP4/WebM video URL for looping background (takes priority over image). Use a CDN-hosted path like /videos/hero.mp4.',
            placeholder: 'https://cdn.example.com/hero-video.mp4',
          },
        },
        {
          name: 'videoStartTime',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: {
            step: 0.5,
            description: 'Start playback at this time in seconds (e.g. 13 = jump to 0:13)',
            placeholder: '0',
            condition: (_data: any, siblingData: any) => !!siblingData?.backgroundVideoUrl,
          },
        },
        imageField('backgroundImage', {
          admin: {
            description:
              'Fallback background image — used when no video URL is set (recommended: 1920x1080px landscape)',
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
                { label: 'Dark', value: 'dark' },
                { label: 'Light', value: 'light' },
                { label: 'Kawai Red', value: 'red' },
                { label: 'None', value: 'none' },
              ],
              admin: {
                description: 'Overlay colour for text readability',
              },
            },
            {
              name: 'overlayOpacity',
              type: 'number',
              min: 0,
              max: 1,
              defaultValue: 0.55,
              admin: {
                step: 0.05,
                description: 'Overlay opacity (0 = transparent, 1 = solid)',
                condition: (_data: any, siblingData: any) => siblingData?.overlayColor !== 'none',
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
              defaultValue: 'viewport',
              options: [
                { label: 'Compact (60vh)', value: 'compact' },
                { label: 'Medium (75vh)', value: 'medium' },
                { label: 'Large (85vh)', value: 'large' },
                { label: 'Full Viewport (100vh)', value: 'viewport' },
              ],
              admin: {
                description: 'Hero section height',
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
                description: 'Primary text colour for all hero content',
              },
            },
          ],
        },
      ],
    },
  ],
}
