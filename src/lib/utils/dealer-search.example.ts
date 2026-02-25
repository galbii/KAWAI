/**
 * Example usage patterns for dealer search utilities
 *
 * This file demonstrates how to use the dealer search functions
 * in various real-world scenarios within the KAWAI app.
 */

import { calculateDistance, geocodeZipCode, searchDealers } from './dealer-search'
import type { Dealer } from '@/payload-types'

// Example 1: Search dealers by name
// ------------------------------
export async function searchByDealerName(dealers: Dealer[], name: string) {
  const results = searchDealers(dealers, name, {
    activeOnly: true,
  })

  console.log(`Found ${results.length} dealers matching "${name}"`)
  return results
}

// Example 2: Find dealers near a ZIP code
// ---------------------------------------
export async function findDealersNearZip(
  dealers: Dealer[],
  zipCode: string,
  maxDistance: number = 50,
) {
  // First, geocode the ZIP code to get coordinates
  const coords = await geocodeZipCode(zipCode)

  if (!coords) {
    console.error('Failed to geocode ZIP code')
    return []
  }

  // Search with distance filter
  const results = searchDealers(dealers, '', {
    fromCoordinates: coords,
    maxDistance,
    activeOnly: true,
  })

  console.log(`Found ${results.length} dealers within ${maxDistance} miles of ${zipCode}`)

  // Results are already sorted by distance
  return results.map((result) => ({
    ...result,
    distanceFormatted: `${result.distance?.toFixed(1)} miles`,
  }))
}

// Example 3: Filter by dealer type
// --------------------------------
export async function findProfessionalProductDealers(dealers: Dealer[]) {
  const results = searchDealers(dealers, '', {
    dealerType: 'professional-products',
    activeOnly: true,
  })

  return results
}

// Example 4: Calculate distance between two locations
// --------------------------------------------------
export function getDistanceBetweenDealers(dealer1: Dealer, dealer2: Dealer): number {
  return calculateDistance(
    dealer1.coordinates?.latitude ?? 0,
    dealer1.coordinates?.longitude ?? 0,
    dealer2.coordinates?.latitude ?? 0,
    dealer2.coordinates?.longitude ?? 0,
  )
}

// Example 5: Get nearest dealer to user's location
// -----------------------------------------------
export async function getNearestDealer(dealers: Dealer[], userCoords: { lat: number; lng: number }) {
  const results = searchDealers(dealers, '', {
    fromCoordinates: userCoords,
    activeOnly: true,
  })

  // First result is the nearest
  return results[0] ?? null
}

// Example 6: Multi-field search with filtering
// -------------------------------------------
export async function advancedDealerSearch(
  dealers: Dealer[],
  searchTerm: string,
  filters: {
    dealerType?: 'professional-products' | 'acoustic-digital'
    location?: { lat: number; lng: number }
    maxDistance?: number
    featuredOnly?: boolean
  } = {},
) {
  const searchOptions: Parameters<typeof searchDealers>[2] = {
    activeOnly: true,
  }

  if (filters.dealerType) {
    searchOptions.dealerType = filters.dealerType
  }
  if (filters.location) {
    searchOptions.fromCoordinates = filters.location
  }
  if (filters.maxDistance !== undefined) {
    searchOptions.maxDistance = filters.maxDistance
  }

  let results = searchDealers(dealers, searchTerm, searchOptions)

  // Additional filtering for featured dealers
  if (filters.featuredOnly) {
    results = results.filter((result) => result.dealer.isFeatured)
  }

  return results
}

// Example 7: Search by city or state
// ---------------------------------
export async function searchByLocation(dealers: Dealer[], location: string) {
  // This will search both city and state fields
  const results = searchDealers(dealers, location, {
    activeOnly: true,
  })

  // Group by state for better organization
  const groupedByState = results.reduce(
    (acc, result) => {
      const state = result.dealer.address.state
      if (!acc[state]) {
        acc[state] = []
      }
      acc[state]!.push(result)
      return acc
    },
    {} as Record<string, typeof results>,
  )

  return groupedByState
}

// Example 8: Get dealers sorted by distance from multiple locations
// ----------------------------------------------------------------
export async function getDealersForRoute(
  dealers: Dealer[],
  waypoints: Array<{ lat: number; lng: number }>,
) {
  const dealersWithDistances = dealers
    .filter((dealer) => dealer.isActive)
    .map((dealer) => {
      // Calculate distance to nearest waypoint
      const distances = waypoints.map((waypoint) =>
        calculateDistance(waypoint.lat, waypoint.lng, dealer.coordinates?.latitude ?? 0, dealer.coordinates?.longitude ?? 0),
      )

      const minDistance = Math.min(...distances)

      return {
        dealer,
        distanceToRoute: minDistance,
      }
    })
    .sort((a, b) => a.distanceToRoute - b.distanceToRoute)

  return dealersWithDistances
}

// Example 9: Batch geocode multiple ZIP codes
// ------------------------------------------
export async function geocodeMultipleZipCodes(zipCodes: string[]) {
  const results = await Promise.all(
    zipCodes.map(async (zipCode) => {
      const coords = await geocodeZipCode(zipCode)
      return {
        zipCode,
        coordinates: coords,
        success: coords !== null,
      }
    }),
  )

  return results
}

// Example 10: Server Component usage in Next.js
// --------------------------------------------
// This would go in a Next.js page or layout
/*
import { getPayload } from 'payload'
import config from '@payload-config'
import { searchDealers, geocodeZipCode } from '@/lib/utils/dealer-search'

export default async function DealerFinderPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; zip?: string }>
}) {
  const params = await searchParams
  const payload = await getPayload({ config })

  // Fetch all active dealers
  const { docs: dealers } = await payload.find({
    collection: 'dealers',
    where: { isActive: { equals: true } },
    depth: 0,
  })

  let results = dealers

  // If searching by ZIP code, geocode and filter by distance
  if (params.zip) {
    const coords = await geocodeZipCode(params.zip)
    if (coords) {
      results = searchDealers(dealers, '', {
        fromCoordinates: coords,
        maxDistance: 50,
        activeOnly: true,
      }).map((r) => r.dealer)
    }
  }
  // Otherwise, text search
  else if (params.query) {
    results = searchDealers(dealers, params.query, {
      activeOnly: true,
    }).map((r) => r.dealer)
  }

  return (
    <div>
      <h1>Dealer Finder</h1>
      <DealerList dealers={results} />
    </div>
  )
}
*/
