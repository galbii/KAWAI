import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Post',
    plural: 'Posts',
  },
  admin: {
    group: 'Content',
    defaultColumns: ['title', 'author', 'status', 'publishedDate', 'updatedAt'],
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
    read: ({ req: { user } }) => {
      // Public can only read published posts
      if (!user) {
        return {
          status: {
            equals: 'published',
          },
        }
      }
      // Admins can read all posts
      return true
    },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // Content Tab
        {
          label: 'Content',
          description: 'Post content, title, and rich text editor',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                description: 'Post title/headline',
              },
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              admin: {
                description: 'URL-friendly version of the post title (auto-generated)',
                readOnly: false,
              },
            },
            {
              name: 'excerpt',
              type: 'textarea',
              maxLength: 300,
              admin: {
                description: 'Short excerpt for post listings and meta description (max 300 characters)',
              },
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Featured image for post header and social sharing',
              },
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              editor: lexicalEditor(),
              admin: {
                description: 'Main post content with rich formatting (bold, italic, lists, links, headings)',
              },
            },
            {
              name: 'contentBlocks',
              type: 'blocks',
              blockReferences: ['image', 'text', 'video', 'spacer', 'divider', 'columns'],
              blocks: [], // Use blockReferences for globally defined blocks
              admin: {
                description: 'Additional content blocks for images, videos, and custom layouts',
              },
            },
          ],
        },

        // Settings Tab
        {
          label: 'Settings',
          description: 'Author, categories, tags, and publishing settings',
          fields: [
            {
              name: 'author',
              type: 'relationship',
              relationTo: 'users',
              required: true,
              admin: {
                description: 'Post author',
                position: 'sidebar',
              },
            },
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
                description: 'Post categories (select multiple)',
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
                {
                  name: 'ogImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Open Graph image for social sharing (defaults to featured image)',
                  },
                },
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
      async ({ data, operation }) => {
        console.log(`📝 Posts beforeChange: operation=${operation}, title="${data.title}"`)

        // Auto-generate slug from title if not provided or empty
        if (data.title && (!data.slug || data.slug.trim() === '')) {
          const generatedSlug = data.title
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '')

          data.slug = generatedSlug || 'post'
          console.log(`🔗 Generated slug from title "${data.title}" -> "${data.slug}"`)
        }

        // Set publishedDate on first publish
        if (data.status === 'published' && !data.publishedDate) {
          data.publishedDate = new Date().toISOString()
          console.log(`📅 Set publishedDate: ${data.publishedDate}`)
        }

        console.log(`📝 Posts beforeChange END: returning data with slug="${data.slug}"`)
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
  },
}
