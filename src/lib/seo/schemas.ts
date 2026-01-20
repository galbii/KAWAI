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
  "alternateName": "Kawai Piano Gallery St. Louis",
  "url": "https://kawaipianos.com",
  "logo": "https://kawaipianos.com/images/logo.png",
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
  }
};

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
  offers?: {
    price?: number;
    currency?: string;
    availability?: string;
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
    ...(product.image && {
      "image": product.image
    }),
    ...(product.offers && {
      "offers": {
        "@type": "Offer",
        "priceCurrency": product.offers.currency || "USD",
        ...(product.offers.price && { "price": product.offers.price }),
        "availability": product.offers.availability || "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "Kawai Piano Gallery St. Louis"
        }
      }
    })
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
        "url": "https://kawaipianos.com/pianos/grand"
      }
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": {
        "@type": "Thing",
        "name": "Shigeru Kawai Grand Pianos",
        "description": "Hand-crafted concert grand pianos representing the pinnacle of piano artistry and Japanese craftsmanship",
        "url": "https://kawaipianos.com/pianos/shigeru-kawai"
      }
    },
    {
      "@type": "ListItem",
      "position": 3,
      "item": {
        "@type": "Thing",
        "name": "Kawai Digital Pianos",
        "description": "Advanced digital pianos with authentic wooden-key action and world-class piano sound sampling",
        "url": "https://kawaipianos.com/pianos/digital"
      }
    },
    {
      "@type": "ListItem",
      "position": 4,
      "item": {
        "@type": "Thing",
        "name": "Kawai Upright Pianos",
        "description": "Space-efficient upright pianos delivering rich tone and responsive touch for home and studio",
        "url": "https://kawaipianos.com/pianos/upright"
      }
    },
    {
      "@type": "ListItem",
      "position": 5,
      "item": {
        "@type": "Thing",
        "name": "Kawai Hybrid Pianos",
        "description": "Revolutionary instruments combining acoustic piano touch with digital versatility via AnyTime silent system",
        "url": "https://kawaipianos.com/pianos/hybrid"
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
