import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Media } from "@/payload-types";

interface DealerLocationData {
  locationName: string;
  heroSection: {
    locationText: string;
    establishedText: string;
    titlePrefix: string;
    titleMain: string;
    titleSuffix: string;
    description: string;
  };
  showroomSection: {
    showroomInfo: {
      name: string;
      address: string;
      phone: string;
      serviceArea: string;
    };
    hours: Array<{
      day: string;
      time: string;
      id?: string | null;
    }>;
  };
  seo: {
    metaTitle?: string | null;
    metaDescription?: string | null;
    keywords?: string | null;
    openGraphTitle?: string | null;
    openGraphDescription?: string | null;
    openGraphImage?: string | Media | null;
  };
}

// Function to fetch just the dealer location metadata we need for the layout
async function getDealerLocationMetadata(slug: string): Promise<DealerLocationData | null> {
  try {
    const payload = await import('payload').then(m => m.getPayload);
    const config = await import('@/payload.config').then(m => m.default);
    const payloadInstance = await payload({ config });
    
    const result = await payloadInstance.find({
      collection: 'dealer-locations',
      where: {
        and: [
          {
            slug: {
              equals: slug
            }
          },
          {
            isActive: {
              equals: true
            }
          }
        ]
      },
      limit: 1,
      depth: 1
    });
    
    if (result.docs.length === 0) {
      return null;
    }
    
    const dealerLocation = result.docs[0];
    
    return {
      locationName: dealerLocation.locationName,
      heroSection: {
        locationText: dealerLocation.locationText,
        establishedText: dealerLocation.establishedText,
        titlePrefix: dealerLocation.titlePrefix,
        titleMain: dealerLocation.titleMain,
        titleSuffix: dealerLocation.titleSuffix,
        description: dealerLocation.description,
      },
      showroomSection: {
        showroomInfo: dealerLocation.showroomInfo || {},
        hours: dealerLocation.hours || [],
      },
      seo: dealerLocation.seo || {}
    };
  } catch (error) {
    console.error('Error fetching dealer location metadata:', error);
    return null;
  }
}

// Generate dynamic metadata based on dealer location data
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const dealerData = await getDealerLocationMetadata(slug);
    
    if (!dealerData) {
      return {
        title: 'Dealer Location Not Found',
        description: 'The requested dealer location could not be found.',
        robots: { index: false, follow: false }
      };
    }

    const { seo, locationName, heroSection, showroomSection } = dealerData;
    
    // Create location-specific titles and descriptions
    const locationTitle = seo.metaTitle || `${locationName} | Kawai Piano Dealer`;
    const locationDescription = seo.metaDescription || 
      `Visit ${locationName} for premium Kawai pianos, expert services, and personalized piano consultation. ${heroSection.description || 'Your trusted Kawai piano dealer.'}`;
    
    // Extract location info from established text or service area for local SEO
    const locationInfo = heroSection.establishedText || 
      showroomSection.showroomInfo.serviceArea;
    
    // Generate location-specific keywords
    const locationKeywords = (typeof seo.keywords === 'string' ? seo.keywords.split(', ') : null) || [
      `${locationName}`,
      'Kawai piano dealer',
      'piano store',
      'piano showroom',
      'digital pianos',
      'grand pianos',
      'piano services',
      'piano lessons',
      locationInfo
    ];

    return {
      title: locationTitle,
      description: locationDescription,
      keywords: locationKeywords.join(', '),
      authors: [{ name: locationName }],
      openGraph: {
        title: seo.openGraphTitle || locationTitle,
        description: seo.openGraphDescription || locationDescription,
        type: "website",
        locale: "en_US",
        siteName: locationName,
        images: seo.openGraphImage ? [
          {
            url: typeof seo.openGraphImage === 'string' 
              ? seo.openGraphImage 
              : seo.openGraphImage.url || ''
          }
        ] : []
      },
      twitter: {
        card: "summary_large_image",
        title: seo.openGraphTitle || locationTitle,
        description: seo.openGraphDescription || locationDescription,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for dealer location layout:', error);
    return {
      title: 'Dealer Location Not Found',
      description: 'The requested dealer location could not be found.',
      robots: { index: false, follow: false }
    };
  }
}

// Nested layout for dealer location pages
export default async function DealerLocationLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  // Await params to get the slug
  const { slug } = await params;
  
  // Fetch dealer location data for the layout
  let dealerData: DealerLocationData | null = null;
  
  try {
    dealerData = await getDealerLocationMetadata(slug);
    
    // If dealer location doesn't exist or is inactive, show 404
    if (!dealerData) {
      notFound();
    }
  } catch (error) {
    console.error('Dealer location layout fetch error:', error);
    // If there's a fetch error, show 404 as well since we can't determine if location exists
    notFound();
  }

  // Generate local business schema for this specific dealer location
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "MusicStore",
    "name": dealerData.locationName,
    "description": `${dealerData.locationName} - ${dealerData.heroSection.description || 'Premier Kawai piano dealer offering expert piano services, sales, and consultation.'}`,
    "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaipianostlouis.com'}/${slug}`,
    "telephone": dealerData.showroomSection.showroomInfo.phone || "",
    "address": dealerData.showroomSection.showroomInfo.address ? {
      "@type": "PostalAddress",
      "streetAddress": dealerData.showroomSection.showroomInfo.address,
      "addressCountry": "US"
    } : undefined,
    "openingHours": dealerData.showroomSection.hours.map(hour => 
      `${hour.day} ${hour.time}`
    ),
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
            "name": "Piano Services & Consultation"
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
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <>
        {children}
      </>
    </>
  );
}