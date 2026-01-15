# Read-Only Shopify Integration - Shopify as Source of Truth

> **Strategy:** Shopify is the source of truth for products. Payload CMS fetches product data and adds marketing content.
> **Data Flow:** Shopify → Payload (read-only)
> **Approach:** Create product in Shopify → Paste ID in Payload → Fetch data → Build custom page

---

## Architecture Overview

This is the **simplest possible integration** - Payload acts as a presentation layer on top of Shopify:

```
Content Team Workflow:
    1. Create product in Shopify Admin UI
    2. Copy Shopify Product ID
    3. Create product page in Payload CMS
    4. Paste Shopify Product ID
    5. Payload fetches product data automatically
    6. Add custom content blocks for rich page
    7. Publish!
```

**Why this approach is superior:**
- ✅ **Zero sync logic** - No mutations, webhooks, or state management
- ✅ **Shopify expertise** - Use Shopify for what it's best at (commerce)
- ✅ **Payload expertise** - Use Payload for what it's best at (content)
- ✅ **Always fresh** - Product data fetched on-demand from Shopify
- ✅ **No conflicts** - Read-only = no sync issues
- ✅ **Simple maintenance** - Just API fetches, nothing complex

**Real-world examples:**
- Allbirds uses Shopify + Contentful (same pattern)
- Gymshark uses Shopify + custom CMS (same pattern)
- Rebecca Minkoff uses Shopify + headless CMS (same pattern)

---

## Minimal Fields Needed

### Products Collection Changes

**Option A: Minimal Reference (Recommended)**

Just store the Shopify Product ID and fetch everything else:

```typescript
// Add to Product Details tab (replace shopifyHandle field)

{
  name: 'shopifyProductId',
  type: 'text',
  required: false,
  admin: {
    description: 'Shopify Product ID or handle (e.g., "gid://shopify/Product/123" or "ca-99-digital-piano")',
    placeholder: 'gid://shopify/Product/123456 or product-handle',
  },
  validate: async (value: string | null | undefined, { data }: { data: any }) => {
    if (!value) return true // Optional field

    // Allow both GID format and handle
    const isGid = value.startsWith('gid://shopify/Product/')
    const isHandle = /^[a-z0-9-]+$/.test(value)

    if (!isGid && !isHandle) {
      return 'Must be a Shopify Product ID (gid://shopify/Product/123) or handle (product-slug)'
    }

    return true
  }
},
{
  name: 'shopifyData',
  type: 'group',
  admin: {
    description: 'Product data fetched from Shopify (read-only, auto-updated)',
    condition: (data) => !!data.shopifyProductId,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Product title from Shopify',
        readOnly: true,
      }
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Product description from Shopify',
        readOnly: true,
      }
    },
    {
      name: 'price',
      type: 'text',
      admin: {
        description: 'Product price from Shopify',
        readOnly: true,
      }
    },
    {
      name: 'vendor',
      type: 'text',
      admin: {
        description: 'Product vendor from Shopify',
        readOnly: true,
      }
    },
    {
      name: 'productType',
      type: 'text',
      admin: {
        description: 'Product type from Shopify',
        readOnly: true,
      }
    },
    {
      name: 'tags',
      type: 'array',
      admin: {
        description: 'Product tags from Shopify',
        readOnly: true,
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
        }
      ]
    },
    {
      name: 'images',
      type: 'array',
      admin: {
        description: 'Product images from Shopify',
        readOnly: true,
      },
      fields: [
        {
          name: 'url',
          type: 'text',
        },
        {
          name: 'alt',
          type: 'text',
        },
        {
          name: 'width',
          type: 'number',
        },
        {
          name: 'height',
          type: 'number',
        }
      ]
    },
    {
      name: 'variants',
      type: 'array',
      admin: {
        description: 'Product variants from Shopify',
        readOnly: true,
      },
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'price',
          type: 'text',
        },
        {
          name: 'sku',
          type: 'text',
        },
        {
          name: 'available',
          type: 'checkbox',
        }
      ]
    },
    {
      name: 'lastFetchedAt',
      type: 'date',
      admin: {
        description: 'Last time data was fetched from Shopify',
        readOnly: true,
      }
    },
    {
      name: 'fetchError',
      type: 'text',
      admin: {
        description: 'Error message if fetch failed',
        readOnly: true,
      }
    }
  ]
}
```

