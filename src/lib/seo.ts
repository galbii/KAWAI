// SEO optimization utilities for Kawai piano website

export interface SEOData {
  title: string
  description: string
  keywords: string
  canonicalUrl?: string
  openGraph?: OpenGraphData
  twitter?: TwitterCardData
  structuredData?: any
}

export interface OpenGraphData {
  title: string
  description: string
  image: string
  url: string
  type: 'website' | 'article' | 'product'
  siteName: string
}

export interface TwitterCardData {
  card: 'summary' | 'summary_large_image' | 'player'
  title: string
  description: string
  image: string
  site?: string
  creator?: string
}

export const KAWAI_SEO_CONFIG = {
  siteName: 'Kawai Piano',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://kawai-piano.com',
  twitterSite: '@KawaiPianoUSA',
  defaultImage: '/images/kawai-og-default.jpg',
  brandKeywords: [
    'Kawai piano',
    'Kawai pianos',
    'premium piano',
    'acoustic piano',
    'grand piano',
    'upright piano',
    'digital piano',
    'piano manufacturer',
    'Japanese piano',
    'concert piano'
  ]
} as const

function generateSEOTitle(piano: any): string {
  return `${piano.name} - ${piano.category?.name || 'Piano'} | Kawai Piano`
}

function generateSEODescription(piano: any): string {
  return `Discover the ${piano.name} by Kawai. ${piano.shortDescription || piano.description || 'Premium piano craftsmanship with exceptional sound quality.'} View specifications and pricing.`
}

function generateSEOKeywords(piano: any): string {
  const keywords = [
    ...KAWAI_SEO_CONFIG.brandKeywords,
    piano.name,
    piano.model,
    piano.category?.name,
    piano.series?.name,
    'piano for sale',
    'piano specifications'
  ].filter(Boolean)
  
  return keywords.join(', ')
}

export function generatePianoSEO(piano: any): SEOData {
  const title = generateSEOTitle(piano)
  const description = generateSEODescription(piano)
  const keywords = generateSEOKeywords(piano)
  const canonicalUrl = `${KAWAI_SEO_CONFIG.siteUrl}/pianos/${piano.slug}`
  const image = piano.media?.featuredImage?.url || KAWAI_SEO_CONFIG.defaultImage

  return {
    title,
    description,
    keywords,
    canonicalUrl,
    openGraph: {
      title,
      description,
      image: `${KAWAI_SEO_CONFIG.siteUrl}${image}`,
      url: canonicalUrl,
      type: 'product',
      siteName: KAWAI_SEO_CONFIG.siteName
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      image: `${KAWAI_SEO_CONFIG.siteUrl}${image}`,
      site: KAWAI_SEO_CONFIG.twitterSite
    },
    structuredData: generatePianoStructuredData(piano)
  }
}

export function generateSeriesSEO(series: any): SEOData {
  const title = `${series.name} - Premium Piano Series | Kawai Piano`
  const description = `Explore the ${series.name} piano series by Kawai. ${series.shortDescription || 'Exceptional craftsmanship and innovative technology.'} View models and specifications.`
  const keywords = [
    ...KAWAI_SEO_CONFIG.brandKeywords,
    series.name,
    `${series.name} piano`,
    `${series.name} series`,
    series.category,
    'piano series'
  ].join(', ')
  
  const canonicalUrl = `${KAWAI_SEO_CONFIG.siteUrl}/series/${series.slug}`
  const image = series.media?.featuredImage?.url || KAWAI_SEO_CONFIG.defaultImage

  return {
    title,
    description,
    keywords,
    canonicalUrl,
    openGraph: {
      title,
      description,
      image: `${KAWAI_SEO_CONFIG.siteUrl}${image}`,
      url: canonicalUrl,
      type: 'website',
      siteName: KAWAI_SEO_CONFIG.siteName
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      image: `${KAWAI_SEO_CONFIG.siteUrl}${image}`,
      site: KAWAI_SEO_CONFIG.twitterSite
    },
    structuredData: generateSeriesStructuredData(series)
  }
}

