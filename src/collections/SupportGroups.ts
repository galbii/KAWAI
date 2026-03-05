import type { CollectionConfig } from 'payload'
import { authenticated, adminOnly } from '@/lib/payload/access'

export const SupportGroups: CollectionConfig = {
  slug: 'support-groups',
  labels: { singular: 'Support Group', plural: 'Support Groups' },
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'isActive', 'displayOrder', 'updatedAt'],
    description: 'Defines support hubs shown on /technical-support-division/[slug]. Add groups to create new hub pages.',
  },
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Display name shown on hub page (e.g. "Owner Hub")' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL slug — becomes /technical-support-division/[slug]. Use kebab-case (e.g. owner-hub).',
        position: 'sidebar',
      },
    },
    {
      name: 'heading',
      type: 'text',
      admin: { description: 'Large heading shown on hub page (e.g. "I Own a Kawai Piano")' },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: { description: 'Short description shown below the heading on hub page' },
    },
    {
      name: 'featuredFaqs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
      admin: {
        description: 'Pin up to 5 FAQs to show as "Popular Questions" at the top of this hub page. If empty, shows the 5 most recent FAQs.',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Active groups appear on /technical-support-division. Inactive groups are hidden.',
        position: 'sidebar',
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Sort order on the TSD landing page (lower = first)',
        position: 'sidebar',
      },
    },
    {
      type: 'group',
      name: 'seo',
      label: 'SEO',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          admin: { description: 'Custom meta title for this hub page' },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          maxLength: 160,
          admin: { description: 'Meta description (max 160 chars)' },
        },
      ],
    },
  ],

  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (data.name && (!data.slug || data.slug.trim() === '')) {
          data.slug = data.name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '') || 'group'
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, context }) => {
        if (context.skipRevalidation) return doc
        const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        const secret = process.env.REVALIDATION_SECRET
        fetch(`${baseURL}/api/revalidate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secret, tag: 'support-groups' }),
        }).catch((err) => console.error('[SupportGroups Hook] Revalidation error:', err))
        if (doc.slug) {
          fetch(`${baseURL}/api/revalidate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ secret, tag: `tsd-hub-${doc.slug}` }),
          }).catch((err) => console.error('[SupportGroups Hook] Hub revalidation error:', err))
          fetch(`${baseURL}/api/revalidate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ secret, tag: 'technical-support-division' }),
          }).catch((err) => console.error('[SupportGroups Hook] TSD revalidation error:', err))
        }
        return doc
      },
    ],
  },
}