**Option B: Hybrid Approach**

Allow manual override of Shopify data for special cases:

```typescript
{
  name: 'dataSource',
  type: 'radio',
  defaultValue: 'shopify',
  options: [
    { label: 'Fetch from Shopify', value: 'shopify' },
    { label: 'Manual Entry', value: 'manual' },
  ],
  admin: {
    description: 'Where to get product data from',
  }
},
{
  name: 'shopifyProductId',
  type: 'text',
  admin: {
    description: 'Shopify Product ID or handle',
    condition: (data) => data.dataSource === 'shopify',
  }
},
// Existing fields (name, description, price, etc.) shown when dataSource = 'manual'
```

---

## Implementation Code

### 1. Create Shopify Fetch Utility

```typescript
// src/lib/shopify/fetch-product.ts

import { shopifyAdminClient } from './admin-client'
import type { Product as ShopifyProduct } from './types'

/**
 * Fetch product data from Shopify by ID or handle
 */
export async function fetchShopifyProduct(
  idOrHandle: string
): Promise<ShopifyProduct | null> {

  // Determine if input is a GID or handle
  const isGid = idOrHandle.startsWith('gid://shopify/Product/')

  const query = `
    query GetProduct($id: ID, $handle: String) {
      product(id: $id) @include(if: $isGid) {
        ...ProductFields
      }
      productByHandle(handle: $handle) @include(if: $isHandle) {
        ...ProductFields
      }
    }

    fragment ProductFields on Product {
      id
      title
      handle
      description
      descriptionHtml
      vendor
      productType
      tags
      status
      priceRangeV2 {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 20) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            price
            compareAtPrice
            sku
            barcode
            availableForSale
            inventoryQuantity
            selectedOptions {
              name
              value
            }
          }
        }
      }
      featuredImage {
        url
        altText
        width
        height
      }
      seo {
        title
        description
      }
      metafields(first: 20) {
        edges {
          node {
            namespace
            key
            value
            type
          }
        }
      }
    }
  `

  const variables = isGid
    ? { id: idOrHandle, isGid: true, isHandle: false }
    : { handle: idOrHandle, isGid: false, isHandle: true }

  try {
    const response = await shopifyAdminClient.query(query, variables)

    const product = isGid ? response.product : response.productByHandle

    if (!product) {
      console.warn('[Shopify Fetch] Product not found:', idOrHandle)
      return null
    }

    return transformShopifyProduct(product)

  } catch (error) {
    console.error('[Shopify Fetch] Error fetching product:', error)
    throw error
  }
}

/**
 * Transform Shopify GraphQL response to simplified format
 */
function transformShopifyProduct(shopifyProduct: any): ShopifyProduct {
  return {
    id: shopifyProduct.id,
    title: shopifyProduct.title,
    handle: shopifyProduct.handle,
    description: shopifyProduct.description,
    descriptionHtml: shopifyProduct.descriptionHtml,
    vendor: shopifyProduct.vendor,
    productType: shopifyProduct.productType,
    tags: shopifyProduct.tags || [],
    status: shopifyProduct.status,

    price: {
      min: parseFloat(shopifyProduct.priceRangeV2.minVariantPrice.amount),
      max: parseFloat(shopifyProduct.priceRangeV2.maxVariantPrice.amount),
      currency: shopifyProduct.priceRangeV2.minVariantPrice.currencyCode,
      display: formatPrice(shopifyProduct.priceRangeV2),
    },

    images: shopifyProduct.images.edges.map((edge: any) => ({
      url: edge.node.url,
      alt: edge.node.altText || '',
      width: edge.node.width,
      height: edge.node.height,
    })),

    featuredImage: shopifyProduct.featuredImage ? {
      url: shopifyProduct.featuredImage.url,
      alt: shopifyProduct.featuredImage.altText || '',
      width: shopifyProduct.featuredImage.width,
      height: shopifyProduct.featuredImage.height,
    } : null,

    variants: shopifyProduct.variants.edges.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      price: parseFloat(edge.node.price),
      compareAtPrice: edge.node.compareAtPrice ? parseFloat(edge.node.compareAtPrice) : null,
      sku: edge.node.sku,
      barcode: edge.node.barcode,
      available: edge.node.availableForSale,
      inventoryQuantity: edge.node.inventoryQuantity,
      options: edge.node.selectedOptions.map((opt: any) => ({
        name: opt.name,
        value: opt.value,
      })),
    })),

    seo: {
      title: shopifyProduct.seo.title || shopifyProduct.title,
      description: shopifyProduct.seo.description || shopifyProduct.description,
    },

    metafields: shopifyProduct.metafields.edges.map((edge: any) => ({
      namespace: edge.node.namespace,
      key: edge.node.key,
      value: edge.node.value,
      type: edge.node.type,
    })),
  }
}

/**
 * Format price range for display
 */
function formatPrice(priceRange: any): string {
  const min = parseFloat(priceRange.minVariantPrice.amount)
  const max = parseFloat(priceRange.maxVariantPrice.amount)
  const currency = priceRange.minVariantPrice.currencyCode

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  })

  if (min === max) {
    return formatter.format(min)
  }

  return `${formatter.format(min)} - ${formatter.format(max)}`
}
```

