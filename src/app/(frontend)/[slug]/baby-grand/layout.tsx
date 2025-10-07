import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Baby Grand Signature Collection | Kawai Pianos',
  description: 'Discover the exclusive Baby Grand Signature Collection featuring premium Kawai baby grand pianos curated for discerning musicians. Experience world-class craftsmanship with personalized consultation and expert guidance. Reserve your private appointment today.',
  keywords: [
    'kawai signature',
    'baby grand pianos',
    'exclusive collection',
    'premium pianos',
    'luxury pianos',
    'private consultation',
    'kawai baby grand',
    'signature collection',
    'premium piano collection',
    'baby grand event'
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Baby Grand Signature Collection | Kawai Pianos',
    description: 'Experience the exclusive Baby Grand Signature Collection featuring premium Kawai baby grand pianos. Private consultation and personalized guidance for discerning musicians.',
    url: 'https://kawaipianogallery.com/baby-grand/signature',
    siteName: 'Kawai Piano Gallery',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Baby Grand Signature Collection | Kawai Pianos',
    description: 'Experience the exclusive Baby Grand Signature Collection featuring premium Kawai baby grand pianos. Private consultation available.',
  },
  alternates: {
    canonical: 'https://kawaipianogallery.com/baby-grand/signature',
  },
};

// Layout for baby grand signature page
export default function BabyGrandSignatureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Local business schema for baby grand signature collection
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "MusicStore",
    "name": "Baby Grand Signature Collection",
    "description": "Premier Kawai Piano Gallery offering expert piano consultation, exclusive baby grand signature collection, and personalized guidance for discerning musicians.",
    "url": "https://kawaipianogallery.com/baby-grand/signature",
    "brand": "Kawai",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Baby Grand Signature Collection & Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Kawai Signature Baby Grand Pianos"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Premium Kawai Baby Grand Collection"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Private Piano Consultation & Expert Guidance"
          }
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(businessSchema),
        }}
      />
      {children}
    </>
  );
}
