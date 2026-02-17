/**
 * Example usage and test cases for dealer search utilities
 * Run with: bun test src/lib/utils/dealer-search.test.ts
 */

import { describe, test, expect } from 'bun:test'
import { calculateDistance, searchDealers } from './dealer-search'
import type { Dealer } from '@/payload-types'

describe('calculateDistance', () => {
  test('calculates distance between St. Louis and New York', () => {
    // St. Louis, MO coordinates
    const stlLat = 38.627003
    const stlLng = -90.199402

    // New York, NY coordinates
    const nycLat = 40.7128
    const nycLng = -74.006

    const distance = calculateDistance(stlLat, stlLng, nycLat, nycLng)

    // Distance should be approximately 875 miles
    expect(distance).toBeGreaterThan(870)
    expect(distance).toBeLessThan(880)
  })

  test('calculates zero distance for same location', () => {
    const lat = 38.627003
    const lng = -90.199402

    const distance = calculateDistance(lat, lng, lat, lng)

    expect(distance).toBe(0)
  })
})

describe('searchDealers', () => {
  // Mock dealer data for testing
  const mockDealers: Dealer[] = [
    {
      id: '1',
      dealerName: 'Kawai Piano Gallery St. Louis',
      slug: 'kawai-piano-gallery-st-louis',
      isActive: true,
      isFeatured: true,
      address: {
        street: '21 Meadows Circle Drive',
        city: 'Lake Saint Louis',
        state: 'MO',
        zipCode: '63367',
        country: 'USA',
      },
      coordinates: {
        latitude: 38.785,
        longitude: -90.785,
      },
      dealerType: ['acoustic-digital', 'professional-products'],
      updatedAt: '2024-01-01T00:00:00.000Z',
      createdAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      dealerName: "John's Piano Center",
      slug: 'johns-piano-center',
      isActive: true,
      isFeatured: false,
      address: {
        street: '123 Main St',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA',
      },
      coordinates: {
        latitude: 41.8781,
        longitude: -87.6298,
      },
      dealerType: ['acoustic-digital'],
      updatedAt: '2024-01-01T00:00:00.000Z',
      createdAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '3',
      dealerName: 'Pro Audio Solutions',
      slug: 'pro-audio-solutions',
      isActive: false,
      isFeatured: false,
      address: {
        street: '456 Oak Ave',
        city: 'St. Louis',
        state: 'MO',
        zipCode: '63101',
        country: 'USA',
      },
      coordinates: {
        latitude: 38.627,
        longitude: -90.199,
      },
      dealerType: ['professional-products'],
      updatedAt: '2024-01-01T00:00:00.000Z',
      createdAt: '2024-01-01T00:00:00.000Z',
    },
  ]

  test('searches by dealer name (case-insensitive)', () => {
    const results = searchDealers(mockDealers, 'kawai piano')

    expect(results).toHaveLength(1)
    expect(results[0]?.dealer.dealerName).toBe('Kawai Piano Gallery St. Louis')
  })

  test('searches by city', () => {
    const results = searchDealers(mockDealers, 'chicago')

    expect(results).toHaveLength(1)
    expect(results[0]?.dealer.dealerName).toBe("John's Piano Center")
  })

  test('searches by ZIP code', () => {
    const results = searchDealers(mockDealers, '60601')

    expect(results).toHaveLength(1)
    expect(results[0]?.dealer.dealerName).toBe("John's Piano Center")
  })

  test('searches by state abbreviation', () => {
    const results = searchDealers(mockDealers, 'MO')

    expect(results).toHaveLength(2) // Both St. Louis dealers
  })

  test('filters by active status', () => {
    const results = searchDealers(mockDealers, 'saint louis', {
      activeOnly: true,
    })

    expect(results).toHaveLength(1)
    expect(results[0]?.dealer.dealerName).toBe('Kawai Piano Gallery St. Louis')
  })

  test('filters by dealer type', () => {
    const results = searchDealers(mockDealers, '', {
      dealerType: 'professional-products',
      activeOnly: false,
    })

    expect(results).toHaveLength(2) // Both dealers that carry professional products
  })

  test('calculates and sorts by distance', () => {
    const results = searchDealers(mockDealers, '', {
      fromCoordinates: { lat: 38.627, lng: -90.199 }, // Near St. Louis
    })

    // Should be sorted by distance
    expect(results[0]?.dealer.slug).toBe('pro-audio-solutions')
    expect(results[0]?.distance).toBeDefined()
    expect(results[0]?.distance).toBeLessThan(5) // Very close
  })

  test('filters by max distance', () => {
    const results = searchDealers(mockDealers, '', {
      fromCoordinates: { lat: 38.627, lng: -90.199 },
      maxDistance: 50, // 50 miles
    })

    // Should only include dealers within 50 miles
    expect(results.length).toBeLessThan(mockDealers.length)
    results.forEach((result) => {
      expect(result.distance).toBeDefined()
      expect(result.distance!).toBeLessThanOrEqual(50)
    })
  })

  test('sorts featured dealers first when no coordinates', () => {
    const results = searchDealers(mockDealers, '', { activeOnly: true })

    // Featured dealer should be first
    expect(results[0]?.dealer.isFeatured).toBe(true)
  })

  test('returns empty array for no matches', () => {
    const results = searchDealers(mockDealers, 'nonexistent')

    expect(results).toHaveLength(0)
  })

  test('partial matches work', () => {
    const results = searchDealers(mockDealers, 'piano')

    expect(results.length).toBeGreaterThan(0)
    results.forEach((result) => {
      const matchesName = result.dealer.dealerName.toLowerCase().includes('piano')
      expect(matchesName).toBe(true)
    })
  })
})
