import type { Block } from 'payload'

export const RelatedProducts: Block = {
  slug: 'product-related-products',
  labels: {
    singular: '🔗 Related Products',
    plural: 'Related Products',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Related+Products',
  imageAltText:
    'Show related products from the same collection and accessories — auto-discovers products from the same series to help customers explore more',
  interfaceName: 'ProductRelatedProductsBlock',
  fields: [
    // Section Header
    {
      name: 'sectionHeader',
      type: 'group',
      admin: {
        description: 'Heading shown above the related products grid',
      },
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          admin: {
            description: 'Small label above the heading (e.g., "Explore More")',
          },
        },
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'You May Also Like',
          admin: {
            description: 'Section heading',
          },
        },
        {
          name: 'subheading',
          type: 'textarea',
          admin: {
            description: 'Optional supporting description below the heading',
          },
        },
      ],
    },

    // Selection Mode — automatic discovery vs hand-picked products
    {
      name: 'selectionMode',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'Automatic (discover by collection/compatibility)', value: 'auto' },
        { label: 'Curated Only (hand-picked products replace automatic)', value: 'curated' },
        { label: 'Curated + Automatic (picks first, auto fills the rest)', value: 'curatedPlusAuto' },
      ],
      admin: {
        description:
          'Automatic discovers related products for you. Curated Only shows exactly the products you pick below, in that order. Curated + Automatic shows your picks first, then fills remaining slots automatically.',
      },
    },

    // Curated Products — only shown for curated modes
    {
      name: 'curatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: {
        condition: (_, siblingData) =>
          siblingData?.selectionMode === 'curated' || siblingData?.selectionMode === 'curatedPlusAuto',
        description:
          'Hand-pick any products — pianos, accessories, software. They display in the order you add them here.',
      },
    },

    // Display Mode — applies to the automatic portion only
    {
      name: 'displayMode',
      type: 'select',
      defaultValue: 'collection',
      options: [
        { label: 'Same Collection Only', value: 'collection' },
        { label: 'Accessories Only', value: 'accessories' },
        { label: 'Both (Collection + Accessories)', value: 'both' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.selectionMode !== 'curated',
        description:
          'Which related products to auto-discover — "Same Collection" finds products from the same Shopify series, "Accessories" shows add-ons, "Both" combines them. Hidden in Curated Only mode.',
      },
    },

    // Max Products
    {
      name: 'maxProducts',
      type: 'number',
      defaultValue: 4,
      min: 2,
      max: 8,
      admin: {
        description: 'Maximum number of product cards to display (2–8)',
      },
    },

    // Layout
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid (Responsive)', value: 'grid' },
        { label: 'Carousel (Horizontal Scroll)', value: 'carousel' },
      ],
      admin: {
        description: 'Grid: responsive columns. Carousel: horizontal scroll with arrows.',
      },
    },

    // Show Price
    {
      name: 'showPrice',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show MSRP price on each product card',
      },
    },

    // Theme
    {
      name: 'theme',
      type: 'select',
      defaultValue: 'light',
      options: [
        { label: 'Light (Pearl)', value: 'light' },
        { label: 'Dark (Charcoal)', value: 'dark' },
      ],
      admin: {
        description: 'Section background — Light matches pearl pages, Dark creates contrast',
      },
    },
  ],
}
