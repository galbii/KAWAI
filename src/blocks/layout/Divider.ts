import type { Block } from 'payload'

export const Divider: Block = {
  slug: 'layout-divider',
  labels: {
    singular: '➖ Divider',
    plural: 'Dividers',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Divider',
  imageAltText: 'Add horizontal dividing lines to separate content sections',
  interfaceName: 'LayoutDividerBlock',
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'solid',
      options: [
        { label: 'Solid Line', value: 'solid' },
        { label: 'Dashed Line', value: 'dashed' },
        { label: 'Dotted Line', value: 'dotted' },
      ],
      admin: {
        description: 'Visual style of the dividing line',
      },
    },
    {
      name: 'color',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default (Light Gray)', value: 'default' },
        { label: 'Dark Gray', value: 'dark' },
        { label: 'Brand Color', value: 'brand' },
      ],
      admin: {
        description: 'Color of the dividing line',
      },
    },
    {
      name: 'width',
      type: 'select',
      defaultValue: 'full',
      options: [
        { label: 'Full Width', value: 'full' },
        { label: '75% Width', value: '75' },
        { label: '50% Width', value: '50' },
        { label: '25% Width', value: '25' },
      ],
      admin: {
        description: 'Width of the dividing line relative to container',
      },
    },
    {
      name: 'spacing',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Small (1rem)', value: 'small' },
        { label: 'Medium (2rem)', value: 'medium' },
        { label: 'Large (4rem)', value: 'large' },
      ],
      admin: {
        description: 'Vertical spacing above and below the divider',
      },
    },
  ],
}
