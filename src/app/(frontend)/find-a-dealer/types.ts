import type { Dealer } from '@/payload-types'

/**
 * Extended dealer type with distance calculation and unified properties
 * Used throughout the dealer finder components
 *
 * This type unifies both Dealers and Storefronts for the dealer finder.
 */
export interface DealerWithDistance extends Dealer {
  /** Calculated distance from search location in miles */
  distance?: number
  /** Source collection: dealer or storefront */
  source?: 'dealer' | 'storefront'
}