### 2. Add Hook to Products Collection

```typescript
// src/collections/Products.ts

import { fetchShopifyProduct } from '@/lib/shopify/fetch-product'

export const Products: CollectionConfig = {
  slug: 'products',
  // ... existing config ...

  hooks: {
    beforeChange: [
      async ({ data, req, operation, context }) => {
        // Skip if context flag is set (prevents infinite loop)
        if (context.skipShopifyFetch) return data

        // If shopifyProductId is provided, fetch data from Shopify
        if (data.shopifyProductId) {
          console.log('[Shopify Fetch] Fetching product:', data.shopifyProductId)

          try {
            const shopifyProduct = await fetchShopifyProduct(data.shopifyProductId)

            if (shopifyProduct) {
              // Populate shopifyData group with fetched data
              data.shopifyData = {
                title: shopifyProduct.title,
                description: shopifyProduct.description,
                price: shopifyProduct.price.display,
                vendor: shopifyProduct.vendor,
                productType: shopifyProduct.productType,
                tags: shopifyProduct.tags.map((tag: string) => ({ tag })),
                images: shopifyProduct.images,
                variants: shopifyProduct.variants.map((v: any) => ({
                  id: v.id,
                  title: v.title,
                  price: v.price.toString(),
                  sku: v.sku,
                  available: v.available,
                })),
                lastFetchedAt: new Date().toISOString(),
                fetchError: null,
              }

              // Auto-populate some main fields (optional)
              if (!data.name) {
                data.name = shopifyProduct.title
              }
              if (!data.slug) {
                data.slug = shopifyProduct.handle
              }
              if (!data.description) {
                data.description = shopifyProduct.description
              }

              console.log('[Shopify Fetch] Successfully fetched:', shopifyProduct.title)
            } else {
              // Product not found
              data.shopifyData = {
                ...data.shopifyData,
                fetchError: 'Product not found in Shopify',
                lastFetchedAt: new Date().toISOString(),
              }
            }
          } catch (error) {
            console.error('[Shopify Fetch] Error:', error)

            data.shopifyData = {
              ...data.shopifyData,
              fetchError: error instanceof Error ? error.message : 'Unknown error',
              lastFetchedAt: new Date().toISOString(),
            }
          }
        }

        return data
      }
    ],
  }
}
```

### 3. Create Custom Admin Component (Optional)

For better UX, create a custom field component that shows a "Fetch" button:

```typescript
// src/components/admin/ShopifyProductFetcher.tsx
'use client'

import { useField } from '@payloadcms/ui'
import { Button } from '@payloadcms/ui'

export function ShopifyProductFetcher() {
  const { value, setValue } = useField<string>({ path: 'shopifyProductId' })
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleFetch() {
    if (!value) {
      setError('Please enter a Shopify Product ID or handle')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Trigger form save to run the beforeChange hook
      // This will fetch the data from Shopify
      const form = document.querySelector('form')
      if (form) {
        const event = new Event('submit', { cancelable: true })
        form.dispatchEvent(event)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="shopify-fetcher">
      <Button
        onClick={handleFetch}
        disabled={loading || !value}
        size="small"
      >
        {loading ? 'Fetching...' : '🔄 Fetch from Shopify'}
      </Button>
      {error && (
        <p className="error" style={{ color: 'red', marginTop: '8px' }}>
          {error}
        </p>
      )}
    </div>
  )
}
```

