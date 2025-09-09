'use client';

import { LocalBusinessJsonLd, EventJsonLd } from 'next-seo';

export function StructuredData() {
  return (
    <>
      <LocalBusinessJsonLd
        type="Store"
        id="https://www.kawai-piano-sale-houston.com"
        name="KAWAI Piano Sales Houston - UTD Partnership Event"
        description="Exclusive KAWAI piano sale event in Houston featuring digital and acoustic pianos at special prices. Partnership with University of Texas at Dallas."
        url="https://www.kawai-piano-sale-houston.com"
        telephone="+1-972-645-2514"
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
          "https://www.utdallas.edu",
        ]}
        openingHours={[
          {
            opens: "09:00",
            closes: "18:00",
            dayOfWeek: [
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            validFrom: "2025-09-18",
            validThrough: "2025-09-21",
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
              description: "Digital and acoustic pianos including upright and grand pianos with special Dallas pricing.",
            },
          },
        ]}
        areaServed={[
          {
            geoMidpoint: {
              latitude: "32.7767",
              longitude: "-96.7970",
            },
            geoRadius: "50000", // 50km radius covering Greater Dallas Area
          },
        ]}
      />
      
      <EventJsonLd
        name="KAWAI Piano Sale Event Houston"
        startDate="2025-09-18T09:00:00-05:00"
        endDate="2025-09-21T18:00:00-05:00"
        description="Exclusive KAWAI piano sale event in Houston featuring digital and acoustic pianos at special reduced prices. Partnership with University of Texas at Dallas offering savings up to $6,000."
        location={{
          name: "University of Texas at Dallas",
          address: {
            streetAddress: "800 W Campbell Rd",
            addressLocality: "Richardson",
            addressRegion: "TX",
            postalCode: "75080",
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
            validFrom: "2025-09-18",
            validThrough: "2025-09-21",
          },
        ]}
        performer={{
          name: "KAWAI Piano Company",
          sameAs: "https://www.kawai-global.com",
        }}
        organizer={{
          name: "University of Texas at Dallas Music Department",
          sameAs: "https://www.utdallas.edu",
        }}
        eventStatus="https://schema.org/EventScheduled"
        eventAttendanceMode="https://schema.org/OfflineEventAttendanceMode"
      />
    </>
  );
}