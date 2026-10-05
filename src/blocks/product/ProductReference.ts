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
      name: 'dealerCta',
      type: 'group',
      admin: {
        description:
          '📍 Override the "Find a Dealer" button. This button renders whenever the card can’t transact — on the Canada site, when the product has no Shopify link, or when the selected finish is out of stock.',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          admin: {
            placeholder: 'Find a Dealer',
            description: 'Optional button label override',
          },
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            placeholder: '/find-a-dealer',
            description:
              'Send the button somewhere other than /find-a-dealer (e.g. "/store/st-louis", "/contact", or a full https:// URL). Leave blank for the default.',
          },
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Open the link in a new tab',
          },
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
