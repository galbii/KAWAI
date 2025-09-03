import type { CollectionConfig } from 'payload'
import { pianoModelAfterChangeHook, pianoModelBeforeDeleteHook } from '../lib/hooks/product-generation'
// import { 
//   isPublic,
//   canManageInventoryAtSites,
//   isAdminLevel
// } from '../lib/access-control'

export const PianoModels: CollectionConfig = {
  slug: 'piano-models',
  labels: {
    singular: 'Piano Model',
    plural: 'Piano Models',
  },
  admin: {
    group: 'Products',
    defaultColumns: ['name', 'model', 'productline', 'status', 'updatedAt'],
    useAsTitle: 'name',
    description: 'Piano models that can automatically generate product pages with blocks and content'
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
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of piano model name',
        position: 'sidebar'
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
    
    // Available Finishes
    {
      name: 'availableFinishes',
      type: 'array',
      required: false,
      minRows: 0,
      labels: {
        singular: 'Available Finish',
        plural: 'Available Finishes',
      },
      admin: {
        description: 'Available finish options for this piano model'
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Finish name (e.g., "Ebony Polish", "White Satin")'
          }
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Finish sample image'
          }
        },
        {
          name: 'priceModifier',
          type: 'number',
          admin: {
            description: 'Price difference for this finish (+ or -)'
          }
        },
        {
          name: 'available',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Is this finish currently available?'
          }
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Optional finish description'
          }
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
          name: 'currency',
          type: 'select',
          defaultValue: 'USD',
          options: [
            { label: 'USD ($)', value: 'USD' },
            { label: 'EUR (€)', value: 'EUR' },
            { label: 'GBP (£)', value: 'GBP' },
            { label: 'CAD (C$)', value: 'CAD' }
          ],
          admin: { description: 'Price currency' }
        },
        {
          name: 'msrp',
          type: 'number',
          admin: { description: 'MSRP in selected currency' }
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
          name: 'priceText',
          type: 'text',
          admin: { description: 'Custom price text (e.g., "Starting from", "Contact for pricing")' }
        },
        {
          name: 'contactForPricing',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Check if pricing is by contact only' }
        },
        {
          name: 'showPrice',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Display price on product pages' }
        }
      ]
    },

    
    
    // Site Availability - temporarily disabled until Sites collection is re-enabled
    // {
    //   name: 'siteAvailability',
    //   type: 'array',
    //   labels: {
    //     singular: 'Site Availability',
    //     plural: 'Site Availability'
    //   },
    //   admin: {
    //     description: 'Piano availability at different store locations'
    //   },
    //   fields: [
    //     // ... site availability fields
    //   ]
    // },

    // Linked Product
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      hasMany: false,
      admin: {
        description: 'Auto-generated product page for this piano model',
        position: 'sidebar',
        readOnly: true
      }
    },
    
    // Auto-Product Generation Settings
    {
      name: 'autoGenerateProduct',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Automatically create/update a Product page when this piano model is saved',
        position: 'sidebar'
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
        description: 'Status affects auto-generated product visibility',
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
      async ({ data, req, operation }) => {
        console.log(`🎹 PianoModel beforeChange: name="${data.name}", operation=${operation}`)
        
        // Auto-generate slug from name if not provided or empty
        if (data.name && (!data.slug || data.slug.trim() === '')) {
          const generatedSlug = data.name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '')
          
          data.slug = generatedSlug || 'piano-model'
          console.log(`🔗 Generated slug from name "${data.name}" -> "${data.slug}"`)
        }
        
        return data
      }
    ],
    afterChange: [pianoModelAfterChangeHook],
    beforeDelete: [pianoModelBeforeDeleteHook]
  }
}