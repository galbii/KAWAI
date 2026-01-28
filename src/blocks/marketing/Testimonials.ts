import type { Block } from 'payload'

export const Testimonials: Block = {
  slug: 'marketing-testimonials',
  labels: {
    singular: '⭐ Testimonials',
    plural: 'Testimonial Sections',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Testimonials',
  imageAltText: 'Build trust with customer reviews, ratings, and testimonials',
  interfaceName: 'MarketingTestimonialsBlock',
  fields: [
    {
      name: 'header',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'What Our Customers Say',
          admin: {
            description: 'Section title for the testimonials area'
          }
        },
        {
          name: 'subtitle',
          type: 'text',
          admin: {
            description: 'Optional subtitle to provide context'
          }
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Optional description above testimonials'
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
      labels: {
        singular: 'Testimonial',
        plural: 'Testimonials'
      },
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Customer testimonial/review text - keep it authentic and specific'
          }
        },
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
          admin: {
            description: 'Star rating (1-5 stars, optional)',
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
                description: 'Customer title/position (e.g., "Music Teacher", "Professional Pianist")'
              }
            },
            {
              name: 'company',
              type: 'text',
              admin: {
                description: 'Customer company/organization (optional)'
              }
            },
            {
              name: 'location',
              type: 'text',
              admin: {
                description: 'Customer location (e.g., "New York, NY")'
              }
            },
            {
              name: 'avatar',
              type: 'upload',
              relationTo: 'media',
              maxDepth: 0, // Prevent deep media fetching
              admin: {
                description: 'Customer photo/avatar (builds trust and authenticity)'
              }
            }
          ],
          admin: {
            description: 'Customer information and credentials'
          }
        },
        {
          name: 'product',
          type: 'text',
          admin: {
            description: 'Product being reviewed (e.g., "CA-99 Digital Piano")'
          }
        },
        {
          name: 'verified',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Mark as verified purchase/review for added credibility'
          }
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Feature this testimonial prominently in displays'
          }
        },
        {
          name: 'source',
          type: 'select',
          options: [
            { label: 'Direct Review', value: 'direct' },
            { label: 'Google Reviews', value: 'google' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Trustpilot', value: 'trustpilot' },
            { label: 'Yelp', value: 'yelp' },
            { label: 'Amazon', value: 'amazon' },
            { label: 'Other', value: 'other' }
          ],
          admin: {
            description: 'Source of the review (optional)'
          }
        },
        {
          name: 'reviewDate',
          type: 'date',
          admin: {
            description: 'Date of review (shows recency)'
          }
        }
      ],
      admin: {
        description: 'Customer testimonials and reviews - aim for specific, detailed feedback'
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
            { label: 'List Layout', value: 'list' },
            { label: 'Masonry Layout', value: 'masonry' }
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
            condition: (data, siblingData) => ['cards', 'grid', 'masonry'].includes(siblingData?.style)
          }
        },
        {
          name: 'showAvatars',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Display customer avatars/photos (increases trust)'
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
          name: 'backgroundColor',
          type: 'select',
          defaultValue: 'light-gray',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Light Gray', value: 'light-gray' },
            { label: 'Dark Gray', value: 'dark-gray' },
            { label: 'Brand Color', value: 'brand' },
            { label: 'White', value: 'white' }
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
            description: 'Auto-advance testimonials in carousel'
          }
        },
        {
          name: 'autoplaySpeed',
          type: 'number',
          defaultValue: 6000,
          min: 2000,
          admin: {
            description: 'Autoplay speed in milliseconds (minimum 2000ms)',
            condition: (data, siblingData) => siblingData?.autoplay === true
          }
        },
        {
          name: 'showDots',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show navigation dots at bottom of carousel'
          }
        },
        {
          name: 'showArrows',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show navigation arrows for manual control'
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
            description: 'Number of testimonials to show simultaneously'
          }
        },
        {
          name: 'infinite',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable infinite loop in carousel'
          }
        }
      ],
      admin: {
        description: 'Carousel-specific settings (only applies when style is "Carousel/Slider")',
        condition: (data, siblingData) => siblingData?.layout?.style === 'carousel'
      }
    },
    {
      name: 'aggregateRating',
      type: 'group',
      fields: [
        {
          name: 'showOverallRating',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show overall rating summary at top of section'
          }
        },
        {
          name: 'overallRating',
          type: 'number',
          min: 0,
          max: 5,
          admin: {
            description: 'Overall average rating score',
            step: 0.1,
            condition: (data, siblingData) => siblingData?.showOverallRating === true
          }
        },
        {
          name: 'totalReviews',
          type: 'number',
          admin: {
            description: 'Total number of reviews collected',
            condition: (data, siblingData) => siblingData?.showOverallRating === true
          }
        },
        {
          name: 'ratingText',
          type: 'text',
          admin: {
            description: 'Rating description (e.g., "Excellent", "Based on 150 reviews")',
            condition: (data, siblingData) => siblingData?.showOverallRating === true
          }
        }
      ],
      admin: {
        description: 'Overall rating and review summary'
      }
    }
  ]
}
