import type { CollectionConfig } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
  UploadFeature,
} from '@payloadcms/richtext-lexical'
import { authenticated, adminOnly } from '@/lib/payload/access'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: {
    singular: 'FAQ',
    plural: 'FAQs',
  },
  admin: {
    group: 'Content',
    useAsTitle: 'question',
    defaultColumns: ['question', 'supportHub', 'categories', 'status', 'updatedAt'],
    description: 'Frequently asked questions with rich text answers and product linking',
  },
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: adminOnly,
  },
  fields: [
    // Top-level fields (visible across all tabs)
    {
      name: 'question',
      type: 'text',
      required: true,
      admin: {
        description: 'The question as it will appear publicly (also used to generate slug)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        description: 'URL-friendly identifier (auto-generated from question)',
        position: 'sidebar',
      },
    },

    {
      name: 'supportHub',
      type: 'select',
      admin: {
        description: 'Which TSD hub this FAQ belongs to. Leave blank for general /faq index only.',
        position: 'sidebar',
      },
      options: [
        { label: 'Owner Hub — I own a Kawai', value: 'owner-hub' },
        { label: "Buyer Hub — I'm choosing a Kawai", value: 'buyer-hub' },
        { label: 'Technician Resources', value: 'technician-resources' },
      ],
    },

    // Tabs
    {
      type: 'tabs',
      tabs: [
        // Answer Tab
        {
          label: 'Answer',
          description: 'The FAQ answer content',
          fields: [
            {
              name: 'excerpt',
              type: 'textarea',
              maxLength: 200,
              admin: {
                description: 'Short summary for FAQ index cards and meta description fallback (max 200 characters)',
              },
            },
            {
              name: 'answer',
              type: 'richText',
              required: true,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  UploadFeature({
                    collections: {
                      media: {
                        fields: [
                          {
                            name: 'caption',
                            type: 'text',
                          },
                        ],
                      },
                    },
                  }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                ],
              }),
              admin: {
                description: 'Full answer with rich formatting and optional inline images',
              },
            },
          ],
        },

        // Organization Tab
        {
          label: 'Organization',
          description: 'Categories and related products',
          fields: [
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'faq-categories',
              hasMany: true,
              admin: {
                description: 'FAQ categories for filtering and navigation',
                position: 'sidebar',
              },
            },
            {
              name: 'relatedProducts',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              admin: {
                description: 'Products this FAQ applies to (shown on FAQ detail page)',
                position: 'sidebar',
              },
            },
          ],
        },

        // Publishing Tab
        {
          label: 'Publishing',
          description: 'Publication status and date',
          fields: [
            {
              name: 'status',
              type: 'select',
              required: true,
              defaultValue: 'draft',
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
              ],
              admin: {
                description: 'Publication status — only published FAQs appear on the frontend',
                position: 'sidebar',
              },
            },
            {
              name: 'publishedDate',
              type: 'date',
              admin: {
                description: 'Auto-set on first publish',
                position: 'sidebar',
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
          ],
        },

        // SEO Tab
        {
          label: 'SEO',
          description: 'Search engine optimization',
          fields: [
            {
              name: 'seo',
              type: 'group',
              fields: [
                {
                  name: 'metaTitle',
                  type: 'text',
                  admin: {
                    description: 'Custom meta title (defaults to question)',
                  },
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  maxLength: 160,
                  admin: {
                    description: 'Meta description (max 160 characters, defaults to excerpt)',
                  },
                },
                {
                  name: 'keywords',
                  type: 'text',
                  admin: {
                    description: 'SEO keywords (comma-separated)',
                  },
                },
              ],
              admin: {
                description: 'SEO optimization for FAQ detail pages',
              },
            },
          ],
        },
      ],
    },
  ],

  hooks: {
    beforeChange: [
      async ({ data }) => {
        // Auto-generate slug from question
        if (data.question && (!data.slug || data.slug.trim() === '')) {
          data.slug = data.question
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '') || 'faq'
        }

        // Auto-set publishedDate on first publish
        if (data.status === 'published' && !data.publishedDate) {
          data.publishedDate = new Date().toISOString()
        }

        return data
      },
    ],

    afterChange: [
      async ({ doc, context }) => {
        if (context.skipRevalidation) return doc

        const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        const revalidateUrl = `${baseURL}/api/revalidate`
        const secret = process.env.REVALIDATION_SECRET

        // Revalidate individual FAQ page
        fetch(revalidateUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secret, tag: `faq-${doc.slug}` }),
        }).catch((err) => console.error('[Faqs Hook] Revalidation error (individual):', err))

        // Revalidate FAQ index
        fetch(revalidateUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secret, tag: 'faqs' }),
        }).catch((err) => console.error('[Faqs Hook] Revalidation error (index):', err))

        // Revalidate TSD landing page
        fetch(revalidateUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secret, tag: 'technical-support-division' }),
        }).catch((err) => console.error('[Faqs Hook] Revalidation error (tsd):', err))

        // Revalidate specific hub if set
        if (doc.supportHub) {
          fetch(revalidateUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ secret, tag: `tsd-hub-${doc.supportHub}` }),
          }).catch((err) => console.error('[Faqs Hook] Revalidation error (tsd-hub):', err))
        }

        return doc
      },
    ],
  },
}
