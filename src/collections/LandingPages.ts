import type { CollectionConfig } from 'payload'
import {
  Hero,
  ProductShowcase,
  ProductHero,
  TextContent,
  ImageGallery,
  FeaturesList,
  Specifications,
  CallToAction,
  Testimonials
} from '../blocks'

export const LandingPages: CollectionConfig = {
  slug: 'landing-pages',
  labels: {
    singular: 'Landing Page',
    plural: 'Landing Pages',
  },
  admin: {
    group: 'CAMPAIGNS',
    useAsTitle: 'title',
    description: 'Manage campaign landing pages with flexible content blocks and dealer location associations.',
    defaultColumns: ['title', 'slug', 'dealerLocation', 'status', 'updatedAt'],
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
        description: 'URL-friendly identifier for this campaign (e.g., "summer-sale", "student-special")'
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
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Landing page title for admin identification (e.g., "Summer Piano Sale 2024")'
      }
    },
    {
      name: 'dealerLocation',
      type: 'relationship',
      relationTo: 'dealer-locations',
      required: true,
      admin: {
        description: 'Associated dealer location for this campaign landing page'
      }
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Draft', value: 'draft' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Expired', value: 'expired' },
        { label: 'Paused', value: 'paused' }
      ],
      admin: {
        description: 'Campaign status - controls visibility and access',
        position: 'sidebar'
      },
      index: true // Add database index for efficient querying
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Legacy field - use Status field instead',
        condition: () => false, // Hide this field as it's deprecated
        position: 'sidebar'
      }
    },
    {
      name: 'campaignStartDate',
      type: 'date',
      admin: {
        description: 'Campaign start date (optional, for scheduling)'
      }
    },
    {
      name: 'campaignEndDate',
      type: 'date',
      admin: {
        description: 'Campaign end date (optional, for scheduling)'
      }
    },
    {
      type: 'tabs',
      tabs: [
        // Page Content Tab - Dynamic Blocks
        {
          label: 'Page Content',
          description: 'Build your landing page using flexible content blocks',
          fields: [
            {
              name: 'pageContent',
              type: 'blocks',
              blocks: [
                Hero,
                ProductShowcase,
                ProductHero,
                TextContent,
                ImageGallery,
                FeaturesList,
                Specifications,
                CallToAction,
                Testimonials
              ],
              admin: {
                description: 'Build your landing page content using flexible blocks'
              }
            }
          ]
        },

        // Campaign Details Tab
        {
          label: 'Campaign Details',
          description: 'Configure campaign-specific information',
          fields: [
            {
              name: 'campaignType',
              type: 'select',
              options: [
                { label: 'Promotional Sale', value: 'promotional-sale' },
                { label: 'Seasonal Campaign', value: 'seasonal-campaign' },
                { label: 'Product Launch', value: 'product-launch' },
                { label: 'Event Landing Page', value: 'event-landing' },
                { label: 'Educational Campaign', value: 'educational-campaign' },
                { label: 'Customer Acquisition', value: 'customer-acquisition' },
                { label: 'Dealer Specific', value: 'dealer-specific' }
              ],
              required: true,
              defaultValue: 'promotional-sale',
              admin: {
                description: 'Type of campaign for this landing page'
              }
            },
            {
              name: 'campaignDescription',
              type: 'textarea',
              admin: {
                description: 'Internal description of the campaign purpose and goals'
              }
            },
            {
              name: 'targetAudience',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Beginners', value: 'beginners' },
                { label: 'Students', value: 'students' },
                { label: 'Parents', value: 'parents' },
                { label: 'Professional Musicians', value: 'professionals' },
                { label: 'Teachers', value: 'teachers' },
                { label: 'Institutions', value: 'institutions' },
                { label: 'Existing Customers', value: 'existing-customers' },
                { label: 'General Public', value: 'general-public' }
              ],
              admin: {
                description: 'Target audience(s) for this campaign'
              }
            },
            {
              name: 'utmParameters',
              type: 'group',
              fields: [
                {
                  name: 'source',
                  type: 'text',
                  admin: {
                    description: 'UTM Source (e.g., google, facebook, email)'
                  }
                },
                {
                  name: 'medium',
                  type: 'text',
                  admin: {
                    description: 'UTM Medium (e.g., cpc, social, email)'
                  }
                },
                {
                  name: 'campaign',
                  type: 'text',
                  admin: {
                    description: 'UTM Campaign name (e.g., summer-sale-2024)'
                  }
                },
                {
                  name: 'content',
                  type: 'text',
                  admin: {
                    description: 'UTM Content (optional, for A/B testing)'
                  }
                },
                {
                  name: 'term',
                  type: 'text',
                  admin: {
                    description: 'UTM Term (optional, for paid search keywords)'
                  }
                }
              ],
              admin: {
                description: 'UTM tracking parameters for campaign analytics'
              }
            }
          ]
        },

        // Conversion Tracking Tab
        {
          label: 'Conversion Tracking',
          description: 'Configure conversion goals and tracking',
          fields: [
            {
              name: 'conversionGoals',
              type: 'array',
              labels: {
                singular: 'Conversion Goal',
                plural: 'Conversion Goals',
              },
              fields: [
                {
                  name: 'goalType',
                  type: 'select',
                  options: [
                    { label: 'Form Submission', value: 'form-submission' },
                    { label: 'Phone Call', value: 'phone-call' },
                    { label: 'Showroom Visit Scheduled', value: 'showroom-visit' },
                    { label: 'Brochure Download', value: 'brochure-download' },
                    { label: 'Newsletter Signup', value: 'newsletter-signup' },
                    { label: 'Product Page Visit', value: 'product-page-visit' },
                    { label: 'Video Engagement', value: 'video-engagement' },
                    { label: 'Custom Event', value: 'custom-event' }
                  ],
                  required: true,
                  admin: {
                    description: 'Type of conversion goal to track'
                  }
                },
                {
                  name: 'goalName',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Name for this conversion goal'
                  }
                },
                {
                  name: 'goalValue',
                  type: 'number',
                  admin: {
                    description: 'Monetary value of this conversion (optional)'
                  }
                },
                {
                  name: 'trackingCode',
                  type: 'textarea',
                  admin: {
                    description: 'Custom tracking code or pixel (optional)'
                  }
                }
              ],
              admin: {
                description: 'Define conversion goals and tracking for this campaign'
              }
            },
            {
              name: 'analyticsIntegrations',
              type: 'group',
              fields: [
                {
                  name: 'googleAnalyticsEnabled',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Enable Google Analytics tracking'
                  }
                },
                {
                  name: 'facebookPixelEnabled',
                  type: 'checkbox',
                  admin: {
                    description: 'Enable Facebook Pixel tracking'
                  }
                },
                {
                  name: 'postHogEnabled',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Enable PostHog analytics tracking'
                  }
                },
                {
                  name: 'customTrackingCode',
                  type: 'textarea',
                  admin: {
                    description: 'Custom tracking code to inject in the page head'
                  }
                }
              ],
              admin: {
                description: 'Configure analytics integrations for this landing page'
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
                    description: 'Page meta title for search engines (will inherit from dealer location if not set)'
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
                    description: 'SEO keywords (comma-separated, will combine with dealer location keywords)'
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
                },
                {
                  name: 'noIndex',
                  type: 'checkbox',
                  admin: {
                    description: 'Prevent search engines from indexing this page (useful for short-term campaigns)'
                  }
                }
              ],
              admin: {
                description: 'SEO and metadata configuration specific to this landing page'
              }
            }
          ]
        },

        // Settings Tab
        {
          label: 'Settings',
          description: 'Additional landing page settings and options',
          fields: [
            {
              name: 'redirectAfterExpiry',
              type: 'text',
              admin: {
                description: 'URL to redirect to if campaign has expired (optional)'
              }
            },
            {
              name: 'passwordProtected',
              type: 'checkbox',
              admin: {
                description: 'Require password to access this landing page'
              }
            },
            {
              name: 'password',
              type: 'text',
              admin: {
                condition: (data) => data.passwordProtected,
                description: 'Password required to access this landing page'
              }
            },
            {
              name: 'customCSS',
              type: 'textarea',
              admin: {
                description: 'Custom CSS styles specific to this landing page'
              }
            },
            {
              name: 'customJavaScript',
              type: 'textarea',
              admin: {
                description: 'Custom JavaScript code to inject into this landing page'
              }
            },
            {
              name: 'notes',
              type: 'textarea',
              admin: {
                description: 'Internal notes about this landing page campaign'
              }
            }
          ]
        }
      ]
    }
  ]
}