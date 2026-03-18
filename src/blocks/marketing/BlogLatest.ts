import type { Block } from 'payload'

export const BlogLatest: Block = {
  slug: 'marketing-blog-latest',
  interfaceName: 'MarketingBlogLatestBlock',
  labels: {
    singular: 'Latest Blog Articles',
    plural: 'Latest Blog Articles',
  },
  fields: [
    {
      name: 'postLimit',
      type: 'number',
      min: 3,
      max: 12,
      defaultValue: 3,
      admin: {
        description: 'Number of latest posts to display',
        step: 1,
      },
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 columns', value: '2' },
        { label: '3 columns', value: '3' },
      ],
      admin: {
        description: 'Number of columns in the grid',
      },
    },
  ],
}
