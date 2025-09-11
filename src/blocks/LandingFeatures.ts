import type { Block } from 'payload'

export const LandingFeatures: Block = {
  slug: 'landingFeatures',
  imageURL: 'https://via.placeholder.com/300x200?text=Landing+Features',
  imageAltText: 'Landing features block for showcasing campaign highlights and key benefits',
  interfaceName: 'LandingFeaturesBlock',
  fields: [
    {
      name: 'header',
      type: 'group',
      fields: [
        {
          name: 'preTitle',
          type: 'text',
          admin: {
            description: 'Small text above the main title (e.g., "Why Choose Us", "Campaign Benefits")'
          }
        },
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'Section title'
          }
        },
        {
          name: 'subtitle',
          type: 'text',
          admin: {
            description: 'Section subtitle'
          }
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Section description explaining the campaign benefits'
          }
        }
      ],
      admin: {
        description: 'Header content for the features section'
      }
    },
    {
      name: 'features',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 8,
      labels: {
        singular: 'Feature',
        plural: 'Campaign Features'
      },
      fields: [
        {
          name: 'icon',
          type: 'group',
          fields: [
            {
              name: 'type',
              type: 'select',
              defaultValue: 'icon',
              options: [
                { label: 'Icon Name', value: 'icon' },
                { label: 'Custom Image', value: 'image' },
                { label: 'Emoji', value: 'emoji' },
                { label: 'Number', value: 'number' }
              ],
              admin: {
                description: 'Type of visual element'
              }
            },
            {
              name: 'iconName',
              type: 'text',
              admin: {
                description: 'Icon name (e.g., "check-circle", "star", "shield", "truck")',
                condition: (data, siblingData) => siblingData?.type === 'icon'
              }
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Custom icon image',
                condition: (data, siblingData) => siblingData?.type === 'image'
              }
            },
            {
              name: 'emoji',
              type: 'text',
              admin: {
                description: 'Emoji character (e.g., "✅", "⭐", "🚚", "💯")',
                condition: (data, siblingData) => siblingData?.type === 'emoji'
              }
            },
            {
              name: 'number',
              type: 'text',
              admin: {
                description: 'Number or step (e.g., "01", "1", "Step 1")',
                condition: (data, siblingData) => siblingData?.type === 'number'
              }
            },
            {
              name: 'color',
              type: 'select',
              defaultValue: 'brand',
              options: [
                { label: 'Brand Color', value: 'brand' },
                { label: 'Accent Color', value: 'accent' },
                { label: 'Success Green', value: 'success' },
                { label: 'Warning Orange', value: 'warning' },
                { label: 'Info Blue', value: 'info' },
                { label: 'Dark Gray', value: 'dark' }
              ],
              admin: {
                description: 'Icon color theme'
              }
            }
          ],
          admin: {
            description: 'Visual element for this feature'
          }
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Feature title - should be compelling and benefit-focused'
          }
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Feature description explaining the specific benefit'
          }
        },
        {
          name: 'highlight',
          type: 'text',
          admin: {
            description: 'Special highlight text (e.g., "Free", "NEW", "Limited Time")'
          }
        },
        {
          name: 'link',
          type: 'group',
          fields: [
            {
              name: 'enable',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Make this feature clickable'
              }
            },
            {
              name: 'url',
              type: 'text',
              admin: {
                description: 'Link destination',
                condition: (data, siblingData) => siblingData?.enable === true
              }
            },
            {
              name: 'text',
              type: 'text',
              admin: {
                description: 'Link text (e.g., "Learn more", "View details")',
                condition: (data, siblingData) => siblingData?.enable === true
              }
            },
            {
              name: 'openInNewTab',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                condition: (data, siblingData) => siblingData?.enable === true
              }
            }
          ],
          admin: {
            description: 'Optional link for this feature'
          }
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Mark as featured - will receive special visual treatment'
          }
        }
      ],
      admin: {
        description: 'Campaign features and benefits'
      }
    },
    {
      name: 'layout',
      type: 'group',
      fields: [
        {
          name: 'style',
          type: 'select',
          defaultValue: 'cards',
          options: [
            { label: 'Card Layout', value: 'cards' },
            { label: 'Grid Layout', value: 'grid' },
            { label: 'List Layout', value: 'list' },
            { label: 'Timeline Layout', value: 'timeline' },
            { label: 'Stepped Layout', value: 'steps' }
          ],
          admin: {
            description: 'Visual layout style for features'
          }
        },
        {
          name: 'columns',
          type: 'select',
          defaultValue: 'three',
          options: [
            { label: '1 Column', value: 'one' },
            { label: '2 Columns', value: 'two' },
            { label: '3 Columns', value: 'three' },
            { label: '4 Columns', value: 'four' }
          ],
          admin: {
            description: 'Number of columns for grid/card layouts',
            condition: (data, siblingData) => ['cards', 'grid'].includes(siblingData?.style)
          }
        },
        {
          name: 'iconPosition',
          type: 'select',
          defaultValue: 'top',
          options: [
            { label: 'Top', value: 'top' },
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' }
          ],
          admin: {
            description: 'Position of icons relative to content'
          }
        },
        {
          name: 'iconSize',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' },
            { label: 'Extra Large', value: 'xl' }
          ],
          admin: {
            description: 'Size of feature icons'
          }
        },
        {
          name: 'spacing',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'Compact', value: 'compact' },
            { label: 'Medium', value: 'medium' },
            { label: 'Spacious', value: 'spacious' }
          ],
          admin: {
            description: 'Spacing between features'
          }
        },
        {
          name: 'backgroundColor',
          type: 'select',
          defaultValue: 'none',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Light Gray', value: 'light-gray' },
            { label: 'Dark Gray', value: 'dark-gray' },
            { label: 'White', value: 'white' },
            { label: 'Brand Light', value: 'brand-light' },
            { label: 'Gradient', value: 'gradient' }
          ],
          admin: {
            description: 'Background color for the features section'
          }
        }
      ],
      admin: {
        description: 'Layout and styling options'
      }
    },
    {
      name: 'animation',
      type: 'group',
      fields: [
        {
          name: 'enableAnimations',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable entrance animations for features'
          }
        },
        {
          name: 'animationType',
          type: 'select',
          defaultValue: 'fade-up',
          options: [
            { label: 'Fade Up', value: 'fade-up' },
            { label: 'Fade In', value: 'fade-in' },
            { label: 'Slide In', value: 'slide-in' },
            { label: 'Scale In', value: 'scale-in' },
            { label: 'Bounce In', value: 'bounce-in' }
          ],
          admin: {
            description: 'Type of entrance animation',
            condition: (data, siblingData) => siblingData?.enableAnimations === true
          }
        },
        {
          name: 'staggerDelay',
          type: 'number',
          defaultValue: 100,
          min: 0,
          max: 500,
          admin: {
            description: 'Delay between each feature animation (milliseconds)',
            condition: (data, siblingData) => siblingData?.enableAnimations === true
          }
        }
      ],
      admin: {
        description: 'Animation settings for enhanced user experience'
      }
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        {
          name: 'showCta',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show call-to-action button below features'
          }
        },
        {
          name: 'ctaText',
          type: 'text',
          admin: {
            description: 'CTA button text',
            condition: (data, siblingData) => siblingData?.showCta === true
          }
        },
        {
          name: 'ctaLink',
          type: 'text',
          admin: {
            description: 'CTA button link',
            condition: (data, siblingData) => siblingData?.showCta === true
          }
        },
        {
          name: 'ctaStyle',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Outline', value: 'outline' }
          ],
          admin: {
            description: 'CTA button style',
            condition: (data, siblingData) => siblingData?.showCta === true
          }
        },
        {
          name: 'ctaOpenInNewTab',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            condition: (data, siblingData) => siblingData?.showCta === true
          }
        }
      ],
      admin: {
        description: 'Optional call-to-action below features'
      }
    }
  ]
}