import type { Block } from 'payload'

export const FeaturedCollections: Block = {
  slug: 'marketing-featured-collections',
  labels: {
    singular: '⭐ Featured Collections',
    plural: 'Featured Collections Sections',
  },
  interfaceName: 'MarketingFeaturedCollectionsBlock',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Kawai Piano',
      admin: { description: 'Small label above the heading' },
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Featured Collections',
      admin: { description: 'Section heading' },
    },
    {
      name: 'ctaText',
      type: 'text',
      defaultValue: 'Explore All',
      admin: { description: 'CTA link text' },
    },
    {
      name: 'ctaHref',
      type: 'text',
      defaultValue: '/pianos',
      admin: { description: 'CTA link destination' },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 9,
      min: 3,
      max: 24,
      admin: { description: 'Max collections to show (3–24)' },
    },
  ],
}
