import type { CollectionConfig } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import { imageField } from '@/lib/payload/fields/media'
import type { Artist } from '@/payload-types'

export const Artists: CollectionConfig = {
  slug: 'artists',
  labels: {
    singular: 'Artist',
    plural: 'Artists',
  },
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'featured', 'updatedAt'],
    description: 'Manage KAWAI artists — musicians and performers who play KAWAI pianos',
    livePreview: {
      url: ({ data }) => {
        const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        return `${baseURL}/artists/${data.slug || 'preview'}`
      },
    },
    preview: (data) => {
      const params = {
        slug: (data?.slug as string) || '',
        collection: 'artists',
        path: `/artists/${(data?.slug as string) || 'preview'}`,
      }
      return `/api/preview?${new URLSearchParams(params).toString()}`
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    // Sidebar fields (appear on all tabs)
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Artist full name (e.g., "John Smith", "Maria García")'
      }
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier for this artist (auto-generated from name)',
        position: 'sidebar'
      },
      validate: (val: string | string[] | null | undefined) => {
        if (!val || typeof val !== 'string') return 'Slug is required'
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val)) {
          return 'Slug must be URL-friendly (lowercase letters, numbers, and hyphens only)'
        }
        return true
      }
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Feature this artist prominently on the artists page',
        position: 'sidebar'
      }
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Controls whether this artist is visible on the frontend',
        position: 'sidebar'
      }
    },
    {
      name: 'isShigeruArtist',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Artist plays or endorses Shigeru Kawai instruments',
        position: 'sidebar'
      }
    },
    {
      name: 'region',
      type: 'text',
      admin: {
        description: 'Geographic region or base (e.g. "US", "UK", "Nashville")',
        position: 'sidebar'
      }
    },

    // Tabs for organized content
    {
      type: 'tabs',
      tabs: [
        // Profile Tab
        {
          label: 'Profile',
          description: 'Artist profile information, image, and biography',
          fields: [
            imageField('image', {
              required: false,
              admin: {
                description: 'Artist profile photo or performance image'
              }
            }),
            {
              name: 'imageUrl',
              type: 'text',
              admin: {
                description: 'Direct image URL (fallback if media upload is not available)'
              }
            },
            {
              name: 'heroImageUrl',
              type: 'text',
              admin: {
                description: 'Optional high-resolution image URL for hero carousel (used when this artist is featured). If empty, will use the regular image.',
                condition: (data) => data.featured === true
              }
            },
            {
              name: 'shortBio',
              type: 'textarea',
              maxLength: 280,
              admin: {
                description: 'Short bio for artist cards and listings (max 280 characters, like a tweet)'
              }
            },
            {
              name: 'bio',
              type: 'richText',
              required: true,
              admin: {
                description: 'Artist biography - tell their story, achievements, and connection to KAWAI pianos'
              }
            },
            {
              name: 'genre',
              type: 'text',
              admin: {
                description: 'Musical genre(s) — free-form to support combinations (e.g. "classical/rock", "jazz/gospel")'
              }
            },
            {
              name: 'quote',
              type: 'group',
              fields: [
                {
                  name: 'text',
                  type: 'textarea',
                  admin: {
                    description: 'A quote from the artist about KAWAI or their music',
                    placeholder: '"The KAWAI SK-EX is the finest instrument I have ever played."'
                  }
                },
                {
                  name: 'date',
                  type: 'date',
                  admin: {
                    description: 'When the artist said or published this quote',
                    date: { pickerAppearance: 'monthOnly', displayFormat: 'MMMM yyyy' }
                  }
                }
              ],
              admin: {
                description: 'Optional artist quote for use in marketing and artist profiles'
              }
            },
            {
              name: 'instrument',
              type: 'select',
              options: [
                { label: 'Grand Piano', value: 'grand' },
                { label: 'Upright Piano', value: 'upright' },
                { label: 'Digital Piano', value: 'digital' },
                { label: 'Hybrid Piano', value: 'hybrid' },
                { label: 'Multiple', value: 'multiple' }
              ],
              admin: {
                description: 'Primary KAWAI instrument type'
              }
            },
            {
              name: 'kawaiModel',
              type: 'relationship',
              relationTo: 'products',
              admin: {
                description: 'KAWAI piano model used by this artist (links to product page)'
              }
            }
          ]
        },

        // Social Media Tab
        {
          label: 'Social Media',
          description: 'Social media profiles, streaming links, and audience metrics',
          fields: [
            {
              name: 'audienceMetrics',
              type: 'group',
              fields: [
                {
                  name: 'instagramFollowers',
                  type: 'text',
                  admin: {
                    description: 'Instagram follower count (e.g. "3M", "130.6K")',
                    placeholder: '130.6K'
                  }
                },
                {
                  name: 'youtubeSubscribers',
                  type: 'text',
                  admin: {
                    description: 'YouTube subscriber count (e.g. "11M", "47.6K")',
                    placeholder: '47.6K'
                  }
                },
                {
                  name: 'spotifyMonthlyListeners',
                  type: 'text',
                  admin: {
                    description: 'Spotify monthly listener count (e.g. "47.4M", "569K")',
                    placeholder: '47.4M'
                  }
                }
              ],
              admin: {
                description: 'Audience reach metrics for internal roster vetting — update periodically'
              }
            },
            {
              name: 'socialLinks',
              type: 'array',
              required: false,
              labels: {
                singular: 'Link',
                plural: 'Social Media & Links',
              },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Website', value: 'website' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'Spotify', value: 'spotify' },
                    { label: 'Apple Music', value: 'apple-music' },
                    { label: 'SoundCloud', value: 'soundcloud' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Twitter/X', value: 'twitter' },
                    { label: 'TikTok', value: 'tiktok' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'Bandcamp', value: 'bandcamp' },
                    { label: 'Other', value: 'other' }
                  ],
                  admin: {
                    description: 'Social media platform or link type'
                  }
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Full URL to artist profile or page',
                    placeholder: 'https://www.instagram.com/artistname'
                  },
                  validate: (val: string | string[] | null | undefined) => {
                    if (!val || typeof val !== 'string') return 'URL is required'
                    try {
                      new URL(val)
                      return true
                    } catch {
                      return 'Please enter a valid URL (must start with http:// or https://)'
                    }
                  }
                },
                {
                  name: 'label',
                  type: 'text',
                  admin: {
                    description: 'Optional custom label (defaults to platform name)',
                    placeholder: 'Listen on Spotify'
                  }
                }
              ],
              admin: {
                description: 'Add social media profiles, streaming platforms, and website links'
              }
            }
          ]
        },

        // Media Tab
        {
          label: 'Media',
          description: 'Featured videos and achievements',
          fields: [
            {
              name: 'featuredVideo',
              type: 'group',
              fields: [
                {
                  name: 'youtubeId',
                  type: 'text',
                  admin: {
                    description: 'YouTube video ID (e.g., "dQw4w9WgXcQ" from https://www.youtube.com/watch?v=dQw4w9WgXcQ)',
                    placeholder: 'dQw4w9WgXcQ'
                  }
                },
                {
                  name: 'title',
                  type: 'text',
                  admin: {
                    description: 'Video title or description'
                  }
                }
              ],
              admin: {
                description: 'Featured performance video (optional)'
              }
            },
            {
              name: 'achievements',
              type: 'array',
              labels: {
                singular: 'Achievement',
                plural: 'Notable Achievements',
              },
              fields: [
                {
                  name: 'achievement',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: 'Grammy Award Winner 2024'
                  }
                }
              ],
              admin: {
                description: 'Notable awards, performances, or career highlights'
              }
            },
            {
              name: 'recentWork',
              type: 'array',
              labels: {
                singular: 'Recent Work',
                plural: 'Recent Work',
              },
              maxRows: 5,
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Title of the work (e.g., "Carnegie Hall Performance", "Album Recording Session")',
                    placeholder: 'Carnegie Hall Performance with KAWAI SK-EX'
                  }
                },
                {
                  name: 'description',
                  type: 'textarea',
                  maxLength: 200,
                  admin: {
                    description: 'Brief description of the work (max 200 characters)',
                    placeholder: 'A stunning performance of Chopin\'s Piano Concerto No. 1'
                  }
                },
                {
                  name: 'date',
                  type: 'date',
                  admin: {
                    description: 'Date of the performance/work',
                  }
                },
                {
                  name: 'platform',
                  type: 'select',
                  options: [
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'TikTok', value: 'tiktok' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Twitter/X', value: 'twitter' },
                    { label: 'Spotify', value: 'spotify' },
                    { label: 'Apple Music', value: 'apple-music' },
                    { label: 'SoundCloud', value: 'soundcloud' },
                    { label: 'Website', value: 'website' },
                    { label: 'Other', value: 'other' }
                  ],
                  defaultValue: 'youtube',
                  admin: {
                    description: 'Social media platform or link type'
                  }
                },
                {
                  name: 'link',
                  type: 'text',
                  admin: {
                    description: 'Optional link to video, recording, or article about the work',
                    placeholder: 'https://www.youtube.com/watch?v=...'
                  },
                  validate: (val: string | null | undefined) => {
                    if (!val) return true
                    try {
                      new URL(val)
                      return true
                    } catch {
                      return 'Please enter a valid URL (must start with http:// or https://)'
                    }
                  }
                },
                {
                  name: 'featured',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Feature this work prominently (e.g., in carousels)'
                  }
                }
              ],
              admin: {
                description: 'Recent performances, recordings, or projects with KAWAI pianos (up to 5)'
              }
            }
          ]
        },

        // Internal Tab
        {
          label: 'Internal',
          description: 'Roster management notes — not visible on the frontend',
          fields: [
            {
              name: 'internalStatus',
              type: 'select',
              options: [
                { label: 'Keep', value: 'keep' },
                { label: 'Under Review', value: 'under-review' },
                { label: 'Recommend Removal', value: 'recommend-removal' },
                { label: 'Reach Out', value: 'reach-out' },
              ],
              access: { read: ({ req: { user } }) => Boolean(user) },
              admin: {
                description: 'Roster action for this artist — reviewed during audits'
              }
            },
            {
              name: 'internalNotes',
              type: 'textarea',
              access: { read: ({ req: { user } }) => Boolean(user) },
              admin: {
                description: 'Internal notes (website status, instrument concerns, open questions, etc.) — never shown publicly'
              }
            }
          ]
        },

        // SEO & Meta Tab
        {
          label: 'SEO & Meta',
          description: 'Search engine optimization and metadata',
          fields: [
            {
              name: 'seo',
              type: 'group',
              fields: [
                {
                  name: 'metaTitle',
                  type: 'text',
                  admin: {
                    description: 'Custom meta title (defaults to artist name + "| KAWAI Artist")'
                  }
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  maxLength: 160,
                  admin: {
                    description: 'Meta description for search engines (max 160 characters, auto-generated from short bio if empty)'
                  }
                },
                {
                  name: 'keywords',
                  type: 'text',
                  admin: {
                    description: 'SEO keywords (comma-separated)'
                  }
                },
                imageField('ogImage', {
                  admin: {
                    description: 'Open Graph image for social sharing (defaults to artist image)'
                  }
                })
              ],
              admin: {
                description: 'SEO and social media optimization'
              }
            }
          ]
        }
      ]
    }
  ],

  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },

  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Auto-generate slug from name if not provided or empty
        if (data.name && (!data.slug || data.slug.trim() === '')) {
          const generatedSlug = data.name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '')

          data.slug = generatedSlug || 'artist'
        }

        return data
      }
    ],
    afterChange: [
      ({ doc, previousDoc, req: { payload, context } }: { doc: Artist; previousDoc: Artist; req: any }) => {
        if (!context.disableRevalidate) {
          if (doc._status === 'published') {
            const path = `/artists/${doc.slug}`
            payload.logger.info(`Revalidating artist at path: ${path}`)
            revalidatePath(path, 'page')
            revalidateTag(`artist-${doc.slug}`)
            revalidateTag('artists')
          }
          // If previously published and now unpublished, bust the old path too
          if (previousDoc?._status === 'published' && doc._status !== 'published') {
            const oldPath = `/artists/${previousDoc.slug}`
            payload.logger.info(`Revalidating old artist path: ${oldPath}`)
            revalidatePath(oldPath, 'page')
            revalidateTag(`artist-${previousDoc.slug}`)
            revalidateTag('artists')
          }
        }
        return doc
      }
    ],
    afterDelete: [
      ({ doc, req: { context } }: { doc: Artist; req: any }) => {
        if (!context.disableRevalidate) {
          revalidatePath(`/artists/${doc.slug}`, 'page')
          revalidateTag(`artist-${doc.slug}`)
          revalidateTag('artists')
        }
        return doc
      }
    ],
  },

}
