import type { CollectionConfig } from 'payload'
import { adminOnly, authenticated } from '@/lib/payload/access'

export const SignupLeads: CollectionConfig = {
  slug: 'signup-leads',
  admin: {
    useAsTitle: 'email',
    group: 'Business',
    defaultColumns: [
      'email',
      'campaignSlug',
      'storeslug',
      'resendStatus',
      'shopifyStatus',
      'submittedAt',
    ],
    description: 'Submissions from store signup campaign pages',
  },
  access: {
    // Written server-side via the Local API only. A public create would let
    // anyone forge leads directly against the REST endpoint.
    create: () => false,
    read: authenticated,
    update: authenticated,
    delete: adminOnly,
  },
  fields: [
    { name: 'campaign', type: 'relationship', relationTo: 'signup-campaigns', index: true },
    {
      name: 'campaignSlug',
      type: 'text',
      index: true,
      admin: { description: 'Denormalized — survives deletion of the campaign' },
    },
    { name: 'storefront', type: 'relationship', relationTo: 'storefronts', index: true },
    { name: 'storeslug', type: 'text', index: true },

    { name: 'firstName', type: 'text' },
    { name: 'lastName', type: 'text' },
    { name: 'email', type: 'email', index: true, required: true },
    { name: 'phone', type: 'text' },
    { name: 'zip', type: 'text' },

    {
      name: 'answers',
      type: 'array',
      admin: {
        description:
          'Campaign questions as they read at submission time. Never rewrite these when the campaign changes.',
      },
      fields: [
        { name: 'name', type: 'text' },
        { name: 'label', type: 'text' },
        { name: 'value', type: 'text' },
      ],
    },

    {
      name: 'utm',
      type: 'group',
      fields: [
        { name: 'source', type: 'text' },
        { name: 'medium', type: 'text' },
        { name: 'campaign', type: 'text' },
        { name: 'term', type: 'text' },
        { name: 'content', type: 'text' },
      ],
    },

    { name: 'sourceUrl', type: 'text' },
    { name: 'userAgent', type: 'text' },
    { name: 'ipAddress', type: 'text' },
    { name: 'submittedAt', type: 'date' },

    {
      type: 'row',
      fields: [
        {
          name: 'resendStatus',
          type: 'select',
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Sent', value: 'sent' },
            { label: 'Failed', value: 'failed' },
            { label: 'Held (live send off)', value: 'held' },
          ],
        },
        { name: 'resendEmailId', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'confirmationStatus',
          type: 'select',
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Sent', value: 'sent' },
            { label: 'Failed', value: 'failed' },
            { label: 'Skipped', value: 'skipped' },
          ],
        },
        { name: 'confirmationEmailId', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'shopifyStatus',
          type: 'select',
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Synced', value: 'synced' },
            { label: 'Failed', value: 'failed' },
            { label: 'Skipped', value: 'skipped' },
          ],
        },
        { name: 'shopifyCustomerId', type: 'text' },
      ],
    },
  ],
}
