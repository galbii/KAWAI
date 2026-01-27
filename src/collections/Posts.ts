import type { CollectionConfig } from 'payload'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { slugField } from 'payload'

// Import blocks for rich text content
import { Banner } from '@/blocks/Banner/config'
import { Code } from '@/blocks/Code/config'

// Import access control utilities
import { authenticated, authenticatedOrPublished, adminOnly } from '@/lib/payload/access'

// Import field utilities
import { imageField } from '@/lib/payload/fields'

// Import hooks
import { populateAuthors } from './Posts/hooks/populateAuthors'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Post',
    plural: 'Posts',
  },
  admin: {
    group: 'Content',
    // MIGRATION: Show both old and new fields during transition period
    defaultColumns: ['title', 'author', 'authors', 'status', 'publishedDate', 'updatedAt'],
    useAsTitle: 'title',
    description: 'Blog posts with rich content, featured images, and flexible page building',
    livePreview: {
      url: ({ data }) => {
        const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        // If no slug yet, use a placeholder
        const slug = data.slug || 'preview'
        return `${baseURL}/blog/${slug}`
      },
    },
    preview: ({ slug, collection }) => {
      const params: Record<string, string> = {
        slug: (slug as string) || '',
        collection: (collection as string) || 'posts',
        path: `/blog/${(slug as string) || 'preview'}`,
        previewSecret: process.env.PREVIEW_SECRET || '',
      }
      const encodedParams = new URLSearchParams(params)
      return `/api/preview?${encodedParams.toString()}`
    },
  },
  access: {
    create: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
    delete: adminOnly,
  },
  fields: [
    // Title field (outside tabs for visibility)
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Post title/headline',
      },
    },
    // Use Payload's slugField() helper instead of manual slug generation
    slugField(),
    {
      type: 'tabs',
      tabs: [
        // Content Tab
        {
          label: 'Content',
          description: 'Post content, title, and rich text editor',
          fields: [
            {
              name: 'excerpt',
              type: 'textarea',
              maxLength: 300,
              admin: {
                description: 'Short excerpt for post listings and meta description (max 300 characters)',
              },
            },
            imageField('featuredImage', {
              admin: {
                description: 'Featured image for post header and social sharing',
              },
            }),
            {
              name: 'content',
              type: 'richText',
              required: true,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  // Add Banner and Code blocks to rich text content
                  BlocksFeature({ blocks: [Banner, Code] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                ],
              }),
              admin: {
                description: 'Main post content with rich formatting, embedded blocks (Banner, Code), and media',
              },
            },
            {
              name: 'contentBlocks',
              type: 'blocks',
              blockReferences: ['image', 'text', 'video', 'spacer', 'divider', 'columns'],
              blocks: [], // Use blockReferences for globally defined blocks
              admin: {
                description: 'Additional content blocks for complex layouts (separate from rich text content)',
              },
            },
          ],
        },

        // Settings Tab
        {
          label: 'Settings',
          description: 'Author, categories, tags, and publishing settings',
          fields: [
            // === NEW FIELD: Multiple Authors ===
            {
              name: 'authors',
              type: 'relationship',
              relationTo: 'users',
              hasMany: true,
              admin: {
                description: 'Post authors (NEW: supports multiple authors)',
                position: 'sidebar',
              },
            },
            // === NEW FIELD: Privacy-conscious author data (hidden, populated by hook) ===
            {
              name: 'populatedAuthors',
              type: 'array',
              access: {
                update: () => false,
              },
              admin: {
                disabled: true,
                readOnly: true,
                hidden: true,
                description: 'Auto-populated author data for privacy (hidden field)',
              },
              fields: [
                { name: 'id', type: 'text' },
                { name: 'name', type: 'text' },
              ],
            },
            // === OLD FIELD: Single Author (DEPRECATED - kept for backward compatibility) ===
            {
              name: 'author',
              type: 'relationship',
              relationTo: 'users',
              admin: {
                description: '⚠️ DEPRECATED: Use "authors" field instead. Will be removed after migration.',
                position: 'sidebar',
              },
            },
            // === NEW FIELD: Categories relationship (to Categories collection) ===
            {
              name: 'categoriesNew',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              admin: {
                description: 'Post categories (NEW: relationship to Categories collection)',
                position: 'sidebar',
              },
            },
            // === OLD FIELD: Categories select (DEPRECATED - kept for backward compatibility) ===
            {
              name: 'categories',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Piano Education', value: 'education' },
                { label: 'Product News', value: 'product-news' },
                { label: 'Artist Spotlights', value: 'artists' },
                { label: 'Maintenance & Care', value: 'maintenance' },
                { label: 'Buying Guides', value: 'buying-guides' },
                { label: 'Events', value: 'events' },
                { label: 'Company News', value: 'company-news' },
                { label: 'Technology', value: 'technology' },
              ],
              admin: {
                description: '⚠️ DEPRECATED: Use "categoriesNew" field instead. Will be removed after migration.',
              },
            },
            // === NEW FIELD: Related Posts ===
            {
              name: 'relatedPosts',
              type: 'relationship',
              relationTo: 'posts',
              hasMany: true,
              filterOptions: ({ id }) => ({
                id: {
                  not_in: [id],
                },
              }),
              admin: {
                description: 'Related posts (prevents self-reference)',
                position: 'sidebar',
              },
            },
            {
              name: 'tags',
              type: 'text',
              admin: {
                description: 'Comma-separated tags for SEO and filtering',
                placeholder: 'digital piano, grand piano, Kawai CA99',
              },
            },
            {
              name: 'status',
              type: 'select',
              required: true,
              defaultValue: 'draft',
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
                { label: 'Scheduled', value: 'scheduled' },
                { label: 'Archived', value: 'archived' },
              ],
              admin: {
                description: 'Post publication status',
                position: 'sidebar',
              },
            },
            {
              name: 'publishedDate',
              type: 'date',
              admin: {
                description: 'Published date (auto-set on first publish)',
                position: 'sidebar',
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Feature this post on homepage and blog landing',
                position: 'sidebar',
              },
            },
          ],
        },

        // SEO Tab
        {
          label: 'SEO',
          description: 'Search engine optimization and social sharing',
          fields: [
            {
              name: 'seo',
              type: 'group',
              fields: [
                {
                  name: 'metaTitle',
                  type: 'text',
                  admin: {
                    description: 'Custom meta title (defaults to post title)',
                  },
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  maxLength: 160,
                  admin: {
                    description: 'Meta description for search engines (max 160 characters, defaults to excerpt)',
                  },
                },
                {
                  name: 'keywords',
                  type: 'text',
                  admin: {
                    description: 'SEO keywords (comma-separated)',
                  },
                },
                imageField('ogImage', {
                  admin: {
                    description: 'Open Graph image for social sharing (defaults to featured image)',
                  },
                }),
              ],
              admin: {
                description: 'SEO and social media optimization',
              },
            },
          ],
        },
      ],
    },
  ],

  hooks: {
    beforeChange: [
      /**
       * MIGRATION SYNC HOOK: Syncs data between old and new fields
       * This ensures backward compatibility during the migration period
       * TODO: Remove after migration is complete and data is migrated
       */
      async ({ data, operation, context }) => {
        console.log(`📝 Posts beforeChange: operation=${operation}, title="${data.title}"`)

        // Prevent infinite loops
        if (context.skipSync) {
          console.log(`[Posts Hook] Skipping sync (context flag set)`)
          return data
        }

        // === AUTHOR SYNC: author ↔ authors ===
        // Sync old field → new field (if new field is empty)
        if (data.author && (!data.authors || data.authors.length === 0)) {
          data.authors = [data.author]
          console.log(`🔄 Synced author → authors[0]`)
        }
        // Sync new field → old field (if old field is empty)
        if (data.authors && data.authors.length > 0 && !data.author) {
          data.author = data.authors[0]
          console.log(`🔄 Synced authors[0] → author`)
        }

        // === CATEGORY SYNC: categories ↔ categoriesNew ===
        // Only sync if both fields exist (Categories collection must be created first)
        if (data.categoriesNew && data.categoriesNew.length > 0 && !data.categories) {
          console.log(`🔄 categoriesNew exists but categories is empty (manual mapping needed)`)
        }
        if (data.categories && data.categories.length > 0 && !data.categoriesNew) {
          console.log(`🔄 categories exists but categoriesNew is empty (run migration script to map)`)
        }

        // Set publishedDate on first publish
        if (data.status === 'published' && !data.publishedDate) {
          data.publishedDate = new Date().toISOString()
          console.log(`📅 Set publishedDate: ${data.publishedDate}`)
        }

        console.log(`📝 Posts beforeChange END: returning data`)
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, context }) => {
        // Prevent infinite loops
        if (context.skipRevalidation) {
          console.log(`[Posts Hook] Skipping revalidation (context flag set)`)
          return doc
        }

        console.log(
          `[Posts Hook] afterChange triggered: operation=${operation}, slug="${doc.slug}", status=${doc.status}`,
        )

        // Only revalidate if post is published
        if (doc.status !== 'published') {
          console.log(`[Posts Hook] Post is not published, skipping revalidation`)
          return doc
        }

        try {
          // Construct the revalidation URL
          const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
          const revalidateUrl = `${baseURL}/api/revalidate`

          console.log(`[Posts Hook] Triggering revalidation for slug="${doc.slug}" at ${revalidateUrl}`)

          // Revalidate multiple paths for blog posts
          const pathsToRevalidate = [
            { slug: doc.slug, type: 'post' },      // Individual post page: /blog/{slug}
            { path: '/blog' },                     // Blog index page: /blog
          ]

          // Trigger revalidation for all paths in the background
          // Don't await these - we don't want to block the CMS save operation
          pathsToRevalidate.forEach((revalidateParams) => {
            fetch(revalidateUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                secret: process.env.REVALIDATION_SECRET,
                ...revalidateParams,
              }),
            })
              .then(async (response) => {
                if (response.ok) {
                  const result = await response.json()
                  console.log(`[Posts Hook] Revalidation successful for ${result.path}:`, result)
                } else {
                  const errorText = await response.text()
                  console.error(
                    `[Posts Hook] Revalidation failed for ${revalidateParams.slug || revalidateParams.path}:`,
                    response.status,
                    errorText,
                  )
                }
              })
              .catch((error) => {
                console.error(
                  `[Posts Hook] Revalidation request error for ${revalidateParams.slug || revalidateParams.path}:`,
                  error,
                )
              })
          })

          console.log(`[Posts Hook] Revalidation requests sent for ${pathsToRevalidate.length} paths (background)`)
        } catch (error) {
          // Log the error but don't throw - we don't want revalidation failures to block saves
          console.error(`[Posts Hook] Error during revalidation:`, error)
        }

        return doc
      },
    ],
    afterRead: [
      /**
       * Populate authors hook
       * Protects user privacy by only exposing id and name fields
       */
      populateAuthors,
    ],
  },
}

// === MIGRATION NOTES ===
// TODO: After migration is complete (estimated 1-2 weeks):
// 1. Remove deprecated fields: 'author', 'categories'
// 2. Rename 'categoriesNew' → 'categories'
// 3. Remove sync logic from beforeChange hook
// 4. Update frontend to use new field names
// 5. Run data migration scripts to populate new fields from old fields
