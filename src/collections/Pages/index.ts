import type { CollectionConfig } from 'payload'

import { authenticated } from '@/lib/payload/access'
import { authenticatedOrPublished } from '@/lib/payload/access'
import { hero } from '@/lib/payload/fields/hero'
import { imageField } from '@/lib/payload/fields'
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
          label: 'Getting Started',
          value: 'getting-started',
        },
        {
          label: 'News',
          value: 'news',
        },
        {
          label: 'Events',
          value: 'events',
        },
        {
          label: 'Resources',
          value: 'resources',
        },
        {
          label: 'FAQ',
          value: 'faq',
        },
        {
          label: 'Support',
          value: 'support',
        },
        {
          label: 'Legal',
          value: 'legal',
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
      type: 'array',
      maxRows: 15,
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'e.g., piano-care, warranty, financing',
          },
        },
      ],
      admin: {
        position: 'sidebar',
        description: 'Add custom tags to help users find this page. Enter any text value.',
        initCollapsed: false,
        components: {
          RowLabel: '/components/admin/TagRowLabel#TagRowLabel',
        },
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
                'marketing-find-a-dealer',          // Find a Dealer (CTA link)
                'marketing-dealer-finder',          // Dealer Finder (interactive map)
                'marketing-3d-viewer',              // 3D Model Viewer
                'marketing-instagram-carousel',     // Instagram Carousel
                'marketing-artist-carousel',        // Artist Carousel
                'marketing-featured-models',        // Featured Models
                'marketing-featured-collections',   // Featured Collections carousel
                'marketing-rebate-table',           // Rebate Table
                'marketing-artist-hero',            // Artist Hero carousel
                'marketing-pianos-browser',         // Pianos browser catalog
                'marketing-artists-grid',           // Artists grid with search
                'marketing-blog-grid',              // Blog grid with featured hero

                // Events blocks - Event-specific content
                'events-university-hero',           // University Hero
                'events-event-overview',            // Event Overview

                // Product blocks
                'product-hero-carousel',            // Product Hero Carousel
                'product-piano-pages',              // Piano Pages Browser (category-scoped)

                // Layout blocks - Structural and special elements
                'layout-brand-intro',               // Brand Intro
                'layout-hero-carousel',             // Hero Carousel
                'layout-video-background',          // Video Background
                'layout-bottom-left-popup',         // Bottom Popup
                'layout-side-navigation',           // Side Navigation
                'layout-calendly-embed',            // Calendly Embed
                'layout-booking-modal',             // Booking Modal
                'marketing-newsletter-popup',       // Newsletter Popup (email capture modal)
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
        {
          label: 'SEO & Meta',
          description: 'Search engine optimization and metadata settings',
          fields: [
            {
              name: 'seo',
              type: 'group',
              admin: { description: 'SEO and metadata configuration' },
              fields: [
                {
                  name: 'metaTitle',
                  type: 'text',
                  admin: { description: 'Page title for search engines (defaults to page title if empty)' },
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  maxLength: 160,
                  admin: { description: 'Page meta description for search engines (max 160 characters)' },
                },
                {
                  name: 'keywords',
                  type: 'text',
                  admin: { description: 'SEO keywords (comma-separated)' },
                },
                {
                  name: 'openGraphTitle',
                  type: 'text',
                  admin: { description: 'Open Graph title for social media sharing (defaults to metaTitle)' },
                },
                {
                  name: 'openGraphDescription',
                  type: 'textarea',
                  admin: { description: 'Open Graph description for social media sharing' },
                },
                imageField('openGraphImage', {
                  admin: { description: 'Open Graph image for social media sharing (1200x630px recommended)' },
                }),
              ],
            },
          ],
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
