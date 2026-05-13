import type { Block } from 'payload'

export const UniversityFaq: Block = {
  slug: 'university-faq',
  labels: {
    singular: '❓ University FAQ',
    plural: 'University FAQ Sections',
  },
  imageURL: 'https://via.placeholder.com/800x600?text=University+FAQ',
  imageAltText:
    'Accordion FAQ section with expandable question/answer pairs and optional dark or light background.',
  interfaceName: 'UniversityFaqBlock',
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
                description: 'Main heading for the FAQ section',
                placeholder: 'Frequently Asked Questions',
              },
            },
            {
              name: 'subheading',
              type: 'text',
              admin: {
                description: 'Subheading / short description below the heading',
                placeholder: 'Everything you need to know about our piano sale event',
              },
            },
          ],
        },
      ],
    },

    // ========================================================================
    // FAQ Items
    // ========================================================================
    {
      type: 'collapsible',
      label: '❓ FAQ Items',
      admin: {
        description: 'Individual question / answer pairs',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'faqs',
          type: 'array',
          maxRows: 20,
          admin: {
            description: 'Add up to 20 FAQ items',
          },
          fields: [
            {
              name: 'question',
              type: 'text',
              required: true,
              admin: {
                placeholder: 'What types of pianos will be available?',
              },
            },
            {
              name: 'answer',
              type: 'textarea',
              required: true,
              admin: {
                placeholder: "We carry digital, upright, and grand pianos from Kawai's full lineup…",
              },
            },
          ],
        },
      ],
    },

    // ========================================================================
    // Appearance
    // ========================================================================
    {
      type: 'collapsible',
      label: '🎨 Appearance',
      admin: {
        description: 'Background and visual style',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'background',
          type: 'select',
          defaultValue: 'light',
          options: [
            { label: 'Light (kawai-pearl)', value: 'light' },
            { label: 'White', value: 'white' },
            { label: 'Dark (kawai-black)', value: 'dark' },
          ],
          admin: {
            description: 'Background color for the FAQ section',
          },
        },
      ],
    },
  ],
}
