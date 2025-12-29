/**
 * Shopify Integration Usage Examples
 *
 * This file demonstrates common usage patterns for the Shopify integration library.
 * These examples show best practices for KAWAI Piano website use cases.
 *
 * NOTE: This file is for reference only and not imported into the application.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react'
import {
  getProducts,
  getProductByHandle,
  getProductsByType,
  searchProducts,
  sortProductsByPrice,
  filterAvailableProducts,
  groupProductsByType,
  type Product,
  type ShopifyRequestOptions,
} from './index'

// ============================================================================
// Example 1: Product Listing Page (Server Component)
// ============================================================================

/**
 * Example: Piano listing page with ISR
 * Use case: /products or /pianos page
 */
async function ProductListingPage() {
  // Fetch products with 5-minute ISR revalidation
  const products = await getProducts(
    { first: 50, sortKey: 'TITLE' },
    { revalidate: 300 } // 5 minutes
  )

  // Filter only available products
  const availableProducts = filterAvailableProducts(products)

  // Sort by price (low to high)
  const sortedProducts = sortProductsByPrice(availableProducts, 'asc')

  return {
    products: sortedProducts,
    total: sortedProducts.length,
  }
}

// ============================================================================
// Example 2: Product Detail Page (Dynamic Route)
// ============================================================================

/**
 * Example: Single product page
 * Use case: /products/[handle] page
 */
async function ProductDetailPage({ params }: { params: { handle: string } }) {
  // Fetch single product with 10-minute ISR
  const product = await getProductByHandle(params.handle, {
    revalidate: 600, // 10 minutes
  })

  if (!product) {
    return null // Will show 404
  }

  return {
    product,
    variants: product.variants,
    images: product.images,
  }
}

// ============================================================================
// Example 3: Category Page (Filtered Products)
// ============================================================================

/**
 * Example: Grand pianos category page
 * Use case: /pianos/grand-pianos
 */
async function GrandPianosPage() {
  // Get all grand pianos
  const grandPianos = await getProductsByType('Grand Piano', {
    first: 30,
    sortKey: 'PRICE',
  })

  // Group by sub-categories (using tags)
  const grouped = groupProductsByType(grandPianos)

  return {
    products: grandPianos,
    grouped,
  }
}

// ============================================================================
// Example 4: Search Results Page
// ============================================================================

/**
 * Example: Product search
 * Use case: /search?q=kawai+digital
 */
async function SearchResultsPage({ searchParams }: { searchParams: { q: string } }) {
  const query = searchParams.q || ''

  if (!query) {
    return { products: [], query: '' }
  }

  // Search products (dynamic - no ISR caching)
  const results = await searchProducts(
    query,
    { first: 20 },
    { revalidate: false } // Dynamic for fresh search results
  )

  return {
    products: results,
    query,
    total: results.length,
  }
}

// ============================================================================
// Example 5: Static Generation with All Products
// ============================================================================

/**
 * Example: Generate static paths for all products
 * Use case: generateStaticParams() for product pages
 */
async function generateProductStaticParams() {
  // Get all products (minimal data for performance)
  const products = await getProducts({ first: 100 })

  // Return paths for static generation
  return products.map(product => ({
    handle: product.handle,
  }))
}

// ============================================================================
// Example 6: API Route Handler
// ============================================================================

/**
 * Example: API route for client-side product fetching
 * Use case: /api/products/[handle]/route.ts
 */
async function GET(
  request: Request,
  { params }: { params: { handle: string } }
) {
  try {
    const product = await getProductByHandle(params.handle, {
      revalidate: 300, // 5 minutes
    })

    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 })
    }

    return Response.json({ product })
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ============================================================================
// Example 7: Advanced Filtering and Sorting
// ============================================================================

/**
 * Example: Complex product filtering
 * Use case: Piano finder tool with multiple filters
 */
async function PianoFinderTool({
  type,
  minPrice,
  maxPrice,
  sortBy,
}: {
  type?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'price-asc' | 'price-desc' | 'name'
}) {
  // Fetch all products
  let products: Product[] = []

  if (type) {
    products = await getProductsByType(type)
  } else {
    products = await getProducts({ first: 100 })
  }

  // Filter by price range
  if (minPrice !== undefined || maxPrice !== undefined) {
    products = products.filter(product => {
      const price = product.price.min
      if (minPrice !== undefined && price < minPrice) return false
      if (maxPrice !== undefined && price > maxPrice) return false
      return true
    })
  }

  // Sort results
  if (sortBy === 'price-asc') {
    products = sortProductsByPrice(products, 'asc')
  } else if (sortBy === 'price-desc') {
    products = sortProductsByPrice(products, 'desc')
  } else if (sortBy === 'name') {
    products = products.sort((a, b) => a.title.localeCompare(b.title))
  }

  return {
    products,
    filters: { type, minPrice, maxPrice, sortBy },
    total: products.length,
  }
}

// ============================================================================
// Example 8: Error Handling Pattern
// ============================================================================

/**
 * Example: Robust error handling
 * Use case: Any component that fetches Shopify data
 */
async function ProductsWithErrorHandling() {
  try {
    const products = await getProducts({ first: 20 })

    return {
      success: true,
      data: products,
    }
  } catch (error) {
    // Log error for monitoring
    console.error('[Shopify] Failed to fetch products:', error)

    // Return error state
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: [],
    }
  }
}

// ============================================================================
// Example 9: Client Component Pattern
// ============================================================================

/**
 * Example: Client component with server-fetched data
 * Use case: Interactive product component
 */

/*
// Server component (page.tsx)
async function ProductsPageServer() {
  const products = await getProducts({ first: 20 })

  return <ProductsClient products={products} />
}

// Client component (marked with 'use client')
function ProductsClient({ products }: { products: Product[] }) {
  // Client-side state and interactivity
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null)

  return (
    <div>
      {products.map(product => (
        <button
          key={product.id}
          onClick={() => setSelectedProduct(product)}
        >
          {product.title}
        </button>
      ))}
    </div>
  )
}
*/

// ============================================================================
// Example 10: Performance Optimization - Parallel Fetching
// ============================================================================

/**
 * Example: Fetch multiple data sources in parallel
 * Use case: Homepage with multiple product sections
 */
async function HomePage() {
  // Fetch all sections in parallel for better performance
  const [featuredProducts, digitalPianos, grandPianos] = await Promise.all([
    getProducts({ first: 4, sortKey: 'BEST_SELLING' }),
    getProductsByType('Digital Piano', { first: 6 }),
    getProductsByType('Grand Piano', { first: 6 }),
  ])

  return {
    featured: featuredProducts,
    digital: digitalPianos,
    grand: grandPianos,
  }
}

// ============================================================================
// Example 11: Custom ISR Configuration per Section
// ============================================================================

/**
 * Example: Different cache strategies for different data
 * Use case: Page with mixed data freshness requirements
 */
async function MixedCachePage() {
  // Featured products: 5-minute cache (changes frequently)
  const featured = await getProducts(
    { first: 4 },
    { revalidate: 300 }
  )

  // All products: 1-hour cache (changes infrequently)
  const catalog = await getProducts(
    { first: 100 },
    { revalidate: 3600 }
  )

  // Search: No cache (always fresh)
  const searchResults = await searchProducts(
    'grand piano',
    {},
    { revalidate: false }
  )

  return { featured, catalog, searchResults }
}

export {
  ProductListingPage,
  ProductDetailPage,
  GrandPianosPage,
  SearchResultsPage,
  generateProductStaticParams,
  PianoFinderTool,
  ProductsWithErrorHandling,
  HomePage,
  MixedCachePage,
}
