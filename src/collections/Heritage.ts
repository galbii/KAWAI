import type { CollectionConfig } from 'payload'

export const Heritage: CollectionConfig = {
  slug: 'heritage',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'category', 'isActive'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Title of the heritage event or milestone',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version for routing',
      },
    },
    {
      name: 'year',
      type: 'number',
      required: true,
      admin: {
        description: 'Year of the event or milestone',
      },
    },
    {
      name: 'month',
      type: 'number',
      admin: {
        description: 'Month (1-12) if specific date is known',
      },
    },
    {
      name: 'day',
      type: 'number',
      admin: {
        description: 'Day of month if specific date is known',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Company Foundation', value: 'foundation' },
        { label: 'Product Innovation', value: 'innovation' },
        { label: 'Technology Breakthrough', value: 'technology' },
        { label: 'Factory Opening', value: 'factory' },
        { label: 'Partnership', value: 'partnership' },
        { label: 'Award Recognition', value: 'award' },
        { label: 'Milestone Achievement', value: 'milestone' },
        { label: 'Leadership Change', value: 'leadership' },
        { label: 'Cultural Impact', value: 'cultural' },
        { label: 'Market Expansion', value: 'expansion' },
      ],
      required: true,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Brief description for timeline displays',
      },
    },
    {
      name: 'fullDescription',
      type: 'richText',
      admin: {
        description: 'Detailed description of the event',
      },
    },
    {
      name: 'significance',
      type: 'richText',
      admin: {
        description: 'Why this event was significant in Kawai history',
      },
    },
    {
      name: 'keyFigures',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'text',
          required: true,
        },
        {
          name: 'contribution',
          type: 'textarea',
        },
      ],
      admin: {
        description: 'Key people involved in this event',
      },
    },
    {
      name: 'relatedProducts',
      type: 'array',
      fields: [
        {
          name: 'piano',
          type: 'relationship',
          relationTo: 'pianos',
        },
        {
          name: 'technology',
          type: 'relationship',
          relationTo: 'technologies',
        },
        {
          name: 'series',
          type: 'relationship',
          relationTo: 'piano-series',
        },
      ],
      admin: {
        description: 'Products or technologies related to this event',
      },
    },
    {
      name: 'location',
      type: 'group',
      fields: [
        {
          name: 'city',
          type: 'text',
        },
        {
          name: 'country',
          type: 'text',
        },
        {
          name: 'facility',
          type: 'text',
          admin: {
            description: 'Specific facility or venue',
          },
        },
        {
          name: 'coordinates',
          type: 'group',
          fields: [
            {
              name: 'latitude',
              type: 'number',
            },
            {
              name: 'longitude',
              type: 'number',
            },
          ],
        },
      ],
    },
    {
      name: 'media',
      type: 'group',
      fields: [
        {
          name: 'featuredImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Main image for this heritage item',
          },
        },
        {
          name: 'historicalImages',
          type: 'array',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'caption',
              type: 'text',
            },
            {
              name: 'year',
              type: 'number',
            },
            {
              name: 'photographer',
              type: 'text',
            },
          ],
          admin: {
            description: 'Historical photographs',
          },
        },
        {
          name: 'documents',
          type: 'array',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'file',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
            },
          ],
          admin: {
            description: 'Historical documents, patents, articles',
          },
        },
        {
          name: 'videos',
          type: 'array',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'videoFile',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'youtubeUrl',
              type: 'text',
            },
            {
              name: 'description',
              type: 'textarea',
            },
          ],
        },
      ],
    },
    {
      name: 'timeline',
      type: 'group',
      fields: [
        {
          name: 'isKeyMilestone',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Mark as a key milestone in company history',
          },
        },
        {
          name: 'timelinePosition',
          type: 'number',
          admin: {
            description: 'Position on timeline (for ordering events in same year)',
          },
        },
        {
          name: 'era',
          type: 'select',
          options: [
            { label: 'Founding Era (1927-1950)', value: 'founding' },
            { label: 'Growth Era (1951-1980)', value: 'growth' },
            { label: 'Innovation Era (1981-2000)', value: 'innovation' },
            { label: 'Digital Era (2001-2010)', value: 'digital' },
            { label: 'Modern Era (2011-Present)', value: 'modern' },
          ],
          admin: {
            description: 'Historical era this event belongs to',
          },
        },
      ],
    },
    {
      name: 'context',
      type: 'group',
      fields: [
        {
          name: 'industryContext',
          type: 'richText',
          admin: {
            description: 'What was happening in the piano industry at this time',
          },
        },
        {
          name: 'worldEvents',
          type: 'richText',
          admin: {
            description: 'Relevant world events or cultural context',
          },
        },
        {
          name: 'technologicalContext',
          type: 'richText',
          admin: {
            description: 'Technological developments of the time',
          },
        },
      ],
    },
    {
      name: 'legacy',
      type: 'richText',
      admin: {
        description: 'How this event influences Kawai today',
      },
    },
    {
      name: 'quotes',
      type: 'array',
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          required: true,
        },
        {
          name: 'author',
          type: 'text',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'source',
          type: 'text',
        },
      ],
      admin: {
        description: 'Historical quotes about this event',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show this heritage item on the website',
      },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'SEO title (if different from title)',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Meta description for search engines',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          admin: {
            description: 'SEO keywords (comma separated)',
          },
        },
      ],
    },
  ],
}