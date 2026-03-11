import type { Dealer, Storefront } from '@/payload-types'

/**
 * Calculates the great-circle distance between two points on Earth using the Haversine formula.
 * Returns the distance in miles.
 *
 * @param lat1 - Latitude of the first point in decimal degrees
 * @param lng1 - Longitude of the first point in decimal degrees
 * @param lat2 - Latitude of the second point in decimal degrees
 * @param lng2 - Longitude of the second point in decimal degrees
 * @returns Distance between the two points in miles
 *
 * @example
 * ```typescript
 * const distance = calculateDistance(38.627003, -90.199402, 40.7128, -74.0060)
 * console.log(`Distance: ${distance.toFixed(2)} miles`) // Distance: 875.45 miles
 * ```
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 3958.8 // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance
}

/**
 * Converts degrees to radians.
 *
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 */
export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Geocodes a ZIP code to latitude and longitude coordinates using the Nominatim proxy.
 * Calls the internal /api/search/nominatim route (no API key required).
 *
 * @param zipCode - ZIP code to geocode (e.g., "63026")
 * @returns Promise resolving to coordinates object with lat and lng, or null if geocoding fails
 *
 * @example
 * ```typescript
 * const coords = await geocodeZipCode("63026")
 * if (coords) {
 *   console.log(`Coordinates: ${coords.lat}, ${coords.lng}`)
 * }
 * ```
 */
export async function geocodeZipCode(
  zipCode: string,
): Promise<{ lat: number; lng: number } | null> {
  try {
    const baseUrl = typeof window !== 'undefined'
      ? ''
      : (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000')

    const response = await fetch(
      `${baseUrl}/api/search/nominatim?postalcode=${encodeURIComponent(zipCode)}&country=US&limit=1`,
    )

    if (!response.ok) return null

    const results = await response.json() as Array<{ lat: string; lon: string }>

    if (results.length > 0 && results[0]) {
      const lat = parseFloat(results[0].lat)
      const lng = parseFloat(results[0].lon)
      if (!isNaN(lat) && !isNaN(lng)) return { lat, lng }
    }

    return null
  } catch (error) {
    console.error('Error geocoding ZIP code:', error)
    return null
  }
}

/**
 * Search options for dealer/storefront search.
 */
interface SearchOptions {
  /**
   * Maximum distance in miles to include results (when searching by location)
   */
  maxDistance?: number
  /**
   * Reference coordinates to calculate distance from (when searching by location)
   */
  fromCoordinates?: { lat: number; lng: number }
  /**
   * Filter by dealer type
   */
  dealerType?: 'professional-products' | 'acoustic-digital'
  /**
   * Only return active dealers/storefronts
   */
  activeOnly?: boolean
}

/**
 * Result object for dealer search including calculated distance.
 */
interface DealerSearchResult {
  dealer: Dealer
  distance?: number
}

/**
 * Performs a hybrid search on dealers by name, city, or ZIP code.
 * Search is case-insensitive and matches partial strings.
 * Optionally filters by distance from coordinates and dealer type.
 *
 * @param dealers - Array of dealer objects to search
 * @param query - Search query (dealer name, city, or ZIP code)
 * @param options - Optional search filters
 * @returns Array of matching dealers with calculated distance (if fromCoordinates provided)
 *
 * @example
 * ```typescript
 * // Search by name
 * const results = searchDealers(dealers, "kawai piano gallery")
 *
 * // Search by city
 * const results = searchDealers(dealers, "st louis")
 *
 * // Search by ZIP code
 * const results = searchDealers(dealers, "63026")
 *
 * // Search with distance filter
 * const results = searchDealers(dealers, "piano", {
 *   fromCoordinates: { lat: 38.627003, lng: -90.199402 },
 *   maxDistance: 50 // Only include dealers within 50 miles
 * })
 *
 * // Filter by dealer type
 * const results = searchDealers(dealers, "", {
 *   dealerType: "professional-products",
 *   activeOnly: true
 * })
 * ```
 */
export function searchDealers(
  dealers: Dealer[],
  query: string,
  options?: SearchOptions,
): DealerSearchResult[] {
  const normalizedQuery = query.trim().toLowerCase()

  // Filter dealers based on query
  let results = dealers.filter((dealer) => {
    // Filter by active status
    if (options?.activeOnly && !dealer.isActive) {
      return false
    }

    // Filter by dealer type
    if (options?.dealerType === 'professional-products' && !dealer.professionalProductDealer) {
      return false
    }
    if (options?.dealerType === 'acoustic-digital' && !dealer.acousticPianoDealer) {
      return false
    }

    // If no query, return all (with filters applied)
    if (!normalizedQuery) {
      return true
    }

    // Search by dealer name
    if (dealer.dealerName.toLowerCase().includes(normalizedQuery)) {
      return true
    }

    // Search by city
    if (dealer.address.city.toLowerCase().includes(normalizedQuery)) {
      return true
    }

    // Search by ZIP code (exact or partial match)
    if (dealer.address.zipCode.toLowerCase().includes(normalizedQuery)) {
      return true
    }

    // Search by state
    if (dealer.address.state.toLowerCase().includes(normalizedQuery)) {
      return true
    }

    return false
  })

  // Calculate distances and apply distance filter if coordinates provided
  const resultsWithDistance = results.map((dealer): DealerSearchResult => {
    if (options?.fromCoordinates) {
      const distance = calculateDistance(
        options.fromCoordinates.lat,
        options.fromCoordinates.lng,
        dealer.coordinates?.latitude ?? 0,
        dealer.coordinates?.longitude ?? 0,
      )
      return { dealer, distance }
    }

    return { dealer }
  })

  // Filter by max distance if specified
  if (options?.maxDistance !== undefined) {
    return resultsWithDistance
      .filter((result) => result.distance !== undefined && result.distance <= options.maxDistance!)
      .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))
  }

  // Sort by distance if coordinates provided
  if (options?.fromCoordinates) {
    return resultsWithDistance.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))
  }

  // Default sort: featured first, then alphabetically
  return resultsWithDistance.sort((a, b) => {
    // Featured dealers first
    if (a.dealer.isFeatured && !b.dealer.isFeatured) return -1
    if (!a.dealer.isFeatured && b.dealer.isFeatured) return 1

    // Then alphabetically by dealer name
    return a.dealer.dealerName.localeCompare(b.dealer.dealerName)
  })
}

