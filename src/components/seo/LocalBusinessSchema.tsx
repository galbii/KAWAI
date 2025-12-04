/**
 * LocalBusiness Structured Data Component
 *
 * Implements Schema.org MusicStore markup for storefront pages
 * This helps Google understand physical business locations and improves local SEO
 *
 * @see https://schema.org/MusicStore
 * @see https://developers.google.com/search/docs/appearance/structured-data/local-business
 */

interface LocalBusinessSchemaProps {
  storefront: any
  siteUrl: string
}

/**
 * Extract opening and closing times from a time string
 * Handles formats like "10:00 am–7:00 pm" or "Closed"
 */
function parseHours(timeString: string): { opens?: string; closes?: string } {
  if (!timeString || timeString.toLowerCase().includes('closed')) {
    return {};
  }

  // Match patterns like "10:00 am–7:00 pm" or "10:00 AM - 7:00 PM"
  const timeMatch = timeString.match(/(\d{1,2}:\d{2})\s*(am|pm)?[–\-]\s*(\d{1,2}:\d{2})\s*(am|pm)?/i);

  if (timeMatch) {
    const [, openTime, openMeridiem, closeTime, closeMeridiem] = timeMatch;

    // Ensure we have valid time values before converting
    if (!openTime || !closeTime) {
      return {};
    }

    // Convert to 24-hour format for Schema.org
    const opens = convertTo24Hour(openTime, openMeridiem || 'AM');
    const closes = convertTo24Hour(closeTime, closeMeridiem || 'PM');

    return { opens, closes };
  }

  return {};
}

/**
 * Convert 12-hour time to 24-hour format (HH:MM)
 */
function convertTo24Hour(time: string, meridiem: string): string {
  const [hours, minutes] = time.split(':').map(Number);

  // Validate that we have valid hours and minutes
  if (hours === undefined || minutes === undefined) {
    return '00:00';
  }

  let hour24 = hours;

  if (meridiem.toLowerCase() === 'pm' && hours !== 12) {
    hour24 = hours + 12;
  } else if (meridiem.toLowerCase() === 'am' && hours === 12) {
    hour24 = 0;
  }

  return `${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Parse address string into structured components
 * Example: "123 Main St, Suite 200, Springfield, MO 12345"
 */
function parseAddress(addressString: string | undefined) {
  if (!addressString) {
    return { addressCountry: 'US' };
  }

  // Basic parsing - you may want to enhance this based on your address format
  const parts = addressString.split(',').map(s => s.trim());

  if (parts.length >= 3) {
    // Last part is typically "State Zip"
    const stateZip = parts[parts.length - 1]?.match(/([A-Z]{2})\s+(\d{5})/);

    return {
      streetAddress: parts.slice(0, -2).join(', '),
      addressLocality: parts[parts.length - 2],
      addressRegion: stateZip?.[1] || '',
      postalCode: stateZip?.[2] || '',
      addressCountry: 'US'
    };
  }

  return {
    streetAddress: addressString,
    addressCountry: 'US'
  };
}

export function LocalBusinessSchema({ storefront, siteUrl }: LocalBusinessSchemaProps) {
  // Don't render if essential data is missing
  if (!storefront?.showroomSection?.showroomInfo) {
    return null;
  }

  const { showroomInfo } = storefront.showroomSection;
  const addressData = parseAddress(showroomInfo?.address);
  const hours = storefront.showroomSection?.hours;

  // Build opening hours specification if hours data exists
  const openingHoursSpec = hours && hours.length > 0
    ? hours
        .map((h: any) => {
          const { opens, closes } = parseHours(h.time);
          if (!opens || !closes) return null;

          return {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": h.day,
            "opens": opens,
            "closes": closes
          };
        })
        .filter(Boolean) // Remove null entries for closed days
    : null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicStore",
    "@id": `${siteUrl}/${storefront.slug}#organization`,
    "name": showroomInfo.name,
    "description": storefront.showroomSection?.showroomDescription,
    "url": `${siteUrl}/${storefront.slug}`,
    "telephone": showroomInfo.phone,
    "email": storefront.showroomInfo?.email,

    // Address
    "address": {
      "@type": "PostalAddress",
      ...addressData
    },

    // Geographic coordinates for map placement and local search
    ...(storefront.schemaData?.geoCoordinates?.latitude && storefront.schemaData?.geoCoordinates?.longitude && {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": storefront.schemaData.geoCoordinates.latitude,
        "longitude": storefront.schemaData.geoCoordinates.longitude
      }
    }),

    // Opening hours
    ...(openingHoursSpec && openingHoursSpec.length > 0 && {
      "openingHoursSpecification": openingHoursSpec
    }),

    // Price range indicator
    ...(storefront.schemaData?.priceRange && {
      "priceRange": storefront.schemaData.priceRange
    }),

    // Payment methods
    ...(storefront.schemaData?.paymentMethods && storefront.schemaData.paymentMethods.length > 0 && {
      "paymentAccepted": storefront.schemaData.paymentMethods
        .map((pm: any) => pm.method)
        .join(', ')
    }),

    // Founding date (builds trust through longevity)
    ...(storefront.schemaData?.foundingDate && {
      "foundingDate": new Date(storefront.schemaData.foundingDate).toISOString().split('T')[0]
    }),

    // Service area (helps with "near me" searches)
    ...(storefront.serviceAreaCoverage?.primaryCity && {
      "areaServed": {
        "@type": "City",
        "name": storefront.serviceAreaCoverage.primaryCity,
        ...(storefront.serviceAreaCoverage?.stateRegion && {
          "containedIn": {
            "@type": "State",
            "name": storefront.serviceAreaCoverage.stateRegion
          }
        })
      }
    }),

    // Parent organization
    "parentOrganization": {
      "@type": "Organization",
      "name": "KAWAI America Corporation",
      "url": "https://kawaius.com"
    },

    // Same as (social media profiles, if available)
    ...(storefront.socialMedia && {
      "sameAs": Object.values(storefront.socialMedia).filter(Boolean)
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}
