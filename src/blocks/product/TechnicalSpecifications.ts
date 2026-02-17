import type { Block } from 'payload'
import { imageField } from '@/lib/payload/fields'

export const TechnicalSpecifications: Block = {
  slug: 'product-technical-specs',
  interfaceName: 'ProductTechnicalSpecsBlock',
  labels: {
    singular: '📐 Technical Specifications',
    plural: 'Technical Specifications',
  },
  imageURL: 'https://via.placeholder.com/400x250?text=Technical+Specs+Block',
  imageAltText:
    'Technical specifications block - displays product specifications in a clean table format with optional blueprint diagram',
  fields: [
    // --- Data Source ---
    {
      name: 'dataSource',
      type: 'select',
      defaultValue: 'product',
      options: [
        { label: '📦 Product Collection (auto)', value: 'product' },
        { label: '✏️ Manual Entry', value: 'manual' },
        { label: '🔀 Hybrid (Product + Manual)', value: 'hybrid' },
      ],
      admin: {
        description:
          'Product: automatically pulls specifications and blueprint from the linked product. Manual: enter specs by hand. Hybrid: product specs + manual additions.',
      },
    },

    // --- Product Relationship ---
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      maxDepth: 1,
      admin: {
        description:
          'Select the product to pull specifications and blueprint from. Leave empty on a product page to use the page product automatically.',
        condition: (data) => data.dataSource === 'product' || data.dataSource === 'hybrid',
      },
    },

    // --- Header Section ---
    {
      type: 'group',
      name: 'header',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Technical Specifications',
          admin: {
            description: 'Section heading',
          },
        },
        {
          name: 'subtitle',
          type: 'text',
          admin: {
            description: 'Optional subtitle shown below the heading',
          },
        },
        {
          name: 'showModelNumber',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Display the product model number as a label above the title',
          },
        },
      ],
    },

    // --- Blueprint Image ---
    // For manual/hybrid modes — in product mode, the blueprint URL is pulled from the product
    imageField('blueprintImage', {
      required: false,
      admin: {
        description:
          'Technical blueprint diagram (used in Manual and Hybrid modes). In Product mode the blueprint is pulled automatically from the product.',
        condition: (data) => data.dataSource === 'manual' || data.dataSource === 'hybrid',
      },
    }),
    {
      name: 'blueprintCaption',
      type: 'text',
      admin: {
        description: 'Caption displayed below the blueprint image',
      },
    },
    {
      name: 'showGridOverlay',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Overlay a subtle engineering grid pattern on the blueprint image',
      },
    },

    // --- Manual Categories (manual / hybrid modes) ---
    {
      name: 'categories',
      type: 'array',
      maxRows: 20,
      labels: {
        singular: 'Category',
        plural: 'Specification Categories',
      },
      admin: {
        description: 'Specification categories for manual entry',
        condition: (data) => data.dataSource === 'manual' || data.dataSource === 'hybrid',
      },
      fields: [
        {
          name: 'categoryName',
          type: 'text',
          required: true,
          admin: {
            description: 'Category name (e.g., Sound, Keyboard, Dimensions)',
          },
        },
        {
          name: 'specifications',
          type: 'array',
          maxRows: 30,
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: {
                description: 'Specification name (e.g., Polyphony, Keys)',
              },
            },
            {
              name: 'value',
              type: 'text',
              required: true,
              admin: {
                description: 'Specification value (e.g., 256, 88)',
              },
            },
            {
              name: 'unit',
              type: 'text',
              admin: {
                description: 'Unit of measurement (optional, e.g., kg, cm, W)',
              },
            },
            {
              name: 'note',
              type: 'text',
              admin: {
                description: 'Additional note or clarification',
              },
            },
            {
              name: 'highlight',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Highlight this row (draws attention to key specs)',
              },
            },
          ],
        },
        {
          name: 'collapsible',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Allow this category to be collapsed and expanded by the user',
          },
        },
        {
          name: 'defaultExpanded',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Start expanded (only applies when Collapsible is enabled)',
            condition: (_data, siblingData) => siblingData?.collapsible === true,
          },
        },
      ],
    },

    // --- Display Options ---
    {
      name: 'theme',
      type: 'select',
      defaultValue: 'light',
      options: [
        { label: '📘 Blueprint (Dark Blue)', value: 'blueprint' },
        { label: '⬜ Light (Pearl)', value: 'light' },
        { label: '⬛ Charcoal', value: 'charcoal' },
      ],
      admin: {
        description: 'Visual theme for the specifications section',
      },
    },
    {
      name: 'gridColumns',
      type: 'select',
      defaultValue: '1',
      options: [
        { label: '1 Column (default)', value: '1' },
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
      ],
      admin: {
        description: 'Number of columns for specification categories',
      },
    },
    {
      name: 'showGridBackground',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show a subtle engineering grid pattern in the section background',
      },
    },
    {
      name: 'showRegistrationMarks',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show corner registration marks (engineering drawing aesthetic)',
      },
    },
    {
      name: 'enableDownload',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show a download button for specifications',
      },
    },
    {
      name: 'downloadButtonText',
      type: 'text',
      defaultValue: 'Download Technical Specs',
      admin: {
        description: 'Label for the download button',
        condition: (data) => data.enableDownload === true,
      },
    },
  ],
}
