import type { Block } from 'payload'

export const Hero: Block = {
  slug: 'marketing-hero',
  labels: {
    singular: '🎯 Hero',
    plural: 'Hero Sections',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Hero+Section',
  imageAltText: 'Create impactful hero sections for page headers with images, videos, and CTAs',
  interfaceName: 'MarketingHeroBlock',
  fields: [
    // Data Source Configuration
    {
      name: 'dataSource',
      type: 'select',
      defaultValue: 'manual',
      options: [
        { label: 'Manual Entry', value: 'manual' },
        { label: 'Piano Model Data', value: 'pianomodel' },
        { label: 'Hybrid (Piano Model + Overrides)', value: 'hybrid' }
      ],
      admin: {
        description: 'Choose data source for hero content'
      }
    },
    // PianoModel Relationship
    {
      name: 'pianoModel',
      type: 'relationship',
      relationTo: 'products',
      maxDepth: 0, // CRITICAL: Prevent circular relationship infinite loop
      admin: {
        description: 'Select piano model to automatically populate hero content',
        condition: (data, siblingData) => {
          const dataSource = siblingData?.dataSource;
          return dataSource === 'pianomodel' || dataSource === 'hybrid';
        }
      }
    },
    {
      name: 'content',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'Main hero title/headline (leave empty to use Piano Model name)',
            condition: (data) => {
              const dataSource = data?.dataSource;
              return dataSource === 'manual' || dataSource === 'hybrid';
            }
          }
        },
        {
          name: 'subtitle',
          type: 'text',
          admin: {
            description: 'Optional subtitle or tagline (leave empty to use Piano Model short description)',
            condition: (data) => {
              const dataSource = data?.dataSource;
              return dataSource === 'manual' || dataSource === 'hybrid';
            }
          }
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Hero description text (leave empty to use Piano Model description)',
            condition: (data) => {
              const dataSource = data?.dataSource;
              return dataSource === 'manual' || dataSource === 'hybrid';
            }
          }
        },
        {
          name: 'primaryCta',
          type: 'group',
          fields: [
            {
              name: 'text',
              type: 'text',
              admin: {
                description: 'Primary button text (leave empty to hide button)'
              }
            },
            {
              name: 'link',
              type: 'text',
              admin: {
                description: 'Primary button link/URL'
              }
            },
            {
              name: 'style',
              type: 'select',
              defaultValue: 'primary',
              options: [
                { label: 'Primary', value: 'primary' },
                { label: 'Secondary', value: 'secondary' },
                { label: 'Outline', value: 'outline' }
              ],
              admin: {
                description: 'Button visual style'
              }
            },
            {
              name: 'openInNewTab',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Open link in new browser tab'
              }
            }
          ],
          admin: {
            description: 'Primary call-to-action button'
          }
        },
        {
          name: 'secondaryCta',
          type: 'group',
          fields: [
            {
              name: 'text',
              type: 'text',
              admin: {
                description: 'Secondary button text (leave empty to hide button)'
              }
            },
            {
              name: 'link',
              type: 'text',
              admin: {
                description: 'Secondary button link/URL'
              }
            },
            {
              name: 'style',
              type: 'select',
              defaultValue: 'outline',
              options: [
                { label: 'Primary', value: 'primary' },
                { label: 'Secondary', value: 'secondary' },
                { label: 'Outline', value: 'outline' }
              ],
              admin: {
                description: 'Button visual style'
              }
            },
            {
              name: 'openInNewTab',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Open link in new browser tab'
              }
            }
          ],
          admin: {
            description: 'Secondary call-to-action button (optional)'
          }
        }
      ],
      admin: {
        description: 'Hero content and call-to-action buttons'
      }
    },
    {
      name: 'media',
      type: 'group',
      fields: [
        {
          name: 'type',
          type: 'select',
          defaultValue: 'image',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
            { label: 'None', value: 'none' }
          ],
          admin: {
            description: 'Type of background media'
          }
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          maxDepth: 0, // Prevent deep media fetching
          admin: {
            description: 'Background image (leave empty to use Piano Model main image)',
            condition: (data, siblingData) => {
              const mediaType = siblingData?.type;
              const dataSource = data?.dataSource;
              return mediaType === 'image' && (dataSource === 'manual' || dataSource === 'hybrid');
            }
          }
        },
        {
          name: 'backgroundVideo',
          type: 'upload',
          relationTo: 'media',
          maxDepth: 0, // Prevent deep media fetching
          admin: {
            description: 'Background video file',
            condition: (data, siblingData) => siblingData?.type === 'video'
          }
        },
        {
          name: 'overlay',
          type: 'group',
          fields: [
            {
              name: 'enable',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Add overlay to improve text readability over images/videos'
              }
            },
            {
              name: 'color',
              type: 'select',
              defaultValue: 'dark',
              options: [
                { label: 'Dark', value: 'dark' },
                { label: 'Light', value: 'light' },
                { label: 'Brand Color', value: 'brand' }
              ],
              admin: {
                description: 'Overlay color',
                condition: (data, siblingData) => siblingData?.enable === true
              }
            },
            {
              name: 'opacity',
              type: 'number',
              defaultValue: 0.5,
              min: 0,
              max: 1,
              admin: {
                step: 0.1,
                description: 'Overlay opacity (0 = transparent, 1 = fully opaque)',
                condition: (data, siblingData) => siblingData?.enable === true
              }
            }
          ],
          admin: {
            description: 'Background overlay settings for better text contrast'
          }
        }
      ],
      admin: {
        description: 'Background media and overlay configuration'
      }
    },
    {
      name: 'layout',
      type: 'group',
      fields: [
        {
          name: 'height',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'Small (400px)', value: 'small' },
            { label: 'Medium (600px)', value: 'medium' },
            { label: 'Large (800px)', value: 'large' },
            { label: 'Full Screen', value: 'fullscreen' }
          ],
          admin: {
            description: 'Hero section height'
          }
        },
        {
          name: 'contentAlignment',
          type: 'select',
          defaultValue: 'center',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' }
          ],
          admin: {
            description: 'Horizontal text content alignment'
          }
        },
        {
          name: 'verticalAlignment',
          type: 'select',
          defaultValue: 'center',
          options: [
            { label: 'Top', value: 'top' },
            { label: 'Center', value: 'center' },
            { label: 'Bottom', value: 'bottom' }
          ],
          admin: {
            description: 'Vertical content alignment within hero section'
          }
        },
        {
          name: 'maxWidth',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'Small (600px)', value: 'small' },
            { label: 'Medium (800px)', value: 'medium' },
            { label: 'Large (1000px)', value: 'large' },
            { label: 'Full Width', value: 'full' }
          ],
          admin: {
            description: 'Maximum width of content area'
          }
        }
      ],
      admin: {
        description: 'Layout and positioning options'
      }
    }
  ]
}
