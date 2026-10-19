import { describe, expect, it } from 'bun:test'
import {
  findNearestStorefront,
  nearestIndependentDealerMiles,
  parseServedZips,
  type StorefrontForLeadRouting,
} from './nearby-storefront'

// Downtown St. Louis and Houston, plus a lead ZIP's centre in Kirkwood, MO
// (~13 mi from St. Louis) and one in Kansas City (~240 mi from either).
const STL = { lat: 38.627, lng: -90.1994 }
const HOU = { lat: 29.7604, lng: -95.3698 }
const KIRKWOOD = { lat: 38.5834, lng: -90.4068 }
const KANSAS_CITY = { lat: 39.0997, lng: -94.5786 }

function store(
  slug: string,
  at: { lat: number; lng: number } | null,
  extra: Partial<StorefrontForLeadRouting> = {},
): StorefrontForLeadRouting {
  return {
    id: slug,
    slug,
    locationName: slug,
    isActive: true,
    address: { city: slug, state: 'XX', country: 'USA' },
    showroomInfo: { email: `${slug}@kawaius.com`, phone: '555-0100' },
    schemaData: at ? { geoCoordinates: { latitude: at.lat, longitude: at.lng } } : null,
    ...extra,
  }
}

describe('parseServedZips', () => {
  it('splits on commas, whitespace and newlines and trims ZIP+4', () => {
    expect([...parseServedZips('63101, 63102\n63103-1234;  m5v 2t6')]).toEqual([
      '63101',
      '63102',
      '63103',
      'M5V2T6',
    ])
  })

  it('treats empty input as no coverage', () => {
    expect(parseServedZips(null).size).toBe(0)
  })
})

describe('findNearestStorefront', () => {
  const stores = [store('st-louis', STL), store('houston', HOU)]

  it('matches the nearest showroom inside the radius', () => {
    const sf = findNearestStorefront(stores, KIRKWOOD, '63122', 'us', 60)
    expect(sf?.slug).toBe('st-louis')
    expect(sf?.href).toBe('/store/st-louis')
    expect(sf?.coveredZip).toBe(false)
    expect(sf?.distance).toBeGreaterThan(5)
    expect(sf?.distance).toBeLessThan(20)
  })

  it('returns null when every showroom is beyond the radius', () => {
    expect(findNearestStorefront(stores, KANSAS_CITY, '64106', 'us', 60)).toBeNull()
  })

  it('lets explicit ZIP coverage beat distance and the radius', () => {
    const covering = [
      store('st-louis', STL),
      store('houston', HOU, { serviceAreaCoverage: { zipCodes: '64106, 64108' } }),
    ]
    const sf = findNearestStorefront(covering, KANSAS_CITY, '64106-2201', 'us', 60)
    expect(sf?.slug).toBe('houston')
    expect(sf?.coveredZip).toBe(true)
  })

  it('matches a covering showroom even without a geocoded pin', () => {
    const sf = findNearestStorefront(
      [store('unpinned', null, { serviceAreaCoverage: { zipCodes: '63122' } })],
      KIRKWOOD,
      '63122',
      'us',
    )
    expect(sf?.slug).toBe('unpinned')
  })

  it('ignores inactive, ungeocoded and other-country showrooms', () => {
    const sf = findNearestStorefront(
      [
        store('inactive', STL, { isActive: false }),
        store('null-island', { lat: 0, lng: 0 }),
        store('canada', STL, { address: { country: 'Canada' } }),
      ],
      KIRKWOOD,
      '63122',
      'us',
    )
    expect(sf).toBeNull()
  })
})

describe('closest location wins', () => {
  const stores = [store('st-louis', STL)]

  it('keeps the lead with the storefront when it is nearer than every dealer', () => {
    expect(findNearestStorefront(stores, KIRKWOOD, '63122', 'us', 60, 40)?.slug).toBe('st-louis')
  })

  it('hands the lead to a closer dealer\'s RSM', () => {
    expect(findNearestStorefront(stores, KIRKWOOD, '63122', 'us', 60, 5)).toBeNull()
  })

  it('gives a tie to the storefront', () => {
    const sf = findNearestStorefront(stores, KIRKWOOD, '63122', 'us', 60, 999)
    expect(findNearestStorefront(stores, KIRKWOOD, '63122', 'us', 60, sf!.distance)?.slug).toBe(
      'st-louis',
    )
  })

  it('lets a served-ZIP list win even against a closer dealer', () => {
    const covering = [store('st-louis', STL, { serviceAreaCoverage: { zipCodes: '63122' } })]
    expect(findNearestStorefront(covering, KIRKWOOD, '63122', 'us', 60, 1)?.slug).toBe('st-louis')
  })
})

describe('nearestIndependentDealerMiles', () => {
  const dealerAt = (lat: number, lng: number, distance: number) => ({
    dealer: { coordinates: { latitude: lat, longitude: lng } },
    distance,
  })

  it('skips dealer listings that sit on a storefront pin', () => {
    const ranked = [
      dealerAt(HOU.lat + 0.001, HOU.lng, 7.1), // "Kawai Piano Gallery" at the showroom
      dealerAt(30.1, -95.5, 22.4), // a real independent dealer
    ]
    expect(nearestIndependentDealerMiles(ranked, [store('houston', HOU)])).toBe(22.4)
  })

  it('returns null when only storefront duplicates are nearby', () => {
    expect(nearestIndependentDealerMiles([dealerAt(HOU.lat, HOU.lng, 7)], [store('houston', HOU)])).toBeNull()
  })
})
