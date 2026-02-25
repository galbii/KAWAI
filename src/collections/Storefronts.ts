import type { CollectionConfig, CollectionBeforeValidateHook } from 'payload'
import { revalidateTag, revalidatePath } from 'next/cache'
import { imageField, videoField } from '@/lib/payload/fields'
import { nominatimGeocode } from '@/lib/payload/geocode'

/**
 * Auto-geocodes the storefront address using Nominatim before validation.
 * Writes result to schemaData.geoCoordinates so the dealer finder map works.
 */
const geocodeStorefrontAddress: CollectionBeforeValidateHook = async ({ data, originalDoc, operation }) => {
  if (!data) return data

  const address = {
    ...(originalDoc?.address ?? {}),
    ...(data.address ?? {}),
  }
  const prev = originalDoc?.address

  const addressChanged =
    address.street !== prev?.street ||
    address.city !== prev?.city ||
    address.state !== prev?.state ||
    address.zipCode !== prev?.zipCode

  const shouldGeocode =
    (operation === 'create' && !data.schemaData?.geoCoordinates?.latitude) ||
    (operation === 'update' && addressChanged)

  if (!shouldGeocode) return data

  const displayAddress = [address.street, address.city, address.state, address.zipCode]
    .filter(Boolean)
    .join(', ')

  const coords = await nominatimGeocode(
    address,
    'KawaiPianoRetailPlatform/1.0 (storefront geocoding)',
  )

  if (coords) {
    data.schemaData = {
      ...(data.schemaData ?? {}),
      geoCoordinates: { latitude: coords.latitude, longitude: coords.longitude },
    }
    console.log(`✅ [Storefronts] Geocoded "${displayAddress}" → ${coords.latitude}, ${coords.longitude}`)
  } else {
    console.warn(`⚠️ [Storefronts] Nominatim returned no results for: ${displayAddress}`)
  }

  return data
}

