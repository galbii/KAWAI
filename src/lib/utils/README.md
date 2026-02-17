# Dealer Search Utilities

Utilities for searching and filtering dealers/storefronts in the KAWAI Piano platform.

## Files

- **`dealer-search.ts`** - Core search and distance calculation functions
- **`dealer-search.test.ts`** - Comprehensive test suite (13 tests)
- **`dealer-search.example.ts`** - Real-world usage examples

## Features

### 1. Distance Calculation (Haversine Formula)

Calculate the great-circle distance between two points on Earth using latitude/longitude coordinates.

```typescript
import { calculateDistance } from '@/lib/utils/dealer-search'

const distance = calculateDistance(38.627003, -90.199402, 40.7128, -74.0060)
console.log(`Distance: ${distance.toFixed(2)} miles`) // ~875 miles
```

**Parameters:**
- `lat1` - Latitude of first point (decimal degrees)
- `lng1` - Longitude of first point (decimal degrees)
- `lat2` - Latitude of second point (decimal degrees)
- `lng2` - Longitude of second point (decimal degrees)

**Returns:** Distance in miles (number)

### 2. ZIP Code Geocoding

Convert ZIP codes to latitude/longitude coordinates using Google Geocoding API.

```typescript
import { geocodeZipCode } from '@/lib/utils/dealer-search'

const coords = await geocodeZipCode("63026")
if (coords) {
  console.log(`Lat: ${coords.lat}, Lng: ${coords.lng}`)
}
```

**Requirements:**
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` environment variable

**Parameters:**
- `zipCode` - ZIP code string (e.g., "63026" or "63026-1234")

**Returns:** `Promise<{ lat: number; lng: number } | null>`

### 3. Hybrid Dealer Search

Search dealers by name, city, state, or ZIP code with advanced filtering options.

```typescript
import { searchDealers } from '@/lib/utils/dealer-search'
import type { Dealer } from '@/payload-types'

// Search by name
const results = searchDealers(dealers, "kawai piano gallery")

// Search by city
const results = searchDealers(dealers, "st louis")

// Search by ZIP code
const results = searchDealers(dealers, "63026")

// Search with distance filter
const results = searchDealers(dealers, "piano", {
  fromCoordinates: { lat: 38.627003, lng: -90.199402 },
  maxDistance: 50 // Only dealers within 50 miles
})

// Filter by dealer type
const results = searchDealers(dealers, "", {
  dealerType: "professional-products",
  activeOnly: true
})
```

**Parameters:**
- `dealers` - Array of Dealer objects
- `query` - Search query (dealer name, city, state, or ZIP code)
- `options` - Optional search filters (see below)

**Search Options:**
```typescript
interface SearchOptions {
  maxDistance?: number                          // Max distance in miles
  fromCoordinates?: { lat: number; lng: number } // Reference point for distance
  dealerType?: 'professional-products' | 'acoustic-digital'
  activeOnly?: boolean                          // Only return active dealers
}
```

**Returns:** `DealerSearchResult[]`
```typescript
interface DealerSearchResult {
  dealer: Dealer
  distance?: number  // Distance in miles (if fromCoordinates provided)
}
```

**Search Features:**
- ✅ Case-insensitive matching
- ✅ Partial string matching
- ✅ Searches across: dealer name, city, state, ZIP code
- ✅ Distance-based filtering and sorting
- ✅ Dealer type filtering
- ✅ Active/inactive filtering
- ✅ Featured dealers prioritized (when no distance sort)

### 4. Storefront Search

Similar to dealer search but for Storefront locations.

```typescript
import { searchStorefronts } from '@/lib/utils/dealer-search'

const results = searchStorefronts(storefronts, "st louis", {
  activeOnly: true
})
```

**Note:** Storefronts may not have coordinate data, so distance-based search may not work for all storefronts.

## Usage Examples

### Example 1: Find Dealers Near User's Location

```typescript
'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { searchDealers, geocodeZipCode } from '@/lib/utils/dealer-search'

export async function findNearbyDealers(zipCode: string) {
  const payload = await getPayload({ config })

  // Geocode ZIP code
  const coords = await geocodeZipCode(zipCode)
  if (!coords) {
    return { error: 'Invalid ZIP code' }
  }

  // Fetch dealers
  const { docs: dealers } = await payload.find({
    collection: 'dealers',
    where: { isActive: { equals: true } },
    depth: 0,
  })

  // Search with distance filter
  const results = searchDealers(dealers, '', {
    fromCoordinates: coords,
    maxDistance: 50,
    activeOnly: true,
  })

  return results.map(({ dealer, distance }) => ({
    ...dealer,
    distanceMiles: distance?.toFixed(1),
  }))
}
```

### Example 2: Text-Based Dealer Search

```typescript
export async function searchDealersByQuery(query: string) {
  const payload = await getPayload({ config })

  const { docs: dealers } = await payload.find({
    collection: 'dealers',
    where: { isActive: { equals: true } },
    depth: 0,
  })

  const results = searchDealers(dealers, query, {
    activeOnly: true,
  })

  return results
}
```

### Example 3: Filter by Dealer Type

```typescript
export async function findProfessionalProductDealers() {
  const payload = await getPayload({ config })

  const { docs: dealers } = await payload.find({
    collection: 'dealers',
    depth: 0,
  })

  const results = searchDealers(dealers, '', {
    dealerType: 'professional-products',
    activeOnly: true,
  })

  return results
}
```

### Example 4: Get Nearest Dealer

```typescript
export async function getNearestDealer(lat: number, lng: number) {
  const payload = await getPayload({ config })

  const { docs: dealers } = await payload.find({
    collection: 'dealers',
    where: { isActive: { equals: true } },
    depth: 0,
  })

  const results = searchDealers(dealers, '', {
    fromCoordinates: { lat, lng },
    activeOnly: true,
  })

  // First result is the nearest
  return results[0] ?? null
}
```

## Testing

Run the test suite:

```bash
bun test src/lib/utils/dealer-search.test.ts
```

**Test Coverage:**
- ✅ Distance calculation accuracy
- ✅ Name search (case-insensitive)
- ✅ City search
- ✅ ZIP code search
- ✅ State search
- ✅ Active/inactive filtering
- ✅ Dealer type filtering
- ✅ Distance calculation and sorting
- ✅ Max distance filtering
- ✅ Featured dealer prioritization
- ✅ Partial matching
- ✅ Empty results handling

## Performance Considerations

1. **Geocoding API Calls**: Cache geocoded ZIP codes on the client or server to avoid redundant API calls
2. **Distance Calculations**: The Haversine formula is efficient for small-to-medium datasets (< 1000 dealers)
3. **Search Indexing**: For very large datasets, consider using a search engine like Algolia or Meilisearch

## Future Enhancements

- [ ] Add coordinate extraction for Storefronts
- [ ] Add support for geographic bounding boxes
- [ ] Add support for radius search by city name (geocode city first)
- [ ] Add caching layer for geocoded ZIP codes
- [ ] Add fuzzy matching for dealer names
- [ ] Add support for international addresses and distances in kilometers

## Related Files

- `/Users/chancenoonan/dev/code/KAWAI/src/collections/Dealers.ts` - Dealer collection config
- `/Users/chancenoonan/dev/code/KAWAI/src/collections/Storefronts.ts` - Storefront collection config
- `/Users/chancenoonan/dev/code/KAWAI/src/app/(frontend)/find-a-dealer/page.tsx` - Dealer finder page
