import type { CollectionConfig } from 'payload'

export const PianoSeries: CollectionConfig = {
  slug: 'piano-series',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'position', 'isActive'],
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
        description: 'Series name (e.g., Shigeru Kawai, GX Series, CA Series)',
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
        { label: 'Concert Grand', value: 'concert-grand' },
        { label: 'Grand Piano', value: 'grand' },
        { label: 'Upright Piano', value: 'upright' },
        { label: 'Digital Piano', value: 'digital' },
        { label: 'Hybrid Piano', value: 'hybrid' },
        { label: 'Silent Piano', value: 'silent' },
      ],
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Detailed description of the series',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      admin: {
        description: 'Brief description for listings and cards',
      },
    },
    {
      name: 'heritage',
      type: 'richText',
      admin: {
        description: 'Heritage and history of this series',
      },
    },
    {
      name: 'targetAudience',
      type: 'array',
      fields: [
        {
          name: 'audience',
          type: 'select',
          options: [
            { label: 'Concert Professionals', value: 'concert-professionals' },
            { label: 'Serious Musicians', value: 'serious-musicians' },
            { label: 'Students', value: 'students' },
            { label: 'Hobbyists', value: 'hobbyists' },
            { label: 'Institutions', value: 'institutions' },
            { label: 'Recording Studios', value: 'recording-studios' },
          ],
          required: true,
        },
      ],
      admin: {
        description: 'Target audience for this series',
      },
    },
    {
      name: 'priceRange',
      type: 'group',
      fields: [
        {
          name: 'min',
          type: 'number',
          admin: {
            description: 'Starting price for this series',
          },
        },
        {
          name: 'max',
          type: 'number',
          admin: {
            description: 'Maximum price for this series',
          },
        },
        {
          name: 'displayRange',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Display price range on website',
          },
        },
      ],
    },
    {
      name: 'keyFeatures',
      type: 'array',
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
      admin: {
        description: 'Key features that define this series',
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
          name: 'heroImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Large hero image for series pages',
          },
        },
        {
          name: 'gallery',
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
        },
        {
          name: 'brochure',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Series brochure PDF',
          },
        },
      ],
    },
    {
      name: 'position',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Order for display (lower numbers appear first)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show this series on the website',
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