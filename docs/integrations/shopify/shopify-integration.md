# Shopify Commerce Integration

> Enterprise-grade Shopify integration for the KAWAI Piano website using GraphQL Storefront and Admin APIs

## Overview

The Shopify integration library provides a type-safe, performant bridge between Shopify's commerce platform and the KAWAI Next.js application. It enables seamless product catalog synchronization, inventory management, and e-commerce functionality while maintaining the existing CMS-driven architecture.

### Key Features

- **Dual API Support** - Storefront API (public) and Admin API (privileged operations)
- **Type-Safe GraphQL** - Full TypeScript coverage with auto-generated types
- **Smart Caching** - Multi-layer caching strategy for optimal performance
- **ISR Compatible** - Designed for Next.js Incremental Static Regeneration
- **Error Resilient** - Graceful fallbacks and comprehensive error handling
- **Media Optimized** - Integrates with existing R2/Cloudflare media pipeline

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  KAWAI Next.js Application (Server Components)              │
└─────────────────────┬───────────────────────────────────────┘
                      │
         ┌────────────┴────────────┐
         │  Shopify Library Layer  │
         │  src/lib/shopify/       │
         └────────┬────────┬───────┘
                  │        │
      ┌───────────┴──┐  ┌──┴──────────────┐
      │ Storefront   │  │  Admin API      │
      │ API (Public) │  │  (Privileged)   │
      └──────┬───────┘  └──┬──────────────┘
             │             │
      ┌──────┴─────────────┴──────┐
      │   Shopify Commerce API    │
      │   (GraphQL 2024-01)       │
      └───────────────────────────┘
```

### Integration Benefits

✅ **Unified Commerce** - Single source of truth for product data
✅ **Real-Time Inventory** - Live stock levels and availability
✅ **Shopping Cart** - Complete cart management with persistent storage
✅ **Enhanced Product Data** - Rich metafields, variants, and media
✅ **SEO Optimized** - Server-side rendering with ISR caching
✅ **Developer Experience** - Type-safe APIs with IntelliSense support
✅ **Performance First** - Aggressive caching and minimal client JS

---

## Quick Start

### Prerequisites

- Shopify store with API access
- Storefront API access token (public)
- Admin API access token (private, optional)
- Next.js 15 app with App Router
- Bun package manager

### Environment Setup

Add the following variables to `.env.local`:

```bash
# Shopify Configuration
# Server-only (for Admin API - keep private)
SHOPIFY_ADMIN_ACCESS_TOKEN=your-admin-access-token

# Public (for Storefront API - safe to expose to client)
# IMPORTANT: Use NEXT_PUBLIC_ prefix to enable access in client components
# This is required for cart functionality and other client-side features
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token

# Optional Configuration
SHOPIFY_API_VERSION=2024-01          # API version (default: 2024-01)
SHOPIFY_CACHE_TTL=300                # Cache duration in seconds (default: 300)
```

**Why `NEXT_PUBLIC_` Prefix?**

Next.js client components ('use client') can only access environment variables with the `NEXT_PUBLIC_` prefix. Since the cart functionality and other interactive features run in client components, the Storefront API credentials must use this prefix.

- **Storefront API** - Public-facing API designed to be safely exposed to clients. Uses `NEXT_PUBLIC_` prefix for client component access (cart, product browsing).
- **Admin API** - Private API for server-side operations only. Never use `NEXT_PUBLIC_` prefix to keep credentials secure.

### Basic Usage Example

```tsx
// src/app/(frontend)/shop/page.tsx
import { getAllProducts } from '@/lib/shopify'

// Server Component with ISR
export const revalidate = 300 // 5 minutes

