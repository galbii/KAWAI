import type { CollectionConfig } from 'payload'

export const DealerLocations: CollectionConfig = {
  slug: 'dealer-locations',
  labels: {
    singular: 'Dealer Location',
    plural: 'Dealer Locations',
  },
  admin: {
    group: 'PAGES',
    useAsTitle: 'locationName',
    description: 'Manage dealer locations with customizable content structure including hero, showroom information, piano collection, gallery, news, contact form, and SEO.',
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
        description: 'URL-friendly identifier for this dealer location (e.g., "st-louis", "chicago")'
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
        description: 'Controls whether this dealer location is visible on the frontend'
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
              defaultValue: 'St. Louis\'s Premier Kawai Piano Dealer',
              admin: {
                description: 'Location/dealer status text displayed at the top'
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
              name: 'titlePrefix',
              type: 'text',
              required: true,
              defaultValue: 'The',
              admin: {
                description: 'Title prefix word (e.g., "The")'
              }
            },
            {
              name: 'titleMain',
              type: 'text',
              required: true,
              defaultValue: 'INSTRUMENTAL',
              admin: {
                description: 'Main title word - typically displayed prominently'
              }
            },
            {
              name: 'titleSuffix',
              type: 'text',
              required: true,
              defaultValue: 'to Life',
              admin: {
                description: 'Title suffix words (e.g., "to Life")'
              }
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              defaultValue: 'Every musician harbors a vision. Every performance seeks perfection. Since 1927, we\'ve been crafting the instruments that transform inspiration into reality. Visit our Lake St. Louis showroom and discover why we\'re Missouri\'s trusted Kawai piano experts.',
              admin: {
                description: 'Hero description text displayed below the main title'
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
            {
              name: 'backgroundVideo',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'Background video for the hero section'
              }
            }
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
              defaultValue: 'Experience the artistry of Kawai pianos in Missouri\'s premier showroom. From intimate consultations to comprehensive piano services, discover why discerning musicians choose our Lake St. Louis location.',
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
                { icon: 'award', title: 'Expert Consultation', description: 'Personalized guidance from certified Kawai specialists' },
                { icon: 'piano', title: 'Full Service Center', description: 'Tuning, repair, and maintenance by certified technicians' },
                { icon: 'shield', title: 'Financing Available', description: 'Flexible payment options to make your piano dreams accessible' }
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
            }
          ]
        },

        // Piano Collection Tab
        {
          label: 'Piano Collection',
          description: 'Featured piano collection section with video showcase',
          fields: [
            {
              name: 'collectionSectionHeader',
              type: 'text',
              required: true,
              defaultValue: 'Featured Models',
              admin: {
                description: 'Piano collection section header'
              }
            },
            {
              name: 'collectionTitle',
              type: 'text',
              required: true,
              defaultValue: 'Kawai K-500 &\nGX2 Limited Edition',
              admin: {
                description: 'Featured collection title'
              }
            },
            {
              name: 'collectionDescription',
              type: 'textarea',
              required: true,
              defaultValue: 'Discover the exceptional craftsmanship and innovation that defines our most sought-after instruments',
              admin: {
                description: 'Featured collection description'
              }
            },
            {
              name: 'collectionCta',
              type: 'group',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  defaultValue: 'Explore Collection',
                  admin: {
                    description: 'Collection CTA button text'
                  }
                },
                {
                  name: 'link',
                  type: 'text',
                  required: true,
                  defaultValue: '/pianos',
                  admin: {
                    description: 'Collection CTA button link/URL'
                  }
                }
              ],
              admin: {
                description: 'Call-to-action for the piano collection section'
              }
            },
            {
              name: 'featuredVideo',
              type: 'group',
              fields: [
                {
                  name: 'youtubeId',
                  type: 'text',
                  required: false,
                  defaultValue: '1cmwb6evs2A',
                  admin: {
                    description: 'YouTube video ID for featured video'
                  }
                },
                {
                  name: 'width',
                  type: 'number',
                  defaultValue: 800,
                  admin: {
                    description: 'Video player width'
                  }
                },
                {
                  name: 'height',
                  type: 'number',
                  defaultValue: 500,
                  admin: {
                    description: 'Video player height'
                  }
                }
              ],
              admin: {
                description: 'Featured video configuration for the collection section'
              }
            }
          ]
        },

        // Piano Gallery Tab
        {
          label: 'Piano Gallery',
          description: 'Configure the piano gallery section with different piano categories',
          fields: [
            {
              name: 'galleryTitle',
              type: 'text',
              required: true,
              defaultValue: 'Explore Our Piano Collection',
              admin: {
                description: 'Piano gallery section title'
              }
            },
            {
              name: 'galleryDescription',
              type: 'textarea',
              required: true,
              defaultValue: 'Discover the full range of Kawai pianos, from handcrafted grand pianos to innovative digital and hybrid instruments. Each piano represents our commitment to exceptional craftsmanship and musical excellence.',
              admin: {
                description: 'Piano gallery section description'
              }
            },
            {
              name: 'pianoCategories',
              type: 'array',
              required: true,
              labels: {
                singular: 'Piano Category',
                plural: 'Piano Categories',
              },
              fields: [
                {
                  name: 'model',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Piano model or series name (e.g., "GX-7", "CA99")'
                  }
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Category title (e.g., "Concert Grand Pianos")'
                  }
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                  admin: {
                    description: 'Category description'
                  }
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: false,
                  admin: {
                    description: 'Category representative image'
                  }
                },
                {
                  name: 'href',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Link to category or model page'
                  }
                }
              ],
              defaultValue: [
                {
                  model: 'Grand',
                  title: 'Grand Pianos',
                  description: 'Professional acoustic grand pianos for concert halls, studios, and discerning homes. Experience the ultimate in touch, tone, and musical expression with instruments trusted by professional musicians worldwide.',
                  href: '/pianos/grand'
                },
                {
                  model: 'Digital',
                  title: 'Digital Pianos',
                  description: 'Advanced digital pianos featuring realistic wooden-key actions and premium sound systems. Combining authentic acoustic piano experience with modern technology and convenient features for today\'s musicians.',
                  href: '/pianos/digital'
                },
                {
                  model: 'Upright',
                  title: 'Upright Pianos',
                  description: 'Space-efficient acoustic pianos delivering exceptional touch and tone quality. Perfect for homes, studios, schools, and institutions where space is at a premium but musical excellence cannot be compromised.',
                  href: '/pianos/upright'
                },
                {
                  model: 'Hybrid',
                  title: 'Hybrid Pianos',
                  description: 'Revolutionary instruments combining real grand piano actions with advanced digital sound technology. Experience the authentic touch of acoustic keys with the versatility and innovation of digital sound.',
                  href: '/pianos/hybrid'
                }
              ],
              admin: {
                description: 'Piano categories displayed in the gallery section'
              }
            }
          ]
        },

        // News Carousel Tab
        {
          label: 'News Carousel',
          description: 'Configure the rotating news and updates carousel section',
          fields: [
            {
              name: 'autoPlayDuration',
              type: 'number',
              required: true,
              defaultValue: 7000,
              admin: {
                description: 'Auto-play duration in milliseconds (default: 7000ms = 7 seconds)'
              }
            },
            {
              name: 'newsItems',
              type: 'array',
              required: true,
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
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: false,
                  admin: {
                    description: 'News item image'
                  }
                },
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
              defaultValue: [
                {
                  title: 'Instrumental to Life',
                  description: 'Redefining harmony between tradition and innovation',
                  category: 'news',
                  link: '/about/instrumental-to-life'
                },
                {
                  title: 'Kawai Piano Gallery',
                  description: 'Explore our complete collection of acoustic and digital pianos',
                  category: 'news',
                  link: '/pianos'
                },
                {
                  title: 'Special Financing Offers',
                  description: 'Make your dream piano more accessible with flexible payment options',
                  category: 'promotions',
                  link: '/financing'
                }
              ],
              admin: {
                description: 'News carousel items'
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
              defaultValue: 'Get your free Piano Buying Guide and personalized recommendations from our Lake St. Louis piano experts. Serving the St. Louis area for over 95 years.',
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
              defaultValue: 'Trusted by St. Louis area piano families since 1927',
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
                description: 'Benefits/features of working with your piano store'
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
                  defaultValue: 'Kawai Pianos St. Louis | Premier Piano Dealer Since 1927 | Lake St. Louis',
                  admin: {
                    description: 'Page meta title for search engines'
                  }
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  maxLength: 160,
                  defaultValue: 'St. Louis\'s premier Kawai piano dealer since 1927. Explore acoustic & digital pianos at our Lake St. Louis showroom. Expert consultation & service.',
                  admin: {
                    description: 'Page meta description for search engines (max 160 characters)'
                  }
                },
                {
                  name: 'keywords',
                  type: 'text',
                  defaultValue: 'Kawai pianos, St. Louis piano dealer, Lake St. Louis piano store, acoustic pianos, digital pianos, piano showroom, Missouri piano dealer, piano sales, piano service',
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
                {
                  name: 'openGraphImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Open Graph image for social media sharing'
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
  ]
}