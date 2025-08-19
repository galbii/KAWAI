import type { Block } from 'payload'

export const Hero: Block = {
  slug: 'hero',
  imageURL: 'https://via.placeholder.com/300x200?text=Hero+Section',
  imageAltText: 'Hero section block for page headers and banners',
  interfaceName: 'HeroBlock',
  fields: [
    {
      name: 'content',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Main hero title/headline'
          }
        },
        {
          name: 'subtitle',
          type: 'text',
          admin: {
            description: 'Optional subtitle or tagline'
          }
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Hero description text'
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
              ]
            },
            {
              name: 'openInNewTab',
              type: 'checkbox',
              defaultValue: false
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
              ]
            },
            {
              name: 'openInNewTab',
              type: 'checkbox',
              defaultValue: false
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
          admin: {
            description: 'Background image',
            condition: (data, siblingData) => siblingData?.type === 'image'
          }
        },
        {
          name: 'backgroundVideo',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Background video',
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
                description: 'Add overlay to improve text readability'
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
                description: 'Overlay opacity (0 = transparent, 1 = opaque)',
                condition: (data, siblingData) => siblingData?.enable === true
              }
            }
          ],
          admin: {
            description: 'Background overlay settings'
          }
        }
      ],
      admin: {
        description: 'Background media and overlay settings'
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
            description: 'Text content alignment'
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
            description: 'Vertical content alignment'
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