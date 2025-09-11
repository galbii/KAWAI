import type { Block } from 'payload'

export const LandingTestimonials: Block = {
  slug: 'landingTestimonials',
  imageURL: 'https://via.placeholder.com/300x200?text=Landing+Testimonials',
  imageAltText: 'Landing testimonials block for campaign-specific customer reviews and social proof',
  interfaceName: 'LandingTestimonialsBlock',
  fields: [
    {
      name: 'header',
      type: 'group',
      fields: [
        {
          name: 'preTitle',
          type: 'text',
          admin: {
            description: 'Small text above the main title (e.g., "Customer Stories", "Success Stories")'
          }
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'What Our Customers Say',
          admin: {
            description: 'Section title'
          }
        },
        {
          name: 'subtitle',
          type: 'text',
          admin: {
            description: 'Section subtitle'
          }
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Section description about customer satisfaction'
          }
        }
      ],
      admin: {
        description: 'Header content for the testimonials section'
      }
    },
    {
      name: 'testimonials',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 12,
      labels: {
        singular: 'Testimonial',
        plural: 'Customer Testimonials'
      },
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Customer testimonial quote - should be compelling and specific'
          }
        },
        {
          name: 'shortQuote',
          type: 'text',
          admin: {
            description: 'Shortened version for cards (optional - will use first 100 chars if empty)'
          }
        },
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
          defaultValue: 5,
          admin: {
            description: 'Star rating (1-5 stars)',
            step: 0.5
          }
        },
        {
          name: 'customer',
          type: 'group',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              admin: {
                description: 'Customer full name'
              }
            },
            {
              name: 'title',
              type: 'text',
              admin: {
                description: 'Customer title/profession (e.g., "Music Teacher", "Professional Pianist")'
              }
            },
            {
              name: 'company',
              type: 'text',
              admin: {
                description: 'Customer company/organization'
              }
            },
            {
              name: 'location',
              type: 'text',
              admin: {
                description: 'Customer location (e.g., "New York, NY", "London, UK")'
              }
            },
            {
              name: 'avatar',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Customer photo/avatar'
              }
            },
            {
              name: 'initials',
              type: 'text',
              admin: {
                description: 'Customer initials (fallback if no avatar - auto-generated from name if empty)'
              }
            }
          ],
          admin: {
            description: 'Customer information and photo'
          }
        },
        {
          name: 'product',
          type: 'group',
          fields: [
            {
              name: 'name',
              type: 'text',
              admin: {
                description: 'Product name being reviewed (e.g., "Kawai CA99", "Digital Piano")'
              }
            },
            {
              name: 'category',
              type: 'select',
              options: [
                { label: 'Digital Piano', value: 'digital' },
                { label: 'Grand Piano', value: 'grand' },
                { label: 'Upright Piano', value: 'upright' },
                { label: 'Hybrid Piano', value: 'hybrid' },
                { label: 'Service', value: 'service' },
                { label: 'Accessories', value: 'accessories' },
                { label: 'General', value: 'general' }
              ],
              admin: {
                description: 'Product category'
              }
            },
            {
              name: 'purchaseDate',
              type: 'date',
              admin: {
                description: 'When the customer purchased (optional)'
              }
            }
          ],
          admin: {
            description: 'Product being reviewed'
          }
        },
        {
          name: 'verification',
          type: 'group',
          fields: [
            {
              name: 'verified',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Mark as verified purchase'
              }
            },
            {
              name: 'source',
              type: 'select',
              defaultValue: 'direct',
              options: [
                { label: 'Direct Review', value: 'direct' },
                { label: 'Google Reviews', value: 'google' },
                { label: 'Facebook', value: 'facebook' },
                { label: 'Trustpilot', value: 'trustpilot' },
                { label: 'Yelp', value: 'yelp' },
                { label: 'Better Business Bureau', value: 'bbb' },
                { label: 'Amazon', value: 'amazon' },
                { label: 'Music Store Review', value: 'music-store' },
                { label: 'Other', value: 'other' }
              ],
              admin: {
                description: 'Source of the review'
              }
            },
            {
              name: 'reviewDate',
              type: 'date',
              admin: {
                description: 'Date when review was written'
              }
            },
            {
              name: 'sourceUrl',
              type: 'text',
              admin: {
                description: 'URL to original review (if applicable)'
              }
            }
          ],
          admin: {
            description: 'Review verification and source information'
          }
        },
        {
          name: 'display',
          type: 'group',
          fields: [
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Feature this testimonial prominently'
              }
            },
            {
              name: 'campaignSpecific',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Mark as campaign-specific testimonial'
              }
            },
            {
              name: 'showFullQuote',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Always show full quote (override short quote)'
              }
            },
            {
              name: 'priority',
              type: 'number',
              defaultValue: 0,
              admin: {
                description: 'Display priority (higher numbers appear first)'
              }
            }
          ],
          admin: {
            description: 'Display settings for this testimonial'
          }
        }
      ],
      admin: {
        description: 'Customer testimonials and reviews'
      }
    },
    {
      name: 'layout',
      type: 'group',
      fields: [
        {
          name: 'style',
          type: 'select',
          defaultValue: 'cards',
          options: [
            { label: 'Card Layout', value: 'cards' },
            { label: 'Carousel/Slider', value: 'carousel' },
            { label: 'Grid Layout', value: 'grid' },
            { label: 'Masonry Layout', value: 'masonry' },
            { label: 'Featured + Grid', value: 'featured-grid' },
            { label: 'Alternating Layout', value: 'alternating' }
          ],
          admin: {
            description: 'Display style for testimonials'
          }
        },
        {
          name: 'columns',
          type: 'select',
          defaultValue: 'three',
          options: [
            { label: '1 Column', value: 'one' },
            { label: '2 Columns', value: 'two' },
            { label: '3 Columns', value: 'three' },
            { label: '4 Columns', value: 'four' }
          ],
          admin: {
            description: 'Number of columns for grid/card layouts',
            condition: (data, siblingData) => ['cards', 'grid', 'masonry', 'featured-grid'].includes(siblingData?.style)
          }
        },
        {
          name: 'showAvatars',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Display customer avatars/photos'
          }
        },
        {
          name: 'showRatings',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Display star ratings'
          }
        },
        {
          name: 'showCompany',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show customer company/title'
          }
        },
        {
          name: 'showLocation',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show customer location'
          }
        },
        {
          name: 'showSource',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show review source (Google, Facebook, etc.)'
          }
        },
        {
          name: 'showDates',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show review dates'
          }
        },
        {
          name: 'showProduct',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show product being reviewed'
          }
        },
        {
          name: 'backgroundColor',
          type: 'select',
          defaultValue: 'light-gray',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Light Gray', value: 'light-gray' },
            { label: 'Dark Gray', value: 'dark-gray' },
            { label: 'White', value: 'white' },
            { label: 'Brand Light', value: 'brand-light' },
            { label: 'Gradient', value: 'gradient' }
          ],
          admin: {
            description: 'Background color for the testimonials section'
          }
        }
      ],
      admin: {
        description: 'Layout and display options'
      }
    },
    {
      name: 'carouselSettings',
      type: 'group',
      fields: [
        {
          name: 'autoplay',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Auto-advance testimonials'
          }
        },
        {
          name: 'autoplaySpeed',
          type: 'number',
          defaultValue: 8000,
          min: 3000,
          admin: {
            description: 'Autoplay speed in milliseconds (slower for reading)',
            condition: (data, siblingData) => siblingData?.autoplay === true
          }
        },
        {
          name: 'pauseOnHover',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Pause autoplay when hovering',
            condition: (data, siblingData) => siblingData?.autoplay === true
          }
        },
        {
          name: 'showDots',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show navigation dots'
          }
        },
        {
          name: 'showArrows',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show navigation arrows'
          }
        },
        {
          name: 'slidesToShow',
          type: 'select',
          defaultValue: 'three',
          options: [
            { label: '1 Testimonial', value: 'one' },
            { label: '2 Testimonials', value: 'two' },
            { label: '3 Testimonials', value: 'three' }
          ],
          admin: {
            description: 'Number of testimonials to show at once'
          }
        },
        {
          name: 'infinite',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable infinite loop'
          }
        }
      ],
      admin: {
        description: 'Carousel-specific settings',
        condition: (data, siblingData) => siblingData?.layout?.style === 'carousel'
      }
    },
    {
      name: 'socialProof',
      type: 'group',
      fields: [
        {
          name: 'showOverallRating',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show overall rating summary'
          }
        },
        {
          name: 'overallRating',
          type: 'number',
          min: 0,
          max: 5,
          defaultValue: 4.8,
          admin: {
            description: 'Overall rating score',
            step: 0.1,
            condition: (data, siblingData) => siblingData?.showOverallRating === true
          }
        },
        {
          name: 'totalReviews',
          type: 'number',
          defaultValue: 150,
          admin: {
            description: 'Total number of reviews',
            condition: (data, siblingData) => siblingData?.showOverallRating === true
          }
        },
        {
          name: 'ratingText',
          type: 'text',
          defaultValue: 'Excellent',
          admin: {
            description: 'Rating description (e.g., "Excellent", "Outstanding")',
            condition: (data, siblingData) => siblingData?.showOverallRating === true
          }
        },
        {
          name: 'showTrustBadges',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Display trust badges and certifications'
          }
        },
        {
          name: 'trustBadges',
          type: 'array',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              admin: {
                description: 'Badge name (e.g., "Google Reviews", "BBB A+")'
              }
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Badge image'
              }
            },
            {
              name: 'url',
              type: 'text',
              admin: {
                description: 'Link to badge source'
              }
            }
          ],
          admin: {
            description: 'Trust badges and certifications',
            condition: (data, siblingData) => siblingData?.showTrustBadges === true
          }
        }
      ],
      admin: {
        description: 'Overall rating and social proof elements'
      }
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        {
          name: 'showCta',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show call-to-action after testimonials'
          }
        },
        {
          name: 'ctaTitle',
          type: 'text',
          admin: {
            description: 'CTA section title',
            condition: (data, siblingData) => siblingData?.showCta === true
          }
        },
        {
          name: 'ctaDescription',
          type: 'textarea',
          admin: {
            description: 'CTA description',
            condition: (data, siblingData) => siblingData?.showCta === true
          }
        },
        {
          name: 'ctaButtonText',
          type: 'text',
          admin: {
            description: 'CTA button text',
            condition: (data, siblingData) => siblingData?.showCta === true
          }
        },
        {
          name: 'ctaButtonLink',
          type: 'text',
          admin: {
            description: 'CTA button link',
            condition: (data, siblingData) => siblingData?.showCta === true
          }
        },
        {
          name: 'ctaStyle',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Outline', value: 'outline' }
          ],
          admin: {
            description: 'CTA button style',
            condition: (data, siblingData) => siblingData?.showCta === true
          }
        }
      ],
      admin: {
        description: 'Call-to-action section after testimonials'
      }
    }
  ]
}