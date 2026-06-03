import type { CollectionConfig } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  UploadFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { slugField } from 'payload'

import { authenticated, adminOnly } from '@/lib/payload/access'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  admin: {
    group: 'HR',
    useAsTitle: 'title',
    defaultColumns: ['title', 'department', 'status', 'type', 'postedAt'],
    description: 'Job listings for the careers page',
  },
  access: {
    create: authenticated,
    read: () => true,
    update: authenticated,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'description',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          UploadFeature({ collections: { media: { fields: [] } } }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'department',
      type: 'text',
      admin: {
        description: 'e.g. "Sales", "Technology", "Marketing"',
      },
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        description: 'e.g. "Los Angeles, CA" or "Remote"',
      },
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Full-Time', value: 'full-time' },
        { label: 'Part-Time', value: 'part-time' },
        { label: 'Contract', value: 'contract' },
        { label: 'Internship', value: 'internship' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'open',
      index: true,
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'postedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create' && !data.postedAt) {
          data.postedAt = new Date().toISOString()
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc }) => {
        const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        fetch(`${baseURL}/api/revalidate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secret: process.env.REVALIDATION_SECRET, tag: 'careers' }),
        }).catch((err) => console.error('Revalidation error:', err))
        return doc
      },
    ],
  },
}
