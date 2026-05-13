import type { Block } from 'payload'
import { imageField } from '@/lib/payload/fields'

export const UniversityValueProps: Block = {
  slug: 'university-value-props',
  labels: {
    singular: '🎯 University Value Props',
    plural: 'University Value Props Sections',
  },
  interfaceName: 'UniversityValuePropsBlock',
  fields: [
    // Section Content
    {
      type: 'collapsible',
      label: '📝 Section Content',
      admin: {
        description: 'Heading and subheading for the value propositions section',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
          admin: {
            description: 'Section heading (e.g. "Special University Pricing")',
            placeholder: 'Special University Pricing',
          },
        },
        {
          name: 'subheading',
          type: 'textarea',
          maxLength: 200,
          admin: {
            description: 'Optional subheading below the main heading',
            placeholder: 'Exclusive savings for the university community with flexible financing options',
          },
        },
      ],
    },

    // Background & Overlay
    {
      type: 'collapsible',
      label: '🖼️ Background & Overlay',
      admin: {
        description: 'Background image and dark overlay settings',
        initCollapsed: false,
      },
      fields: [
        imageField('backgroundImage', {
          admin: {
            description:
              'Full-bleed background image (recommended: 1920×1080px or higher, dark scene works best)',
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
                { label: 'Dark (Black)', value: 'dark' },
                { label: 'Kawai Red', value: 'red' },
                { label: 'Deep Navy', value: 'navy' },
                { label: 'None', value: 'none' },
              ],
              admin: {
                description: 'Overlay color for text legibility',
              },
            },
            {
              name: 'overlayOpacity',
              type: 'number',
              min: 0,
              max: 1,
              defaultValue: 0.75,
              admin: {
                step: 0.05,
                description: 'Overlay opacity (0 = none, 1 = fully opaque)',
                condition: (data: any, siblingData: any) => siblingData?.overlayColor !== 'none',
              },
            },
          ],
        },
      ],
    },

    // Value Propositions
    {
      type: 'collapsible',
      label: '✨ Value Propositions',
      admin: {
        description: 'The 3 benefit columns. Each has an icon, title, and description.',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'propositions',
          type: 'array',
          minRows: 1,
          maxRows: 3,
          defaultValue: [
            { icon: 'graduation-cap', title: 'University Pricing', description: '' },
            { icon: 'piano', title: 'Premium Selection', description: '' },
            { icon: 'shield', title: 'Protection & Support', description: '' },
          ],
          admin: {
            description: 'Add up to 3 value propositions (3-column layout)',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  required: true,
                  defaultValue: 'star',
                  options: [
                    { label: '🛡️ Shield', value: 'shield' },
                    { label: '⭐ Star', value: 'star' },
                    { label: '🚚 Truck / Delivery', value: 'truck' },
                    { label: '🎹 Piano', value: 'piano' },
                    { label: '⏰ Clock', value: 'clock' },
                    { label: '✅ Check / Verified', value: 'check' },
                    { label: '❤️ Heart', value: 'heart' },
                    { label: '🏆 Award', value: 'award' },
                    { label: '🎓 Graduation Cap', value: 'graduation-cap' },
                    { label: '📞 Phone', value: 'phone' },
                  ],
                  admin: {
                    description: 'Icon displayed above the title',
                    width: '25%',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Proposition title',
                    placeholder: 'University Pricing',
                    width: '75%',
                  },
                },
              ],
            },
            {
              name: 'description',
              type: 'textarea',
              maxLength: 300,
              admin: {
                description: 'Brief description (1–3 sentences)',
                placeholder:
                  'Exclusive discounts for students, faculty, and staff with special financing available.',
              },
            },
            // Optional CTA
            {
              type: 'collapsible',
              label: 'CTA (optional)',
              admin: {
                description: 'Optional call-to-action link below the description',
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
                        description: 'Button / link text (leave empty to hide)',
                        placeholder: 'Learn more',
                        width: '40%',
                      },
                    },
                    {
                      name: 'ctaLink',
                      type: 'text',
                      admin: {
                        description: 'Destination URL',
                        placeholder: '/university-pricing',
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

    // Section CTA
    {
      type: 'collapsible',
      label: '📞 Section Call-to-Action',
      admin: {
        description: 'Optional bottom CTA area (e.g. phone number, appointment link)',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'sectionCtaBadgeText',
          type: 'text',
          admin: {
            description: 'Small badge text above the CTA (e.g. "Limited appointment slots")',
            placeholder: 'Limited appointment slots — priority access for university community',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'sectionCtaText',
              type: 'text',
              admin: {
                description: 'CTA button text (leave empty to hide)',
                placeholder: 'Book Appointment',
                width: '40%',
              },
            },
            {
              name: 'sectionCtaLink',
              type: 'text',
              admin: {
                description: 'CTA destination URL',
                placeholder: '#book-appointment',
                width: '60%',
                condition: (data: any, siblingData: any) => !!siblingData?.sectionCtaText,
              },
            },
          ],
        },
      ],
    },
  ],
}
