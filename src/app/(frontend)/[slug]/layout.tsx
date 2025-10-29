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
    const storefrontData = await getStorefrontMetadata(slug);

    if (!storefrontData) {
      return {
        title: 'Storefront Location Not Found',
        description: 'The requested storefront location could not be found.',
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

// Nested layout for storefront pages
export default async function StorefrontLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  // Await params to get the slug
  const { slug } = await params;

  // Fetch storefront data for the layout
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