import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

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
    defaultColumns: ['title', 'authors', 'status', 'publishedDate'],
    useAsTitle: 'title',
    description: 'Blog posts with rich content, featured images, and flexible page building',
    components: {
      beforeList: ['/components/admin/SeedPostsButton#SeedPostsButton'],
    },
    livePreview: {
      url: ({ data }) => {
        const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        const slug = (data.slug as string) || 'preview'
        // Route through /api/preview so Next.js draft mode is enabled before the
        // iframe loads the post page. Without this, draft/unpublished posts return
        // 404 because the page query filters to status=published when not in draft mode.
        const params = new URLSearchParams({
          slug,
          collection: 'posts',
          path: `/blog/${slug}`,
          previewSecret: process.env.PREVIEW_SECRET || '',
        })
        return `${baseURL}/api/preview?${params.toString()}`
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
        // Post Details Tab
        {
          label: 'Post Details',
          description: 'Featured image and excerpt for the post',
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
                description: 'Featured image for post header and social sharing (used as fallback when no hero video is set)',
              },
            }),
            {
              name: 'heroVideoUrl',
              type: 'text',
              admin: {
                description: 'YouTube URL to embed as the hero (e.g. https://youtu.be/abc123). When set, this replaces the featured image in the hero. The featured image is still used as the social share image.',
                placeholder: 'https://www.youtube.com/watch?v=...',
              },
            },
          ],
        },

        // Content Tab — unified page builder
        {
          label: 'Content',
          description: 'Build the post content using blocks — add Rich Text for article prose, Video for embeds, Images, Banners, and more',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blockReferences: [
                'content-rich-text',
                'content-image',
                'content-video',
                'content-banner',
                'content-code',
                'content-cta',
                'layout-spacer',
                'layout-divider',
                'layout-columns',
                'marketing-cta',
                'marketing-featured-models',
                'marketing-artist-carousel',
                'marketing-blog-latest',
                'product-reference',
              ] as any,
              blocks: [],
              defaultValue: [{ blockType: 'content-rich-text' }],
              admin: {
                description: 'Add blocks to build the post. Use "Rich Text" for article prose, "Video" for YouTube/Vimeo embeds, "Image" for standalone photos.',
              },
            },
          ],
        },

        // Organization Tab
        {
          label: 'Organization',
          description: 'Authors, categories, tags, and related posts',
          fields: [
            {
              name: 'authors',
              type: 'relationship',
              relationTo: 'users',
              hasMany: true,
              admin: {
                description: 'Post authors (supports multiple authors)',
                position: 'sidebar',
              },
            },
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
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              admin: {
                description: 'Post categories from Categories collection',
                position: 'sidebar',
              },
            },
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
          ],
        },

        // Publishing Tab
        {
          label: 'Publishing',
          description: 'Publication status, date, and featured flag',
          fields: [
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
      async ({ data, operation, context }) => {
        // Prevent infinite loops
        if (context.skipSync) {
          return data
        }

        // Set publishedDate on first publish
        if (data.status === 'published' && !data.publishedDate) {
          data.publishedDate = new Date().toISOString()
        }

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
