import type { Block } from 'payload'
import { imageField } from '@/lib/payload/fields'

export const UniversitySocialProof: Block = {
  slug: 'university-social-proof',
  labels: {
    singular: '⭐ University Social Proof',
    plural: 'University Social Proof Sections',
  },
  imageURL: 'https://via.placeholder.com/800x600?text=University+Social+Proof',
  imageAltText:
    'Social proof section with a stats row (4 numbers) and a 3-column testimonials grid with star ratings and author info.',
  interfaceName: 'UniversitySocialProofBlock',
  fields: [
    // ========================================================================
    // Content
    // ========================================================================
    {
      type: 'collapsible',
      label: '📝 Content',
      admin: {
        description: 'Section heading and subheading',
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'sectionHeading',
              type: 'text',
              admin: {
                description: 'Main heading (e.g., "What Our Community Says")',
                placeholder: 'What Our Community Says',
              },
            },
            {
              name: 'subheading',
              type: 'text',
              admin: {
                description: 'Subheading or tagline below the heading',
                placeholder: 'Join hundreds of satisfied families',
              },
            },
          ],
        },
      ],
    },

    // ========================================================================
    // Stats
    // ========================================================================
    {
      type: 'collapsible',
      label: '📊 Stats',
      admin: {
        description: 'Up to 4 headline numbers displayed in a row at the top',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'stats',
          type: 'array',
          maxRows: 4,
          admin: {
            description: 'Key metrics (e.g., "500+ Happy Customers")',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'number',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'The big number or value',
                    placeholder: '500+',
                  },
                },
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Descriptive label below the number',
                    placeholder: 'Happy Customers',
                  },
                },
              ],
            },
            {
              name: 'sublabel',
              type: 'text',
              admin: {
                description: 'Optional smaller text below the label (e.g., "4.9/5 satisfaction")',
                placeholder: '4.9/5 satisfaction',
              },
            },
          ],
        },
      ],
    },

    // ========================================================================
    // Testimonials
    // ========================================================================
    {
      type: 'collapsible',
      label: '💬 Testimonials',
      admin: {
        description: 'Customer reviews / quotes',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'testimonials',
          type: 'array',
          maxRows: 12,
          admin: {
            description: 'Customer testimonial cards',
          },
          fields: [
            {
              name: 'quote',
              type: 'textarea',
              required: true,
              admin: {
                placeholder: 'Outstanding service! Their expertise gave us confidence in our investment.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'authorName',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: 'Jennifer M.',
                  },
                },
                {
                  name: 'authorTitle',
                  type: 'text',
                  admin: {
                    description: 'Role, location, or affiliation',
                    placeholder: 'Katy, TX',
                  },
                },
                {
                  name: 'rating',
                  type: 'number',
                  defaultValue: 5,
                  min: 1,
                  max: 5,
                  admin: {
                    description: 'Star rating 1–5',
                    step: 1,
                  },
                },
              ],
            },
            imageField('authorImage', {
              required: false,
              admin: {
                description: 'Optional author avatar (square, min 80×80px)',
              },
            }),
          ],
        },
      ],
    },
  ],
}
