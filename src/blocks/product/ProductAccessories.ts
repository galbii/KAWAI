import type { Block } from 'payload'

export const ProductAccessories: Block = {
  slug: 'product-accessories',
  labels: {
    singular: '🎹 Accessories',
    plural: 'Accessories',
  },
  imageAltText:
    'Auto-displays accessories compatible with this piano — only renders if accessories exist in the catalog',
  interfaceName: 'ProductAccessoriesBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Accessories & Add-Ons',
      admin: {
        description: 'Section heading (default: "Accessories & Add-Ons")',
      },
    },
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Enhance Your Piano',
      admin: {
        description: 'Small label above the heading',
      },
    },
    {
      name: 'maxItems',
      type: 'number',
      defaultValue: 8,
      min: 2,
      max: 12,
      admin: {
        description: 'Maximum number of accessories to display (2–12)',
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Carousel', value: 'carousel' },
      ],
      admin: {
        description: 'Display layout for accessory cards',
      },
    },
    {
      name: 'theme',
      type: 'select',
      defaultValue: 'light',
      options: [
        { label: 'Light (Pearl)', value: 'light' },
        { label: 'Dark (Charcoal)', value: 'dark' },
      ],
      admin: {
        description: 'Section background theme',
      },
    },
  ],
}
