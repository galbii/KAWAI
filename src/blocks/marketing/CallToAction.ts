import type { Block } from 'payload'
import { ctaTrackingField } from '@/lib/payload/fields/tracking'

export const CallToAction: Block = {
  slug: 'marketing-cta',
  labels: {
    singular: '📣 Call to Action',
    plural: 'Call to Action Blocks',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Call+to+Action',
  imageAltText: 'Drive conversions with compelling call-to-action sections featuring buttons and urgency elements',
  interfaceName: 'MarketingCallToActionBlock',
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
            description: 'Main CTA title/headline - make it compelling and action-oriented'
          }
        },
        {
          name: 'subtitle',
          type: 'text',
          admin: {
            description: 'Optional subtitle or supporting text to provide context'
          }
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'CTA description or value proposition - explain the benefit'
          }
        }
      ],
      admin: {
        description: 'Main content for the call-to-action'
      }
    },
    {
      name: 'buttons',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 3,
      labels: {
        singular: 'Button',
        plural: 'Action Buttons'
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          admin: {
            description: 'Button text - use action verbs (e.g., "Get Started", "Learn More")'
          }
        },
        {
          name: 'link',
          type: 'text',
          required: true,
          admin: {
            description: 'Button destination URL or path'
          }
        },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
            { label: 'Ghost', value: 'ghost' },
            { label: 'Text Link', value: 'link' }
          ],
          admin: {
            description: 'Button visual style and prominence'
          }
        },
        {
          name: 'size',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' }
          ],
          admin: {
            description: 'Button size'
          }
        },
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Optional icon name (e.g., "arrow-right", "download", "phone")'
          }
        },
        {
          name: 'iconPosition',
          type: 'select',
          defaultValue: 'right',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' }
          ],
          admin: {
            description: 'Icon position relative to button text',
            condition: (data, siblingData) => Boolean(siblingData?.icon)
          }
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Open link in new browser tab'
          }
        },

        // Analytics & Tracking
        ctaTrackingField(),
      ],
      admin: {
        description: 'Action buttons for the CTA (up to 3 buttons)'
      }
    },
    {
      name: 'media',
      type: 'group',
      fields: [
        {
          name: 'type',
          type: 'select',
          defaultValue: 'none',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Background Image', value: 'background' },
            { label: 'Side Image', value: 'side' },
            { label: 'Icon', value: 'icon' }
          ],
          admin: {
            description: 'Type of media to include in the CTA'
          }
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          maxDepth: 0, // Prevent deep media fetching
          admin: {
            description: 'Background image for the CTA section',
            condition: (data, siblingData) => siblingData?.type === 'background'
          }
        },
        {
          name: 'sideImage',
          type: 'upload',
          relationTo: 'media',
          maxDepth: 0, // Prevent deep media fetching
          admin: {
            description: 'Side image to display alongside CTA content',
            condition: (data, siblingData) => siblingData?.type === 'side'
          }
        },
        {
          name: 'iconName',
          type: 'text',
          admin: {
            description: 'Icon name (e.g., "star", "heart", "trophy")',
            condition: (data, siblingData) => siblingData?.type === 'icon'
          }
        },
        {
          name: 'imagePosition',
          type: 'select',
          defaultValue: 'right',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' }
          ],
          admin: {
            description: 'Position of side image relative to content',
            condition: (data, siblingData) => siblingData?.type === 'side'
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
                description: 'Add overlay to improve text readability over background images'
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
              defaultValue: 0.7,
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
            description: 'Background overlay settings for better text contrast',
            condition: (data, siblingData) => siblingData?.type === 'background'
          }
        }
      ],
      admin: {
        description: 'Media and visual elements for the CTA'
      }
    },
    {
      name: 'layout',
      type: 'group',
      fields: [
        {
          name: 'style',
          type: 'select',
          defaultValue: 'banner',
          options: [
            { label: 'Banner Style', value: 'banner' },
            { label: 'Card Style', value: 'card' },
            { label: 'Minimal Style', value: 'minimal' },
            { label: 'Split Layout', value: 'split' }
          ],
          admin: {
            description: 'Overall CTA design style'
          }
        },
        {
          name: 'alignment',
          type: 'select',
          defaultValue: 'center',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' }
          ],
          admin: {
            description: 'Content alignment within the CTA'
          }
        },
        {
          name: 'size',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' }
          ],
          admin: {
            description: 'CTA section size/padding'
          }
        },
        {
          name: 'backgroundColor',
          type: 'select',
          defaultValue: 'brand',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Light Gray', value: 'light-gray' },
            { label: 'Dark Gray', value: 'dark-gray' },
            { label: 'Brand Color', value: 'brand' },
            { label: 'Accent Color', value: 'accent' },
            { label: 'Gradient', value: 'gradient' }
          ],
          admin: {
            description: 'Background color for the CTA section'
          }
        },
        {
          name: 'buttonLayout',
          type: 'select',
          defaultValue: 'horizontal',
          options: [
            { label: 'Horizontal', value: 'horizontal' },
            { label: 'Vertical', value: 'vertical' }
          ],
          admin: {
            description: 'Button arrangement when multiple buttons are present'
          }
        }
      ],
      admin: {
        description: 'Layout and styling options'
      }
    },
    {
      name: 'urgency',
      type: 'group',
      fields: [
        {
          name: 'enableUrgency',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Add urgency elements to drive immediate action'
          }
        },
        {
          name: 'urgencyText',
          type: 'text',
          admin: {
            description: 'Urgency message (e.g., "Limited time offer", "Only 3 left in stock")',
            condition: (data, siblingData) => siblingData?.enableUrgency === true
          }
        },
        {
          name: 'showCountdown',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show countdown timer to deadline',
            condition: (data, siblingData) => siblingData?.enableUrgency === true
          }
        },
        {
          name: 'countdownEndDate',
          type: 'date',
          admin: {
            description: 'Countdown end date and time',
            condition: (data, siblingData) => siblingData?.showCountdown === true
          }
        }
      ],
      admin: {
        description: 'Urgency and scarcity elements to boost conversions'
      }
    }
  ]
}
