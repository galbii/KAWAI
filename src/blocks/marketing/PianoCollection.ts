import type { Block } from 'payload'

export const PianoCollection: Block = {
  slug: 'marketing-piano-collection',
  labels: {
    singular: '🎹 Piano Collection',
    plural: 'Piano Collection Sections',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Piano+Collection',
  imageAltText: 'Featured piano models with video showcase',
  interfaceName: 'MarketingPianoCollectionBlock',
  fields: [
    {
      name: 'collectionSectionHeader',
      type: 'text',
      admin: {
        description: 'Section header text (leave empty to use Homepage tab data)',
      },
    },
    {
      name: 'collectionTitle',
      type: 'text',
      admin: {
        description: 'Main title for the collection (use \\n for line breaks, leave empty to use Homepage tab data)',
      },
    },
    {
      name: 'collectionDescription',
      type: 'textarea',
      admin: {
        description: 'Collection description text (leave empty to use Homepage tab data)',
      },
    },
    {
      name: 'collectionCta',
      type: 'group',
      admin: {
        description: 'Call-to-action button (leave empty to use Homepage tab data)',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
        },
        { name: 'link', type: 'text' },
      ],
    },
    {
      name: 'featuredVideo',
      type: 'group',
      admin: {
        description: 'YouTube video showcase (extract ID from URL: youtube.com/watch?v=VIDEO_ID, leave empty to use Homepage tab data)',
      },
      fields: [
        {
          name: 'youtubeId',
          type: 'text',
          admin: { description: 'YouTube video ID (e.g., dQw4w9WgXcQ)' },
        },
        { name: 'width', type: 'number' },
        { name: 'height', type: 'number' },
      ],
    },
  ],
}