/**
 * Result object for storefront search including calculated distance.
 */
interface StorefrontSearchResult {
  storefront: Storefront
  distance?: number
}

/**
 * Performs a hybrid search on storefronts by location name or showroom city.
 * Search is case-insensitive and matches partial strings.
 * Optionally filters by distance from coordinates.
 *
 * Note: Storefronts may not have coordinates, so distance-based search may not work for all.
 *
 * @param storefronts - Array of storefront objects to search
 * @param query - Search query (location name or city)
 * @param options - Optional search filters
 * @returns Array of matching storefronts with calculated distance (if coordinates available)
 *
 * @example
 * ```typescript
 * // Search by location name
 * const results = searchStorefronts(storefronts, "st louis")
 *
 * // Search by city (from showroomInfo)
 * const results = searchStorefronts(storefronts, "chicago")
 *
 * // Search with distance filter
 * const results = searchStorefronts(storefronts, "", {
 *   fromCoordinates: { lat: 38.627003, lng: -90.199402 },
 *   maxDistance: 100,
 *   activeOnly: true
 * })
 * ```
 */
export function searchStorefronts(
  storefronts: Storefront[],
  query: string,
  options?: Omit<SearchOptions, 'dealerType'>,
): StorefrontSearchResult[] {
  const normalizedQuery = query.trim().toLowerCase()

  // Filter storefronts based on query
  let results = storefronts.filter((storefront) => {
    // Filter by active status
    if (options?.activeOnly && !storefront.isActive) {
      return false
    }

    // If no query, return all (with filters applied)
    if (!normalizedQuery) {
      return true
    }

    // Search by location name
    if (storefront.locationName.toLowerCase().includes(normalizedQuery)) {
      return true
    }

    // Search by slug
    if (storefront.slug.toLowerCase().includes(normalizedQuery)) {
      return true
    }

    // Search by showroom address (if available)
    if (storefront.showroomInfo?.address?.toLowerCase().includes(normalizedQuery)) {
      return true
    }

    return false
  })

  // Calculate distances if coordinates provided
  // Note: Storefronts may not have coordinates field - need to extract from showroomInfo if available
  const resultsWithDistance = results.map((storefront): StorefrontSearchResult => {
    // TODO: Add coordinate extraction logic if storefronts store coordinates
    // For now, we'll only support distance-based search for dealers

    return { storefront }
  })

  // Filter by max distance if specified (will only work if coordinates available)
  if (options?.maxDistance !== undefined && options.fromCoordinates) {
    return resultsWithDistance.filter(
      (result) => result.distance !== undefined && result.distance <= options.maxDistance!,
    )
  }

  // Default sort: alphabetically by location name
  return resultsWithDistance.sort((a, b) =>
    a.storefront.locationName.localeCompare(b.storefront.locationName),
  )
}
