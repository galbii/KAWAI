import type { Block } from 'payload'

export const Columns: Block = {
  slug: 'layout-columns',
  labels: {
    singular: '📐 Columns',
    plural: 'Column Layouts',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Columns',
  imageAltText: 'Create multi-column layouts for flexible content arrangement (up to 4 columns)',
  interfaceName: 'LayoutColumnsBlock',
  fields: [
    {
      name: 'columns',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 4,
      labels: {
        singular: 'Column',
        plural: 'Columns',
      },
      fields: [
        {
          name: 'width',
          type: 'select',
          required: true,
          defaultValue: '50',
          options: [
            { label: '25% (1/4 width)', value: '25' },
            { label: '33% (1/3 width)', value: '33' },
            { label: '50% (1/2 width)', value: '50' },
            { label: '66% (2/3 width)', value: '66' },
            { label: '75% (3/4 width)', value: '75' },
            { label: '100% (Full width)', value: '100' },
          ],
          admin: {
            description: 'Column width as a percentage of total container width',
          },
        },
        {
          name: 'content',
          type: 'blocks',
          required: true,
          blockReferences: ['content-image', 'content-text', 'content-video', 'layout-spacer', 'layout-divider'] as any,
          blocks: [], // Required to be empty when using blockReferences
          admin: {
            initCollapsed: true,
            description: 'Add content blocks to this column (Image, Text, Video, Spacer, Divider)',
          },
        },
      ],
      admin: {
        description: 'Configure up to 4 columns with customizable widths',
      },
    },
    {
      name: 'layout',
      type: 'group',
      fields: [
        {
          name: 'gap',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'Small (0.5rem)', value: 'small' },
            { label: 'Medium (1rem)', value: 'medium' },
            { label: 'Large (2rem)', value: 'large' },
          ],
          admin: {
            description: 'Horizontal gap/spacing between columns',
          },
        },
        {
          name: 'verticalAlign',
          type: 'select',
          defaultValue: 'top',
          options: [
            { label: 'Top', value: 'top' },
            { label: 'Center', value: 'center' },
            { label: 'Bottom', value: 'bottom' },
          ],
          admin: {
            description: 'Vertical alignment of content within columns',
          },
        },
        {
          name: 'backgroundColor',
          type: 'select',
          defaultValue: 'transparent',
          options: [
            { label: 'Transparent', value: 'transparent' },
            { label: 'White', value: 'white' },
            { label: 'Light Gray', value: 'light' },
            { label: 'Dark Gray', value: 'dark' },
          ],
          admin: {
            description: 'Background color for the entire columns section',
          },
        },
      ],
      admin: {
        description: 'Layout configuration and styling options',
      },
    },
  ],
}
