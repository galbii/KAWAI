import type { CollectionConfig } from 'payload'
import { authenticated, adminOnly } from '@/lib/payload/access'

export const FaqCategories: CollectionConfig = {
  slug: 'faq-categories',
  labels: {
    singular: 'FAQ Category',
    plural: 'FAQ Categories',
  },
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'displayOrder', 'updatedAt'],
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
      name: 'color',
      type: 'text',
      admin: {
        description: 'Optional hex color for frontend badge styling (e.g. #E11922)',
        placeholder: '#E11922',
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
