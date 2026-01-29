import type { CollectionConfig, CollectionAfterChangeHook, Endpoint } from 'payload'
import { fetchShopifyProduct } from '@/lib/shopify/fetch-product'
import { syncShopifyDataToProduct, shouldSyncProduct, mapShopifyProductTypeToPayloadType } from '@/lib/shopify/sync-to-payload'
import { fetchAllShopifyProductsWithModels } from '@/lib/shopify/fetch-all-products'
import type { ShopifyProductData } from '@/lib/shopify/fetch-product'
import { imageField } from '@/lib/payload/fields'

/**
 * Transform Shopify product data to Payload CMS product format
 *
 * Maps Shopify fields to Payload fields for bulk import/update operations.
 */
function transformShopifyToPayload(shopifyProduct: ShopifyProductData): any {
  const model = shopifyProduct.metafields?.model || ''

  // Strip HTML from description
  const stripHtml = (html: string): string => {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim()
  }

  // Determine if we should create variations array
  // Shopify always returns at least 1 variant, even for products with no variations
  // Single-variant products have title "Default Title" - we should skip these
  const firstVariantTitle = shopifyProduct.variants[0]?.title?.trim() || ''
  const isDefaultTitle = firstVariantTitle.toLowerCase() === 'default title'
  const hasMultipleVariants = shopifyProduct.variants.length > 1
  const shouldCreateVariations = hasMultipleVariants || (shopifyProduct.variants.length === 1 && !isDefaultTitle)

  // Map variants to Payload variations format (only if truly multi-variant)
  const variations = shouldCreateVariations
    ? shopifyProduct.variants.map((variant) => ({
        name: variant.title,
        shopifyVariantId: variant.id,
        price: parseFloat(variant.price) || null,
        compareAtPrice: variant.compareAtPrice ? parseFloat(variant.compareAtPrice) : null,
        sku: variant.sku || null,
        barcode: variant.barcode || null,
        available: variant.available,
        inventoryQuantity: variant.inventoryQuantity || 0,
        imageUrl: variant.image?.url || null,
        options: variant.options.map((opt) => ({
          name: opt.name,
          value: opt.value,
        })),
      }))
    : null

  // Map Shopify status to Payload status
  const statusMap: Record<string, 'draft' | 'active' | 'discontinued'> = {
    ACTIVE: 'active',
    DRAFT: 'draft',
    ARCHIVED: 'discontinued',
  }

  // Map Shopify collections to Payload format
  const shopifyCollections = shopifyProduct.collections?.map((collection: any) => ({
    shopifyCollectionId: collection.id,
    title: collection.title,
    handle: collection.handle,
  })) || []

  return {
    model,
    name: shopifyProduct.title,
    slug: shopifyProduct.handle,
    description: stripHtml(shopifyProduct.description || shopifyProduct.descriptionHtml),
    status: statusMap[shopifyProduct.status] || 'draft',
    // Type comes from Shopify productType
    type: shopifyProduct.productType || null,
    // Category comes from Shopify Standard Product Taxonomy (last part only)
    category: (shopifyProduct as any).category?.name || null,
    // Collections from Shopify
    shopifyCollections,
    imageUrl: shopifyProduct.featuredImage?.url || null,
    price: {
      msrp: parseFloat(shopifyProduct.price.min) || null,
      currency: (shopifyProduct.price.currency as 'USD' | 'EUR' | 'GBP' | 'CAD') || 'USD',
    },
    variations, // Already null if no true variations exist
    shopify: {
      productId: shopifyProduct.id,
      handle: shopifyProduct.handle,
      syncStatus: 'synced' as const,
      lastSyncedAt: new Date().toISOString(),
      shopifyStatus: shopifyProduct.status,
      autoSync: true,
      syncErrors: [],
    },
  }
}

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Product',
    plural: 'Products',
  },
  admin: {
    group: 'Commerce',
    defaultColumns: ['model', 'name', 'type', 'status', 'updatedAt'],
    useAsTitle: 'model',
    description: 'Unified product management - pianos, accessories, and other products with dynamic page building',
    components: {
      beforeList: ['/components/admin/BulkShopifySyncButton#default'],
    },
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
            // Product Type (from Shopify productType)
            {
              name: 'type',
              type: 'text',
              admin: {
                description: 'Product type (synced from Shopify productType)',
                readOnly: true,
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
              type: 'text',
              admin: {
                description: 'Product category (synced from Shopify taxonomy, e.g. "Digital Pianos")',
                readOnly: true,
              }
            },
            {
              name: 'description',
              type: 'textarea',
              admin: {
                description: 'Product description (synced from Shopify)'
              }
            },

            // Shopify Collections
            {
              name: 'shopifyCollections',
              type: 'array',
              maxRows: 20,
              admin: {
                description: 'Shopify collections this product belongs to (synced from Shopify)',
                readOnly: true,
              },
              fields: [
                {
                  name: 'shopifyCollectionId',
                  type: 'text',
                  admin: {
                    description: 'Shopify Collection ID',
                    readOnly: true,
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  admin: {
                    description: 'Collection title',
                    readOnly: true,
                  },
                },
                {
                  name: 'handle',
                  type: 'text',
                  admin: {
                    description: 'Collection handle',
                    readOnly: true,
                  },
                },
              ],
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
                imageField('image', {
                  maxDepth: 0, // Prevent deep media fetching in variations array
                  admin: {
                    description: 'Variation image (optional manual override)'
                  }
                }),
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
                // Show variations for all products (they come from Shopify)
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
                'product-showcase',
                'product-hero',
                'marketing-hero',
                'textContent',
                'product-gallery',
                'product-features',
                'product-specs',
                'marketing-cta',
                'marketing-testimonials'
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
                imageField('ogImage', {
                  maxDepth: 0, // Prevent deep media fetching
                  admin: {
                    description: 'Open Graph image for social sharing (defaults to main image)'
                  }
                })
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

  endpoints: [
    {
      path: '/bulk-sync-from-shopify',
      method: 'post',
      handler: async (req) => {
        // Security: Check authentication and admin role
        if (!req.user) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (req.user.role !== 'admin') {
          return Response.json({ error: 'Forbidden - Admin only' }, { status: 403 })
        }

        console.log('[Bulk Sync] Starting bulk sync from Shopify...')

        try {
          // Step 1: Fetch all products with models from Shopify
          console.log('[Bulk Sync] Fetching all products with custom.model metafield from Shopify...')
          const shopifyProducts = await fetchAllShopifyProductsWithModels()

          console.log(`[Bulk Sync] Found ${shopifyProducts.length} products in Shopify with models`)

          if (shopifyProducts.length === 0) {
            return Response.json({
              success: true,
              summary: {
                total: 0,
                created: 0,
                updated: 0,
                skipped: 0,
                errors: 0,
              },
              message: 'No products found in Shopify with custom.model metafield',
            })
          }

          // Step 2: Fetch all existing products from Payload (for fast lookup)
          console.log('[Bulk Sync] Fetching existing products from Payload...')
          const { docs: existingProducts } = await req.payload.find({
            collection: 'products',
            limit: 1000, // Adjust if you have more than 1000 products
          })

          // Build lookup map: model -> product
          const productsByModel = new Map(
            existingProducts.map((p) => [p.model?.toUpperCase().trim(), p])
          )

          console.log(`[Bulk Sync] Found ${existingProducts.length} existing products in Payload`)

          // Step 3: Process each Shopify product (create or update)
          const results = {
            total: shopifyProducts.length,
            created: 0,
            updated: 0,
            skipped: 0,
            errors: 0,
          }

          const errors: Array<{ model: string; error: string }> = []

          for (const shopifyProduct of shopifyProducts) {
            const model = shopifyProduct.metafields?.model

            if (!model) {
              results.skipped++
              continue
            }

            const normalizedModel = model.toUpperCase().trim()

            try {
              // Check if product exists in Payload
              const existing = productsByModel.get(normalizedModel)

              // Transform Shopify data to Payload format
              const productData = transformShopifyToPayload(shopifyProduct)

              if (existing) {
                // UPDATE existing product
                console.log(`[Bulk Sync] Updating existing product: ${model}`)

                await req.payload.update({
                  collection: 'products',
                  id: existing.id,
                  data: productData,
                  context: { skipShopifySync: true }, // Prevent infinite loop
                  req,
                })

                results.updated++
              } else {
                // CREATE new product
                console.log(`[Bulk Sync] Creating new product: ${model}`)

                await req.payload.create({
                  collection: 'products',
                  data: productData,
                  context: { skipShopifySync: true }, // Prevent infinite loop
                  req,
                })

                results.created++
              }
            } catch (error) {
              console.error(`[Bulk Sync] Error syncing product ${model}:`, error)
              results.errors++
              errors.push({
                model,
                error: error instanceof Error ? error.message : 'Unknown error',
              })
            }
          }

          console.log('[Bulk Sync] ✅ Bulk sync completed:', results)

          return Response.json({
            success: true,
            summary: results,
            errors: errors.length > 0 ? errors : undefined,
          })
        } catch (error) {
          console.error('[Bulk Sync] ❌ Bulk sync failed:', error)
          return Response.json(
            {
              success: false,
              message: error instanceof Error ? error.message : 'Bulk sync failed',
            },
            { status: 500 }
          )
        }
      },
    } as Endpoint,
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

        // Add default product-hero block if pageContent is empty (for all operations)
        if (!data.pageContent || data.pageContent.length === 0) {
          data.pageContent = [
            {
              blockType: 'product-hero',
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
          console.log(`🧩 Added default product-hero block (operation: ${operation})`)
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
      async ({ doc, req, context, operation }) => {
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

        // Fire-and-forget pattern using getPayload for background update
        // CRITICAL: Don't use `req` in async callbacks - transaction context will be closed
        // Instead, use getPayload to create a fresh payload instance
        syncShopifyDataToProduct(doc)
          .then(async (syncedData) => {
            if (!syncedData) {
              console.log(`[Products Hook] No Shopify data to sync for: ${doc.name}`)
              return
            }

            console.log(`[Products Hook] Updating product ${doc.id} with Shopify data`)

            // Import getPayload and config dynamically to avoid circular dependencies
            const { getPayload } = await import('payload')
            const config = await import('@payload-config').then(m => m.default)
            const payload = await getPayload({ config })

            // Use fresh payload instance without transaction context
            await payload.update({
              collection: 'products',
              id: doc.id as string | number,
              data: syncedData as any,
              context: { skipShopifySync: true },
              // Note: No `req` - this is a background operation outside the original transaction
            })

            console.log(`[Products Hook] Successfully synced Shopify data for: ${doc.name}`)
          })
          .catch(async (error) => {
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

            try {
              // Import getPayload for error status update
              const { getPayload } = await import('payload')
              const config = await import('@payload-config').then(m => m.default)
              const payload = await getPayload({ config })

              await payload.update({
                collection: 'products',
                id: doc.id as string | number,
                data: {
                  shopify: {
                    syncStatus: 'error',
                    syncErrors: updatedErrors
                  }
                } as any,
                context: { skipShopifySync: true },
              })
            } catch (updateError) {
              console.error('[Products Hook] Failed to update error status:', updateError)
            }
          })

        return doc
      }
    ]
  }
}