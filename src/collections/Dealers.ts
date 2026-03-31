import type { CollectionConfig, CollectionAfterChangeHook, CollectionBeforeValidateHook } from 'payload'
import { imageField } from '@/lib/payload/fields/media'
import { revalidatePath, revalidateTag } from 'next/cache'
import { nominatimGeocode } from '@/lib/payload/geocode'

/**
 * Auto-geocodes the dealer address using Nominatim (OpenStreetMap) before validation.
 * Free, no API key required. Respects the 1 req/sec usage policy.
 *
 * Triggers when:
 *   - Creating a new dealer without coordinates
 *   - Updating a dealer whose address (street/city/state/zipCode) changed
 *
 * Skips when:
 *   - Address didn't change (coords stay as-is, safe to manually fine-tune)
 *   - Address is incomplete (no street, city, or state)
 *   - On create: the admin manually entered coordinates
 */
const geocodeDealerAddress: CollectionBeforeValidateHook = async ({ data, originalDoc, operation }) => {
  if (!data) return data

  // Merge partial incoming address with existing so we always have a full address
  const address = {
    ...(originalDoc?.address ?? {}),
    ...(data.address ?? {}),
  }
  const prev = originalDoc?.address

  // Detect if any address field changed
  const addressChanged =
    address.street !== prev?.street ||
    address.city !== prev?.city ||
    address.state !== prev?.state ||
    address.zipCode !== prev?.zipCode

  // Create: geocode if no coords were manually provided
  // Update: geocode whenever the address changes (overwrites existing coords)
  const shouldGeocode =
    (operation === 'create' && !data.coordinates?.latitude) ||
    (operation === 'update' && addressChanged)

  if (!shouldGeocode) return data

  const displayAddress = [address.street, address.city, address.state, address.zipCode]
    .filter(Boolean)
    .join(', ')

  const coords = await nominatimGeocode(
    address,
    'KawaiPianoRetailPlatform/1.0 (admin dealer geocoding)',
  )

  if (coords) {
    data.coordinates = coords
    console.log(`✅ [Dealers] Geocoded "${displayAddress}" → ${coords.latitude}, ${coords.longitude}`)
  } else {
    console.warn(`⚠️ [Dealers] Nominatim returned no results for: ${displayAddress}`)
  }

  return data
}

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
    defaultColumns: ['dealerName', 'dealerType', 'city', 'state', 'isActive', 'updatedAt']
  },
  access: {
    read: () => true, // Public read access for dealer finder
  },
  hooks: {
    beforeValidate: [geocodeDealerAddress],
    afterChange: [revalidateDealer],
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
    {
      name: 'dealerIdentification',
      type: 'text',
      admin: {
        description: 'Optional internal dealer ID or official records reference (e.g., "V111C00923")',
        position: 'sidebar',
        placeholder: 'V111C00923'
      }
    },
    {
      name: 'dbaName',
      type: 'text',
      admin: {
        description: 'DBA / alternate business name (e.g., "dba Piano Gallery")',
        placeholder: 'dba Piano Gallery'
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
                },
                {
                  name: 'contactPerson',
                  type: 'text',
                  admin: {
                    description: 'Primary contact name at this location',
                    placeholder: 'Jane Smith'
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
                  admin: {
                    step: 0.000001,
                    description: 'Auto-filled from the address above. Override only if the geocoded pin is inaccurate.'
                  }
                },
                {
                  name: 'longitude',
                  type: 'number',
                  admin: {
                    step: 0.000001,
                    description: 'Auto-filled from the address above. Override only if the geocoded pin is inaccurate.'
                  }
                }
              ],
              admin: {
                description: '📍 Coordinates are automatically geocoded from the address whenever street, city, state, or ZIP changes. Manually enter only to fine-tune an inaccurate pin.'
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
              required: true,
              defaultValue: 'dealer',
              options: [
                { label: 'Dealer', value: 'dealer' },
                { label: 'Branch', value: 'branch' },
                { label: 'Technician', value: 'technician' },
              ],
              admin: {
                description: 'Dealer, branch location, or piano technician — controls display in finder'
              }
            },
            {
              name: 'shigeruKawaiDealer',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Authorized to sell Shigeru Kawai SK Series grands'
              }
            },
            {
              name: 'acousticPianoDealer',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Carries acoustic grand and upright pianos (GX BLAK, GL, K Series, etc.)'
              }
            },
            {
              name: 'professionalProductDealer',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Carries professional products (MP stage pianos, ES portables, VPC1, etc.)'
              }
            },
            {
              name: 'digitalPianoDealer',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Carries digital pianos (CA, CN, KDP Series, etc.)'
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

        // Internal Tab
        {
          label: 'Internal',
          description: 'Internal Kawai admin data — not displayed publicly',
          fields: [
            {
              name: 'region',
              type: 'text',
              admin: {
                description: 'Sales territory / rep name (e.g., "Kerry McCoy", "Western Canada")',
                placeholder: 'Kerry McCoy'
              }
            },
            {
              name: 'paymentTerms',
              type: 'text',
              admin: {
                description: 'Payment terms from KAC/KCM records (e.g., "PAS/Net 30 Days")',
                placeholder: 'PAS/Net 30 Days'
              }
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
