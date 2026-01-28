import type { Block } from 'payload'

export const ProductHero: Block = {
  slug: 'product-hero',
  labels: {
    singular: '🏆 Product Hero',
    plural: 'Product Heroes',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Product+Hero',
  imageAltText: 'Product hero section that automatically uses product document data',
  interfaceName: 'ProductHeroBlock',
  fields: [
    {
      name: 'layout',
      type: 'group',
      fields: [
        {
          name: 'imagePosition',
          type: 'select',
          defaultValue: 'left',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' }
          ],
          admin: {
            description: 'Position of product image relative to content'
          }
        },
        {
          name: 'backgroundColor',
          type: 'select',
          defaultValue: 'pearl',
          options: [
            { label: 'Pearl (Light)', value: 'pearl' },
            { label: 'White', value: 'white' },
            { label: 'Black', value: 'black' }
          ],
          admin: {
            description: 'Background color for the hero section'
          }
        },
        {
          name: 'showVariations',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show available product variations section'
          }
        },
        {
          name: 'showPrice',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show pricing information in hero'
          }
        },
        {
          name: 'showBuyButton',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show buy/contact button'
          }
        }
      ],
      admin: {
        description: 'Layout and display options for the product hero'
      }
    },
    {
      name: 'overrides',
      type: 'group',
      fields: [
        {
          name: 'customTitle',
          type: 'text',
          admin: {
            description: 'Override the product name with a custom title (optional)'
          }
        },
        {
          name: 'customDescription',
          type: 'textarea',
          admin: {
            description: 'Override the product description with custom text (optional)'
          }
        },
        {
          name: 'customImage',
          type: 'upload',
          relationTo: 'media',
          maxDepth: 0, // Prevent deep media fetching
          admin: {
            description: 'Override the main product image (optional)'
          }
        },
        {
          name: 'badge',
          type: 'text',
          admin: {
            description: 'Optional badge text (e.g., "Best Seller", "New", "Limited Edition")'
          }
        }
      ],
      admin: {
        description: 'Optional overrides for product data (leave empty to use product document data)'
      }
    }
  ]
}
