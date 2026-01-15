# Shopify Products Collection Integration Plan

> **Analysis Date:** 2026-01-14
> **Purpose:** Integrate Payload CMS Products collection with Shopify Admin API for bidirectional product management

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Shopify Admin API Capabilities](#shopify-admin-api-capabilities)
4. [Recommended Field Additions](#recommended-field-additions)
5. [Integration Architecture](#integration-architecture)
6. [Implementation Roadmap](#implementation-roadmap)
7. [Code Examples](#code-examples)

---

## Executive Summary

### Current Gap Analysis

Your Products collection has **75% of the foundation** needed for Shopify integration:

✅ **Already Have:**
- Basic product info (name, description, price)
- Product variants (finishes array)
- SEO metadata structure
- Image management
- Status management
- Specifications/dimensions

❌ **Missing for Full Integration:**
- Shopify ID tracking (critical for updates)
- Bidirectional sync metadata
- Variant-level Shopify IDs
- Inventory tracking integration
- Product collections mapping
- Sync status/error handling

### Recommended Approach

**Phase 1 (Immediate):** Add Shopify sync metadata fields (2-3 hours)
**Phase 2 (Week 1):** Implement create/update operations (1-2 days)
**Phase 3 (Week 2):** Add inventory sync and variant management (2-3 days)
**Phase 4 (Ongoing):** Webhook listeners for Shopify → Payload updates

---

## Current State Analysis

### Existing Fields That Map Well to Shopify

| Payload Field | Shopify Field | Mapping Quality | Notes |
|--------------|---------------|-----------------|-------|
| `name` | `title` | ✅ Perfect | Direct 1:1 mapping |
| `slug` | `handle` | ✅ Perfect | URL-friendly identifier |
| `description` | `descriptionHtml` | ⚠️ Partial | Need to convert to HTML |
| `price.msrp` | `variants[0].price` | ✅ Good | Default variant price |
| `status` | `status` | ⚠️ Needs mapping | Convert to ACTIVE/DRAFT/ARCHIVED |
| `brand` | `vendor` | ✅ Perfect | Manufacturer name |
| `category` | `productType` | ✅ Good | Product categorization |
| `finishes[]` | `variants[]` | ✅ Good | Product variants structure |
| `mainImage` | `media[0]` | ✅ Good | Featured image |
| `model` | `tags[]` | ✅ Good | Tag-based matching (e.g., "CA99") |
| `keyFeatures[]` | `metafields[]` | ⚠️ Custom | Store as metafield |
| `specifications` | `metafields[]` | ⚠️ Custom | Store as structured metafield |

### Gaps Requiring New Fields

1. **Shopify Identity Tracking**
   - No way to know if product exists in Shopify
   - No Shopify Product ID stored
   - No variant ID tracking for finishes

2. **Sync State Management**
   - No last sync timestamp
   - No sync status (pending/success/error)
   - No error logging

3. **Inventory Management**
   - Basic `inventory.inStock` boolean exists
   - Missing location-based inventory
   - Missing inventory policy

4. **Collections & Publishing**
   - No Shopify collections mapping
   - No sales channel publishing control

---

## Shopify Admin API Capabilities

### Product Management (GraphQL Admin API)

Based on Context7 research, Shopify provides these key mutations:

#### 1. `productCreate` Mutation

```graphql
mutation ProductCreate($input: ProductCreateInput!) {
  productCreate(input: $input) {
    product {
      id
      title
      handle
      descriptionHtml
      productType
      vendor
      tags
      status
      variants(first: 10) {
        edges {
          node {
            id
            title
            price
            sku
            barcode
          }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}
```

**Supports:**
- ✅ Title, description (HTML), vendor, product type
- ✅ Initial variant creation (1 variant)
- ✅ Media attachments
- ✅ SEO metadata
- ✅ Tags for categorization
- ✅ Collections association
- ✅ Status (ACTIVE, DRAFT, ARCHIVED)

#### 2. `productUpdate` Mutation

```graphql
mutation ProductUpdate($input: ProductUpdateInput!) {
  productUpdate(input: $input) {
    product {
      id
      title
      updatedAt
    }
    userErrors {
      field
      message
    }
  }
}
```

**Key Fields Available:**
- `id` (required) - Shopify Product ID
- `title`, `descriptionHtml`, `vendor`, `productType`
- `handle` (with `redirectNewHandle` option)
- `status` (ACTIVE, DRAFT, ARCHIVED)
- `tags[]` - Searchable keywords
- `seo` - SEO title and description
- `collectionsToJoin[]`, `collectionsToLeave[]`
- `metafields[]` - Custom data storage

#### 3. `productVariantsBulkCreate` Mutation

For creating multiple variants (finishes) at once:

```graphql
mutation ProductVariantsBulkCreate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
  productVariantsBulkCreate(productId: $productId, variants: $variants) {
    productVariants {
      id
      displayName
      price
      sku
      barcode
    }
    userErrors {
      field
      message
    }
  }
}
```

**Variant Fields:**
- `price` (Money object with amount + currencyCode)
- `compareAtPrice` (for sale pricing)
- `sku` - Stock keeping unit
- `barcode` - Product barcode
- `inventoryPolicy` - DENY or CONTINUE when out of stock
- `inventoryQuantities[]` - Per-location inventory
- `optionValues[]` - Option names/values (e.g., Color: "Ebony Polish")
- `mediaId` or `mediaSrc` - Associate images
- `taxable` - Tax flag
- `weight` - Product weight

#### 4. `productVariantsBulkUpdate` Mutation

For updating existing variants:

```graphql
mutation ProductVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
  productVariantsBulkUpdate(productId: $productId, variants: $variants) {
    productVariants {
      id
      price
      inventoryQuantity
    }
    userErrors {
      field
      message
    }
  }
}
```

### Inventory Management

Shopify tracks inventory at the **variant level** per **location**:

```graphql
# Query inventory
inventoryItem {
  id
  tracked
  inventoryLevels(first: 10) {
    edges {
      node {
        available
        location {
          name
        }
      }
    }
  }
}
```

---

## Recommended Field Additions

### Phase 1: Core Sync Infrastructure

Add to **Products collection** at root level (outside tabs):

```typescript
// Shopify Integration Group
{
  name: 'shopify',
  type: 'group',
  admin: {
    description: 'Shopify synchronization and integration data',
    position: 'sidebar',
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
      admin: {
        description: 'Sync error log',
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
          options: ['create', 'update', 'delete', 'variant_create', 'variant_update'],
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
```

### Phase 2: Variant-Level Sync

Update **finishes array** to track Shopify variant data:

```typescript
{
  name: 'finishes',
  type: 'array',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'priceModifier',
      type: 'number',
    },
    {
      name: 'available',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'imageUrl',
      type: 'text',
    },

    // ✅ NEW: Shopify Variant Fields
    {
      name: 'shopifyVariantId',
      type: 'text',
      admin: {
        description: 'Shopify Variant ID (gid://shopify/ProductVariant/...)',
        readOnly: true,
      },
    },
    {
      name: 'sku',
      type: 'text',
      admin: {
        description: 'Stock Keeping Unit for this finish',
        placeholder: 'e.g., CA99-EP (Ebony Polish)',
      },
    },
    {
      name: 'barcode',
      type: 'text',
      admin: {
        description: 'Product barcode/UPC for this finish',
      },
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
      name: 'inventoryQuantity',
      type: 'number',
      admin: {
        description: 'Current inventory quantity (synced from Shopify)',
        readOnly: true,
      },
    },
  ],
}
```

### Phase 3: Collections & Publishing

Add to **Settings tab**:

```typescript
{
  name: 'shopifyCollections',
  type: 'array',
  admin: {
    description: 'Shopify collections this product belongs to',
  },
  fields: [
    {
      name: 'collectionId',
      type: 'text',
      required: true,
      admin: {
        description: 'Shopify Collection ID (gid://shopify/Collection/...)',
      },
    },
    {
      name: 'collectionName',
      type: 'text',
      admin: {
        description: 'Collection name (for reference)',
        readOnly: true,
      },
    },
  ],
}
```

### Phase 4: Enhanced Metadata

Add to **Product Details tab**:

```typescript
{
  name: 'shopifyTags',
  type: 'array',
  admin: {
    description: 'Shopify-specific tags for search and filtering',
  },
  fields: [
    {
      name: 'tag',
      type: 'text',
      required: true,
    },
  ],
}
```

---

## Integration Architecture

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  Payload CMS Admin UI                                           │
│  User edits product → Save button                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │  Products Collection          │
         │  beforeChange Hook            │
         │  - Validate data              │
         │  - Set sync status: pending   │
         └───────────────┬───────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │  Products Collection          │
         │  afterChange Hook             │
         │  - Check autoSync flag        │
         │  - Determine operation type   │
         └───────────────┬───────────────┘
                         │
            ┌────────────┴────────────┐
            │                         │
            ▼                         ▼
    ┌───────────────┐         ┌──────────────┐
    │  Create New   │         │  Update      │
    │  Product      │         │  Existing    │
    └───────┬───────┘         └──────┬───────┘
            │                         │
            ▼                         ▼
┌──────────────────────────┐ ┌──────────────────────────┐
│ Shopify Admin API        │ │ Shopify Admin API        │
│ productCreate mutation   │ │ productUpdate mutation   │
│ - Map Payload → Shopify  │ │ - Map Payload → Shopify  │
│ - Create product         │ │ - Update product         │
│ - Return Shopify ID      │ │ - Update timestamps      │
└──────────┬───────────────┘ └──────┬───────────────────┘
           │                         │
           └────────────┬────────────┘
                        │
                        ▼
         ┌──────────────────────────────┐
         │  Update Payload Product      │
         │  - Save shopify.productId    │
         │  - Set syncStatus: synced    │
         │  - Update lastSyncedAt       │
         │  - Context flag to prevent   │
         │    infinite loop             │
         └──────────────────────────────┘
```

### Sync Operation Types

| Operation | Trigger | Shopify Mutation | Payload Update |
|-----------|---------|------------------|----------------|
| **Create** | New product created in Payload | `productCreate` | Store `shopify.productId` |
| **Update Product** | Product fields changed | `productUpdate` | Update `lastSyncedAt` |
| **Add Variants** | New finish added | `productVariantsBulkCreate` | Store `shopifyVariantId` per finish |
| **Update Variants** | Finish modified | `productVariantsBulkUpdate` | Update `lastSyncedAt` |
| **Delete Variants** | Finish removed | `productVariantsBulkDelete` | Remove `shopifyVariantId` |
| **Status Change** | `status` field changed | `productUpdate` with status | Sync `shopifyStatus` |

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1)

**Day 1-2: Add Shopify Fields**
- [ ] Add `shopify` group to Products collection
- [ ] Add `shopifyVariantId`, `sku`, `barcode` to finishes
- [ ] Run `bun run build` to generate types
- [ ] Test admin UI with new fields

**Day 3-4: Create Sync Utilities**
- [ ] Create `src/lib/shopify/products-admin.ts`
- [ ] Implement `syncProductToShopify(product)`
- [ ] Implement `createShopifyProduct(product)`
- [ ] Implement `updateShopifyProduct(product)`
- [ ] Add error handling and logging

**Day 5: Hook Integration**
- [ ] Add `afterChange` hook to Products collection
- [ ] Implement conditional sync (check `autoSync` flag)
- [ ] Test create/update flows
- [ ] Add context flags to prevent infinite loops

### Phase 2: Variant Management (Week 2)

**Day 6-7: Variant Sync**
- [ ] Implement `syncVariantsToShopify(productId, finishes)`
- [ ] Handle variant creation (bulk create)
- [ ] Handle variant updates (bulk update)
- [ ] Handle variant deletion

**Day 8-9: Inventory Integration**
- [ ] Query Shopify inventory levels
- [ ] Display in Payload admin (read-only)
- [ ] Optional: Update Payload inventory from Shopify

**Day 10: Testing & Refinement**
- [ ] End-to-end testing
- [ ] Error scenario testing
- [ ] Admin UI validation

### Phase 3: Advanced Features (Week 3+)

**Collections & Tags**
- [ ] Sync products to Shopify collections
- [ ] Bi-directional tag management
- [ ] Category → ProductType mapping

**Webhooks (Shopify → Payload)**
- [ ] Set up webhook endpoints
- [ ] Listen for `products/update` events
- [ ] Sync Shopify changes back to Payload

**Bulk Operations**
- [ ] Bulk sync all products
- [ ] Selective re-sync
- [ ] Sync dashboard/admin page

---

## Code Examples

### 1. Products Collection with Shopify Fields

```typescript
// src/collections/Products.ts

import type { CollectionConfig } from 'payload'
import { syncProductToShopify } from '@/lib/shopify/products-admin'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    group: 'Commerce',
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ... existing tabs ...

        // NEW: Shopify Integration Tab
        {
          label: 'Shopify Integration',
          description: 'Shopify synchronization settings and status',
          fields: [
            {
              name: 'shopify',
              type: 'group',
              fields: [
                {
                  name: 'productId',
                  type: 'text',
                  admin: {
                    description: 'Shopify Product ID (auto-populated on sync)',
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
                    description: 'Current sync status',
                    readOnly: true,
                  },
                },
                {
                  name: 'lastSyncedAt',
                  type: 'date',
                  admin: {
                    description: 'Last successful sync',
                    readOnly: true,
                  },
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
                  name: 'syncErrors',
                  type: 'array',
                  admin: {
                    description: 'Recent sync errors',
                    readOnly: true,
                  },
                  fields: [
                    {
                      name: 'timestamp',
                      type: 'date',
                    },
                    {
                      name: 'operation',
                      type: 'text',
                    },
                    {
                      name: 'errorMessage',
                      type: 'textarea',
                    },
                  ],
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
      async ({ data, req, operation, context }) => {
        // Set sync status to pending when changes are made
        if (data.shopify?.autoSync && !context.skipSync) {
          data.shopify = data.shopify || {}
          data.shopify.syncStatus = 'pending'
        }

        return data
      },
    ],

    afterChange: [
      async ({ doc, req, operation, context }) => {
        // Skip sync if context flag is set (prevents infinite loops)
        if (context.skipSync) return doc

        // Skip if auto-sync is disabled
        if (!doc.shopify?.autoSync) return doc

        // Skip if sync status is not pending
        if (doc.shopify?.syncStatus !== 'pending') return doc

        console.log(`[Shopify Sync] Syncing product: ${doc.name}`)

        try {
          // Sync to Shopify (fire-and-forget pattern)
          syncProductToShopify(doc, req).catch((err) => {
            console.error('[Shopify Sync] Error:', err)
          })
        } catch (error) {
          console.error('[Shopify Sync] Failed to initiate sync:', error)
        }

        return doc
      },
    ],
  },
}
```

### 2. Shopify Product Sync Utility

```typescript
// src/lib/shopify/products-admin.ts

import { shopifyAdminClient } from './admin-client'
import type { Product } from '@/payload-types'
import type { PayloadRequest } from 'payload'

/**
 * Sync a Payload product to Shopify
 * Creates if doesn't exist, updates if exists
 */
export async function syncProductToShopify(
  product: Product,
  req: PayloadRequest
): Promise<void> {
  const isCreate = !product.shopify?.productId

  try {
    if (isCreate) {
      await createShopifyProduct(product, req)
    } else {
      await updateShopifyProduct(product, req)
    }
  } catch (error) {
    console.error('[Shopify Sync] Error:', error)

    // Update product with error status
    await req.payload.update({
      collection: 'products',
      id: product.id,
      data: {
        shopify: {
          ...product.shopify,
          syncStatus: 'error',
          syncErrors: [
            ...(product.shopify?.syncErrors || []),
            {
              timestamp: new Date().toISOString(),
              operation: isCreate ? 'create' : 'update',
              errorMessage: error instanceof Error ? error.message : 'Unknown error',
            },
          ],
        },
      },
      context: { skipSync: true }, // Prevent infinite loop
      req,
    })

    throw error
  }
}

/**
 * Create a new product in Shopify
 */
async function createShopifyProduct(
  product: Product,
  req: PayloadRequest
): Promise<void> {
  console.log('[Shopify] Creating product:', product.name)

  // Map Payload status to Shopify status
  const shopifyStatus = mapPayloadStatusToShopify(product.status)

  // Build variants from finishes
  const variants = buildVariantsFromFinishes(product)

  // Build media array
  const media = buildMediaArray(product)

  const mutation = `
    mutation ProductCreate($input: ProductCreateInput!) {
      productCreate(input: $input) {
        product {
          id
          title
          handle
          status
          variants(first: 50) {
            edges {
              node {
                id
                title
                sku
                price
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const variables = {
    input: {
      title: product.name,
      handle: product.slug,
      descriptionHtml: convertToHtml(product.description),
      vendor: product.brand || 'Kawai',
      productType: product.category,
      status: shopifyStatus,
      tags: buildTags(product),
      variants: variants,
      seo: {
        title: product.seo?.metaTitle || product.name,
        description: product.seo?.metaDescription || product.description,
      },
    },
  }

  const response = await shopifyAdminClient.mutate(mutation, variables)

  if (response.productCreate.userErrors.length > 0) {
    throw new Error(
      `Shopify errors: ${response.productCreate.userErrors.map((e: any) => e.message).join(', ')}`
    )
  }

  const createdProduct = response.productCreate.product

  // Update Payload product with Shopify IDs
  await req.payload.update({
    collection: 'products',
    id: product.id,
    data: {
      shopify: {
        productId: createdProduct.id,
        handle: createdProduct.handle,
        syncStatus: 'synced',
        lastSyncedAt: new Date().toISOString(),
        shopifyStatus: createdProduct.status,
      },
      // Update finishes with variant IDs
      finishes: product.finishes?.map((finish, index) => ({
        ...finish,
        shopifyVariantId: createdProduct.variants.edges[index]?.node.id,
      })),
    },
    context: { skipSync: true }, // Prevent infinite loop
    req,
  })

  console.log('[Shopify] Product created:', createdProduct.id)
}

/**
 * Update an existing product in Shopify
 */
async function updateShopifyProduct(
  product: Product,
  req: PayloadRequest
): Promise<void> {
  console.log('[Shopify] Updating product:', product.shopify?.productId)

  if (!product.shopify?.productId) {
    throw new Error('Cannot update product without Shopify ID')
  }

  const shopifyStatus = mapPayloadStatusToShopify(product.status)

  const mutation = `
    mutation ProductUpdate($input: ProductUpdateInput!) {
      productUpdate(input: $input) {
        product {
          id
          title
          updatedAt
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const variables = {
    input: {
      id: product.shopify.productId,
      title: product.name,
      descriptionHtml: convertToHtml(product.description),
      vendor: product.brand || 'Kawai',
      productType: product.category,
      status: shopifyStatus,
      tags: buildTags(product),
      seo: {
        title: product.seo?.metaTitle || product.name,
        description: product.seo?.metaDescription || product.description,
      },
    },
  }

  const response = await shopifyAdminClient.mutate(mutation, variables)

  if (response.productUpdate.userErrors.length > 0) {
    throw new Error(
      `Shopify errors: ${response.productUpdate.userErrors.map((e: any) => e.message).join(', ')}`
    )
  }

  // Update sync status
  await req.payload.update({
    collection: 'products',
    id: product.id,
    data: {
      shopify: {
        ...product.shopify,
        syncStatus: 'synced',
        lastSyncedAt: new Date().toISOString(),
      },
    },
    context: { skipSync: true },
    req,
  })

  console.log('[Shopify] Product updated:', product.shopify.productId)
}

/**
 * Map Payload product status to Shopify status
 */
function mapPayloadStatusToShopify(
  status?: string
): 'ACTIVE' | 'DRAFT' | 'ARCHIVED' {
  switch (status) {
    case 'active':
      return 'ACTIVE'
    case 'draft':
    case 'coming-soon':
      return 'DRAFT'
    case 'discontinued':
      return 'ARCHIVED'
    default:
      return 'DRAFT'
  }
}

/**
 * Build Shopify variants from Payload finishes
 */
function buildVariantsFromFinishes(product: Product): any[] {
  if (!product.finishes || product.finishes.length === 0) {
    // Create default variant
    return [
      {
        price: {
          amount: product.price?.msrp || 0,
          currencyCode: product.price?.currency || 'USD',
        },
        sku: product.specifications?.sku || product.model || product.slug,
      },
    ]
  }

  return product.finishes.map((finish) => ({
    price: {
      amount: (product.price?.msrp || 0) + (finish.priceModifier || 0),
      currencyCode: product.price?.currency || 'USD',
    },
    compareAtPrice: product.price?.salePrice ? {
      amount: product.price.salePrice,
      currencyCode: product.price.currency || 'USD',
    } : undefined,
    sku: finish.sku || `${product.model}-${finish.name.replace(/\s+/g, '-').toUpperCase()}`,
    barcode: finish.barcode,
    optionValues: [
      {
        optionName: 'Finish',
        name: finish.name,
      },
    ],
    inventoryPolicy: finish.inventoryPolicy || 'DENY',
    weight: finish.weight ? {
      value: finish.weight.value,
      unit: finish.weight.unit,
    } : undefined,
  }))
}

/**
 * Build media array for Shopify
 */
function buildMediaArray(product: Product): any[] {
  const media: any[] = []

  // Add main image
  if (product.mainImage && typeof product.mainImage === 'object') {
    media.push({
      originalSource: product.mainImage.url,
      mediaContentType: 'IMAGE',
    })
  }

  // Add finish images
  product.finishes?.forEach((finish) => {
    if (finish.image && typeof finish.image === 'object') {
      media.push({
        originalSource: finish.image.url,
        mediaContentType: 'IMAGE',
      })
    }
  })

  return media
}

/**
 * Build tags array for Shopify
 */
function buildTags(product: Product): string[] {
  const tags: string[] = []

  // Add category
  if (product.category) {
    tags.push(product.category)
  }

  // Add model (for tag-based matching)
  if (product.model) {
    tags.push(product.model)
  }

  // Add type
  if (product.type) {
    tags.push(product.type)
  }

  // Add series
  if (product.series) {
    tags.push(product.series)
  }

  // Add badge
  if (product.badge) {
    tags.push(product.badge)
  }

  return tags
}

/**
 * Convert plain text description to HTML
 */
function convertToHtml(text?: string): string {
  if (!text) return ''
  return `<p>${text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`
}
```

### 3. Admin Client Updates

Update `src/lib/shopify/admin-client.ts` to add a `mutate` helper:

```typescript
// Add to existing admin-client.ts

/**
 * Execute a GraphQL mutation
 */
export async function mutate<T = any>(
  mutation: string,
  variables?: Record<string, any>
): Promise<T> {
  const token = await getAdminAccessToken()

  const response = await fetch(
    `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({ query: mutation, variables }),
    }
  )

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.statusText}`)
  }

  const json = await response.json()

  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`)
  }

  return json.data
}

export const shopifyAdminClient = {
  query,
  mutate,
}
```

---

## Testing Plan

### Unit Tests

```typescript
// tests/shopify-product-sync.test.ts

import { syncProductToShopify } from '@/lib/shopify/products-admin'

describe('Shopify Product Sync', () => {
  it('should create a new product in Shopify', async () => {
    const mockProduct = {
      id: '1',
      name: 'CA-99 Digital Piano',
      slug: 'ca-99-digital-piano',
      description: 'Premium digital piano',
      price: { msrp: 6999, currency: 'USD' },
      brand: 'Kawai',
      category: 'digital',
      model: 'CA99',
      shopify: { autoSync: true, syncStatus: 'pending' },
    }

    await syncProductToShopify(mockProduct, mockReq)

    // Assert product was created
    // Assert Shopify ID was saved
  })

  it('should update an existing product', async () => {
    // Test update flow
  })

  it('should handle variant sync', async () => {
    // Test variant creation/update
  })

  it('should log errors properly', async () => {
    // Test error handling
  })
})
```

### Manual Testing Checklist

- [ ] Create new product in Payload → Verify in Shopify
- [ ] Update product title → Verify sync
- [ ] Add finish → Verify variant created
- [ ] Update finish price → Verify variant updated
- [ ] Remove finish → Verify variant deleted
- [ ] Change status → Verify Shopify status
- [ ] Disable autoSync → Verify no sync
- [ ] Test error scenarios (invalid data, API failures)
- [ ] Verify sync status updates correctly
- [ ] Check error logging

---

## Next Steps

1. **Review this document** with your team
2. **Prioritize phases** based on business needs
3. **Provision Shopify API credentials** (if not already done)
4. **Set up development environment** for testing
5. **Begin Phase 1 implementation** (add fields)
6. **Iterate and refine** based on real-world usage

---

## Questions to Answer

Before implementing, clarify:

1. **Sync Direction:**
   - Payload → Shopify only? (one-way sync)
   - Or bidirectional? (Shopify updates also sync to Payload via webhooks)

2. **Inventory Management:**
   - Should Payload track inventory or just display Shopify inventory?
   - Do you need multi-location inventory support?

3. **Variant Strategy:**
   - Are finishes the only variant dimension?
   - Do you need to support multiple options (e.g., Finish + Size)?

4. **Collections:**
   - Should Products automatically join Shopify collections based on category?
   - Manual collection assignment or automatic?

5. **Pricing Strategy:**
   - Should Shopify be source of truth for pricing?
   - Or Payload → Shopify pricing sync?

---

## Resources

- **Shopify Admin API Docs:** https://shopify.dev/docs/api/admin-graphql/2025-07
- **GraphQL Explorer:** https://shopify.dev/docs/apps/tools/graphiql-admin-api
- **Product Management Guide:** https://shopify.dev/docs/api/admin-graphql/2025-07/objects/Product
- **OAuth Setup:** https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/client-credentials-grant

---

**Document Version:** 1.0
**Last Updated:** 2026-01-14
**Author:** Claude Code Analysis
