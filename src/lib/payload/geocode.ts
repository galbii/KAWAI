/**
 * Shared Nominatim geocoding utility for Payload CMS collection hooks.
 * Used by Dealers and Storefronts beforeValidate hooks.
 *
 * Nominatim (OpenStreetMap) — free, no API key required.
 * Usage policy: https://operations.osmfoundation.org/policies/nominatim/
 * - Max 1 request/second per IP
 * - Must include a descriptive User-Agent
 */

type NominatimResult = {
  lat: string
  lon: string
  display_name: string
}

interface AddressInput {
  street?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
}

/**
 * Geocodes a structured address using the Nominatim API.
 *
 * @param address - The address fields to geocode
 * @param userAgent - Descriptive User-Agent string (required by Nominatim policy)
 * @returns Coordinates { latitude, longitude } or null on failure
 */
export async function nominatimGeocode(
  address: AddressInput,
  userAgent: string,
): Promise<{ latitude: number; longitude: number } | null> {
  if (!address.street || !address.city || !address.state) return null

  const params = new URLSearchParams({
    street: address.street,
    city: address.city,
    state: address.state,
    country: address.country || 'US',
    format: 'json',
    limit: '1',
  })
  if (address.zipCode) params.set('postalcode', address.zipCode)

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
      headers: {
        'User-Agent': userAgent,
        Accept: 'application/json',
      },
    })

    const results = (await res.json()) as NominatimResult[]

    if (results.length > 0 && results[0]) {
      const lat = parseFloat(results[0].lat)
      const lng = parseFloat(results[0].lon)
      if (!isNaN(lat) && !isNaN(lng)) {
        return { latitude: lat, longitude: lng }
      }
    }

    return null
  } catch {
    return null
  }
}
