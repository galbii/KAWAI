import type { CollectionConfig, CollectionAfterChangeHook } from 'payload'
import { imageField } from '@/lib/payload/fields/media'
import { revalidatePath, revalidateTag } from 'next/cache'

const revalidateDealer: CollectionAfterChangeHook = async ({ doc, context }) => {
  // Prevent infinite loops
  if (context.skipRevalidation) return doc

  // Only revalidate active dealers
  if (!doc.isActive) return doc

  try {
    // Revalidate dealer detail page
    revalidatePath(`/find-a-dealer/${doc.slug}`)

    // Revalidate cache tags
    revalidateTag(`dealer-${doc.slug}`)

    // Revalidate main finder page
    revalidatePath('/find-a-dealer')

    console.log(`✅ Revalidated dealer page: /find-a-dealer/${doc.slug}`)
  } catch (error) {
    console.error(`❌ Revalidation failed for dealer ${doc.slug}:`, error)
  }

  return doc
}

export const Dealers: CollectionConfig = {
  slug: 'dealers',
  labels: {
    singular: 'Dealer',
    plural: 'Dealers',
  },
  admin: {
    group: 'Business',
    useAsTitle: 'dealerName',
    description: 'Manage authorized Kawai piano dealers with location, contact information, and service details for the dealer finder map.',
    defaultColumns: ['dealerName', 'city', 'state', 'isActive', 'updatedAt']
  },
  access: {
    read: () => true, // Public read access for dealer finder
  },
  hooks: {
    afterChange: [revalidateDealer]
  },
  fields: [
    // Basic Information
    {
      name: 'dealerName',
      type: 'text',
      required: true,
      admin: {
        description: 'Full business name of the dealer (e.g., "Kawai Piano Gallery St. Louis", "John\'s Piano Center"). Multiple locations can share the same dealer name.'
      }
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (auto-generated from dealer name, e.g., "kawai-piano-gallery-st-louis")'
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
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Controls whether this dealer appears in the dealer finder',
        position: 'sidebar'
      }
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Feature this dealer prominently in search results',
        position: 'sidebar'
      }
    },

    // Tabbed Content
    {
      type: 'tabs',
      tabs: [
        // Contact Information Tab
        {
          label: 'Contact Information',
          description: 'Primary contact details and address information',
          fields: [
            {
              name: 'contactInfo',
              type: 'group',
              fields: [
                {
                  name: 'phone',
                  type: 'text',
                  required: false,
                  admin: {
                    description: 'Primary phone number (e.g., "636-265-2866" or "(636) 265-2866")',
                    placeholder: '(555) 123-4567'
                  }
                },
                {
                  name: 'email',
                  type: 'email',
                  admin: {
                    description: 'Primary contact email address'
                  }
                },
                {
                  name: 'website',
                  type: 'text',
                  admin: {
                    description: 'Dealer website URL (include https://)',
                    placeholder: 'https://example.com'
                  },
                  validate: (val: string | null | undefined) => {
                    if (!val) return true // Optional field
                    if (typeof val !== 'string') return 'Website must be a valid URL'
                    if (!val.match(/^https?:\/\/.+/)) {
                      return 'Website must be a valid URL starting with http:// or https://'
                    }
                    return true
                  }
                },
                {
                  name: 'fax',
                  type: 'text',
                  admin: {
                    description: 'Fax number (if applicable)',
                    placeholder: '(555) 123-4568'
                  }
                }
              ]
            },

            {
              name: 'address',
              type: 'group',
              label: 'Physical Address',
              fields: [
                {
                  name: 'street',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Street address (e.g., "21 Meadows Circle Drive, Suite 312")',
                    placeholder: '123 Main Street'
                  }
                },
                {
                  name: 'city',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'City name',
                    placeholder: 'St. Louis'
                  }
                },
                {
                  name: 'state',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'State or region (2-letter abbreviation preferred: MO, CA, NY)',
                    placeholder: 'MO'
                  }
                },
                {
                  name: 'zipCode',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'ZIP or postal code',
                    placeholder: '63367'
                  }
                },
                {
                  name: 'country',
                  type: 'text',
                  defaultValue: 'USA',
                  admin: {
                    description: 'Country (defaults to USA)'
                  }
                }
              ],
              admin: {
                description: 'Complete physical address for map placement and directions'
              }
            },

            {
              name: 'coordinates',
              type: 'group',
              label: 'Geographic Coordinates',
              fields: [
                {
                  name: 'latitude',
                  type: 'number',
                  required: true,
                  admin: {
                    step: 0.000001,
                    description: 'Latitude (e.g., 38.627003). Find at https://www.latlong.net/'
                  }
                },
                {
                  name: 'longitude',
                  type: 'number',
                  required: true,
                  admin: {
                    step: 0.000001,
                    description: 'Longitude (e.g., -90.199402)'
                  }
                }
              ],
              admin: {
                description: 'Exact GPS coordinates for accurate map marker placement. REQUIRED for dealer finder map.'
              }
            }
          ]
        },

        // Business Details Tab
        {
          label: 'Business Details',
          description: 'Operating hours, services, and additional information',
          fields: [
            {
              name: 'dealerType',
              type: 'select',
              hasMany: true,
              required: true,
              options: [
                { label: 'Professional Products', value: 'professional-products' },
                { label: 'Acoustic and Digital Pianos', value: 'acoustic-digital' },
              ],
              defaultValue: ['acoustic-digital'],
              admin: {
                description: 'Select the type(s) of products this dealer carries. Dealers can carry both types.',
                isClearable: false,
              }
            },

            {
              name: 'description',
              type: 'textarea',
              admin: {
                description: 'Brief description of the dealer (displayed in dealer finder results)'
              }
            },

            {
              name: 'hours',
              type: 'array',
              labels: {
                singular: 'Day',
                plural: 'Business Hours',
              },
              fields: [
                {
                  name: 'day',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Monday', value: 'monday' },
                    { label: 'Tuesday', value: 'tuesday' },
                    { label: 'Wednesday', value: 'wednesday' },
                    { label: 'Thursday', value: 'thursday' },
                    { label: 'Friday', value: 'friday' },
                    { label: 'Saturday', value: 'saturday' },
                    { label: 'Sunday', value: 'sunday' }
                  ],
                  admin: {
                    description: 'Day of the week'
                  }
                },
                {
                  name: 'openTime',
                  type: 'text',
                  admin: {
                    description: 'Opening time (e.g., "10:00 AM")',
                    placeholder: '10:00 AM'
                  }
                },
                {
                  name: 'closeTime',
                  type: 'text',
                  admin: {
                    description: 'Closing time (e.g., "7:00 PM")',
                    placeholder: '7:00 PM'
                  }
                },
                {
                  name: 'isClosed',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Check if closed on this day'
                  }
                }
              ],
              defaultValue: [
                { day: 'monday', openTime: '10:00 AM', closeTime: '6:00 PM', isClosed: false },
                { day: 'tuesday', openTime: '10:00 AM', closeTime: '6:00 PM', isClosed: false },
                { day: 'wednesday', openTime: '10:00 AM', closeTime: '6:00 PM', isClosed: false },
                { day: 'thursday', openTime: '10:00 AM', closeTime: '6:00 PM', isClosed: false },
                { day: 'friday', openTime: '10:00 AM', closeTime: '6:00 PM', isClosed: false },
                { day: 'saturday', openTime: '10:00 AM', closeTime: '5:00 PM', isClosed: false },
                { day: 'sunday', openTime: '', closeTime: '', isClosed: true }
              ],
              admin: {
                description: 'Business hours for each day of the week'
              }
            },

            {
              name: 'tags',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Authorized Dealer', value: 'authorized-dealer' },
                { label: 'Full Service Center', value: 'full-service' },
                { label: 'Grand Piano Specialist', value: 'grand-specialist' },
                { label: 'Digital Piano Specialist', value: 'digital-specialist' },
                { label: 'Piano Tuning Available', value: 'tuning' },
                { label: 'Piano Repair', value: 'repair' },
                { label: 'Piano Restoration', value: 'restoration' },
                { label: 'Piano Moving', value: 'moving' },
                { label: 'Rentals Available', value: 'rentals' },
                { label: 'Financing Available', value: 'financing' },
                { label: 'Trade-Ins Accepted', value: 'trade-ins' },
                { label: 'Virtual Consultations', value: 'virtual-consult' },
                { label: 'Education Programs', value: 'education' },
                { label: 'Performance Venue', value: 'performance' },
              ],
              admin: {
                description: 'Tags/categories to help customers find dealers with specific services (multi-select)',
                isClearable: true,
                isSortable: true
              }
            },

            {
              name: 'specialties',
              type: 'textarea',
              admin: {
                description: 'Special services or unique features (displayed in dealer detail view)',
                placeholder: 'e.g., "Concert piano rentals, Steinway-certified technicians, climate-controlled showroom"'
              }
            },

            imageField('dealerImage', {
              admin: {
                description: 'Showroom or business photo (optional, for enhanced listings)'
              }
            }),

            {
              name: 'yearEstablished',
              type: 'number',
              admin: {
                description: 'Year the business was established (e.g., 1985)',
                placeholder: '1985'
              }
            }
          ]
        },

        // Service Area Tab
        {
          label: 'Service Area',
          description: 'Geographic coverage and service radius',
          fields: [
            {
              name: 'serviceArea',
              type: 'group',
              fields: [
                {
                  name: 'serviceRadius',
                  type: 'number',
                  admin: {
                    description: 'Service radius in miles (e.g., 50 for 50-mile radius)',
                    placeholder: '50'
                  }
                },
                {
                  name: 'primaryMarkets',
                  type: 'array',
                  label: 'Primary Markets',
                  fields: [
                    {
                      name: 'market',
                      type: 'text',
                      admin: {
                        description: 'City or region name',
                        placeholder: 'St. Louis Metro'
                      }
                    }
                  ],
                  admin: {
                    description: 'Primary cities/regions served (for search filtering)'
                  }
                },
                {
                  name: 'statesServed',
                  type: 'array',
                  label: 'States Served',
                  fields: [
                    {
                      name: 'state',
                      type: 'text',
                      admin: {
                        description: 'State abbreviation (e.g., MO, IL)',
                        placeholder: 'MO'
                      }
                    }
                  ],
                  admin: {
                    description: 'States where dealer provides services or delivery'
                  }
                }
              ]
            }
          ]
        },

        // SEO & Metadata Tab
        {
          label: 'SEO & Metadata',
          description: 'Search engine optimization settings',
          fields: [
            {
              name: 'seo',
              type: 'group',
              fields: [
                {
                  name: 'metaTitle',
                  type: 'text',
                  admin: {
                    description: 'Custom meta title (leave empty to auto-generate from dealer name)'
                  }
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  maxLength: 160,
                  admin: {
                    description: 'Meta description for search engines (max 160 characters)'
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
