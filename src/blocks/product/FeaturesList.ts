import type { Block } from 'payload'

export const FeaturesList: Block = {
  slug: 'product-features',
  labels: {
    singular: '✨ Features List',
    plural: 'Feature Lists',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Features+List',
  imageAltText: 'Highlight product features and benefits with icons, images, or emojis',
  interfaceName: 'ProductFeaturesListBlock',
  fields: [
    // Data Source Configuration
    {
      name: 'dataSource',
      type: 'select',
      defaultValue: 'manual',
      options: [
        { label: 'Manual Entry', value: 'manual' },
        { label: 'Piano Model Data', value: 'pianomodel' },
        { label: 'Hybrid (Piano Model + Overrides)', value: 'hybrid' }
      ],
      admin: {
        description: 'Choose data source for features list'
      }
    },
    // PianoModel Relationship
    {
      name: 'pianoModel',
      type: 'relationship',
      relationTo: 'products',
      maxDepth: 0, // CRITICAL: Prevent circular relationship infinite loop
      admin: {
        description: 'Select piano model to automatically populate key features',
        condition: (data, siblingData) => {
          const dataSource = siblingData?.dataSource;
          return dataSource === 'pianomodel' || dataSource === 'hybrid';
        }
      }
    },
    {
      name: 'header',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'Section title (optional)'
          }
        },
        {
          name: 'subtitle',
          type: 'text',
          admin: {
            description: 'Section subtitle (optional)'
          }
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Section description (optional)'
          }
        }
      ],
      admin: {
        description: 'Optional header content for the features section'
      }
    },
    {
      name: 'features',
      type: 'array',
      required: true,
      minRows: 1,
      labels: {
        singular: 'Feature',
        plural: 'Features'
      },
      fields: [
        {
          name: 'icon',
          type: 'group',
          fields: [
            {
              name: 'type',
              type: 'select',
              defaultValue: 'none',
              options: [
                { label: 'None', value: 'none' },
                { label: 'Custom Image', value: 'image' },
                { label: 'Icon Name', value: 'icon' },
                { label: 'Emoji', value: 'emoji' }
              ],
              admin: {
                description: 'Type of icon to display'
              }
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              maxDepth: 0, // Prevent deep media fetching
              admin: {
                description: 'Custom icon image',
                condition: (data, siblingData) => siblingData?.type === 'image'
              }
            },
            {
              name: 'iconName',
              type: 'text',
              admin: {
                description: 'Icon name (e.g., "check", "star", "music")',
                condition: (data, siblingData) => siblingData?.type === 'icon'
              }
            },
            {
              name: 'emoji',
              type: 'text',
              admin: {
                description: 'Emoji character (e.g., "🎹", "✨", "🎵")',
                condition: (data, siblingData) => siblingData?.type === 'emoji'
              }
            }
          ],
          admin: {
            description: 'Icon configuration for this feature'
          }
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Feature title/name'
          }
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Feature description (optional)'
          }
        },
        {
          name: 'highlight',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Highlight this feature with special styling'
          }
        }
      ],
      admin: {
        description: 'List of features to display'
      }
    },
    {
      name: 'layout',
      type: 'group',
      fields: [
        {
          name: 'style',
          type: 'select',
          defaultValue: 'grid',
          options: [
            { label: 'Grid Layout', value: 'grid' },
            { label: 'List Layout', value: 'list' },
            { label: 'Cards Layout', value: 'cards' },
            { label: 'Minimal List', value: 'minimal' }
          ],
          admin: {
            description: 'Display style for features'
          }
        },
        {
          name: 'columns',
          type: 'select',
          defaultValue: 'two',
          options: [
            { label: '1 Column', value: 'one' },
            { label: '2 Columns', value: 'two' },
            { label: '3 Columns', value: 'three' },
            { label: '4 Columns', value: 'four' }
          ],
          admin: {
            description: 'Number of columns for grid/cards layouts',
            condition: (data, siblingData) => ['grid', 'cards'].includes(siblingData?.style)
          }
        },
        {
          name: 'iconPosition',
          type: 'select',
          defaultValue: 'left',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Top', value: 'top' },
            { label: 'Right', value: 'right' }
          ],
          admin: {
            description: 'Position of icons relative to text'
          }
        },
        {
          name: 'spacing',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'Compact', value: 'compact' },
            { label: 'Medium', value: 'medium' },
            { label: 'Spacious', value: 'spacious' }
          ],
          admin: {
            description: 'Spacing between features'
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
            description: 'Background color for the features section'
          }
        }
      ],
      admin: {
        description: 'Layout and styling options'
      }
    },
    {
      name: 'showNumbers',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show numbered list (1, 2, 3...) instead of icons'
      }
    }
  ]
}