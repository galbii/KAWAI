import type { Block } from 'payload'

export const Columns: Block = {
  slug: 'columns',
  imageURL: 'https://via.placeholder.com/300x200?text=Columns',
  imageAltText: 'Multi-column layout block for flexible content arrangement',
  interfaceName: 'ColumnsBlock',
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
            description: 'Column width percentage',
          },
        },
        {
          name: 'content',
          type: 'blocks',
          required: true,
          blockReferences: ['image', 'text', 'video', 'spacer', 'divider'],
          blocks: [], // Required to be empty when using blockReferences
          admin: {
            description: 'Column content - add Image, Text, Video, Spacer, or Divider blocks',
          },
        },
      ],
      admin: {
        description: 'Add and configure columns (up to 4 columns)',
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
            description: 'Gap/spacing between columns',
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
            description: 'Vertical alignment of column content',
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
            description: 'Background color for the columns section',
          },
        },
      ],
      admin: {
        description: 'Layout configuration for columns',
      },
    },
  ],
}
