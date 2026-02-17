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
          defaultValue: 'white',
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
    },
    {
      name: 'additionalImages',
      type: 'array',
      label: '📸 Additional Gallery Images',
      admin: {
        description: 'Extra images appended to the product gallery after Shopify media',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          maxDepth: 1,
          admin: { description: 'Gallery image' }
        },
        {
          name: 'alt',
          type: 'text',
          admin: { description: 'Alt text (optional — falls back to product name)' }
        }
      ]
    },
    {
      name: 'floatingCart',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show floating add to cart button that follows as user scrolls (syncs with variation selection)'
          }
        },
        {
          name: 'position',
          type: 'select',
          defaultValue: 'bottom-right',
          options: [
            { label: 'Bottom Right', value: 'bottom-right' },
            { label: 'Bottom Left', value: 'bottom-left' },
            { label: 'Bottom Center', value: 'bottom-center' },
          ],
          admin: {
            description: 'Position of the floating button on screen',
            condition: (data) => data.floatingCart?.enabled === true
          }
        },
        {
          name: 'showOnScroll',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Only show button after user scrolls down (hides at top of page)',
            condition: (data) => data.floatingCart?.enabled === true
          }
        },
        {
          name: 'scrollThreshold',
          type: 'number',
          defaultValue: 300,
          min: 0,
          max: 2000,
          admin: {
            description: 'Pixels to scroll before showing button (only applies if "Show on Scroll" is enabled)',
            condition: (data) => data.floatingCart?.enabled === true && data.floatingCart?.showOnScroll === true
          }
        },
        {
          name: 'showVariantName',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Display selected variation name above Add to Cart button (e.g., "Ebony Polish")',
            condition: (data) => data.floatingCart?.enabled === true
          }
        }
      ],
      admin: {
        description: '🛒 Configure floating add to cart button - syncs with variation selection in hero section'
      }
    }
  ]
}
