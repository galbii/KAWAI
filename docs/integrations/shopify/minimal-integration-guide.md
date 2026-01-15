# Minimal Shopify Integration - Payload as Content CMS

> **Strategy:** Payload CMS is the source of truth for product content. Shopify is the commerce backend.
> **Sync Direction:** One-way (Payload → Shopify only)
> **Approach:** Create product in Payload → Push to Shopify → Save Shopify ID

---

## Architecture Overview

This is the **modern headless commerce pattern** - perfect for your use case:

```
Content Team creates product in Payload CMS
              ↓
     (Rich content, blocks, media)
              ↓
     Save triggers Shopify sync
              ↓
     Push minimal data to Shopify (title, price, vendor, etc.)
              ↓
     Shopify returns Product ID
              ↓
     Save Shopify ID back to Payload
              ↓
     Done! Product lives in both systems
```

**Why this is the right approach:**
- ✅ Marketing/content control in Payload (flexible, powerful)
- ✅ Commerce/inventory in Shopify (proven, reliable)
- ✅ Simple one-way sync (no conflicts)
- ✅ Minimal integration surface (less maintenance)
- ✅ Each system does what it's best at

---

## Minimal Fields to Add

### 1. Add to Product Details Tab

Replace the deprecated `shopifyHandle` field (line 340-347) with these essential fields:

```typescript
// REPLACE THIS SECTION (lines 339-347)
// Shopify Integration - Essential Fields Only
{
  name: 'vendor',
  type: 'text',
  defaultValue: 'Kawai America',
  admin: {
    description: 'Product vendor/manufacturer (synced to Shopify)'
  }
},
{
  name: 'shopifyTags',
  type: 'array',
  admin: {
    description: 'Tags for Shopify search and filtering',
  },
  fields: [
    {
      name: 'tag',
      type: 'text',
      required: true,
    }
  ]
},
{
  name: 'shopifyCollections',
  type: 'array',
  admin: {
    description: 'Shopify collections to add this product to',
  },
  fields: [
    {
      name: 'collectionId',
      type: 'text',
      required: true,
      admin: {
        description: 'Shopify Collection ID (e.g., gid://shopify/Collection/123456)',
        placeholder: 'gid://shopify/Collection/...'
      }
    },
    {
      name: 'collectionName',
      type: 'text',
      admin: {
        description: 'Collection name (for reference only)',
        readOnly: true,
      }
    }
  ]
},
```

### 2. Add New "Shopify Sync" Tab

Add this as a **new tab** (after SEO & Meta tab, before Settings tab):

```typescript
// Add to tabs array around line 638
{
  label: 'Shopify Sync',
  description: 'Shopify integration status',
  fields: [
    {
      name: 'shopify',
      type: 'group',
      fields: [
        {
          name: 'productId',
          type: 'text',
          admin: {
            description: 'Shopify Product ID (auto-populated when synced)',
            readOnly: true,
            position: 'sidebar',
          }
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
            position: 'sidebar',
          }
        },
        {
          name: 'lastSyncedAt',
          type: 'date',
          admin: {
            description: 'Last successful sync to Shopify',
            readOnly: true,
            position: 'sidebar',
          }
        },
        {
          name: 'autoSync',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Automatically sync to Shopify on save',
            position: 'sidebar',
          }
        },
        {
          name: 'lastError',
          type: 'textarea',
          admin: {
            description: 'Last sync error (if any)',
            readOnly: true,
          }
        },
      ]
    }
  ]
}
```

---

## Field Mapping Reference

| Payload Field | Shopify Field | Notes |
|--------------|---------------|-------|
| `name` | `title` | Product title |
| `slug` | `handle` | URL-friendly identifier |
| `description` | `descriptionHtml` | Convert plain text → HTML |
| `vendor` | `vendor` | Default: "Kawai America" |
| `category` | `productType` | e.g., "Digital Piano", "Grand Piano" |
| `shopifyTags[]` | `tags[]` | Search keywords |
| `shopifyCollections[]` | `collectionsToJoin[]` | Collection IDs |
| `price.msrp` | `variants[0].price` | First variant price |
| `model` | `tags[]` | Add model as tag (e.g., "CA99") |
| `mainImage` | `media[0]` | Featured image |
| `status` | `status` | active → ACTIVE, draft → DRAFT |

---

## Implementation Code

### 1. Update Products Collection

```typescript
// src/collections/Products.ts

import type { CollectionConfig } from 'payload'
import { syncProductToShopify } from '@/lib/shopify/products-sync'

export const Products: CollectionConfig = {
  slug: 'products',
  // ... existing config ...

  hooks: {
    beforeChange: [
      async ({ data, req, operation, context }) => {
        // Existing slug generation hook...

        // Mark for sync if autoSync is enabled
        if (data.shopify?.autoSync && !context.skipShopifySync) {
          data.shopify = data.shopify || {}
          data.shopify.syncStatus = 'pending'
        }

        return data
      }
    ],

    afterChange: [
      async ({ doc, req, operation, context }) => {
        // Skip if sync is disabled or already in progress
        if (context.skipShopifySync) return doc
        if (!doc.shopify?.autoSync) return doc
        if (doc.shopify?.syncStatus !== 'pending') return doc

        // Fire and forget - don't block the save operation
        syncProductToShopify(doc, req).catch(err => {
          console.error('[Shopify Sync] Error:', err)
        })

        return doc
      }
    ]
  }
}
```

