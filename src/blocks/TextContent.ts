import type { Block } from 'payload'

export const TextContent: Block = {
  slug: 'textContent',
  imageURL: 'https://via.placeholder.com/300x200?text=Text+Content',
  imageAltText: 'Rich text content block for articles and descriptions',
  interfaceName: 'TextContentBlock',
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description: 'Rich text content with full formatting capabilities'
      }
    },
    {
      name: 'layout',
      type: 'group',
      fields: [
        {
          name: 'maxWidth',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'Small (600px)', value: 'small' },
            { label: 'Medium (800px)', value: 'medium' },
            { label: 'Large (1000px)', value: 'large' },
            { label: 'Full Width', value: 'full' }
          ],
          admin: {
            description: 'Maximum width of text content'
          }
        },
        {
          name: 'textAlign',
          type: 'select',
          defaultValue: 'left',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
            { label: 'Justify', value: 'justify' }
          ],
          admin: {
            description: 'Text alignment'
          }
        },
        {
          name: 'backgroundColor',
          type: 'select',
          defaultValue: 'none',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Light Gray', value: 'light-gray' },
            { label: 'Dark Gray', value: 'dark-gray' },
            { label: 'Brand Color', value: 'brand' },
            { label: 'Accent Color', value: 'accent' }
          ],
          admin: {
            description: 'Background color for the content area'
          }
        },
        {
          name: 'padding',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' }
          ],
          admin: {
            description: 'Padding around the content'
          }
        },
        {
          name: 'columns',
          type: 'select',
          defaultValue: 'one',
          options: [
            { label: 'Single Column', value: 'one' },
            { label: 'Two Columns', value: 'two' },
            { label: 'Three Columns', value: 'three' }
          ],
          admin: {
            description: 'Number of columns for text layout'
          }
        }
      ],
      admin: {
        description: 'Layout and styling options'
      }
    },
    {
      name: 'enableDropCap',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Enable drop cap (large first letter) for the first paragraph'
      }
    }
  ]
}