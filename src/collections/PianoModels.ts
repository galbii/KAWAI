import type { CollectionConfig } from 'payload'

export const PianoModels: CollectionConfig = {
  slug: 'piano-models',
  labels: {
    singular: 'Piano Model',
    plural: 'Piano Models',
  },
  admin: {
    group: 'Products',
    defaultColumns: ['name', 'model', 'productline', 'featured', 'updatedAt'],
    useAsTitle: 'name',
  },
  access: {
    read: () => true, // Public read access for frontend
  },
  fields: [
    // Basic Information
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { 
        description: 'Piano model name (e.g., "CA901", "SK-EX")' 
      }
    },
    {
      name: 'model',
      type: 'text',
      required: true,
      admin: { 
        description: 'Model number/identifier' 
      }
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { 
        description: 'URL-friendly version of name' 
      }
    },
    
    // Relationship to Product Line
    {
      name: 'productline',
      type: 'relationship',
      relationTo: 'productlines',
      required: true,
      admin: {
        description: 'The product line/series this model belongs to'
      }
    },
    
    // Content
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: { 
        description: 'Brief model description' 
      }
    },
    {
      name: 'shortDescription',
      type: 'text',
      admin: { 
        description: 'Short description for listings' 
      }
    },
    
    // Images
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Main product image'
      }
    },
    {
      name: 'gallery',
      type: 'array',
      required: false,
      minRows: 0,
      labels: {
        singular: 'Image',
        plural: 'Gallery Images',
      },
      admin: {
        description: 'Additional product images'
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true
        },
        {
          name: 'caption',
          type: 'text',
          admin: {
            description: 'Optional caption for the image'
          }
        }
      ]
    },
    
    // Features and Specifications
    {
      name: 'keyFeatures',
      type: 'array',
      required: false,
      minRows: 0,
      labels: {
        singular: 'Key Feature',
        plural: 'Key Features',
      },
      admin: {
        description: 'Main selling points and key features'
      },
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true
        }
      ]
    },
    {
      name: 'specifications',
      type: 'group',
      admin: {
        description: 'Technical specifications'
      },
      fields: [
        {
          name: 'keys',
          type: 'number',
          admin: { description: 'Number of keys' }
        },
        {
          name: 'pedals',
          type: 'number',
          admin: { description: 'Number of pedals' }
        },
        {
          name: 'voices',
          type: 'number',
          admin: { description: 'Number of voices/sounds' }
        },
        {
          name: 'polyphony',
          type: 'number',
          admin: { description: 'Maximum polyphony' }
        },
        {
          name: 'dimensions',
          type: 'group',
          fields: [
            {
              name: 'width',
              type: 'text',
              admin: { description: 'Width (e.g., "145cm")' }
            },
            {
              name: 'depth',
              type: 'text',
              admin: { description: 'Depth (e.g., "46cm")' }
            },
            {
              name: 'height',
              type: 'text',
              admin: { description: 'Height (e.g., "88cm")' }
            }
          ]
        },
        {
          name: 'weight',
          type: 'text',
          admin: { description: 'Weight (e.g., "68kg")' }
        },
        {
          name: 'actionType',
          type: 'text',
          admin: { description: 'Action technology (e.g., "Grand Feel III")' }
        },
        {
          name: 'soundEngine',
          type: 'text',
          admin: { description: 'Sound engine technology' }
        }
      ]
    },
    
    // Pricing
    {
      name: 'pricing',
      type: 'group',
      admin: {
        description: 'Pricing information'
      },
      fields: [
        {
          name: 'msrp',
          type: 'number',
          admin: { description: 'MSRP in USD' }
        },
        {
          name: 'salePrice',
          type: 'number',
          admin: { description: 'Sale price if different from MSRP' }
        },
        {
          name: 'priceRange',
          type: 'text',
          admin: { description: 'Price range text (e.g., "$15,000 - $20,000")' }
        },
        {
          name: 'contactForPricing',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Check if pricing is by contact only' }
        }
      ]
    },
    
    // Reviews and Ratings
    {
      name: 'rating',
      type: 'number',
      min: 0,
      max: 5,
      admin: {
        description: 'Average rating (0-5 stars)',
        step: 0.1
      }
    },
    {
      name: 'reviewCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of reviews'
      }
    },
    
    // Status and Meta
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Discontinued', value: 'discontinued' },
        { label: 'Coming Soon', value: 'coming-soon' },
        { label: 'Limited Edition', value: 'limited-edition' }
      ],
      admin: {
        position: 'sidebar'
      }
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { 
        description: 'Feature this model prominently',
        position: 'sidebar'
      }
    },
    {
      name: 'sortOrder',
      type: 'number',
      admin: { 
        description: 'Display order within series (lower numbers first)',
        position: 'sidebar'
      }
    }
  ],
  
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-generate slug from name if not provided
        if (data.name && !data.slug) {
          data.slug = data.name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
        }
        return data;
      }
    ]
  }
}