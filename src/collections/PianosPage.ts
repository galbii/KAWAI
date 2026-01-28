import type { CollectionConfig, PayloadHandler } from 'payload'
import { imageField } from '@/lib/payload/fields/media'

export const PianosPage: CollectionConfig = {
  slug: 'pianos-page',
  labels: {
    singular: 'Pianos Page',
    plural: 'Pianos Page',
  },
  admin: {
    group: 'Pages',
    useAsTitle: 'heroTitle',
    description: 'Manage all content for the main Pianos page including hero, categories, featured models, and CTAs.',
  },
  access: {
    read: () => true, // Public read access for frontend
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // Hero Section Tab
        {
          label: 'Hero Section',
          description: 'Main hero content including title, description, background image, and call-to-action',
          fields: [
            {
              name: 'heroTitle',
              type: 'text',
              required: true,
              defaultValue: 'Experience the Complete Kawai Piano Collection',
              admin: {
                description: 'Main page title displayed in the hero section'
              }
            },
            {
              name: 'heroDescription',
              type: 'textarea',
              required: true,
              defaultValue: 'From the legendary Shigeru Kawai concert grands used in international competitions to innovative digital and hybrid instruments, discover the piano that will inspire your musical journey.',
              admin: {
                description: 'Hero description text displayed below the title'
              }
            },
            imageField('heroBackgroundImage', {
              required: false,
              admin: {
                description: 'Background image for the hero section'
              }
            }),
            {
              name: 'heroCta',
              type: 'group',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  defaultValue: 'Explore Categories',
                  admin: {
                    description: 'Call-to-action button text'
                  }
                },
                {
                  name: 'link',
                  type: 'text',
                  required: true,
                  defaultValue: '#categories',
                  admin: {
                    description: 'Call-to-action button link/URL'
                  }
                }
              ],
              admin: {
                description: 'Hero call-to-action button configuration'
              }
            }
          ]
        },

        // Piano Categories Tab
        {
          label: 'Piano Categories',
          description: 'Configure the main piano category sections (Grand, Digital, Hybrid, Upright)',
          fields: [
            {
              name: 'pianoCategories',
              type: 'array',
              required: true,
              minRows: 4,
              maxRows: 4,
              labels: {
                singular: 'Piano Category',
                plural: 'Piano Categories',
              },
              admin: {
                description: 'The four main piano categories displayed on the page'
              },
              fields: [
                {
                  name: 'slug',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'URL slug for this category (e.g., "grand", "digital")'
                  }
                },
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Category display name (e.g., "Acoustic Grand Pianos")'
                  }
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                  admin: {
                    description: 'Category description text'
                  }
                },
                imageField('image', {
                  required: false,
                  admin: {
                    description: 'Category representative image'
                  }
                }),
                {
                  name: 'priceRange',
                  type: 'text',
                  admin: {
                    description: 'Price range for this category (e.g., "$45,000 - $185,000")'
                  }
                },
                {
                  name: 'features',
                  type: 'array',
                  fields: [
                    {
                      name: 'feature',
                      type: 'text',
                      required: true
                    }
                  ],
                  admin: {
                    description: 'Key features of this piano category'
                  }
                },
                {
                  name: 'icon',
                  type: 'select',
                  options: [
                    { label: 'Piano', value: 'piano' },
                    { label: 'Music', value: 'music' },
                    { label: 'Zap (Digital)', value: 'zap' },
                    { label: 'Award', value: 'award' },
                    { label: 'Crown', value: 'crown' }
                  ],
                  admin: {
                    description: 'Icon to display for this category'
                  }
                },
                {
                  name: 'badge',
                  type: 'text',
                  admin: {
                    description: 'Badge text (e.g., "Professional", "Classic")'
                  }
                },
                {
                  name: 'highlight',
                  type: 'text',
                  admin: {
                    description: 'Highlighted feature or series (e.g., "GX BLAK Performance Series")'
                  }
                },
                imageField('galleryImage1', {
                  required: false,
                  admin: {
                    description: 'First showcase image for this piano category'
                  }
                }),
                imageField('galleryImage2', {
                  required: false,
                  admin: {
                    description: 'Second showcase image for this piano category'
                  }
                }),
                imageField('galleryImage3', {
                  required: false,
                  admin: {
                    description: 'Third showcase image for this piano category'
                  }
                }),
              ]
            }
          ]
        },

        // Featured Models Tab
        {
          label: 'Featured Models',
          description: 'Featured models carousel section including section content and model details',
          fields: [
            {
              name: 'featuredModelsSection',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  defaultValue: 'Flagship & Featured Models',
                  admin: {
                    description: 'Section title for featured models'
                  }
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                  defaultValue: 'Discover our most celebrated instruments, from competition-grade concert grands to innovative digital and hybrid pianos preferred by professionals worldwide.',
                  admin: {
                    description: 'Section description for featured models'
                  }
                }
              ],
              admin: {
                description: 'Featured models section header content'
              }
            },
            {
              name: 'featuredModels',
              type: 'array',
              required: true,
              minRows: 3,
              maxRows: 3,
              labels: {
                singular: 'Featured Model',
                plural: 'Featured Models',
              },
              admin: {
                description: 'Three featured piano models for the carousel'
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Piano model name (e.g., "GX-7 BLAK")'
                  }
                },
                {
                  name: 'category',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Piano category/series (e.g., "GX BLAK Performance Series")'
                  }
                },
                imageField('image', {
                  required: false,
                  admin: {
                    description: 'Featured model image for carousel'
                  }
                }),
                {
                  name: 'badge',
                  type: 'text',
                  admin: {
                    description: 'Badge text (e.g., "Performance Series", "Flagship Digital")'
                  }
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                  admin: {
                    description: 'Model description for carousel slide'
                  }
                }
              ]
            }
          ]
        },

        // Call to Action Tab
        {
          label: 'Call to Action',
          description: 'Bottom call-to-action section encouraging showroom visits',
          fields: [
            {
              name: 'ctaSection',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  defaultValue: 'Experience the Difference',
                  admin: {
                    description: 'CTA section main title'
                  }
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                  defaultValue: 'Visit our showroom to hear and feel the exceptional quality of Kawai pianos. Our experts will help you find the perfect instrument for your musical journey.',
                  admin: {
                    description: 'CTA section description text'
                  }
                },
                {
                  name: 'ctaText',
                  type: 'text',
                  required: true,
                  defaultValue: 'Schedule Showroom Visit',
                  admin: {
                    description: 'Call-to-action button text'
                  }
                },
                {
                  name: 'ctaLink',
                  type: 'text',
                  required: true,
                  defaultValue: '/contact/schedule-visit',
                  admin: {
                    description: 'Call-to-action button link/URL'
                  }
                }
              ],
              admin: {
                description: 'Final call-to-action section configuration'
              }
            }
          ]
        },

        // SEO & Meta Tab
        {
          label: 'SEO & Meta',
          description: 'Search engine optimization and metadata settings',
          fields: [
            {
              name: 'seo',
              type: 'group',
              fields: [
                {
                  name: 'metaTitle',
                  type: 'text',
                  admin: {
                    description: 'Page meta title for search engines'
                  }
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  maxLength: 160,
                  admin: {
                    description: 'Page meta description for search engines (max 160 characters)'
                  }
                },
                {
                  name: 'keywords',
                  type: 'text',
                  admin: {
                    description: 'SEO keywords (comma-separated)'
                  }
                }
              ],
              admin: {
                description: 'SEO and metadata configuration'
              }
            }
          ]
        }
      ]
    }
  ],

  // Make this a singleton collection since there's only one pianos page
  endpoints: [
    {
      path: '/singleton',
      method: 'get',
      handler: async (req: any) => {
        try {
          const result = await req.payload.find({
            collection: 'pianos-page',
            limit: 1,
            depth: 2 // Populate media relationships and their nested relationships
          })
          
          if (result.docs.length > 0) {
            return Response.json(result.docs[0])
          } else {
            return Response.json({ error: 'Pianos page not found' }, { status: 404 })
          }
        } catch (error) {
          return Response.json({ error: 'Internal server error' }, { status: 500 })
        }
      }
    }
  ]
}