export default async function ShopPage() {
  // Fetch products server-side
  const products = await getAllProducts({ first: 12 })

  if (!products || products.length === 0) {
    return <div>No products available</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

### Quick Start: Shopping Cart

```tsx
// Add to cart from product page
import { addToCart, createCart } from '@/lib/shopify'

async function handleAddToCart(variantId: string, quantity: number) {
  // Cart operations happen client-side via server actions
  const cart = await addToCart({ variantId, quantity })
  // Cart ID is automatically persisted in localStorage
}
```

---

## Core Concepts

### API Selection: Storefront vs Admin

**Storefront API** (Public)
- ✅ Product listings and search
- ✅ Public product details
- ✅ Customer-facing data
- ✅ No authentication required (uses public token)
- ✅ Rate limit: 1000 req/min
- ❌ Cannot access draft products
- ❌ Limited metafield access

**Admin API** (Privileged)
- ✅ Full product management
- ✅ Inventory updates
- ✅ All metafields and private data
- ✅ Draft and archived products
- ❌ Requires private access token
- ❌ Rate limit: 40 req/sec (REST), 1000 points/sec (GraphQL)

**Recommendation**: Use Storefront API for public-facing pages, Admin API for internal tools and CMS sync operations.

### Product Data Structure

Shopify products follow this hierarchy:

```typescript
Product
├── id: string (Shopify GID)
├── title: string
├── handle: string (URL slug)
├── description: string
├── descriptionHtml: string
├── productType: string
├── vendor: string
├── tags: string[]
├── availableForSale: boolean
├── priceRange
│   ├── minVariantPrice { amount, currencyCode }
│   └── maxVariantPrice { amount, currencyCode }
├── images[]
│   ├── url: string (Shopify CDN)
│   ├── altText: string
│   ├── width: number
│   └── height: number
├── variants[]
│   ├── id: string
│   ├── title: string
│   ├── sku: string
│   ├── price: { amount, currencyCode }
│   ├── compareAtPrice: { amount, currencyCode }
│   └── image: { url, altText }
└── metafields[]
    ├── namespace: string
    ├── key: string
    ├── value: string
    └── type: string
```

### Caching Strategy

The integration implements a multi-layer caching approach:

```
┌──────────────────────────────────────────────┐
│ Layer 1: Next.js ISR (5-15 min)              │
│ - Static generation with revalidation        │
│ - Page-level caching                         │
└──────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────┐
│ Layer 2: In-Memory Cache (LRU)               │
│ - Function-level caching (5 min default)     │
│ - Shared across requests                     │
└──────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────┐
│ Layer 3: Shopify CDN                         │
│ - Image delivery via Shopify CDN             │
│ - GraphQL response caching                   │
└──────────────────────────────────────────────┘
```

**Cache Invalidation**: Use on-demand revalidation (similar to existing Payload CMS pattern) to clear caches when products are updated in Shopify.

---

## API Reference

### Product Fetching Functions

#### `getAllProducts(options?)`

Fetches a paginated list of products from Shopify.

**Type Signature**:
```typescript
async function getAllProducts(options?: {
  first?: number          // Number of products to fetch (default: 12, max: 250)
  after?: string          // Pagination cursor for next page
  query?: string          // Search query (Shopify search syntax)
  sortKey?: ProductSortKeys  // Sort order (default: 'TITLE')
  reverse?: boolean       // Reverse sort order
}): Promise<ShopifyProduct[]>
```

**Example Usage**:
```tsx
// Fetch first 12 products
const products = await getAllProducts()

// Fetch 24 products sorted by price
const sortedProducts = await getAllProducts({
  first: 24,
  sortKey: 'PRICE',
  reverse: false
})

// Search products
const searchResults = await getAllProducts({
  first: 12,
  query: 'piano digital'
})

// Pagination
const nextPage = await getAllProducts({
  first: 12,
  after: pageInfo.endCursor
})
```

**Returns**: Array of `ShopifyProduct` objects

**Caching**: Cached for 5 minutes (configurable via `SHOPIFY_CACHE_TTL`)

**Error Handling**: Returns empty array on error, logs error to console

---

#### `getProductByHandle(handle)`

Fetches a single product by its URL handle (slug).

**Type Signature**:
```typescript
async function getProductByHandle(
  handle: string
): Promise<ShopifyProduct | null>
```

**Example Usage**:
```tsx
// In product detail page
export default async function ProductPage({
  params
}: {
  params: { handle: string }
}) {
  const product = await getProductByHandle(params.handle)

  if (!product) {
    notFound()
  }

  return <ProductDetail product={product} />
}
```

**Returns**: `ShopifyProduct` object or `null` if not found

**Caching**: Cached for 15 minutes (longer than list queries)

**Error Handling**: Returns `null` on error or not found

---

#### `getProductById(id)`

Fetches a single product by its Shopify Global ID (GID).

**Type Signature**:
```typescript
async function getProductById(
  id: string  // Shopify GID format: gid://shopify/Product/123456789
): Promise<ShopifyProduct | null>
```

**Example Usage**:
```tsx
const product = await getProductById('gid://shopify/Product/8692854874407')
```

**Returns**: `ShopifyProduct` object or `null` if not found

**Caching**: Cached for 15 minutes

**Error Handling**: Returns `null` on error or not found

---

#### `getProductsByType(productType, options?)`

Fetches products filtered by product type.

**Type Signature**:
```typescript
async function getProductsByType(
  productType: string,
  options?: {
    first?: number
    sortKey?: ProductSortKeys
    reverse?: boolean
  }
): Promise<ShopifyProduct[]>
```

**Example Usage**:
```tsx
// Fetch all digital pianos
const digitalPianos = await getProductsByType('Digital Piano', {
  first: 24,
  sortKey: 'PRICE'
})

// Fetch accessories
const accessories = await getProductsByType('Accessories')
```

**Returns**: Array of `ShopifyProduct` objects

**Caching**: Cached for 5 minutes

**Error Handling**: Returns empty array on error

---

#### `getProductsByTag(tag, options?)`

Fetches products filtered by tag.

**Type Signature**:
```typescript
async function getProductsByTag(
  tag: string,
  options?: {
    first?: number
    sortKey?: ProductSortKeys
    reverse?: boolean
  }
): Promise<ShopifyProduct[]>
```

**Example Usage**:
```tsx
// Fetch featured products
const featuredProducts = await getProductsByTag('featured')

// Fetch new arrivals
const newArrivals = await getProductsByTag('new-arrival', {
  first: 6,
  sortKey: 'CREATED_AT',
  reverse: true
})
```

**Returns**: Array of `ShopifyProduct` objects

**Caching**: Cached for 5 minutes

**Error Handling**: Returns empty array on error

---

### Shopping Cart Functions

The Shopify integration provides a complete shopping cart solution using the Storefront API's Cart API. Cart operations are optimized for performance with automatic persistence and error handling.

#### **Cart Workflow Overview**

```
┌────────────────────────────────────────────────────────────────┐
│  Shopping Cart Flow                                            │
└────────────────────────────────────────────────────────────────┘

  Browse Products → Add to Cart → Update Quantities → Checkout
       ↓                ↓              ↓                  ↓
   Product Page    createCart()   updateCartLine()   getCheckoutUrl()
                   addToCart()    removeFromCart()
                                                           ↓
                                                    Shopify Checkout
                                                           ↓
                                                    Order Completion
```

**Cart State Management**:
- Cart ID stored in `localStorage` (`shopify-cart-id`)
- Automatic cart creation when first item added
- Cart persists across sessions (until Shopify expiration)
- Graceful handling of expired carts with automatic recreation

---

#### `createCart()`

Creates a new shopping cart in Shopify.

**Type Signature**:
```typescript
async function createCart(input?: {
  lines?: Array<{
    merchandiseId: string  // Product variant ID (gid://shopify/ProductVariant/...)
    quantity: number
  }>
  buyerIdentity?: {
    email?: string
    phone?: string
    countryCode?: string
  }
  discountCodes?: string[]
}): Promise<Cart | null>
```

**Example Usage**:
```tsx
// Create empty cart
const cart = await createCart()

// Create cart with initial items
const cart = await createCart({
  lines: [
    {
      merchandiseId: 'gid://shopify/ProductVariant/123456',
      quantity: 1
    }
  ],
  buyerIdentity: {
    email: 'customer@example.com',
    countryCode: 'US'
  }
})
```

**Returns**: `Cart` object with cart ID, lines, and costs, or `null` on error

**Behavior**:
- Automatically saves cart ID to localStorage
- Creates cart with specified initial items (optional)
- Validates variant IDs and quantities
- Returns null on GraphQL errors

**Error Handling**: Returns `null` on failure, logs error to console

---

#### `addToCart()`

Adds items to an existing cart or creates a new cart if none exists.

**Type Signature**:
```typescript
async function addToCart(input: {
  merchandiseId: string     // Product variant ID
  quantity: number          // Number of items to add
  cartId?: string          // Optional cart ID (auto-retrieves from storage if omitted)
}): Promise<Cart | null>
```

**Example Usage**:
```tsx
// Add item to current cart (cart ID retrieved automatically)
const cart = await addToCart({
  merchandiseId: 'gid://shopify/ProductVariant/123456',
  quantity: 2
})

// Add item to specific cart
const cart = await addToCart({
  merchandiseId: 'gid://shopify/ProductVariant/123456',
  quantity: 1,
  cartId: 'gid://shopify/Cart/abc123'
})
```

**Returns**: Updated `Cart` object or `null` on error

**Smart Behavior**:
- **Auto-creates cart**: If no cart exists, creates one automatically
- **Merges quantities**: If variant already in cart, adds to existing quantity
- **Storage sync**: Automatically saves cart ID to localStorage
- **Expired cart handling**: Creates new cart if existing cart expired

**Performance**: Optimized mutation query fetches only necessary cart data

---

#### `updateCartLine()`

Updates the quantity of an existing cart line item.

**Type Signature**:
```typescript
async function updateCartLine(input: {
  cartId: string           // Cart ID
  lineId: string           // Cart line ID (from cart.lines[].id)
  quantity: number         // New quantity (0 to remove)
}): Promise<Cart | null>
```

**Example Usage**:
```tsx
// Update quantity of a cart line
const cart = await updateCartLine({
  cartId: 'gid://shopify/Cart/abc123',
  lineId: 'gid://shopify/CartLine/xyz789',
  quantity: 5
})

// Remove item by setting quantity to 0
const cart = await updateCartLine({
  cartId: cartId,
  lineId: lineId,
  quantity: 0
})
```

**Returns**: Updated `Cart` object or `null` on error

**Validation**:
- Quantity must be ≥ 0
- Setting quantity to 0 removes the line item
- Invalid line ID returns null

**Use Cases**:
- Increment/decrement item quantities
- Remove items (quantity: 0)
- Bulk quantity updates

---

#### `removeFromCart()`

Removes one or more line items from the cart.

**Type Signature**:
```typescript
async function removeFromCart(input: {
  cartId: string           // Cart ID
  lineIds: string[]        // Array of cart line IDs to remove
}): Promise<Cart | null>
```

**Example Usage**:
```tsx
// Remove single item
const cart = await removeFromCart({
  cartId: 'gid://shopify/Cart/abc123',
  lineIds: ['gid://shopify/CartLine/xyz789']
})

// Remove multiple items
const cart = await removeFromCart({
  cartId: cartId,
  lineIds: [lineId1, lineId2, lineId3]
})
```

**Returns**: Updated `Cart` object or `null` on error

**Performance**: Single mutation handles multiple line removals efficiently

**Note**: Prefer this over `updateCartLine()` with quantity 0 when removing items

---

#### `getCart()`

Retrieves the current cart by ID.

**Type Signature**:
```typescript
async function getCart(cartId?: string): Promise<Cart | null>
```

**Example Usage**:
```tsx
// Get cart from localStorage
const cart = await getCart()

// Get specific cart by ID
const cart = await getCart('gid://shopify/Cart/abc123')
```

**Returns**: `Cart` object with full cart data, or `null` if cart doesn't exist

**Cart Data Includes**:
- `id`: Cart ID
- `lines`: Array of cart line items with product data
- `cost`: Subtotal, taxes, total amounts
- `checkoutUrl`: Direct link to Shopify checkout
- `totalQuantity`: Total number of items in cart

**Auto-Retrieval**: If no `cartId` provided, automatically retrieves from localStorage

---

#### `getCheckoutUrl()`

Gets the Shopify checkout URL for completing the purchase.

**Type Signature**:
```typescript
function getCheckoutUrl(cart: Cart): string | null
```

**Example Usage**:
```tsx
const cart = await getCart()
if (cart) {
  const checkoutUrl = getCheckoutUrl(cart)
  if (checkoutUrl) {
    window.location.href = checkoutUrl  // Redirect to Shopify checkout
  }
}

// Or use cart.checkoutUrl directly
const checkoutUrl = cart.checkoutUrl
```

**Returns**: Checkout URL string or `null` if cart has no checkout URL

**Redirect Pattern**:
```tsx
// Client component checkout button
'use client'

export function CheckoutButton({ cart }: { cart: Cart }) {
  const handleCheckout = () => {
    const url = getCheckoutUrl(cart)
    if (url) {
      window.location.href = url  // Navigate to Shopify checkout
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={!cart || cart.totalQuantity === 0}
      className="btn-primary"
    >
      Proceed to Checkout
    </button>
  )
}
```

---

#### `applyDiscountCode()`

Applies a discount code to the cart.

**Type Signature**:
```typescript
async function applyDiscountCode(input: {
  cartId: string
  discountCode: string
}): Promise<Cart | null>
```

**Example Usage**:
```tsx
const cart = await applyDiscountCode({
  cartId: 'gid://shopify/Cart/abc123',
  discountCode: 'SUMMER2024'
})

// Check if discount was applied
if (cart?.discountCodes && cart.discountCodes.length > 0) {
  console.log('Discount applied:', cart.discountCodes[0].code)
}
```

**Returns**: Updated `Cart` object with discount information, or `null` on error

**Discount Information**:
- Valid discount codes appear in `cart.discountCodes[]`
- Invalid codes return cart unchanged (no error)
- Discount amounts reflected in `cart.cost.totalAmount`

**Validation**: Shopify validates discount code eligibility server-side

---

#### Cart Storage Functions

Utility functions for managing cart ID persistence in `localStorage`.

**Type Signatures**:
```typescript
// Save cart ID to localStorage
function saveCartId(cartId: string): void

// Get cart ID from localStorage
function getCartId(): string | null

// Clear cart ID from localStorage
function clearCartId(): void
```

**Example Usage**:
```tsx
import { saveCartId, getCartId, clearCartId } from '@/lib/shopify/cart'

// Manual cart ID management (usually automatic)
saveCartId('gid://shopify/Cart/abc123')

const cartId = getCartId()
console.log('Current cart:', cartId)

// Clear cart after checkout
clearCartId()
```

**Automatic Storage**: Most cart functions (`addToCart`, `createCart`) automatically manage storage

**Storage Key**: `shopify-cart-id`

**When to Use**:
- Custom cart implementations
- Manual cart session management
- Testing and debugging cart flows

---

### Cart Type Definitions

#### `Cart`

Complete shopping cart object returned by Shopify Cart API.

```typescript
interface Cart {
  /** Shopify cart ID */
  id: string
  /** Cart line items */
  lines: CartLine[]
  /** Cart cost breakdown */
  cost: CartCost
  /** Direct checkout URL */
  checkoutUrl: string
  /** Total number of items in cart */
  totalQuantity: number
  /** Buyer identity information */
  buyerIdentity?: CartBuyerIdentity
  /** Applied discount codes */
  discountCodes?: DiscountCode[]
  /** Estimated shipping costs */
  estimatedCost?: CartCost
}
```

---

#### `CartLine`

Individual line item in the cart.

```typescript
interface CartLine {
  /** Cart line ID (for updates/removals) */
  id: string
  /** Item quantity */
  quantity: number
  /** Associated product variant */
  merchandise: {
    id: string                   // Variant ID
    title: string                // Variant title
    sku: string | null
    price: Money
    product: {
      id: string
      title: string
      handle: string
      images: ProductImage[]
    }
  }
  /** Line item cost */
  cost: {
    totalAmount: Money           // Line total (quantity × price)
    amountPerQuantity: Money     // Price per unit
    compareAtAmountPerQuantity?: Money | null  // Original price (for sales)
  }
}
```

---

#### `CartCost`

Cart cost breakdown including subtotal, taxes, and total.

```typescript
interface CartCost {
  /** Subtotal (before taxes and shipping) */
  subtotalAmount: Money
  /** Total tax amount */
  totalTaxAmount?: Money | null
  /** Total amount (subtotal + taxes + shipping - discounts) */
  totalAmount: Money
  /** Total duties (international orders) */
  totalDutyAmount?: Money | null
}
```

---

#### `CartBuyerIdentity`

Optional buyer information for the cart.

```typescript
interface CartBuyerIdentity {
  /** Customer email */
  email?: string
  /** Customer phone number */
  phone?: string
  /** Customer ID (for logged-in users) */
  customerId?: string
  /** Country code (ISO 3166-1 alpha-2) */
  countryCode?: string
  /** Delivery address */
  deliveryAddressPreferences?: Array<{
    deliveryAddress: {
      address1?: string
      address2?: string
      city?: string
      province?: string
      country?: string
      zip?: string
    }
  }>
}
```

---

#### `DiscountCode`

Applied discount code information.

```typescript
interface DiscountCode {
  /** Discount code string */
  code: string
  /** Whether the code is applicable */
  applicable: boolean
}
```

---

#### Cart Input Types

**`CartLineInput`** - For adding items to cart:
```typescript
interface CartLineInput {
  merchandiseId: string     // Variant ID
  quantity: number          // Item quantity
  attributes?: Array<{      // Custom line item attributes
    key: string
    value: string
  }>
}
```

**`CartInput`** - For creating new carts:
```typescript
interface CartInput {
  lines?: CartLineInput[]
  buyerIdentity?: CartBuyerIdentity
  discountCodes?: string[]
  note?: string            // Cart note/message
}
```

---

### Navigation & Mega Menu

The Shopify integration includes a dynamic navigation system for displaying product types in a full-width mega menu. This system fetches product types from Shopify and displays sample products for each category.

#### **Navigation Architecture**

```
Header Component → fetchProductsNavigation() → getProductTypesWithProducts()
                                                        ↓
                                              Shopify Products Query
                                                        ↓
                                              Group by Product Type
                                                        ↓
                                        ProductsMegaMenu Component
```

**Features**:
- Dynamic product type extraction from Shopify catalog
- Sidebar navigation with product type categories
- Product grid preview (6 products per type)
- Full-width mega menu with smooth animations
- 5-minute cache for optimal performance
- Responsive design with mobile support

---

#### `getProductTypes()`

Fetches all unique product types from the Shopify catalog.

**Type Signature**:
```typescript
async function getProductTypes(
  options?: ShopifyRequestOptions
): Promise<string[]>
```

**Example Usage**:
```tsx
const productTypes = await getProductTypes()
// Returns: ["Digital Piano", "Grand Piano", "Accessory", "Upright Piano"]
```

**Returns**: Array of unique product type strings sorted alphabetically

**Caching**: Cached for 5 minutes (configurable via `revalidate` option)

**Implementation Details**:
- Fetches up to 250 products to extract types
- Filters out empty/null product types
- Returns unique types sorted alphabetically
- Uses `GET_PRODUCTS_MINIMAL` query for performance

---

#### `getProductTypesWithProducts()`

Fetches product types with sample products for navigation menus.

**Type Signature**:
```typescript
async function getProductTypesWithProducts(
  options?: ShopifyRequestOptions
): Promise<ProductsNavigation>
```

**Example Usage**:
```tsx
// In server action or server component
const navData = await getProductTypesWithProducts({
  revalidate: 300 // 5 minutes
})

console.log(navData)
// {
//   types: [
//     {
//       type: "Digital Piano",
//       count: 12,
//       products: [ /* 6 sample products */ ]
//     },
//     {
//       type: "Grand Piano",
//       count: 8,
//       products: [ /* 6 sample products */ ]
//     }
//   ],
//   totalProducts: 24,
//   updatedAt: Date
// }
```

**Returns**: `ProductsNavigation` object with types, products, and metadata

**Performance**:
- Fetches up to 250 products in single query
- Groups products by type in-memory
- Returns 6 sample products per type for preview
- Optimized for mega menu rendering

**Caching**: Recommended 5-minute revalidation for navigation data

---

#### `getProductsByTypeForNav()`

Fetches products filtered by type, optimized for navigation display.

**Type Signature**:
```typescript
async function getProductsByTypeForNav(
  productType: string,
  options?: { first?: number; revalidate?: number }
): Promise<ProductNav[]>
```

**Example Usage**:
```tsx
const digitalPianos = await getProductsByTypeForNav('Digital Piano', {
  first: 6,
  revalidate: 300
})

// Returns minimal product data optimized for navigation
```

**Returns**: Array of `ProductNav` objects with essential display data

**Product Data Includes**:
- `id`: Product ID
- `title`: Product name
- `handle`: URL slug
- `image`: Primary product image
- `price`: Display price with currency
- `available`: Availability status

**Use Cases**:
- Mega menu product previews
- Category navigation links
- Quick product browsing

---

#### Navigation Type Definitions

**`ProductsNavigation`** - Navigation data structure:
```typescript
interface ProductsNavigation {
  /** Array of product types with sample products */
  types: ProductTypeNav[]
  /** Total number of products in catalog */
  totalProducts: number
  /** Timestamp of data fetch */
  updatedAt: Date
}
```

**`ProductTypeNav`** - Product type category:
```typescript
interface ProductTypeNav {
  /** Product type name (e.g., "Digital Piano") */
  type: string
  /** Total number of products in this type */
  count: number
  /** Sample products for preview (max 6) */
  products: ProductNav[]
}
```

**`ProductNav`** - Minimal product data for navigation:
```typescript
interface ProductNav {
  id: string
  title: string
  handle: string
  image: {
    url: string
    alt: string
  } | null
  price: {
    amount: string
    currencyCode: string
    display: string  // Formatted: "$1,299.00"
  }
  available: boolean
}
```

---

### Navigation Implementation

#### Server Action for Navigation Data

Create a server action to fetch navigation data in client components:

```typescript
// src/lib/actions/shopify-navigation.ts
'use server'

import { getProductTypesWithProducts } from '@/lib/shopify'
import type { ProductsNavigation } from '@/lib/shopify'

/**
 * Fetch products navigation data for mega menu
 * Cached for 5 minutes (300 seconds)
 */
export async function fetchProductsNavigation(): Promise<ProductsNavigation> {
  try {
    const navData = await getProductTypesWithProducts({
      revalidate: 300, // Cache for 5 minutes
    })

    return navData
  } catch (error) {
    console.error('[Server Action] Failed to fetch products navigation:', error)

    // Return empty navigation data on error
    return {
      types: [],
      totalProducts: 0,
      updatedAt: new Date(),
    }
  }
}
```

---

#### ProductsMegaMenu Component

Full-width mega menu component with product type sidebar and product grid:

```tsx
// src/components/navigation/ProductsMegaMenu.tsx
'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import type { ProductTypeNav } from '@/lib/shopify'

interface ProductsMegaMenuProps {
  /** Product types with sample products */
  productTypes: ProductTypeNav[]
  /** Whether the menu is currently open */
  isOpen: boolean
  /** Callback when menu should close */
  onClose: () => void
}

export function ProductsMegaMenu({
  productTypes,
  isOpen,
  onClose,
}: ProductsMegaMenuProps) {
  // Default to first product type
  const [selectedType, setSelectedType] = useState<string | null>(
    productTypes[0]?.type || null
  )

  const selectedTypeData = productTypes.find((t) => t.type === selectedType)

  const handleTypeSelect = useCallback((type: string) => {
    setSelectedType(type)
  }, [])

  const handleProductClick = useCallback(() => {
    onClose()
  }, [onClose])

  if (!isOpen || productTypes.length === 0) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="fixed left-0 right-0 z-50 bg-white border-t border-b border-gray-200/50 shadow-2xl"
        style={{
          top: 'var(--header-height, 80px)',
          width: '100vw',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-12 gap-0">
            {/* Sidebar - Product Types */}
            <div className="col-span-3 border-r border-gray-200/50 bg-gray-50/50 py-2">
              <div className="pr-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4 px-4">
                  Product Categories
                </h3>
                <nav className="space-y-1">
                  {productTypes.map((typeData) => (
                    <button
                      key={typeData.type}
                      onClick={() => handleTypeSelect(typeData.type)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                        selectedType === typeData.type
                          ? 'bg-white text-kawai-red font-semibold shadow-sm'
                          : 'text-gray-700 hover:bg-white hover:text-gray-900'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="font-medium">{typeData.type}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {typeData.count} {typeData.count === 1 ? 'product' : 'products'}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ))}
                </nav>

                {/* View All Products Link */}
                <div className="mt-6 pt-6 border-t border-gray-200/50">
                  <Link
                    href="/products"
                    onClick={onClose}
                    className="block px-4 py-2 text-sm font-medium text-kawai-red hover:text-kawai-red/80 transition-colors"
                  >
                    View All Products →
                  </Link>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="col-span-9 pl-6">
              <AnimatePresence mode="wait">
                {selectedTypeData && (
                  <motion.div
                    key={selectedTypeData.type}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Header */}
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {selectedTypeData.type}
                      </h2>
                      <p className="text-sm text-gray-600">
                        Explore our collection of {selectedTypeData.count} products
                      </p>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {selectedTypeData.products.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.handle}`}
                          onClick={handleProductClick}
                          className="group block bg-white rounded-lg border border-gray-200/50 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-200"
                        >
                          {/* Product Image */}
                          <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                            {product.image ? (
                              <Image
                                src={product.image.url}
                                alt={product.image.alt}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                                No image
                              </div>
                            )}

                            {/* Availability Badge */}
                            {!product.available && (
                              <div className="absolute top-2 right-2">
                                <span className="inline-block px-2 py-1 bg-gray-900/80 text-white text-xs font-medium rounded">
                                  Out of Stock
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="p-3">
                            <h3 className="font-semibold text-sm text-gray-900 group-hover:text-kawai-red transition-colors line-clamp-2 mb-1">
                              {product.title}
                            </h3>
                            <p className="text-sm font-bold text-kawai-red">
                              {product.price.display}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* View Category Link */}
                    <div className="pt-4 border-t border-gray-200/50">
                      <Link
                        href={`/products?type=${encodeURIComponent(selectedTypeData.type)}`}
                        onClick={onClose}
                        className="inline-flex items-center text-sm font-medium text-kawai-red hover:text-kawai-red/80 transition-colors"
                      >
                        View All {selectedTypeData.type} Products
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
```

---

#### Header Integration

Integrate the mega menu into your header component:

```tsx
// src/components/layout/header.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { ProductsMegaMenu } from '@/components/navigation/ProductsMegaMenu'
import { fetchProductsNavigation } from '@/lib/actions/shopify-navigation'
import type { ProductsNavigation } from '@/lib/shopify'

export default function Header() {
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false)
  const [productsNavData, setProductsNavData] = useState<ProductsNavigation | null>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  // Fetch navigation data on mount
  useEffect(() => {
    const loadProductsNav = async () => {
      const navData = await fetchProductsNavigation()
      setProductsNavData(navData)
    }
    loadProductsNav()
  }, [])

  // Track header height for mega menu positioning
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight
        document.documentElement.style.setProperty('--header-height', `${height}px`)
      }
    }
    updateHeaderHeight()
    window.addEventListener('resize', updateHeaderHeight)
    return () => window.removeEventListener('resize', updateHeaderHeight)
  }, [])

  const handleProductsMenuOpen = () => setIsProductsMenuOpen(true)
  const handleProductsMenuClose = () => setIsProductsMenuOpen(false)

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        {/* Products Menu Item */}
        <div
          onMouseEnter={handleProductsMenuOpen}
          onMouseLeave={handleProductsMenuClose}
        >
          <button className="px-4 py-2 font-medium text-gray-700 hover:text-kawai-red">
            Products
          </button>
        </div>

        {/* Other navigation items */}
      </nav>

      {/* Mega Menu (rendered at header root level) */}
      {productsNavData && productsNavData.types.length > 0 && (
        <div onMouseEnter={handleProductsMenuOpen} onMouseLeave={handleProductsMenuClose}>
          <ProductsMegaMenu
            productTypes={productsNavData.types}
            isOpen={isProductsMenuOpen}
            onClose={() => setIsProductsMenuOpen(false)}
          />
        </div>
      )}
    </header>
  )
}
```

**Key Implementation Notes**:
- **Fixed Positioning**: Mega menu uses `position: fixed` for full-viewport width
- **Dynamic Header Height**: CSS variable `--header-height` tracks header size
- **Hover State Management**: Menu opens on `mouseEnter`, closes on `mouseLeave`
- **Root-Level Rendering**: Mega menu renders at header root to avoid container constraints
- **Performance**: Navigation data loaded once on mount with 5-minute cache

---

#### Next.js Configuration

**IMPORTANT**: Add Shopify CDN to allowed image domains in `next.config.js`:

```javascript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      // ... existing patterns
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/**',
      },
    ],
  },
}
```

**Why This is Required**:
- Shopify product images are hosted on `cdn.shopify.com`
- Next.js Image component requires whitelisted domains
- Without this configuration, images will fail to load with `Invalid src prop` error
- **Restart dev server** after adding this configuration

---

#### Best Practices

**Performance Optimization**:
- Cache navigation data for 5 minutes (300 seconds)
- Fetch only 6 sample products per type for preview
- Use `GET_PRODUCTS_MINIMAL` query to reduce payload size
- Lazy load mega menu component with dynamic imports (optional)

**User Experience**:
- Hover interactions with smooth animations (Framer Motion)
- Keyboard navigation support for accessibility
- Mobile-responsive design with collapsible sidebar
- Loading states for async navigation data

**Error Handling**:
- Graceful fallback to empty navigation on API errors
- Hide mega menu if no product types available
- Console warnings for debugging in development

**Type Safety**:
- Use generated Shopify types for all navigation data
- Explicit type annotations for all function parameters
- Proper null/undefined handling with optional chaining

---

### Advanced Queries

#### `getProductMetafields(productId, identifiers)`

Fetches specific metafields for a product (requires Admin API).

**Type Signature**:
```typescript
async function getProductMetafields(
  productId: string,
  identifiers: Array<{ namespace: string; key: string }>
): Promise<Metafield[]>
```

**Example Usage**:
```tsx
const metafields = await getProductMetafields(
  'gid://shopify/Product/8692854874407',
  [
    { namespace: 'custom', key: 'specifications' },
    { namespace: 'custom', key: 'features' },
    { namespace: 'seo', key: 'hidden_keywords' }
  ]
)
```

**Returns**: Array of `Metafield` objects

**Requires**: Admin API access token

**Caching**: Cached for 15 minutes

---

#### `getProductVariants(productId)`

Fetches all variants for a product.

**Type Signature**:
```typescript
async function getProductVariants(
  productId: string
): Promise<ProductVariant[]>
```

**Example Usage**:
```tsx
const variants = await getProductVariants(product.id)

// Find specific variant by SKU
const variant = variants.find(v => v.sku === 'KAWAI-ES920-BLK')
```

**Returns**: Array of `ProductVariant` objects

**Caching**: Cached for 10 minutes

---

### Type Definitions

#### `ShopifyProduct`

```typescript
interface ShopifyProduct {
  id: string                    // Shopify GID
  title: string
  handle: string                // URL slug
  description: string           // Plain text
  descriptionHtml: string       // HTML formatted
  productType: string
  vendor: string
  tags: string[]
  availableForSale: boolean
  createdAt: string             // ISO 8601 date
  updatedAt: string             // ISO 8601 date
  onlineStoreUrl: string | null // Full URL to Shopify store page
  priceRange: {
    minVariantPrice: Money
    maxVariantPrice: Money
  }
  images: ProductImage[]
  variants: ProductVariant[]
  metafields: Metafield[]
}
```

#### `ProductImage`

```typescript
interface ProductImage {
  id: string
  url: string                   // Shopify CDN URL
  altText: string | null
  width: number
  height: number
}
```

#### `ProductVariant`

```typescript
interface ProductVariant {
  id: string
  title: string
  sku: string | null
  availableForSale: boolean
  price: Money
  compareAtPrice: Money | null  // Original price (for sale display)
  inventoryQuantity?: number    // Only available via Admin API
  image: ProductImage | null
}
```

#### `Money`

```typescript
interface Money {
  amount: string                // Decimal string (e.g., "1299.00")
  currencyCode: string          // ISO 4217 code (e.g., "USD")
}
```

#### `Metafield`

```typescript
interface Metafield {
  id?: string
  namespace: string
  key: string
  value: string
  type: string                  // e.g., "single_line_text", "json", "number_integer"
}
```

---

## Usage Examples

### Shopping Cart Implementation

#### Simple Add to Cart Button

```tsx
// src/components/shop/AddToCartButton.tsx
'use client'

import { useState } from 'react'
import { addToCart } from '@/lib/shopify/cart'
import type { ProductVariant } from '@/lib/shopify/types'

interface AddToCartButtonProps {
  variant: ProductVariant
  quantity?: number
}

export function AddToCartButton({ variant, quantity = 1 }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      const cart = await addToCart({
        merchandiseId: variant.id,
        quantity
      })

      if (cart) {
        setAdded(true)
        // Optional: Show cart drawer or update cart badge
        setTimeout(() => setAdded(false), 2000)
      } else {
        alert('Failed to add item to cart')
      }
    } catch (error) {
      console.error('Add to cart error:', error)
      alert('Failed to add item to cart')
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
      {loading ? 'Adding...' : added ? 'Added to Cart!' : 'Add to Cart'}
    </button>
  )
}
```

---

#### Cart Page Component

```tsx
// src/app/(frontend)/cart/page.tsx
import { getCart } from '@/lib/shopify/cart'
import { CartLineItem } from '@/components/shop/CartLineItem'
import { CheckoutButton } from '@/components/shop/CheckoutButton'
import Link from 'next/link'

// Force dynamic rendering for real-time cart updates
export const dynamic = 'force-dynamic'

export default async function CartPage() {
  const cart = await getCart()

  if (!cart || cart.totalQuantity === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">
          Browse our collection and add items to your cart
        </p>
        <Link href="/shop" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.lines.edges.map(({ node: line }) => (
            <CartLineItem key={line.id} line={line} cartId={cart.id} />
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${parseFloat(cart.cost.subtotalAmount.amount).toFixed(2)}</span>
              </div>
              {cart.cost.totalTaxAmount && (
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${parseFloat(cart.cost.totalTaxAmount.amount).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${parseFloat(cart.cost.totalAmount.amount).toFixed(2)}</span>
              </div>
            </div>

            <CheckoutButton cart={cart} />

            <Link href="/shop" className="block text-center mt-4 text-sm text-gray-600 hover:text-gray-900">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

#### Cart Line Item Component

```tsx
// src/components/shop/CartLineItem.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { updateCartLine, removeFromCart } from '@/lib/shopify/cart'
import type { CartLine } from '@/lib/shopify/types'

interface CartLineItemProps {
  line: CartLine
  cartId: string
}

export function CartLineItem({ line, cartId }: CartLineItemProps) {
  const [quantity, setQuantity] = useState(line.quantity)
  const [updating, setUpdating] = useState(false)

  const product = line.merchandise.product
  const image = line.merchandise.image || product.featuredImage

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return

    setUpdating(true)
    try {
      const updatedCart = await updateCartLine({
        cartId,
        lineId: line.id,
        quantity: newQuantity
      })

      if (updatedCart) {
        setQuantity(newQuantity)
        // Optionally trigger a router refresh to update cart totals
        // router.refresh()
      }
    } catch (error) {
      console.error('Failed to update quantity:', error)
    } finally {
      setUpdating(false)
    }
  }

  const handleRemove = async () => {
    setUpdating(true)
    try {
      await removeFromCart({
        cartId,
        lineIds: [line.id]
      })
      // Trigger router refresh to update UI
      window.location.reload()
    } catch (error) {
      console.error('Failed to remove item:', error)
      setUpdating(false)
    }
  }

  return (
    <div className="flex gap-4 bg-white rounded-lg p-4 shadow-sm">
      {/* Product Image */}
      <Link href={`/shop/${product.handle}`} className="flex-shrink-0">
        <div className="relative w-24 h-24 rounded-md overflow-hidden">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText || product.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/shop/${product.handle}`}
          className="font-semibold hover:text-kawai-red line-clamp-2"
        >
          {product.title}
        </Link>

        {line.merchandise.title !== 'Default Title' && (
          <p className="text-sm text-gray-600">{line.merchandise.title}</p>
        )}

        <div className="mt-2 flex items-center gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center border rounded-md">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={updating || quantity <= 1}
              className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
            >
              −
            </button>
            <span className="px-4 py-1 border-x">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={updating}
              className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
            >
              +
            </button>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            disabled={updating}
            className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="text-right">
        <p className="font-bold">
          ${parseFloat(line.cost.totalAmount.amount).toFixed(2)}
        </p>
        <p className="text-sm text-gray-600">
          ${parseFloat(line.cost.amountPerQuantity.amount).toFixed(2)} each
        </p>
      </div>
    </div>
  )
}
```

