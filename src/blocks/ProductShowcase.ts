import type { Block } from 'payload'

export const ProductShowcase: Block = {
  slug: 'productShowcase',
  imageURL: 'https://via.placeholder.com/300x200?text=Product+Showcase',
  imageAltText: 'Product showcase block for displaying product information',
  interfaceName: 'ProductShowcaseBlock',
  fields: [
    {
      name: 'product',
      type: 'group',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Main product image'
          }
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Product title/name'
          }
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Product description'
          }
        },
        {
          name: 'price',
          type: 'group',
          fields: [
            {
              name: 'currency',
              type: 'select',
              defaultValue: 'USD',
              options: [
                { label: 'USD ($)', value: 'USD' },
                { label: 'EUR (€)', value: 'EUR' },
                { label: 'GBP (£)', value: 'GBP' },
                { label: 'CAD (C$)', value: 'CAD' }
              ],
              admin: {
                description: 'Price currency'
              }
            },
            {
              name: 'amount',
              type: 'number',
              admin: {
                description: 'Price amount (leave empty for "Contact for pricing")'
              }
            },
            {
              name: 'saleAmount',
              type: 'number',
              admin: {
                description: 'Sale price (optional, shows original price crossed out)'
              }
            },
            {
              name: 'priceText',
              type: 'text',
              admin: {
                description: 'Custom price text (e.g., "Starting from", "Contact for pricing")'
              }
            }
          ],
          admin: {
            description: 'Product pricing information'
          }
        },
        {
          name: 'finishes',
          type: 'array',
          minRows: 0,
          labels: {
            singular: 'Finish',
            plural: 'Available Finishes'
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              admin: {
                description: 'Finish name (e.g., "Ebony Polish", "White Satin")'
              }
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Finish sample image (optional)'
              }
            },
            {
              name: 'priceModifier',
              type: 'number',
              admin: {
                description: 'Price difference for this finish (+ or -)'
              }
            }
          ],
          admin: {
            description: 'Available finish options for this product'
          }
        },
        {
          name: 'buyButton',
          type: 'group',
          fields: [
            {
              name: 'text',
              type: 'text',
              defaultValue: 'Buy Now',
              required: true,
              admin: {
                description: 'Button text'
              }
            },
            {
              name: 'link',
              type: 'text',
              admin: {
                description: 'Button link/URL (leave empty to disable button)'
              }
            },
            {
              name: 'style',
              type: 'select',
              defaultValue: 'primary',
              options: [
                { label: 'Primary', value: 'primary' },
                { label: 'Secondary', value: 'secondary' },
                { label: 'Outline', value: 'outline' }
              ],
              admin: {
                description: 'Button style'
              }
            },
            {
              name: 'openInNewTab',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Open link in new tab'
              }
            }
          ],
          admin: {
            description: 'Buy button configuration'
          }
        },
        {
          name: 'badge',
          type: 'text',
          admin: {
            description: 'Optional badge text (e.g., "Best Seller", "New", "Limited Edition")'
          }
        },
        {
          name: 'inStock',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Is this product currently in stock?'
          }
        }
      ],
      admin: {
        description: 'Product showcase configuration'
      }
    },
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
            { label: 'Right', value: 'right' },
            { label: 'Top', value: 'top' },
            { label: 'Bottom', value: 'bottom' }
          ],
          admin: {
            description: 'Position of product image relative to content'
          }
        },
        {
          name: 'showFinishes',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show available finishes in this block'
          }
        },
        {
          name: 'showPrice',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show pricing information in this block'
          }
        },
        {
          name: 'compact',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Use compact layout (smaller spacing, condensed content)'
          }
        }
      ],
      admin: {
        description: 'Layout and display options'
      }
    }
  ]
}