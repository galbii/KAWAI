/**
 * DealerBusinessSchema - MusicStore Structured Data Component
 *
 * Implements Schema.org MusicStore markup for dealer detail pages
 * This helps Google understand dealer locations and improves local SEO
 *
 * @see https://schema.org/MusicStore
 * @see https://developers.google.com/search/docs/appearance/structured-data/local-business
 */

interface DealerBusinessSchemaProps {
  dealer: any
}

/**
 * Convert dealer hours format to Schema.org OpeningHoursSpecification
 * Dealer hours format: { day: 'monday', openTime: '10:00 AM', closeTime: '6:00 PM', isClosed: false }
 */
function convertHoursToSchema(hours: any[]): any[] | null {
  if (!hours || hours.length === 0) {
    return null
  }

  const openingHours = hours
    .filter((h: any) => !h.isClosed && h.openTime && h.closeTime)
    .map((h: any) => {
      const opens = convertTo24Hour(h.openTime)
      const closes = convertTo24Hour(h.closeTime)

      if (!opens || !closes) return null

      // Capitalize first letter of day for Schema.org format
      const dayOfWeek = h.day.charAt(0).toUpperCase() + h.day.slice(1)

      return {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': dayOfWeek,
        'opens': opens,
        'closes': closes
      }
    })
    .filter(Boolean)

  return openingHours.length > 0 ? openingHours : null
}

/**
 * Convert 12-hour time format to 24-hour format (HH:MM)
 * Handles formats like "10:00 AM", "7:00 PM", "10:00am", etc.
 */
function convertTo24Hour(time: string): string | null {
  if (!time) return null

  // Match time patterns: "10:00 AM", "7:00 PM", "10:00am", etc.
  const timeMatch = time.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i)

  if (!timeMatch) return null

  const [, hoursStr, minutesStr, meridiem] = timeMatch

  if (!hoursStr || !minutesStr || !meridiem) return null

  let hours = parseInt(hoursStr, 10)
  const minutes = parseInt(minutesStr, 10)

  // Convert to 24-hour format
  if (meridiem.toLowerCase() === 'pm' && hours !== 12) {
    hours += 12
  } else if (meridiem.toLowerCase() === 'am' && hours === 12) {
    hours = 0
  }

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

/**
 * Build areaServed schema from dealer's service area data
 */
function buildAreaServed(dealer: any): any[] | undefined {
  const areaServed: any[] = []

  // Add primary city
  if (dealer.address?.city && dealer.address?.state) {
    areaServed.push({
      '@type': 'City',
      'name': dealer.address.city,
      'containedIn': {
        '@type': 'State',
        'name': dealer.address.state
      }
    })
  }

  // Add primary markets from service area
  if (dealer.serviceArea?.primaryMarkets && Array.isArray(dealer.serviceArea.primaryMarkets)) {
    dealer.serviceArea.primaryMarkets.forEach((market: any) => {
      if (market.market) {
        areaServed.push({
          '@type': 'City',
          'name': market.market
        })
      }
    })
  }

  return areaServed.length > 0 ? areaServed : undefined
}

export function DealerBusinessSchema({ dealer }: DealerBusinessSchemaProps) {
  // Don't render if essential data is missing
  if (!dealer?.dealerName || !dealer?.address) {
    return null
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaipianogallerystl.com'

  // Build opening hours specification if hours data exists
  const openingHoursSpec = dealer.hours ? convertHoursToSchema(dealer.hours) : null

  // Build area served array
  const areaServed = buildAreaServed(dealer)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MusicStore',
    '@id': `${siteUrl}/find-a-dealer/${dealer.slug}#organization`,
    'name': dealer.dealerName,
    'description': dealer.description || `${dealer.dealerName} - Authorized Kawai piano dealer in ${dealer.address.city}, ${dealer.address.state}.`,
    'url': `${siteUrl}/find-a-dealer/${dealer.slug}`,

    // Contact information
    ...(dealer.contactInfo?.phone && {
      'telephone': dealer.contactInfo.phone
    }),
    ...(dealer.contactInfo?.email && {
      'email': dealer.contactInfo.email
    }),

    // Address
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': dealer.address.street,
      'addressLocality': dealer.address.city,
      'addressRegion': dealer.address.state,
      'postalCode': dealer.address.zipCode,
      'addressCountry': dealer.address.country || 'USA'
    },

    // Geographic coordinates for map placement and local search
    ...(dealer.coordinates?.latitude && dealer.coordinates?.longitude && {
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': dealer.coordinates.latitude,
        'longitude': dealer.coordinates.longitude
      }
    }),

    // Opening hours
    ...(openingHoursSpec && openingHoursSpec.length > 0 && {
      'openingHoursSpecification': openingHoursSpec
    }),

    // Price range indicator for music stores
    'priceRange': '$$$',

    // Service area (helps with "near me" searches)
    ...(areaServed && {
      'areaServed': areaServed
    }),

    // Founding date (builds trust through longevity)
    ...(dealer.yearEstablished && {
      'foundingDate': dealer.yearEstablished.toString()
    }),

    // Parent organization
    'parentOrganization': {
      '@type': 'Organization',
      'name': 'KAWAI America Corporation',
      'url': 'https://kawaius.com'
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  )
}