---

#### Cart Drawer Component

```tsx
// src/components/shop/CartDrawer.tsx
'use client'

import { useState, useEffect } from 'react'
import { getCart } from '@/lib/shopify/cart'
import type { Cart } from '@/lib/shopify/types'
import Link from 'next/link'
import Image from 'next/image'

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)

  const loadCart = async () => {
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

  useEffect(() => {
    if (isOpen) {
      loadCart()
    }
  }, [isOpen])

  // Listen for custom 'cartUpdated' events
  useEffect(() => {
    const handleCartUpdate = () => loadCart()
    window.addEventListener('cartUpdated', handleCartUpdate)
    return () => window.removeEventListener('cartUpdated', handleCartUpdate)
  }, [])

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 hover:bg-gray-100 rounded-md"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        {cart && cart.totalQuantity > 0 && (
          <span className="absolute -top-1 -right-1 bg-kawai-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cart.totalQuantity}
          </span>
        )}
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setIsOpen(false)}
        >
          {/* Drawer Panel */}
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Shopping Cart</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : !cart || cart.totalQuantity === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Your cart is empty</p>
                <Link
                  href="/shop"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cart.lines.edges.map(({ node: line }) => (
                    <div key={line.id} className="flex gap-3 pb-4 border-b">
                      {line.merchandise.image && (
                        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={line.merchandise.image.url}
                            alt={line.merchandise.product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-2">
                          {line.merchandise.product.title}
                        </p>
                        <p className="text-sm text-gray-600">Qty: {line.quantity}</p>
                        <p className="text-sm font-bold">
                          ${parseFloat(line.cost.totalAmount.amount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Total */}
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold mb-4">
                    <span>Total</span>
                    <span>${parseFloat(cart.cost.totalAmount.amount).toFixed(2)}</span>
                  </div>

                  <a
                    href={cart.checkoutUrl}
                    className="btn-primary w-full block text-center"
                  >
                    Proceed to Checkout
                  </a>

                  <Link
                    href="/cart"
                    onClick={() => setIsOpen(false)}
                    className="block text-center mt-3 text-sm text-gray-600 hover:text-gray-900"
                  >
                    View Full Cart
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
```

