import type { Block } from 'payload'

export const FloatingAddToCart: Block = {
  slug: 'product-floating-add-to-cart',
  labels: {
    singular: '🛒 Floating Add to Cart',
    plural: 'Floating Add to Cart Buttons',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Floating+Cart',
  imageAltText: 'Floating add to cart button overlay in bottom right corner',
  interfaceName: 'ProductFloatingAddToCartBlock',
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Toggle to show or hide the floating add to cart button',
      },
    },
    {
      name: 'buttonText',
      type: 'text',
      defaultValue: 'Add to Cart',
      admin: {
        description: 'Custom text for the add to cart button',
        placeholder: 'Add to Cart',
      },
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
        description: 'Position of the floating button on the screen',
      },
    },
    {
      name: 'showOnScroll',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Only show button after user scrolls down (hides initially)',
      },
    },
    {
      name: 'scrollThreshold',
      type: 'number',
      defaultValue: 300,
      min: 0,
      max: 2000,
      admin: {
        description: 'Pixels to scroll before showing button (only if "Show on Scroll" is enabled)',
        condition: (data) => data.showOnScroll === true,
      },
    },
  ],
}
