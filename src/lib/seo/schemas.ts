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
  category: 'Grand Piano' | 'Upright Piano' | 'Digital Piano' | 'Hybrid Piano';
  brand?: string;
  image?: string;
  offers?: {
    price?: number;
    currency?: string;
    availability?: string;
  };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Kawai"
    },
    "category": product.category,
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
 * Highlights key piano categories
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
        "@type": "Product",
        "name": "Kawai Grand Pianos",
        "description": "Premium grand pianos featuring the revolutionary Millennium III Carbon Fiber Action for unmatched performance and durability",
        "brand": {
          "@type": "Brand",
          "name": "Kawai"
        },
        "category": "Grand Piano"
      }
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": {
        "@type": "Product",
        "name": "Shigeru Kawai Grand Pianos",
        "description": "Hand-crafted concert grand pianos representing the pinnacle of piano artistry and Japanese craftsmanship",
        "brand": {
          "@type": "Brand",
          "name": "Shigeru Kawai"
        },
        "category": "Grand Piano"
      }
    },
    {
      "@type": "ListItem",
      "position": 3,
      "item": {
        "@type": "Product",
        "name": "Kawai Digital Pianos",
        "description": "Advanced digital pianos with authentic wooden-key action and world-class piano sound sampling",
        "brand": {
          "@type": "Brand",
          "name": "Kawai"
        },
        "category": "Digital Piano"
      }
    },
    {
      "@type": "ListItem",
      "position": 4,
      "item": {
        "@type": "Product",
        "name": "Kawai Upright Pianos",
        "description": "Space-efficient upright pianos delivering rich tone and responsive touch for home and studio",
        "brand": {
          "@type": "Brand",
          "name": "Kawai"
        },
        "category": "Upright Piano"
      }
    },
    {
      "@type": "ListItem",
      "position": 5,
      "item": {
        "@type": "Product",
        "name": "Kawai Hybrid Pianos",
        "description": "Revolutionary instruments combining acoustic piano touch with digital versatility via AnyTime silent system",
        "brand": {
          "@type": "Brand",
          "name": "Kawai"
        },
        "category": "Hybrid Piano"
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
