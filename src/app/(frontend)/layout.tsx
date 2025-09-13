import type { Metadata } from "next";
import { HeaderDynamic } from "@/components/layout/header-dynamic";
import { Footer } from "@/components/layout/footer";
import { NavigationContextProvider } from "@/contexts/NavigationContext";
import { parseNavigationOrigin } from "@/lib/navigation-utils";
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: "Kawai Piano Gallery St. Louis | Premier Piano Gallery Lake St. Louis, MO",
  description: "St. Louis's premier Kawai Piano Gallery in Lake St. Louis, MO. Shop Shigeru Kawai grand pianos, digital pianos, and hybrids. Expert piano consultation, services, and guidance. Serving Missouri piano families since 1927. Piano Gallery near me.",
  keywords: "Piano Gallery St. Louis, Kawai Piano Gallery St. Louis, piano gallery Lake St. Louis MO, Piano Gallery near me, piano gallery Missouri, Kawai pianos St. Louis, Piano Gallery Lake St. Louis, Shigeru Kawai St. Louis, piano showroom Missouri, piano gallery Lake St. Louis, digital pianos St. Louis, acoustic pianos Missouri, piano consultation St. Louis, piano services Missouri",
  authors: [{ name: "Kawai Piano Gallery St. Louis" }],
  openGraph: {
    title: "Kawai Piano Gallery St. Louis | Premier Piano Gallery Lake St. Louis, MO",
    description: "St. Louis's premier Kawai Piano Gallery. Visit our Lake St. Louis showroom for expert piano consultation, Shigeru Kawai grands, and digital pianos. Serving Missouri since 1927.",
    type: "website",
    locale: "en_US",
    siteName: "Kawai Piano Gallery St. Louis",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kawai Piano Gallery St. Louis | Piano Gallery Lake St. Louis, MO",
    description: "St. Louis's premier Kawai Piano Gallery in Lake St. Louis, MO. Expert piano consultation and premium instruments.",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <div className="flex min-h-screen flex-col">
        <HeaderDynamic />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </NavigationContextProvider>
  )
}
