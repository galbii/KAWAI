import type { Metadata } from "next";
import { HeaderDynamic } from "@/components/layout/header-dynamic";
import { FooterDynamic } from "@/components/layout/footer-dynamic";
import { NavigationContextProvider } from "@/contexts/NavigationContext";
import { parseNavigationOrigin } from "@/lib/navigation-utils";
import { headers } from 'next/headers';
import { organizationSchema, featuredProductsSchema } from "@/lib/seo/schemas";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaipianostlouis.com'),
  title: "Kawai Piano Gallery St. Louis | Best Piano Brands & Japanese Craftsmanship",
  description: "Experience 95+ years of Japanese piano craftsmanship at St. Louis's premier Kawai Piano Gallery. Discover the Millennium III carbon fiber action, warm piano sound quality, and exceptional Shigeru Kawai grands. Authorized dealer in Lake St. Louis, MO serving Missouri since 1927.",
  keywords: "Kawai piano, best piano brands, piano sound quality, Japanese piano craftsmanship, carbon fiber action, Millennium III action, piano dealer St. Louis, Kawai Piano Gallery, Shigeru Kawai, digital pianos, piano showroom Missouri, quality piano brands, authorized Kawai dealer, Lake St. Louis MO, piano consultation",
  authors: [{ name: "Kawai Piano Gallery St. Louis" }],
  openGraph: {
    title: "Kawai Piano Gallery St. Louis | Best Piano Brands & Japanese Craftsmanship",
    description: "Experience 95+ years of Japanese piano craftsmanship. Discover Millennium III carbon fiber action, exceptional sound quality, and Shigeru Kawai grands at our Lake St. Louis showroom.",
    type: "website",
    locale: "en_US",
    siteName: "Kawai Piano Gallery St. Louis",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kawai Piano Gallery St. Louis | Best Piano Brands",
    description: "Experience 95+ years of Japanese piano craftsmanship. Millennium III carbon fiber action & exceptional sound quality.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function FrontendLayout(props: { children: React.ReactNode }) {
  const { children } = props
  
  // Get initial navigation origin from server request
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || '/'
  const initialOrigin = parseNavigationOrigin(pathname)

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "MusicStore",
    "name": "Kawai Piano Gallery St. Louis",
    "description": "Premier Kawai Piano Gallery in St. Louis serving Lake St. Louis, Missouri with expert piano consultation, Shigeru Kawai grand pianos, digital pianos, and hybrid pianos since 1927.",
    "url": "https://kawaipianostlouis.com",
    "telephone": "636-265-2866",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "21 Meadows Circle Drive, Suite 312",
      "addressLocality": "Lake St. Louis",
      "addressRegion": "MO",
      "postalCode": "63367",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 38.7881,
      "longitude": -90.7095
    },
    "openingHours": [
      "Mo-Fr 10:00-19:00",
      "Sa 10:00-18:00", 
      "Su 13:00-17:00"
    ],
    "priceRange": "$$-$$$$",
    "servesCuisine": [],
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 38.7881,
        "longitude": -90.7095
      },
      "geoRadius": "50000"
    },
    "areaServed": [
      "St. Louis",
      "Lake St. Louis",
      "St. Charles County",
      "Missouri"
    ],
    "brand": "Kawai",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Piano Products & Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Kawai Grand Pianos"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Product",
            "name": "Kawai Digital Pianos"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Piano Tuning Services"
          }
        }
      ]
    }
  };

  return (
    <NavigationContextProvider initialOrigin={initialOrigin}>
      {/* LocalBusiness Schema for local SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      {/* Organization Schema for brand identity and E-E-A-T */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      {/* Featured Products Schema for piano categories */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(featuredProductsSchema),
        }}
      />
      <div className="flex min-h-screen flex-col">
        <HeaderDynamic />
        <main className="flex-1">{children}</main>
        <FooterDynamic />
      </div>
    </NavigationContextProvider>
  )
}