---

#### Cart Persistence with React Context

```tsx
// src/contexts/CartContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getCart, getCartId } from '@/lib/shopify/cart'
import type { Cart } from '@/lib/shopify/types'

interface CartContextType {
  cart: Cart | null
  loading: boolean
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshCart = async () => {
    try {
      const cartId = getCartId()
      if (cartId) {
        const cartData = await getCart(cartId)
        setCart(cartData)
      } else {
        setCart(null)
      }
    } catch (error) {
      console.error('Failed to refresh cart:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshCart()
  }, [])

  return (
    <CartContext.Provider value={{ cart, loading, refreshCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
```

---

#### Discount Code Application

```tsx
// src/components/shop/DiscountCodeInput.tsx
'use client'

import { useState } from 'react'
import { applyDiscountCode } from '@/lib/shopify/cart'

interface DiscountCodeInputProps {
  cartId: string
  onSuccess?: () => void
}

export function DiscountCodeInput({ cartId, onSuccess }: DiscountCodeInputProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleApply = async () => {
    if (!code.trim()) return

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const cart = await applyDiscountCode({
        cartId,
        discountCode: code.trim().toUpperCase()
      })

      if (cart) {
        // Check if discount was applied
        const applied = cart.discountCodes?.some(dc => dc.code === code.trim().toUpperCase())
        if (applied) {
          setSuccess(true)
          setCode('')
          onSuccess?.()
        } else {
          setError('Invalid or inapplicable discount code')
        }
      } else {
        setError('Failed to apply discount code')
      }
    } catch (err) {
      console.error('Discount code error:', err)
      setError('Failed to apply discount code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter discount code"
          className="flex-1 px-4 py-2 border rounded-md"
          disabled={loading}
        />
        <button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
        >
          {loading ? 'Applying...' : 'Apply'}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {success && (
        <p className="text-sm text-green-600">Discount code applied successfully!</p>
      )}
    </div>
  )
}
```

