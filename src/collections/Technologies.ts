import type { CollectionConfig } from 'payload'

export const Technologies: CollectionConfig = {
  slug: 'technologies',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'isActive'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Technology name (e.g., Millennium III Action, Harmonic Imaging XL)',
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
      name: 'category',
      type: 'select',
      options: [
        { label: 'Piano Action', value: 'action' },
        { label: 'Sound Technology', value: 'sound' },
        { label: 'Key Technology', value: 'keys' },
        { label: 'Pedal System', value: 'pedals' },
        { label: 'Cabinet Construction', value: 'cabinet' },
        { label: 'Digital Technology', value: 'digital' },
        { label: 'Connectivity', value: 'connectivity' },
        { label: 'Silent System', value: 'silent' },
      ],
      required: true,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Brief description for cards and listings',
      },
    },
    {
      name: 'fullDescription',
      type: 'richText',
      admin: {
        description: 'Detailed technical description',
      },
    },
    {
      name: 'benefits',
      type: 'array',
      fields: [
        {
          name: 'benefit',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
      admin: {
        description: 'Key benefits and advantages',
      },
    },
    {
      name: 'technicalSpecs',
      type: 'array',
      fields: [
        {
          name: 'specification',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
        {
          name: 'unit',
          type: 'text',
          admin: {
            description: 'Measurement unit (if applicable)',
          },
        },
      ],
      admin: {
        description: 'Technical specifications',
      },
    },
    {
      name: 'developmentHistory',
      type: 'richText',
      admin: {
        description: 'History and development of this technology',
      },
    },
    {
      name: 'patents',
      type: 'array',
      fields: [
        {
          name: 'patentNumber',
          type: 'text',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'year',
          type: 'number',
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
      admin: {
        description: 'Related patents',
      },
    },
    {
      name: 'media',
      type: 'group',
      fields: [
        {
          name: 'featuredImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'diagrams',
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
          ],
          admin: {
            description: 'Technical diagrams and illustrations',
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
          admin: {
            description: 'Demonstration and explanation videos',
          },
        },
      ],
    },
    {
      name: 'pianoSeries',
      type: 'array',
      fields: [
        {
          name: 'series',
          type: 'relationship',
          relationTo: 'piano-series',
          required: true,
        },
      ],
      admin: {
        description: 'Piano series that feature this technology',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show this technology on the website',
      },
    },
    {
      name: 'isInnovation',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark as a key Kawai innovation',
      },
    },
    {
      name: 'yearIntroduced',
      type: 'number',
      admin: {
        description: 'Year this technology was introduced',
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
            description: 'SEO title (if different from name)',
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