import type { Block } from 'payload'

export const Text: Block = {
  slug: 'content-text',
  labels: {
    singular: '📝 Text',
    plural: 'Text Blocks',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Text',
  imageAltText: 'Add rich text content with formatting (bold, italic, lists, links)',
  interfaceName: 'ContentTextBlock',
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      // Editor config inherited from parent - prevents nested editor serialization issues
      admin: {
        description: 'Text content with basic formatting (bold, italic, lists, links)',
      },
    },
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
        { label: 'Justify', value: 'justify' },
      ],
      admin: {
        description: 'Text alignment within the content area',
      },
    },
  ],
}