Then use it in the field config:

```typescript
{
  name: 'shopifyProductId',
  type: 'text',
  admin: {
    components: {
      afterInput: [ShopifyProductFetcher],
    },
  },
}
```

---

## Frontend Usage

### Display Shopify Data in Product Pages

```tsx
// src/app/(frontend)/products/[slug]/page.tsx

import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'

export default async function ProductPage({
  params
}: {
  params: { slug: string }
}) {
  const payload = await getPayload({ config })

  const { docs: products } = await payload.find({
    collection: 'products',
    where: {
      slug: { equals: params.slug }
    },
    depth: 2,
  })

  const product = products[0]
  if (!product) notFound()

  // Use Shopify data if available, fallback to manual data
  const productData = product.shopifyData || {
    title: product.name,
    description: product.description,
    price: product.price?.msrp ? `$${product.price.msrp}` : null,
    images: product.mainImage ? [product.mainImage] : [],
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images (from Shopify) */}
        <div>
          {productData.images && productData.images.length > 0 && (
            <Image
              src={productData.images[0].url}
              alt={productData.images[0].alt || productData.title}
              width={productData.images[0].width || 800}
              height={productData.images[0].height || 800}
              className="w-full rounded-lg"
            />
          )}
        </div>

        {/* Product Info (from Shopify) */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{productData.title}</h1>

          {productData.price && (
            <p className="text-3xl text-kawai-red font-semibold mb-6">
              {productData.price}
            </p>
          )}

          <div className="prose mb-8">
            <p>{productData.description}</p>
          </div>

          {/* Variants (from Shopify) */}
          {productData.variants && productData.variants.length > 1 && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Select Variant
              </label>
              <select className="border rounded-md px-4 py-2 w-full">
                {productData.variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.title} - ${variant.price}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Add to Cart - uses Shopify variant ID */}
          <AddToCartButton
            variantId={productData.variants?.[0]?.id}
          />
        </div>
      </div>

      {/* Custom Content Blocks (from Payload) */}
      <div className="mt-16">
        {product.pageContent && (
          <RenderBlocks blocks={product.pageContent} />
        )}
      </div>
    </div>
  )
}
```

---

## Workflow Example

### Content Team Process

**Step 1: Create Product in Shopify**
```
Shopify Admin → Products → Add Product
- Title: "CA-99 Digital Piano"
- Description: "Premium digital piano..."
- Price: $6,999
- Vendor: Kawai America
- Variants: Ebony Polish, White Satin
- Save
```

**Step 2: Copy Product ID**
```
Shopify Product URL:
https://admin.shopify.com/store/kawai/products/8234567890

Product ID: gid://shopify/Product/8234567890
(Or just use handle: "ca-99-digital-piano")
```

**Step 3: Create Page in Payload**
```
Payload Admin → Products → Add New
- Shopify Product ID: "ca-99-digital-piano"
- Save (data auto-fetches)
```

**Step 4: Verify Auto-Populated Data**
```
Check "Shopify Data" section:
✅ Title: "CA-99 Digital Piano"
✅ Price: "$6,999.00"
✅ Vendor: "Kawai America"
✅ Variants: 2 variants loaded
✅ Images: 3 images loaded
✅ Last Fetched: Jan 14, 2026 3:45 PM
```

**Step 5: Add Custom Content**
```
Go to "Page Content" tab
Add blocks:
- Hero block (uses Shopify images)
- Features list
- Video showcase
- Specifications
- Testimonials
- CTA block

Publish!
```

---

## Refresh Strategy

### Option A: Manual Refresh (Simplest)

Admin clicks "Save" in Payload to re-fetch latest data from Shopify.

### Option B: Automatic Refresh on Page Load