### 2. Create Sync Utility

```typescript
// src/lib/shopify/products-sync.ts

import { shopifyAdminClient } from './admin-client'
import type { Product } from '@/payload-types'
import type { PayloadRequest } from 'payload'

/**
 * Sync a Payload product to Shopify
 * Creates if new, updates if exists
 */
export async function syncProductToShopify(
  product: Product,
  req: PayloadRequest
): Promise<void> {
  const isCreate = !product.shopify?.productId

  console.log(`[Shopify Sync] ${isCreate ? 'Creating' : 'Updating'} product: ${product.name}`)

  try {
    if (isCreate) {
      await createShopifyProduct(product, req)
    } else {
      await updateShopifyProduct(product, req)
    }
  } catch (error) {
    console.error('[Shopify Sync] Failed:', error)

    // Save error to product
    await req.payload.update({
      collection: 'products',
      id: product.id,
      data: {
        shopify: {
          ...product.shopify,
          syncStatus: 'error',
          lastError: error instanceof Error ? error.message : 'Unknown error',
        }
      },
      context: { skipShopifySync: true }, // Prevent infinite loop
      req,
    })

    throw error
  }
}

/**
 * Create new product in Shopify
 */
async function createShopifyProduct(
  product: Product,
  req: PayloadRequest
): Promise<void> {

  const mutation = `
    mutation ProductCreate($input: ProductCreateInput!) {
      productCreate(input: $input) {
        product {
          id
          title
          handle
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
      vendor: product.vendor || 'Kawai America',
      productType: product.category,
      status: mapStatus(product.status),
      tags: buildTags(product),
      collectionsToJoin: product.shopifyCollections?.map(c => c.collectionId) || [],

      // Create default variant with pricing
      variants: [{
        price: {
          amount: String(product.price?.msrp || 0),
          currencyCode: product.price?.currency || 'USD'
        },
        sku: product.specifications?.sku || product.model || product.slug,
      }],

      // Add featured image
      media: product.mainImage && typeof product.mainImage === 'object' ? [{
        originalSource: product.mainImage.url,
        mediaContentType: 'IMAGE'
      }] : [],

      // SEO metadata
      seo: {
        title: product.seo?.metaTitle || product.name,
        description: product.seo?.metaDescription || product.description,
      }
    }
  }

  const response = await shopifyAdminClient.mutate(mutation, variables)

  if (response.productCreate.userErrors.length > 0) {
    const errors = response.productCreate.userErrors.map((e: any) => e.message).join(', ')
    throw new Error(`Shopify validation errors: ${errors}`)
  }

  const shopifyProduct = response.productCreate.product

  // Save Shopify ID back to Payload
  await req.payload.update({
    collection: 'products',
    id: product.id,
    data: {
      shopify: {
        productId: shopifyProduct.id,
        syncStatus: 'synced',
        lastSyncedAt: new Date().toISOString(),
        lastError: null,
      }
    },
    context: { skipShopifySync: true }, // CRITICAL: Prevent infinite loop
    req,
  })

  console.log('[Shopify Sync] Created product:', shopifyProduct.id)
}

/**
 * Update existing product in Shopify
 */
async function updateShopifyProduct(
  product: Product,
  req: PayloadRequest
): Promise<void> {

  if (!product.shopify?.productId) {
    throw new Error('Cannot update: No Shopify product ID')
  }

  const mutation = `
    mutation ProductUpdate($input: ProductUpdateInput!) {
      productUpdate(input: $input) {
        product {
          id
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
      vendor: product.vendor || 'Kawai America',
      productType: product.category,
      status: mapStatus(product.status),
      tags: buildTags(product),
      collectionsToJoin: product.shopifyCollections?.map(c => c.collectionId) || [],
      seo: {
        title: product.seo?.metaTitle || product.name,
        description: product.seo?.metaDescription || product.description,
      }
    }
  }

  const response = await shopifyAdminClient.mutate(mutation, variables)

  if (response.productUpdate.userErrors.length > 0) {
    const errors = response.productUpdate.userErrors.map((e: any) => e.message).join(', ')
    throw new Error(`Shopify validation errors: ${errors}`)
  }

  // Update sync timestamp
  await req.payload.update({
    collection: 'products',
    id: product.id,
    data: {
      shopify: {
        ...product.shopify,
        syncStatus: 'synced',
        lastSyncedAt: new Date().toISOString(),
        lastError: null,
      }
    },
    context: { skipShopifySync: true },
    req,
  })

  console.log('[Shopify Sync] Updated product:', product.shopify.productId)
}

/**
 * Convert plain text description to HTML
 */
function convertToHtml(text?: string): string {
  if (!text) return ''
  // Convert newlines to paragraphs
  return `<p>${text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`
}

/**
 * Map Payload status to Shopify status
 */
function mapStatus(status?: string): 'ACTIVE' | 'DRAFT' | 'ARCHIVED' {
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
 * Build tags array for Shopify
 */
function buildTags(product: Product): string[] {
  const tags: string[] = []

  // Add category
  if (product.category) {
    tags.push(product.category)
  }

  // Add model (for matching with existing Shopify integration)
  if (product.model) {
    tags.push(product.model)
  }

  // Add custom Shopify tags
  if (product.shopifyTags) {
    product.shopifyTags.forEach(t => {
      if (t.tag) tags.push(t.tag)
    })
  }

  // Add type
  if (product.type) {
    tags.push(product.type)
  }

  return tags
}
```

### 3. Add Mutation Helper to Admin Client

Update `src/lib/shopify/admin-client.ts`:

```typescript
// Add this function to existing admin-client.ts

/**
 * Execute a GraphQL mutation
 */
async function mutate<T = any>(
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
      cache: 'no-store', // Never cache mutations
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Shopify API error (${response.status}): ${errorText}`)
  }

  const json = await response.json()

  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`)
  }

  return json.data
}

// Export both query and mutate
export const shopifyAdminClient = {
  query,
  mutate,
}
```

