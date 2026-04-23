/**
 * Centralized Schema.org structured data definitions for SEO
 * These schemas enhance search engine understanding and enable rich results
 */

/**
 * Organization Schema
 * Establishes brand identity, founding date, and social presence
 */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Kawai America Corporation",
  "url": "https://kawaius.com",
  "logo": "https://kawaius.com/images/logo.png",
  "description": "Since 1927, Kawai has been crafting world-class pianos that blend Japanese precision craftsmanship with innovative technology. Family-owned and dedicated to musical excellence.",
  "foundingDate": "1927",
  "founder": {
    "@type": "Person",
    "name": "Koichi Kawai"
  },
  "brand": {
    "@type": "Brand",
    "name": "Kawai"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "21 Meadows Circle Drive, Suite 312",
    "addressLocality": "Lake St. Louis",
    "addressRegion": "MO",
    "postalCode": "63367",
    "addressCountry": "US"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-636-265-2866",
    "contactType": "customer service",
    "areaServed": "US",
    "availableLanguage": ["English"]
  },
  "sameAs": [
    "https://www.facebook.com/KawaiPianosUS/",
    "https://www.instagram.com/kawaipianosus/",
    "https://www.youtube.com/@KawaiPianosUS",
    "https://www.linkedin.com/company/9083672"
  ]
};

/**
 * Valid schema.org availability values for Product offers.
 * Google requires the full URL form for rich result eligibility.
 */
export type SchemaAvailability =
  | 'https://schema.org/InStock'
  | 'https://schema.org/OutOfStock'
  | 'https://schema.org/PreOrder'
  | 'https://schema.org/BackOrder'
  | 'https://schema.org/Discontinued'

/**
 * Product Schema Generator
 * Creates structured data for specific piano models
 */
export function generateProductSchema(product: {
  name: string;
  description: string;
  type: 'digital' | 'grand' | 'hybrid' | 'upright' | 'accessory' | 'software';
  brand?: string;
  image?: string;
  sku?: string;
  mpn?: string;
  url?: string;
  model?: string;
  /** ISO 8601 datetime string — drives Google's freshness signal and AI dateModified indexing */
  dateModified?: string;
  offers?: {
    price?: number;
    currency?: string;
    availability?: SchemaAvailability;
  };
}) {
  // Map type slugs to Schema.org category display names
  const getSchemaCategory = (type: string): string => {
    const categoryMap: Record<string, string> = {
      digital: 'Digital Piano',
      grand: 'Grand Piano',
      hybrid: 'Hybrid Piano',
      upright: 'Upright Piano',
      accessory: 'Piano Accessory',
      software: 'Music Software'
    }
    return categoryMap[type] || 'Musical Instrument'
  }

  // Always emit offers — Google requires it for Product rich results.
  // Include price only when known; always include priceCurrency and availability.
  const offersData = product.offers ?? {}
  const availability: SchemaAvailability = offersData.availability ?? 'https://schema.org/InStock'

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Kawai"
    },
    "category": getSchemaCategory(product.type),
    ...(product.sku && { "sku": product.sku }),
    // mpn = Manufacturer Part Number; for Kawai, this is the model number (e.g. CA99, GX-7)
    ...(product.mpn && { "mpn": product.mpn }),
    ...(product.url && { "url": product.url }),
    ...(product.model && { "model": product.model }),
    ...(product.image && {
      "image": {
        "@type": "ImageObject",
        "url": product.image
      }
    }),
    // dateModified tells Google (and AI systems like ChatGPT/Perplexity) how fresh
    // this product data is — important for pricing and availability accuracy signals.
    ...(product.dateModified && { "dateModified": product.dateModified }),
    "offers": {
      "@type": "Offer",
      "priceCurrency": offersData.currency || "USD",
      ...(offersData.price != null && { "price": offersData.price }),
      "availability": availability,
      "seller": {
        "@type": "Organization",
        "name": "Kawai America Corporation",
        "url": "https://kawaius.com"
      }
    }
  };
}

/**
 * Featured Products Schema for Homepage
 * Highlights key piano categories using ItemList to avoid Product validation requirements
 */
export const featuredProductsSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Kawai Piano Collection",
  "description": "Explore our complete collection of Kawai acoustic and digital pianos",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Thing",
        "name": "Kawai Grand Pianos",
        "description": "Premium grand pianos featuring the revolutionary Millennium III Carbon Fiber Action for unmatched performance and durability",
        "url": "https://kawaius.com/pianos/grand"
      }
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": {
        "@type": "Thing",
        "name": "Shigeru Kawai Grand Pianos",
        "description": "Hand-crafted concert grand pianos representing the pinnacle of piano artistry and Japanese craftsmanship",
        "url": "https://kawaius.com/pianos/shigeru-kawai"
      }
    },
    {
      "@type": "ListItem",
      "position": 3,
      "item": {
        "@type": "Thing",
        "name": "Kawai Digital Pianos",
        "description": "Advanced digital pianos with authentic wooden-key action and world-class piano sound sampling",
        "url": "https://kawaius.com/pianos/digital"
      }
    },
    {
      "@type": "ListItem",
      "position": 4,
      "item": {
        "@type": "Thing",
        "name": "Kawai Upright Pianos",
        "description": "Space-efficient upright pianos delivering rich tone and responsive touch for home and studio",
        "url": "https://kawaius.com/pianos/upright"
      }
    },
    {
      "@type": "ListItem",
      "position": 5,
      "item": {
        "@type": "Thing",
        "name": "Kawai Hybrid Pianos",
        "description": "Revolutionary instruments combining acoustic piano touch with digital versatility via AnyTime silent system",
        "url": "https://kawaius.com/pianos/hybrid"
      }
    }
  ]
};

/**
 * BreadcrumbList Schema Generator
 * Improves navigation understanding for search engines
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
}

/**
 * Person / MusicPerformer Schema Generator
 *
 * Used on artist pages. Schema.org's MusicPerformer is a sub-type of
 * PerformingGroup/Person — Google, ChatGPT, and Perplexity use this to
 * surface artist cards and attribute piano-related content to named performers.
 * Using the dual @type ["Person", "MusicPerformer"] maximises compatibility.
 */
export function generatePersonSchema(person: {
  name: string;
  description?: string;
  image?: string;
  url?: string;
  /** Instrument(s) played — maps to schema.org/instrument */
  instrument?: string | string[];
  /** Musical genre(s) */
  genre?: string | string[];
  /** Social profile URLs (website, Instagram, YouTube, etc.) */
  sameAs?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": ["Person", "MusicPerformer"],
    "name": person.name,
    ...(person.description && { "description": person.description }),
    ...(person.url && { "url": person.url }),
    ...(person.image && {
      "image": {
        "@type": "ImageObject",
        "url": person.image
      }
    }),
    ...(person.instrument && {
      "instrument": Array.isArray(person.instrument)
        ? person.instrument
        : [person.instrument]
    }),
    ...(person.genre && {
      "genre": Array.isArray(person.genre) ? person.genre : [person.genre]
    }),
    "sponsor": {
      "@type": "Organization",
      "name": "Kawai America Corporation",
      "url": "https://kawaius.com"
    },
    ...(person.sameAs && person.sameAs.length > 0 && { "sameAs": person.sameAs }),
  };
}
