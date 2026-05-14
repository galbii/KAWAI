'use client';

import { LocalBusinessJsonLd, EventJsonLd } from 'next-seo';
import type { UniversityEventConfig } from '../../event.config';

interface StructuredDataProps {
  config: UniversityEventConfig;
}

export function StructuredData({ config }: StructuredDataProps) {
  return (
    <>
      <LocalBusinessJsonLd
        type="Store"
        id={config.structuredData.businessUrl}
        name={config.structuredData.businessName}
        description="Exclusive KAWAI piano sale event in Houston featuring digital and acoustic pianos at special prices. Partnership with Texas Southern University."
        url={config.structuredData.businessUrl}
        telephone={config.structuredData.businessPhone}
        address={{
          streetAddress: config.structuredData.businessAddress.street,
          addressLocality: config.structuredData.businessAddress.city,
          addressRegion: config.structuredData.businessAddress.state,
          postalCode: config.structuredData.businessAddress.zip,
          addressCountry: "US",
        }}
        geo={{
          latitude: String(config.structuredData.coordinates.lat),
          longitude: String(config.structuredData.coordinates.lng),
        }}
        images={config.structuredData.images}
        sameAs={[
          "https://www.kawai-global.com",
          "https://www.tsu.edu",
        ]}
        openingHours={[
          {
            opens: "10:00",
            closes: "19:00",
            dayOfWeek: [
              "Wednesday",
              "Thursday",
              "Friday",
            ],
            validFrom: "2025-12-04",
            validThrough: "2025-12-06",
          },
          {
            opens: "12:00",
            closes: "17:00",
            dayOfWeek: [
              "Sunday",
            ],
            validFrom: "2025-12-07",
            validThrough: "2025-12-07",
          },
        ]}
        rating={{
          ratingValue: String(config.seo.ratingValue),
          ratingCount: String(config.seo.reviewCount),
        }}
        makesOffer={[
          {
            priceSpecification: {
              type: "UnitPriceSpecification",
              priceCurrency: "USD",
              price: config.seo.priceRange,
            },
            itemOffered: {
              name: "KAWAI Piano Sales",
              description: "Digital and acoustic pianos including upright and grand pianos with special Houston pricing.",
            },
          },
        ]}
        areaServed={[
          {
            geoMidpoint: {
              latitude: "32.7767",
              longitude: "-96.7970",
            },
            geoRadius: "50000", // 50km radius covering Greater Houston Area
          },
        ]}
      />

      <EventJsonLd
        name={config.eventName}
        startDate={config.eventStartDate}
        endDate={config.eventEndDate}
        description="Exclusive KAWAI piano sale event in Houston featuring digital and acoustic pianos at special reduced prices. Partnership with Texas Southern University offering savings up to $6,000."
        location={{
          name: config.structuredData.eventLocationName,
          address: {
            streetAddress: config.structuredData.eventAddress.street,
            addressLocality: config.structuredData.eventAddress.city,
            addressRegion: config.structuredData.eventAddress.state,
            postalCode: config.structuredData.eventAddress.zip,
            addressCountry: "US",
          },
        }}
        url={config.structuredData.businessUrl}
        images={config.structuredData.images}
        offers={[
          {
            price: config.structuredData.startPrice,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: config.structuredData.businessUrl,
            validFrom: config.eventStartDate,
            validThrough: config.eventEndDate,
          },
        ]}
        performer={{
          name: "KAWAI Piano Company",
          sameAs: "https://www.kawai-global.com",
        }}
        organizer={{
          name: "Texas Southern University Music Department",
          sameAs: "https://www.tsu.edu",
        }}
        eventStatus="https://schema.org/EventScheduled"
        eventAttendanceMode="https://schema.org/OfflineEventAttendanceMode"
      />
    </>
  );
}