import type { CollectionConfig } from 'payload'

import { authenticated } from '@/lib/payload/access'
import { authenticatedOrPublished } from '@/lib/payload/access'
import { hero } from '@/lib/payload/fields/hero'
import { slugField } from 'payload'
import { populatePublishedAt } from './hooks/populatePublishedAt'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    group: 'Pages',
    defaultColumns: ['title', 'category', 'tags', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        const slug = data.slug || 'preview'
        // Pages render at root level (e.g., /about, /contact)
        return `${baseURL}/${slug}`
      },
    },
    preview: (data) => {
      const params = {
        slug: (data?.slug as string) || '',
        collection: 'pages',
        path: `/${(data?.slug as string) || 'preview'}`,
        previewSecret: process.env.PREVIEW_SECRET || '',
      }
      const encodedParams = new URLSearchParams(params)
      return `/api/preview?${encodedParams.toString()}`
    },
    useAsTitle: 'title',
    description: 'Create static pages with optional FAQ categorization and tagging',
  },
  // Enable query presets to allow users to save custom filters, sorts, and column views
  enableQueryPresets: true,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        {
          label: 'General',
          value: 'general',
        },
        {
          label: 'FAQ',
          value: 'faq',
        },
        {
          label: 'Legal',
          value: 'legal',
        },
        {
          label: 'Support',
          value: 'support',
        },
      ],
      defaultValue: 'general',
      admin: {
        position: 'sidebar',
        description: 'Categorize this page for better organization',
      },
    },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      options: [
        {
          label: 'Getting Started',
          value: 'getting-started',
        },
        {
          label: 'Piano Care',
          value: 'piano-care',
        },
        {
          label: 'Warranty',
          value: 'warranty',
        },
        {
          label: 'Financing',
          value: 'financing',
        },
        {
          label: 'Delivery',
          value: 'delivery',
        },
        {
          label: 'Tuning',
          value: 'tuning',
        },
        {
          label: 'Maintenance',
          value: 'maintenance',
        },
        {
          label: 'Digital Pianos',
          value: 'digital-pianos',
        },
        {
          label: 'Acoustic Pianos',
          value: 'acoustic-pianos',
        },
        {
          label: 'Privacy',
          value: 'privacy',
        },
        {
          label: 'Terms',
          value: 'terms',
        },
      ],
      admin: {
        position: 'sidebar',
        description: 'Add tags to help users find this page',
        isClearable: true,
        isSortable: true,
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blockReferences: [
                // Layout blocks - Special blocks (should be first on page)
                'layout-brand-intro',

                // Content blocks - Editorial content for articles and pages
                'content-text',
                'content-image',
                'content-video',
                'content-code',
                'content-banner',

                // Layout blocks - Structural elements
                'layout-columns',
                'layout-spacer',
                'layout-divider',
                'layout-hero-carousel',
                'layout-video-background',
                'layout-bottom-left-popup',

                // Marketing blocks - Conversion-focused elements
                'marketing-hero',
                'marketing-grand-hero',
                'marketing-cta',
                'marketing-testimonials',
                'marketing-i2l',
                'marketing-technical-showcase',
                'marketing-find-a-dealer',

                // Product blocks - Product showcases and details
                'product-showcase',
                'product-hero',
                'product-gallery',
                'product-features',
                'product-specs',

                // Legacy blocks - Kept for backward compatibility
                'cta',
                'content',
                'mediaBlock',
                'archive',
              ] as any,
              blocks: [], // Required to be empty when using blockReferences
              required: true,
              admin: {
                initCollapsed: true,
                description:
                  'Build your page using content blocks. Modern blocks (content-*, layout-*, marketing-*, product-*) are recommended for new pages. Legacy blocks are available for backward compatibility.',
              },
            },
          ],
          label: 'Content',
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
