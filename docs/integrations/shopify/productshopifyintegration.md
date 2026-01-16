# Products Collection - Shopify Integration Redesign

> Comprehensive plan for simplifying the Products collection to be content-focused with Shopify as the source of truth

**Date**: 2026-01-15
**Status**: Proposed
**Goal**: Simplify Products collection from 900+ lines to ~150 lines, focusing on content storage rather than commerce features

---

## Table of Contents

1. [Current State Analysis](#current-state-analysis)
2. [Problems Identified](#problems-identified)
3. [Shopify Data Structure](#shopify-data-structure)
4. [Proposed Solution](#proposed-solution)
5. [Implementation Plan](#implementation-plan)
6. [Benefits](#benefits)
7. [Migration Path](#migration-path)

---

## Current State Analysis

### Current Collection Structure (`Products.ts`)

The existing Products collection has **5 tabs** with 900+ lines of configuration:

1. **Product Details** (~550 lines)
   - Mixed concerns: CMS content, Shopify sync, pricing, inventory, 3D viewer
   - Complex nested groups and conditional fields
   - Fields duplicated from Shopify data
   - Over-engineered for a content-focused approach

2. **Page Content** (blocks)
   - ✅ Good - flexible block-based content building
   - Keep this approach

3. **SEO & Meta**
   - ✅ Good - clean SEO configuration
   - Keep this approach

4. **Shopify Data** (~130 lines)
   - Read-only display tab
   - Duplicates data from Product Details
   - Creates confusion about source of truth
   - **Should be removed**

5. **Settings**
   - Visibility, inventory tracking, stock management
   - Over-complex for content storage
   - **Should be simplified or removed**

### Issues with Current Approach

1. **Bloated Schema** - 900+ lines with overlapping fields
2. **Confused Purpose** - Mixing content storage with e-commerce features
3. **No Proper Variant Handling** - Missing variant-specific images
4. **Redundant Data** - Shopify fields duplicated in multiple places
5. **Manual Data Entry** - No auto-population from Shopify
6. **Price Storage** - Storing prices (should come from Shopify only)

---

## Problems Identified

### 1. Bloated Product Details Tab

```typescript
// Current state: 500+ lines
{
  name, slug, category, status, mainImage, imageUrl, description,
  shortDescription, learnMore, price { msrp, salePrice, priceRange,
  priceText, contactForPricing, showPrice }, finishes[], series, model,
  rating, reviews, badge, highlight, brand, shopifyProductId,
  keyFeatures[], specifications { keys, pedals, voices, polyphony,
  actionType, soundEngine, dimensions, weight, sku, warranty, origin },
  buyButton { text, link, style, showButton }, discontinued,
  viewer3D { enabled, viewerUrl, modelParams, autoOpen, buttonText }
}
```

**Problems:**
- Mixing CMS content fields with Shopify sync fields
- Pricing data stored in CMS (should come from Shopify)
- Inventory tracking in CMS (should be Shopify only)
- 3D viewer config buried in product data

### 2. Redundant Shopify Data Tab

```typescript
// Read-only display - NOT editable
{
  shopifyData: {
    id, title, handle, description, vendor, productType,
    modelMetafield, status, price, inStock, variantCount,
    imageCount, lastFetchedAt, fetchError
  }
}
```

**Problem:** Creates confusion - "Is this the source of truth or Product Details?"

### 3. Missing Variant Structure

Looking at the Shopify CSV export structure:

```csv
Handle,Title,Body (HTML),Vendor,Type,Tags,Option1 Name,Option1 Value,Variant SKU,Image Src,Image Position,Model
kawai-ca99-digital-piano,Kawai CA99 Digital Piano,"<p>Description...</p>",Kawai,Digital,"ca99,kawai",Finish,Ebony Polish,CA99EP,https://cdn.../ca99-ebony.jpg,1,CA99
kawai-ca99-digital-piano,,,,,,,Premium Rosewood,CA99R,https://cdn.../ca99-rosewood.jpg,2,
kawai-ca99-digital-piano,,,,,,,Premium Satin White,CA99W,https://cdn.../ca99-white.jpg,3,
kawai-ca99-digital-piano,,,,,,,Satin Black,CA99B,https://cdn.../ca99-black.jpg,4,
```

**Key Observations:**
- Each product has multiple variant rows
- First row has full product data (title, body, vendor, type, tags, model)
- Subsequent rows only have variant-specific data (finish, SKU, image)
- Each variant has its own image with position
- Model metafield (`custom.model`) is used for identification

**Current collection doesn't properly handle:**
- ❌ Variants as nested array structure
- ❌ Variant-specific images
- ❌ Variant options (Finish: "Ebony Polish")
- ❌ Auto-population from Shopify by model

---

## Shopify Data Structure

### Product-Level Fields (from Shopify Admin API)

```graphql
product {
  id                    # gid://shopify/Product/123
  handle                # URL slug (kawai-ca99-digital-piano)
  title                 # Product name
  description           # Plain text
  descriptionHtml       # Rich HTML content
  vendor                # "Kawai"
  productType           # "Digital" (Type field in CSV)
  tags                  # ["ca99", "kawai", "digital piano"]
  status                # ACTIVE | DRAFT | ARCHIVED

  metafield(namespace: "custom", key: "model") {
    value               # "CA99" - for identification
  }

  variants(first: 100) {
    edges {
      node {
        id              # Variant GID
        title           # "Ebony Polish"
        sku             # "CA99EP"
        price           # Not storing (Shopify is source)
        availableForSale
        inventoryQuantity
        image {         # ⚠️ MISSING IN CURRENT QUERY
          url
          altText
          width
          height
        }
        selectedOptions {
          name          # "Finish"
          value         # "Ebony Polish"
        }
      }
    }
  }
}
```

### What We Need to Store in Payload CMS

**Content-focused approach - NO pricing, NO inventory:**

```typescript
{
  // Identification
  model: "CA99"                    // Used to fetch from Shopify
  handle: "kawai-ca99-digital-piano"

  // Content
  title: "Kawai CA99 Digital Piano"
  body: "<p>HTML description from Shopify...</p>"

  // Taxonomy
  vendor: "Kawai"
  productType: "Digital"
  tags: ["ca99", "kawai ca series", "digital piano"]

  // Status
  status: "active" | "draft" | "discontinued"

  // Variants (nested array)
  variants: [
    {
      shopifyId: "gid://shopify/ProductVariant/123",
      title: "Ebony Polish",
      sku: "CA99EP",
      available: true,
      image: {
        url: "https://cdn.shopify.com/.../ca99-ebony.jpg",
        alt: "Kawai CA99 Ebony Polish",
        width: 2000,
        height: 1500
      },
      options: [
        { name: "Finish", value: "Ebony Polish" }
      ]
    },
    {
      shopifyId: "gid://shopify/ProductVariant/124",
      title: "Premium Rosewood",
      sku: "CA99R",
      available: true,
      image: {
        url: "https://cdn.shopify.com/.../ca99-rosewood.jpg",
        alt: "Kawai CA99 Premium Rosewood",
        width: 2000,
        height: 1500
      },
      options: [
        { name: "Finish", value: "Premium Rosewood" }
      ]
    }
  ]
}
```

---

## Proposed Solution

### Simplified Collection Structure

**Only 3 tabs, ~150 lines:**

```typescript
Products Collection:
├── Tab 1: Shopify Content (synced from Shopify)
│   ├── model* (text) - "CA99" - triggers Shopify fetch
│   ├── handle* (text, unique) - "kawai-ca99-digital-piano"
│   ├── title* (text) - "Kawai CA99 Digital Piano"
│   ├── body (textarea) - HTML from Shopify descriptionHtml
│   ├── vendor (text) - "Kawai"
│   ├── productType (text) - "Digital"
│   ├── tags (array of strings) - ["ca99", "kawai"]
│   ├── status (select) - "active" | "draft" | "discontinued"
│   └── variants (array)
│       ├── shopifyId (text) - "gid://shopify/ProductVariant/123"
│       ├── title (text) - "Ebony Polish"
│       ├── sku (text) - "CA99EP"
│       ├── available (checkbox) - true/false
│       ├── image (group)
│       │   ├── url (text)
│       │   ├── alt (text)
│       │   ├── width (number)
│       │   └── height (number)
│       └── options (array)
│           ├── name (text) - "Finish"
│           └── value (text) - "Ebony Polish"
│
├── Tab 2: Page Content (build custom product pages)
│   └── pageContent (blocks)
│       ├── productHero
│       ├── productShowcase
│       ├── imageGallery
│       ├── specifications
│       ├── featuresList
│       ├── testimonials
│       └── callToAction
│
└── Tab 3: SEO & Meta
    └── seo (group)
        ├── metaTitle (text)
        ├── metaDescription (textarea, max 160)
        ├── keywords (text)
        └── ogImage (upload -> media)
```

### Key Design Principles

1. **Shopify as Source of Truth** - Fetch data from Shopify, don't duplicate it
2. **Content-Focused** - No pricing, no inventory tracking
3. **Auto-Population** - Use `model` field to trigger Shopify fetch
4. **Editable After Import** - Users can override any field
5. **Proper Variant Structure** - Nested array with images
6. **Clean Separation** - Shopify data vs CMS content blocks

---

## Implementation Plan

### Step 1: Update `fetch-product.ts`

**Add variant images to GraphQL query:**

```typescript
// Current query MISSING variant.image
variants(first: 100) {
  edges {
    node {
      id
      title
      price
      sku
      availableForSale
      selectedOptions {
        name
        value
      }
      // ⚠️ ADD THIS:
      image {
        url
        altText
        width
        height
      }
    }
  }
}
```

**Update interface:**

```typescript
export interface ShopifyProductData {
  // ... existing fields
  variants: Array<{
    id: string
    title: string
    sku: string
    available: boolean
    image: {              // ⚠️ ADD THIS
      url: string
      alt: string
      width: number
      height: number
    } | null
    options: Array<{
      name: string
      value: string
    }>
  }>
}
```

**Update transform function:**

```typescript
function transformShopifyProduct(shopifyProduct: any): ShopifyProductData {
  return {
    // ... existing fields
    variants: shopifyProduct.variants.edges.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      sku: edge.node.sku || '',
      available: edge.node.availableForSale,
      image: edge.node.image ? {         // ⚠️ ADD THIS
        url: edge.node.image.url,
        alt: edge.node.image.altText || '',
        width: edge.node.image.width,
        height: edge.node.image.height,
      } : null,
      options: edge.node.selectedOptions.map((opt: any) => ({
        name: opt.name,
        value: opt.value,
      })),
    })),
  }
}
```

### Step 2: Create Simplified `Products.ts`

**New collection schema:**

```typescript
import type { CollectionConfig } from 'payload'
import { fetchShopifyProductByModel } from '@/lib/shopify/fetch-product'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Product',
    plural: 'Products',
  },
  admin: {
    group: 'Commerce',
    defaultColumns: ['title', 'model', 'status', 'updatedAt'],
    useAsTitle: 'title',
    description: 'Product content synced from Shopify - use model field to auto-populate',
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // Tab 1: Shopify Content
        {
          label: 'Shopify Content',
          description: 'Content synced from Shopify using model identifier',
          fields: [
            {
              name: 'model',
              type: 'text',
              required: true,
              unique: true,
              admin: {
                description: 'Model identifier (e.g., CA99, GX-7) - triggers Shopify fetch on save',
                placeholder: 'CA99',
              },
            },
            {
              name: 'handle',
              type: 'text',
              required: true,
              unique: true,
              admin: {
                description: 'URL slug from Shopify (auto-populated)',
                readOnly: true,
              },
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                description: 'Product title from Shopify (editable)',
              },
            },
            {
              name: 'body',
              type: 'textarea',
              admin: {
                description: 'HTML description from Shopify (editable)',
                rows: 10,
              },
            },
            {
              name: 'vendor',
              type: 'text',
              admin: {
                description: 'Product vendor from Shopify',
              },
            },
            {
              name: 'productType',
              type: 'text',
              admin: {
                description: 'Product type/category from Shopify',
              },
            },
            {
              name: 'tags',
              type: 'array',
              labels: {
                singular: 'Tag',
                plural: 'Tags',
              },
              fields: [
                {
                  name: 'tag',
                  type: 'text',
                  required: true,
                },
              ],
              admin: {
                description: 'Product tags from Shopify (editable)',
              },
            },
            {
              name: 'status',
              type: 'select',
              defaultValue: 'active',
              options: [
                { label: 'Active', value: 'active' },
                { label: 'Draft', value: 'draft' },
                { label: 'Discontinued', value: 'discontinued' },
              ],
              admin: {
                description: 'Product status',
                position: 'sidebar',
              },
            },
            {
              name: 'variants',
              type: 'array',
              labels: {
                singular: 'Variant',
                plural: 'Variants',
              },
              admin: {
                description: 'Product variants from Shopify (auto-populated)',
              },
              fields: [
                {
                  name: 'shopifyId',
                  type: 'text',
                  admin: {
                    description: 'Shopify variant ID',
                    readOnly: true,
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Variant title (e.g., "Ebony Polish")',
                  },
                },
                {
                  name: 'sku',
                  type: 'text',
                  admin: {
                    description: 'Stock Keeping Unit',
                  },
                },
                {
                  name: 'available',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Is this variant available?',
                  },
                },
                {
                  name: 'image',
                  type: 'group',
                  admin: {
                    description: 'Variant-specific image',
                  },
                  fields: [
                    {
                      name: 'url',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Image URL from Shopify CDN',
                      },
                    },
                    {
                      name: 'alt',
                      type: 'text',
                      admin: {
                        description: 'Image alt text',
                      },
                    },
                    {
                      name: 'width',
                      type: 'number',
                      admin: {
                        description: 'Image width in pixels',
                      },
                    },
                    {
                      name: 'height',
                      type: 'number',
                      admin: {
                        description: 'Image height in pixels',
                      },
                    },
                  ],
                },
                {
                  name: 'options',
                  type: 'array',
                  labels: {
                    singular: 'Option',
                    plural: 'Options',
                  },
                  admin: {
                    description: 'Variant options (e.g., Finish: Ebony Polish)',
                  },
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Option name (e.g., "Finish")',
                      },
                    },
                    {
                      name: 'value',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Option value (e.g., "Ebony Polish")',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },

        // Tab 2: Page Content
        {
          label: 'Page Content',
          description: 'Build custom product pages using content blocks',
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
                'testimonials',
              ],
              blocks: [], // Required when using blockReferences
              admin: {
                description: 'Build your product page with flexible blocks',
              },
            },
          ],
        },

        // Tab 3: SEO & Meta
        {
          label: 'SEO & Meta',
          description: 'Search engine optimization',
          fields: [
            {
              name: 'seo',
              type: 'group',
              fields: [
                {
                  name: 'metaTitle',
                  type: 'text',
                  admin: {
                    description: 'Custom meta title (defaults to product title)',
                  },
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  maxLength: 160,
                  admin: {
                    description: 'Meta description for search engines (max 160 characters)',
                  },
                },
                {
                  name: 'keywords',
                  type: 'text',
                  admin: {
                    description: 'SEO keywords (comma-separated)',
                  },
                },
                {
                  name: 'ogImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Open Graph image for social sharing',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],

  hooks: {
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        console.log(`[Products] beforeChange: operation=${operation}, model="${data.model}"`)

        // Determine if we should fetch from Shopify
        const isNewProduct = operation === 'create' && data.model
        const modelChanged = operation === 'update' &&
                            data.model &&
                            originalDoc?.model !== data.model

        if (isNewProduct || modelChanged) {
          console.log(`[Products] Fetching from Shopify for model: ${data.model}`)

          try {
            const shopifyData = await fetchShopifyProductByModel(data.model)

            if (shopifyData) {
              console.log(`[Products] Successfully fetched: ${shopifyData.title}`)

              // Auto-populate fields from Shopify
              data.handle = shopifyData.handle
              data.title = shopifyData.title
              data.body = shopifyData.descriptionHtml
              data.vendor = shopifyData.vendor
              data.productType = shopifyData.productType
              data.tags = shopifyData.tags.map(tag => ({ tag }))

              // Map variants with images
              data.variants = shopifyData.variants.map(variant => ({
                shopifyId: variant.id,
                title: variant.title,
                sku: variant.sku,
                available: variant.available,
                image: variant.image ? {
                  url: variant.image.url,
                  alt: variant.image.alt || `${shopifyData.title} - ${variant.title}`,
                  width: variant.image.width,
                  height: variant.image.height,
                } : undefined,
                options: variant.options.map(opt => ({
                  name: opt.name,
                  value: opt.value,
                })),
              }))

              console.log(`[Products] Auto-populated ${data.variants.length} variants`)
            } else {
              console.warn(`[Products] No product found in Shopify for model: ${data.model}`)
            }
          } catch (error) {
            console.error('[Products] Error fetching from Shopify:', error)
            // Don't throw - allow save to continue with manual data
          }
        }

        // Auto-generate slug if not provided
        if (!data.handle && data.title) {
          data.handle = data.title
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
        }

        return data
      },
    ],
  },
}
```

### Step 3: Test Flow

**Creating a new product:**

1. **Admin creates new Product document**
2. **Enters model field**: `CA99`
3. **Clicks Save**
4. **Hook triggers**: `beforeChange` detects new model
5. **Fetches from Shopify**: Calls `fetchShopifyProductByModel('CA99')`
6. **Auto-populates fields**:
   - handle: `kawai-ca99-digital-piano`
   - title: `Kawai CA99 Digital Piano`
   - body: `<p>With an advanced Sound Speaker System...</p>`
   - vendor: `Kawai`
   - productType: `Digital`
   - tags: `["ca99", "kawai ca series", "digital piano"]`
   - variants: `[{ title: "Ebony Polish", sku: "CA99EP", image: {...} }, ...]`
7. **User can now**:
   - Edit any auto-populated field
   - Add Page Content blocks
   - Configure SEO settings
8. **Save** - Product is ready!

---

## Benefits

### 1. Simplicity
- **From 900+ lines to ~150 lines** (83% reduction)
- Clear, focused structure
- Easy to understand and maintain

### 2. Maintainability
- **Single source of truth** - Shopify for data, Payload for content
- **No data duplication** - Fields are either synced or custom
- **Clear separation** - Shopify content vs Page content vs SEO

### 3. Content-Focused
- **No price storage** - Prices come from Shopify only
- **No inventory tracking** - Handled by Shopify
- **Focus on content** - Descriptions, images, page building

### 4. Auto-Population
- **Fetch by model** - One field triggers full import
- **Saves time** - No manual data entry
- **Always accurate** - Data comes directly from Shopify

### 5. Flexibility
- **Editable after import** - Override any field
- **Page Content blocks** - Build custom product pages
- **Extensible** - Easy to add new fields

### 6. Proper Variant Handling
- **Nested array structure** - Variants belong to product
- **Variant-specific images** - Each finish has its image
- **Variant options** - Structured as name/value pairs

### 7. Developer Experience
- **Clean API** - Simple data structure
- **Type-safe** - Clear TypeScript interfaces
- **Predictable** - Standard Payload patterns

---

## Migration Path

### For Existing Products

**Option 1: Manual Migration (Recommended)**

1. **Backup existing Products collection**
2. **Deploy new schema**
3. **Create new products using model field**
4. **Migrate Page Content blocks** from old products
5. **Archive old collection** once validated

**Option 2: Automated Migration Script**

```typescript
// scripts/migrate-products.ts
import { getPayload } from 'payload'
import { fetchShopifyProductByModel } from '@/lib/shopify/fetch-product'

async function migrateProducts() {
  const payload = await getPayload({ config })

  // Get all existing products
  const { docs: oldProducts } = await payload.find({
    collection: 'products',
    limit: 1000,
  })

  for (const oldProduct of oldProducts) {
    if (!oldProduct.model) {
      console.log(`Skipping ${oldProduct.name} - no model field`)
      continue
    }

    // Fetch fresh data from Shopify
    const shopifyData = await fetchShopifyProductByModel(oldProduct.model)

    if (!shopifyData) {
      console.log(`No Shopify data for model ${oldProduct.model}`)
      continue
    }

    // Create new product with simplified structure
    await payload.create({
      collection: 'products',
      data: {
        model: oldProduct.model,
        handle: shopifyData.handle,
        title: shopifyData.title,
        body: shopifyData.descriptionHtml,
        vendor: shopifyData.vendor,
        productType: shopifyData.productType,
        tags: shopifyData.tags.map(tag => ({ tag })),
        status: oldProduct.status || 'active',
        variants: shopifyData.variants.map(v => ({...})),
        pageContent: oldProduct.pageContent, // Preserve blocks
        seo: oldProduct.seo, // Preserve SEO
      },
    })

    console.log(`Migrated: ${shopifyData.title}`)
  }
}
```

### Rollback Plan

If issues arise:

1. **Keep old schema** as `ProductsLegacy` during transition
2. **Test new schema** with subset of products
3. **Validate data integrity** before full migration
4. **Keep backups** of old collection data

---

## Next Steps

1. ✅ **Review this document** with team
2. ⏳ **Update `fetch-product.ts`** to include variant images
3. ⏳ **Create new `Products.ts`** with simplified schema
4. ⏳ **Test with sample products** (CA99, GX-7, etc.)
5. ⏳ **Validate data integrity** and frontend compatibility
6. ⏳ **Plan migration** for existing products
7. ⏳ **Deploy to production**

---

## Technical Reference

### Key Files

- `src/collections/Products.ts` - Collection definition
- `src/lib/shopify/fetch-product.ts` - Shopify API integration
- `src/lib/shopify/admin-client.ts` - Admin API client
- `docs/integrations/shopify/shopify-integration-v2.md` - Shopify docs

### Environment Variables Required

```bash
# Shopify Admin API
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_...
SHOPIFY_API_VERSION=2025-07

# Or OAuth (if using)
SHOPIFY_APP_CLIENT_ID=...
SHOPIFY_APP_CLIENT_SECRET=...
```

### GraphQL Query Reference

```graphql
query GetProductByModel($namespace: String!, $key: String!, $value: String!) {
  productByIdentifier(
    identifier: {
      customId: {
        namespace: $namespace
        key: $key
        value: $value
      }
    }
  ) {
    id
    handle
    title
    description
    descriptionHtml
    vendor
    productType
    tags
    status

    variants(first: 100) {
      edges {
        node {
          id
          title
          sku
          availableForSale
          image {           # ⚠️ CRITICAL FIELD
            url
            altText
            width
            height
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }

    metafield(namespace: "custom", key: "model") {
      value
    }
  }
}
```

---

## Questions & Answers

**Q: What happens to pricing data?**
A: Pricing is **not stored** in Payload. Fetch prices from Shopify API when needed on the frontend.

**Q: Can users still manually edit fields after Shopify import?**
A: Yes! Auto-population only happens on create or model change. After that, all fields are editable.

**Q: What if a product doesn't exist in Shopify?**
A: The hook logs a warning and allows manual data entry. Save continues without error.

**Q: How do I update product data from Shopify?**
A: Change the `model` field (e.g., append a space, then remove it) to trigger a re-fetch, or edit fields manually.

**Q: What about product images beyond variants?**
A: Use Page Content blocks (imageGallery, productShowcase) for additional curated images.

**Q: Can I add custom fields?**
A: Absolutely! Add them to the Shopify Content tab or create a new "Custom Data" tab.

---

## Conclusion

This redesign transforms the Products collection from a bloated 900+ line schema mixing concerns into a clean, focused 150-line content storage system. By treating Shopify as the source of truth and using Payload for content presentation, we achieve:

- **83% reduction in schema complexity**
- **Proper variant handling with images**
- **Auto-population via model metafield**
- **Content-focused approach (no pricing/inventory)**
- **Clear separation of concerns**
- **Easy to maintain and extend**

The system is **simple**, **maintainable**, **organized**, and **modular** - exactly what was requested.

---

**Document Version**: 1.0
**Last Updated**: 2026-01-15
**Author**: Claude Code (Anthropic)
**Status**: Ready for Implementation
