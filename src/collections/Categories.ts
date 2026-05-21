import type { CollectionConfig } from 'payload'
import { imageField } from '@/lib/payload/fields/media'
import { slugBeforeDuplicate } from '@/lib/payload/fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Category',
    plural: 'Categories',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'slug', 'description'],
    description: 'Blog post categories for organization and filtering',
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Category display name',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      hooks: { beforeDuplicate: [slugBeforeDuplicate] },
      admin: {
        description: 'URL-friendly version of the category name',
        readOnly: false,
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of this category',
      },
    },
    imageField('icon', {
      admin: {
        description: 'Optional icon/image for this category',
      },
    }),
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        console.log(`📂 Categories beforeChange: operation=${operation}, title="${data.title}"`)

        // Auto-generate slug from title if not provided or empty
        if (data.title && (!data.slug || data.slug.trim() === '')) {
          const generatedSlug = data.title
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '')

          data.slug = generatedSlug || 'category'
          console.log(`🔗 Generated slug from title "${data.title}" -> "${data.slug}"`)
        }

        console.log(`📂 Categories beforeChange END: returning data with slug="${data.slug}"`)
        return data
      },
    ],
  },
}
