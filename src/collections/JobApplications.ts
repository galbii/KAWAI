import type { CollectionConfig } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated, adminOnly } from '@/lib/payload/access'

export const JobApplications: CollectionConfig = {
  slug: 'job-applications',
  admin: {
    group: 'HR',
    useAsTitle: 'applicantName',
    defaultColumns: ['applicantName', 'job', 'email', 'status', 'submittedAt'],
    description: 'Job applications submitted through the careers page',
  },
  access: {
    create: () => true,
    read: authenticated,
    update: authenticated,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'job',
      type: 'relationship',
      relationTo: 'jobs',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'applicantName',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'linkedin',
      type: 'text',
      admin: {
        description: 'LinkedIn profile URL',
      },
    },
    {
      name: 'portfolio',
      type: 'text',
      admin: {
        description: 'Portfolio or website URL',
      },
    },
    {
      name: 'coverLetter',
      type: 'richText',
      editor: lexicalEditor({
        features: () => [
          FixedToolbarFeature(),
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'documents',
      type: 'array',
      label: 'Uploaded Documents',
      maxRows: 5,
      fields: [
        {
          name: 'filename',
          type: 'text',
          admin: {
            readOnly: true,
            description: 'Original filename',
          },
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            readOnly: true,
            description: 'R2 storage URL',
          },
        },
        {
          name: 'mimeType',
          type: 'text',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Reviewing', value: 'reviewing' },
        { label: 'Interviewing', value: 'interviewing' },
        { label: 'Offer', value: 'offer' },
        { label: 'Rejected', value: 'rejected' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'submittedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create' && !data.submittedAt) {
          data.submittedAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
}
