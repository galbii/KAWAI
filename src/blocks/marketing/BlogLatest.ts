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
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Small label above the heading. Defaults to "From the Blog" if left empty.',
        placeholder: 'From the Blog',
      },
    },
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Main section heading. Defaults to "Latest News & Articles" if left empty.',
        placeholder: 'Latest News & Articles',
      },
    },
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
      name: 'filterByTags',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Only show posts that have at least one of these tags. Leave empty to show all posts.',
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
