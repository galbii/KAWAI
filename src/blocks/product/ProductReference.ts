import type { Block } from 'payload'

export const ProductReference: Block = {
  slug: 'product-reference',
  interfaceName: 'ProductReferenceBlock',
  labels: {
    singular: '🎹 Product Reference',
    plural: 'Product References',
  },
  imageAltText: 'Embed a product card with live Shopify pricing and cart actions',
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      admin: {
        description: 'Select a product from the catalog. Pricing and variants are pulled live from Shopify.',
      },
    },
    {
      name: 'display',
      type: 'group',
      admin: {
        description: 'Choose which elements appear on the card. Price and cart actions are automatically hidden for the Canada site.',
      },
      fields: [
        {
          name: 'showPrice',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Show live Shopify pricing' },
        },
        {
          name: 'showBuyNow',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Show Buy Now button (opens checkout)' },
        },
        {
          name: 'showAddToCart',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Show Add to Cart button' },
        },
        {
          name: 'showDescription',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Show product description excerpt' },
        },
        {
          name: 'showVariantSelector',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Show variant selector when the product has multiple finishes or configurations' },
        },
      ],
    },
    {
      name: 'layout',
      type: 'group',
      admin: {
        description: 'Visual layout of the product card',
      },
      fields: [
        {
          name: 'orientation',
          type: 'select',
          defaultValue: 'horizontal',
          options: [
            { label: 'Horizontal (image left, details right)', value: 'horizontal' },
            { label: 'Vertical (image on top)', value: 'vertical' },
          ],
        },
        {
          name: 'imageSize',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' },
          ],
          admin: {
            condition: (data) => data.layout?.orientation === 'horizontal',
          },
        },
        {
          name: 'backgroundColor',
          type: 'select',
          defaultValue: 'white',
          options: [
            { label: 'White', value: 'white' },
            { label: 'Pearl (Light)', value: 'pearl' },
            { label: 'Black', value: 'black' },
          ],
        },
      ],
    },
  ],
}
