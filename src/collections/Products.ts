import type { CollectionConfig } from 'payload'
import { 
  productAfterChangeHook, 
  productBeforeChangeHook,
  productBeforeDeleteHook 
} from '../lib/hooks/product-generation'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Product',
    plural: 'Products',
  },
  admin: {
    group: 'Products',
    defaultColumns: ['name', 'type', 'category', 'status', 'updatedAt'],
    useAsTitle: 'name',
    description: 'Manage products with dynamic page building capabilities using blocks',
  },
  access: {
    read: () => true, // Public read access for frontend
  },
  fields: [
    // Basic Product Information
    {
      type: 'tabs',
      tabs: [
        // Product Details Tab
        {
          label: 'Product Details',
          description: 'Core product information and settings',
          fields: [
            // Product Type - Piano or Other
            {
              name: 'type',
              type: 'select',
              required: true,
              defaultValue: 'other',
              options: [
                { label: 'Piano', value: 'piano' },
                { label: 'Other Product', value: 'other' }
              ],
              admin: {
                description: 'Product type determines linking behavior and available features',
                position: 'sidebar'
              }
            },
            // PianoModel Relationship - Auto-generates content when linked
            {
              name: 'pianoModel',
              type: 'relationship',
              relationTo: 'piano-models',
              admin: {
                description: 'Link to piano model for automatic data population in blocks. When linked, some product data will auto-sync with the piano model.',
                position: 'sidebar',
                condition: (data) => data.type === 'piano'
              },
              validate: (val: any, { data }: any) => {
                if (data.type === 'piano' && !val) {
                  return 'Piano products must be linked to a piano model'
                }
                if (data.type !== 'piano' && val) {
                  return 'Non-piano products cannot be linked to piano models'
                }
                return true
              }
            },
            // Data Source Mode - Controls how content is managed
            {
              name: 'dataSource',
              type: 'select',
              defaultValue: 'manual',
              options: [
                { label: 'Manual - Full manual control', value: 'manual' },
                { label: 'Piano Model - Auto-sync from piano model', value: 'pianomodel' },
                { label: 'Hybrid - Manual with piano model fallback', value: 'hybrid' }
              ],
              admin: {
                description: 'How this product gets its content: Manual (independent), Piano Model (auto-synced), or Hybrid (manual with fallbacks)',
                position: 'sidebar',
                condition: (data) => data.type === 'piano' && !!data.pianoModel
              }
            },
            {
              name: 'name',
              type: 'text',
              required: true,
              admin: {
                description: 'Product name/title'
              }
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              admin: {
                description: 'URL-friendly version of product name'
              }
            },
            {
              name: 'category',
              type: 'select',
              required: true,
              options: [
                { label: 'Digital Pianos', value: 'digital' },
                { label: 'Grand Pianos', value: 'grand' },
                { label: 'Hybrid Pianos', value: 'hybrid' },
                { label: 'Upright Pianos', value: 'upright' },
                { label: 'Accessories', value: 'accessories' },
                { label: 'Software', value: 'software' }
              ],
              admin: {
                description: 'Product category for organization'
              }
            },
            {
              name: 'status',
              type: 'select',
              defaultValue: 'active',
              options: [
                { label: 'Active', value: 'active' },
                { label: 'Draft', value: 'draft' },
                { label: 'Discontinued', value: 'discontinued' },
                { label: 'Coming Soon', value: 'coming-soon' },
                { label: 'Limited Edition', value: 'limited-edition' }
              ],
              admin: {
                description: 'Product availability status'
              }
            },
            {
              name: 'mainImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Primary product image'
              }
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                description: 'Product display title (can be different from name for SEO)'
              }
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Short product description for listings and meta'
              }
            },
            {
              name: 'price',
              type: 'group',
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
                  ]
                },
                {
                  name: 'amount',
                  type: 'number',
                  admin: {
                    description: 'Regular price (leave empty for "Contact for pricing")'
                  }
                },
                {
                  name: 'saleAmount',
                  type: 'number',
                  admin: {
                    description: 'Sale price (optional)'
                  }
                },
                {
                  name: 'priceText',
                  type: 'text',
                  admin: {
                    description: 'Custom price text (e.g., "Starting from", "Contact for pricing")'
                  }
                },
                {
                  name: 'showPrice',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Display price on product pages'
                  }
                }
              ],
              admin: {
                description: 'Product pricing information'
              }
            },
            {
              name: 'finishes',
              type: 'array',
              labels: {
                singular: 'Finish',
                plural: 'Available Finishes'
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
                }
              ],
              admin: {
                description: 'Available finish options'
              }
            },
            {
              name: 'buyButton',
              type: 'group',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  defaultValue: 'Contact for Details',
                  required: true,
                  admin: {
                    description: 'Buy button text'
                  }
                },
                {
                  name: 'link',
                  type: 'text',
                  admin: {
                    description: 'Buy button link (leave empty to use default contact form)'
                  }
                },
                {
                  name: 'style',
                  type: 'select',
                  defaultValue: 'primary',
                  options: [
                    { label: 'Primary', value: 'primary' },
                    { label: 'Secondary', value: 'secondary' },
                    { label: 'Outline', value: 'outline' }
                  ]
                },
                {
                  name: 'showButton',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Show buy button on product pages'
                  }
                }
              ],
              admin: {
                description: 'Buy button configuration'
              }
            }
          ]
        },

        // Page Content Tab - Blocks
        {
          label: 'Page Content',
          description: 'Build dynamic product pages using content blocks',
          fields: [
            {
              name: 'pageContent',
              type: 'blocks',
              blockReferences: [
                'productShowcase',
                'hero',
                'textContent',
                'imageGallery',
                'featuresList',
                'specifications',
                'callToAction',
                'testimonials'
              ],
              blocks: [], // Required to be empty when using blockReferences
              admin: {
                description: 'Build your product page content using flexible blocks'
              }
            }
          ]
        },

        // Product Data Tab
        {
          label: 'Product Data',
          description: 'Additional product information and metadata',
          fields: [
            {
              name: 'productData',
              type: 'group',
              fields: [
                {
                  name: 'model',
                  type: 'text',
                  admin: {
                    description: 'Product model number'
                  }
                },
                {
                  name: 'brand',
                  type: 'text',
                  defaultValue: 'Kawai',
                  admin: {
                    description: 'Product brand'
                  }
                },
                {
                  name: 'series',
                  type: 'text',
                  admin: {
                    description: 'Product series/collection'
                  }
                },
                {
                  name: 'sku',
                  type: 'text',
                  admin: {
                    description: 'Stock Keeping Unit (SKU)'
                  }
                },
                {
                  name: 'weight',
                  type: 'text',
                  admin: {
                    description: 'Product weight (e.g., "68kg", "150 lbs")'
                  }
                },
                {
                  name: 'dimensions',
                  type: 'group',
                  fields: [
                    {
                      name: 'width',
                      type: 'text',
                      admin: {
                        description: 'Width (e.g., "145cm", "57 inches")'
                      }
                    },
                    {
                      name: 'depth',
                      type: 'text',
                      admin: {
                        description: 'Depth (e.g., "46cm", "18 inches")'
                      }
                    },
                    {
                      name: 'height',
                      type: 'text',
                      admin: {
                        description: 'Height (e.g., "88cm", "35 inches")'
                      }
                    }
                  ]
                },
                {
                  name: 'warranty',
                  type: 'text',
                  admin: {
                    description: 'Warranty information'
                  }
                },
                {
                  name: 'origin',
                  type: 'text',
                  admin: {
                    description: 'Country of manufacture'
                  }
                }
              ],
              admin: {
                description: 'Detailed product specifications and data'
              }
            }
          ]
        },

        // SEO & Meta Tab
        {
          label: 'SEO & Meta',
          description: 'Search engine optimization and metadata',
          fields: [
            {
              name: 'seo',
              type: 'group',
              fields: [
                {
                  name: 'metaTitle',
                  type: 'text',
                  admin: {
                    description: 'Custom meta title (defaults to product title)'
                  }
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  maxLength: 160,
                  admin: {
                    description: 'Meta description for search engines (max 160 characters)'
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
                  name: 'ogImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Open Graph image for social sharing (defaults to main image)'
                  }
                }
              ],
              admin: {
                description: 'SEO and social media optimization'
              }
            }
          ]
        },

        // Settings Tab
        {
          label: 'Settings',
          description: 'Product visibility and advanced settings',
          fields: [
            {
              name: 'visibility',
              type: 'group',
              fields: [
                {
                  name: 'featured',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Feature this product prominently'
                  }
                },
                {
                  name: 'showInCatalog',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Show in product catalog/listings'
                  }
                },
                {
                  name: 'allowReviews',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Allow customer reviews for this product'
                  }
                },
                {
                  name: 'sortOrder',
                  type: 'number',
                  admin: {
                    description: 'Sort order (lower numbers appear first)'
                  }
                }
              ],
              admin: {
                description: 'Product visibility and display settings'
              }
            },
            {
              name: 'inventory',
              type: 'group',
              fields: [
                {
                  name: 'trackStock',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Track inventory for this product'
                  }
                },
                {
                  name: 'stockQuantity',
                  type: 'number',
                  min: 0,
                  admin: {
                    description: 'Current stock quantity',
                    condition: (data, siblingData) => siblingData?.trackStock === true
                  }
                },
                {
                  name: 'lowStockThreshold',
                  type: 'number',
                  min: 0,
                  defaultValue: 5,
                  admin: {
                    description: 'Alert when stock falls below this number',
                    condition: (data, siblingData) => siblingData?.trackStock === true
                  }
                },
                {
                  name: 'inStock',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Product is currently in stock'
                  }
                }
              ],
              admin: {
                description: 'Inventory management settings'
              }
            }
          ]
        }
      ]
    }
  ],

  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        console.log(`🛒 Products inline beforeChange START: operation=${operation}, name="${data.name}"`)
        console.log(`🔍 Context:`, JSON.stringify(req.context))
        console.log(`🔍 Incoming data keys:`, Object.keys(data))
        console.log(`🔍 Current slug value: "${data.slug}"`)
        
        // Only generate slug from name if not provided or if slug is empty
        if (data.name && (!data.slug || data.slug.trim() === '')) {
          console.log(`🔗 Need to generate slug from name: "${data.name}"`)
          const generatedSlug = data.name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '')
          
          // Ensure we have a valid slug
          data.slug = generatedSlug || 'product'
          console.log(`✅ Generated slug from name "${data.name}" -> "${data.slug}"`)
        } else {
          console.log(`⏭️ Slug already provided: "${data.slug}" - no generation needed`)
        }
        
        console.log(`🛒 Products inline beforeChange END: returning data with slug="${data.slug}"`)
        return data
      },
      productBeforeChangeHook
    ],
    afterChange: [productAfterChangeHook],
    beforeDelete: [productBeforeDeleteHook]
  }
}