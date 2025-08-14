import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
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
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        {
          label: 'Piano Moving',
          value: 'piano-moving',
        },
        {
          label: 'Tuning & Repair',
          value: 'tuning-repair',
        },
        {
          label: 'Piano Rental',
          value: 'piano-rental',
        },
        {
          label: 'Trade-In',
          value: 'trade-in',
        },
        {
          label: 'Warranty',
          value: 'warranty',
        },
      ],
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
    },
    {
      name: 'pricing',
      type: 'group',
      fields: [
        {
          name: 'startingPrice',
          type: 'number',
        },
        {
          name: 'pricingNote',
          type: 'text',
          admin: {
            description: 'e.g., "Starting at" or "Contact for quote"',
          },
        },
      ],
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}