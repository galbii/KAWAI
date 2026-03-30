import type { Metadata } from "next";
import { Suspense } from "react";
import { HeaderDynamic } from "@/components/layout/header-dynamic";
import { FooterDynamic } from "@/components/layout/footer-dynamic";
import { AnnouncementBarWrapper } from "@/components/layout/AnnouncementBarWrapper";
import { LayoutSpacer } from "@/components/layout/LayoutSpacer";
import { NavigationContextProvider } from "@/contexts/NavigationContext";
import type { NavigationOrigin } from "@/lib/navigation-utils";
import { AdminBarProvider } from "@/contexts/AdminBarContext";
import { AdminBar } from "@/components/layout/AdminBar";
import { headers, cookies } from 'next/headers';
import { organizationSchema, featuredProductsSchema } from "@/lib/seo/schemas";
import { UTMCapture } from "@/components/analytics/UTMCapture";
import { DealerDimensionTracker } from "@/components/analytics/DealerDimensionTracker";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";

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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
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

  // Derive initial dealer context from cookie + pathname so the first client
  // render matches the server render (no flash of un-branded → dealer header).
  const [headersList, cookieStore] = await Promise.all([headers(), cookies()])
  const pathname = headersList.get('x-pathname') || '/'
  const cookieDealerSlug = cookieStore.get('kawai-dealer-slug')?.value
  const pathDealerSlug = pathname.startsWith('/store/') ? pathname.split('/')[2] : undefined
  const dealerSlug = pathDealerSlug ?? cookieDealerSlug

  const initialOrigin: NavigationOrigin = dealerSlug
    ? { basePath: `/store/${dealerSlug}`, isDealerLocation: true, dealerSlug }
    : { basePath: '/', isDealerLocation: false }

  // Check if this is any NAMM 2026 page (has its own custom header/footer)
  const isNAMMPage = pathname.startsWith('/namm-2026')

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaipianos.com';

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Kawai Piano Gallery",
    "url": siteUrl,
    "description": "Official authorized Kawai Piano dealer. Explore grand pianos, digital pianos, upright pianos, and exclusive Shigeru Kawai concert grands.",
    "publisher": {
      "@type": "Organization",
      "name": "Kawai Piano Gallery"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/pianos/search?q={search_term_string}`
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
    <AdminBarProvider>
      <AdminBar />
      <NavigationContextProvider initialOrigin={initialOrigin}>
      {/* WebSite Schema for sitelinks search box */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
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
      <div className="flex min-h-screen flex-col m-0 p-0">
        {!isNAMMPage && <AnnouncementBarWrapper />}
        {!isNAMMPage && <HeaderDynamic />}
        {!isNAMMPage && <LayoutSpacer />}
        <main className="flex-1 m-0 p-0">
          {children}
        </main>
        {!isNAMMPage && <FooterDynamic />}
      </div>
      <Suspense fallback={null}>
        <UTMCapture />
      </Suspense>
      <DealerDimensionTracker />
      <CookieConsentBanner />
    </NavigationContextProvider>
    </AdminBarProvider>
  )
}