export const Storefronts: CollectionConfig = {
  slug: 'storefronts',
  labels: {
    singular: 'Storefront',
    plural: 'Storefronts',
  },
  admin: {
    group: 'Content',
    useAsTitle: 'locationName',
    description: 'Manage storefront locations with customizable content structure including hero, showroom information, piano collection, gallery, news, contact form, and SEO.',
  },
  access: {
    read: () => true, // Public read access for frontend
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier for this storefront location (e.g., "st-louis", "chicago")'
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
      name: 'locationName',
      type: 'text',
      required: true,
      admin: {
        description: 'Location name for admin identification (e.g., "St. Louis Showroom", "Chicago Downtown")'
      }
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Controls whether this storefront location is visible on the frontend'
      }
    },
    {
      type: 'tabs',
      tabs: [
        // Hero Section Tab
        {
          label: 'Hero Section',
          description: 'Main hero content with location, established date, title, description, CTAs, and background video',
          fields: [
            {
              name: 'locationText',
              type: 'text',
              required: true,
              defaultValue: 'St. Louis\'s Premier Kawai Piano Gallery',
              admin: {
                description: 'Location/Piano Gallery status text displayed at the top (include "Kawai" for brand visibility)'
              }
            },
            {
              name: 'establishedText',
              type: 'text',
              required: true,
              defaultValue: 'Est. 1927 • Lake St. Louis, Missouri',
              admin: {
                description: 'Established date and location information'
              }
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              defaultValue: 'Every musician harbors a vision. Every performance seeks perfection. Since 1927, we\'ve been crafting the instruments that transform inspiration into reality. Visit our Lake St. Louis showroom and discover why we\'re Missouri\'s trusted Kawai piano experts.',
              admin: {
                description: 'Hero description text displayed below the logo'
              }
            },
            {
              name: 'primaryCta',
              type: 'group',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  defaultValue: 'View Our Piano Collection',
                  admin: {
                    description: 'Primary call-to-action button text'
                  }
                },
                {
                  name: 'link',
                  type: 'text',
                  required: true,
                  defaultValue: '/pianos',
                  admin: {
                    description: 'Primary call-to-action button link/URL'
                  }
                }
              ],
              admin: {
                description: 'Primary call-to-action button configuration'
              }
            },
            {
              name: 'secondaryCta',
              type: 'group',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  defaultValue: 'Visit Our St. Louis Showroom',
                  admin: {
                    description: 'Secondary call-to-action button text'
                  }
                },
                {
                  name: 'link',
                  type: 'text',
                  required: true,
                  defaultValue: '/contact',
                  admin: {
                    description: 'Secondary call-to-action button link/URL'
                  }
                }
              ],
              admin: {
                description: 'Secondary call-to-action button configuration'
              }
            },
            videoField('backgroundVideo', {
              required: false,
              admin: {
                description: 'Background video for the hero section'
              }
            })
          ]
        },

        // Showroom Location Tab
        {
          label: 'Showroom Location',
          description: 'Configure showroom location information, hours, features, and contact details',
          fields: [
            {
              name: 'sectionHeader',
              type: 'text',
              required: true,
              defaultValue: 'Our Showroom',
              admin: {
                description: 'Section header text'
              }
            },
            {
              name: 'showroomTitle',
              type: 'text',
              required: true,
              defaultValue: 'Visit Our Lake St. Louis',
              admin: {
                description: 'Main showroom section title'
              }
            },
            {
              name: 'showroomDescription',
              type: 'textarea',
              required: true,
              defaultValue: 'Experience the artistry of Kawai pianos in Missouri\'s premier Piano Gallery. From intimate consultations to comprehensive piano services, discover why discerning musicians choose our Lake St. Louis showroom.',
              admin: {
                description: 'Showroom section description'
              }
            },
            {
              name: 'showroomInfo',
              type: 'group',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  defaultValue: 'Kawai Piano Gallery St. Louis',
                  admin: {
                    description: 'Business/showroom name'
                  }
                },
                {
                  name: 'address',
                  type: 'textarea',
                  required: true,
                  defaultValue: '21 Meadows Circle Drive, Suite 312, Lake St. Louis, MO 63367',
                  admin: {
                    description: 'Full business address'
                  }
                },
                {
                  name: 'phone',
                  type: 'text',
                  required: true,
                  defaultValue: '636-265-2866',
                  admin: {
                    description: 'Primary phone number'
                  }
                },
                {
                  name: 'serviceArea',
                  type: 'text',
                  required: true,
                  defaultValue: 'Serving St. Louis, St. Charles County, O\'Fallon, Wentzville & surrounding Missouri areas',
                  admin: {
                    description: 'Service area description'
                  }
                }
              ],
              admin: {
                description: 'Basic showroom contact and location information'
              }
            },
            {
              name: 'address',
              type: 'group',
              label: 'Map Address',
              admin: {
                description: '📍 Used for the dealer finder map. Auto-geocodes coordinates when saved. Keep showroomInfo.address for display text on the storefront page.'
              },
              fields: [
                {
                  name: 'street',
                  type: 'text',
                  admin: { description: 'Street address (e.g. "21 Meadows Circle Drive, Suite 312")' }
                },
                {
                  name: 'city',
                  type: 'text',
                  admin: { description: 'City name' }
                },
                {
                  name: 'state',
                  type: 'text',
                  admin: { description: '2-letter state abbreviation (e.g. MO)' }
                },
                {
                  name: 'zipCode',
                  type: 'text',
                  admin: { description: 'ZIP code' }
                },
                {
                  name: 'country',
                  type: 'text',
                  defaultValue: 'USA',
                },
              ]
            },
            {
              name: 'hours',
              type: 'array',
              required: true,
              labels: {
                singular: 'Day',
                plural: 'Hours',
              },
              fields: [
                {
                  name: 'day',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Day of the week (e.g., "Monday", "Tuesday")'
                  }
                },
                {
                  name: 'time',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Hours for this day (e.g., "10:00 AM - 7:00 PM", "Closed")'
                  }
                }
              ],
              defaultValue: [
                { day: 'Monday', time: '10:00 am–7:00 pm' },
                { day: 'Tuesday', time: '10:00 am–7:00 pm' },
                { day: 'Wednesday', time: '10:00 am–7:00 pm' },
                { day: 'Thursday', time: '10:00 am–7:00 pm' },
                { day: 'Friday', time: '10:00 am–7:00 pm' },
                { day: 'Saturday', time: '10:00 am–6:00 pm' },
                { day: 'Sunday', time: '1:00 pm–5:00 pm' }
              ],
              admin: {
                description: 'Showroom operating hours for each day of the week'
              }
            },
            {
              name: 'features',
              type: 'array',
              required: true,
              labels: {
                singular: 'Feature',
                plural: 'Showroom Features',
              },
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  options: [
                    { label: 'Piano', value: 'piano' },
                    { label: 'Music', value: 'music' },
                    { label: 'Award', value: 'award' },
                    { label: 'Users', value: 'users' },
                    { label: 'Clock', value: 'clock' },
                    { label: 'Shield', value: 'shield' },
                    { label: 'Headphones', value: 'headphones' },
                    { label: 'Car', value: 'car' }
                  ],
                  required: true,
                  admin: {
                    description: 'Icon to display for this feature'
                  }
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Feature title (e.g., "Expert Consultation")'
                  }
                },
                {
                  name: 'description',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Feature description'
                  }
                }
              ],
              defaultValue: [
                { icon: 'award', title: 'Expert Piano Consultation', description: 'Personalized guidance from our Piano Gallery specialists' },
                { icon: 'piano', title: 'Complete Piano Services', description: 'Professional tuning, repair, and maintenance by certified piano technicians' },
                { icon: 'shield', title: 'Piano Financing Available', description: 'Flexible payment options to make your perfect piano accessible' }
              ],
              admin: {
                description: 'Key features and services offered at the showroom'
              }
            },
            {
              name: 'mapApiKey',
              type: 'text',
              admin: {
                description: 'Google Maps API key for embedded map (optional)'
              }
            },
            {
              name: 'showroomCtas',
              type: 'group',
              fields: [
                {
                  name: 'directionsText',
                  type: 'text',
                  required: true,
                  defaultValue: 'Get Directions',
                  admin: {
                    description: 'Directions button text'
                  }
                },
                {
                  name: 'directionsLink',
                  type: 'text',
                  required: true,
                  defaultValue: 'https://maps.google.com/?q=Lake+St.+Louis+MO',
                  admin: {
                    description: 'Google Maps directions link'
                  }
                },
                {
                  name: 'scheduleText',
                  type: 'text',
                  required: true,
                  defaultValue: 'Schedule Visit',
                  admin: {
                    description: 'Schedule visit button text'
                  }
                },
                {
                  name: 'scheduleLink',
                  type: 'text',
                  required: true,
                  defaultValue: '/contact/schedule-visit',
                  admin: {
                    description: 'Schedule visit link/URL'
                  }
                }
              ],
              admin: {
                description: 'Call-to-action buttons for the showroom section'
              }
            },
            {
              name: 'trustBanner',
              type: 'array',
              required: false,
              labels: {
                singular: 'Trust Item',
                plural: 'Trust Banner Items',
              },
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Trust banner item text (e.g., "95+ Years Experience", "Certified Kawai Specialists")'
                  }
                }
              ],
              defaultValue: [
                { text: '95+ Years Experience' },
                { text: 'Certified Kawai Specialists' },
                { text: 'Missouri\'s Trusted Dealer' }
              ],
              admin: {
                description: 'Trust/credibility banner items displayed at the bottom of contact section (appears as: Item 1 | Item 2 | Item 3)'
              }
            }
          ]
        },

        // Service Area Tab
        {
          label: 'Service Area',
          description: 'Define geographic coverage area for local SEO and "near me" searches',
          fields: [
            {
              name: 'serviceAreaCoverage',
              type: 'group',
              label: 'Geographic Service Coverage',
              fields: [
                {
                  name: 'primaryCity',
                  type: 'text',
                  label: 'Primary City',
                  required: true,
                  defaultValue: 'St. Louis',
                  admin: {
                    description: 'Main city where storefront is physically located'
                  }
                },
                {
                  name: 'coveredCities',
                  type: 'array',
                  label: 'Additional Cities Served',
                  fields: [
                    {
                      name: 'cityName',
                      type: 'text',
                      required: true,
                      admin: {
                        placeholder: 'Clayton'
                      }
                    },
                    {
                      name: 'driveTime',
                      type: 'text',
                      admin: {
                        description: 'Approximate drive time from this city to showroom',
                        placeholder: '15 minutes'
                      }
                    }
                  ],
                  defaultValue: [
                    { cityName: 'Clayton', driveTime: '15 minutes' },
                    { cityName: 'Chesterfield', driveTime: '25 minutes' },
                    { cityName: 'Webster Groves', driveTime: '20 minutes' }
                  ],
                  admin: {
                    description: 'List major cities within service radius (recommended: ~2 hour drive maximum). Used for local SEO targeting.'
                  }
                },
                {
                  name: 'stateRegion',
                  type: 'text',
                  label: 'State/Region',
                  required: true,
                  defaultValue: 'Missouri & Southern Illinois',
                  admin: {
                    description: 'Broader geographic region served (e.g., "Missouri & Southern Illinois")'
                  }
                },
                {
                  name: 'zipCodes',
                  type: 'textarea',
                  label: 'Zip Codes Served',
                  admin: {
                    description: 'Comma-separated list of primary zip codes in service area',
                    placeholder: '63101, 63102, 63103, 63108, 63110, 63112'
                  }
                }
              ],
              admin: {
                description: 'Service area information enables ranking in multiple cities without physical locations'
              }
            }
          ]
        },

        // News Carousel Tab
        {
          label: 'News Carousel',
          description: 'Configure location-specific news carousel. Leave empty to use main site news automatically.',
          fields: [
            {
              name: 'autoPlayDuration',
              type: 'number',
              required: false,
              admin: {
                description: 'Auto-play duration in milliseconds (leave empty to use main site default)'
              }
            },
            {
              name: 'newsItems',
              type: 'array',
              required: false,
              labels: {
                singular: 'News Item',
                plural: 'News Items',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'News item title'
                  }
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                  admin: {
                    description: 'News item description'
                  }
                },
                imageField('image', {
                  required: false,
                  admin: {
                    description: 'News item image'
                  }
                }),
                {
                  name: 'category',
                  type: 'select',
                  options: [
                    { label: 'News', value: 'news' },
                    { label: 'Events', value: 'events' },
                    { label: 'Promotions', value: 'promotions' },
                    { label: 'New Arrivals', value: 'new-arrivals' },
                    { label: 'Education', value: 'education' }
                  ],
                  required: true,
                  admin: {
                    description: 'News item category'
                  }
                },
                {
                  name: 'link',
                  type: 'text',
                  admin: {
                    description: 'Link to full article or page (optional)'
                  }
                }
              ],
              admin: {
                description: 'News carousel items (leave empty to use main site news)'
              }
            }
          ]
        },

        // Testimonials Tab
        {
          label: 'Customer Testimonials',
          description: 'Location-specific customer reviews and success stories (renders only if populated)',
          fields: [
            {
              name: 'customerTestimonials',
              type: 'array',
              label: 'Customer Testimonials',
              required: false,
              admin: {
                description: 'Add location-specific customer testimonials. This section will only display on the storefront page if at least one testimonial is added. Prioritize local customers for maximum relevance.'
              },
              fields: [
                {
                  name: 'customerName',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: 'John Smith',
                    description: 'Full name of customer (first and last name recommended)'
                  }
                },
                {
                  name: 'customerCity',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: 'St. Louis, MO',
                    description: 'City and state for local relevance (e.g., "Clayton, MO")'
                  }
                },
                {
                  name: 'rating',
                  type: 'number',
                  min: 1,
                  max: 5,
                  required: true,
                  defaultValue: 5,
                  admin: {
                    description: 'Star rating (1-5 stars)',
                    step: 0.5
                  }
                },
                {
                  name: 'testimonialText',
                  type: 'textarea',
                  required: true,
                  admin: {
                    description: 'Customer testimonial text (150-300 words ideal for authenticity and SEO)'
                  }
                },
                {
                  name: 'pianoModel',
                  type: 'text',
                  admin: {
                    placeholder: 'Kawai K-300',
                    description: 'Piano model purchased (adds specificity and credibility)'
                  }
                },
                {
                  name: 'purchaseDate',
                  type: 'date',
                  admin: {
                    description: 'Date of purchase (shows recency)',
                    date: {
                      pickerAppearance: 'monthOnly'
                    }
                  }
                },
                imageField('customerPhoto', {
                  admin: {
                    description: 'Photo of customer with their piano (optional but powerful for trust)'
                  }
                }),
                videoField('videoTestimonial', {
                  admin: {
                    description: 'Video testimonial (converts 10x better than text, optional)'
                  }
                }),
                {
                  name: 'featured',
                  type: 'checkbox',
                  label: 'Feature Prominently',
                  defaultValue: false,
                  admin: {
                    description: 'Display this testimonial first/prominently on the page'
                  }
                }
              ],
              validate: (val) => {
                // Allow empty array - testimonials section won't render if empty
                return true
              }
            }
          ]
        },

        // Contact Form Tab
        {
          label: 'Contact Form',
          description: 'Configure the contact form section including steps, benefits, and form options',
          fields: [
            {
              name: 'contactTitle',
              type: 'text',
              required: true,
              defaultValue: 'Find Your Perfect',
              admin: {
                description: 'Contact form section title (first part)'
              }
            },
            {
              name: 'contactTitleHighlight',
              type: 'text',
              required: true,
              defaultValue: 'Piano',
              admin: {
                description: 'Contact form section title highlight word'
              }
            },
            {
              name: 'contactDescription',
              type: 'textarea',
              required: true,
              defaultValue: 'Get your free Piano Buying Guide and personalized recommendations from our Lake St. Louis Piano Gallery specialists. Serving the St. Louis area for over 95 years.',
              admin: {
                description: 'Contact form section description'
              }
            },
            {
              name: 'stepTitles',
              type: 'array',
              required: true,
              fields: [
                {
                  name: 'step',
                  type: 'text',
                  required: true
                }
              ],
              defaultValue: [
                { step: 'Tell us about your piano journey' },
                { step: 'Help us understand your needs' },
                { step: 'Get your free piano buying guide' }
              ],
              admin: {
                description: 'Step titles for the contact process'
              }
            },
            {
              name: 'trustMessage',
              type: 'text',
              required: true,
              defaultValue: 'Trusted by St. Louis area piano families since 1927 - Your Premier Piano Gallery',
              admin: {
                description: 'Trust/credibility message'
              }
            },
            {
              name: 'benefits',
              type: 'array',
              required: true,
              labels: {
                singular: 'Benefit',
                plural: 'Benefits',
              },
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  options: [
                    { label: 'Shield Check', value: 'shield-check' },
                    { label: 'Clock', value: 'clock' },
                    { label: 'Users', value: 'users' },
                    { label: 'Award', value: 'award' },
                    { label: 'Music', value: 'music' },
                    { label: 'Heart', value: 'heart' }
                  ],
                  required: true,
                  admin: {
                    description: 'Benefit icon'
                  }
                },
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Benefit text'
                  }
                }
              ],
              defaultValue: [
                { icon: 'shield-check', text: 'Free comprehensive Piano Buying Guide (PDF)' },
                { icon: 'users', text: 'Personalized piano recommendations' },
                { icon: 'award', text: 'Exclusive offers and updates' }
              ],
              admin: {
                description: 'Benefits/features of working with your Piano Gallery'
              }
            },
            {
              name: 'formOptions',
              type: 'group',
              fields: [
                {
                  name: 'experienceLevels',
                  type: 'array',
                  required: true,
                  fields: [
                    {
                      name: 'level',
                      type: 'text',
                      required: true
                    }
                  ],
                  defaultValue: [
                    { level: 'Beginner' },
                    { level: 'Intermediate' },
                    { level: 'Advanced' },
                    { level: 'Professional' }
                  ],
                  admin: {
                    description: 'Musical experience level options'
                  }
                },
                {
                  name: 'pianoTypes',
                  type: 'array',
                  required: true,
                  fields: [
                    {
                      name: 'type',
                      type: 'text',
                      required: true
                    }
                  ],
                  defaultValue: [
                    { type: 'Acoustic Grand' },
                    { type: 'Acoustic Upright' },
                    { type: 'Digital Piano' },
                    { type: 'Hybrid Piano' },
                    { type: 'Not Sure' }
                  ],
                  admin: {
                    description: 'Piano type options for the form'
                  }
                },
                {
                  name: 'budgetRanges',
                  type: 'array',
                  required: true,
                  fields: [
                    {
                      name: 'range',
                      type: 'text',
                      required: true
                    }
                  ],
                  defaultValue: [
                    { range: 'Under $5,000' },
                    { range: '$5,000 - $15,000' },
                    { range: '$15,000 - $35,000' },
                    { range: '$35,000 - $75,000' },
                    { range: '$75,000+' }
                  ],
                  admin: {
                    description: 'Budget range options for the form'
                  }
                },
                {
                  name: 'primaryUses',
                  type: 'array',
                  required: true,
                  fields: [
                    {
                      name: 'use',
                      type: 'text',
                      required: true
                    }
                  ],
                  defaultValue: [
                    { use: 'Learning/Practice' },
                    { use: 'Family Entertainment' },
                    { use: 'Teaching' },
                    { use: 'Performance' },
                    { use: 'Recording/Studio' }
                  ],
                  admin: {
                    description: 'Primary use options for the piano'
                  }
                }
              ],
              admin: {
                description: 'Form field options and choices'
              }
            }
          ]
        },

        // Promotions Tab
        {
          label: 'Promotions',
          description: 'Configure promotional popups and lead capture forms for this storefront',
          fields: [
            {
              name: 'signupModal',
              type: 'group',
              label: 'Customer Signup Modal Popup',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Enable Signup Modal Popup',
                  defaultValue: true,
                  admin: {
                    description: 'Show the customer signup modal popup when visitors arrive at this storefront page'
                  }
                },
                {
                  name: 'title',
                  type: 'text',
                  defaultValue: 'Stay Connected',
                  admin: {
                    description: 'Modal headline text',
                    condition: (_data: any, siblingData: any) => siblingData?.enabled === true
                  }
                },
                {
                  name: 'description',
                  type: 'textarea',
                  defaultValue: 'Sign up to receive updates about our piano collection and exclusive offers.',
                  admin: {
                    description: 'Modal subheading/description text',
                    condition: (_data: any, siblingData: any) => siblingData?.enabled === true
                  }
                },
                {
                  name: 'submitButtonText',
                  type: 'text',
                  defaultValue: 'Sign Up',
                  admin: {
                    description: 'Submit button text',
                    condition: (_data: any, siblingData: any) => siblingData?.enabled === true
                  }
                },
                {
                  name: 'showDelay',
                  type: 'number',
                  defaultValue: 1000,
                  min: 0,
                  max: 10000,
                  admin: {
                    description: 'Delay in milliseconds before showing the modal (0 = instant, 1000 = 1 second, 3000 = 3 seconds)',
                    step: 100,
                    condition: (_data: any, siblingData: any) => siblingData?.enabled === true
                  }
                },
                {
                  name: 'successTitle',
                  type: 'text',
                  defaultValue: 'Thank You for Signing Up!',
                  admin: {
                    description: 'Success message headline shown after form submission',
                    condition: (_data: any, siblingData: any) => siblingData?.enabled === true
                  }
                },
                {
                  name: 'successMessage',
                  type: 'textarea',
                  defaultValue: "We'll be in touch soon with updates about our piano collection.",
                  admin: {
                    description: 'Success message description shown after form submission',
                    condition: (_data: any, siblingData: any) => siblingData?.enabled === true
                  }
                },
                {
                  name: 'imageUrl',
                  type: 'text',
                  required: false,
                  admin: {
                    description: 'Optional image URL to display on the left side of the modal (desktop only). Enter a full URL (e.g., https://example.com/image.jpg). Leave empty for centered form layout.',
                    condition: (_data: any, siblingData: any) => siblingData?.enabled === true,
                    placeholder: 'https://example.com/piano-image.jpg'
                  }
                },
                {
                  name: 'customTags',
                  type: 'array',
                  required: false,
                  labels: {
                    singular: 'Tag',
                    plural: 'Tags',
                  },
                  admin: {
                    description: 'Additional Shopify customer tags to apply when someone signs up (e.g., "free-delivery-promo", "2025-campaign"). The storefront slug is always added automatically.',
                    condition: (_data: any, siblingData: any) => siblingData?.enabled === true
                  },
                  fields: [
                    {
                      name: 'tag',
                      type: 'text',
                      required: true,
                      admin: {
                        placeholder: 'free-delivery-promo'
                      }
                    }
                  ]
                }
              ],
              admin: {
                description: 'Configure the customer signup modal popup that appears when visitors land on this storefront page. Customers are automatically tagged with this storefront\'s slug in Shopify.'
              }
            }
          ]
        },

        // Schema & Structured Data Tab
        {
          label: 'Schema & Structured Data',
          description: 'Configure structured data for search engines (MusicStore schema)',
          fields: [
            {
              name: 'schemaData',
              type: 'group',
              label: 'Business Schema Information',
              fields: [
                {
                  name: 'priceRange',
                  type: 'select',
                  label: 'Price Range Indicator',
                  options: [
                    { label: '$ (Budget-friendly)', value: '$' },
                    { label: '$$ (Moderate)', value: '$$' },
                    { label: '$$$ (Premium)', value: '$$$' },
                    { label: '$$$$ (Luxury)', value: '$$$$' }
                  ],
                  defaultValue: '$$$',
                  required: true,
                  admin: {
                    description: 'Indicates relative pricing level for schema.org MusicStore type'
                  }
                },
                {
                  name: 'geoCoordinates',
                  type: 'group',
                  label: 'Geographic Coordinates',
                  fields: [
                    {
                      name: 'latitude',
                      type: 'number',
                      admin: {
                        step: 0.000001,
                        description: 'Auto-filled from the Map Address above. Override only if the geocoded pin is inaccurate.'
                      }
                    },
                    {
                      name: 'longitude',
                      type: 'number',
                      admin: {
                        step: 0.000001,
                        description: 'Auto-filled from the Map Address above. Override only if the geocoded pin is inaccurate.'
                      }
                    }
                  ],
                  admin: {
                    description: '📍 Coordinates are automatically geocoded from the Map Address (Showroom Location tab) whenever street, city, state, or ZIP changes.'
                  }
                },
                {
                  name: 'paymentMethods',
                  type: 'array',
                  label: 'Accepted Payment Methods',
                  required: true,
                  fields: [
                    {
                      name: 'method',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Cash', value: 'Cash' },
                        { label: 'Credit Card', value: 'Credit Card' },
                        { label: 'Debit Card', value: 'Debit Card' },
                        { label: 'Financing', value: 'Financing' },
                        { label: 'Check', value: 'Check' },
                        { label: 'Wire Transfer', value: 'Wire Transfer' },
                        { label: 'Apple Pay', value: 'Apple Pay' },
                        { label: 'Google Pay', value: 'Google Pay' }
                      ]
                    }
                  ],
                  defaultValue: [
                    { method: 'Credit Card' },
                    { method: 'Debit Card' },
                    { method: 'Financing' },
                    { method: 'Cash' }
                  ],
                  admin: {
                    description: 'Payment methods accepted at this location (used in schema markup)'
                  }
                },
                {
                  name: 'foundingDate',
                  type: 'date',
                  label: 'Year Established',
                  admin: {
                    description: 'Date business was founded (e.g., 1985-03-15). Displays as "Est. 1985" and builds trust through longevity.',
                    date: {
                      pickerAppearance: 'dayOnly'
                    }
                  }
                }
              ],
              admin: {
                description: 'Schema.org structured data improves search result appearance and local SEO rankings'
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
                    description: 'Page meta title for search engines (leave empty to auto-generate "KAWAI [City Name]" from storefront name)'
                  }
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  maxLength: 160,
                  admin: {
                    description: 'Page meta description for search engines (max 160 characters, leave empty for auto-generated description)'
                  }
                },
                {
                  name: 'keywords',
                  type: 'text',
                  admin: {
                    description: 'SEO keywords (comma-separated)'
                  }
                },
                {
                  name: 'openGraphTitle',
                  type: 'text',
                  admin: {
                    description: 'Open Graph title for social media sharing'
                  }
                },
                {
                  name: 'openGraphDescription',
                  type: 'textarea',
                  admin: {
                    description: 'Open Graph description for social media sharing'
                  }
                },
                imageField('openGraphImage', {
                  admin: {
                    description: 'Open Graph image for social media sharing'
                  }
                })
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

  hooks: {
    beforeValidate: [geocodeStorefrontAddress],
    afterChange: [
      // ─── Custom Search Index Sync ──────────────────────────────────────────────
      // Bypasses @payloadcms/plugin-search's auto-sync for storefronts because
      // Payload 3.71.1 has a bug in db-mongodb/queries/parseParams.js:68 where
      // querying polymorphic relationship fields with dotted-path notation
      // (doc.value + doc.relationTo simultaneously) throws:
      //   TypeError: Cannot delete property '0' of [object String]
      // We query by storefrontSlug (a scalar custom field) instead.
      async ({ doc, operation, req }) => {
        const { payload } = req
        try {
          const searchData = {
            doc: { relationTo: 'storefronts' as const, value: doc.id },
            title: doc.locationName,
            category: 'storefront',
            tags: ['storefront', 'location', 'showroom'].map(tag => ({ tag })),
            storefrontSlug: doc.slug,
            storefrontLocationName: doc.locationName,
            storefrontLocationText: doc.locationText,
            storefrontEstablishedText: doc.establishedText,
            storefrontAddress: doc.showroomInfo?.address,
            storefrontPhone: doc.showroomInfo?.phone,
            storefrontCity: doc.serviceAreaCoverage?.primaryCity,
            storefrontRegion: doc.serviceAreaCoverage?.stateRegion,
            excerpt: doc.locationText || doc.establishedText || '',
          }

          if (operation === 'create') {
            if (doc.isActive) {
              await payload.create({ collection: 'search', data: { ...searchData, priority: 30 }, depth: 0, req, overrideAccess: true })
            }
          } else {
            // Query by storefrontSlug — avoids the broken polymorphic dotted-path query
            const existing = await payload.find({
              collection: 'search',
              where: { storefrontSlug: { equals: doc.slug } },
              depth: 0,
              limit: 1,
              req,
            })

            const existingDoc = existing.docs[0]

            if (!doc.isActive) {
              // Remove from search index when deactivated
              if (existingDoc) {
                await payload.delete({ collection: 'search', id: existingDoc.id, depth: 0, req, overrideAccess: true })
              }
            } else if (existingDoc) {
              await payload.update({
                collection: 'search',
                id: existingDoc.id,
                data: { ...searchData, priority: (existingDoc as any).priority ?? 30 },
                depth: 0,
                req,
                overrideAccess: true,
              })
            } else {
              await payload.create({ collection: 'search', data: { ...searchData, priority: 30 }, depth: 0, req, overrideAccess: true })
            }
          }
        } catch (error) {
          payload.logger.error(`Failed to sync storefront ${doc.slug} to search index: ${error}`)
        }

        return doc
      },

      // ─── Cache Revalidation ────────────────────────────────────────────────────
      ({ doc, previousDoc, req: { payload, context } }) => {
        // Prevent infinite loops using Payload's standard context flag
        if (context.disableRevalidate) {
          return doc
        }

        // Only revalidate if storefront is active
        if (doc.isActive) {
          const path = `/store/${doc.slug}`
          const tag = `storefront-${doc.slug}`
          payload.logger.info(`Revalidating storefront at path: ${path} (tag: ${tag})`)

          try {
            // Revalidate by tag (clears unstable_cache)
            revalidateTag(tag)

            // Also revalidate paths (clears route cache)
            revalidatePath(path, 'page')
            revalidatePath(`${path}/contact`, 'page')

            payload.logger.info(`Successfully revalidated storefront: ${doc.slug}`)
          } catch (error) {
            payload.logger.error(`Failed to revalidate storefront ${doc.slug}: ${error}`)
          }
        }

        // Revalidate old path if storefront was unpublished
        if (previousDoc?.isActive && !doc.isActive) {
          const oldPath = `/store/${previousDoc.slug}`
          const oldTag = `storefront-${previousDoc.slug}`
          payload.logger.info(`Revalidating old storefront path (unpublished): ${oldPath}`)

          try {
            revalidateTag(oldTag)
            revalidatePath(oldPath, 'page')
            revalidatePath(`${oldPath}/contact`, 'page')
          } catch (error) {
            payload.logger.error(`Failed to revalidate old path ${oldPath}: ${error}`)
          }
        }

        return doc
      },
    ]
  }
}