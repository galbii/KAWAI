import { Metadata } from 'next'
import { getConcertArtistPageServer } from '@/lib/payload-server'
import ConcertArtistHero from './components/ConcertArtistHero'
import ConcertArtistModels from './components/ConcertArtistModels'
import CraftsmanPromise from './components/CraftsmanPromise'
import SKEXConnection from './components/SKEXConnection'
import ModelGrid from './components/ModelGrid'
import ModelImageGallery from './components/ModelImageGallery'
import StoriesOfTouch from './components/StoriesOfTouch'
import HeritageMark from './components/HeritageMark'
import ExperienceInvitation from './components/ExperienceInvitation'

// SEO Metadata
export const metadata: Metadata = {
  title: 'The Sound of Mastery | Concert Artist Series',
  description:
    'From First Touch to Final Bow. KAWAI Concert Artist: 100% wooden keys, Shigeru Kawai SK-EX concert grand sampling, 97 years of Japanese craftsmanship. CA401, CA501, CA701, CA901 from $3,199.',
  keywords: [
    'KAWAI Concert Artist',
    'digital piano',
    'wooden keys',
    'Shigeru Kawai',
    'SK-EX sampling',
    'SK-EX Rendering',
    'CA401',
    'CA501',
    'CA701',
    'CA901',
    'premium digital piano',
    'acoustic piano feel',
    'Grand Feel action',
    'TwinDrive Soundboard',
    'professional digital piano',
  ],
  authors: [{ name: 'KAWAI' }],
  creator: 'KAWAI',
  publisher: 'KAWAI',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kawaius.com/concert-artist',
    title: 'The Sound of Mastery | Concert Artist Series',
    description:
      'From First Touch to Final Bow. 100% wooden keys, Shigeru Kawai SK-EX concert grand sampling, 97 years of Japanese craftsmanship.',
    siteName: 'KAWAI',
    images: [
      {
        url: '/images/banners/CA901EP-bench-styling.webp',
        width: 1200,
        height: 630,
        alt: 'KAWAI Concert Artist Series Digital Pianos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Sound of Mastery | Concert Artist Series',
    description:
      'From First Touch to Final Bow. 100% wooden keys, Shigeru Kawai SK-EX concert grand sampling, 97 years of craftsmanship.',
    images: ['/images/banners/CA901EP-bench-styling.webp'],
    creator: '@KAWAI',
  },
  alternates: {
    canonical: 'https://kawaius.com/concert-artist',
  },
}

// ISR - Revalidate every 15 minutes
export const revalidate = 900

// Structured Data (Schema.org) - Comprehensive JSON-LD
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    // Organization
    {
      '@type': 'Organization',
      '@id': 'https://kawaius.com/#organization',
      name: 'KAWAI Musical Instruments',
      alternateName: 'KAWAI',
      url: 'https://kawaius.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://kawaius.com/images/kawai-logo.png',
        width: 250,
        height: 60,
      },
      foundingDate: '1927',
      description: '97 years of piano-making excellence',
      sameAs: [
        'https://www.facebook.com/kawaipianos',
        'https://www.instagram.com/kawaipianos',
        'https://www.youtube.com/kawaipianos',
        'https://twitter.com/kawaipianos',
      ],
    },
    // BreadcrumbList
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://kawaius.com/concert-artist/#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://kawaius.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Pianos',
          item: 'https://kawaius.com/pianos',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Digital Pianos',
          item: 'https://kawaius.com/pianos/digital',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Concert Artist Series',
          item: 'https://kawaius.com/concert-artist',
        },
      ],
    },
    // ProductGroup - Concert Artist Series
    {
      '@type': 'ProductGroup',
      '@id': 'https://kawaius.com/concert-artist/#productgroup',
      name: 'KAWAI Concert Artist Series',
      description:
        'Premium digital pianos featuring 100% wooden keys and Shigeru Kawai SK-EX sampling for authentic acoustic piano feel.',
      brand: {
        '@type': 'Brand',
        name: 'KAWAI',
      },
      manufacturer: {
        '@id': 'https://kawaius.com/#organization',
      },
      hasVariant: [
        {
          '@type': 'Product',
          '@id': 'https://kawaius.com/products/ca401',
          name: 'KAWAI CA401',
          description:
            'Entry-level Concert Artist model with 100% wooden keys, Grand Feel Compact III action, and SK-EX sampling.',
          brand: {
            '@type': 'Brand',
            name: 'KAWAI',
          },
          manufacturer: {
            '@id': 'https://kawaius.com/#organization',
          },
          offers: {
            '@type': 'Offer',
            price: '3199.00',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: 'https://kawaius.com/products/ca401',
            priceValidUntil: '2025-12-31',
          },
          image: 'https://kawaius.com/images/concert-artist/ca401.jpg',
          category: 'Digital Piano',
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            reviewCount: '127',
          },
        },
        {
          '@type': 'Product',
          '@id': 'https://kawaius.com/products/ca501',
          name: 'KAWAI CA501',
          description:
            'Mid-range Concert Artist model with enhanced 5-speaker sound system, Grand Feel Compact III action, and 100% wooden keys.',
          brand: {
            '@type': 'Brand',
            name: 'KAWAI',
          },
          manufacturer: {
            '@id': 'https://kawaius.com/#organization',
          },
          offers: {
            '@type': 'Offer',
            price: '4099.00',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: 'https://kawaius.com/products/ca501',
            priceValidUntil: '2025-12-31',
          },
          image: 'https://kawaius.com/images/concert-artist/ca501.jpg',
          category: 'Digital Piano',
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '89',
          },
        },
        {
          '@type': 'Product',
          '@id': 'https://kawaius.com/products/ca701',
          name: 'KAWAI CA701',
          description:
            'Advanced Concert Artist model with Grand Feel III action, premium 6-speaker sound system, and grand piano aesthetics.',
          brand: {
            '@type': 'Brand',
            name: 'KAWAI',
          },
          manufacturer: {
            '@id': 'https://kawaius.com/#organization',
          },
          offers: {
            '@type': 'Offer',
            price: '5049.00',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: 'https://kawaius.com/products/ca701',
            priceValidUntil: '2025-12-31',
          },
          image: 'https://kawaius.com/images/concert-artist/ca701.jpg',
          category: 'Digital Piano',
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '156',
          },
        },
        {
          '@type': 'Product',
          '@id': 'https://kawaius.com/products/ca901',
          name: 'KAWAI CA901',
          description:
            'Flagship Concert Artist model with Grand Feel III action, superior TwinDrive sound system, and premium craftsmanship.',
          brand: {
            '@type': 'Brand',
            name: 'KAWAI',
          },
          manufacturer: {
            '@id': 'https://kawaius.com/#organization',
          },
          offers: {
            '@type': 'Offer',
            price: '6549.00',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: 'https://kawaius.com/products/ca901',
            priceValidUntil: '2025-12-31',
          },
          image: 'https://kawaius.com/images/concert-artist/ca901.jpg',
          category: 'Digital Piano',
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '5.0',
            reviewCount: '203',
          },
        },
      ],
      url: 'https://kawaius.com/concert-artist',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '575',
      },
    },
    // CollectionPage
    {
      '@type': 'CollectionPage',
      '@id': 'https://kawaius.com/concert-artist/#webpage',
      url: 'https://kawaius.com/concert-artist',
      name: 'Concert Artist Series | Premium Digital Pianos - KAWAI',
      description:
        'KAWAI Concert Artist: 100% wooden keys, Shigeru Kawai SK-EX sampling. CA401, CA501, CA701, CA901. Authentic acoustic feel from $3,199.',
      isPartOf: {
        '@id': 'https://kawaius.com/#website',
      },
      breadcrumb: {
        '@id': 'https://kawaius.com/concert-artist/#breadcrumb',
      },
      about: {
        '@id': 'https://kawaius.com/concert-artist/#productgroup',
      },
      publisher: {
        '@id': 'https://kawaius.com/#organization',
      },
    },
  ],
}

export default async function ConcertArtistPage() {
  // Fetch Concert Artist page data from CMS
  const pageData = await getConcertArtistPageServer()

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Main Content - Narrative Arc: "The Sound of Mastery" */}
      <main>
        {/* 1. Hero - Brand positioning and promise */}
        <ConcertArtistHero />

        {/* 2. Model Showcase - CMS Managed */}
        <ConcertArtistModels data={pageData} />

        {/* 3. The Craftsman's Promise - Heritage foundation (1927) */}
        <CraftsmanPromise />

        {/* 4. SK-EX Connection - The concert grand lineage */}
        <SKEXConnection />

        {/* 5. Four Expressions - The product lineup with positioning */}
        <ModelGrid />

        {/* 6. Model Image Gallery - CMS Managed */}
        <ModelImageGallery data={pageData} />

        {/* 7. Stories of Touch - Real testimonials from owners */}
        <StoriesOfTouch />

        {/* 8. Heritage Mark - The seal of authenticity */}
        <HeritageMark />
      </main>
    </>
  )
}
