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
      defaultValue: 'Featured Models',
      admin: { description: 'Section header text' },
    },
    {
      name: 'collectionTitle',
      type: 'text',
      defaultValue: 'Kawai K-500 &\nGX2 Limited Edition',
      admin: {
        description: 'Main title for the collection (use \\n for line breaks)',
      },
    },
    {
      name: 'collectionDescription',
      type: 'textarea',
      defaultValue:
        'Discover the perfect blend of traditional craftsmanship and modern innovation. Our featured collection showcases the finest Kawai pianos, meticulously selected for their exceptional tone, touch, and beauty.',
      admin: { description: 'Collection description text' },
    },
    {
      name: 'collectionCta',
      type: 'group',
      admin: { description: 'Call-to-action button' },
      fields: [
        {
          name: 'text',
          type: 'text',
          defaultValue: 'Explore Collection',
        },
        { name: 'link', type: 'text', defaultValue: '/pianos' },
      ],
    },
    {
      name: 'featuredVideo',
      type: 'group',
      admin: {
        description:
          'YouTube video showcase (extract ID from URL: youtube.com/watch?v=VIDEO_ID)',
      },
      fields: [
        {
          name: 'youtubeId',
          type: 'text',
          admin: { description: 'YouTube video ID (e.g., dQw4w9WgXcQ)' },
        },
        { name: 'width', type: 'number', defaultValue: 560 },
        { name: 'height', type: 'number', defaultValue: 315 },
      ],
    },
  ],
}
