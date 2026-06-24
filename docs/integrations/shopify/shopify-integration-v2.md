# Shopify Commerce Integration - Complete Guide

> Production-grade Shopify integration for KAWAI Piano using GraphQL Storefront and Admin APIs with OAuth 2.0 authentication

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Environment Setup](#environment-setup)
4. [Authentication](#authentication)
5. [Core Concepts](#core-concepts)
6. [API Reference](#api-reference)
7. [Feature Implementation Patterns](#feature-implementation-patterns)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Overview

### What This Integration Provides

The Shopify integration library is a **production-ready, type-safe bridge** between Shopify's commerce platform and the KAWAI Next.js application. It provides:

✅ **Dual API Architecture** - Separate clients for Storefront (public) and Admin (privileged) operations
✅ **OAuth 2.0 Authentication** - Automatic token refresh with Client Credentials Grant
✅ **Intelligent Error Handling** - Exponential backoff, rate limit detection, retry logic
✅ **Type Safety Throughout** - Comprehensive TypeScript coverage with runtime validation
✅ **Smart Customer Management** - Upsert operations with tag merging for CRM
✅ **Cart Management** - Complete shopping cart with persistent storage
✅ **ISR Compatible** - Optimized for Next.js Incremental Static Regeneration
✅ **Performance First** - Multi-layer caching with automatic invalidation

### Integration Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  KAWAI Next.js Application                                      │
│  (Server Components + Client Components)                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
         ┌───────────────┴────────────────┐
         │  Shopify Integration Layer     │
         │  src/lib/shopify/              │
         │  ├── index.ts (Barrel)         │
         │  ├── client.ts                 │
         │  ├── admin-client.ts           │
         │  ├── auth.ts (OAuth)           │
         │  ├── products.ts               │
         │  ├── customers.ts              │
         │  ├── cart.ts                   │
         │  ├── checkout.ts               │
         │  ├── utm-tracking.ts           │
         │  └── types.ts                  │
         └────────┬───────────┬───────────┘
                  │           │
      ┌───────────┴──┐    ┌───┴──────────────┐
      │ Storefront   │    │  Admin API       │
      │ API (Public) │    │  (OAuth 2.0)     │
      │ 2024-01      │    │  2025-10         │
      └──────┬───────┘    └───┬──────────────┘
             │                │
      ┌──────┴────────────────┴────────────┐
      │   Shopify Commerce API             │
      │   (GraphQL)                        │
      └────────────────────────────────────┘
```

### Key Features by Use Case

| Use Case | Implementation | Files Involved |
|----------|----------------|----------------|
| **Display Products** | `getProducts()`, `getProductByHandle()` | `products.ts` |
| **Shopping Cart** | `addToCart()`, `getCart()`, `getCheckoutUrl()` | `cart.ts` |
| **Customer CRM** | `upsertCustomer()` (create-or-update with tags) | `customers.ts` |
| **Navigation Menu** | `getProductTypesWithProducts()` | `navigation.ts` |
| **Search/Filter** | `searchProducts()`, `getProductsByType()` | `products.ts` |
| **Model Lookup** | `getProductByModel()` with metafield + tag fallback | `products.ts`, `fetch-product.ts` |
| **UTM Attribution** | `buildCheckoutUrl()`, `getUTMCartAttributes()` | `checkout.ts`, `utm-tracking.ts` |

---

## Product Lookup Strategies

The Shopify integration provides multiple methods for locating products, each optimized for different use cases.

### Metafield-Based Lookup (Recommended)

The integration supports **metafield-based product lookup** using the `custom.model` metafield. This is the preferred method for identifying products by model number.

**Benefits:**
- ✅ Structured data storage in Shopify
- ✅ No tag pollution or conflicts
- ✅ Type-safe queries with Admin API
- ✅ Clear separation: metafields for IDs, tags for marketing
- ✅ Automatic fallback to tag-based search

**Setup in Shopify:**

1. Navigate to Shopify Admin → Settings → Custom data → Products
2. Add metafield definition:
   - **Namespace**: `custom`
   - **Key**: `model`
   - **Type**: Single line text
   - **Description**: "Product model identifier (e.g., CA99, GX-7)"
3. For each product, set the `custom.model` metafield value to match your model identifier

**Usage:**

```typescript
import { getProductByModel } from '@/lib/shopify'

// Automatically uses metafield lookup with tag fallback
const product = await getProductByModel('CA99')

if (product) {
  console.log(product.title) // "Kawai CA99 Digital Piano"
}
```

**How It Works:**

```
┌─────────────────────────────────────────────┐
│  getProductByModel('CA99')                  │
└───────────────┬─────────────────────────────┘
                │
        ┌───────┴────────┐
        │  Strategy 1:   │
        │  Metafield     │────► Admin API: productByIdentifier
        │  Lookup        │      with customId {namespace: "custom",
        └───────┬────────┘      key: "model", value: "CA99"}
                │
                ├─ Found? ──► Return product ✅
                │
                └─ Not Found
                   │
           ┌───────┴────────┐
           │  Strategy 2:   │
           │  Tag Fallback  │────► Storefront API: search
           │  (Legacy)      │      query: "tag:CA99"
           └───────┬────────┘
                   │
                   ├─ Found? ──► Return product ✅
                   │
                   └─ Not Found ──► Return null
```

### Handle-Based Lookup (URL-Friendly)

Use product handles (slugs) for SEO-friendly URLs and routing:

```typescript
const product = await getProductByHandle('ca99-digital-piano')
```

**When to use:**
- Product detail pages (`/products/[handle]`)
- URL routing
- SEO optimization

### Tag-Based Lookup (Legacy Fallback)

The integration maintains backward compatibility with tag-based product lookup. This is automatically used as a fallback if metafield lookup fails.

**When to use tags:**
- Migration period (products not yet updated with metafields)
- Quick testing without metafield setup
- Redundant identifier for reliability

**Best Practice:** Set both `custom.model` metafield AND product tag for maximum reliability during migration.

### File Metafields (e.g. Owner's Manual)

File-type metafields cannot be queried via the `metafields(identifiers: [...])` array — they require a separate aliased field with a `reference` sub-selection to resolve the CDN URL:

```graphql
metafield_ownermanual: metafield(namespace: "custom", key: "ownermanual") {
  reference {
    ... on GenericFile {
      url
    }
  }
}
```

This is already handled automatically in `GET_PRODUCT_BY_HANDLE` and `GET_PRODUCT_BY_ID`. The resolved URL is available on the `Product` domain type as `ownersManualUrl: string | null`.

**Setup in Shopify:**
- Namespace: `custom`, Key: `ownermanual`, Type: **File** (one), Storefront API access: **enabled**
- Upload the PDF to a product in Shopify Admin — the CDN URL is resolved at query time

**Frontend usage:**
```typescript
const product = await getProductByHandle('ca99-digital-piano')

if (product.ownersManualUrl) {
  // Link to PDF download
}
```

---

## Product Status Sync

Shopify's native `ProductStatus` enum has **four** values. They map to Payload's `status` field as follows during sync (`src/lib/shopify/sync-to-payload.ts`, `src/collections/Products.ts`):

| Shopify `status` | Meaning | Effect on Payload `status` | Stored in `shopify.shopifyStatus` |
|------------------|---------|----------------------------|-----------------------------------|
| `ACTIVE` | Ready to sell | _unchanged_ — editors own active/draft | `ACTIVE` |
| `DRAFT` | Not ready, hidden from channels | _unchanged_ — editors own active/draft | `DRAFT` |
| `ARCHIVED` | No longer sold | → `discontinued` (only status that auto-propagates) | `ARCHIVED` |
| `UNLISTED` | Active but **accessible only by direct link** — hidden from search, collections, and recommendations | _unchanged_ — editors own active/draft | `UNLISTED` |

**Design note:** Only `ARCHIVED → discontinued` propagates to the editable Payload `status`. Editors control `active`/`draft` independently; the raw Shopify value is always mirrored into the read-only `shopify.shopifyStatus` field for reference.

### ⚠️ `UNLISTED` requires Admin API 2025-10+

The `UNLISTED` status is **only returned by the Shopify Admin API from version 2025-10 onwards**. On older versions (e.g. `2025-01`) the enum value does not exist, so an unlisted product reports its base status — `ACTIVE` — and `shopify.shopifyStatus` will read `ACTIVE` instead of `UNLISTED`.

If unlisted products are syncing as `ACTIVE`, check that `SHOPIFY_API_VERSION` is `2025-10` or newer (it overrides the code default in `src/lib/shopify/admin-client.ts`). This is a read-only concern for the sync — `UNLISTED` cannot be *set* via the API on older versions, but the sync only reads `status`.

---

## Environment Setup

### Required Environment Variables

Add these to your `.env.local` file:

```bash
# ============================================================================
# SHOPIFY STOREFRONT API (Public - Client-Safe)
# ============================================================================
# IMPORTANT: Use NEXT_PUBLIC_ prefix for client component access
# The Storefront API is designed to be safely exposed to browsers

NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxx

# ============================================================================
# SHOPIFY ADMIN API (Private - Server-Only)
# ============================================================================
# CRITICAL: NEVER use NEXT_PUBLIC_ prefix for Admin API credentials
# These credentials grant full access to your Shopify store

# OAuth 2.0 Client Credentials
SHOPIFY_APP_API_KEY=your-app-api-key
SHOPIFY_APP_CLIENT_SECRET=shpss_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com

# API Version (Optional - defaults shown)
# Must be 2025-10 or newer — the UNLISTED product status is only returned
# by the Admin API from version 2025-10 onwards. On older versions an
# unlisted product reports its base status (ACTIVE) instead of UNLISTED.
SHOPIFY_API_VERSION=2025-10
```

### Environment Variable Explanation

**Why Different Prefixes?**

| Variable Type | Prefix | Accessible From | Security Level |
|---------------|--------|-----------------|----------------|
| **Storefront** | `NEXT_PUBLIC_` | Client + Server | Public (safe to expose) |
| **Admin** | None | Server Only | Private (full store access) |

**Storefront API** is designed for public use:
- ✅ Product browsing
- ✅ Cart operations
- ✅ Public checkout URLs
- ❌ Cannot access draft products
- ❌ Cannot modify inventory

**Admin API** requires strict server-side protection:
- ✅ Customer management
- ✅ Inventory updates
- ✅ Order management
- ⚠️ Full store access - **NEVER expose to client**

### Obtaining Credentials

#### Storefront Access Token

1. Go to Shopify Admin → Settings → Apps and sales channels
2. Click "Develop apps" → "Create an app"
3. Configure Storefront API scopes:
   - ✅ `unauthenticated_read_product_listings`
   - ✅ `unauthenticated_read_product_inventory`
   - ✅ `unauthenticated_write_checkouts`
4. Install app and copy **Storefront Access Token**

#### Admin API Credentials (OAuth)

1. Same app from above → Configure Admin API scopes:
   - ✅ `read_products`
   - ✅ `write_customers`
   - ✅ `read_customers`
   - ✅ `read_orders` (if needed)
2. Install app and copy:
   - **API Key** → `SHOPIFY_APP_API_KEY`
   - **API Secret Key** → `SHOPIFY_APP_CLIENT_SECRET`

---

## Authentication

### OAuth 2.0 Client Credentials Grant

The integration uses **OAuth 2.0 Client Credentials Grant** for server-to-server authentication. This is more secure than static access tokens and follows Shopify's current best practices.

#### How It Works

```typescript
// src/lib/shopify/auth.ts

1. Check if cached token exists and is valid
2. If expired or missing:
   → POST to https://{store}.myshopify.com/admin/oauth/access_token
   → Request new token with client_id + client_secret
   → Cache token for 24 hours (with 5-minute safety buffer)
3. Return valid token to admin-client.ts
```

#### Token Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│  Token Request Flow                                         │
└─────────────────────────────────────────────────────────────┘

First API Call:
  1. admin-client.ts calls getAdminAccessToken()
  2. auth.ts requests token from Shopify OAuth endpoint
  3. Token cached in memory (expires_in: 86400 seconds / 24 hours)
  4. Token returned to admin-client.ts for API request

Subsequent API Calls (within 24 hours):
  1. admin-client.ts calls getAdminAccessToken()
  2. auth.ts returns cached token (no API call)
  3. Token used for API request

After 23h 55m (safety buffer):
  1. admin-client.ts calls getAdminAccessToken()
  2. auth.ts detects expiration approaching
  3. New token requested from Shopify OAuth endpoint
  4. Cache updated with new token
```

#### Token Caching

**Current Implementation (Development/Single Instance):**
```typescript
// In-memory cache suitable for development and single-instance deployments
let tokenCache: TokenCache | null = null
```

**Production Recommendation:**
```typescript
// For multi-instance deployments, use Redis or similar distributed cache
// See "Production Considerations" section below
```

### Authentication Best Practices

✅ **DO:**
- Use OAuth Client Credentials Grant (implemented by default)
- Let the library handle token refresh automatically
- Keep Admin API credentials in server-only environment variables
- Use Storefront API for all public-facing operations

❌ **DON'T:**
- Expose Admin API credentials to the client
- Manually manage token refresh (it's automatic)
- Use static Admin API tokens (deprecated by Shopify)
- Use Admin API for operations that Storefront API can handle

---

## Core Concepts

### API Selection Guide

Choose the right API for your use case:

#### Storefront API (Public)

**When to Use:**
- ✅ Product catalog display
- ✅ Product search and filtering
- ✅ Shopping cart operations
- ✅ Generating checkout URLs
- ✅ Public product metadata

**Characteristics:**
- No authentication required (uses public token)
- Safe to call from client components
- Rate limit: 1,000 requests/minute
- Cannot access draft products
- Limited metafield access

**Example Use Cases:**
```typescript
// Product listing page (Server Component)
const products = await getProducts({ first: 20 })

// Product detail page (Server Component)
const product = await getProductByHandle('ca99-digital-piano')

// Cart operations (Client Component)
const cart = await addToCart({ merchandiseId, quantity: 1 })
```

#### Admin API (Privileged)

**When to Use:**
- ✅ Customer management (create, update, tag)
- ✅ Inventory management
- ✅ Order management
- ✅ Draft products
- ✅ All metafields and private data

**Characteristics:**
- Requires OAuth authentication
- **Server-side only** (never expose to client)
- Rate limit: 40 requests/second (REST), 1,000 cost points/second (GraphQL)
- Full store access

**Example Use Cases:**
```typescript
// Contact form submission (Server Action)
'use server'
export async function submitContactForm(data: FormData) {
  await upsertCustomer({
    email: data.get('email'),
    firstName: data.get('firstName'),
    tags: ['contact-form', 'location-stlouis']
  })
}

// Inventory sync (Server-side cron job)
const products = await shopifyAdminClient.query(GET_PRODUCTS_WITH_INVENTORY)
```

### Data Flow Architecture

#### Product Display Flow

```
User Request → Next.js Page (Server Component)
                      ↓
              getProducts() / getProductByHandle()
                      ↓
              Storefront API Client (client.ts)
                      ↓
              GraphQL Query with ISR Cache
                      ↓
              Transform Shopify Data (products.ts)
                      ↓
              Return Domain Model (Product interface)
                      ↓
              Render in Component
```

#### Customer Management Flow

```
Form Submission → Server Action (Server-Side)
                      ↓
              upsertCustomer() with tags
                      ↓
              Admin API Client (admin-client.ts)
                      ↓
              getAdminAccessToken() - OAuth Token
                      ↓
              Search for existing customer (email lookup)
                      ↓
              Found? → Update + Merge Tags
              Not Found? → Create with Tags
                      ↓
              Return Customer Object
```

#### Shopping Cart Flow

```
User Clicks "Add to Cart" → Client Component
                      ↓
              addToCart() mutation
                      ↓
              Check localStorage for cart ID
                      ↓
              Exists? → Add lines to cart
              Missing? → Create new cart first
                      ↓
              Storefront API Mutation
                      ↓
              Save cart ID to localStorage
                      ↓
              Return updated cart
                      ↓
              Update UI (cart badge, drawer, etc.)
```

### Caching Strategy

The integration implements a **multi-layer caching strategy** optimized for Next.js:

```
┌────────────────────────────────────────────────────────────────┐
│  Layer 1: Next.js ISR (Incremental Static Regeneration)       │
│  - Product pages: revalidate: 600 (10 minutes)                │
│  - Product lists: revalidate: 300 (5 minutes)                 │
│  - Navigation: revalidate: 300 (5 minutes)                    │
└────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────┐
│  Layer 2: OAuth Token Cache (In-Memory)                       │
│  - Admin API tokens: 24 hours with 5-min safety buffer        │
│  - Automatic refresh when expired                             │
│  - Shared across all Admin API requests                       │
└────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────┐
│  Layer 3: Cart Metadata Cache (LocalStorage)                  │
│  - Cart item count: Cached for quick badge display            │
│  - Cart total: Stored for UI preview                          │
│  - CRITICAL: Must sync with cart state (clear when null)      │
│  - Expiration: Matches cart expiration (7 days)               │
└────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────┐
│  Layer 4: Shopify CDN                                          │
│  - Product images: Cached on Shopify's CDN                    │
│  - GraphQL responses: Server-side caching                     │
└────────────────────────────────────────────────────────────────┘
```

**Cart Metadata Synchronization:**
```typescript
// ⚠️ CRITICAL: Cart metadata must be synchronized with cart state
// Metadata provides performance optimization but requires proper cleanup

// ✅ Correct: Clear metadata when cart becomes null
if (!cartId || !cartData) {
  setCart(null)
  clearCartMetadata()  // Prevents stale item counts
  return
}

// ✅ Correct: Update metadata when cart changes
setCart(cartData)
saveCartMetadata({
  lastUpdated: Date.now(),
  itemCount: cartData.totalQuantity,
  total: cartData.total,
  currency: cartData.currency,
})

// ❌ Wrong: Leaving stale metadata when cart is null
// This causes getItemCount() to return cached counts from expired carts
```

**Cache Configuration Examples:**

```typescript
// Product detail page - longer cache (10 minutes)
const product = await getProductByHandle('ca99', {
  revalidate: 600 // 10 minutes
})

// Product listing - shorter cache (5 minutes)
const products = await getProducts({ first: 20 }, {
  revalidate: 300 // 5 minutes
})

// Real-time cart data - no cache
const cart = await getCart(cartId) // Uses { cache: 'no-store' } internally

// Admin API - no cache by default
await shopifyAdminClient.mutate(CUSTOMER_CREATE, input)
// Uses { cache: 'no-store' } to ensure fresh data
```

### Error Handling & Resilience

The integration includes **production-grade error handling**:

#### Automatic Retry Logic

```typescript
// Exponential backoff with jitter (implemented in client.ts)
Attempt 1: Immediate
Attempt 2: Wait 1-2 seconds (1000ms base + random jitter)
Attempt 3: Wait 2-3 seconds (2000ms base + random jitter)
Attempt 4: Fail and throw error

// Retryable errors:
- Network failures (fetch errors)
- HTTP 5xx (server errors)
- HTTP 429 (rate limiting)
- GraphQL THROTTLED errors
```

#### Rate Limit Handling

```typescript
// Admin API (admin-client.ts:267-279)
if (error.extensions?.code === 'THROTTLED') {
  // Longer delay for rate limits (2-10 seconds)
  await sleep(calculateBackoff(attempt, 2000, 10000))
  continue // Retry
}
```

#### GraphQL Error Parsing

```typescript
// Check for userErrors in mutation responses
if (response.customerCreate.userErrors.length > 0) {
  throw new CustomerError(
    'Customer creation failed',
    response.customerCreate.userErrors
  )
}
```

#### Graceful Degradation

```typescript
// All fetch functions return null on error (never throw)
const product = await getProductByHandle('invalid-handle')
if (!product) {
  notFound() // Next.js 404 page
}

// Customer operations throw CustomerError for handling
try {
  await upsertCustomer({ email: 'invalid' })
} catch (error) {
  if (error instanceof CustomerError) {
    // Handle validation errors
    console.error(error.userErrors)
  }
}
```

---

## API Reference

### Product Operations

#### `getProducts(variables?, options?)`

Fetch multiple products with filtering, sorting, and pagination.

**Type Signature:**
```typescript
async function getProducts(
  variables?: {
    first?: number          // Default: 20, Max: 250
    after?: string          // Pagination cursor
    query?: string          // Shopify search query syntax
    sortKey?: 'TITLE' | 'PRICE' | 'CREATED_AT' | 'BEST_SELLING'
    reverse?: boolean       // Reverse sort order
  },
  options?: {
    timeout?: number        // Request timeout (default: 10000ms)
    retries?: number        // Max retry attempts (default: 3)
    cache?: RequestCache    // Next.js cache strategy
    revalidate?: number     // ISR revalidation time (seconds)
  }
): Promise<Product[]>
```

**Return Value:**
```typescript
interface Product {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string
  type: string
  vendor: string
  tags: string[]
  available: boolean
  createdAt: Date
  updatedAt: Date
  price: {
    min: number
    max: number
    currency: string
    display: string // Formatted: "$1,299.00" or "$999 - $1,499"
  }
  image: {
    url: string
    alt: string
    width: number
    height: number
  } | null
  images: Array<{url: string, alt: string, width: number, height: number}>
  variants: ProductVariant[]
  /** Owner's manual PDF URL (from custom.ownermanual metafield, null if not set) */
  ownersManualUrl: string | null
  metadata: Record<string, unknown> // Parsed metafields
}
```

**Usage Examples:**

```typescript
// Basic product listing
const products = await getProducts({ first: 20 })

// Filtered by search query
const pianos = await getProducts({
  query: 'digital piano',
  first: 12
})

// Sorted by price
const cheapToExpensive = await getProducts({
  first: 20,
  sortKey: 'PRICE',
  reverse: false
})

// With custom ISR cache
const products = await getProducts(
  { first: 20 },
  { revalidate: 600 } // 10 minutes
)

// Pagination
const firstPage = await getProducts({ first: 20 })
const secondPage = await getProducts({
  first: 20,
  after: firstPage.pageInfo.endCursor
})
```

**Best Practices:**
- Use `first: 20` for initial load, then paginate
- Set appropriate `revalidate` based on update frequency
- Use search `query` with Shopify search syntax for filtering
- Cache product lists for 5 minutes: `{ revalidate: 300 }`

---

#### `getProductByHandle(handle, options?)`

Fetch a single product by its URL-friendly handle (slug).

**Type Signature:**
```typescript
async function getProductByHandle(
  handle: string,
  options?: ShopifyRequestOptions
): Promise<Product | null>
```

**Usage Examples:**

```typescript
// Product detail page
export default async function ProductPage({
  params
}: {
  params: { handle: string }
}) {
  const product = await getProductByHandle(params.handle, {
    revalidate: 600 // 10 minutes for product pages
  })

  if (!product) {
    notFound()
  }

  return <ProductDetail product={product} />
}

// With error handling
const product = await getProductByHandle('ca99-digital-piano')
if (!product) {
  // Handle 404 or show fallback
  return <ProductNotFound />
}
```

**Best Practices:**
- Always check for `null` return value
- Use longer cache for product pages: `{ revalidate: 600 }`
- Call `notFound()` for 404 handling in Next.js

---

#### `getProductByModel(model, options?)`

Fetch a product using a model tag (e.g., "CA99", "GX-7").

**Type Signature:**
```typescript
async function getProductByModel(
  model: string,
  options?: ShopifyRequestOptions
): Promise<Product | null>
```

**Usage Examples:**

```typescript
// Find product by model tag
const piano = await getProductByModel('CA99')

// From Payload CMS product reference
interface PayloadProduct {
  model: string
  shopifyHandle?: string
}

const payloadProduct = await payload.findByID({
  collection: 'products',
  id: productId
})

// Try model tag first, fallback to handle
const shopifyProduct = payloadProduct.shopifyHandle
  ? await getProductByHandle(payloadProduct.shopifyHandle)
  : await getProductByModel(payloadProduct.model)
```

**How It Works:**
- **Primary Strategy**: Queries Admin API using `custom.model` metafield
- **Fallback Strategy**: Queries Storefront API using product tags
- **Case Handling**: Normalizes model to uppercase automatically
- **Error Resilience**: Falls back to tags if Admin API fails

**Requirements:**
- **Recommended**: Set `custom.model` metafield in Shopify for optimal performance
- **Fallback**: Products can be tagged with model name for backward compatibility
- Model format: Uppercase alphanumeric (e.g., "CA99", "GX-7", "SK-EX")

**Best Practices:**
- ✅ Set both metafield AND tag during migration period
- ✅ Use consistent model format (uppercase recommended)
- ✅ Case-insensitive: "ca99" and "CA99" both work
- ❌ Don't rely solely on tags for new products

---

#### `fetchShopifyProductByModel(model)`

Fetch a product from Shopify by model identifier using the `custom.model` metafield (Admin API only).

**Type Signature:**
```typescript
async function fetchShopifyProductByModel(
  model: string
): Promise<ShopifyProductData | null>
```

**Return Value:**
```typescript
interface ShopifyProductData {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string
  vendor: string
  productType: string
  tags: string[]
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED' | 'UNLISTED'
  price: {
    min: string
    max: string
    currency: string
    display: string
  }
  compareAtPrice: {
    min: string
    max: string
  } | null
  images: Array<{url: string, alt: string, width: number, height: number}>
  featuredImage: {url: string, alt: string, width: number, height: number} | null
  variants: Array<{
    id: string
    title: string
    price: string
    compareAtPrice: string | null
    sku: string
    barcode: string | null
    available: boolean
    inventoryQuantity: number
    inventoryTracked: boolean
    image: {
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
  seo: {
    title: string
    description: string
  }
  category: {
    id: string
    name: string           // Last part of taxonomy (e.g., "Digital Pianos")
    fullName: string       // Full path (e.g., "Arts & Entertainment > ... > Digital Pianos")
  } | null
  collections: Array<{
    id: string
    title: string
    handle: string
  }>
  metafields?: {
    model?: string
    ownersManual?: string | null  // URL from custom.ownermanual (GenericFile reference)
  }
  availableForSale: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}
```

**Usage Example:**
```typescript
import { fetchShopifyProductByModel } from '@/lib/shopify'

const product = await fetchShopifyProductByModel('CA99')

if (product) {
  console.log(product.title)
  console.log(product.metafields?.model)        // "CA99"
  console.log(product.metafields?.ownersManual) // "https://cdn.shopify.com/.../manual.pdf"
  console.log(product.price.display)            // "$1,299.00"
}
```

**Admin API Requirements:**
- Uses Admin GraphQL API (requires `read_products` scope)
- OAuth 2.0 authentication (automatic via `shopifyAdminClient`)
- Query: `productByIdentifier` with `customId` parameter

**When to Use:**
- Direct Admin API access needed
- Server-side operations only
- Need full Admin API product data structure
- **Note**: Most use cases should use `getProductByModel()` which includes fallback logic

---

#### `searchProducts(query, variables?, options?)`

Search products using Shopify's search syntax.

**Type Signature:**
```typescript
async function searchProducts(
  query: string,
  variables?: { first?: number; after?: string },
  options?: ShopifyRequestOptions
): Promise<Product[]>
```

**Shopify Search Syntax:**

```typescript
// Text search
searchProducts('digital piano')

// Tag filter
searchProducts('tag:featured')

// Product type filter
searchProducts('product_type:"Digital Piano"')

// Price range
searchProducts('price:>1000 AND price:<2000')

// Availability
searchProducts('available_for_sale:true')

// Combined filters
searchProducts('digital piano tag:featured price:>1000')
```

**Usage Examples:**

```typescript
// Search page
export default async function SearchPage({
  searchParams
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q || ''
  const results = await searchProducts(query, { first: 24 })

  return <SearchResults results={results} query={query} />
}

// Category filtering
const digitalPianos = await searchProducts(
  'product_type:"Digital Piano" available_for_sale:true',
  { first: 20 }
)
```

---

### Customer Management (Admin API)

#### `upsertCustomer(input)` ⭐ RECOMMENDED

Create or update a customer with intelligent tag merging. This is the **recommended** function for all customer operations from contact forms, assessments, or user registration.

**Type Signature:**
```typescript
async function upsertCustomer(
  input: {
    email: string                    // Required
    firstName?: string
    lastName?: string
    phone?: string
    tags?: string[]                  // Merged with existing tags
    note?: string
    taxExempt?: boolean
    addresses?: MailingAddress[]
    emailMarketingConsent?: {
      marketingState: 'SUBSCRIBED' | 'UNSUBSCRIBED'
      marketingOptInLevel: 'SINGLE_OPT_IN' | 'CONFIRMED_OPT_IN'
    }
  }
): Promise<Customer>
```

**How It Works:**

```typescript
1. Search for customer by email
2. If found:
   → Merge new tags with existing tags (no duplicates)
   → Update only provided fields (preserves other data)
   → Return updated customer
3. If not found:
   → Create new customer with all provided data
   → Return new customer
```

**Tag Merging Behavior:**

```typescript
// Existing customer has tags: ['location-chicago', 'inquiry-2024']
await upsertCustomer({
  email: 'customer@example.com',
  tags: ['location-stlouis', 'inquiry-2025']
})

// Result: ['location-chicago', 'inquiry-2024', 'location-stlouis', 'inquiry-2025']
// ✅ Preserves existing tags + adds new ones (no duplicates)
```

**Usage Examples:**

```typescript
// Contact form submission (Server Action)
'use server'
export async function submitContactForm(formData: FormData) {
  const email = formData.get('email') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const phone = formData.get('phone') as string
  const storefront = formData.get('storefront') as string
  const inquiryType = formData.get('inquiryType') as string
  const subscribe = formData.get('subscribe') === 'true'

  try {
    const customer = await upsertCustomer({
      email,
      firstName,
      lastName,
      phone,
      tags: [
        `location-${storefront}`,        // Dealer location
        `inquiry-${inquiryType}`,        // Inquiry type
        'source-contact-form',            // Source tracking
        new Date().toISOString().split('T')[0] // Date tag
      ],
      emailMarketingConsent: subscribe ? {
        marketingState: 'SUBSCRIBED',
        marketingOptInLevel: 'SINGLE_OPT_IN'
      } : undefined,
      note: `Contact form submission from ${storefront} showroom`
    })

    console.log('Customer created/updated:', customer.id)
    return { success: true, customerId: customer.id }
  } catch (error) {
    if (error instanceof CustomerError) {
      return { success: false, errors: error.userErrors }
    }
    throw error
  }
}
```

**Tag Naming Conventions:**

```typescript
// Recommended tag patterns for CRM organization:

// ⚠️ NOTE: Location tracking now uses metafields (see section below)
// Do NOT use location tags anymore - use addCustomerLocation() instead

// Inquiry type tags
'inquiry-piano-consultation'
'inquiry-service-request'
'inquiry-pricing'
'inquiry-trial-request'

// Source tags
'source-contact-form'
'source-assessment'
'source-newsletter'
'source-event-registration'

// Date tags (for temporal tracking)
'2025-01'              // Year-month
'q1-2025'              // Quarter
'namm-2025'            // Event

// Customer lifecycle tags
'lead'
'qualified-lead'
'customer'
'vip'
```

**Best Practices:**
- ✅ Use `upsertCustomer()` for all customer operations (handles create-or-update)
- ✅ Tag customers consistently for CRM segmentation
- ✅ Include source tracking tags
- ✅ Use kebab-case for tag names
- ✅ Namespace tags by category (inquiry-, source-)
- ✅ **Use metafields for location tracking** (not tags)
- ❌ Don't call from client components (server actions only)
- ❌ Don't manually check if customer exists first (function does this)
- ❌ Don't use `location-*` tags anymore (use `addCustomerLocation()` instead)

---

### Customer Metafields - Dealer Location Tracking

#### Why Metafields Instead of Tags?

The KAWAI integration uses **metafields** to track which dealer locations a customer has visited, rather than tags. This provides several advantages:

| Feature | Tags (Old Approach) | Metafields (Current) |
|---------|-------------------|----------------------|
| **Multiple Locations** | Clutters tag list | Clean list in Shopify Admin |
| **Querying** | Limited filtering | Advanced Shopify filters |
| **Data Structure** | Flat strings | Native List type |
| **Scalability** | Tag pollution | Organized namespaces |
| **Use Case** | General categorization | Structured dealer tracking |
| **Admin UI** | Mixed with other tags | Dedicated field with checkboxes |

#### `addCustomerLocation(customerId, locationSlug)` ⭐ RECOMMENDED

Add a dealer location to a customer's location metafield. Automatically handles duplicates and creates the metafield if it doesn't exist.

**Type Signature:**
```typescript
async function addCustomerLocation(
  customerId: string,     // Shopify customer GID
  locationSlug: string    // Dealer slug (e.g., "dallas", "chicago")
): Promise<string[]>      // Returns all locations
```

**How It Works:**

```typescript
1. Fetches existing locations from metafield (custom.location)
2. Checks if new location already exists
3. If duplicate → returns existing locations (no API call)
4. If new → adds to array and updates metafield
5. Returns complete list of all locations
```

**Metafield Structure:**
```json
{
  "namespace": "custom",
  "key": "location",
  "type": "list.single_line_text_field",
  "value": "[\"dallas\", \"chicago\", \"nashville\"]"
}
```

**Shopify Admin Display:**
When viewing in Shopify Admin, this appears as a clean list:
```
☐ dallas
☐ chicago
☐ nashville
```

**Usage Examples:**

```typescript
// Contact form submission with location tracking
'use server'
export async function submitContactForm(formData: FormData) {
  const email = formData.get('email') as string
  const storefrontSlug = formData.get('storefront') as string

  // Create/update customer (WITHOUT location tag)
  const customer = await upsertCustomer({
    email,
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    tags: [
      'inquiry-consultation',   // ✅ Custom tags
      'source-contact-form',    // ✅ Source tracking
      // ❌ NO 'location-dallas' tag
    ]
  })

  // Track location via metafield
  await addCustomerLocation(customer.id, storefrontSlug)
  // If customer visited Dallas → ['dallas']
  // If they later visit Chicago → ['dallas', 'chicago']
}
```

**Multi-Location Scenario:**

```typescript
// Customer signs up from Dallas showroom
const customer1 = await upsertCustomer({ email: 'customer@example.com' })
await addCustomerLocation(customer1.id, 'dallas')
// Metafield: ["dallas"]

// Same customer later visits Chicago showroom
const customer2 = await upsertCustomer({ email: 'customer@example.com' })
await addCustomerLocation(customer2.id, 'chicago')
// Metafield: ["dallas", "chicago"]

// Duplicate visit to Dallas (no-op)
await addCustomerLocation(customer2.id, 'dallas')
// Metafield: ["dallas", "chicago"] (unchanged)
```

#### `getCustomerLocations(customerId)`

Retrieve all dealer locations a customer has visited.

**Type Signature:**
```typescript
async function getCustomerLocations(
  customerId: string
): Promise<string[]>  // Returns array of location slugs
```

**Usage Example:**

```typescript
// Get customer's location history
const locations = await getCustomerLocations('gid://shopify/Customer/123456')
console.log(locations)  // ['dallas', 'chicago', 'nashville']

// Check if customer visited specific location
const visitedDallas = locations.includes('dallas')

// Count total dealer interactions
const dealerInteractions = locations.length
```

**Best Practices:**
- ✅ Use `addCustomerLocation()` for all dealer location tracking
- ✅ Never use `location-*` tags anymore
- ✅ Location metafield automatically handles duplicates
- ✅ Query Shopify Admin for customers by metafield value
- ✅ Use tags for categorization (inquiry type, source, lifecycle)
- ❌ Don't manually set the metafield (use helper function)
- ❌ Don't mix location tags and metafields (choose one approach)

**Migration from Tags to Metafields:**

If you have existing customers with `location-*` tags, you can migrate them:

```typescript
// Migration script (run once)
const customers = await shopifyAdminClient.query(/* get all customers with location tags */)

for (const customer of customers) {
  // Extract location from tags
  const locationTags = customer.tags.filter(tag => tag.startsWith('location-'))
  const locations = locationTags.map(tag => tag.replace('location-', ''))

  // Set metafield with all locations
  for (const location of locations) {
    await addCustomerLocation(customer.id, location)
  }

  // Optionally remove old location tags
  const tagsWithoutLocation = customer.tags.filter(tag => !tag.startsWith('location-'))
  await replaceCustomerTags(customer.id, tagsWithoutLocation)
}
```

---

### Shopping Cart Operations

#### `addToCart({ merchandiseId, quantity, cartId? })`

Add items to cart with automatic cart creation.

**Type Signature:**
```typescript
async function addToCart(input: {
  merchandiseId: string  // Product variant ID (gid://shopify/ProductVariant/...)
  quantity: number       // Number of items
  cartId?: string        // Optional cart ID (auto-retrieved if omitted)
}): Promise<Cart | null>
```

**Smart Behavior:**
- ✅ Auto-creates cart if none exists
- ✅ Auto-retrieves cart ID from localStorage
- ✅ Merges quantities if variant already in cart
- ✅ Saves cart ID to localStorage automatically
- ✅ Handles expired carts gracefully (creates new)

**Usage Examples:**

```typescript
// Client component - Add to cart button
'use client'
import { addToCart } from '@/lib/shopify'
import { useState } from 'react'
import type { ProductVariant } from '@/lib/shopify/types'

interface AddToCartButtonProps {
  variant: ProductVariant
}

export function AddToCartButton({ variant }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      const cart = await addToCart({
        merchandiseId: variant.id,
        quantity: 1
      })

      if (cart) {
        setAdded(true)
        // Emit custom event for cart badge update
        window.dispatchEvent(new CustomEvent('cartUpdated', {
          detail: { cart }
        }))

        setTimeout(() => setAdded(false), 2000)
      } else {
        alert('Failed to add to cart')
      }
    } catch (error) {
      console.error('Add to cart error:', error)
      alert('Failed to add to cart')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading || !variant.availableForSale}
      className="btn-primary w-full"
    >
      {loading ? 'Adding...' : added ? 'Added ✓' : 'Add to Cart'}
    </button>
  )
}
```

**Best Practices:**
- ✅ Don't manually pass `cartId` (auto-retrieved from localStorage)
- ✅ Check return value for `null` (indicates failure)
- ✅ Emit custom event to update cart badge/drawer
- ✅ Show loading state during operation
- ❌ Don't retry on failure (built-in retry logic)

---

#### `getCart(cartId?)`

Retrieve current cart with full details.

**Type Signature:**
```typescript
async function getCart(cartId?: string): Promise<Cart | null>

interface Cart {
  id: string
  lines: CartLine[]
  cost: {
    subtotalAmount: Money
    totalTaxAmount: Money | null
    totalAmount: Money
  }
  checkoutUrl: string
  totalQuantity: number
  discountCodes: DiscountCode[]
}
```

**Usage Examples:**

```typescript
// Cart page (Server Component with dynamic rendering)
export const dynamic = 'force-dynamic'

export default async function CartPage() {
  const cart = await getCart()

  if (!cart || cart.totalQuantity === 0) {
    return <EmptyCart />
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {cart.lines.map(line => (
            <CartLineItem key={line.id} line={line} cartId={cart.id} />
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <CartSummary cart={cart} />
        </div>
      </div>
    </div>
  )
}

// Cart badge in header (Client Component)
'use client'
export function CartBadge() {
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    async function loadCart() {
      const cart = await getCart()
      setItemCount(cart?.totalQuantity || 0)
    }
    loadCart()

    // Listen for cart updates
    const handleCartUpdate = (e: CustomEvent) => {
      setItemCount(e.detail.cart.totalQuantity)
    }
    window.addEventListener('cartUpdated', handleCartUpdate as EventListener)
    return () => window.removeEventListener('cartUpdated', handleCartUpdate as EventListener)
  }, [])

  return (
    <button className="relative">
      <ShoppingCartIcon />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-kawai-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  )
}
```

---

#### `updateCartLine({ cartId, lineId, quantity })`

Update quantity of a cart line item.

**Type Signature:**
```typescript
async function updateCartLine(input: {
  cartId: string
  lineId: string   // From cart.lines[].id
  quantity: number // Set to 0 to remove
}): Promise<Cart | null>
```

**Usage Example:**

```typescript
// Quantity selector component
'use client'
export function QuantitySelector({
  line,
  cartId
}: {
  line: CartLine
  cartId: string
}) {
  const [quantity, setQuantity] = useState(line.quantity)
  const [updating, setUpdating] = useState(false)

  const handleUpdate = async (newQty: number) => {
    if (newQty < 1) return

    setUpdating(true)
    try {
      const cart = await updateCartLine({
        cartId,
        lineId: line.id,
        quantity: newQty
      })

      if (cart) {
        setQuantity(newQty)
        window.dispatchEvent(new CustomEvent('cartUpdated', {
          detail: { cart }
        }))
      }
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="flex items-center border rounded-md">
      <button
        onClick={() => handleUpdate(quantity - 1)}
        disabled={updating || quantity <= 1}
        className="px-3 py-1 hover:bg-gray-100"
      >
        −
      </button>
      <span className="px-4 py-1 border-x">{quantity}</span>
      <button
        onClick={() => handleUpdate(quantity + 1)}
        disabled={updating}
        className="px-3 py-1 hover:bg-gray-100"
      >
        +
      </button>
    </div>
  )
}
```

---

#### `removeFromCart({ cartId, lineIds })`

Remove one or more line items from cart.

**Type Signature:**
```typescript
async function removeFromCart(input: {
  cartId: string
  lineIds: string[]  // Array of cart line IDs
}): Promise<Cart | null>
```

**Usage Example:**

```typescript
// Remove button
async function handleRemove(cartId: string, lineId: string) {
  const confirmed = confirm('Remove item from cart?')
  if (!confirmed) return

  setRemoving(true)
  try {
    const cart = await removeFromCart({
      cartId,
      lineIds: [lineId]
    })

    if (cart) {
      window.dispatchEvent(new CustomEvent('cartUpdated', {
        detail: { cart }
      }))
      // Refresh page to show updated cart
      window.location.reload()
    }
  } finally {
    setRemoving(false)
  }
}
```

---

#### `getCheckoutUrl(cart)`

Get Shopify checkout URL for completing purchase.

**Type Signature:**
```typescript
function getCheckoutUrl(cart: Cart): string | null
```

**Note:** Prefer `buildCheckoutUrl()` over accessing `cart.checkoutUrl` directly — it appends stored UTM parameters automatically. See below.

---

#### `buildCheckoutUrl(baseUrl)` — `checkout.ts`

Append stored first-touch UTM parameters to a Shopify checkout URL. Returns `baseUrl` unchanged when no UTMs are stored (new session, SSR, or user arrived without UTMs).

**Type Signature:**
```typescript
function buildCheckoutUrl(baseUrl: string): string
```

**Usage:**
```typescript
import { buildCheckoutUrl } from '@/lib/shopify'

// All checkout entry points should use this instead of cart.checkoutUrl directly
window.open(buildCheckoutUrl(cart.checkoutUrl), '_blank', 'noopener,noreferrer')
```

**Where it's used:** `CartSummary.tsx`, `ProductHeroBlock.tsx`, `CollectionProductRow.tsx`

**Client-only** — reads `kawai-utm-first` cookie. Never call from Server Components.

---

#### `getUTMCartAttributes()` — `checkout.ts`

Build Shopify cart attributes from stored first-touch UTM parameters. Pass as the second argument to `createCart()` to embed UTMs in the Shopify order object, making them visible in Shopify admin and accessible to Flow automations.

**Type Signature:**
```typescript
function getUTMCartAttributes(): Array<{ key: string; value: string }>
```

**Returns:** Array of `{ key: '_utm_source', value: '...' }` entries (one per non-empty UTM param). Returns `[]` when no UTMs are stored — safe to pass unconditionally.

**Attribute keys use underscore prefix (`_utm_*`)** so Shopify hides them from the customer-facing order UI while still recording them on the order object.

**Usage:**
```typescript
import { createCart, getUTMCartAttributes } from '@/lib/shopify'

// Always pass getUTMCartAttributes() when creating a cart
const cart = await createCart(
  [{ merchandiseId: variantId, quantity: 1 }],
  getUTMCartAttributes(),
)
```

**Where it's used:** `AddToCartButton.tsx`, `ProductHeroBlock.tsx`, `CollectionProductRow.tsx`

**Client-only** — reads `kawai-utm-first` cookie. Never call from Server Components.

---

### UTM Attribution System

Marketing attribution across the Shopify checkout boundary (different domain) requires explicit UTM preservation. The system handles this via two mechanisms:

| Mechanism | Where | Purpose |
|---|---|---|
| **URL params on checkout URL** | `buildCheckoutUrl()` | Shopify analytics + GA4/Meta Pixel on checkout page |
| **Cart attributes** | `getUTMCartAttributes()` | Shopify order data, admin reports, Flow automations |

**UTM storage** (`utm-tracking.ts`):
- `kawai-utm-first` cookie — first-touch, never overwritten (30-day expiry)
- `kawai-utm-last` cookie — last-touch, always overwritten

Both `buildCheckoutUrl` and `getUTMCartAttributes` read from the first-touch cookie for consistency.

**Full attribution flow:**
```
User arrives via ?utm_source=google&utm_medium=cpc
  → captureUTMParams() stores to kawai-utm-first cookie
  → User browses, adds to cart
  → createCart(lines, getUTMCartAttributes())  ← UTMs in order data
  → User proceeds to checkout
  → buildCheckoutUrl(cart.checkoutUrl)         ← UTMs in checkout URL
  → Shopify checkout with full attribution
```

---

### Navigation & Mega Menu

#### `getProductTypesWithProducts(options?)`

Fetch product types with sample products for mega menu navigation.

**Type Signature:**
```typescript
async function getProductTypesWithProducts(
  options?: ShopifyRequestOptions
): Promise<{
  types: Array<{
    type: string
    count: number
    products: Product[] // Max 6 sample products
  }>
  totalProducts: number
  updatedAt: Date
}>
```

**Usage Example:**

```typescript
// Server action for navigation data
'use server'
export async function fetchProductsNavigation() {
  try {
    const navData = await getProductTypesWithProducts({
      revalidate: 300 // 5 minutes
    })
    return navData
  } catch (error) {
    console.error('Failed to fetch navigation:', error)
    return { types: [], totalProducts: 0, updatedAt: new Date() }
  }
}

// Use in header component
'use client'
export function Header() {
  const [navData, setNavData] = useState(null)

  useEffect(() => {
    fetchProductsNavigation().then(setNavData)
  }, [])

  return (
    <header>
      <nav>
        <ProductsMegaMenu data={navData} />
      </nav>
    </header>
  )
}
```

**Best Practices:**
- Cache navigation data for 5 minutes
- Load asynchronously in useEffect (don't block header render)
- Handle loading/error states gracefully
- Limit to 6 sample products per type for performance

---

## Feature Implementation Patterns

### Pattern 1: Contact Form with CRM Integration

**Use Case:** Capture lead information and sync to Shopify for CRM.

**Implementation:**

```typescript
// src/app/contact/page.tsx
'use client'
import { submitContactForm } from '@/lib/actions/contact'

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')

    const formData = new FormData(e.currentTarget)
    const result = await submitContactForm(formData)

    setStatus(result.success ? 'success' : 'error')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="firstName" type="text" required />
      <input name="lastName" type="text" required />
      <input name="phone" type="tel" />

      <select name="storefront" required>
        <option value="stlouis">St. Louis</option>
        <option value="chicago">Chicago</option>
        <option value="nashville">Nashville</option>
      </select>

      <select name="inquiryType" required>
        <option value="consultation">Piano Consultation</option>
        <option value="pricing">Pricing Information</option>
        <option value="trial">Home Trial</option>
      </select>

      <label>
        <input name="subscribe" type="checkbox" />
        Subscribe to newsletter
      </label>

      <button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending...' : 'Send Message'}
      </button>

      {status === 'success' && (
        <p className="text-green-600">Thank you! We'll be in touch soon.</p>
      )}
    </form>
  )
}
```

```typescript
// src/lib/actions/contact.ts
'use server'
import { upsertCustomer } from '@/lib/shopify'

export async function submitContactForm(formData: FormData) {
  const email = formData.get('email') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const phone = formData.get('phone') as string
  const storefront = formData.get('storefront') as string
  const inquiryType = formData.get('inquiryType') as string
  const subscribe = formData.get('subscribe') === 'on'

  // Input validation
  if (!email || !firstName || !storefront || !inquiryType) {
    return { success: false, error: 'Missing required fields' }
  }

  try {
    // Upsert customer with tags for CRM segmentation
    const customer = await upsertCustomer({
      email,
      firstName,
      lastName,
      phone: phone || undefined,
      tags: [
        `location-${storefront}`,
        `inquiry-${inquiryType}`,
        'source-contact-form',
        new Date().toISOString().slice(0, 7) // YYYY-MM
      ],
      emailMarketingConsent: subscribe ? {
        marketingState: 'SUBSCRIBED',
        marketingOptInLevel: 'SINGLE_OPT_IN'
      } : undefined,
      note: `Contact form submission from ${storefront} - ${inquiryType}`
    })

    console.log('Customer synced to Shopify:', customer.id)

    // Optional: Send to other systems (email, Slack, etc.)
    // await sendEmailNotification({ to: email, ...})
    // await postToSlack({ channel: 'leads', text: `New lead from ${storefront}` })

    return { success: true, customerId: customer.id }
  } catch (error) {
    console.error('Contact form submission error:', error)
    return { success: false, error: 'Failed to submit form' }
  }
}
```

**Why This Pattern:**
- ✅ Server action keeps Admin API credentials secure
- ✅ `upsertCustomer()` handles create-or-update automatically
- ✅ Tags enable CRM segmentation in Shopify
- ✅ Email marketing consent properly captured
- ✅ Source tracking for attribution

---

### Pattern 2: Product Catalog with Filtering

**Use Case:** Display product catalog with search, filter by type, and sorting.

**Implementation:**

```typescript
// src/app/pianos/page.tsx
import { getProducts } from '@/lib/shopify'
import { PianoGrid } from '@/components/piano/PianoGrid'
import { PianoFilters } from '@/components/piano/PianoFilters'

export const revalidate = 300 // 5 minutes ISR

interface PageProps {
  searchParams: {
    type?: string
    sort?: 'price-asc' | 'price-desc' | 'title'
    q?: string
  }
}

export default async function PianosPage({ searchParams }: PageProps) {
  const { type, sort, q } = searchParams

  // Build Shopify query string
  let query = ''
  if (type) query += `product_type:"${type}"`
  if (q) query += ` ${q}`
  query += ' available_for_sale:true' // Only show available products

  // Determine sort order
  let sortKey: 'PRICE' | 'TITLE' = 'TITLE'
  let reverse = false
  if (sort === 'price-asc') { sortKey = 'PRICE'; reverse = false }
  if (sort === 'price-desc') { sortKey = 'PRICE'; reverse = true }
  if (sort === 'title') { sortKey = 'TITLE'; reverse = false }

  // Fetch products with filters
  const products = await getProducts(
    {
      query: query.trim(),
      first: 24,
      sortKey,
      reverse
    },
    { revalidate: 300 }
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Piano Collection</h1>

      <PianoFilters
        currentType={type}
        currentSort={sort}
        currentQuery={q}
      />

      <PianoGrid products={products} />

      {products.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-600">No pianos found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
```

```typescript
// src/components/piano/PianoFilters.tsx
'use client'
import { useRouter, useSearchParams } from 'next/navigation'

interface PianoFiltersProps {
  currentType?: string
  currentSort?: string
  currentQuery?: string
}

export function PianoFilters({ currentType, currentSort, currentQuery }: PianoFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateFilters(key: string, value: string) {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex gap-4 mb-8">
      {/* Type Filter */}
      <select
        value={currentType || ''}
        onChange={(e) => updateFilters('type', e.target.value)}
        className="border rounded-md px-4 py-2"
      >
        <option value="">All Types</option>
        <option value="Digital Piano">Digital Piano</option>
        <option value="Grand Piano">Grand Piano</option>
        <option value="Upright Piano">Upright Piano</option>
        <option value="Hybrid Piano">Hybrid Piano</option>
      </select>

      {/* Sort */}
      <select
        value={currentSort || ''}
        onChange={(e) => updateFilters('sort', e.target.value)}
        className="border rounded-md px-4 py-2"
      >
        <option value="">Sort by...</option>
        <option value="title">Name (A-Z)</option>
        <option value="price-asc">Price (Low to High)</option>
        <option value="price-desc">Price (High to Low)</option>
      </select>

      {/* Search */}
      <input
        type="search"
        placeholder="Search pianos..."
        defaultValue={currentQuery}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            updateFilters('q', e.currentTarget.value)
          }
        }}
        className="border rounded-md px-4 py-2 flex-1"
      />
    </div>
  )
}
```

**Why This Pattern:**
- ✅ Server Component with ISR for performance
- ✅ URL-based filters (shareable, bookmarkable)
- ✅ Shopify query syntax for efficient filtering
- ✅ Client-side filter updates via router.push
- ✅ Proper type safety throughout

---

### Pattern 3: Product Detail Page with Add to Cart

**Use Case:** Display product details with variants and shopping cart integration.

**Implementation:**

```typescript
// src/app/products/[handle]/page.tsx
import { getProductByHandle } from '@/lib/shopify'
import { notFound } from 'next/navigation'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductInfo } from '@/components/product/ProductInfo'
import { AddToCartSection } from '@/components/product/AddToCartSection'

export const revalidate = 600 // 10 minutes

interface PageProps {
  params: { handle: string }
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProductByHandle(params.handle, {
    revalidate: 600
  })

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Product Images */}
        <ProductGallery images={product.images} />

        {/* Right: Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
          <p className="text-2xl text-kawai-red font-semibold mb-6">
            {product.price.display}
          </p>

          <div
            className="prose mb-8"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />

          {/* Add to Cart */}
          <AddToCartSection product={product} />

          {/* Product Details */}
          <ProductInfo product={product} />
        </div>
      </div>
    </div>
  )
}
```

```typescript
// src/components/product/AddToCartSection.tsx
'use client'
import { useState } from 'react'
import { addToCart } from '@/lib/shopify'
import type { Product } from '@/lib/shopify/types'

interface AddToCartSectionProps {
  product: Product
}

export function AddToCartSection({ product }: AddToCartSectionProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)

  async function handleAddToCart() {
    if (!selectedVariant) return

    setLoading(true)
    try {
      const cart = await addToCart({
        merchandiseId: selectedVariant.id,
        quantity
      })

      if (cart) {
        setAdded(true)
        window.dispatchEvent(new CustomEvent('cartUpdated', {
          detail: { cart }
        }))
        setTimeout(() => setAdded(false), 2000)
      } else {
        alert('Failed to add to cart. Please try again.')
      }
    } catch (error) {
      console.error('Add to cart error:', error)
      alert('Failed to add to cart. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border-t border-b py-6 mb-6">
      {/* Variant Selector */}
      {product.variants.length > 1 && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Select Variant
          </label>
          <select
            value={selectedVariant?.id}
            onChange={(e) => {
              const variant = product.variants.find(v => v.id === e.target.value)
              if (variant) setSelectedVariant(variant)
            }}
            className="border rounded-md px-4 py-2 w-full"
          >
            {product.variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.title} - ${variant.price.toFixed(2)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Quantity
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="border rounded-md px-3 py-1 hover:bg-gray-100"
          >
            −
          </button>
          <span className="px-4">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="border rounded-md px-3 py-1 hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={loading || !selectedVariant?.available}
        className="btn-primary w-full py-3"
      >
        {loading
          ? 'Adding...'
          : added
          ? 'Added to Cart ✓'
          : selectedVariant?.available
          ? 'Add to Cart'
          : 'Out of Stock'
        }
      </button>

      {/* Availability */}
      {selectedVariant && (
        <p className="text-sm text-gray-600 mt-2">
          {selectedVariant.available
            ? '✓ In Stock'
            : '✗ Out of Stock'}
        </p>
      )}
    </div>
  )
}
```

**Why This Pattern:**
- ✅ Server Component for product data (SEO-friendly)
- ✅ Client Component for interactive cart operations
- ✅ Proper loading and success states
- ✅ Variant selection with price display
- ✅ Quantity control
- ✅ Availability checking
- ✅ Custom event for cart updates

---

### Pattern 4: Persistent Shopping Cart

**Use Case:** Cart that persists across sessions and page reloads.

**Implementation:**

```typescript
// src/components/cart/CartProvider.tsx
'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { getCart } from '@/lib/shopify'
import type { Cart } from '@/lib/shopify/types'

interface CartContextValue {
  cart: Cart | null
  itemCount: number
  loading: boolean
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)

  async function refreshCart() {
    setLoading(true)
    try {
      const cartData = await getCart()
      setCart(cartData)
    } catch (error) {
      console.error('Failed to load cart:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load cart on mount
  useEffect(() => {
    refreshCart()
  }, [])

  // Listen for cart updates
  useEffect(() => {
    function handleCartUpdate(e: CustomEvent) {
      setCart(e.detail.cart)
    }
    window.addEventListener('cartUpdated', handleCartUpdate as EventListener)
    return () => window.removeEventListener('cartUpdated', handleCartUpdate as EventListener)
  }, [])

  const itemCount = cart?.totalQuantity || 0

  return (
    <CartContext.Provider value={{ cart, itemCount, loading, refreshCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
```

```typescript
// src/app/layout.tsx
import { CartProvider } from '@/components/cart/CartProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
```

```typescript
// src/components/layout/Header.tsx
'use client'
import { useCart } from '@/components/cart/CartProvider'
import Link from 'next/link'

export function Header() {
  const { itemCount, loading } = useCart()

  return (
    <header>
      <nav>
        {/* Cart Badge */}
        <Link href="/cart" className="relative">
          <ShoppingCartIcon />
          {!loading && itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-kawai-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Link>
      </nav>
    </header>
  )
}
```

**Why This Pattern:**
- ✅ Cart state available throughout app via Context
- ✅ Automatic loading on app mount
- ✅ Real-time updates via custom events
- ✅ Loading states handled
- ✅ Easy cart access with `useCart()` hook

---

## Best Practices

### 1. Type Safety

✅ **Always import from barrel exports:**
```typescript
// Good
import { getProducts, addToCart, upsertCustomer } from '@/lib/shopify'
import type { Product, Cart, Customer } from '@/lib/shopify/types'

// Bad
import { getProducts } from '@/lib/shopify/products'
import { addToCart } from '@/lib/shopify/cart'
```

✅ **Use TypeScript strict mode:**
```typescript
// All function parameters typed
async function displayProduct(handle: string): Promise<void> {
  const product = await getProductByHandle(handle)
  if (!product) return // Handle null case
  // ...
}
```

✅ **Transform Shopify data at boundaries:**
```typescript
// Transform to domain model immediately
const shopifyProducts = await getProducts()
const domainProducts: DomainProduct[] = shopifyProducts.map(transformToDomain)
// Use domain model in rest of application
```

### 2. Performance Optimization

✅ **Use appropriate ISR cache times:**
```typescript
// Product detail pages - 10 minutes
await getProductByHandle(handle, { revalidate: 600 })

// Product listings - 5 minutes
await getProducts({ first: 20 }, { revalidate: 300 })

// Navigation data - 5 minutes
await getProductTypesWithProducts({ revalidate: 300 })

// Real-time cart data - no cache
await getCart() // Uses { cache: 'no-store' } internally
```

✅ **Use minimal queries for lists:**
```typescript
// For navigation previews - lightweight query
const products = await getProductsMinimal({ first: 6 })

// For full product pages - complete data
const product = await getProductByHandle(handle)
```

✅ **Batch operations when possible:**
```typescript
// Good - single API call
await removeFromCart({ cartId, lineIds: [line1, line2, line3] })

// Bad - multiple API calls
await removeFromCart({ cartId, lineIds: [line1] })
await removeFromCart({ cartId, lineIds: [line2] })
await removeFromCart({ cartId, lineIds: [line3] })
```

### 3. Error Handling

✅ **Trust built-in retry logic:**
```typescript
// Don't wrap in additional retries - already handled
const products = await getProducts() // Has exponential backoff built-in
```

✅ **Check for null returns:**
```typescript
const product = await getProductByHandle(handle)
if (!product) {
  notFound() // Next.js 404
}
```

✅ **Handle customer errors explicitly:**
```typescript
try {
  await upsertCustomer({ email: 'invalid@' })
} catch (error) {
  if (error instanceof CustomerError) {
    // Handle validation errors
    console.error(error.userErrors)
  }
}
```

✅ **Never expose errors to users:**
```typescript
// Good - generic message
catch (error) {
  console.error('Checkout error:', error)
  return { success: false, message: 'Checkout failed. Please try again.' }
}

// Bad - exposes internal error
catch (error) {
  return { success: false, message: error.message } // Could expose sensitive info
}
```

### 4. Security Best Practices

✅ **Never expose Admin API to client:**
```typescript
// Good - Server Action
'use server'
export async function createCustomer(data: FormData) {
  await upsertCustomer({ email: data.get('email') })
}

// Bad - Client Component
'use client'
export function ContactForm() {
  async function handleSubmit() {
    await upsertCustomer({ email }) // ❌ Admin API exposed to client!
  }
}
```

✅ **Use proper environment variable prefixes:**
```typescript
// Storefront (client-safe)
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN

// Admin (server-only)
SHOPIFY_APP_API_KEY
SHOPIFY_APP_CLIENT_SECRET // No NEXT_PUBLIC_ prefix
```

✅ **Validate user input:**
```typescript
'use server'
export async function submitForm(formData: FormData) {
  const email = formData.get('email') as string

  // Validate before sending to Shopify
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Invalid email' }
  }

  await upsertCustomer({ email })
}
```

### 5. Customer Management Best Practices

✅ **Always use `upsertCustomer()` for form submissions:**
```typescript
// Good - handles create-or-update automatically
await upsertCustomer({ email, firstName, lastName, tags })

// Bad - manual check
const existing = await getCustomerByEmail(email)
if (existing) {
  await updateCustomer(existing.id, { firstName, lastName })
} else {
  await createCustomer({ email, firstName, lastName })
}
```

✅ **Use consistent tag naming conventions:**
```typescript
// Good - namespaced tags
tags: [
  'location-stlouis',
  'inquiry-consultation',
  'source-contact-form',
  '2025-01'
]

// Bad - inconsistent tags
tags: [
  'St. Louis',
  'Consultation',
  'contactForm',
  'january'
]
```

✅ **Include source tracking:**
```typescript
await upsertCustomer({
  email,
  tags: [
    'source-contact-form',      // How they found you
    'location-stlouis',          // Where they're from
    'inquiry-pricing',           // What they want
    new Date().toISOString().slice(0, 7) // When (YYYY-MM)
  ]
})
```

### 6. Cart Management Best Practices

✅ **Emit cart updates for UI synchronization:**
```typescript
const cart = await addToCart({ merchandiseId, quantity })
if (cart) {
  window.dispatchEvent(new CustomEvent('cartUpdated', {
    detail: { cart }
  }))
}
```

✅ **Use cart context for global state:**
```typescript
// Wrap app in CartProvider
// Access cart anywhere with useCart()
const { cart, itemCount, refreshCart } = useCart()
```

✅ **Handle cart expiration gracefully:**
```typescript
// addToCart() automatically creates new cart if expired
const cart = await addToCart({ merchandiseId, quantity })
// No need to manually check expiration
```

✅ **Synchronize cart metadata with cart state:**
```typescript
// CRITICAL: Always clear metadata when cart becomes null
// This prevents stale item counts in cart badges
const refreshCart = async () => {
  const cartId = getCartId()

  if (!cartId) {
    setCart(null)
    clearCartMetadata()  // ✅ Clear stale metadata
    return
  }

  const cartData = await getCart(cartId)

  if (!cartData) {
    clearCartId()
    clearCartMetadata()  // ✅ Clear stale metadata
    setCart(null)
    return
  }

  setCart(cartData)
  saveCartMetadata({    // ✅ Update fresh metadata
    lastUpdated: Date.now(),
    itemCount: cartData.totalQuantity,
    total: cartData.total,
    currency: cartData.currency,
  })
}
```

**Why this matters:**
- Cart metadata is used as a performance optimization (show badge count without API call)
- If metadata isn't cleared when cart is null, `getItemCount()` returns stale counts
- This causes cart badge to show incorrect item counts after cart expiration

### 7. UTM Attribution at Checkout

✅ **Always use `buildCheckoutUrl()` when redirecting to checkout:**
```typescript
import { buildCheckoutUrl } from '@/lib/shopify'

// Good - UTMs preserved across domain boundary
window.open(buildCheckoutUrl(cart.checkoutUrl), '_blank', 'noopener,noreferrer')

// Bad - UTMs lost when user lands on Shopify checkout
window.open(cart.checkoutUrl, '_blank', 'noopener,noreferrer')
```

✅ **Always pass `getUTMCartAttributes()` when calling `createCart()`:**
```typescript
import { createCart, getUTMCartAttributes } from '@/lib/shopify'

// Good - UTMs embedded in Shopify order object
const cart = await createCart(lines, getUTMCartAttributes())

// Bad - order has no attribution data in Shopify admin
const cart = await createCart(lines)
```

✅ **Both helpers are safe to call unconditionally** — they return `baseUrl` / `[]` when no UTMs are stored, so no guard code is needed at call sites.

❌ **Never call either helper from Server Components** — they read `document.cookie` and are client-only.

❌ **Don't duplicate the UTM-appending logic** — always import from `@/lib/shopify`, never copy-paste the URL-building pattern inline.

### 8. Development Workflow

✅ **Use TypeScript strict mode:**
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true
  }
}
```

✅ **Run type checks before committing:**
```bash
bun run lint
```

✅ **Test error scenarios:**
```typescript
// Test with invalid data
await getProductByHandle('nonexistent-handle') // Should return null
await upsertCustomer({ email: 'invalid' }) // Should throw CustomerError
```

---

## Production Considerations

### Token Caching for Multi-Instance Deployments

**Current Implementation (Development):**
```typescript
// src/lib/shopify/auth.ts
let tokenCache: TokenCache | null = null // In-memory
```

**Production Recommendation (Redis):**

```typescript
// src/lib/shopify/auth.ts
import { Redis } from '@upstash/redis'

const redis = process.env.REDIS_URL
  ? new Redis({ url: process.env.REDIS_URL })
  : null

export async function getAdminAccessToken(): Promise<string> {
  const clientId = process.env.SHOPIFY_APP_API_KEY
  const clientSecret = process.env.SHOPIFY_APP_CLIENT_SECRET
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN

  if (!clientId || !clientSecret || !storeDomain) {
    throw new Error('Missing Shopify credentials')
  }

  // Try Redis cache first (if available)
  if (redis) {
    const cached = await redis.get<TokenCache>('shopify:admin:token')
    if (cached && cached.expiresAt > Date.now()) {
      console.log('[Shopify Auth] Using cached token from Redis')
      return cached.token
    }
  }

  // Fall back to in-memory cache for development
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    console.log('[Shopify Auth] Using cached token from memory')
    return tokenCache.token
  }

  // Request new token
  console.log('[Shopify Auth] Requesting new access token')
  const tokenEndpoint = `https://${storeDomain}/admin/oauth/access_token`

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to obtain token: ${response.status}`)
  }

  const tokenData: ShopifyTokenResponse = await response.json()
  const expiresIn = tokenData.expires_in || 86400
  const safetyBuffer = 300
  const expiresAt = Date.now() + (expiresIn - safetyBuffer) * 1000

  const newTokenCache = {
    token: tokenData.access_token,
    expiresAt,
  }

  // Store in Redis (if available)
  if (redis) {
    await redis.set('shopify:admin:token', newTokenCache, {
      ex: expiresIn - safetyBuffer // TTL in seconds
    })
  }

  // Also store in memory as fallback
  tokenCache = newTokenCache

  return tokenData.access_token
}
```

**Environment Variables for Redis:**
```bash
# Add to .env.local
REDIS_URL=redis://localhost:6379
# Or for Upstash Redis
REDIS_URL=https://your-redis.upstash.io
REDIS_TOKEN=your-token
```

### Monitoring & Logging

**Add logging for production debugging:**

```typescript
// src/lib/shopify/logger.ts
export function logShopifyOperation(
  operation: string,
  details: Record<string, unknown>
) {
  if (process.env.NODE_ENV === 'production') {
    // Send to logging service (Datadog, LogRocket, etc.)
    console.log('[Shopify]', operation, details)
  }
}

// Use in operations
await upsertCustomer(input)
logShopifyOperation('customer:upsert', {
  email: input.email,
  tags: input.tags
})
```

### Rate Limit Monitoring

**Track API usage:**

```typescript
// src/lib/shopify/admin-client.ts
// Add after successful response
if (json.extensions?.cost) {
  console.log('[Shopify Admin API] Query cost:', {
    requested: json.extensions.cost.requestedQueryCost,
    actual: json.extensions.cost.actualQueryCost,
    available: json.extensions.cost.throttleStatus.currentlyAvailable,
    maximum: json.extensions.cost.throttleStatus.maximumAvailable
  })

  // Alert if approaching limit
  if (json.extensions.cost.throttleStatus.currentlyAvailable < 100) {
    console.warn('[Shopify Admin API] Approaching rate limit!')
  }
}
```

---

## Migration Guide: Tags to Metafields

If you're currently using tag-based product lookup, here's how to migrate to metafield-based lookup for improved reliability and structure.

### Overview

The metafield-based approach provides better data integrity and separates product identifiers from marketing tags. The migration is **non-breaking** with automatic fallback support.

### Step 1: Audit Current Tags

List all products using model tags to understand the scope:

```typescript
import { getProducts } from '@/lib/shopify'

const products = await getProducts({ first: 250 })

products.forEach(product => {
  // Find tags that look like model identifiers (uppercase alphanumeric)
  const modelTag = product.tags.find(tag => /^[A-Z0-9-]+$/.test(tag))
  console.log(`${product.handle}: ${modelTag || 'NO MODEL TAG'}`)
})
```

### Step 2: Create Metafield Definition in Shopify

1. Navigate to Shopify Admin → Settings → Custom data → Products
2. Click "Add definition"
3. Configure metafield:
   - **Namespace**: `custom`
   - **Key**: `model`
   - **Name**: Product Model
   - **Type**: Single line text
   - **Description**: "Product model identifier (e.g., CA99, GX-7, SK-EX)"
4. Click "Save"

### Step 3: Populate Metafield Values

**Option A: Manual (Small Catalog)**

Edit each product in Shopify Admin:
1. Go to Products → Select product
2. Scroll to "Metafields" section
3. Find "Product Model" field
4. Enter model value (e.g., "CA99")
5. Save

**Option B: Bulk via GraphQL (Large Catalog)**

Use the Admin API to bulk update products:

```typescript
import { shopifyAdminClient } from '@/lib/shopify/admin-client'

const SET_PRODUCT_METAFIELD = `
  mutation SetProductMetafield($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        id
        namespace
        key
        value
      }
      userErrors {
        field
        message
      }
    }
  }
`

// For each product
const productId = 'gid://shopify/Product/1234567890'
const modelValue = 'CA99'

await shopifyAdminClient.mutate(SET_PRODUCT_METAFIELD, {
  metafields: [{
    ownerId: productId,
    namespace: 'custom',
    key: 'model',
    value: modelValue,
    type: 'single_line_text_field'
  }]
})
```

**Option C: Bulk via CSV Import**

1. Export products from Shopify Admin
2. Add column: `Metafield: custom.model [single_line_text_field]`
3. Fill in model values for each product
4. Import updated CSV

### Step 4: Verify Lookup Works

Test that the metafield-based lookup functions correctly:

```typescript
import { getProductByModel, fetchShopifyProductByModel } from '@/lib/shopify'

// Test high-level function (with fallback)
const product1 = await getProductByModel('CA99')
console.log('High-level lookup:', product1?.title)

// Test direct metafield query
const product2 = await fetchShopifyProductByModel('CA99')
console.log('Direct metafield lookup:', product2?.title)
console.log('Metafield value:', product2?.metafields?.model)
```

Check console logs:
- ✅ `[getProductByModel] Found via metafield` - Success!
- ⚠️ `[getProductByModel] Found via tag fallback` - Metafield not set, using fallback
- ❌ `[getProductByModel] No product found` - Neither metafield nor tag exists

### Step 5: Monitor & Cleanup (Optional)

After successful migration (2-4 weeks recommended), you can optionally clean up model tags:

1. **Keep Tags**: Recommended approach - maintain both for redundancy
2. **Remove Tags**: Only after 100% metafield coverage verified

```typescript
// Script to verify metafield coverage before removing tags
const products = await getProducts({ first: 250 })

const coverage = products.map(product => {
  const hasMetafield = product.metadata?.model !== undefined
  const hasTag = product.tags.some(tag => /^[A-Z0-9-]+$/.test(tag))

  return {
    handle: product.handle,
    hasMetafield,
    hasTag,
    ready: hasMetafield // Ready for tag removal
  }
})

const readyCount = coverage.filter(p => p.ready).length
console.log(`${readyCount}/${coverage.length} products have metafields`)
```

### Migration Checklist

- [ ] Audit existing model tags
- [ ] Create `custom.model` metafield definition in Shopify
- [ ] Populate metafield values for all products
- [ ] Test `getProductByModel()` lookup
- [ ] Verify metafield values in console logs
- [ ] Monitor for 2-4 weeks
- [ ] (Optional) Remove model tags after verification

### Rollback Plan

If issues arise, the tag-based fallback ensures continuity:

1. **No Code Changes Needed**: Tag fallback is automatic
2. **Metafield Issues**: Products without metafields fall back to tags
3. **Full Rollback**: Remove metafield definitions in Shopify (tags continue working)

### FAQ

**Q: Do I need to update my code during migration?**
A: No. The `getProductByModel()` function automatically tries metafields first, then falls back to tags. Existing code continues working.

**Q: Can I have both metafield and tag set?**
A: Yes! This is recommended during migration for maximum reliability.

**Q: What happens if metafield and tag don't match?**
A: The metafield takes priority. Ensure consistency or remove conflicting tags.

**Q: Will this affect performance?**
A: Metafield lookups are **faster** than tag searches. Admin API queries are indexed by metafield.

---

## Troubleshooting

### Common Issues

#### Issue: "Missing Shopify configuration" Error

**Cause:** Environment variables not set correctly.

**Solution:**
```bash
# Check .env.local file exists
# Verify variables:
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxx
SHOPIFY_APP_API_KEY=your-key
SHOPIFY_APP_CLIENT_SECRET=shpss_xxx
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com

# Restart dev server
bun run dev
```

#### Issue: OAuth Token Request Fails

**Cause:** Invalid API credentials or incorrect scopes.

**Solution:**
1. Verify `SHOPIFY_APP_API_KEY` and `SHOPIFY_APP_CLIENT_SECRET` are correct
2. Check app scopes include `write_customers`, `read_customers`
3. Reinstall app in Shopify admin
4. Clear token cache: `delete tokenCache` in auth.ts temporarily

#### Issue: Cart Operations Fail

**Cause:** Storefront API token missing `NEXT_PUBLIC_` prefix.

**Solution:**
```bash
# Wrong
SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxx

# Correct
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxx
```

#### Issue: Products Not Showing in Storefront

**Cause:** Products not published to sales channel.

**Solution:**
1. Go to Shopify Admin → Products
2. Select product → Manage → Sales channels and apps
3. Check "Online Store" or your custom sales channel

#### Issue: Customer Creation Fails with 403

**Cause:** Missing `write_customers` scope.

**Solution:**
1. Go to Shopify Admin → Settings → Apps and sales channels
2. Select your app → Configuration
3. Add `write_customers` scope
4. Reinstall app

#### Issue: TypeScript Errors in Strict Mode

**Cause:** Implicit `any` or missing type annotations.

**Solution:**
```typescript
// Add explicit types to all parameters
const validate = (value: string | null | undefined) => {
  if (!value) return false
  return value.length > 0
}

// Use type guards for narrowing
if (typeof product.metadata.features === 'string') {
  const features = JSON.parse(product.metadata.features)
}
```

#### Issue: Cart Badge Shows Wrong Item Count

**Cause:** Stale cart metadata in localStorage not cleared when cart becomes null/expired.

**Symptoms:**
- Cart badge shows "1" or other count when cart is actually empty
- Badge persists after clearing browser cart or after cart expiration
- Console shows "Cart not found or expired" but badge still displays items

**Root Cause:**
The cart system uses a metadata fallback pattern for performance:
```typescript
// getItemCount() falls back to cached metadata when cart is null
const getItemCount = (): number => {
  if (cart) return cart.totalQuantity  // Primary source

  const metadata = getCartMetadata()    // Fallback source
  return metadata?.itemCount ?? 0       // ⚠️ Can be stale
}
```

**Solution:**
Ensure `clearCartMetadata()` is called whenever the cart becomes null in `CartContext.tsx`:

```typescript
const refreshCart = useCallback(async () => {
  try {
    const cartId = getCartId()

    if (!cartId) {
      setCart(null)
      clearCartMetadata()  // ✅ Clear metadata when no cart ID
      return
    }

    const cartData = await getCart(cartId)

    if (!cartData) {
      console.log('[Cart Context] Cart not found or expired, clearing storage')
      clearCartId()
      clearCartMetadata()  // ✅ Clear metadata when cart expired
      setCart(null)
      return
    }

    // Update cart and save fresh metadata
    setCart(cartData)
    saveCartMetadata({
      lastUpdated: Date.now(),
      itemCount: cartData.totalQuantity,
      total: cartData.total,
      currency: cartData.currency,
    })
  } catch (error) {
    console.error('[Cart Context] Failed to refresh cart:', error)
    setCart(null)
    clearCartMetadata()  // ✅ Clear metadata on error
  }
}, [])
```

**Testing the Fix:**
1. Add item to cart (badge shows "1")
2. Open DevTools → Application → LocalStorage
3. Delete `kawai_shopify_cart_id` key
4. Refresh page
5. ✅ Badge should show "0" (and `kawai_shopify_cart_metadata` should be deleted)

**Prevention:**
- Always clear metadata when calling `setCart(null)`
- Never rely solely on metadata without checking cart existence first
- Implement proper synchronization between cart state and localStorage

---

## Migration from Old Documentation

### Key Changes from Previous Version

1. **Authentication Method**
   - ❌ Old: Static `SHOPIFY_ADMIN_ACCESS_TOKEN`
   - ✅ New: OAuth with `SHOPIFY_APP_API_KEY` + `SHOPIFY_APP_CLIENT_SECRET`

2. **API Versions**
   - ❌ Old: 2024-01 for both APIs
   - ✅ New: Storefront 2024-01, Admin 2025-10 (2025-10+ required for the `UNLISTED` product status)

3. **Function Names**
   - ❌ Old: `getAllProducts()`
   - ✅ New: `getProducts()`

4. **Customer Management**
   - ❌ Old: Manual create-or-update logic
   - ✅ New: `upsertCustomer()` with automatic tag merging

5. **Error Handling**
   - ❌ Old: Basic error returns
   - ✅ New: Exponential backoff, rate limit detection, retry logic

### Update Checklist

- [ ] Update environment variables to use OAuth credentials
- [ ] Replace `getAllProducts()` with `getProducts()`
- [ ] Replace manual customer create/update with `upsertCustomer()`
- [ ] Update API version references in documentation
- [ ] Test OAuth token refresh flow
- [ ] Verify all customer tags are being merged correctly

---

## Additional Resources

- **Shopify GraphQL Admin API Reference:** https://shopify.dev/docs/api/admin-graphql
- **Shopify Storefront API Reference:** https://shopify.dev/docs/api/storefront
- **OAuth Documentation:** https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/client-credentials-grant
- **Rate Limiting Guide:** https://shopify.dev/docs/api/usage/rate-limits
- **Webhook Integration:** https://shopify.dev/docs/apps/build/webhooks

---

## Appendix: Type Definitions Reference

### Product Type

```typescript
interface Product {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string
  type: string
  vendor: string
  tags: string[]
  available: boolean
  createdAt: Date
  updatedAt: Date
  price: {
    min: number
    max: number
    currency: string
    display: string
  }
  image: ProductImage | null
  images: ProductImage[]
  variants: ProductVariant[]
  metadata: Record<string, unknown>
}
```

### Customer Type

```typescript
interface Customer {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  phone: string | null
  tags: string[]
  note: string | null
  acceptsMarketing: boolean
  emailMarketingConsent: {
    marketingState: 'SUBSCRIBED' | 'UNSUBSCRIBED'
    marketingOptInLevel: 'SINGLE_OPT_IN' | 'CONFIRMED_OPT_IN'
  } | null
  addresses: MailingAddress[]
  createdAt: string
  updatedAt: string
}
```

### Cart Type

```typescript
interface Cart {
  id: string
  lines: CartLine[]
  cost: {
    subtotalAmount: Money
    totalTaxAmount: Money | null
    totalAmount: Money
    totalDutyAmount: Money | null
  }
  checkoutUrl: string
  totalQuantity: number
  note: string | null
  discountCodes: DiscountCode[]
  createdAt: string
  updatedAt: string
}
```

---

## Multi-Store Setup (US + CA)

KAWAI runs two separate Shopify stores from a single Next.js codebase: one for the US (`kawaius.myshopify.com`) and one for Canada (`kawai-canada.myshopify.com`). They share the same codebase but use different API credentials based on the domain.

### Purpose

**US store** — product catalog, content, customer CRM, all US orders.

**CA store** — **pricing display and checkout only**. All product content (descriptions, images, metafields, product structure) lives in the US store. The CA store is only consulted for CAD pricing and to create CA checkout carts. There is no content sync between stores.

### Environment Variables

```bash
# US store (primary)
SHOPIFY_STORE_DOMAIN=kawaius.myshopify.com
SHOPIFY_APP_API_KEY=...
SHOPIFY_APP_CLIENT_SECRET=...
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=...
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=kawaius.myshopify.com

# CA store (pricing + checkout only)
SHOPIFY_CA_STORE_DOMAIN=kawai-canada.myshopify.com
SHOPIFY_CA_APP_API_KEY=...
SHOPIFY_CA_APP_CLIENT_SECRET=...
NEXT_PUBLIC_SHOPIFY_CA_STOREFRONT_ACCESS_TOKEN=...
NEXT_PUBLIC_SHOPIFY_CA_STORE_DOMAIN=kawai-canada.myshopify.com
```

### API Clients

Four clients are exported from `src/lib/shopify/`:

| Client | File | Auth | Used for |
|--------|------|------|---------|
| `shopifyClient` | `client.ts` | Storefront public token | US cart, product storefront queries |
| `shopifyClientCA` | `client.ts` | CA storefront public token | CA cart, CA storefront queries |
| `shopifyAdminClient` | `admin-client.ts` | US OAuth (auto-refresh) | US product lookup, customer CRM |
| `shopifyAdminClientCA` | `admin-client.ts` | CA OAuth (auto-refresh) | CA product lookup by handle |

CA admin auth is handled by `src/lib/shopify/auth-ca.ts` — a separate token cache using `SHOPIFY_CA_*` credentials, identical in structure to the US OAuth flow.

### CA Product Lookup: Two-Step Pattern

Shopify's `productByIdentifier(customId: ...)` requires the metafield definition to have a "use as identifier" flag set in Shopify Admin. The CA store was created without this flag, so `productByIdentifier` throws a GraphQL error on CA.

**Solution** — fetch by handle instead, using a two-step lookup:

```typescript
if (isCA) {
  // Step 1: resolve model → handle using US Admin API
  // US store has "use as identifier" set on custom.model
  const usProduct = await fetchShopifyProductByModel(normalizedModel)

  if (usProduct?.handle) {
    // Step 2: fetch CA product by handle using CA Admin API
    // productByHandle has no "use as identifier" requirement
    adminProduct = await fetchShopifyProduct(usProduct.handle, shopifyAdminClientCA)
  }
} else {
  adminProduct = await fetchShopifyProductByModel(normalizedModel)
}
```

`fetchShopifyProductByModel` uses `PRODUCT_BY_METAFIELD_QUERY` (`productByIdentifier`).
`fetchShopifyProduct` uses `PRODUCT_BY_HANDLE_QUERY` (`productByHandle` — no identifier flag needed).

Both are in `src/lib/shopify/fetch-product.ts`. The two-step logic lives in `src/lib/shopify/products.ts` inside `getProductByModel`.

### Cart Site Detection

Cart functions in `src/lib/shopify/cart.ts` detect the active store from `window.location.hostname` at call time — no `site` prop threading to callers:

```typescript
function getCartClient() {
  if (typeof window !== 'undefined' && window.location.hostname.startsWith('ca.')) {
    return shopifyClientCA
  }
  return shopifyClient
}
```

All exported cart functions (`createCart`, `addToCart`, `updateCartLine`, `removeFromCart`, `getCart`, `applyDiscountCode`, `updateCartAttributes`, `clearDiscountCodes`) call `getCartClient()` internally. `AddToCartButton` and all cart components need no changes when switching stores.

### Cart Storage Namespacing

`src/lib/shopify/cart-storage.ts` namespaces localStorage keys per store so US and CA carts never collide:

| Domain | Cart ID key | Expiration key |
|--------|-------------|----------------|
| US (`kawaius.com`) | `kawai_shopify_cart_id` | `kawai_shopify_cart_expiration` |
| CA (`ca.kawaius.com`) | `kawai_shopify_cart_id_ca` | `kawai_shopify_cart_expiration_ca` |

The suffix is derived from `window.location.hostname.startsWith('ca.')` at call time, same pattern as cart client detection.

### Site Prop in Client Components

Server components read `getSite()` (server-only) and pass `site: 'us' | 'cad'` down to client components that need to branch on store. Use `site === 'cad'` as the discriminant — never pass a boolean `isCanada`.

```typescript
// Server wrapper
export async function ProductHeroBlockWrapper(props: Props) {
  const site = await getSite()
  return <ProductHeroBlock {...props} site={site} />
}

// Client component
function ProductHeroBlock({ site = 'us', shopifyProduct, ... }) {
  const canAddToCart = !!shopifyProduct && !!selectedVariant && selectedVariant.available
  // Cart functions auto-detect store from hostname — no site prop needed in cart calls
}
```

---

**Document Version:** 2.0
**Last Updated:** June 2026
**Integration Version:** 2025-10 (Admin API), 2024-01 (Storefront API)
