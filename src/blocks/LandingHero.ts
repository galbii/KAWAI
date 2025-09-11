import type { Block } from 'payload'

export const LandingHero: Block = {
  slug: 'landingHero',
  imageURL: 'https://via.placeholder.com/300x200?text=Landing+Hero',
  imageAltText: 'Landing hero block for campaign-specific hero sections with focused messaging',
  interfaceName: 'LandingHeroBlock',
  fields: [
    {
      name: 'content',
      type: 'group',
      fields: [
        {
          name: 'preHeadline',
          type: 'text',
          admin: {
            description: 'Small text above the main headline (e.g., "Limited Time Offer", "New Arrival")'
          }
        },
        {
          name: 'headline',
          type: 'text',
          required: true,
          admin: {
            description: 'Main campaign headline - powerful and attention-grabbing'
          }
        },
        {
          name: 'subheadline',
          type: 'text',
          admin: {
            description: 'Supporting headline that clarifies the main message'
          }
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Compelling description that explains the value proposition'
          }
        },
        {
          name: 'highlightText',
          type: 'text',
          admin: {
            description: 'Special highlighted text (e.g., discount amount, special feature)'
          }
        }
      ],
      admin: {
        description: 'Main campaign messaging content'
      }
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        {
          name: 'primaryButton',
          type: 'group',
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
              defaultValue: 'Shop Now',
              admin: {
                description: 'Primary action button text'
              }
            },
            {
              name: 'link',
              type: 'text',
              required: true,
              admin: {
                description: 'Primary button destination URL'
              }
            },
            {
              name: 'style',
              type: 'select',
              defaultValue: 'primary',
              options: [
                { label: 'Primary', value: 'primary' },
                { label: 'Secondary', value: 'secondary' },
                { label: 'Accent', value: 'accent' },
                { label: 'Gradient', value: 'gradient' }
              ],
              admin: {
                description: 'Button style for maximum conversion'
              }
            },
            {
              name: 'size',
              type: 'select',
              defaultValue: 'large',
              options: [
                { label: 'Medium', value: 'medium' },
                { label: 'Large', value: 'large' },
                { label: 'Extra Large', value: 'xl' }
              ],
              admin: {
                description: 'Button size - larger for better conversion'
              }
            },
            {
              name: 'icon',
              type: 'text',
              admin: {
                description: 'Optional icon (e.g., "arrow-right", "shopping-cart", "play")'
              }
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
          name: 'secondaryButton',
          type: 'group',
          fields: [
            {
              name: 'text',
              type: 'text',
              admin: {
                description: 'Secondary button text (leave empty to hide)'
              }
            },
            {
              name: 'link',
              type: 'text',
              admin: {
                description: 'Secondary button link'
              }
            },
            {
              name: 'style',
              type: 'select',
              defaultValue: 'outline',
              options: [
                { label: 'Outline', value: 'outline' },
                { label: 'Ghost', value: 'ghost' },
                { label: 'Text Link', value: 'link' }
              ],
              admin: {
                description: 'Secondary button style'
              }
            },
            {
              name: 'openInNewTab',
              type: 'checkbox',
              defaultValue: false
            }
          ],
          admin: {
            description: 'Optional secondary action button'
          }
        },
        {
          name: 'ctaNote',
          type: 'text',
          admin: {
            description: 'Small note below buttons (e.g., "Free shipping", "No credit card required")'
          }
        }
      ],
      admin: {
        description: 'Call-to-action buttons and supporting text'
      }
    },
    {
      name: 'media',
      type: 'group',
      fields: [
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Hero background image - should be high quality and engaging'
          }
        },
        {
          name: 'foregroundImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional foreground/product image to display alongside content'
          }
        },
        {
          name: 'backgroundVideo',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional background video (will override background image)'
          }
        },
        {
          name: 'videoSettings',
          type: 'group',
          fields: [
            {
              name: 'autoplay',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Auto-play background video'
              }
            },
            {
              name: 'muted',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Mute background video'
              }
            },
            {
              name: 'loop',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Loop background video'
              }
            }
          ],
          admin: {
            description: 'Video playback settings',
            condition: (data, siblingData) => Boolean(siblingData?.backgroundVideo)
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
                description: 'Add overlay for better text readability'
              }
            },
            {
              name: 'color',
              type: 'select',
              defaultValue: 'dark',
              options: [
                { label: 'Dark', value: 'dark' },
                { label: 'Light', value: 'light' },
                { label: 'Brand Color', value: 'brand' },
                { label: 'Gradient', value: 'gradient' }
              ],
              admin: {
                condition: (data, siblingData) => siblingData?.enable === true
              }
            },
            {
              name: 'opacity',
              type: 'number',
              defaultValue: 0.6,
              min: 0,
              max: 1,
              admin: {
                step: 0.1,
                description: 'Overlay opacity for optimal text contrast',
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
        description: 'Background and visual elements'
      }
    },
    {
      name: 'layout',
      type: 'group',
      fields: [
        {
          name: 'height',
          type: 'select',
          defaultValue: 'large',
          options: [
            { label: 'Medium (600px)', value: 'medium' },
            { label: 'Large (800px)', value: 'large' },
            { label: 'Extra Large (1000px)', value: 'xl' },
            { label: 'Full Screen', value: 'fullscreen' }
          ],
          admin: {
            description: 'Hero section height - larger for more impact'
          }
        },
        {
          name: 'contentPosition',
          type: 'select',
          defaultValue: 'center-left',
          options: [
            { label: 'Center', value: 'center' },
            { label: 'Center Left', value: 'center-left' },
            { label: 'Center Right', value: 'center-right' },
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' }
          ],
          admin: {
            description: 'Position of content within the hero'
          }
        },
        {
          name: 'contentWidth',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'Small (500px)', value: 'small' },
            { label: 'Medium (700px)', value: 'medium' },
            { label: 'Large (900px)', value: 'large' },
            { label: 'Full Width', value: 'full' }
          ],
          admin: {
            description: 'Maximum width of content area'
          }
        },
        {
          name: 'textAlignment',
          type: 'select',
          defaultValue: 'left',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' }
          ],
          admin: {
            description: 'Text content alignment'
          }
        }
      ],
      admin: {
        description: 'Layout and positioning options'
      }
    },
    {
      name: 'campaign',
      type: 'group',
      fields: [
        {
          name: 'showUrgency',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Add urgency elements to increase conversion'
          }
        },
        {
          name: 'urgencyText',
          type: 'text',
          admin: {
            description: 'Urgency message (e.g., "Limited time offer", "Only 5 left")',
            condition: (data, siblingData) => siblingData?.showUrgency === true
          }
        },
        {
          name: 'showCountdown',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Display countdown timer',
            condition: (data, siblingData) => siblingData?.showUrgency === true
          }
        },
        {
          name: 'countdownEndDate',
          type: 'date',
          admin: {
            description: 'Countdown end date and time',
            condition: (data, siblingData) => siblingData?.showCountdown === true
          }
        },
        {
          name: 'showSocialProof',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Display social proof elements'
          }
        },
        {
          name: 'socialProofText',
          type: 'text',
          admin: {
            description: 'Social proof message (e.g., "Join 10,000+ satisfied customers")',
            condition: (data, siblingData) => siblingData?.showSocialProof === true
          }
        },
        {
          name: 'testimonialQuote',
          type: 'text',
          admin: {
            description: 'Short testimonial quote to display',
            condition: (data, siblingData) => siblingData?.showSocialProof === true
          }
        },
        {
          name: 'testimonialAuthor',
          type: 'text',
          admin: {
            description: 'Testimonial author name',
            condition: (data, siblingData) => siblingData?.showSocialProof === true
          }
        }
      ],
      admin: {
        description: 'Campaign-specific elements for conversion optimization'
      }
    }
  ]
}