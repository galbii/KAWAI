import type { Block } from 'payload'

export const ProductShowcase: Block = {
  slug: 'productShowcase',
  imageURL: 'https://via.placeholder.com/300x200?text=Product+Showcase',
  imageAltText: 'Product showcase block for displaying product information',
  interfaceName: 'ProductShowcaseBlock',
  fields: [
    // Data Source Configuration
    {
      name: 'dataSource',
      type: 'select',
      defaultValue: 'manual',
      options: [
        { label: 'Manual Entry', value: 'manual' },
        { label: 'Piano Model Data', value: 'pianomodel' },
        { label: 'Hybrid (Piano Model + Overrides)', value: 'hybrid' }
      ],
      admin: {
        description: 'Choose data source for product information'
      }
    },
    // PianoModel Relationship
    {
      name: 'pianoModel',
      type: 'relationship',
      relationTo: 'products',
      maxDepth: 0, // CRITICAL: Prevent circular relationship infinite loop
      admin: {
        description: 'Select piano model to automatically populate product information',
        condition: (data, siblingData) => {
          const dataSource = siblingData?.dataSource;
          return dataSource === 'pianomodel' || dataSource === 'hybrid';
        }
      }
    },
    {
      name: 'product',
      type: 'group',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          maxDepth: 0, // Prevent deep media fetching
          admin: {
            description: 'Main product image (leave empty to use Piano Model image)',
            condition: (data) => {
              const dataSource = data?.dataSource;
              return dataSource === 'manual' || dataSource === 'hybrid';
            }
          }
        },
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'Product title/name (leave empty to use Piano Model name)',
            condition: (data) => {
              const dataSource = data?.dataSource;
              return dataSource === 'manual' || dataSource === 'hybrid';
            }
          }
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Product description (leave empty to use Piano Model description)',
            condition: (data) => {
              const dataSource = data?.dataSource;
              return dataSource === 'manual' || dataSource === 'hybrid';
            }
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
                description: 'Price currency (leave empty to use Piano Model currency)'
              }
            },
            {
              name: 'amount',
              type: 'number',
              admin: {
                description: 'Price amount (leave empty to use Piano Model pricing)'
              }
            },
            {
              name: 'saleAmount',
              type: 'number',
              admin: {
                description: 'Sale price (leave empty to use Piano Model sale price)'
              }
            },
            {
              name: 'priceText',
              type: 'text',
              admin: {
                description: 'Custom price text (leave empty to use Piano Model price text)'
              }
            }
          ],
          admin: {
            description: 'Product pricing information (overrides Piano Model pricing when provided)',
            condition: (data) => {
              const dataSource = data?.dataSource;
              return dataSource === 'manual' || dataSource === 'hybrid';
            }
          }
        },
        {
          name: 'variations',
          type: 'array',
          minRows: 0,
          labels: {
            singular: 'Variation',
            plural: 'Available Variations'
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              admin: {
                description: 'Variation name (e.g., "Ebony Polish", "White Satin")'
              }
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              maxDepth: 0, // Prevent deep media fetching in variations array
              admin: {
                description: 'Variation sample image (optional)'
              }
            },
            {
              name: 'priceModifier',
              type: 'number',
              admin: {
                description: 'Price difference for this variation (+ or -)'
              }
            }
          ],
          admin: {
            description: 'Available variation options (overrides Piano Model variations when provided)',
            condition: (data) => {
              const dataSource = data?.dataSource;
              return dataSource === 'manual' || dataSource === 'hybrid';
            }
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
          name: 'showVariations',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show available variations in this block'
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