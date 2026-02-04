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
                // Marketing blocks - Hero and showcase elements
                'marketing-i2l',                    // Instrumental to Life
                'marketing-technical-showcase',     // Technical Showcase
                'marketing-grand-hero',             // Grand Hero
                'marketing-find-a-dealer',          // Find a Dealer
                'marketing-3d-viewer',              // 3D Model Viewer

                // Layout blocks - Structural and special elements
                'layout-brand-intro',               // Brand Intro
                'layout-hero-carousel',             // Hero Carousel
                'layout-video-background',          // Video Background
                'layout-bottom-left-popup',         // Bottom Popup
              ] as any,
              blocks: [], // Required to be empty when using blockReferences
              required: true,
              admin: {
                initCollapsed: true,
                description:
                  'Build your page using specialized layout blocks for dynamic pages.',
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
