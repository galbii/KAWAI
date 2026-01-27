'use client';

import { LocalBusinessJsonLd, EventJsonLd } from 'next-seo';

export function StructuredData() {
  return (
    <>
      <LocalBusinessJsonLd
        type="Store"
        id="https://www.kawai-piano-sale-houston.com"
        name="KAWAI Piano Sales Houston - TSU Partnership Event"
        description="Exclusive KAWAI piano sale event in Houston featuring digital and acoustic pianos at special prices. Partnership with Texas Southern University."
        url="https://www.kawai-piano-sale-houston.com"
        telephone="+1-713-904-0001"
        address={{
          streetAddress: "601 W. Plano Parkway, Suite 153",
          addressLocality: "Plano",
          addressRegion: "TX",
          postalCode: "75075",
          addressCountry: "US",
        }}
        geo={{
          latitude: "33.0198",
          longitude: "-96.6989",
        }}
        images={[
          "/images/optimized/pianos/es120.webp",
          "/images/optimized/pianos/K-200_EP_styling_1200.webp",
          "/images/optimized/pianos/GL10_1200.webp",
        ]}
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
          ratingValue: "4.9",
          ratingCount: "127",
        }}
        makesOffer={[
          {
            priceSpecification: {
              type: "UnitPriceSpecification",
              priceCurrency: "USD",
              price: "949-18995",
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
        name="KAWAI Piano Sale Event Houston"
        startDate="2025-12-04T09:00:00-06:00"
        endDate="2025-12-07T18:00:00-06:00"
        description="Exclusive KAWAI piano sale event in Houston featuring digital and acoustic pianos at special reduced prices. Partnership with Texas Southern University offering savings up to $6,000."
        location={{
          name: "C.S. Lane Home Economics Center at Texas Southern University",
          address: {
            streetAddress: "3100 Cleburne St",
            addressLocality: "Houston",
            addressRegion: "TX",
            postalCode: "77004",
            addressCountry: "US",
          },
        }}
        url="https://www.kawai-piano-sale-houston.com"
        images={[
          "/images/optimized/pianos/es120.webp",
          "/images/optimized/pianos/K-200_EP_styling_1200.webp",
          "/images/optimized/pianos/GL10_1200.webp",
        ]}
        offers={[
          {
            price: "949",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: "https://www.kawai-piano-sale-houston.com",
            validFrom: "2025-12-04",
            validThrough: "2025-12-07",
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