---

## How It Works

### Step-by-Step Flow

1. **Content Team Creates Product in Payload:**
   ```
   Name: "CA-99 Digital Piano"
   Description: "Premium digital piano with..."
   Category: "digital"
   Vendor: "Kawai America" (auto-filled)
   Price: $6,999
   Shopify Tags: ["featured", "best-seller"]
   Auto Sync: ✅ Enabled
   ```

2. **Save Triggers beforeChange Hook:**
   - Sets `shopify.syncStatus = 'pending'`

3. **afterChange Hook Fires (async):**
   - Checks if `autoSync` is enabled
   - Checks if Shopify product ID exists
   - Calls `createShopifyProduct()` or `updateShopifyProduct()`

4. **Sync to Shopify:**
   - Sends GraphQL mutation with mapped fields
   - Shopify creates product
   - Returns Shopify product ID: `gid://shopify/Product/123456`

5. **Update Payload Product:**
   - Saves Shopify ID to `shopify.productId`
   - Sets `syncStatus = 'synced'`
   - Records `lastSyncedAt` timestamp

6. **Done!**
   - Product exists in both systems
   - Shopify handles cart/checkout
   - Payload handles content/marketing

---

## Testing Checklist

- [ ] Add new fields to Products collection
- [ ] Run `bun run build` to generate types
- [ ] Create test product in Payload
- [ ] Verify Shopify product created
- [ ] Check Shopify ID saved back to Payload
- [ ] Update product in Payload
- [ ] Verify Shopify product updated
- [ ] Test error handling (invalid data)
- [ ] Verify sync status updates correctly

---

## Common Scenarios

### 1. Create Product

```
Payload: Create new product → Save
   ↓
Hook: Set syncStatus = 'pending'
   ↓
Sync: Call productCreate mutation
   ↓
Shopify: Returns product ID
   ↓
Payload: Save ID, set syncStatus = 'synced'
```

### 2. Update Product

```
Payload: Update existing product → Save
   ↓
Hook: Set syncStatus = 'pending'
   ↓
Sync: Call productUpdate mutation (using saved ID)
   ↓
Shopify: Updates product
   ↓
Payload: Set syncStatus = 'synced'
```

### 3. Error Handling

```
Payload: Save product with invalid data
   ↓
Sync: Call Shopify API → Error response
   ↓
Payload: Save error message, set syncStatus = 'error'
   ↓
Admin: Review error in "Shopify Sync" tab
```

---

## FAQ

**Q: What if I need to manage variants (finishes)?**
A: For now, create a default variant. Later, you can sync finishes as variants using `productVariantsBulkCreate`.

**Q: Can I sync images?**
A: Yes! The `mainImage` is automatically synced as the featured image. You can add more images later.

**Q: What if sync fails?**
A: The error is saved to `shopify.lastError` field. Check the "Shopify Sync" tab in the admin.

**Q: Can I disable auto-sync for specific products?**
A: Yes! Uncheck the "Auto Sync" checkbox in the "Shopify Sync" tab.

**Q: How do I get Shopify Collection IDs?**
A: Use Shopify's GraphQL Admin API explorer or run this query:
```graphql
{
  collections(first: 10) {
    edges {
      node {
        id
        title
      }
    }
  }
}
```

**Q: What about inventory tracking?**
A: Shopify handles inventory. You can query it via the Storefront API (already in your integration) for display purposes.

---

## Next Steps

1. ✅ Add the minimal fields to Products collection
2. ✅ Create `products-sync.ts` utility
3. ✅ Update `admin-client.ts` with mutate function
4. ✅ Test with a sample product
5. ✅ Roll out to production

---

**Document Version:** 1.0 (Minimal)
**Last Updated:** 2026-01-14
**Philosophy:** Simple, focused, maintainable
