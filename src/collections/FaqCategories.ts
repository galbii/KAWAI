import type { CollectionConfig } from 'payload'
import { authenticated, adminOnly } from '@/lib/payload/access'
import { slugBeforeDuplicate } from '@/lib/payload/fields/slug'

export const FaqCategories: CollectionConfig = {
  slug: 'faq-categories',
  labels: {
    singular: 'FAQ Category',
    plural: 'FAQ Categories',
  },
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'group', 'supportHub', 'slug', 'displayOrder', 'updatedAt'],
    description: 'Taxonomy for organizing FAQs into categories (e.g. "Purchasing", "Technical", "Warranty")',
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
      admin: {
        description: 'Category display name (e.g. "Purchasing & Financing")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      hooks: { beforeDuplicate: [slugBeforeDuplicate] },
      admin: {
        description: 'URL-friendly identifier (auto-generated from name)',
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional short description shown on FAQ filter pages',
      },
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description: 'Icon identifier for this category (e.g. "wifi", "wrench", "book", "shield"). Used for visual navigation on hub pages.',
        placeholder: 'wrench',
      },
    },
    {
      name: 'color',
      type: 'text',
      admin: {
        description: 'Optional hex color for frontend badge styling (e.g. #E11922)',
        placeholder: '#E11922',
      },
    },
    {
      name: 'supportHub',
      type: 'select',
      admin: {
        description: 'Which TSD hub this category belongs to. Used to filter categories on hub pages.',
        position: 'sidebar',
      },
      options: [
        { label: 'Owner Hub — I own a Kawai', value: 'owner-hub' },
        { label: "Buyer Hub — I'm choosing a Kawai", value: 'buyer-hub' },
        { label: 'Technician Resources', value: 'technician-resources' },
      ],
    },
    {
      name: 'group',
      type: 'relationship',
      relationTo: 'support-groups',
      admin: {
        description: 'Link this category to a Support Group. This is the new extensible alternative to the Support Hub select above.',
        position: 'sidebar',
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      admin: {
        description: 'Sort order for category display (lower numbers appear first)',
        position: 'sidebar',
      },
    },
  ],

  hooks: {
    beforeChange: [
      async ({ data }) => {
        // Auto-generate slug from name if not set
        if (data.name && (!data.slug || data.slug.trim() === '')) {
          data.slug = data.name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '') || 'category'
        }
        return data
      },
    ],
  },
}