---

### Cart Best Practices

#### When to Create vs. Reuse Carts

**✅ Reuse Existing Cart** (Recommended):
```tsx
// Always try to reuse existing cart
const cartId = getCartId()
if (cartId) {
  const cart = await getCart(cartId)
  if (cart) {
    // Use existing cart
    await addToCart({ merchandiseId, quantity })
  }
}
```

**🆕 Create New Cart** (Only when necessary):
```tsx
// Create new cart only when:
// 1. No cart exists
// 2. Existing cart expired
// 3. User explicitly clears cart

if (!getCartId()) {
  const cart = await createCart({
    lines: [{ merchandiseId, quantity }]
  })
}
```

---

#### Cart ID Persistence Strategies

**Browser LocalStorage** (Default):
- Persists across page reloads
- Expires when localStorage cleared
- Cart ID automatically managed

```tsx
// Automatic (preferred)
await addToCart({ merchandiseId, quantity })

// Manual (advanced use cases)
import { saveCartId, getCartId, clearCartId } from '@/lib/shopify/cart'

saveCartId(cart.id)
const storedId = getCartId()
clearCartId()
```

**Server-Side Session** (Advanced):
```tsx
// Store cart ID in server session (for logged-in users)
// src/lib/session.ts
export async function saveCartToSession(userId: string, cartId: string) {
  await db.users.update({
    where: { id: userId },
    data: { shopifyCartId: cartId }
  })
}
```

