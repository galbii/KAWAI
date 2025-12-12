import { KAWAI_SEO_CONFIG } from '@/lib/seo'
import { PERFORMANCES } from '@/components/namm/performances/performance-data'

/**
 * NAMMStructuredData Component
 *
 * Implements comprehensive Schema.org structured data for NAMM 2026 event page
 *
 * Schemas Implemented:
 * 1. Event Schema - For event dates, location, organizer information
 * 2. Performance EventSeries Schema - For artist performance schedule
 * 3. Organization Schema - For Kawai brand credibility and E-E-A-T
 * 4. FAQPage Schema - For common NAMM-related questions
 *
 * SEO Benefits:
 * - Enhanced search result appearance with event rich snippets
 * - Improved visibility in Google event searches
 * - FAQ rich results in SERPs
 * - Performance schedule appears in Google Calendar integrations
 * - Brand authority and trust signals
 */
export function NAMMStructuredData() {
  const siteUrl = KAWAI_SEO_CONFIG.siteUrl

  // Event Schema for NAMM 2026
  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Kawai at NAMM 2026',
    description: 'Experience Kawai\'s latest piano innovations at NAMM 2026. Hands-on demos of Novus hybrid pianos, Shigeru Kawai concert grands, digital pianos, and exclusive artist performances.',
    identifier: 'kawai-namm-2026-booth',
    inLanguage: 'en-US',
    startDate: '2026-01-22T09:00:00-08:00',
    endDate: '2026-01-24T18:00:00-08:00',
    doorTime: '09:00:00-08:00',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    typicalAgeRange: '18+',
    superEvent: {
      '@type': 'Event',
      name: 'The NAMM Show 2026',
      url: 'https://www.namm.org',
      organizer: {
        '@type': 'Organization',
        name: 'NAMM (National Association of Music Merchants)',
        url: 'https://www.namm.org'
      }
    },
    location: {
      '@type': 'Place',
      name: 'Anaheim Convention Center',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '800 W Katella Ave',
        addressLocality: 'Anaheim',
        addressRegion: 'CA',
        postalCode: '92802',
        addressCountry: 'US'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 33.8003,
        longitude: -117.9219
      }
    },
    organizer: {
      '@type': 'Organization',
      name: 'Kawai America Corporation',
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      sameAs: [
        'https://www.facebook.com/KawaiPiano',
        'https://twitter.com/KawaiPianoUSA',
        'https://www.instagram.com/kawaipiano',
        'https://www.youtube.com/user/KawaiPianoUSA'
      ]
    },
    performer: {
      '@type': 'Organization',
      name: 'Kawai Artists',
      description: 'Renowned pianists and musicians performing on Kawai instruments'
    },
    offers: {
      '@type': 'Offer',
      url: 'https://www.namm.org/registration',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: '2025-09-01T00:00:00-08:00',
      category: 'Trade Show Registration',
      description: 'NAMM Show registration required. Free for NAMM members and music industry professionals. Register at namm.org'
    },
    image: [
      // TODO: Replace with actual NAMM 2026 event images when available
      'https://via.placeholder.com/1200x630/C41E3A/FFFFFF?text=NAMM+2026+Event',
      'https://via.placeholder.com/1200x630/1A1A1A/FFFFFF?text=Kawai+Booth',
      'https://via.placeholder.com/1200x630/C41E3A/FFFFFF?text=Kawai+Artists'
    ],
    url: `${siteUrl}/namm-2026`
  }

  // Organization Schema for Kawai Brand Authority
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Kawai America Corporation',
    legalName: 'Kawai America Corporation',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: 'Kawai is a leading manufacturer of acoustic and digital pianos, known for innovation, quality craftsmanship, and exceptional sound. Founded in 1927 in Japan.',
    foundingDate: '1927',
    founder: {
      '@type': 'Person',
      name: 'Koichi Kawai'
    },
    parentOrganization: {
      '@type': 'Organization',
      name: 'Kawai Musical Instruments Manufacturing Co., Ltd.',
      url: 'https://www.kawai.co.jp'
    },
    brand: {
      '@type': 'Brand',
      name: 'Kawai',
      slogan: 'The Future of the Piano'
    },
    sameAs: [
      'https://www.facebook.com/KawaiPiano',
      'https://twitter.com/KawaiPianoUSA',
      'https://www.instagram.com/kawaipiano',
      'https://www.youtube.com/user/KawaiPianoUSA',
      'https://www.linkedin.com/company/kawai-america-corporation'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-800-421-2177',
      contactType: 'Customer Service',
      areaServed: 'US',
      availableLanguage: ['English', 'Spanish']
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '2055 E University Dr',
      addressLocality: 'Rancho Dominguez',
      addressRegion: 'CA',
      postalCode: '90220',
      addressCountry: 'US'
    }
  }

  // Performance EventSeries Schema
  const performanceSeriesSchema = {
    '@context': 'https://schema.org',
    '@type': 'EventSeries',
    name: 'NAMM 2026 Kawai Artist Performance Schedule',
    description: 'Live piano performances by world-class artists at the Kawai booth during NAMM Show 2026. Free performances daily featuring solo piano, vocal performances, and ensemble pieces.',
    organizer: {
      '@type': 'Organization',
      name: 'Kawai America Corporation',
      url: siteUrl
    },
    location: {
      '@type': 'Place',
      name: 'Kawai Booth - Anaheim Convention Center',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '800 W Katella Ave',
        addressLocality: 'Anaheim',
        addressRegion: 'CA',
        postalCode: '92802',
        addressCountry: 'US'
      }
    },
    subEvent: PERFORMANCES.map((performance) => {
      // Build social media URLs array for sameAs property
      const socialUrls = performance.socialLinks
        ? Object.values(performance.socialLinks).filter((url): url is string => Boolean(url))
        : []

      // Calculate duration in ISO 8601 format (PT#M)
      const start = new Date(performance.startDateTime)
      const end = new Date(performance.endDateTime)
      const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000)
      const duration = `PT${durationMinutes}M`

      return {
        '@type': 'MusicEvent',
        name: `${performance.artistName} - ${performance.performanceType}`,
        description: performance.description || performance.artistBio || `${performance.performanceType} performance featuring ${performance.artistName}`,
        performer: {
          '@type': 'Person',
          name: performance.artistName,
          ...(performance.artistImage && { image: `${siteUrl}${performance.artistImage}` }),
          ...(socialUrls.length > 0 && { sameAs: socialUrls }),
          ...(performance.artistBio && { description: performance.artistBio })
        },
        startDate: performance.startDateTime,
        endDate: performance.endDateTime,
        duration: duration,
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        location: {
          '@type': 'Place',
          name: 'Kawai Booth - Anaheim Convention Center'
        },
        isAccessibleForFree: true,
        organizer: {
          '@type': 'Organization',
          name: 'Kawai America Corporation'
        },
        ...(performance.genre && { genre: performance.genre })
      }
    })
  }

  // FAQ Schema for Common NAMM Questions
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'When is NAMM 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'NAMM 2026 (The NAMM Show) takes place January 22-24, 2026, at the Anaheim Convention Center in Anaheim, California. Show hours are typically 9:00 AM - 6:00 PM daily.'
        }
      },
      {
        '@type': 'Question',
        name: 'Where is the Kawai booth at NAMM 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Kawai booth location at NAMM 2026 will be announced closer to the event date. Visit this page for updates or check the official NAMM Show floor plan when released. Kawai typically has a prominent booth featuring hands-on piano demos and artist performances.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do I need tickets to attend NAMM 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, NAMM is a trade-only event requiring registration and credentials. To attend, you must be a NAMM member or work in the music products industry. Register at namm.org. NAMM Show badges are required for entry to the Anaheim Convention Center.'
        }
      },
      {
        '@type': 'Question',
        name: 'What pianos will Kawai showcase at NAMM 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Kawai will showcase its latest innovations including Novus NV6 and NV12 hybrid pianos, Shigeru Kawai concert grand pianos (SK-EX, SK-7, SK-6), digital pianos from the CA and CN series, and potentially new product announcements. Hands-on demos and artist performances will be available throughout the show.'
        }
      },
      {
        '@type': 'Question',
        name: 'Will there be artist performances at the Kawai booth?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Kawai will host live artist performances and demonstrations throughout NAMM 2026. The performance schedule will be announced closer to the event. Past NAMM shows have featured renowned Kawai artists performing on Shigeru Kawai concert grands and showcasing Kawai digital and hybrid piano capabilities.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can I try the pianos at the Kawai booth?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely! The Kawai booth features hands-on demo stations where attendees can try Shigeru Kawai concert grands, Novus hybrid pianos, digital pianos, and other models. Kawai product specialists will be available to answer questions and provide personalized demonstrations.'
        }
      },
      {
        '@type': 'Question',
        name: 'What if I can\'t attend NAMM 2026 in person?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'If you can\'t attend NAMM 2026 in person, you can still experience Kawai pianos at authorized Kawai dealers nationwide. Use our dealer locator to find a showroom near you for personalized consultations and hands-on piano trials. We also share NAMM highlights and product announcements on our website and social media channels.'
        }
      }
    ]
  }

  return (
    <>
      {/* Event Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventSchema)
        }}
      />

      {/* Performance EventSeries Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(performanceSeriesSchema)
        }}
      />

      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />
    </>
  )
}
