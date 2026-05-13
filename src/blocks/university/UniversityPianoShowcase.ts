import type { Block } from 'payload'
import { imageField } from '@/lib/payload/fields'

export const UniversityPianoShowcase: Block = {
  slug: 'university-piano-showcase',
  labels: {
    singular: '🎹 University Piano Showcase',
    plural: 'University Piano Showcase Sections',
  },
  interfaceName: 'UniversityPianoShowcaseBlock',
  fields: [
    // Section Header
    {
      type: 'collapsible',
      label: '📝 Section Header',
      admin: {
        description: 'Heading and subheading for the piano showcase section',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'sectionLabel',
          type: 'text',
          admin: {
            description: 'Small eyebrow label above the heading (e.g. "FEATURED MODELS")',
            placeholder: 'FEATURED MODELS',
          },
        },
        {
          name: 'heading',
          type: 'text',
          required: true,
          admin: {
            description: 'Main section heading',
            placeholder: 'University Piano Gallery',
          },
        },
        {
          name: 'subheading',
          type: 'text',
          admin: {
            description: 'Subtitle line below the heading',
            placeholder: 'Premium Collection • Expert Guidance',
          },
        },
      ],
    },

    // Piano Models Array
    {
      type: 'collapsible',
      label: '🎹 Featured Piano Models',
      admin: {
        description: 'Up to 8 pianos displayed in alternating left/right layout',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'pianos',
          type: 'array',
          minRows: 1,
          maxRows: 8,
          admin: {
            description: 'Featured piano models — displayed alternating image left/right',
          },
          fields: [
            // Identity
            {
              type: 'collapsible',
              label: '🎼 Identity',
              admin: { initCollapsed: false },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Display name (e.g. "Kawai ES-120")',
                        placeholder: 'Kawai ES-120',
                        width: '60%',
                      },
                    },
                    {
                      name: 'modelNumber',
                      type: 'text',
                      admin: {
                        description: 'Model number / SKU (e.g. "ES-120")',
                        placeholder: 'ES-120',
                        width: '40%',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'category',
                      type: 'text',
                      admin: {
                        description: 'Category label (e.g. "Digital Piano", "Grand Piano")',
                        placeholder: 'Digital Piano',
                        width: '50%',
                      },
                    },
                    {
                      name: 'badgeText',
                      type: 'text',
                      admin: {
                        description: 'Badge overlay text (e.g. "Most Popular", "Best Value")',
                        placeholder: 'Most Popular',
                        width: '50%',
                      },
                    },
                  ],
                },
                {
                  name: 'description',
                  type: 'textarea',
                  maxLength: 500,
                  admin: {
                    description: 'Piano description paragraph (2–4 sentences)',
                    placeholder: 'Compact digital piano with Responsive Hammer action...',
                  },
                },
              ],
            },

            // Image
            {
              type: 'collapsible',
              label: '🖼️ Image',
              admin: { initCollapsed: false },
              fields: [
                imageField('image', {
                  required: true,
                  admin: {
                    description: 'Piano product image (recommended: 800×600px, transparent or white background)',
                  },
                }),
              ],
            },

            // Pricing
            {
              type: 'collapsible',
              label: '💰 Pricing',
              admin: {
                description: 'Original and sale pricing for university discount display',
                initCollapsed: false,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'originalPrice',
                      type: 'number',
                      min: 0,
                      admin: {
                        description: 'Original MSRP price (USD, no formatting)',
                        placeholder: '1099',
                        width: '33%',
                      },
                    },
                    {
                      name: 'salePrice',
                      type: 'number',
                      min: 0,
                      admin: {
                        description: 'University sale price (USD, no formatting)',
                        placeholder: '949',
                        width: '33%',
                      },
                    },
                    {
                      name: 'savingsText',
                      type: 'text',
                      admin: {
                        description: 'Savings label (e.g. "Save $150" or "Save 14%")',
                        placeholder: 'Save $150',
                        width: '34%',
                      },
                    },
                  ],
                },
              ],
            },

            // Key Features
            {
              type: 'collapsible',
              label: '✅ Key Features',
              admin: {
                description: 'Bullet-point feature list shown beneath description',
                initCollapsed: false,
              },
              fields: [
                {
                  name: 'keyFeatures',
                  type: 'array',
                  maxRows: 8,
                  admin: {
                    description: 'Feature bullet points (3–5 recommended)',
                  },
                  fields: [
                    {
                      name: 'feature',
                      type: 'text',
                      required: true,
                      admin: {
                        placeholder: '88 Weighted Keys',
                      },
                    },
                  ],
                },
              ],
            },

            // CTA Button
            {
              type: 'collapsible',
              label: '🔗 CTA Button',
              admin: {
                description: 'Per-piano CTA button (optional — section-level CTA used if empty)',
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'ctaText',
                      type: 'text',
                      admin: {
                        description: 'Button text (leave empty to hide)',
                        placeholder: 'Book Appointment',
                        width: '40%',
                      },
                    },
                    {
                      name: 'ctaLink',
                      type: 'text',
                      admin: {
                        description: 'Button destination URL',
                        placeholder: '#book-appointment',
                        width: '60%',
                        condition: (data: any, siblingData: any) => !!siblingData?.ctaText,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    // Section-level CTA
    {
      type: 'collapsible',
      label: '📅 Section Call-to-Action',
      admin: {
        description: 'Bottom section CTA shown after all piano models',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'sectionCtaHeading',
          type: 'text',
          admin: {
            description: 'Heading above the bottom CTA (e.g. "Schedule Your Personal Appointment")',
            placeholder: 'Schedule Your Personal Appointment',
          },
        },
        {
          name: 'sectionCtaSubtext',
          type: 'textarea',
          maxLength: 300,
          admin: {
            description: 'Supporting text beneath the CTA heading',
            placeholder:
              'Get priority access to special university pricing when you book your appointment.',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'sectionCtaButtonText',
              type: 'text',
              admin: {
                description: 'CTA button text (leave empty to hide)',
                placeholder: 'Book Appointment',
                width: '40%',
              },
            },
            {
              name: 'sectionCtaButtonLink',
              type: 'text',
              admin: {
                description: 'CTA button destination URL',
                placeholder: '#book-appointment',
                width: '60%',
                condition: (data: any, siblingData: any) => !!siblingData?.sectionCtaButtonText,
              },
            },
          ],
        },
        {
          name: 'sectionCtaNote',
          type: 'text',
          admin: {
            description: 'Small note beneath the button (e.g. event dates, fine print)',
            placeholder: 'Appointment required • University community priority access',
          },
        },
      ],
    },
  ],
}
