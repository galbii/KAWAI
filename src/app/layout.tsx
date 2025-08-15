import type { Metadata, Viewport } from "next";
import { Inter, Crimson_Text } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

// Primary font for body text and UI elements
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// Elegant serif font for headings and brand elements
const crimsonText = Crimson_Text({
  subsets: ["latin"],
  variable: "--font-crimson",
  display: "swap",
  weight: ["400", "600"],
  style: ["normal", "italic"],
});


export const metadata: Metadata = {
  title: "Kawai Piano Dealer St. Louis | Piano Store Lake St. Louis, MO",
  description: "St. Louis's premier Kawai piano dealer in Lake St. Louis, MO. Shop Shigeru Kawai grand pianos, digital pianos, and hybrids. Expert piano services, tuning, and lessons. Serving Missouri piano families since 1927. Piano dealer near me.",
  keywords: "piano dealer St. Louis, Kawai piano dealer St. Louis, piano store Lake St. Louis MO, piano dealer near me, piano store Missouri, Kawai pianos St. Louis, piano dealer Lake St. Louis, Shigeru Kawai St. Louis, piano gallery Missouri, piano showroom Lake St. Louis, digital pianos St. Louis, acoustic pianos Missouri, piano services St. Louis, piano tuning Missouri",
  authors: [{ name: "Kawai Piano Gallery St. Louis" }],
  openGraph: {
    title: "Kawai Piano Dealer St. Louis | Premier Piano Store Lake St. Louis, MO",
    description: "St. Louis's premier Kawai piano dealer. Visit our Lake St. Louis showroom for expert piano services, Shigeru Kawai grands, and digital pianos. Serving Missouri since 1927.",
    type: "website",
    locale: "en_US",
    siteName: "Kawai Piano Gallery St. Louis",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kawai Piano Dealer St. Louis | Piano Store Lake St. Louis, MO",
    description: "St. Louis's premier Kawai piano dealer in Lake St. Louis, MO. Expert piano services and premium instruments.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#e21d30", // Kawai Red
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "MusicStore",
    "name": "Kawai Piano Gallery St. Louis",
    "description": "Premier Kawai piano dealer in St. Louis serving Lake St. Louis, Missouri with expert piano services, Shigeru Kawai grand pianos, digital pianos, and hybrid pianos since 1927.",
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
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${crimsonText.variable} antialiased bg-white text-gray-900`}
      >
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
