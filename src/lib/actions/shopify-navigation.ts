/**
 * Server Actions for Shopify Navigation
 *
 * Server-side data fetching for navigation components
 * These actions are called from client components to fetch navigation data
 */

'use server'

import { getProductTypesWithProducts } from '@/lib/shopify'
import type { ProductsNavigation } from '@/lib/shopify'

/**
 * Fetch products navigation data for mega menu
 * Cached for 5 minutes (300 seconds)
 *
 * @returns Products navigation data with types and products
 *
 * @example
 * ```tsx
 * 'use client'
 *
 * import { fetchProductsNavigation } from '@/lib/actions/shopify-navigation'
 *
 * const navData = await fetchProductsNavigation()
 * ```
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
