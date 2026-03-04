import type { Block } from 'payload'

export const ProductFaqBlock: Block = {
  slug: 'product-faq',
  interfaceName: 'ProductFaqBlock',
  labels: {
    singular: 'Product FAQ',
    plural: 'Product FAQs',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Common Questions',
      admin: {
        description: 'Section heading displayed above the FAQ accordion',
      },
    },
    {
      name: 'subheading',
      type: 'text',
      admin: {
        description: 'Optional subheading or intro text below the main heading',
      },
    },
    {
      name: 'theme',
      type: 'select',
      defaultValue: 'pearl',
      options: [
        { label: 'Pearl (Light)', value: 'pearl' },
        { label: 'White', value: 'white' },
        { label: 'Charcoal (Dark)', value: 'charcoal' },
      ],
      admin: {
        description: 'Background color theme for this FAQ section',
      },
    },
    {
      name: 'showViewAllLink',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show a "View all FAQs" link to the full FAQ section',
      },
    },
  ],
}
