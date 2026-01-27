import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Media } from "@/payload-types";
import { getHomePageData } from "@/lib/payload";

interface StorefrontData {
  locationName: string;
  slug: string;
  isActive: boolean;
}

// Function to fetch just the basic storefront info needed for the layout
async function getStorefrontMetadata(slug: string): Promise<StorefrontData | null> {
  try {
    const payload = await import('payload').then(m => m.getPayload);
    const config = await import('@/payload.config').then(m => m.default);
    const payloadInstance = await payload({ config });

    const result = await payloadInstance.find({
      collection: 'storefronts',
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
      select: {
        locationName: true,
        slug: true,
        isActive: true
      }
    });
    
    const storefront = result.docs[0];

    if (!storefront) {
      return null;
    }

    return {
      locationName: storefront.locationName,
      slug: storefront.slug,
      isActive: storefront.isActive || false
    };
  } catch (error) {
    console.error('Error fetching storefront metadata:', error);
    return null;
  }
}

// Generate dynamic metadata using HomePage collection SEO data
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;

    // 1. Check if this is a Page from the Pages collection
    try {
      const payload = await import('payload').then(m => m.getPayload);
      const config = await import('@/payload.config').then(m => m.default);
      const payloadInstance = await payload({ config });

      const pageResult = await payloadInstance.find({
        collection: 'pages',
        where: {
          slug: { equals: slug },
          _status: { equals: 'published' }
        },
        limit: 1,
        depth: 0
      });

      // If it's a Page, return empty metadata (page.tsx will handle it)
      if (pageResult.docs.length > 0) {
        return {};
      }
    } catch (error) {
      console.error('Error checking for Page in metadata:', error);
    }

    // 2. If not a Page, handle as Storefront
    const storefrontData = await getStorefrontMetadata(slug);

    if (!storefrontData) {
      return {
        title: 'Page Not Found',
        description: 'The requested page could not be found.',
        robots: { index: false, follow: false }
      };
    }

    // Get SEO data from HomePage collection
    const homePageData = await getHomePageData();
    const seo = homePageData?.seo;

    // Create location-specific titles and descriptions using HomePage SEO data
    const locationTitle = seo?.metaTitle?.replace(/St\. Louis/g, storefrontData.locationName) ||
                         `${storefrontData.locationName} | Kawai Piano Gallery`;
    const locationDescription = seo?.metaDescription?.replace(/St\. Louis/g, storefrontData.locationName) ||
      `Visit ${storefrontData.locationName} for premium Kawai pianos, expert consultation, and personalized piano guidance.`;

    // Generate location-specific keywords
    const baseKeywords = (typeof seo?.keywords === 'string' ? seo.keywords.split(', ') : null) || [
      'Kawai Piano Gallery',
      'piano store',
      'piano showroom',
      'digital pianos',
      'grand pianos',
      'piano services',
      'piano consultation'
    ];

    const locationKeywords = [
      storefrontData.locationName,
      ...baseKeywords
    ];

    return {
      title: locationTitle,
      description: locationDescription,
      keywords: locationKeywords.join(', '),
      authors: [{ name: storefrontData.locationName }],
      openGraph: {
        title: seo?.openGraphTitle?.replace(/St\. Louis/g, storefrontData.locationName) || locationTitle,
        description: seo?.openGraphDescription?.replace(/St\. Louis/g, storefrontData.locationName) || locationDescription,
        type: "website",
        locale: "en_US",
        siteName: storefrontData.locationName,
        images: seo?.openGraphImage ? [
          {
            url: typeof seo.openGraphImage === 'string'
              ? seo.openGraphImage
              : seo.openGraphImage.url || ''
          }
        ] : []
      },
      twitter: {
        card: "summary_large_image",
        title: seo?.openGraphTitle?.replace(/St\. Louis/g, storefrontData.locationName) || locationTitle,
        description: seo?.openGraphDescription?.replace(/St\. Louis/g, storefrontData.locationName) || locationDescription,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for storefront layout:', error);
    return {
      title: 'Storefront Location Not Found',
      description: 'The requested storefront location could not be found.',
      robots: { index: false, follow: false }
    };
  }
}

// Nested layout for storefront pages AND pages collection
export default async function DynamicLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  // Await params to get the slug
  const { slug } = await params;

  // 1. First check if this is a Page from the Pages collection
  try {
    const payload = await import('payload').then(m => m.getPayload);
    const config = await import('@/payload.config').then(m => m.default);
    const payloadInstance = await payload({ config });

    const pageResult = await payloadInstance.find({
      collection: 'pages',
      where: {
        slug: { equals: slug },
        _status: { equals: 'published' }
      },
      limit: 1,
      depth: 0
    });

    // If it's a Page, just render children without storefront logic
    if (pageResult.docs.length > 0) {
      return <>{children}</>;
    }
  } catch (error) {
    console.error('Error checking for Page:', error);
  }

  // 2. If not a Page, handle as Storefront
  let storefrontData: StorefrontData | null = null;

  try {
    storefrontData = await getStorefrontMetadata(slug);

    // If storefront doesn't exist or is inactive, show 404
    if (!storefrontData) {
      notFound();
    }
  } catch (error) {
    console.error('Storefront layout fetch error:', error);
    // If there's a fetch error, show 404 as well since we can't determine if location exists
    notFound();
  }

  // Get homepage data for structured data description
  const homePageData = await getHomePageData();

  // Generate local business schema for this specific storefront
  const businessDescription = homePageData?.heroSection?.description?.replace(/St\. Louis/g, storefrontData.locationName) ||
    `${storefrontData.locationName} - Premier Kawai Piano Gallery offering expert piano consultation, services, and personalized guidance.`;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "MusicStore",
    "name": storefrontData.locationName,
    "description": businessDescription,
    "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaipianos.com'}/${slug}`,
    "brand": "Kawai",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Piano Products & Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "name": "Kawai Grand Pianos",
            "description": "Premium grand pianos featuring the revolutionary Millennium III Carbon Fiber Action for unmatched performance and durability"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "name": "Kawai Digital Pianos",
            "description": "Advanced digital pianos with authentic wooden-key action and world-class piano sound sampling"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "name": "Kawai Upright Pianos",
            "description": "Space-efficient upright pianos delivering rich tone and responsive touch for home and studio"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "name": "Kawai Hybrid Pianos",
            "description": "Revolutionary instruments combining acoustic piano touch with digital versatility"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Piano Services & Consultation",
            "description": "Expert piano consultation, delivery, tuning, and personalized guidance"
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