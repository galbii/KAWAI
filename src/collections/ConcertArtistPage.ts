import type { CollectionConfig } from 'payload'

export const ConcertArtistPage: CollectionConfig = {
  slug: 'concert-artist-page',
  labels: {
    singular: 'Concert Artist Page',
    plural: 'Concert Artist Page',
  },
  admin: {
    group: 'Pages',
    useAsTitle: 'pageTitle',
    description: 'Manage Concert Artist page content - models overview and image gallery',
  },
  access: {
    read: () => true, // Public read access for frontend
  },
  fields: [
    {
      name: 'pageTitle',
      type: 'text',
      required: true,
      defaultValue: 'Concert Artist Page',
      admin: {
        description: 'Internal title for admin identification',
        position: 'sidebar'
      }
    },
    {
      type: 'tabs',
      tabs: [
        // Models Overview Tab
        {
          label: 'Models Overview',
          description: 'Four main Concert Artist models showcase section',
          fields: [
            {
              name: 'modelsOverviewSection',
              type: 'group',
              fields: [
                {
                  name: 'sectionHeader',
                  type: 'text',
                  required: true,
                  defaultValue: 'The Lineup',
                  admin: {
                    description: 'Section header eyebrow text'
                  }
                },
                {
                  name: 'sectionTitle',
                  type: 'text',
                  required: true,
                  defaultValue: 'Four Voices, One Vision',
                  admin: {
                    description: 'Section main title'
                  }
                }
              ]
            },
            {
              name: 'concertArtistModels',
              type: 'array',
              required: true,
              minRows: 4,
              maxRows: 4,
              labels: {
                singular: 'Model',
                plural: 'Concert Artist Models',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Model name (e.g., "CA401", "CA501")'
                  }
                },
                {
                  name: 'tagline',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Model tagline (e.g., "Where Mastery Begins")'
                  }
                },
                {
                  name: 'descriptor',
                  type: 'textarea',
                  required: true,
                  admin: {
                    description: 'Brief model description (1-2 sentences)'
                  }
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: false,
                  filterOptions: {
                    mimeType: { contains: 'image' },
                  },
                  admin: {
                    description: 'Model showcase image'
                  }
                },
                {
                  name: 'link',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Link to product page (e.g., "/products/ca401")'
                  }
                }
              ],
              defaultValue: [
                {
                  name: 'CA401',
                  tagline: 'Where Mastery Begins',
                  descriptor: 'Entry to the Concert Artist lineage—wooden keys from lesson one',
                  link: '/products/ca401'
                },
                {
                  name: 'CA501',
                  tagline: 'The Journey Instrument',
                  descriptor: 'Professional sound and features supporting Grade 1 through Graduate-level growth',
                  link: '/products/ca501'
                },
                {
                  name: 'CA701',
                  tagline: 'The Artist\'s Choice',
                  descriptor: 'Grand Feel III action and SK-EX Rendering for those who demand concert-level practice',
                  link: '/products/ca701'
                },
                {
                  name: 'CA901',
                  tagline: 'The Master\'s Companion',
                  descriptor: 'TwinDrive genuine spruce soundboard—concert physics in your home',
                  link: '/products/ca901'
                }
              ],
              admin: {
                description: 'Four Concert Artist models displayed in the overview section'
              }
            }
          ]
        },

        // Model Image Gallery Tab
        {
          label: 'Model Image Gallery',
          description: 'Detailed image galleries for each Concert Artist model',
          fields: [
            {
              name: 'modelGalleries',
              type: 'array',
              required: true,
              minRows: 4,
              maxRows: 4,
              labels: {
                singular: 'Model Gallery',
                plural: 'Model Galleries',
              },
              fields: [
                {
                  name: 'modelId',
                  type: 'select',
                  options: [
                    { label: 'CA401', value: 'ca401' },
                    { label: 'CA501', value: 'ca501' },
                    { label: 'CA701', value: 'ca701' },
                    { label: 'CA901', value: 'ca901' }
                  ],
                  required: true,
                  admin: {
                    description: 'Model identifier'
                  }
                },
                {
                  name: 'modelName',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Model name display (e.g., "CA401")'
                  }
                },
                {
                  name: 'tagline',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Model tagline for gallery tab'
                  }
                },
                {
                  name: 'images',
                  type: 'array',
                  required: true,
                  minRows: 6,
                  maxRows: 6,
                  labels: {
                    singular: 'Image',
                    plural: 'Gallery Images',
                  },
                  fields: [
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      required: false,
                      filterOptions: {
                        mimeType: { contains: 'image' },
                      },
                      admin: {
                        description: 'Gallery image'
                      }
                    },
                    {
                      name: 'alt',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Image alt text for accessibility'
                      }
                    }
                  ],
                  admin: {
                    description: 'Six showcase images for this model'
                  }
                }
              ],
              defaultValue: [
                {
                  modelId: 'ca401',
                  modelName: 'CA401',
                  tagline: 'Where Mastery Begins',
                  images: [
                    { alt: 'CA401 Front View' },
                    { alt: 'CA401 Keys Detail' },
                    { alt: 'CA401 Side Profile' },
                    { alt: 'CA401 Control Panel' },
                    { alt: 'CA401 Speaker System' },
                    { alt: 'CA401 Interior Detail' }
                  ]
                },
                {
                  modelId: 'ca501',
                  modelName: 'CA501',
                  tagline: 'The Journey Instrument',
                  images: [
                    { alt: 'CA501 Front View' },
                    { alt: 'CA501 Keys Detail' },
                    { alt: 'CA501 Side Profile' },
                    { alt: 'CA501 Speaker System' },
                    { alt: 'CA501 Control Panel' },
                    { alt: 'CA501 Interior Detail' }
                  ]
                },
                {
                  modelId: 'ca701',
                  modelName: 'CA701',
                  tagline: 'The Artist\'s Choice',
                  images: [
                    { alt: 'CA701 Front View' },
                    { alt: 'CA701 Keys Detail' },
                    { alt: 'CA701 Side Profile' },
                    { alt: 'CA701 Grand Feel Action' },
                    { alt: 'CA701 Speaker System' },
                    { alt: 'CA701 Interior Detail' }
                  ]
                },
                {
                  modelId: 'ca901',
                  modelName: 'CA901',
                  tagline: 'The Master\'s Companion',
                  images: [
                    { alt: 'CA901 Front View' },
                    { alt: 'CA901 Keys Detail' },
                    { alt: 'CA901 Side Profile' },
                    { alt: 'CA901 TwinDrive Soundboard' },
                    { alt: 'CA901 Speaker System' },
                    { alt: 'CA901 Interior Detail' }
                  ]
                }
              ],
              admin: {
                description: 'Image galleries for all four Concert Artist models'
              }
            }
          ]
        }
      ]
    }
  ],

  // Make this a singleton collection since there's only one concert artist page
  endpoints: [
    {
      path: '/singleton',
      method: 'get',
      handler: async (req: any) => {
        try {
          const result = await req.payload.find({
            collection: 'concert-artist-page',
            limit: 1,
            depth: 2 // Populate media relationships and their nested relationships
          })

          if (result.docs.length > 0) {
            return Response.json(result.docs[0])
          } else {
            return Response.json({ error: 'Concert Artist page not found' }, { status: 404 })
          }
        } catch (error) {
          return Response.json({ error: 'Internal server error' }, { status: 500 })
        }
      }
    }
  ],

  hooks: {
    afterChange: [
      async ({ doc, req, operation, context }) => {
        // Prevent infinite loops
        if (context.skipRevalidation) {
          console.log(`[ConcertArtistPage Hook] Skipping revalidation (context flag set)`)
          return doc
        }

        console.log(`[ConcertArtistPage Hook] afterChange triggered: operation=${operation}`)

        try {
          // Construct the revalidation URL
          const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
          const revalidateUrl = `${baseURL}/api/revalidate`

          console.log(`[ConcertArtistPage Hook] Triggering revalidation for /concert-artist at ${revalidateUrl}`)

          // Trigger on-demand revalidation in the background
          // Don't await this - we don't want to block the CMS save operation
          fetch(revalidateUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              secret: process.env.REVALIDATION_SECRET,
              path: '/concert-artist'
            })
          })
            .then(async (response) => {
              if (response.ok) {
                const result = await response.json()
                console.log(`[ConcertArtistPage Hook] Revalidation successful:`, result)
              } else {
                const errorText = await response.text()
                console.error(`[ConcertArtistPage Hook] Revalidation failed:`, response.status, errorText)
              }
            })
            .catch((error) => {
              console.error(`[ConcertArtistPage Hook] Revalidation request error:`, error)
            })

          console.log(`[ConcertArtistPage Hook] Revalidation request sent (background)`)

        } catch (error) {
          // Log the error but don't throw - we don't want revalidation failures to block saves
          console.error(`[ConcertArtistPage Hook] Error during revalidation:`, error)
        }

        return doc
      }
    ]
  }
}