---

#### Handling Cart Expiration

Shopify carts expire after **10 days** of inactivity or when checked out.

**Graceful Expiration Handling**:
```tsx
async function loadCart() {
  const cartId = getCartId()
  if (!cartId) return null

  const cart = await getCart(cartId)

  // Cart expired or not found
  if (!cart) {
    clearCartId()  // Remove stale cart ID
    return null
  }

  return cart
}

// In add to cart logic
async function handleAddToCart(variantId: string, quantity: number) {
  let cart = await loadCart()

  // Create new cart if expired
  if (!cart) {
    cart = await createCart({
      lines: [{ merchandiseId: variantId, quantity }]
    })
  } else {
    cart = await addToCart({ merchandiseId: variantId, quantity })
  }

  return cart
}
```

---

#### Managing Out-of-Stock Scenarios

**Prevent Adding Unavailable Items**:
```tsx
// Check variant availability before adding
if (!variant.availableForSale) {
  return (
    <button disabled className="btn-disabled">
      Out of Stock
    </button>
  )
}

// Add to cart only if available
<button
  onClick={() => addToCart({ merchandiseId: variant.id, quantity: 1 })}
  disabled={!variant.availableForSale}
>
  Add to Cart
</button>
```

**Handle Stock Changes During Checkout**:
```tsx
// Display availability warnings in cart
{cart.lines.edges.map(({ node: line }) => {
  const available = line.merchandise.availableForSale

  return (
    <div key={line.id}>
      <CartLineItem line={line} />
      {!available && (
        <p className="text-red-600 text-sm">
          ⚠️ This item is no longer available
        </p>
      )}
    </div>
  )
})}
```

---

#### Performance Optimization

**Debounce Quantity Updates**:
```tsx
import { useDebounce } from '@/hooks/useDebounce'

function CartQuantityInput({ line, cartId }: { line: CartLine; cartId: string }) {
  const [quantity, setQuantity] = useState(line.quantity)
  const debouncedQuantity = useDebounce(quantity, 500)

  useEffect(() => {
    if (debouncedQuantity !== line.quantity) {
      updateCartLine({ cartId, lineId: line.id, quantity: debouncedQuantity })
    }
  }, [debouncedQuantity])

  return (
    <input
      type="number"
      value={quantity}
      onChange={(e) => setQuantity(Number(e.target.value))}
      min="1"
    />
  )
}
```

**Optimistic UI Updates**:
```tsx
async function handleUpdateQuantity(newQuantity: number) {
  // Update UI immediately (optimistic)
  setQuantity(newQuantity)

  try {
    // Then sync with server
    await updateCartLine({ cartId, lineId, quantity: newQuantity })
  } catch (error) {
    // Revert on error
    setQuantity(line.quantity)
    alert('Failed to update quantity')
  }
}
```

**Batch Cart Operations**:
```tsx
// ❌ Bad: Multiple API calls
await removeFromCart({ cartId, lineIds: [lineId1] })
await removeFromCart({ cartId, lineIds: [lineId2] })
await removeFromCart({ cartId, lineIds: [lineId3] })

// ✅ Good: Single API call
await removeFromCart({
  cartId,
  lineIds: [lineId1, lineId2, lineId3]
})
```

---

### Product Listing Page with ISR

```tsx
// src/app/(frontend)/shop/page.tsx
import { getAllProducts } from '@/lib/shopify'
import { ProductGrid } from '@/components/shop/ProductGrid'

// ISR with 5-minute revalidation
export const revalidate = 300

export default async function ShopPage() {
  const products = await getAllProducts({
    first: 24,
    sortKey: 'TITLE'
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Shop Pianos</h1>
      <ProductGrid products={products} />
    </div>
  )
}
```

### Product Detail Page with Dynamic Routes

```tsx
// src/app/(frontend)/shop/[handle]/page.tsx
import { getProductByHandle, getAllProducts } from '@/lib/shopify'
import { notFound } from 'next/navigation'
import { ProductDetail } from '@/components/shop/ProductDetail'

// Generate static params for existing products
export async function generateStaticParams() {
  const products = await getAllProducts({ first: 100 })
  return products.map((product) => ({
    handle: product.handle
  }))
}

// ISR with 15-minute revalidation
export const revalidate = 900

export default async function ProductPage({
  params
}: {
  params: { handle: string }
}) {
  const product = await getProductByHandle(params.handle)

  if (!product) {
    notFound()
  }

  return <ProductDetail product={product} />
}
```

### Filtered Product Listing

```tsx
// src/app/(frontend)/pianos/digital/page.tsx
import { getProductsByType } from '@/lib/shopify'
import { ProductCard } from '@/components/shop/ProductCard'

export const revalidate = 300

export default async function DigitalPianosPage() {
  const digitalPianos = await getProductsByType('Digital Piano', {
    first: 24,
    sortKey: 'PRICE'
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Digital Pianos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {digitalPianos.map((piano) => (
          <ProductCard key={piano.id} product={piano} />
        ))}
      </div>
    </div>
  )
}
```

### Product Card Component

```tsx
// src/components/shop/ProductCard.tsx
import Image from 'next/image'
import Link from 'next/link'
import type { ShopifyProduct } from '@/lib/shopify/types'

interface ProductCardProps {
  product: ShopifyProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const firstImage = product.images[0]
  const { minVariantPrice } = product.priceRange

  return (
    <Link
      href={`/shop/${product.handle}`}
      className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Product Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg bg-gray-100">
        {firstImage ? (
          <Image
            src={firstImage.url}
            alt={firstImage.altText || product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {product.title}
        </h3>

        {product.productType && (
          <p className="text-sm text-gray-600 mb-2">{product.productType}</p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-kawai-red">
            ${parseFloat(minVariantPrice.amount).toFixed(2)}
          </span>

          {!product.availableForSale && (
            <span className="text-sm text-gray-500">Out of Stock</span>
          )}
        </div>
      </div>
    </Link>
  )
}
```

### Search Functionality

```tsx
// src/app/(frontend)/shop/search/page.tsx
import { getAllProducts } from '@/lib/shopify'
import { ProductGrid } from '@/components/shop/ProductGrid'

// Force dynamic for search (always fresh results)
export const dynamic = 'force-dynamic'

export default async function SearchPage({
  searchParams
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q || ''

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl">Enter a search query</h1>
      </div>
    )
  }

  const results = await getAllProducts({
    first: 24,
    query
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Search Results</h1>
      <p className="text-gray-600 mb-6">
        {results.length} results for &quot;{query}&quot;
      </p>
      <ProductGrid products={results} />
    </div>
  )
}
```

### Integration with Existing Media System

```tsx
// src/components/shop/OptimizedProductImage.tsx
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import Image from 'next/image'
import type { ProductImage } from '@/lib/shopify/types'

interface OptimizedProductImageProps {
  image: ProductImage
  alt: string
  preset?: 'hero' | 'gallery' | 'card' | 'thumbnail'
  priority?: boolean
}

export function OptimizedProductImage({
  image,
  alt,
  preset = 'card',
  priority = false
}: OptimizedProductImageProps) {
  // Note: Shopify images are already on Shopify CDN
  // We can pass the URL directly or integrate with R2 for additional optimization

  // Option 1: Use Shopify CDN directly
  const imageProps = {
    src: image.url,
    width: image.width,
    height: image.height,
    alt: alt || image.altText || ''
  }

  // Option 2: Download and optimize via R2 (for better control)
  // const optimizedProps = getImagePropsWithFallback(
  //   image.url,
  //   '/images/defaults/product-fallback.jpg',
  //   preset,
  //   { priority }
  // )

  return (
    <Image
      {...imageProps}
      priority={priority}
      sizes={
        preset === 'hero'
          ? '(max-width: 768px) 100vw, 50vw'
          : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw'
      }
      className="object-cover"
    />
  )
}
```

---

## Caching & Performance

### Caching Configuration

The library implements a configurable caching strategy:

```typescript
// src/lib/shopify/cache.ts
const CACHE_CONFIG = {
  products: {
    list: 300,      // 5 minutes for product lists
    single: 900,    // 15 minutes for individual products
    search: 180     // 3 minutes for search results
  },
  collections: 600, // 10 minutes for collections
  maxSize: 100      // LRU cache max entries
}
```

### Cache Invalidation

**Time-Based** (Automatic):
```tsx
// ISR revalidation at page level
export const revalidate = 300 // 5 minutes
```

**On-Demand** (Manual):
```typescript
// src/app/api/revalidate-shopify/route.ts
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { secret, handle } = await request.json()

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  // Revalidate specific product page
  revalidatePath(`/shop/${handle}`)

  // Revalidate shop listing page
  revalidatePath('/shop')

  return NextResponse.json({ revalidated: true })
}
```

