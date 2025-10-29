import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLandingPageData } from "@/lib/payload";

// Generate dynamic metadata based on landing page and dealer location data
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string; campaignSlug: string }> 
}): Promise<Metadata> {
  try {
    const { slug: dealerSlug, campaignSlug } = await params;
    const landingPageData = await getLandingPageData(dealerSlug, campaignSlug);
    
    if (!landingPageData) {
      return {
        title: 'Campaign Not Found',
        description: 'The requested campaign landing page could not be found.',
        robots: { index: false, follow: false }
      };
    }

    const { seo, landingPage, dealerLocation } = landingPageData;
    
    // Combine campaign and dealer location info for comprehensive SEO
    const campaignTitle = landingPage?.title || 'Special Campaign';
    const dealerName = dealerLocation?.locationName || 'Piano Gallery';
    const campaignType = landingPage?.campaignType || 'promotional-sale';
    
    const finalTitle = seo?.metaTitle || `${campaignTitle} | ${dealerName}`;
    const finalDescription = seo?.metaDescription || 
      `${campaignTitle} - Exclusive ${campaignType.replace('-', ' ')} from ${dealerName}. Premium Kawai pianos with special pricing and expert consultation.`;
    
    // Build comprehensive keywords combining campaign, dealer, and context
    const baseKeywords = [
      campaignTitle.toLowerCase(),
      dealerName,
      campaignType.replace('-', ' '),
      'piano campaign',
      'piano sale',
      'kawai piano',
      'Piano Gallery',
      'special offer',
      'limited time'
    ];
    
    const campaignKeywords = seo?.keywords ? 
      (typeof seo.keywords === 'string' ? seo.keywords.split(', ') : []) : [];
    const dealerKeywords = dealerLocation?.seo?.keywords ? 
      (typeof dealerLocation.seo.keywords === 'string' ? dealerLocation.seo.keywords.split(', ') : []) : [];
    
    const allKeywords = [
      ...baseKeywords,
      ...campaignKeywords,
      ...dealerKeywords
    ].filter((keyword, index, arr) => 
      keyword && arr.indexOf(keyword) === index // Remove duplicates and empty values
    ).join(', ');

    // Create canonical URL for the campaign
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaipianos.com';
    const canonicalUrl = `${siteUrl}/${dealerSlug}/${campaignSlug}`;

    return {
      title: finalTitle,
      description: finalDescription,
      keywords: allKeywords,
      authors: [{ name: dealerName }],
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: seo?.openGraphTitle || finalTitle,
        description: seo?.openGraphDescription || finalDescription,
        type: "website",
        locale: "en_US",
        siteName: `${dealerName} - Campaign`,
        url: canonicalUrl,
        images: seo?.openGraphImage ? [
          {
            url: typeof seo.openGraphImage === 'string' 
              ? seo.openGraphImage 
              : seo.openGraphImage.url || '',
            width: 1200,
            height: 630,
            alt: `${campaignTitle} - ${dealerName}`
          }
        ] : []
      },
      twitter: {
        card: "summary_large_image",
        title: seo?.openGraphTitle || finalTitle,
        description: seo?.openGraphDescription || finalDescription,
      },
      robots: {
        index: !seo?.noIndex,
        follow: !seo?.noIndex,
        googleBot: {
          index: !seo?.noIndex,
          follow: !seo?.noIndex,
        },
      },
      // Additional meta tags for campaign tracking and context
      other: {
        'campaign-id': landingPage?.id,
        'campaign-type': campaignType,
        'dealer-slug': dealerSlug,
        'campaign-slug': campaignSlug,
        'campaign-start': landingPage?.campaignStartDate || '',
        'campaign-end': landingPage?.campaignEndDate || '',
        'target-audience': landingPage?.targetAudience?.join(', ') || '',
      }
    };
  } catch (error) {
    console.error('Error generating metadata for campaign landing page layout:', error);
    return {
      title: 'Campaign Not Found',
      description: 'The requested campaign landing page could not be found.',
      robots: { index: false, follow: false }
    };
  }
}

// Landing page layout component
export default async function LandingPageLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode;
  params: Promise<{ slug: string; campaignSlug: string }>;
}) {
  const { slug: dealerSlug, campaignSlug } = await params;
  
  // Fetch landing page data for structured data and validation
  let landingPageData: any = null;
  
  try {
    landingPageData = await getLandingPageData(dealerSlug, campaignSlug);
    
    // If landing page doesn't exist or is inactive, show 404
    if (!landingPageData) {
      notFound();
    }
  } catch (error) {
    console.error('Landing page layout fetch error:', error);
    notFound();
  }

  const { landingPage, dealerLocation } = landingPageData;
  
  // Generate structured data for campaign landing pages
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": landingPage?.title || `Campaign - ${dealerLocation?.locationName}`,
    "description": landingPage?.campaignDescription || `Special campaign from ${dealerLocation?.locationName}`,
    "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaipianos.com'}/${dealerSlug}/${campaignSlug}`,
    "mainEntity": {
      "@type": "Event",
      "name": landingPage?.title,
      "startDate": landingPage?.campaignStartDate,
      "endDate": landingPage?.campaignEndDate,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "organizer": {
        "@type": "MusicStore",
        "name": dealerLocation?.locationName,
        "address": dealerLocation?.showroomSection?.showroomInfo?.address,
        "telephone": dealerLocation?.showroomSection?.showroomInfo?.phone,
        "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaipianos.com'}/${dealerSlug}`
      },
      "offers": {
        "@type": "Offer",
        "description": `Special ${landingPage?.campaignType?.replace('-', ' ')} on premium Kawai pianos`,
        "seller": {
          "@type": "MusicStore",
          "name": dealerLocation?.locationName
        }
      }
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaipianos.com'
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": dealerLocation?.locationName,
          "item": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaipianos.com'}/${dealerSlug}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": landingPage?.title,
          "item": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaipianos.com'}/${dealerSlug}/${campaignSlug}`
        }
      ]
    }
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      {/* Campaign-specific head injections */}
      {landingPage?.analyticsIntegrations?.customTrackingCode && (
        <script
          dangerouslySetInnerHTML={{
            __html: landingPage.analyticsIntegrations.customTrackingCode,
          }}
        />
      )}
      
      {/* UTM tracking setup for analytics */}
      {landingPage?.utmParameters && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // UTM Parameter tracking
              if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('config', 'GA_MEASUREMENT_ID', {
                  campaign_source: '${landingPage.utmParameters.source || ''}',
                  campaign_medium: '${landingPage.utmParameters.medium || ''}',
                  campaign_name: '${landingPage.utmParameters.campaign || ''}',
                  campaign_content: '${landingPage.utmParameters.content || ''}',
                  campaign_term: '${landingPage.utmParameters.term || ''}'
                });
              }
            `,
          }}
        />
      )}
      
      {/* Landing page content */}
      {children}
    </>
  );
}