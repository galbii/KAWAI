import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Text: Block = {
  slug: 'text',
  imageURL: 'https://via.placeholder.com/300x200?text=Text',
  imageAltText: 'Text block for rich text content',
  interfaceName: 'TextBlock',
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: lexicalEditor(),
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
        description: 'Text alignment',
      },
    },
  ],
}