**Webhook-Based** (Shopify → Next.js):
```typescript
// src/app/api/webhooks/shopify/products/update/route.ts
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { verifyShopifyWebhook } from '@/lib/shopify/webhooks'

export async function POST(request: NextRequest) {
  // Verify webhook signature
  const isValid = await verifyShopifyWebhook(request)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = await request.json()
  const { handle } = payload

  // Clear cache for updated product
  revalidatePath(`/shop/${handle}`)
  revalidatePath('/shop')

  return NextResponse.json({ success: true })
}
```

### Performance Optimization Tips

1. **Use ISR for product pages** - Static generation with periodic revalidation
2. **Implement pagination** - Don't fetch all products at once
3. **Lazy load images** - Use Next.js Image component with priority flag
4. **Preload critical data** - Use `generateStaticParams` for top products
5. **Edge caching** - Deploy on Vercel Edge Network for global distribution
6. **Batch queries** - Fetch multiple products in single GraphQL query

**Performance Benchmarks**:
- Product listing page: ~200-500ms TTFB (with cache)
- Product detail page: ~100-300ms TTFB (with cache)
- Search results: ~300-600ms TTFB (dynamic)
- Initial build time: +30s for 100 products (static generation)

---

## Error Handling

### Error Types

```typescript
// src/lib/shopify/errors.ts
export class ShopifyAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public graphQLErrors?: any[]
  ) {
    super(message)
    this.name = 'ShopifyAPIError'
  }
}

export class ShopifyNetworkError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message)
    this.name = 'ShopifyNetworkError'
  }
}

export class ShopifyRateLimitError extends Error {
  constructor(message: string, public retryAfter?: number) {
    super(message)
    this.name = 'ShopifyRateLimitError'
  }
}
```

### Error Handling Patterns

**Function-Level Error Handling**:
```typescript
async function getProductByHandle(handle: string) {
  try {
    const response = await fetchShopifyAPI(PRODUCT_QUERY, { handle })

    if (response.errors) {
      console.error('[Shopify] GraphQL errors:', response.errors)
      return null
    }

    return response.data.productByHandle
  } catch (error) {
    console.error('[Shopify] Failed to fetch product:', error)
    return null
  }
}
```

**Component-Level Error Handling**:
```tsx
// src/app/(frontend)/shop/[handle]/page.tsx
export default async function ProductPage({
  params
}: {
  params: { handle: string }
}) {
  const product = await getProductByHandle(params.handle)

  if (!product) {
    // Option 1: Show 404 page
    notFound()

    // Option 2: Show error state
    // return <ProductErrorState message="Product not found" />
  }

  return <ProductDetail product={product} />
}
```

**Error Boundary** (for client components):
```tsx
// src/components/shop/ProductErrorBoundary.tsx
'use client'

import { useEffect } from 'react'

export function ProductErrorBoundary({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Shop] Error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-gray-600 mb-6">
        We couldn&apos;t load this product. Please try again.
      </p>
      <button
        onClick={reset}
        className="px-6 py-2 bg-kawai-red text-white rounded-md hover:bg-kawai-red/90"
      >
        Try Again
      </button>
    </div>
  )
}
```

### Logging & Monitoring

```typescript
// src/lib/shopify/monitoring.ts
export function logShopifyError(
  operation: string,
  error: Error,
  context?: Record<string, any>
) {
  const errorLog = {
    timestamp: new Date().toISOString(),
    operation,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    },
    context
  }

  // Development: Log to console
  if (process.env.NODE_ENV === 'development') {
    console.error('[Shopify Error]', errorLog)
  }

  // Production: Send to monitoring service
  // Example: Sentry, LogRocket, etc.
  // sentry.captureException(error, { extra: errorLog })
}
```

---

## Troubleshooting

### Common Issues

#### Issue: Cart Not Persisting Across Sessions

**Cause**: LocalStorage cleared, cart ID not saved, or browser privacy mode

**Solution**: Verify cart ID storage and handle missing carts gracefully

```tsx
// Check if cart ID exists
const cartId = getCartId()
if (!cartId) {
  console.warn('No cart ID found - creating new cart')
  await createCart()
}

// Verify cart still exists
const cart = await getCart(cartId)
if (!cart) {
  console.warn('Cart expired or not found - clearing stale ID')
  clearCartId()
  await createCart()
}
```

**Prevention**:
- Always check if cart exists before operations
- Handle expired carts gracefully
- Consider server-side cart storage for logged-in users

---

#### Issue: Checkout URL Not Working

**Cause**: Invalid cart ID, expired cart, or cart without items

**Solution**: Validate cart state before redirecting

```tsx
async function handleCheckout() {
  const cart = await getCart()

  if (!cart) {
    alert('Cart not found. Please refresh and try again.')
    return
  }

  if (cart.totalQuantity === 0) {
    alert('Cart is empty')
    return
  }

  if (!cart.checkoutUrl) {
    console.error('No checkout URL available')
    alert('Unable to proceed to checkout. Please try again.')
    return
  }

  // Redirect to Shopify checkout
  window.location.href = cart.checkoutUrl
}
```

---

#### Issue: Cart Line Updates Not Reflecting

**Cause**: Race conditions, cache staleness, or failed mutations

**Solution**: Implement optimistic updates with error handling

```tsx
const [localQuantity, setLocalQuantity] = useState(line.quantity)
const [serverQuantity, setServerQuantity] = useState(line.quantity)

const handleUpdate = async (newQuantity: number) => {
  // Optimistic update
  setLocalQuantity(newQuantity)

  try {
    const updatedCart = await updateCartLine({
      cartId,
      lineId: line.id,
      quantity: newQuantity
    })

    if (updatedCart) {
      const updatedLine = updatedCart.lines.edges.find(e => e.node.id === line.id)
      if (updatedLine) {
        setServerQuantity(updatedLine.node.quantity)
      }
    } else {
      throw new Error('Cart update failed')
    }
  } catch (error) {
    // Revert optimistic update on error
    setLocalQuantity(serverQuantity)
    alert('Failed to update quantity')
  }
}
```

---

#### Issue: Items Out of Stock in Cart

**Cause**: Inventory sold out between adding to cart and checkout

**Solution**: Check availability before checkout and show warnings

```tsx
// In cart page
const unavailableItems = cart.lines.edges.filter(
  ({ node }) => !node.merchandise.availableForSale
)

if (unavailableItems.length > 0) {
  return (
    <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-4">
      <h3 className="font-bold text-red-800">⚠️ Some Items No Longer Available</h3>
      <p className="text-sm text-red-600">
        Please remove unavailable items before checkout:
      </p>
      <ul className="text-sm text-red-600 list-disc ml-5 mt-2">
        {unavailableItems.map(({ node }) => (
          <li key={node.id}>{node.merchandise.product.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

---

#### Issue: Cart Discount Code Not Applying

**Cause**: Invalid code, code restrictions not met, or expired code

**Solution**: Check discount code response and handle errors

```tsx
const cart = await applyDiscountCode({ cartId, discountCode: 'SUMMER2024' })

if (!cart) {
  alert('Failed to apply discount code')
  return
}

// Check if code was actually applied
const appliedCode = cart.discountCodes?.find(dc => dc.code === 'SUMMER2024')

if (!appliedCode) {
  alert('Discount code could not be applied (invalid or restrictions not met)')
} else if (!appliedCode.applicable) {
  alert('Discount code not applicable to current cart')
} else {
  alert('Discount applied successfully!')
}
```

**Common Discount Restrictions**:
- Minimum purchase amount not met
- Specific products/collections required
- Code expired or usage limit reached
- Customer eligibility requirements

---

#### Issue: GraphQL Errors "Access denied for field"

**Cause**: Storefront API doesn't have access to requested field (e.g., `inventoryQuantity`)

**Solution**: Use Admin API for privileged fields, or remove field from query

```typescript
// ❌ BAD - inventoryQuantity not available in Storefront API
const VARIANT_QUERY = `
  variant {
    inventoryQuantity
  }
`

// ✅ GOOD - Use Admin API or omit field
const VARIANT_QUERY = `
  variant {
    availableForSale
  }
`
```

#### Issue: Rate Limit Exceeded

**Cause**: Too many requests to Shopify API in short time

**Solution**: Implement exponential backoff and request throttling

```typescript
async function fetchWithRetry(query: string, variables: any, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetchShopifyAPI(query, variables)

      if (response.errors?.some(e => e.extensions?.code === 'THROTTLED')) {
        const delay = Math.pow(2, i) * 1000 // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }

      return response
    } catch (error) {
      if (i === retries - 1) throw error
    }
  }
}
```

#### Issue: Stale Product Data

**Cause**: Cache not invalidated after product update

**Solution**: Implement webhook-based cache invalidation

```bash
# Set up Shopify webhook (Admin → Settings → Notifications → Webhooks)
Event: Product update
URL: https://your-domain.com/api/webhooks/shopify/products/update
Format: JSON
```

#### Issue: Images Not Loading

**Cause**: CORS policy or incorrect CDN URL

**Solution**: Verify Shopify CDN URL format and Next.js config

```javascript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com'
      },
      {
        protocol: 'https',
        hostname: '*.shopify.com'
      }
    ]
  }
}
```

#### Issue: Build Failures with `generateStaticParams`

**Cause**: Too many products causing build timeout

**Solution**: Limit static generation to featured products only

```tsx
export async function generateStaticParams() {
  // Only pre-render featured products
  const products = await getProductsByTag('featured', { first: 50 })
  return products.map((product) => ({ handle: product.handle }))
}

