import type { Dealer } from '@/payload-types'

/**
 * Extended dealer type with distance calculation and unified properties
 * Used throughout the dealer finder components
 *
 * This type unifies both Dealers and Storefronts for the dealer finder:
 * - Dealers: From the dealers collection (isOfficialStore from dealer.isOfficialStore)
 * - Storefronts: Official KAWAI stores (isOfficialStore always true)
 */
export interface DealerWithDistance extends Omit<Dealer, 'isOfficialStore'> {
  /** Calculated distance from search location in miles */
  distance?: number
  /** Whether this is an official KAWAI-owned store (vs authorized dealer) */
  isOfficialStore?: boolean
  /** Source collection: dealer or storefront */
  source?: 'dealer' | 'storefront'
}