```typescript
// src/app/(frontend)/products/[slug]/page.tsx

export const revalidate = 300 // 5 minutes

export default async function ProductPage({ params }) {
  // Fetch fresh Shopify data every 5 minutes
  const product = await fetchProductWithShopifyData(params.slug)

  // ... render
}

async function fetchProductWithShopifyData(slug: string) {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } }
  })

  const product = docs[0]

  // If Shopify data is older than 5 minutes, refresh it
  if (product.shopifyProductId && shouldRefresh(product.shopifyData?.lastFetchedAt)) {
    const freshData = await fetchShopifyProduct(product.shopifyProductId)

    // Update in background (fire-and-forget)
    payload.update({
      collection: 'products',
      id: product.id,
      data: {
        shopifyData: transformToPayloadFormat(freshData)
      },
      context: { skipShopifyFetch: true }
    }).catch(console.error)
  }

  return product
}
```

### Option C: Webhook-based Refresh

Set up Shopify webhook to notify Payload when product changes:

```typescript
// src/app/api/webhooks/shopify/products/route.ts

export async function POST(req: Request) {
  const payload = await req.json()

  // Verify webhook signature (important!)
  const signature = req.headers.get('X-Shopify-Hmac-Sha256')
  if (!verifyWebhookSignature(signature, payload)) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // Find product in Payload by Shopify ID
  const shopifyProductId = `gid://shopify/Product/${payload.id}`

  const cms = await getPayload({ config })
  const { docs } = await cms.find({
    collection: 'products',
    where: {
      shopifyProductId: { equals: shopifyProductId }
    }
  })

  if (docs.length > 0) {
    // Refresh product data
    const freshData = await fetchShopifyProduct(shopifyProductId)

    await cms.update({
      collection: 'products',
      id: docs[0].id,
      data: {
        shopifyData: transformToPayloadFormat(freshData)
      },
      context: { skipShopifyFetch: true }
    })

    console.log('[Webhook] Updated product:', docs[0].name)
  }

  return Response.json({ success: true })
}
```

---

## Benefits of This Approach

| Benefit | Description |
|---------|-------------|
| **Simplicity** | No sync logic, no mutations, just read operations |
| **Reliability** | Shopify is source of truth (what it's designed for) |
| **Flexibility** | Full control over presentation in Payload |
| **Performance** | Cache Shopify data, only refresh when needed |
| **Maintainability** | Fewer moving parts = less to break |
| **Team Workflow** | Commerce team uses Shopify, content team uses Payload |
| **Data Freshness** | Always fetch latest data on demand |

---

## Comparison: Write vs Read Approach

| Aspect | Write Approach (Payload → Shopify) | Read Approach (Shopify → Payload) |
|--------|-----------------------------------|-----------------------------------|
| **Complexity** | High (mutations, sync, errors) | Low (just fetches) |
| **Data Source** | Payload | Shopify |
| **Sync Issues** | Bi-directional conflicts possible | None (read-only) |
| **Commerce Expertise** | Team needs to use Payload | Team uses Shopify (familiar) |
| **Maintenance** | Hooks, webhooks, error handling | Just fetch utility |
| **Recommended For** | Pure headless commerce | Shopify + custom content layer ✅ |

**For your use case (Shopify + custom product pages), the read-only approach is superior.**

---

## FAQ

**Q: What if product data changes in Shopify?**
A: Just re-save the product in Payload to re-fetch, or set up automatic refresh.

**Q: Can I override Shopify data?**
A: Yes! Use the hybrid approach with a `dataSource` radio field (see Option B above).

**Q: What about variants?**
A: All variants are fetched automatically with price, SKU, availability.

**Q: Can I use Storefront API instead of Admin API?**
A: Yes, but Admin API is better (can fetch drafts, all metafields, private data).

**Q: How do I get the Shopify Product ID?**
A: Copy from Shopify admin URL, or just use the product handle (slug).

**Q: What about performance?**
A: Fetched data is cached in Payload. Only re-fetches when you save or on schedule.

---

## Next Steps

1. ✅ Add `shopifyProductId` and `shopifyData` fields to Products collection
2. ✅ Create `fetch-product.ts` utility
3. ✅ Add `beforeChange` hook to fetch data
4. ✅ Test with a sample product
5. ✅ Build custom product page template
6. ✅ Roll out to production

---

**Document Version:** 1.0 (Read-Only)
**Last Updated:** 2026-01-14
**Philosophy:** Shopify does commerce, Payload does content
