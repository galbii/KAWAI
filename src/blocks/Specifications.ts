import type { Block } from 'payload'

export const Specifications: Block = {
  slug: 'specifications',
  imageURL: 'https://via.placeholder.com/300x200?text=Specifications',
  imageAltText: 'Specifications block for displaying technical details and product specs',
  interfaceName: 'SpecificationsBlock',
  fields: [
    {
      name: 'header',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Specifications',
          admin: {
            description: 'Section title'
          }
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Optional description above specifications'
          }
        }
      ],
      admin: {
        description: 'Header content for the specifications section'
      }
    },
    {
      name: 'categories',
      type: 'array',
      required: true,
      minRows: 1,
      labels: {
        singular: 'Category',
        plural: 'Specification Categories'
      },
      fields: [
        {
          name: 'categoryName',
          type: 'text',
          required: true,
          admin: {
            description: 'Category name (e.g., "Dimensions", "Sound", "Features")'
          }
        },
        {
          name: 'specifications',
          type: 'array',
          required: true,
          minRows: 1,
          labels: {
            singular: 'Specification',
            plural: 'Specifications'
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: {
                description: 'Specification label (e.g., "Width", "Polyphony", "Weight")'
              }
            },
            {
              name: 'value',
              type: 'text',
              required: true,
              admin: {
                description: 'Specification value (e.g., "145cm", "256 notes", "68kg")'
              }
            },
            {
              name: 'highlight',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Highlight this specification as important'
              }
            },
            {
              name: 'note',
              type: 'text',
              admin: {
                description: 'Additional note or context (optional)'
              }
            }
          ],
          admin: {
            description: 'Individual specifications within this category'
          }
        },
        {
          name: 'collapsible',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Make this category collapsible/expandable'
          }
        },
        {
          name: 'defaultExpanded',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Start expanded (only applies if collapsible is enabled)',
            condition: (data, siblingData) => siblingData?.collapsible === true
          }
        }
      ],
      admin: {
        description: 'Organized specification categories'
      }
    },
    {
      name: 'layout',
      type: 'group',
      fields: [
        {
          name: 'style',
          type: 'select',
          defaultValue: 'table',
          options: [
            { label: 'Table Layout', value: 'table' },
            { label: 'Card Layout', value: 'cards' },
            { label: 'List Layout', value: 'list' },
            { label: 'Grid Layout', value: 'grid' }
          ],
          admin: {
            description: 'Display style for specifications'
          }
        },
        {
          name: 'columns',
          type: 'select',
          defaultValue: 'one',
          options: [
            { label: '1 Column', value: 'one' },
            { label: '2 Columns', value: 'two' },
            { label: '3 Columns', value: 'three' }
          ],
          admin: {
            description: 'Number of columns for categories',
            condition: (data, siblingData) => ['cards', 'grid'].includes(siblingData?.style)
          }
        },
        {
          name: 'showCategoryIcons',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show icons next to category names'
          }
        },
        {
          name: 'alternateRows',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Alternate row colors for better readability',
            condition: (data, siblingData) => ['table', 'list'].includes(siblingData?.style)
          }
        },
        {
          name: 'compactMode',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Use compact spacing for dense information display'
          }
        }
      ],
      admin: {
        description: 'Layout and styling options'
      }
    },
    {
      name: 'downloadOptions',
      type: 'group',
      fields: [
        {
          name: 'enableDownload',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Allow users to download specifications as PDF/document'
          }
        },
        {
          name: 'downloadFile',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Specifications document to download',
            condition: (data, siblingData) => siblingData?.enableDownload === true
          }
        },
        {
          name: 'downloadButtonText',
          type: 'text',
          defaultValue: 'Download Specifications',
          admin: {
            description: 'Download button text',
            condition: (data, siblingData) => siblingData?.enableDownload === true
          }
        }
      ],
      admin: {
        description: 'Options for downloading detailed specifications'
      }
    },
    {
      name: 'comparisonMode',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Enable comparison view (useful for product comparison pages)'
      }
    }
  ]
}