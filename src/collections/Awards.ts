import type { CollectionConfig } from 'payload'

export const Awards: CollectionConfig = {
  slug: 'awards',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'organization', 'year', 'category'],
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
        description: 'Name of the award',
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
      name: 'organization',
      type: 'text',
      required: true,
      admin: {
        description: 'Organization that gave the award',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Product Design', value: 'product-design' },
        { label: 'Innovation', value: 'innovation' },
        { label: 'Technology', value: 'technology' },
        { label: 'Sound Quality', value: 'sound-quality' },
        { label: 'Manufacturing Excellence', value: 'manufacturing' },
        { label: 'Environmental', value: 'environmental' },
        { label: 'Industry Recognition', value: 'industry' },
        { label: 'Consumer Choice', value: 'consumer-choice' },
      ],
      required: true,
    },
    {
      name: 'year',
      type: 'number',
      required: true,
      admin: {
        description: 'Year the award was received',
      },
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Description of the award and why it was received',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      admin: {
        description: 'Brief description for cards and listings',
      },
    },
    {
      name: 'recipient',
      type: 'group',
      fields: [
        {
          name: 'recipientType',
          type: 'select',
          options: [
            { label: 'Company', value: 'company' },
            { label: 'Product', value: 'product' },
            { label: 'Technology', value: 'technology' },
            { label: 'Individual', value: 'individual' },
          ],
          required: true,
        },
        {
          name: 'piano',
          type: 'relationship',
          relationTo: 'pianos',
          admin: {
            condition: (data) => data?.recipient?.recipientType === 'product',
            description: 'Piano model that received the award',
          },
        },
        {
          name: 'technology',
          type: 'relationship',
          relationTo: 'technologies',
          admin: {
            condition: (data) => data?.recipient?.recipientType === 'technology',
            description: 'Technology that received the award',
          },
        },
        {
          name: 'individual',
          type: 'relationship',
          relationTo: 'artists',
          admin: {
            condition: (data) => data?.recipient?.recipientType === 'individual',
            description: 'Individual who received the award',
          },
        },
      ],
    },
    {
      name: 'significance',
      type: 'richText',
      admin: {
        description: 'Why this award is significant for Kawai',
      },
    },
    {
      name: 'criteria',
      type: 'array',
      fields: [
        {
          name: 'criterion',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
      admin: {
        description: 'Criteria the award was based on',
      },
    },
    {
      name: 'media',
      type: 'group',
      fields: [
        {
          name: 'awardImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Image of the award or certificate',
          },
        },
        {
          name: 'ceremonyImages',
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
            description: 'Photos from award ceremony',
          },
        },
        {
          name: 'pressRelease',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Press release PDF',
          },
        },
      ],
    },
    {
      name: 'competitionDetails',
      type: 'group',
      fields: [
        {
          name: 'numberOfEntries',
          type: 'number',
          admin: {
            description: 'Number of entries in competition',
          },
        },
        {
          name: 'judges',
          type: 'array',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'title',
              type: 'text',
            },
            {
              name: 'organization',
              type: 'text',
            },
          ],
        },
        {
          name: 'judgingCriteria',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'marketingUse',
      type: 'group',
      fields: [
        {
          name: 'canUseInMarketing',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Permission to use in marketing materials',
          },
        },
        {
          name: 'logoPermission',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Permission to use award organization logo',
          },
        },
        {
          name: 'marketingNotes',
          type: 'textarea',
          admin: {
            description: 'Notes on how this award can be used in marketing',
          },
        },
      ],
    },
    {
      name: 'externalLinks',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
      admin: {
        description: 'Links to external coverage or award organization',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show this award on the website',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Feature prominently on awards page',
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