export function generateArtistSEO(artist: any): SEOData {
  const title = `${artist.name} - Kawai Artist | ${artist.category.replace('-', ' ')}`
  const description = `Meet ${artist.name}, a renowned ${artist.category.replace('-', ' ')} and Kawai piano artist. ${artist.shortBio || 'Discover their musical journey and performances on Kawai pianos.'}`
  const keywords = [
    artist.name,
    `${artist.name} pianist`,
    artist.category.replace('-', ' '),
    'Kawai artist',
    'piano artist',
    'classical pianist',
    'concert pianist'
  ].join(', ')
  
  const canonicalUrl = `${KAWAI_SEO_CONFIG.siteUrl}/artists/${artist.slug}`
  const image = artist.media?.profileImage?.url || KAWAI_SEO_CONFIG.defaultImage

  return {
    title,
    description,
    keywords,
    canonicalUrl,
    openGraph: {
      title,
      description,
      image: `${KAWAI_SEO_CONFIG.siteUrl}${image}`,
      url: canonicalUrl,
      type: 'article',
      siteName: KAWAI_SEO_CONFIG.siteName
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      image: `${KAWAI_SEO_CONFIG.siteUrl}${image}`,
      site: KAWAI_SEO_CONFIG.twitterSite
    },
    structuredData: generateArtistStructuredData(artist)
  }
}

export function generateTechnologySEO(technology: any): SEOData {
  const title = `${technology.name} - Piano Innovation | Kawai Technology`
  const description = `Learn about ${technology.name}, an innovative piano technology by Kawai. ${technology.shortDescription} Discover how it enhances piano performance.`
  const keywords = [
    technology.name,
    'piano technology',
    'piano innovation',
    'Kawai technology',
    technology.category,
    'piano engineering'
  ].join(', ')
  
  const canonicalUrl = `${KAWAI_SEO_CONFIG.siteUrl}/technology/${technology.slug}`
  const image = technology.media?.featuredImage?.url || KAWAI_SEO_CONFIG.defaultImage

  return {
    title,
    description,
    keywords,
    canonicalUrl,
    openGraph: {
      title,
      description,
      image: `${KAWAI_SEO_CONFIG.siteUrl}${image}`,
      url: canonicalUrl,
      type: 'article',
      siteName: KAWAI_SEO_CONFIG.siteName
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      image: `${KAWAI_SEO_CONFIG.siteUrl}${image}`,
      site: KAWAI_SEO_CONFIG.twitterSite
    },
    structuredData: generateTechnologyStructuredData(technology)
  }
}

// Structured Data Generation
export function generatePianoStructuredData(piano: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: piano.name,
    model: piano.model,
    brand: {
      '@type': 'Brand',
      name: 'Kawai'
    },
    description: piano.description,
    image: piano.media?.featuredImage?.url,
    offers: {
      '@type': 'Offer',
      price: piano.pricing?.msrp || piano.pricing?.salePrice,
      priceCurrency: 'USD',
      availability: piano.status === 'available' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Kawai Piano'
      }
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Kawai Musical Instruments',
      url: 'https://kawai.com'
    },
    category: piano.category?.name,
    aggregateRating: piano.reviews ? {
      '@type': 'AggregateRating',
      ratingValue: piano.averageRating,
      reviewCount: piano.reviews.length
    } : undefined
  }
}

export function generateSeriesStructuredData(series: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProductCollection',
    name: series.name,
    description: series.description,
    brand: {
      '@type': 'Brand',
      name: 'Kawai'
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Kawai Musical Instruments',
      url: 'https://kawai.com'
    }
  }
}

export function generateArtistStructuredData(artist: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: artist.name,
    jobTitle: artist.title || artist.category.replace('-', ' '),
    description: artist.biography,
    image: artist.media?.profileImage?.url,
    sameAs: artist.contact?.socialMedia?.map((social: any) => social.url) || [],
    affiliation: {
      '@type': 'Organization',
      name: 'Kawai Piano'
    }
  }
}

export function generateTechnologyStructuredData(technology: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: technology.name,
    description: technology.shortDescription,
    image: technology.media?.featuredImage?.url,
    author: {
      '@type': 'Organization',
      name: 'Kawai Musical Instruments'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kawai Piano',
      logo: {
        '@type': 'ImageObject',
        url: `${KAWAI_SEO_CONFIG.siteUrl}/logo.png`
      }
    },
    about: {
      '@type': 'Thing',
      name: 'Piano Technology'
    }
  }
}

