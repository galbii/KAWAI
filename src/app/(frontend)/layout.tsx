import type { Metadata } from "next";
import { HeaderDynamic } from "@/components/layout/header-dynamic";
import { FooterDynamic } from "@/components/layout/footer-dynamic";
import { NavigationContextProvider } from "@/contexts/NavigationContext";
import { parseNavigationOrigin } from "@/lib/navigation-utils";
import { headers } from 'next/headers';
import { organizationSchema, featuredProductsSchema } from "@/lib/seo/schemas";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaipianos.com'),
  title: "Kawai Piano Store | Authorized Kawai Piano Dealer | Grand, Digital & Upright Pianos",
  description: "Official Kawai Piano authorized dealer. Explore premium grand pianos, digital pianos, upright pianos, and exclusive Shigeru Kawai concert grands. Expert piano consultation, competitive prices, and 95+ years of Japanese craftsmanship. Browse our complete Kawai piano collection.",
  keywords: [
    "kawai piano",
    "kawai pianos",
    "kawai piano store",
    "kawai piano gallery",
    "kawai piano dealer",
    "authorized kawai dealer",
    "kawai piano for sale",
    "kawai piano price",
    "kawai grand piano",
    "kawai digital piano",
    "kawai upright piano",
    "shigeru kawai",
    "shigeru kawai piano",
    "kawai piano dealer near me",
    "kawai pianos near me",
    "kawai piano review",
    "best piano brands",
    "japanese piano",
    "piano store",
    "piano gallery",
    "piano dealer",
    "buy kawai piano",
    "kawai piano models",
    "kawai acoustic piano",
    "kawai hybrid piano"
  ],
  authors: [{ name: "Kawai Piano Gallery" }],
  openGraph: {
    title: "Kawai Piano Store | Authorized Dealer | Grand, Digital & Upright Pianos",
    description: "Official Kawai Piano authorized dealer. Explore premium grand pianos, digital pianos, upright pianos, and exclusive Shigeru Kawai concert grands. Expert consultation and 95+ years of Japanese craftsmanship.",
    type: "website",
    locale: "en_US",
    siteName: "Kawai Piano Gallery",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kawai Piano Store | Authorized Dealer",
    description: "Official Kawai Piano dealer. Grand pianos, digital pianos, upright pianos, and Shigeru Kawai concert grands. 95+ years of Japanese craftsmanship.",
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
    "name": "Kawai Piano Gallery",
    "description": "Official authorized Kawai Piano dealer offering expert piano consultation, Shigeru Kawai grand pianos, digital pianos, upright pianos, and hybrid pianos. Over 95 years of Japanese craftsmanship excellence.",
    "url": "https://kawaipianostlouis.com",
    "brand": {
      "@type": "Brand",
      "name": "Kawai"
    },
    "priceRange": "$$-$$$$",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Kawai Piano Products & Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Kawai Grand Pianos",
            "description": "Premium acoustic grand pianos including Shigeru Kawai concert grands"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Kawai Digital Pianos",
            "description": "Advanced digital pianos with authentic sound and touch"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Kawai Upright Pianos",
            "description": "Space-saving upright pianos with exceptional tone quality"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Kawai Hybrid Pianos",
            "description": "Innovative hybrid pianos combining acoustic and digital technology"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Piano Consultation Services",
            "description": "Expert guidance to help you find the perfect Kawai piano"
          }
        }
      ]
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Kawai Piano Gallery",
    "url": "https://kawaipianostlouis.com",
    "description": "Official authorized Kawai Piano dealer. Explore grand pianos, digital pianos, upright pianos, and exclusive Shigeru Kawai concert grands.",
    "publisher": {
      "@type": "Organization",
      "name": "Kawai Piano Gallery"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://kawaipianostlouis.com/pianos/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "about": {
      "@type": "Brand",
      "name": "Kawai",
      "description": "Premium Japanese piano manufacturer with over 95 years of craftsmanship excellence"
    }
  };

  return (
    <NavigationContextProvider initialOrigin={initialOrigin}>
      {/* WebSite Schema for sitelinks search box */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
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