// Use ISR for dynamic generation of other products
export const dynamicParams = true
```

### Debug Mode

Enable verbose logging:

```bash
# .env.local
SHOPIFY_DEBUG=true
```

```typescript
// src/lib/shopify/client.ts
if (process.env.SHOPIFY_DEBUG === 'true') {
  console.log('[Shopify Debug] Query:', query)
  console.log('[Shopify Debug] Variables:', variables)
  console.log('[Shopify Debug] Response:', response)
}
```

---

## Advanced Topics

### Metafields for Custom Data

Shopify metafields allow storing custom product attributes (specifications, features, etc.):

```typescript
// Fetch product with specific metafields
const product = await getProductByHandle('kawai-es920')

// Access metafields
const specifications = product.metafields.find(
  mf => mf.namespace === 'custom' && mf.key === 'specifications'
)

if (specifications) {
  const specs = JSON.parse(specifications.value)
  // specs = { keys: 88, weight: "32 lbs", dimensions: "..." }
}
```

### Product Variants Management

```tsx
// Display variant selector
function VariantSelector({ product }: { product: ShopifyProduct }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])

  return (
    <div className="space-y-4">
      <select
        value={selectedVariant.id}
        onChange={(e) => {
          const variant = product.variants.find(v => v.id === e.target.value)
          setSelectedVariant(variant)
        }}
        className="w-full border rounded-md px-4 py-2"
      >
        {product.variants.map((variant) => (
          <option key={variant.id} value={variant.id}>
            {variant.title} - ${parseFloat(variant.price.amount).toFixed(2)}
          </option>
        ))}
      </select>

      <div className="text-lg font-bold">
        ${parseFloat(selectedVariant.price.amount).toFixed(2)}
        {selectedVariant.compareAtPrice && (
          <span className="text-sm text-gray-500 line-through ml-2">
            ${parseFloat(selectedVariant.compareAtPrice.amount).toFixed(2)}
          </span>
        )}
      </div>

      {!selectedVariant.availableForSale && (
        <p className="text-red-600">Out of Stock</p>
      )}
    </div>
  )
}
```

### Collections & Product Grouping

```typescript
// Fetch products in a collection
async function getProductsInCollection(collectionHandle: string) {
  const query = `
    query GetCollection($handle: String!) {
      collectionByHandle(handle: $handle) {
        title
        description
        products(first: 24) {
          edges {
            node {
              ${PRODUCT_FRAGMENT}
            }
          }
        }
      }
    }
  `

  const response = await fetchStorefrontAPI(query, { handle: collectionHandle })
  return response.data.collectionByHandle.products.edges.map(e => e.node)
}
```

### SEO Optimization

```tsx
// Generate metadata for product pages
import { Metadata } from 'next'

export async function generateMetadata({
  params
}: {
  params: { handle: string }
}): Promise<Metadata> {
  const product = await getProductByHandle(params.handle)

  if (!product) {
    return {
      title: 'Product Not Found'
    }
  }

  const firstImage = product.images[0]

  return {
    title: `${product.title} | KAWAI Piano`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.title,
      description: product.description,
      images: firstImage
        ? [
            {
              url: firstImage.url,
              width: firstImage.width,
              height: firstImage.height,
              alt: firstImage.altText || product.title
            }
          ]
        : []
    }
  }
}
```

---

## Testing

### Manual Testing

```bash
# Test Shopify connection
bun run scripts/test-shopify.ts

# Expected output:
# ✅ Storefront API Success!
# Found 4 products
```

### Integration Tests

```typescript
// tests/shopify.test.ts
import { getAllProducts, getProductByHandle } from '@/lib/shopify'

describe('Shopify Integration', () => {
  it('should fetch products from Storefront API', async () => {
    const products = await getAllProducts({ first: 5 })
    expect(products).toBeDefined()
    expect(Array.isArray(products)).toBe(true)
  })

  it('should fetch single product by handle', async () => {
    const product = await getProductByHandle('test-product')
    expect(product).toBeDefined()
    expect(product?.handle).toBe('test-product')
  })

  it('should return null for non-existent product', async () => {
    const product = await getProductByHandle('non-existent-product-handle')
    expect(product).toBeNull()
  })
})
```

---

## Migration Guide

### Transitioning from Payload CMS Products

If you're migrating from Payload CMS product management to Shopify:

**Step 1: Data Audit**
```typescript
// Compare existing Payload products with Shopify inventory
const payloadProducts = await payload.find({ collection: 'products' })
const shopifyProducts = await getAllProducts({ first: 250 })

// Identify products to migrate
const missingInShopify = payloadProducts.docs.filter(
  pp => !shopifyProducts.find(sp => sp.handle === pp.slug)
)
```

**Step 2: Dual-Source Strategy**
```typescript
// Fetch from both sources during migration
async function getProductData(slug: string) {
  // Try Shopify first
  const shopifyProduct = await getProductByHandle(slug)
  if (shopifyProduct) {
    return { source: 'shopify', data: shopifyProduct }
  }

  // Fallback to Payload CMS
  const payloadProduct = await payload.findBySlug('products', slug)
  if (payloadProduct) {
    return { source: 'payload', data: payloadProduct }
  }

  return null
}
```

**Step 3: Gradual Migration**
- Tag Shopify products with `migrated` tag
- Keep Payload products as backup during transition
- Use feature flags to toggle between sources

---

## Deployment Checklist

Before deploying Shopify integration to production:

**General Setup**:
- [ ] Environment variables configured (`SHOPIFY_STORE_DOMAIN`, tokens)
- [ ] API credentials tested (both Storefront and Admin if used)
- [ ] Cache TTL configured appropriately for your use case
- [ ] ISR revalidation intervals set (recommended: 5-15 minutes)
- [ ] Webhook endpoints configured for product updates
- [ ] Error monitoring integrated (Sentry, LogRocket, etc.)
- [ ] Next.js image domains configured for Shopify CDN
- [ ] Rate limiting strategy implemented
- [ ] Product pages included in sitemap.xml
- [ ] Performance audit completed (Lighthouse score >90)
- [ ] Backup plan for API outages
- [ ] Documentation updated with product catalog structure

**Cart Functionality**:
- [ ] Cart persistence strategy implemented (localStorage or server-side)
- [ ] Cart expiration handling tested (10-day expiration)
- [ ] Add to cart functionality tested with multiple variants
- [ ] Cart page displays correct totals (subtotal, tax, total)
- [ ] Checkout redirect working to Shopify checkout
- [ ] Discount code application tested
- [ ] Cart updates (quantity changes, removals) working correctly
- [ ] Out-of-stock items handled gracefully in cart
- [ ] Cart drawer/modal UX tested (if applicable)
- [ ] Cart badge counter updating correctly
- [ ] Mobile cart experience optimized
- [ ] Error states handled (network failures, expired carts)
- [ ] Analytics tracking for cart events (add, remove, checkout)

---

## Reference Links

### Official Documentation
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)
- [Shopify Admin API](https://shopify.dev/docs/api/admin-graphql)
- [Shopify GraphQL Explorer](https://shopify.dev/docs/apps/tools/graphiql-admin-api)
- [Next.js ISR Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)

### Related KAWAI Documentation
- [Main Developer Guide](/CLAUDE.md)
- [Media Optimization System](/CLAUDE.md#media-system-advanced-implementation)
- [CMS Integration Patterns](/CLAUDE.md#cms-collections--data-architecture)
- [On-Demand Revalidation](/CLAUDE.md#on-demand-revalidation-with-payload-hooks)

### Support
- **Internal**: Check `/scripts/test-shopify.ts` for API testing
- **External**: [Shopify Community Forums](https://community.shopify.com/)
- **GraphQL Issues**: [Shopify GraphQL Learning Kit](https://shopify.dev/docs/api/usage/graphql)

---

## Summary

The Shopify integration library provides:

✅ **Type-Safe API** - Full TypeScript coverage with generated types
✅ **Complete Cart Solution** - Full shopping cart with persistence and checkout
✅ **Performance Optimized** - Multi-layer caching with ISR support
✅ **Developer Friendly** - Simple, intuitive function APIs
✅ **Production Ready** - Error handling, monitoring, and fallbacks
✅ **Architecture Aligned** - Follows KAWAI's server-first principles

**Key Takeaways**:
- Use **Storefront API** for public product data and cart operations (default choice)
- Use **Admin API** only when you need privileged data (inventory, drafts)
- Implement **ISR caching** for optimal performance (5-15 min revalidation)
- Set up **webhooks** for real-time cache invalidation
- **Cart persistence** via localStorage with automatic expiration handling
- Follow **existing patterns** from KAWAI architecture (server components, media optimization)

**Cart Quick Reference**:
```tsx
// Add to cart
await addToCart({ merchandiseId: variantId, quantity: 1 })

// Update cart
await updateCartLine({ cartId, lineId, quantity: 3 })

// Remove from cart
await removeFromCart({ cartId, lineIds: [lineId] })

// Get cart
const cart = await getCart()

// Checkout
window.location.href = cart.checkoutUrl
```

*For questions or issues, refer to the troubleshooting section or check the test script at `/scripts/test-shopify.ts`.*
