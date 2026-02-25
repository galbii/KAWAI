import type { CollectionConfig } from 'payload'
import { imageField, videoField } from '@/lib/payload/fields/media'

export const HomePage: CollectionConfig = {
  slug: 'home-page',
  labels: {
    singular: 'Home Page',
    plural: 'Home Page',
  },
  admin: {
    group: 'Pages',
    useAsTitle: 'titleMain',
    description: 'Manage all content for the homepage including hero, showroom location, piano collection, gallery, news, contact form, and SEO.',
    livePreview: {
      url: () => process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  },
  access: {
    read: () => true, // Public read access for frontend
  },
  fields: [
    // Sidebar Fields
    {
      name: 'searchQuickLinks',
      type: 'array',
      labels: {
        singular: 'Quick Link',
        plural: 'Search Quick Links',
      },
      admin: {
        position: 'sidebar',
        description: 'Quick navigation links displayed in the search overlay welcome screen',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'Link text displayed to users',
          },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description: 'Link URL/path (e.g., /pianos, /find-a-dealer)',
          },
        },
      ],
      defaultValue: [
        { label: 'Instrumental to Life', url: '/instrumental-to-life' },
        { label: 'Find a Dealer', url: '/find-a-dealer' },
        { label: 'Register My Piano', url: '/register-my-piano' },
        { label: 'Kawai Exclusive Offers', url: '/explore' },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        // Page Builder Tab (NEW - RECOMMENDED)
        {
          label: '🎨 Page Builder',
          description: '✅ RECOMMENDED: Build your homepage using blocks. Drag and drop to customize layout and content.',
          fields: [
            {
              name: 'content',
              type: 'blocks',
              blockReferences: [
                'marketing-homepage-hero',
                'marketing-showroom',
                'marketing-piano-collection',
                'marketing-piano-gallery',
                'marketing-news-carousel',
                'marketing-contact-form',
                'marketing-storefront-locations',
                'marketing-featured-models',
              ] as any,
              blocks: [], // Required to be empty for compatibility
              admin: {
                description:
                  'Add and arrange blocks to build your homepage. Leave empty to use legacy tab-based content below.',
                initCollapsed: true,
              },
            },
          ],
        },
        // Announcement Bar Tab
        {
          label: 'Announcement Bar',
          description: 'Site-wide scrolling announcement bar displayed above the header',
          fields: [
            {
              name: 'announcementBar',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Enable Announcement Bar',
                  defaultValue: false,
                  admin: {
                    description: 'Toggle to show/hide the announcement bar site-wide'
                  }
                },
                {
                  name: 'messages',
                  type: 'array',
                  required: true,
                  minRows: 1,
                  labels: {
                    singular: 'Message',
                    plural: 'Messages',
                  },
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Message text to display (use • for separators)'
                      }
                    }
                  ],
                  defaultValue: [
                    { text: 'SPECIAL OFFER  •  SAVE UP TO $5,000  •  ' },
                    { text: 'LIMITED TIME ONLY  •  ' },
                    { text: 'VISIT OUR SHOWROOM TODAY  •  ' }
                  ],
                  admin: {
                    description: 'Messages that will scroll continuously. They will be concatenated with the selected divider.',
                    condition: (data) => data.announcementBar?.enabled === true
                  }
                },
                {
                  name: 'divider',
                  type: 'select',
                  required: true,
                  defaultValue: 'bullet',
                  options: [
                    { label: '• Bullet', value: 'bullet' },
                    { label: '| Pipe', value: 'pipe' },
                    { label: '/ Slash', value: 'slash' },
                    { label: '- Dash', value: 'dash' },
                    { label: '★ Star', value: 'star' },
                    { label: '◆ Diamond', value: 'diamond' },
                    { label: 'Spaces Only', value: 'spaces' }
                  ],
                  admin: {
                    description: 'Character used to separate messages',
                    condition: (data) => data.announcementBar?.enabled === true
                  }
                },
                {
                  name: 'link',
                  type: 'text',
                  admin: {
                    description: 'Optional: URL to navigate to when users click the announcement bar (e.g., /rebate, /promotions)',
                    placeholder: '/rebate',
                    condition: (data) => data.announcementBar?.enabled === true
                  }
                },
                {
                  name: 'style',
                  type: 'select',
                  required: true,
                  defaultValue: 'gradient',
                  options: [
                    { label: 'Gradient (Gray)', value: 'gradient' },
                    { label: 'Solid Red', value: 'red' },
                    { label: 'Solid Black', value: 'black' },
                    { label: 'Solid White', value: 'white' },
                    { label: 'Red Gradient', value: 'red-gradient' }
                  ],
                  admin: {
                    description: 'Visual style of the announcement bar',
                    condition: (data) => data.announcementBar?.enabled === true
                  }
                },
                {
                  name: 'size',
                  type: 'select',
                  required: true,
                  defaultValue: 'medium',
                  options: [
                    { label: 'Small', value: 'small' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'Large', value: 'large' }
                  ],
                  admin: {
                    description: 'Text size of the announcement bar',
                    condition: (data) => data.announcementBar?.enabled === true
                  }
                },
                {
                  name: 'speed',
                  type: 'number',
                  required: true,
                  defaultValue: 40,
                  min: 10,
                  max: 100,
                  admin: {
                    description: 'Animation speed in seconds (lower is faster, default: 40)',
                    condition: (data) => data.announcementBar?.enabled === true
                  }
                }
              ],
              admin: {
                description: 'Configure the site-wide announcement bar that appears above the header'
              }
            }
          ]
        },

        // Hero Section Tab
        {
          label: 'Hero Section',
          description: 'Main hero content with location, established date, title, description, CTAs, and background video',
          fields: [
            {
              name: 'locationText',
              type: 'text',
              required: true,
              defaultValue: 'St. Louis\'s Premier Piano Gallery',
              admin: {
                description: 'Location/Piano Gallery status text displayed at the top'
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
              defaultValue: 'Every musician harbors a vision. Every performance seeks perfection. Since 1927, we\'ve been crafting the instruments that transform inspiration into reality. Visit our Lake St. Louis Piano Gallery and discover why we\'re Missouri\'s trusted piano specialists.',
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
                  defaultValue: 'Visit Our St. Louis Piano Gallery',
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
                imageField('image', {
                  required: false,
                  admin: {
                    description: 'Category representative image'
                  }
                }),
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
                },
                {
                  name: 'ctaText',
                  type: 'text',
                  admin: {
                    description: 'Button label (default: "Read Full Story")'
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

        // Register My Piano Tab
        {
          label: 'Register My Piano',
          description: 'Configure the piano registration modal shown in the site navigation',
          fields: [
            {
              name: 'registerMyPiano',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Enable Register My Piano',
                  defaultValue: true,
                  admin: {
                    description: 'Toggle all "Register Your Piano" buttons and sections on or off site-wide',
                  },
                },
                imageField('bannerImage', {
                  required: false,
                  admin: {
                    description: 'Banner image displayed in the registration modal and dropdown (recommended: 1200×400px)',
                  },
                }),
                {
                  name: 'bannerTitle',
                  type: 'text',
                  label: 'Banner Title',
                  admin: {
                    description: 'Title overlaid on the left/centre of the banner image (e.g., "Register Your Piano")',
                  },
                },
                {
                  name: 'bannerDescription',
                  type: 'text',
                  label: 'Banner Description',
                  admin: {
                    description: 'Short description overlaid on the banner image',
                  },
                },
                {
                  name: 'hubspotEmbedUrl',
                  type: 'text',
                  label: 'HubSpot Embed Script URL',
                  admin: {
                    description:
                      'The src URL from the HubSpot <script> tag (e.g., https://js.hsforms.net/forms/embed/21987263.js)',
                    placeholder: 'https://js.hsforms.net/forms/embed/21987263.js',
                  },
                },
                {
                  name: 'hubspotFormId',
                  type: 'text',
                  label: 'HubSpot Form ID',
                  admin: {
                    description:
                      'The data-form-id attribute from the HubSpot embed div (e.g., 2d83f40a-44fe-421e-a4a5-3b4efcd80100)',
                  },
                },
                {
                  name: 'hubspotPortalId',
                  type: 'text',
                  label: 'HubSpot Portal ID',
                  admin: {
                    description:
                      'The data-portal-id attribute from the HubSpot embed div (e.g., 21987263)',
                  },
                },
              ],
            },
          ],
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
                  defaultValue: 'KAWAI | Find a storefront near you',
                  admin: {
                    description: 'Page meta title for search engines'
                  }
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  maxLength: 160,
                  defaultValue: 'Discover premium KAWAI pianos at authorized dealers nationwide. Explore our collection of grand, upright, and digital pianos. Find a KAWAI storefront near you.',
                  admin: {
                    description: 'Page meta description for search engines (max 160 characters)'
                  }
                },
                {
                  name: 'keywords',
                  type: 'text',
                  defaultValue: 'kawai piano, piano dealer, grand piano, digital piano, upright piano, piano store, kawai authorized dealer, piano storefront, piano showroom',
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

  // Make this a singleton collection since there's only one homepage
  endpoints: [
    {
      path: '/singleton',
      method: 'get',
      handler: async (req: any) => {
        try {
          const result = await req.payload.find({
            collection: 'home-page',
            limit: 1,
            depth: 2 // Populate media relationships and their nested relationships
          })
          
          if (result.docs.length > 0) {
            return Response.json(result.docs[0])
          } else {
            return Response.json({ error: 'Home page not found' }, { status: 404 })
          }
        } catch (error) {
          return Response.json({ error: 'Internal server error' }, { status: 500 })
        }
      }
    }
  ]
}