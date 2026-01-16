import type { CollectionConfig, CollectionAfterChangeHook } from 'payload'
import { fetchShopifyProduct } from '@/lib/shopify/fetch-product'
import { syncShopifyDataToProduct, shouldSyncProduct } from '@/lib/shopify/sync-to-payload'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Product',
    plural: 'Products',
  },
  admin: {
    group: 'Commerce',
    defaultColumns: ['model', 'name', 'type', 'category', 'status', 'updatedAt'],
    useAsTitle: 'model',
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
          description: 'Core product information synced from Shopify',
          fields: [
            // Product Type
            {
              name: 'type',
              type: 'select',
              defaultValue: 'piano',
              options: [
                { label: 'Piano', value: 'piano' },
                { label: 'Accessory', value: 'accessory' },
                { label: 'Software', value: 'software' }
              ],
              admin: {
                description: 'Product type',
              }
            },
            // Model - Primary Identifier
            {
              name: 'model',
              type: 'text',
              required: true,
              unique: true,
              index: true,
              admin: {
                description: 'Model identifier - matches Shopify custom.model metafield (PRIMARY KEY)',
                placeholder: 'CA99, GX-7, SK-EX'
              }
            },
            {
              name: 'name',
              type: 'text',
              admin: {
                description: 'Product name (synced from Shopify, or auto-generated from model)'
              }
            },
            {
              name: 'slug',
              type: 'text',
              unique: true,
              index: true,
              admin: {
                description: 'URL slug (auto-generated from name or model)'
              }
            },
            {
              name: 'status',
              type: 'select',
              defaultValue: 'draft',
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Active', value: 'active' },
                { label: 'Discontinued', value: 'discontinued' }
              ],
              admin: {
                description: 'Draft products are hidden from frontend'
              }
            },
            {
              name: 'category',
              type: 'select',
              options: [
                { label: 'Digital Piano', value: 'digital' },
                { label: 'Grand Piano', value: 'grand' },
                { label: 'Hybrid Piano', value: 'hybrid' },
                { label: 'Upright Piano', value: 'upright' }
              ],
              admin: {
                description: 'Piano category'
              }
            },
            {
              name: 'description',
              type: 'textarea',
              admin: {
                description: 'Product description (synced from Shopify)'
              }
            },
            {
              name: 'brand',
              type: 'text',
              defaultValue: 'Kawai',
              admin: {
                description: 'Manufacturer (synced from Shopify vendor)'
              }
            },

            // Pricing (simplified)
            {
              name: 'price',
              type: 'group',
              fields: [
                {
                  name: 'msrp',
                  type: 'number',
                  admin: {
                    description: 'MSRP (synced from Shopify)',
                    readOnly: true
                  }
                },
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
                }
              ],
              admin: {
                description: 'Product pricing information'
              }
            },

            // Image URL (from Shopify)
            {
              name: 'imageUrl',
              type: 'text',
              admin: {
                description: 'Product image URL (synced from Shopify)',
                readOnly: true
              }
            },

            // Variations array (Shopify product variants)
            {
              name: 'variations',
              type: 'array',
              maxRows: 20, // Limit to prevent performance issues
              labels: {
                singular: 'Variation',
                plural: 'Product Variations'
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Variation name (synced from Shopify variant title)'
                  }
                },
                {
                  name: 'shopifyVariantId',
                  type: 'text',
                  admin: {
                    description: 'Shopify Variant ID (gid://shopify/ProductVariant/...)',
                    readOnly: true,
                  },
                },
                {
                  name: 'price',
                  type: 'number',
                  admin: {
                    description: 'Variant price (synced from Shopify)',
                    readOnly: true,
                  },
                },
                {
                  name: 'compareAtPrice',
                  type: 'number',
                  admin: {
                    description: 'Compare at price / MSRP (synced from Shopify)',
                    readOnly: true,
                  },
                },
                {
                  name: 'sku',
                  type: 'text',
                  admin: {
                    description: 'Stock Keeping Unit (synced from Shopify)',
                    readOnly: true,
                  },
                },
                {
                  name: 'barcode',
                  type: 'text',
                  admin: {
                    description: 'Product barcode/UPC (synced from Shopify)',
                    readOnly: true,
                  },
                },
                {
                  name: 'available',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Is this variation available for sale? (synced from Shopify)',
                    readOnly: true,
                  }
                },
                {
                  name: 'inventoryQuantity',
                  type: 'number',
                  admin: {
                    description: 'Current inventory quantity (synced from Shopify)',
                    readOnly: true,
                  },
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  maxDepth: 0, // Prevent deep media fetching in variations array
                  admin: {
                    description: 'Variation image (optional manual override)'
                  }
                },
                {
                  name: 'imageUrl',
                  type: 'text',
                  admin: {
                    description: 'Variant image URL (synced from Shopify)',
                    readOnly: true,
                  }
                },
                {
                  name: 'weight',
                  type: 'group',
                  fields: [
                    {
                      name: 'value',
                      type: 'number',
                      admin: {
                        description: 'Weight value',
                      },
                    },
                    {
                      name: 'unit',
                      type: 'select',
                      defaultValue: 'POUNDS',
                      options: [
                        { label: 'Pounds (lb)', value: 'POUNDS' },
                        { label: 'Kilograms (kg)', value: 'KILOGRAMS' },
                      ],
                    },
                  ],
                  admin: {
                    description: 'Variant weight for shipping calculations',
                  },
                },
                {
                  name: 'inventoryPolicy',
                  type: 'select',
                  defaultValue: 'DENY',
                  options: [
                    { label: 'Deny - Stop selling when out of stock', value: 'DENY' },
                    { label: 'Continue - Allow overselling', value: 'CONTINUE' },
                  ],
                  admin: {
                    description: 'What happens when inventory reaches zero',
                  },
                },
                {
                  name: 'options',
                  type: 'json',
                  admin: {
                    description: 'Variant options from Shopify (e.g., [{name: "Color", value: "Black"}])',
                    readOnly: true,
                  },
                },
              ],
              admin: {
                description: 'Product variations from Shopify (variants with pricing, inventory, and options)',
                condition: (data) => data.type === 'piano'
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
                  maxDepth: 0, // Prevent deep media fetching
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
    },
    // Shopify Integration Group - Sidebar
    {
      name: 'shopify',
      type: 'group',
      admin: {
        position: 'sidebar',
        description: 'Shopify synchronization and integration data',
      },
      fields: [
        {
          name: 'productId',
          type: 'text',
          admin: {
            description: 'Shopify Product ID (gid://shopify/Product/...)',
            readOnly: true,
          },
        },
        {
          name: 'handle',
          type: 'text',
          admin: {
            description: 'Shopify handle (auto-synced from slug)',
            readOnly: true,
          },
        },
        {
          name: 'syncStatus',
          type: 'select',
          defaultValue: 'not_synced',
          options: [
            { label: '⚪ Not Synced', value: 'not_synced' },
            { label: '🟢 Synced', value: 'synced' },
            { label: '🔄 Pending', value: 'pending' },
            { label: '🔴 Error', value: 'error' },
          ],
          admin: {
            description: 'Current sync status with Shopify',
            readOnly: true,
          },
        },
        {
          name: 'lastSyncedAt',
          type: 'date',
          admin: {
            description: 'Last successful sync timestamp',
            readOnly: true,
            date: {
              displayFormat: 'MMM d, yyyy h:mm a',
            },
          },
        },
        {
          name: 'syncErrors',
          type: 'array',
          maxRows: 10, // Keep only last 10 errors to prevent unbounded growth
          admin: {
            description: 'Sync error log (last 10 errors)',
            readOnly: true,
          },
          fields: [
            {
              name: 'timestamp',
              type: 'date',
            },
            {
              name: 'operation',
              type: 'select',
              options: [
                { label: 'Create', value: 'create' },
                { label: 'Update', value: 'update' },
                { label: 'Delete', value: 'delete' },
                { label: 'Variant Create', value: 'variant_create' },
                { label: 'Variant Update', value: 'variant_update' },
              ],
            },
            {
              name: 'errorMessage',
              type: 'textarea',
            },
            {
              name: 'errorFields',
              type: 'text',
              admin: {
                description: 'Comma-separated list of fields that errored',
              },
            },
          ],
        },
        {
          name: 'autoSync',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Automatically sync changes to Shopify on save',
          },
        },
        {
          name: 'shopifyStatus',
          type: 'select',
          options: [
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Draft', value: 'DRAFT' },
            { label: 'Archived', value: 'ARCHIVED' },
          ],
          admin: {
            description: 'Shopify product status (synced from Shopify)',
            readOnly: true,
          },
        },
      ],
    }
  ],

  hooks: {
    beforeChange: [
      async ({ data, req, operation, context }) => {
        console.log(`🛒 Products beforeChange: operation=${operation}, model="${data.model}", name="${data.name}"`)

        // Auto-generate name from model if name is not provided
        if (!data.name || data.name.trim() === '') {
          if (data.model) {
            data.name = data.model
            console.log(`📝 Generated name from model: "${data.model}" -> "${data.name}"`)
          }
        }

        // Auto-generate slug from name or model if not provided or empty
        if (!data.slug || data.slug.trim() === '') {
          const sourceForSlug = data.name || data.model || 'product'
          const generatedSlug = sourceForSlug
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '')

          data.slug = generatedSlug || 'product'
          console.log(`🔗 Generated slug from "${sourceForSlug}" -> "${data.slug}"`)
        }

        // Add default productHero block for new products if pageContent is empty
        if (operation === 'create' && (!data.pageContent || data.pageContent.length === 0)) {
          data.pageContent = [
            {
              blockType: 'productHero',
              layout: {
                imagePosition: 'left',
                backgroundColor: 'pearl',
                showVariations: true,
                showPrice: true,
                showBuyButton: true
              },
              overrides: {} // Empty overrides - will use product data
            }
          ]
          console.log(`🧩 Added default productHero block to new product`)
        }

        // Set sync status to pending if auto-sync is enabled and product should sync
        if (!context.skipShopifySync && data.shopify?.autoSync && (data.shopify?.productId || data.model)) {
          if (!data.shopify) {
            data.shopify = {}
          }
          data.shopify.syncStatus = 'pending'
          console.log(`🔄 Set shopify.syncStatus to 'pending' for upcoming sync`)
        }

        console.log(`🛒 Products beforeChange END: returning data with slug="${data.slug}"`)
        return data
      }
    ],
    afterChange: [
      async ({ doc, req, context }) => {
        // Prevent infinite loop - skip if already syncing
        if (context.skipShopifySync) {
          return doc
        }

        // Skip if auto-sync is disabled
        if (!doc.shopify?.autoSync) {
          console.log('[Products Hook] Auto-sync disabled - skipping Shopify sync')
          return doc
        }

        // Check if product should sync with Shopify
        if (!shouldSyncProduct(doc)) {
          console.log('[Products Hook] No Shopify sync needed - no shopify.productId or model field')
          return doc
        }

        console.log(`[Products Hook] Syncing Shopify data for product: ${doc.name}`)

        // Fire-and-forget pattern - don't block save operation
        syncShopifyDataToProduct(doc)
          .then(async (syncedData) => {
            if (!syncedData) {
              console.log(`[Products Hook] No Shopify data to sync for: ${doc.name}`)
              return
            }

            console.log(`[Products Hook] Updating product ${doc.id} with Shopify data`)

            await req.payload.update({
              collection: 'products',
              id: doc.id as string | number,
              data: syncedData as any,
              context: { skipShopifySync: true },
              req,
            })

            console.log(`[Products Hook] Successfully synced Shopify data for: ${doc.name}`)
          })
          .catch((error) => {
            // Log error gracefully - don't throw (don't block saves)
            console.error('[Products Hook] Shopify sync error:', error)

            // Update sync status to error (fire-and-forget)
            const existingErrors = doc.shopify?.syncErrors || []
            const newError = {
              timestamp: new Date().toISOString(),
              operation: 'update' as const,
              errorMessage: error instanceof Error ? error.message : 'Unknown error',
              errorFields: '',
            }

            // Keep only last 9 errors + new error = 10 total (matching maxRows: 10)
            const updatedErrors = [...existingErrors.slice(-9), newError]

            req.payload.update({
              collection: 'products',
              id: doc.id as string | number,
              data: {
                shopify: {
                  syncStatus: 'error',
                  syncErrors: updatedErrors
                }
              } as any, // Type assertion needed until Payload types regenerate
              context: { skipShopifySync: true },
              req,
            }).catch((updateError) => {
              console.error('[Products Hook] Failed to update error status:', updateError)
            })
          })

        return doc
      }
    ]
  }
}