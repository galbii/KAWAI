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
    {
      name: 'showCta',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show a primary call-to-action button below the grid',
      },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      defaultValue: 'View all posts',
      admin: {
        description: 'Primary CTA label',
        condition: (data) => data.showCta,
      },
    },
    {
      name: 'ctaHref',
      type: 'text',
      defaultValue: '/blog',
      admin: {
        description: 'Primary CTA link URL',
        condition: (data) => data.showCta,
      },
    },
    {
      name: 'showSecondaryCta',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show a secondary call-to-action button alongside the primary',
      },
    },
    {
      name: 'secondaryCtaLabel',
      type: 'text',
      admin: {
        description: 'Secondary CTA label',
        condition: (data) => data.showSecondaryCta,
        placeholder: 'e.g. Subscribe to newsletter',
      },
    },
    {
      name: 'secondaryCtaHref',
      type: 'text',
      admin: {
        description: 'Secondary CTA link URL',
        condition: (data) => data.showSecondaryCta,
      },
    },
  ],
}
