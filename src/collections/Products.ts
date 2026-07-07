import type { CollectionConfig, CollectionAfterChangeHook, Endpoint } from 'payload'
import { fetchShopifyProduct } from '@/lib/shopify/fetch-product'
import { syncShopifyDataToProduct, shouldSyncProduct, mapShopifyProductTypeToPayloadType, fetchCAPricing } from '@/lib/shopify/sync-to-payload'
import { fetchAllShopifyProductsWithModels } from '@/lib/shopify/fetch-all-products'
import { fetchActiveAutomaticDiscounts, computeProductDiscount, type NormalizedDiscount } from '@/lib/shopify/fetch-discounts'
import { shopifyAdminClientCA } from '@/lib/shopify/admin-client'
import type { ShopifyProductData } from '@/lib/shopify/fetch-product'
import { imageField, shopifyMediaField, slugBeforeDuplicate } from '@/lib/payload/fields'
import { getProductMedia, transformMediaToPayload, getPrimaryImageUrl } from '@/lib/shopify'

/**
 * Transform Shopify product data to Payload CMS product format
 *
 * Maps Shopify fields to Payload fields for bulk import/update operations.
 */
async function transformShopifyToPayload(
  shopifyProduct: ShopifyProductData,
  discounts: NormalizedDiscount[] = [],
  caDiscounts: NormalizedDiscount[] = [],
): Promise<any> {
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

  // Map Shopify status to Payload status
  const statusMap: Record<string, 'draft' | 'active' | 'discontinued'> = {
    ACTIVE: 'active',
    DRAFT: 'draft',
    ARCHIVED: 'discontinued',
    // UNLISTED = hidden from search/collections but accessible via direct link.
    // Do NOT change the Payload status — editors control that independently.
    UNLISTED: 'active',
  }

  // Map Shopify collections to Payload format
  const shopifyCollections = shopifyProduct.collections?.map((collection: any) => ({
    shopifyCollectionId: collection.id,
    title: collection.title,
    handle: collection.handle,
  })) || []

  // Fetch media and CA pricing in parallel — both non-fatal
  const [mediaResult, caPricing] = await Promise.all([
    getProductMedia(shopifyProduct.id as `gid://shopify/${string}/${string}`)
      .then((media) => {
        const items = transformMediaToPayload(media)
        console.log(`[Sync] Fetched ${items.length} media items for ${shopifyProduct.title}`)
        return items
      })
      .catch((error) => {
        console.error('[Sync] Failed to fetch product media:', error)
        return [] as any[]
      }),
    shopifyProduct.handle
      ? fetchCAPricing(shopifyProduct.handle)
      : Promise.resolve(null),
  ])

  const shopifyMedia = mediaResult
  const primaryFromMedia = getPrimaryImageUrl(shopifyMedia)
  const primaryImageUrl = primaryFromMedia || shopifyProduct.featuredImage?.url || null

  if (caPricing) {
    console.log(`[Bulk Sync] CA pricing for "${shopifyProduct.handle}": price=${caPricing.price} msrp=${caPricing.msrp} variants=${caPricing.byVariantTitle.size}`)
  } else {
    console.warn(`[Bulk Sync] CA pricing unavailable for "${shopifyProduct.handle}"`)
  }

  // Map variants — include CA per-variant prices when available
  const variations = shouldCreateVariations
    ? shopifyProduct.variants.map((variant) => {
        const caVariant = caPricing?.byVariantTitle.get(variant.title.toLowerCase().trim()) ?? null
        return {
          name: variant.title,
          shopifyVariantId: variant.id,
          price: parseFloat(variant.price) || null,
          compareAtPrice: variant.compareAtPrice ? parseFloat(variant.compareAtPrice) : null,
          priceCAD: caVariant?.price ?? null,
          compareAtPriceCAD: caVariant?.compareAtPrice ?? null,
          sku: variant.sku || null,
          barcode: variant.barcode || null,
          available: variant.available,
          inventoryQuantity: variant.inventoryQuantity || 0,
          imageUrl: variant.image?.url || null,
          options: variant.options.map((opt) => ({
            name: opt.name,
            value: opt.value,
          })),
        }
      })
    : null

  // Match any active automatic Shopify discount to this product and precompute the
  // effective price. Always written (even when inactive) so a re-sync clears a stale
  // discount once it expires.
  const shopifyDiscount = computeProductDiscount({
    productGid: shopifyProduct.id,
    collectionGids: shopifyProduct.collections?.map((c) => c.id) ?? [],
    basePrice: parseFloat(shopifyProduct.price.min) || null,
    currency: shopifyProduct.price.currency,
    discounts,
  })

  // CA discount — matched against CA-store GIDs captured by fetchCAPricing. Only
  // computed when CA pricing responded; left unchanged otherwise (mirrors priceCAD).
  const shopifyDiscountCAD = caPricing
    ? computeProductDiscount({
        productGid: caPricing.productGid,
        collectionGids: caPricing.collectionGids,
        basePrice: caPricing.basePrice,
        currency: caPricing.currency,
        discounts: caDiscounts,
      })
    : null

  // Build the base product data
  const baseData = {
    model,
    name: shopifyProduct.title,
    slug: shopifyProduct.handle,
    description: stripHtml(shopifyProduct.description || shopifyProduct.descriptionHtml),
    status: statusMap[shopifyProduct.status] || 'draft',
    // Type comes from Shopify productType — normalized to canonical value
    type: mapShopifyProductTypeToPayloadType(shopifyProduct.productType || '') || null,
    // Category comes from Shopify Standard Product Taxonomy (last part only)
    category: (shopifyProduct as any).category?.name || null,
    // Collections from Shopify
    shopifyCollections,
    shopifyMedia,
    imageUrl: primaryImageUrl,
    price: {
      msrp: parseFloat(shopifyProduct.price.min) || null,
      currency: (shopifyProduct.price.currency as 'USD' | 'EUR' | 'GBP' | 'CAD') || 'USD',
    },
    // CA pricing — only written when CA store responded; left unchanged otherwise
    ...(caPricing && {
      priceCAD: {
        price: caPricing.price,
        msrp: caPricing.msrp,
      },
    }),
    variations, // Already null if no true variations exist
    shopifyDiscount, // Active automatic discount snapshot (or { active: false })
    // CA discount — only written when CA data was fetched; left unchanged otherwise
    ...(shopifyDiscountCAD && { shopifyDiscountCAD }),
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

  // Conditionally add blueprint if it exists (group fields can't be null)
  const blueprintData = shopifyProduct.metafields?.blueprint
  if (blueprintData?.url) {
    Object.assign(baseData, { blueprint: blueprintData })
  }

  // Add specifications array (empty array is fine, but ensure it's always an array)
  Object.assign(baseData, {
    specifications: shopifyProduct.metafields?.specifications || []
  })

  // Add highlights array (synced from Shopify custom.highlights metaobject)
  Object.assign(baseData, {
    highlights: shopifyProduct.metafields?.highlights || []
  })

  // Add specification JSON (synced from Shopify custom.specification_json metafield)
  if (shopifyProduct.metafields?.specificationJson) {
    Object.assign(baseData, {
      specificationJson: shopifyProduct.metafields.specificationJson
    })
  }

  // Action / Tone / Features list metafields + owner's manual URL.
  // Always written (matches single-product sync semantics in sync-to-payload.ts) —
  // Shopify is the source of truth for these fields. Empty arrays / null clear stale data.
  Object.assign(baseData, {
    action: shopifyProduct.metafields?.action || [],
    tone: shopifyProduct.metafields?.tone || [],
    features: shopifyProduct.metafields?.features || [],
    ownersManualUrl: shopifyProduct.metafields?.ownersManual ?? null,
  })

  return baseData
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
    useAsTitle: 'name',
    description: 'Unified product management - pianos, accessories, and other products with dynamic page building',
    components: {
      beforeList: [
        '/components/admin/ProductsListToolbar#ProductsListToolbar',
      ],
      edit: {
        beforeDocumentControls: [
          '/components/admin/ShopifySyncButton#ShopifySyncButton',
        ],
      },
    },
    livePreview: {
      url: ({ data }) => {
        const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        const slug = (data.slug as string) || 'preview'
        return `${baseURL}/products/${slug}`
      },
    },
    preview: (data) => {
      const slug = (data.slug as string) || ''
      const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      return `${baseURL}/products/${slug}`
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
        // Product Details Tab — editable fields only
        {
          label: 'Product Details',
          description: 'Core editable product information',
          fields: [
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
              name: 'modelLabel',
              type: 'text',
              admin: {
                description: 'Optional display label — overrides the model shown in the product hero, piano browser, and piano page browser. Leave blank to use the model identifier.',
                placeholder: 'e.g. "CA-99" if model is stored as "CA99"',
              },
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
              required: true,
              unique: true,
              index: true,
              hooks: { beforeDuplicate: [slugBeforeDuplicate] },
              admin: {
                description: 'URL slug — auto-generated on creation. Changing after publishing breaks indexed URLs and cached pages.',
              },
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
              name: 'backorder',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'When checked and the product is out of stock, the hero will show "Backorder Now" instead of "Find a Dealer" and replace the out-of-stock notice with "Available for backorder."',
              },
            },
            {
              name: 'disclaimer',
              type: 'text',
              admin: {
                description: 'Optional disclaimer shown below the CTA buttons in the Product Hero (e.g. "Starting MSRP. Prices may vary by dealer.")',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              admin: {
                description: 'Product description (synced from Shopify)'
              }
            },
            // Compatible Piano Products — always visible so editors can configure it on any accessory.
            // Leave blank on piano products; fill in on accessory products.
            {
              name: 'compatibleProducts',
              type: 'relationship',
              relationTo: 'products' as const,
              hasMany: true,
              admin: {
                description: 'Accessory products only: select the piano models this accessory is compatible with. The Accessories block on those piano pages will then display this item.',
              },
              // Picker only shows piano products (not accessories).
              // Covers both normalized values (post-sync) and raw Shopify productType strings.
              filterOptions: {
                or: [
                  { type: { equals: 'digital' } },
                  { type: { equals: 'grand' } },
                  { type: { equals: 'upright' } },
                  { type: { equals: 'hybrid' } },
                  { type: { equals: 'shigeru' } },
                  { type: { like: 'Piano' } },
                ],
              },
            },
            // Accessory sub-type — only relevant for accessory products.
            // Used to power type-based filtering on the /pianos/accessories browse page.
            {
              name: 'accessoryType',
              type: 'select',
              options: [
                { label: 'Bench', value: 'bench' },
                { label: 'Pedal', value: 'pedal' },
                { label: 'Cover', value: 'cover' },
                { label: 'Headphones', value: 'headphones' },
                { label: 'Stand', value: 'stand' },
                { label: 'Lamp', value: 'lamp' },
                { label: 'Other', value: 'other' },
              ],
              admin: {
                description: 'Accessory category — used to filter accessories by type on the browse page.',
                condition: (data) => data?.type === 'accessory',
              },
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
            {
              name: 'priceCAD',
              type: 'group',
              fields: [
                {
                  name: 'price',
                  type: 'number',
                  admin: {
                    description: 'CA current price — synced from CA Shopify (min variant price)',
                    readOnly: true,
                  }
                },
                {
                  name: 'msrp',
                  type: 'number',
                  admin: {
                    description: 'CA MSRP / compare-at price — synced from CA Shopify (min compareAtPrice). Shown as MSRP on ca.kawaius.com.',
                    readOnly: true,
                  }
                },
              ],
              admin: {
                description: 'Canadian pricing (ca.kawaius.com) — synced from CA Shopify on product sync',
              }
            },

            // Custom Media — editor-curated media appended to galleries
            {
              name: 'customMedia',
              type: 'array',
              label: '📸 Custom Media',
              maxRows: 20,
              admin: {
                description: 'Editor-curated images and YouTube videos. Images are appended to the hero gallery; YouTube videos + images appear in the product description carousel (YouTube first, then images, then Shopify media).',
                initCollapsed: true,
                components: {
                  RowLabel: '/components/admin/CustomMediaRowLabel#CustomMediaRowLabel',
                },
              },
              fields: [
                {
                  name: 'mediaType',
                  type: 'select',
                  defaultValue: 'media',
                  options: [
                    { label: '🖼 Image / Media', value: 'media' },
                    { label: '▶ YouTube Video', value: 'youtube' },
                  ],
                  admin: {
                    description: 'Select whether this item is an uploaded image or a YouTube video',
                  },
                },
                imageField('image', {
                  admin: {
                    description: 'Upload or select an image from the media library',
                    condition: (_, siblingData) =>
                      !siblingData?.mediaType || siblingData?.mediaType === 'media',
                  },
                }),
                {
                  name: 'youtubeUrl',
                  type: 'text',
                  admin: {
                    description: 'YouTube video URL (e.g. https://youtube.com/watch?v=...)',
                    placeholder: 'https://youtube.com/watch?v=...',
                    condition: (_, siblingData) => siblingData?.mediaType === 'youtube',
                  },
                },
                {
                  name: 'alt',
                  type: 'text',
                  admin: { description: 'Alt text or caption (optional)' },
                },
              ],
            },

            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Feature this product prominently — floats it to the top of the navigation mega menu and raises its sitemap priority.',
                position: 'sidebar',
              }
            },
          ]
        },

        // Shopify Data Tab — read-only synced fields
        {
          label: 'Shopify Data',
          description: 'Read-only data synced from Shopify. Re-sync from Shopify to update any of these fields.',
          fields: [
            // Product Type (from Shopify productType — normalized)
            {
              name: 'type',
              type: 'text',
              admin: {
                description: 'Product type — normalized from Shopify productType (e.g. "Piano Bench" → accessory). Re-sync from Shopify to update.',
                readOnly: true,
                components: {
                  Cell: '/components/admin/ProductTypeCell#ProductTypeCell',
                },
              },
            },
            {
              name: 'category',
              type: 'text',
              admin: {
                description: 'Product category (synced from Shopify taxonomy, e.g. "Digital Pianos")',
                readOnly: true,
              }
            },

            // Active automatic discount (from Shopify Discounts — synced).
            // Shopify Discounts are a separate resource from price/compareAtPrice and
            // apply only at checkout; this group mirrors any ACTIVE automatic discount
            // that targets this product, one of its collections, or all products, and
            // precomputes the effective price. Populated by the Shopify sync — re-sync
            // (or the scheduled bulk sync) refreshes it as discounts start/expire.
            {
              name: 'shopifyDiscount',
              type: 'group',
              admin: {
                description: 'Active automatic discount from Shopify (synced, read-only). Fields are blank when no automatic discount currently applies.',
                readOnly: true,
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  admin: {
                    description: 'Discount name in Shopify',
                    readOnly: true,
                  },
                },
                {
                  name: 'valueType',
                  type: 'select',
                  options: ['percentage', 'fixed'],
                  admin: {
                    description: 'How to read "value": percentage (fraction 0–1) or fixed (amount off). Used to re-apply the discount per variation.',
                    readOnly: true,
                  },
                },
                {
                  name: 'value',
                  type: 'number',
                  admin: {
                    description: 'Discount value — a fraction for a percentage discount (0.2 = 20%), or an amount for a fixed discount',
                    readOnly: true,
                  },
                },
                {
                  name: 'discountedPrice',
                  type: 'number',
                  admin: {
                    description: 'Effective price after the discount (computed from MSRP / min variant price)',
                    readOnly: true,
                  },
                },
              ],
            },

            // Active automatic discount from the CANADA store (ca.kawaius.com).
            // The CA store has its own discounts targeting CA-store product/collection
            // GIDs, so this is computed separately from the US shopifyDiscount above.
            {
              name: 'shopifyDiscountCAD',
              type: 'group',
              admin: {
                description: 'Active automatic discount from the CA Shopify store (synced, read-only). Applies to ca.kawaius.com. Fields are blank when no CA automatic discount currently applies.',
                readOnly: true,
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  admin: {
                    description: 'Discount name in the CA Shopify store',
                    readOnly: true,
                  },
                },
                {
                  name: 'valueType',
                  type: 'select',
                  options: ['percentage', 'fixed'],
                  admin: {
                    description: 'How to read "value": percentage (fraction 0–1) or fixed (amount off). Used to re-apply the discount per variation.',
                    readOnly: true,
                  },
                },
                {
                  name: 'value',
                  type: 'number',
                  admin: {
                    description: 'Discount value — a fraction for a percentage discount (0.2 = 20%), or an amount for a fixed discount',
                    readOnly: true,
                  },
                },
                {
                  name: 'discountedPrice',
                  type: 'number',
                  admin: {
                    description: 'Effective CA price after the discount (computed from CA min variant price)',
                    readOnly: true,
                  },
                },
              ],
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

            // Shopify Collections
            {
              name: 'shopifyCollections',
              type: 'array',
              maxRows: 20,
              admin: {
                description: 'Shopify collections this product belongs to (synced from Shopify)',
                readOnly: true,
                initCollapsed: true,
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
                {
                  name: 'imageUrl',
                  type: 'text',
                  admin: {
                    description: 'Collection image URL (synced from Shopify)',
                    readOnly: true,
                  },
                },
              ],
            },

            // Shopify Media Array
            shopifyMediaField(),

            // Blueprint - Custom metafield from Shopify
            {
              name: 'blueprint',
              type: 'group',
              admin: {
                description: 'Product blueprint image (synced from Shopify custom.blueprint metafield). Only populated if the product has a blueprint uploaded in Shopify.',
                condition: (data) => Boolean(data?.blueprint?.url), // Only show if blueprint exists
              },
              fields: [
                {
                  name: 'url',
                  type: 'text',
                  required: false, // Make optional
                  admin: {
                    description: 'Blueprint image URL',
                    readOnly: true,
                  },
                },
                {
                  name: 'alt',
                  type: 'text',
                  required: false, // Make optional
                  admin: {
                    description: 'Alt text for blueprint image',
                    readOnly: true,
                  },
                },
                {
                  name: 'width',
                  type: 'number',
                  required: false, // Make optional
                  admin: {
                    description: 'Image width',
                    readOnly: true,
                  },
                },
                {
                  name: 'height',
                  type: 'number',
                  required: false, // Make optional
                  admin: {
                    description: 'Image height',
                    readOnly: true,
                  },
                },
              ],
            },

            // Specifications - Custom metaobject list from Shopify
            {
              name: 'specifications',
              type: 'array',
              maxRows: 50,
              labels: {
                singular: 'Specification',
                plural: 'Product Specifications',
              },
              admin: {
                description: 'Product specifications (synced from Shopify custom.specifications metaobject)',
                readOnly: true,
                initCollapsed: true,
                components: {
                  RowLabel: '/components/admin/SpecificationRowLabel#SpecificationRowLabel',
                },
              },
              fields: [
                {
                  name: 'id',
                  type: 'text',
                  admin: {
                    description: 'Shopify Metaobject ID',
                    readOnly: true,
                  },
                },
                {
                  name: 'spec',
                  type: 'text',
                  admin: {
                    description: 'Specification name',
                    readOnly: true,
                  },
                },
                {
                  name: 'type',
                  type: 'textarea',
                  admin: {
                    description: 'Specification type',
                    readOnly: true,
                  },
                },
                {
                  name: 'details',
                  type: 'textarea',
                  admin: {
                    description: 'Specification details',
                    readOnly: true,
                  },
                },
              ],
            },

            // Owner's Manual - custom.ownermanual metafield from Shopify
            {
              name: 'ownersManualUrl',
              type: 'text',
              admin: {
                description: "Owner's manual PDF URL (synced from Shopify custom.ownermanual metafield)",
                readOnly: true,
              },
            },

            // Action / Tone / Features — list.single_line_text_field metafields from Shopify
            {
              type: 'collapsible',
              label: 'Action',
              admin: {
                initCollapsed: true,
                description: 'Playing action descriptors (synced from Shopify custom.action metafield)',
              },
              fields: [
                {
                  name: 'action',
                  type: 'json',
                  admin: { readOnly: true },
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Tone',
              admin: {
                initCollapsed: true,
                description: 'Tone descriptors (synced from Shopify custom.tone metafield)',
              },
              fields: [
                {
                  name: 'tone',
                  type: 'json',
                  admin: { readOnly: true },
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Features',
              admin: {
                initCollapsed: true,
                description: 'Feature list (synced from Shopify custom.features metafield)',
              },
              fields: [
                {
                  name: 'features',
                  type: 'json',
                  admin: { readOnly: true },
                },
              ],
            },

            // Specification JSON - custom.specification-json metafield from Shopify
            {
              type: 'collapsible',
              label: 'Specification JSON',
              admin: {
                initCollapsed: true,
                description: 'Full specification sheet as JSON (synced from Shopify custom.specification-json metafield). Used by the Technical Specifications block with "JSON" data source.',
              },
              fields: [
                {
                  name: 'specificationJson',
                  type: 'json',
                  admin: {
                    readOnly: true,
                  },
                },
              ],
            },

            // Highlights - Custom metaobject list from Shopify
            {
              name: 'highlights',
              type: 'array',
              maxRows: 20,
              labels: {
                singular: 'Highlight',
                plural: 'Product Highlights',
              },
              admin: {
                description: 'Product highlights (synced from Shopify custom.highlights metaobject)',
                readOnly: true,
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'id',
                  type: 'text',
                  admin: { readOnly: true },
                },
                {
                  name: 'highlight',
                  type: 'text',
                  admin: { readOnly: true, description: 'Tab label and large heading' },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  admin: { readOnly: true, description: 'Body paragraph' },
                },
              ],
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
                    description: 'Compare at price / MSRP (synced from US Shopify)',
                    readOnly: true,
                  },
                },
                {
                  name: 'priceCAD',
                  type: 'number',
                  admin: {
                    description: 'CA current price for this variant (synced from CA Shopify)',
                    readOnly: true,
                  },
                },
                {
                  name: 'compareAtPriceCAD',
                  type: 'number',
                  admin: {
                    description: 'CA compare at price / MSRP for this variant (synced from CA Shopify)',
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
                initCollapsed: true,
                components: {
                  RowLabel: '/components/admin/VariationRowLabel#VariationRowLabel',
                },
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
                'product-hero',                      // Product Hero - Only allowed block for product pages
                'product-hero-carousel',             // Product Hero Carousel - Multi-slide hero variant
                'product-description',               // Product Description - Rich descriptions with image/video backgrounds
                'product-technical-specs',           // Technical Specifications - Blueprint-style specifications with dynamic data
                'product-collection-showcase',       // Collection Showcase - Display collection content
                'product-floating-add-to-cart',      // Floating Add to Cart - Sticky cart button
                'product-feature-slides',            // Feature Slides - Scroll-driven fullscreen feature showcase
                'product-soundcloud-embed',          // SoundCloud Embed - Audio player for demos (leave URL empty to hide)
                'product-related-products',          // Related Products - Auto-fetches same-collection products + accessories
                'product-accessories',               // Accessories - Auto-displays compatible accessories (hidden if none exist)
                'product-faq',                       // Product FAQ - Accordion FAQ section pulled from linked FAQs
                'marketing-featured-models',         // Featured Models - Showcase related models
              ] as any,
              blocks: [], // Required to be empty when using blockReferences
              admin: {
                initCollapsed: true,
                description: 'Product page content blocks'
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
                  localized: true,
                  admin: {
                    description: 'Custom meta title (defaults to product title)'
                  }
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  maxLength: 160,
                  localized: true,
                  admin: {
                    description: 'Meta description for search engines (max 160 characters)'
                  }
                },
                {
                  name: 'keywords',
                  type: 'text',
                  localized: true,
                  admin: {
                    description: 'SEO keywords (comma-separated)'
                  }
                },
                imageField('ogImage', {
                  maxDepth: 0, // Prevent deep media fetching
                  localized: true,
                  admin: {
                    description: 'Open Graph image for social sharing (defaults to main image)'
                  }
                }),
                {
                  name: 'canonical',
                  type: 'text',
                  admin: {
                    description: 'Custom canonical URL (leave blank to use the default /products/[slug] URL)',
                  },
                },
              ],
              admin: {
                description:
                  'SEO and social media optimization. Switch the locale (top of page) to override these fields for ca.kawaius.com. Blank CA values fall back to the US value.'
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
    // FAQ Relationship - Sidebar
    {
      name: 'faqs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'FAQ documents that answer questions about this product',
      },
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
            { label: 'Unlisted', value: 'UNLISTED' },
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

          // Build lookup maps for robust matching.
          // Primary: model (the documented identity key).
          // Fallbacks (in order): shopify.productId (stable GID), shopify.handle.
          // Fallbacks catch the case where the model was renamed on Shopify but
          // Payload still has the old value — without them, bulk sync would create
          // a duplicate product and orphan the original with all its editor content.
          const productsByModel = new Map<string, typeof existingProducts[number]>()
          const productsByShopifyId = new Map<string, typeof existingProducts[number]>()
          const productsByHandle = new Map<string, typeof existingProducts[number]>()

          for (const p of existingProducts) {
            const modelKey = p.model?.toUpperCase().trim()
            if (modelKey) productsByModel.set(modelKey, p)

            const shopifyId = p.shopify?.productId?.trim()
            if (shopifyId) productsByShopifyId.set(shopifyId, p)

            const handle = p.shopify?.handle?.trim().toLowerCase()
            if (handle) productsByHandle.set(handle, p)
          }

          console.log(`[Bulk Sync] Found ${existingProducts.length} existing products in Payload`)

          // Fetch active automatic discounts ONCE for the whole run (US + CA are
          // separate stores with store-scoped GIDs), then each product matches itself
          // against the right store's list (no per-product discount query).
          const [activeDiscounts, caActiveDiscounts] = await Promise.all([
            fetchActiveAutomaticDiscounts(),
            fetchActiveAutomaticDiscounts(shopifyAdminClientCA),
          ])
          console.log(`[Bulk Sync] Loaded ${activeDiscounts.length} US + ${caActiveDiscounts.length} CA active automatic discount(s) for matching`)

          // Step 3: Process each Shopify product (create or update) in parallel batches
          const BATCH_SIZE = 5

          const results = {
            total: shopifyProducts.length,
            created: 0,
            updated: 0,
            skipped: 0,
            errors: 0,
          }

          const errors: Array<{ model: string; error: string }> = []

          const processOne = async (shopifyProduct: ShopifyProductData) => {
            const model = shopifyProduct.metafields?.model

            if (!model) {
              results.skipped++
              return
            }

            const normalizedModel = model.toUpperCase().trim()

            try {
              // Lookup chain: model → shopify.productId → shopify.handle.
              // If a fallback fires, log loudly so the operator notices the drift —
              // the update path will then realign Payload's model field to match Shopify.
              let existing = productsByModel.get(normalizedModel)
              let matchedVia: 'model' | 'productId' | 'handle' | null = existing ? 'model' : null

              if (!existing) {
                const shopifyId = shopifyProduct.id
                if (shopifyId) {
                  existing = productsByShopifyId.get(shopifyId)
                  if (existing) matchedVia = 'productId'
                }
              }

              if (!existing) {
                const handle = shopifyProduct.handle?.toLowerCase().trim()
                if (handle) {
                  existing = productsByHandle.get(handle)
                  if (existing) matchedVia = 'handle'
                }
              }

              if (existing && matchedVia !== 'model') {
                console.warn(
                  `[Bulk Sync] ⚠️ Model drift detected — matched via ${matchedVia}. ` +
                  `Payload model="${existing.model}" but Shopify metafield="${normalizedModel}" ` +
                  `(handle="${shopifyProduct.handle}"). Payload model will be realigned to Shopify on update.`
                )
              }

              // transformShopifyToPayload fetches media + CA pricing internally
              const productData = await transformShopifyToPayload(shopifyProduct, activeDiscounts, caActiveDiscounts)

              if (existing) {
                // UPDATE — exclude slug (CMS URL); exclude status unless Shopify ARCHIVED
                // (editors own active/draft; only ARCHIVED → discontinued propagates automatically)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { slug: _slug, status: _status, ...shopifySyncData } = productData
                const syncData = {
                  ...shopifySyncData,
                  ...(shopifyProduct.status === 'ARCHIVED' && { status: 'discontinued' as const }),
                }
                console.log(`[Bulk Sync] Updating existing product: ${model}`)

                await req.payload.update({
                  collection: 'products',
                  id: existing.id,
                  data: syncData,
                  context: { skipShopifySync: true },
                  req,
                })

                results.updated++
              } else {
                console.log(`[Bulk Sync] Creating new product: ${model}`)

                await req.payload.create({
                  collection: 'products',
                  data: productData,
                  context: { skipShopifySync: true },
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

          for (let i = 0; i < shopifyProducts.length; i += BATCH_SIZE) {
            const batch = shopifyProducts.slice(i, i + BATCH_SIZE)
            console.log(
              `[Bulk Sync] Processing batch ${Math.floor(i / BATCH_SIZE) + 1} / ${Math.ceil(shopifyProducts.length / BATCH_SIZE)} (${batch.length} products)`
            )
            await Promise.all(batch.map(processOne))
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

    // ── Patch Missing Blocks ───────────────────────────────────────────────────
    // Adds product-soundcloud-embed and product-related-products to any product
    // that is missing them. Safe to run multiple times — skips products that
    // already have both blocks. Never removes or reorders existing blocks.
    {
      path: '/patch-missing-blocks',
      method: 'post',
      handler: async (req) => {
        if (!req.user) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }
        if ((req.user as any).role !== 'admin') {
          return Response.json({ error: 'Forbidden - Admin only' }, { status: 403 })
        }

        console.log('[PatchBlocks] Starting patch-missing-blocks...')

        try {
          // Fetch all products including their pageContent blocks
          const { docs: products } = await req.payload.find({
            collection: 'products',
            limit: 1000,
            depth: 0,
            req,
          })

          console.log(`[PatchBlocks] Found ${products.length} products to check`)

          const summary = { total: products.length, patched: 0, skipped: 0, errors: 0 }
          const errors: Array<{ id: string; model: string; error: string }> = []

          for (const product of products) {
            const pageContent: any[] = Array.isArray(product.pageContent)
              ? product.pageContent
              : []

            const blockTypes = new Set(pageContent.map((b: any) => b?.blockType))

            const isAccessory = product.type === 'accessory'
            const needsSoundCloud = !blockTypes.has('product-soundcloud-embed')
            const needsRelated = !blockTypes.has('product-related-products')
            // Accessories block only belongs on piano pages, not on accessory products themselves
            const needsAccessories = !isAccessory && !blockTypes.has('product-accessories')
            const needsFaq = !blockTypes.has('product-faq')
            const needsCollectionShowcase = !isAccessory && !blockTypes.has('product-collection-showcase')

            if (!needsSoundCloud && !needsRelated && !needsAccessories && !needsFaq && !needsCollectionShowcase) {
              summary.skipped++
              continue
            }

            // Build updated blocks array — insert each block at the right position
            const newBlocks = [...pageContent]

            if (needsCollectionShowcase) {
              // Resolve collection ID from product's shopifyCollections (same logic as beforeChange hook)
              const shopifyCollections = Array.isArray((product as any).shopifyCollections)
                ? (product as any).shopifyCollections
                : []
              const firstShopifyCollection = shopifyCollections[0]
              let collectionId: string | number | null = null

              if (firstShopifyCollection?.shopifyCollectionId || firstShopifyCollection?.handle) {
                try {
                  const whereQuery: any = {}
                  if (firstShopifyCollection.shopifyCollectionId) {
                    whereQuery.shopifyCollectionId = { equals: firstShopifyCollection.shopifyCollectionId }
                  } else if (firstShopifyCollection.handle) {
                    whereQuery.handle = { equals: firstShopifyCollection.handle }
                  }
                  const { docs: matchingCollections } = await req.payload.find({
                    collection: 'collections',
                    where: whereQuery,
                    limit: 1,
                    depth: 0,
                    req,
                  })
                  if (matchingCollections.length > 0 && matchingCollections[0]) {
                    collectionId = matchingCollections[0].id
                  } else if (firstShopifyCollection.shopifyCollectionId && firstShopifyCollection.title) {
                    // Mirror beforeChange-on-create: if no matching Payload collection exists yet,
                    // create one so the relationship validates. Runs in its own transaction
                    // (no `req` passed) so it commits before the product update lands.
                    console.log(`[PatchBlocks] Collection not found, creating: ${firstShopifyCollection.title}`)
                    const newCollection = await req.payload.create({
                      collection: 'collections',
                      data: {
                        shopifyCollectionId: firstShopifyCollection.shopifyCollectionId,
                        title: firstShopifyCollection.title,
                        handle: firstShopifyCollection.handle,
                        productCount: 0,
                      },
                      context: { skipCollectionCleanup: true },
                    })
                    collectionId = newCollection.id
                    console.log(`[PatchBlocks] Created collection: ${firstShopifyCollection.title} (ID: ${collectionId})`)
                  }
                } catch (err) {
                  console.error(`[PatchBlocks] Error resolving collection for ${product.model}:`, err)
                }
              }

              if (collectionId) {
                // Insert after product-description (or after product-hero as fallback)
                const descIdx = newBlocks.findIndex((b: any) => b?.blockType === 'product-description')
                const heroIdx = newBlocks.findIndex((b: any) => b?.blockType === 'product-hero')
                const insertAfter = descIdx !== -1 ? descIdx : heroIdx
                const showcaseBlock = {
                  blockType: 'product-collection-showcase',
                  enabled: true,
                  collection: collectionId,
                  customSubheading: null,
                }
                if (insertAfter !== -1) {
                  newBlocks.splice(insertAfter + 1, 0, showcaseBlock)
                } else {
                  newBlocks.push(showcaseBlock)
                }
                console.log(`[PatchBlocks] Adding collection-showcase to ${product.model} (collection: ${collectionId})`)
              } else {
                console.log(`[PatchBlocks] Skipping collection-showcase for ${product.model} — no collection resolved`)
              }
            }

            if (needsAccessories) {
              // Insert immediately after product-description (or after product-hero as fallback)
              const descIdx = newBlocks.findIndex((b: any) => b?.blockType === 'product-description')
              const heroIdx = newBlocks.findIndex((b: any) => b?.blockType === 'product-hero')
              const insertAfter = descIdx !== -1 ? descIdx : heroIdx
              const accessoriesBlock = {
                blockType: 'product-accessories',
                heading: 'Accessories & Add-Ons',
                eyebrow: 'Enhance Your Piano',
                maxItems: 8,
                layout: 'grid',
                theme: 'light',
              }
              if (insertAfter !== -1) {
                newBlocks.splice(insertAfter + 1, 0, accessoriesBlock)
              } else {
                newBlocks.push(accessoriesBlock)
              }
              console.log(`[PatchBlocks] Adding product-accessories to ${product.model}`)
            }

            if (needsFaq) {
              // Insert immediately after product-technical-specs (or append)
              const techIdx = newBlocks.findIndex((b: any) => b?.blockType === 'product-technical-specs')
              const faqBlock = {
                blockType: 'product-faq',
                heading: 'FAQ',
                subheading: null,
                theme: 'pearl',
                showViewAllLink: true,
              }
              if (techIdx !== -1) {
                newBlocks.splice(techIdx + 1, 0, faqBlock)
              } else {
                newBlocks.push(faqBlock)
              }
              console.log(`[PatchBlocks] Adding product-faq to ${product.model}`)
            }

            if (needsSoundCloud) {
              // Insert before product-feature-slides if present, otherwise append
              const featureIdx = newBlocks.findIndex(
                (b: any) => b?.blockType === 'product-feature-slides',
              )
              const soundcloudBlock = {
                blockType: 'product-soundcloud-embed',
                soundcloudUrl: null,
                heading: null,
                playerOptions: {
                  visual: false,
                  autoPlay: false,
                  showComments: false,
                  showRelated: false,
                },
                theme: 'light',
              }
              if (featureIdx !== -1) {
                newBlocks.splice(featureIdx, 0, soundcloudBlock)
              } else {
                newBlocks.push(soundcloudBlock)
              }
              console.log(`[PatchBlocks] Adding soundcloud-embed to ${product.model}`)
            }

            if (needsRelated) {
              // Always append at end
              newBlocks.push({
                blockType: 'product-related-products',
                sectionHeader: {
                  eyebrow: 'Explore More',
                  heading: 'You May Also Like',
                },
                displayMode: 'collection',
                maxProducts: 4,
                layout: 'grid',
                showPrice: true,
                theme: 'light',
              })
              console.log(`[PatchBlocks] Adding related-products to ${product.model}`)
            }

            try {
              await req.payload.update({
                collection: 'products',
                id: product.id,
                data: { pageContent: newBlocks },
                context: {
                  skipShopifySync: true,
                  skipNavigationRevalidation: true,
                },
                req,
              })
              summary.patched++
            } catch (err) {
              console.error(`[PatchBlocks] Error patching ${product.model}:`, err)
              summary.errors++
              errors.push({
                id: String(product.id),
                model: product.model ?? String(product.id),
                error: err instanceof Error ? err.message : 'Unknown error',
              })
            }
          }

          console.log('[PatchBlocks] ✅ Done:', summary)

          return Response.json({
            success: true,
            summary,
            errors: errors.length > 0 ? errors : undefined,
          })
        } catch (err) {
          console.error('[PatchBlocks] ❌ Fatal error:', err)
          return Response.json(
            {
              success: false,
              message: err instanceof Error ? err.message : 'patch-missing-blocks failed',
            },
            { status: 500 },
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

        // Add default blocks only when creating a new product.
        // On updates, pageContent is not included in partial update data (it's undefined, not empty),
        // so this check would falsely trigger and wipe out existing page builder content.
        if (operation === 'create' && (!data.pageContent || data.pageContent.length === 0)) {
          const defaultBlocks: any[] = []

          // Resolve collection ID upfront (needed for block 3)
          let collectionShowcaseBlock: any = null
          if (data.shopifyCollections && Array.isArray(data.shopifyCollections) && data.shopifyCollections.length > 0) {
            const firstShopifyCollection = data.shopifyCollections[0]
            let collectionId: string | number | null = null

            try {
              if (firstShopifyCollection?.shopifyCollectionId || firstShopifyCollection?.handle) {
                const whereQuery: any = {}

                if (firstShopifyCollection.shopifyCollectionId) {
                  whereQuery.shopifyCollectionId = { equals: firstShopifyCollection.shopifyCollectionId }
                } else if (firstShopifyCollection.handle) {
                  whereQuery.handle = { equals: firstShopifyCollection.handle }
                }

                const { docs: matchingCollections } = await req.payload.find({
                  collection: 'collections',
                  where: whereQuery,
                  limit: 1,
                  depth: 0,
                  req,
                })

                if (matchingCollections.length > 0 && matchingCollections[0]) {
                  collectionId = matchingCollections[0].id
                  console.log(`🎯 Found matching collection: ${matchingCollections[0].title} (ID: ${collectionId})`)
                } else {
                  // Collection doesn't exist yet — create it now, outside the product transaction,
                  // so it commits immediately and the relationship validation can resolve it.
                  console.log(`🆕 Collection not found, creating: ${firstShopifyCollection.title}`)
                  const newCollection = await req.payload.create({
                    collection: 'collections',
                    data: {
                      shopifyCollectionId: firstShopifyCollection.shopifyCollectionId,
                      title: firstShopifyCollection.title,
                      handle: firstShopifyCollection.handle,
                      productCount: 0,
                    },
                    context: { skipCollectionCleanup: true },
                    // Intentionally no `req` — runs in its own transaction so it commits
                    // before Payload validates the product's collection relationship field
                  })
                  collectionId = newCollection.id
                  console.log(`✅ Created new collection: ${firstShopifyCollection.title} (ID: ${collectionId})`)
                }
              }
            } catch (error) {
              console.error('⚠️ Error finding/creating collection for default block:', error)
            }

            // Only create the block if we have a valid collection ID.
            // A null collection would fail the required: true validation on the field.
            if (collectionId) {
              collectionShowcaseBlock = {
                blockType: 'product-collection-showcase',
                enabled: true,
                collection: collectionId,
                customSubheading: null,
              }
            } else {
              console.log(`⚠️ Skipping collection-showcase block — could not resolve a collection ID`)
            }
          }

          // 1. Product Hero
          defaultBlocks.push({
            blockType: 'product-hero',
            layout: {
              imagePosition: 'left',
              backgroundColor: 'white',
              showVariations: true,
              showPrice: false,
              showBuyButton: true,
            },
            overrides: {},
          })

          console.log(`🧩 Added default product-hero block`)

          // 2. Product Description
          defaultBlocks.push({
            blockType: 'product-description',
            background: {
              mediaType: 'image',
              overlayColor: 'dark',
              overlayOpacity: 50,
            },
            content: {
              showProductName: true,
              useCustomDescription: false,
            },
            layout: {
              contentAlignment: 'center',
              verticalAlignment: 'center',
              textColor: 'white',
              textSize: 'normal',
              useGlassmorphism: false,
              minHeight: 'medium',
            },
            mediaGallerySettings: {
              layout: 'carousel',
              theme: 'light',
            },
          })

          console.log(`📝 Added default product-description block`)

          // 3. Accessories (piano products only — not on accessory products themselves)
          if (data.type !== 'accessory') {
            defaultBlocks.push({
              blockType: 'product-accessories',
              heading: 'Accessories & Add-Ons',
              eyebrow: 'Enhance Your Piano',
              maxItems: 8,
              layout: 'grid',
              theme: 'light',
            })
            console.log(`🎸 Added default product-accessories block`)
          }

          // 4. Collection Showcase (after accessories)
          if (collectionShowcaseBlock) {
            defaultBlocks.push(collectionShowcaseBlock)
            console.log(`🎯 Added default collection-showcase block with collection: ${collectionShowcaseBlock.collection}`)
          }

          // 5. SoundCloud Embed (before feature slides — empty URL = hidden until configured)
          defaultBlocks.push({
            blockType: 'product-soundcloud-embed',
            soundcloudUrl: null,
            heading: null,
            playerOptions: {
              visual: false,
              autoPlay: false,
              showComments: false,
              showRelated: false,
            },
            theme: 'light',
          })

          console.log(`🎵 Added default product-soundcloud-embed block`)

          // 6. Feature Slides
          defaultBlocks.push({
            blockType: 'product-feature-slides',
            features: [],
            theme: 'dark',
            progressIndicator: 'dots',
          })

          console.log(`🎞 Added default product-feature-slides block`)

          // 7. Technical Specs
          defaultBlocks.push({
            blockType: 'product-technical-specs',
          })

          console.log(`📐 Added default product-technical-specs block`)

          // FAQ (after technical specs)
          defaultBlocks.push({
            blockType: 'product-faq',
            heading: 'FAQ',
            subheading: null,
            theme: 'pearl',
            showViewAllLink: true,
          })

          console.log(`❓ Added default product-faq block`)

          // Related Products (always last — helps customers discover the catalog)
          defaultBlocks.push({
            blockType: 'product-related-products',
            sectionHeader: {
              eyebrow: 'Explore More',
              heading: 'You May Also Like',
            },
            displayMode: 'collection',
            maxProducts: 4,
            layout: 'grid',
            showPrice: true,
            theme: 'light',
          })

          console.log(`🔗 Added default product-related-products block`)

          data.pageContent = defaultBlocks
          const seededNames = [
            'hero', 'description',
            data.type !== 'accessory' ? 'accessories' : null,
            collectionShowcaseBlock ? 'collection-showcase' : null,
            'soundcloud-embed', 'feature-slides', 'technical-specs', 'faq', 'related-products',
          ].filter(Boolean).join(', ')
          console.log(`✅ Added ${defaultBlocks.length} default blocks: ${seededNames} (operation: ${operation})`)
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
      // Hook 1: Revalidate products navigation cache
      async ({ doc, req, context, operation }) => {
        // Skip if context flag is set (prevents infinite loops)
        if (context.skipNavigationRevalidation) {
          return doc
        }

        // Only revalidate for active products with type field
        // This ensures the navigation menu stays up-to-date
        if (doc.status === 'active' && doc.type) {
          console.log('[Products Hook] Revalidating products navigation cache for:', doc.model || doc.name)

          try {
            // Dynamically import revalidateTag to avoid edge runtime issues
            const { revalidateTag } = await import('next/cache')

            // Revalidate navigation cache tag
            revalidateTag('products-navigation')
            console.log('[Products Hook] ✅ Navigation cache revalidated')
          } catch (error) {
            // Log error but don't throw - cache revalidation failure shouldn't block saves
            console.error('[Products Hook] ⚠️ Navigation revalidation failed:', error)
          }
        }

        return doc
      },

      // Hook 3: Revalidate product page on save
      async ({ doc, previousDoc, req, context, operation }) => {
        // Skip if context flag is set (prevents infinite loops)
        if (context.skipProductPageRevalidation) {
          return doc
        }

        // Revalidate for active products, or products transitioning away from active
        const wasActive = previousDoc?.status === 'active'
        const isNowActive = doc.status === 'active'
        if (doc.slug && (isNowActive || wasActive)) {
          console.log('[Products Hook] Revalidating product page for:', doc.slug)

          try {
            // Dynamically import to avoid edge runtime issues
            const { revalidatePath, revalidateTag } = await import('next/cache')

            // Invalidate the ISR static page
            revalidatePath(`/products/${doc.slug}`)
            // Invalidate any unstable_cache entries tagged with this product's slug
            revalidateTag(`product-${doc.slug}`)
            // Invalidate any list views that include all products
            revalidateTag('products')
            // Bust the Google Merchant Center feed so GMC sees the latest data
            revalidatePath('/api/feeds/google-merchant')
            console.log(`[Products Hook] ✅ Product page revalidated: /products/${doc.slug}`)
          } catch (error) {
            // Log error but don't throw - revalidation failure shouldn't block saves
            console.error('[Products Hook] ⚠️ Product page revalidation failed:', error)
          }
        }

        return doc
      },

      // Hook 2: Shopify sync (existing)
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
      },

      // Hook 3: Sync collections from product data
      async ({ doc, req, context, operation }) => {
        // Skip if context flag is set
        if (context.skipCollectionSync) {
          return doc
        }

        // Only sync collections for active products with shopifyCollections data
        if (doc.status !== 'active' || !doc.shopifyCollections || doc.shopifyCollections.length === 0) {
          return doc
        }

        console.log(`[Products Hook] Syncing ${doc.shopifyCollections.length} collections for product: ${doc.name}`)

        // Fire-and-forget pattern - sync collections in background
        setTimeout(async () => {
          try {
            const { upsertCollectionsFromProduct } = await import('@/lib/shopify/sync-collections-from-products')
            const { getPayload } = await import('payload')
            const config = await import('@payload-config').then(m => m.default)
            const payload = await getPayload({ config })

            await upsertCollectionsFromProduct(doc.shopifyCollections, payload)
            console.log(`[Products Hook] ✅ Collections synced for product: ${doc.name}`)
          } catch (error) {
            console.error('[Products Hook] ⚠️ Collection sync failed:', error)
          }
        }, 1000) // 1 second delay to ensure product operations complete first

        return doc
      }
    ]
  }
}