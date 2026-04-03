/**
 * Multi-provider geocoding utility for Payload CMS collection hooks.
 * Used by Dealers and Storefronts beforeValidate hooks.
 *
 * Provider chain (each tried in order until one succeeds):
 *   1. Nominatim structured search (OSM) — free, no key, 1 req/sec limit
 *   2. Nominatim free-text fallback     — handles abbreviations & unusual formats
 *   3. US Census Bureau geocoder        — US only, free, no key, no rate limit,
 *                                         authoritative coverage for commercial addresses
 *   4. Photon (komoot)                  — free, no key, OSM-based but different index,
 *                                         excellent Canadian & international coverage
 *
 * Nominatim usage policy: https://operations.osmfoundation.org/policies/nominatim/
 * Census Bureau API docs: https://geocoding.geo.census.gov/geocoder/Geocoding_Services_API.pdf
 * Photon docs: https://github.com/komoot/photon
 */

type NominatimResult = {
  lat: string
  lon: string
  display_name: string
}

type CensusBureauResult = {
  result: {
    addressMatches: Array<{
      coordinates: { x: number; y: number }
    }>
  }
}

type PhotonResult = {
  type: 'FeatureCollection'
  features: Array<{
    geometry: { type: 'Point'; coordinates: [number, number] } // [lng, lat]
  }>
}

interface AddressInput {
  street?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
}

type Coords = { latitude: number; longitude: number }

/** Maps common country names/codes to ISO 3166-1 alpha-2 for Nominatim structured search. */
function toCountryCode(country: string | undefined): string {
  if (!country) return 'US'
  const normalized = country.trim().toLowerCase()
  if (normalized === 'canada' || normalized === 'ca') return 'CA'
  if (normalized === 'usa' || normalized === 'united states' || normalized === 'us') return 'US'
  return normalized.toUpperCase()
}

function isUSAddress(country: string | undefined): boolean {
  return toCountryCode(country) === 'US'
}

/**
 * Strips suite/unit/apt suffixes and leading unit prefixes from a street address
 * so Nominatim structured search can match on the base street name.
 * e.g. "5024 Campbell Blvd., Suite K"   → "5024 Campbell Blvd."
 * e.g. "#1-4 12351 Bridgeport Road"     → "12351 Bridgeport Road"
 * e.g. "#6-8989 MacLeod Trail, SW"      → "8989 MacLeod Trail, SW"
 */
function stripSuiteFromStreet(street: string): string {
  return street
    .replace(/^#[\w-]+\s+/i, '')
    .replace(/,?\s*(suite|ste\.?|unit|apt\.?|building|bldg\.?|floor|fl\.?)\s*[a-z0-9-]*/gi, '')
    .trim()
}

async function fetchNominatim(params: URLSearchParams, userAgent: string): Promise<Coords | null> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
      headers: { 'User-Agent': userAgent, Accept: 'application/json' },
    })
    const results = (await res.json()) as NominatimResult[]
    if (results.length > 0 && results[0]) {
      const lat = parseFloat(results[0].lat)
      const lng = parseFloat(results[0].lon)
      if (!isNaN(lat) && !isNaN(lng)) return { latitude: lat, longitude: lng }
    }
  } catch {
    // fall through
  }
  return null
}

/**
 * US Census Bureau geocoder — authoritative US address coverage, free, no API key.
 * Falls back silently on non-US addresses or network errors.
 */
async function fetchCensusBureau(address: AddressInput): Promise<Coords | null> {
  if (!isUSAddress(address.country)) return null
  if (!address.street || !address.city || !address.state) return null

  try {
    const params = new URLSearchParams({
      street: stripSuiteFromStreet(address.street),
      city: address.city,
      state: address.state,
      benchmark: 'Public_AR_Current',
      format: 'json',
    })
    if (address.zipCode) params.set('zip', address.zipCode)

    const res = await fetch(
      `https://geocoding.geo.census.gov/geocoder/locations/address?${params.toString()}`,
      { headers: { Accept: 'application/json' } },
    )
    const data = (await res.json()) as CensusBureauResult
    const match = data.result?.addressMatches?.[0]
    if (match) {
      const lat = match.coordinates.y
      const lng = match.coordinates.x
      if (!isNaN(lat) && !isNaN(lng)) return { latitude: lat, longitude: lng }
    }
  } catch {
    // fall through
  }
  return null
}

/**
 * Photon (komoot.io) — OSM-based, free, no API key.
 * Different index than Nominatim so it often resolves addresses that Nominatim misses,
 * particularly Canadian addresses and unusual US street formats.
 */
async function fetchPhoton(address: AddressInput): Promise<Coords | null> {
  const parts = [
    address.street ? stripSuiteFromStreet(address.street) : undefined,
    address.city,
    address.state,
    address.zipCode,
    address.country,
  ].filter(Boolean)

  if (parts.length === 0) return null

  try {
    const params = new URLSearchParams({ q: parts.join(', '), limit: '1' })
    const res = await fetch(`https://photon.komoot.io/api/?${params.toString()}`, {
      headers: { Accept: 'application/json' },
    })
    const data = (await res.json()) as PhotonResult
    const feature = data.features?.[0]
    if (feature) {
      const [lng, lat] = feature.geometry.coordinates
      if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
        return { latitude: lat, longitude: lng }
      }
    }
  } catch {
    // fall through
  }
  return null
}

export async function nominatimGeocode(
  address: AddressInput,
  userAgent: string,
): Promise<Coords | null> {
  // Minimum viable geocoding: need at least a state
  if (!address.state) return null

  const country = toCountryCode(address.country)
  const cleanStreet = address.street ? stripSuiteFromStreet(address.street) : undefined

  // Pass 1: Nominatim structured search — omit street/city if not present
  const structuredParams = new URLSearchParams({
    state: address.state,
    country,
    format: 'json',
    limit: '1',
  })
  if (cleanStreet) structuredParams.set('street', cleanStreet)
  if (address.city) structuredParams.set('city', address.city)
  if (address.zipCode) structuredParams.set('postalcode', address.zipCode)

  const structured = await fetchNominatim(structuredParams, userAgent)
  if (structured) return structured

  // Pass 2: Nominatim free-text — handles abbreviations and unusual street formats
  const freeText = [cleanStreet, address.city, address.state, address.zipCode]
    .filter(Boolean)
    .join(', ')
  const freeParams = new URLSearchParams({ q: freeText, format: 'json', limit: '1' })
  const freeResult = await fetchNominatim(freeParams, userAgent)
  if (freeResult) return freeResult

  // Pass 3: US Census Bureau — authoritative US coverage, requires full address
  const census = await fetchCensusBureau(address)
  if (census) return census

  // Pass 4: Photon (komoot) — different OSM index, strong Canadian & international coverage
  return fetchPhoton(address)
}
