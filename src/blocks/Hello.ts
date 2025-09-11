import type { Block } from 'payload'

export const Hello: Block = {
  slug: 'hello',
  imageURL: 'https://via.placeholder.com/300x200?text=Hello+Block',
  imageAltText: 'Simple hello block for testing and displaying messages',
  interfaceName: 'HelloBlock',
  fields: [
    {
      name: 'message',
      type: 'text',
      required: true,
      defaultValue: 'Hello, World!',
      admin: {
        description: 'The message to display'
      }
    },
    {
      name: 'showTimestamp',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Display current timestamp with the message'
      }
    },
    {
      name: 'timestampFormat',
      type: 'select',
      defaultValue: 'datetime',
      options: [
        { label: 'Date and Time', value: 'datetime' },
        { label: 'Date Only', value: 'date' },
        { label: 'Time Only', value: 'time' },
        { label: 'Relative (e.g., "2 hours ago")', value: 'relative' }
      ],
      admin: {
        description: 'Format for the timestamp display',
        condition: (data, siblingData) => siblingData?.showTimestamp === true
      }
    },
    {
      name: 'style',
      type: 'group',
      fields: [
        {
          name: 'textSize',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' },
            { label: 'Extra Large', value: 'xl' }
          ],
          admin: {
            description: 'Text size for the message'
          }
        },
        {
          name: 'textAlign',
          type: 'select',
          defaultValue: 'center',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' }
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
            description: 'Background color for the hello block'
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
        }
      ],
      admin: {
        description: 'Styling options for the hello block'
      }
    },
    {
      name: 'additionalContent',
      type: 'group',
      fields: [
        {
          name: 'showDescription',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show additional description text'
          }
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Additional description or context',
            condition: (data, siblingData) => siblingData?.showDescription === true
          }
        },
        {
          name: 'showIcon',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Display an icon with the message'
          }
        },
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Icon name (e.g., "wave", "smile", "star")',
            condition: (data, siblingData) => siblingData?.showIcon === true
          }
        },
        {
          name: 'iconPosition',
          type: 'select',
          defaultValue: 'left',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
            { label: 'Above', value: 'above' },
            { label: 'Below', value: 'below' }
          ],
          admin: {
            description: 'Position of icon relative to message',
            condition: (data, siblingData) => siblingData?.showIcon === true
          }
        }
      ],
      admin: {
        description: 'Additional content options'
      }
    }
  ]
}