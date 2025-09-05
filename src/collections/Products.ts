import type { CollectionConfig } from 'payload'

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
    description: 'Unified product management - pianos, accessories, and other products with dynamic page building',
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
              defaultValue: 'piano',
              options: [
                { label: 'Piano', value: 'piano' },
                { label: 'Accessory', value: 'accessory' },
                { label: 'Software', value: 'software' },
                { label: 'Other Product', value: 'other' }
              ],
              admin: {
                description: 'Product type determines available features and data structure',
                position: 'sidebar'
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
              required: false,
              admin: {
                description: 'Primary product image (optional)'
              }
            },
            {
              name: 'imageUrl',
              type: 'text',
              admin: {
                description: 'Direct image URL (used during CSV migration or when media upload is not available)'
              }
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Product description for listings and meta'
              }
            },
            // CONSOLIDATED: Added shortDescription from PianoModel
            {
              name: 'shortDescription',
              type: 'text',
              admin: {
                description: 'Short description for compact displays and listings'
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
                // CONSOLIDATED: Renamed amount -> msrp, saleAmount -> salePrice to match PianoModel
                {
                  name: 'msrp',
                  type: 'number',
                  admin: {
                    description: 'MSRP (Manufacturer Suggested Retail Price)'
                  }
                },
                {
                  name: 'salePrice',
                  type: 'number',
                  admin: {
                    description: 'Sale price if different from MSRP'
                  }
                },
                // CONSOLIDATED: Added priceRange from PianoModel
                {
                  name: 'priceRange',
                  type: 'text',
                  admin: {
                    description: 'Price range text (e.g., "$15,000 - $20,000")'
                  }
                },
                {
                  name: 'priceText',
                  type: 'text',
                  admin: {
                    description: 'Custom price text (e.g., "Starting from", "Contact for pricing")'
                  }
                },
                // CONSOLIDATED: Added contactForPricing from PianoModel
                {
                  name: 'contactForPricing',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Check if pricing is by contact only'
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
                },
                // CONSOLIDATED: Added description field from PianoModel
                {
                  name: 'description',
                  type: 'textarea',
                  admin: {
                    description: 'Optional finish description'
                  }
                },
                {
                  name: 'imageUrl',
                  type: 'text',
                  admin: {
                    description: 'Direct image URL for this finish (used during CSV migration)'
                  }
                }
              ],
              admin: {
                description: 'Available finish options',
                condition: (data) => data.type === 'piano'
              }
            },
            // CONSOLIDATED: Productline relationship from PianoModel
            {
              name: 'productline',
              type: 'relationship',
              relationTo: 'productlines',
              admin: {
                description: 'The product line/series this product belongs to',
                condition: (data) => data.type === 'piano'
              },
              validate: (val: any, { data }: any) => {
                if (data.type === 'piano' && !val) {
                  return 'Piano products must be linked to a product line'
                }
                if (data.type !== 'piano' && val) {
                  return 'Non-piano products cannot be linked to product lines'
                }
                return true
              }
            },
            // CONSOLIDATED: Series name (from productData, moved to root)
            {
              name: 'series',
              type: 'text',
              admin: {
                description: 'Product series/collection (auto-populated for pianos)',
                readOnly: true
              }
            },
            // CONSOLIDATED: Model identifier (from productData, moved to root)
            {
              name: 'model',
              type: 'text',
              admin: {
                description: 'Product model number/identifier'
              }
            },
            // CONSOLIDATED: Component data (moved to root level)
            {
              name: 'rating',
              type: 'number',
              min: 0,
              max: 5,
              admin: {
                description: 'Customer rating (0-5 stars)',
                condition: (data) => data.type === 'piano'
              }
            },
            {
              name: 'reviews',
              type: 'number',
              min: 0,
              admin: {
                description: 'Number of customer reviews',
                condition: (data) => data.type === 'piano'
              }
            },
            {
              name: 'badge',
              type: 'text',
              admin: {
                description: 'Optional badge text (e.g., "Best Seller", "Featured")',
                condition: (data) => data.type === 'piano'
              }
            },
            {
              name: 'highlight',
              type: 'text',
              admin: {
                description: 'Optional highlight text for special promotions',
                condition: (data) => data.type === 'piano'
              }
            },
            {
              name: 'brand',
              type: 'text',
              defaultValue: 'Kawai',
              admin: {
                description: 'Product brand/manufacturer'
              }
            },
            // CONSOLIDATED: Key features from PianoModel
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
                description: 'Main selling points and key features',
                condition: (data) => data.type === 'piano'
              },
              fields: [
                {
                  name: 'feature',
                  type: 'text',
                  required: true
                }
              ]
            },
            // CONSOLIDATED: Unified specifications (merged pianoSpecs + productData)
            {
              name: 'specifications',
              type: 'group',
              admin: {
                description: 'Complete product specifications and technical details',
                condition: (data) => data.type === 'piano'
              },
              fields: [
                // Piano Technical Specs
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
                  name: 'actionType',
                  type: 'text',
                  admin: { description: 'Action technology (e.g., "Grand Feel III")' }
                },
                {
                  name: 'soundEngine',
                  type: 'text',
                  admin: { description: 'Sound engine technology' }
                },
                // Physical Specifications
                {
                  name: 'dimensions',
                  type: 'group',
                  fields: [
                    {
                      name: 'width',
                      type: 'text',
                      admin: { description: 'Width (e.g., "145cm", "57 inches")' }
                    },
                    {
                      name: 'depth',
                      type: 'text',
                      admin: { description: 'Depth (e.g., "46cm", "18 inches")' }
                    },
                    {
                      name: 'height',
                      type: 'text',
                      admin: { description: 'Height (e.g., "88cm", "35 inches")' }
                    }
                  ]
                },
                {
                  name: 'weight',
                  type: 'text',
                  admin: { description: 'Product weight (e.g., "68kg", "150 lbs")' }
                },
                // Product Metadata
                {
                  name: 'sku',
                  type: 'text',
                  admin: { description: 'Stock Keeping Unit (SKU)' }
                },
                {
                  name: 'warranty',
                  type: 'text',
                  admin: { description: 'Warranty information' }
                },
                {
                  name: 'origin',
                  type: 'text',
                  admin: { description: 'Country of manufacture' }
                }
              ]
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
            },
            {
              name: 'discontinued',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Mark this product as discontinued',
                position: 'sidebar'
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
                'productHero',
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
        console.log(`🛒 Products beforeChange: operation=${operation}, name="${data.name}"`)
        
        // Auto-generate slug from name if not provided or empty
        if (data.name && (!data.slug || data.slug.trim() === '')) {
          const generatedSlug = data.name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '')
          
          data.slug = generatedSlug || 'product'
          console.log(`🔗 Generated slug from name "${data.name}" -> "${data.slug}"`)
        }
        
        // Auto-populate series name for pianos from productline
        if (data.type === 'piano' && data.productline && typeof data.productline === 'object') {
          if (data.productline.name) {
            data.series = data.productline.name
            console.log(`🎹 Auto-populated series from productline: "${data.productline.name}"`)
          }
        }
        
        // Add default productHero block for new products if pageContent is empty
        if (operation === 'create' && (!data.pageContent || data.pageContent.length === 0)) {
          data.pageContent = [
            {
              blockType: 'productHero',
              layout: {
                imagePosition: 'left',
                backgroundColor: 'pearl',
                showFinishes: true,
                showPrice: true,
                showBuyButton: true
              },
              overrides: {} // Empty overrides - will use product data
            }
          ]
          console.log(`🧩 Added default productHero block to new product`)
        }
        
        console.log(`🛒 Products beforeChange END: returning data with slug="${data.slug}"`)
        return data
      }
    ]
    // NOTE: Removed all product-generation hooks as they're no longer needed
  }
}