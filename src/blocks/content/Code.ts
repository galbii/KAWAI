import type { Block } from 'payload'

export const Code: Block = {
  slug: 'content-code',
  labels: {
    singular: '💻 Code',
    plural: 'Code Blocks',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Code',
  imageAltText: 'Display syntax-highlighted code snippets for technical content',
  interfaceName: 'ContentCodeBlock',
  fields: [
    {
      name: 'language',
      type: 'select',
      defaultValue: 'typescript',
      options: [
        { label: 'TypeScript', value: 'typescript' },
        { label: 'JavaScript', value: 'javascript' },
        { label: 'CSS', value: 'css' },
        { label: 'Python', value: 'python' },
        { label: 'Bash', value: 'bash' },
      ],
      required: true,
      admin: {
        description: 'Programming language for syntax highlighting',
      },
    },
    {
      name: 'code',
      type: 'code',
      label: false,
      required: true,
      admin: {
        description: 'Enter your code snippet here',
      },
    },
  ],
}