export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${KAWAI_SEO_CONFIG.siteUrl}${crumb.url}`
    }))
  }
}

export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Kawai Piano',
    legalName: 'Kawai Musical Instruments',
    url: KAWAI_SEO_CONFIG.siteUrl,
    logo: `${KAWAI_SEO_CONFIG.siteUrl}/logo.png`,
    description: 'Premium piano manufacturer specializing in acoustic and digital pianos since 1927.',
    foundingDate: '1927',
    founder: {
      '@type': 'Person',
      name: 'Koichi Kawai'
    },
    sameAs: [
      'https://facebook.com/KawaiPiano',
      'https://twitter.com/KawaiPianoUSA',
      'https://youtube.com/KawaiPiano',
      'https://instagram.com/kawaipiano'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-800-KAWAI-US',
      contactType: 'Customer Service'
    }
  }
}

// SEO Analysis and Recommendations
export function analyzeSEO(content: string, targetKeywords: string[]): {
  score: number
  recommendations: string[]
} {
  const recommendations: string[] = []
  let score = 100

  // Title length check
  if (content.length < 30) {
    score -= 10
    recommendations.push('Title should be at least 30 characters long')
  }
  if (content.length > 60) {
    score -= 10
    recommendations.push('Title should be less than 60 characters for optimal display')
  }

  // Keyword density check
  targetKeywords.forEach(keyword => {
    const keywordRegex = new RegExp(keyword, 'gi')
    const matches = content.match(keywordRegex)
    if (!matches) {
      score -= 15
      recommendations.push(`Include target keyword "${keyword}" in the content`)
    }
  })

  return { score, recommendations }
}

export function generateLocalBusinessStructuredData(location: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicStore',
    name: location.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: location.address,
      addressLocality: location.city,
      addressRegion: location.state,
      postalCode: location.zipCode,
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: location.coordinates?.latitude,
      longitude: location.coordinates?.longitude
    },
    telephone: location.phone,
    url: location.website,
    openingHours: location.hours,
    priceRange: '$$$'
  }
}

export const KAWAI_SEARCH_TERMS = {
  primary: [
    'kawai piano',
    'kawai pianos',
    'kawai grand piano',
    'kawai upright piano',
    'kawai digital piano'
  ],
  secondary: [
    'shigeru kawai piano',
    'kawai gx series',
    'kawai ca series',
    'kawai cn series',
    'millennium iii action',
    'harmonic imaging xl'
  ],
  longTail: [
    'best kawai piano for beginners',
    'kawai vs yamaha piano comparison',
    'kawai piano dealer near me',
    'kawai piano price',
    'kawai piano reviews',
    'kawai piano maintenance',
    'kawai piano history',
    'kawai piano technology'
  ]
} as const

export function generateSitemapData(collections: {
  pianos: any[]
  series: any[]
  artists: any[]
  technologies: any[]
}) {
  const baseUrl = KAWAI_SEO_CONFIG.siteUrl
  const urls = []

  // Static pages
  urls.push(
    { url: baseUrl, priority: 1.0, changefreq: 'daily' },
    { url: `${baseUrl}/pianos`, priority: 0.9, changefreq: 'daily' },
    { url: `${baseUrl}/series`, priority: 0.8, changefreq: 'weekly' },
    { url: `${baseUrl}/artists`, priority: 0.7, changefreq: 'weekly' },
    { url: `${baseUrl}/technology`, priority: 0.7, changefreq: 'weekly' },
    { url: `${baseUrl}/heritage`, priority: 0.6, changefreq: 'monthly' }
  )

  // Piano pages
  collections.pianos.forEach(piano => {
    urls.push({
      url: `${baseUrl}/pianos/${piano.slug}`,
      priority: piano.isFeatured ? 0.9 : 0.7,
      changefreq: 'weekly',
      lastmod: piano.updatedAt
    })
  })

  // Series pages
  collections.series.forEach(series => {
    urls.push({
      url: `${baseUrl}/series/${series.slug}`,
      priority: 0.7,
      changefreq: 'weekly',
      lastmod: series.updatedAt
    })
  })

  // Artist pages
  collections.artists.forEach(artist => {
    urls.push({
      url: `${baseUrl}/artists/${artist.slug}`,
      priority: artist.featured ? 0.7 : 0.5,
      changefreq: 'monthly',
      lastmod: artist.updatedAt
    })
  })

  // Technology pages
  collections.technologies.forEach(tech => {
    urls.push({
      url: `${baseUrl}/technology/${tech.slug}`,
      priority: tech.isInnovation ? 0.7 : 0.5,
      changefreq: 'monthly',
      lastmod: tech.updatedAt
    })
  })

  return urls
}