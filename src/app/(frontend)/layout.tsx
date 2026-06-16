import type { Metadata } from "next";
import { getSite, getSiteName, getSiteUrl, getSiteAlternates } from '@/lib/site-context'
import { Suspense } from "react";
import { HeaderDynamic } from "@/components/layout/header-dynamic";
import { FooterDynamic } from "@/components/layout/footer-dynamic";
import { AnnouncementBarWrapper } from "@/components/layout/AnnouncementBarWrapper";
import { LayoutSpacer } from "@/components/layout/LayoutSpacer";
import { NavigationContextProvider } from "@/contexts/NavigationContext";
import { PageHistoryProvider } from "@/contexts/PageHistoryContext";
import type { NavigationOrigin } from "@/lib/navigation-utils";
import { AdminBarProvider } from "@/contexts/AdminBarContext";
import { organizationSchema, featuredProductsSchema } from "@/lib/seo/schemas";
import { UTMCapture } from "@/components/analytics/UTMCapture";
import { DealerDimensionTracker } from "@/components/analytics/DealerDimensionTracker";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { ConditionalFooterWrapper } from "@/components/layout/ConditionalFooterWrapper";
import { DealerPageLayoutWrapper } from "@/components/layout/DealerPageLayoutWrapper";
import { NammAwareShell } from "@/components/layout/NammAwareShell";
// ClientOnlyOverlays defers NavigationProgress + AdminBar with ssr:false inside a
// 'use client' file (required by Next.js App Router for dynamic with ssr:false).
import { ClientOnlyOverlays } from "@/components/layout/ClientOnlyOverlays";
import { PageTransition } from "@/components/layout/PageTransition";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()
  const siteUrl = getSiteUrl(site)
  const siteName = getSiteName(site)
  return {
    metadataBase: new URL(siteUrl),
    title: `Kawai Piano Store | Authorized Kawai Piano Dealer | Grand, Digital & Upright Pianos`,
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
    authors: [{ name: siteName }],
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/favicon.ico',
    },
    alternates: {
      canonical: siteUrl,
      languages: getSiteAlternates('/'),
    },
    openGraph: {
      title: "Kawai Piano Store | Authorized Dealer | Grand, Digital & Upright Pianos",
      description: "Official Kawai Piano authorized dealer. Explore premium grand pianos, digital pianos, upright pianos, and exclusive Shigeru Kawai concert grands. Expert consultation and 95+ years of Japanese craftsmanship.",
      type: "website",
      locale: site === 'cad' ? 'en_CA' : 'en_US',
      siteName,
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
  }
}

export default async function FrontendLayout(props: { children: React.ReactNode }) {
  const { children } = props

  // Static initial origin — NavigationContextProvider populates dealer context
  // client-side from sessionStorage after hydration (see NavigationContext.tsx).
  // All components that branch on isDealerLocation already use a mounted guard,
  // so the server render is always the non-dealer default regardless.
  const initialOrigin: NavigationOrigin = { basePath: '/', isDealerLocation: false }

  // Domain-aware schema: kawaius.com → "Kawai America", ca.kawaius.com → "Kawai Canada".
  // generateMetadata above already awaits getSite(), so the layout is already
  // dynamic — adding another await here doesn't change rendering behavior.
  const site = await getSite()
  const siteUrl = getSiteUrl(site)
  const siteName = getSiteName(site)

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "url": siteUrl,
    "description": "Official authorized Kawai Piano dealer. Explore grand pianos, digital pianos, upright pianos, and exclusive Shigeru Kawai concert grands.",
    "publisher": {
      "@type": "Organization",
      "name": siteName
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
      <ClientOnlyOverlays />
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
      <PageHistoryProvider>
      <DealerPageLayoutWrapper>
        <NammAwareShell
          announcementBar={
            <Suspense fallback={null}>
              <AnnouncementBarWrapper />
            </Suspense>
          }
          header={
            <Suspense fallback={null}>
              <HeaderDynamic />
            </Suspense>
          }
          layoutSpacer={<LayoutSpacer />}
        >
          <main className="flex-1 m-0 p-0">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <ConditionalFooterWrapper>
            <Suspense fallback={null}>
              <FooterDynamic />
            </Suspense>
          </ConditionalFooterWrapper>
        </NammAwareShell>
      </DealerPageLayoutWrapper>
      <Suspense fallback={null}>
        <UTMCapture />
      </Suspense>
      <DealerDimensionTracker />
      <CookieConsentBanner />
      </PageHistoryProvider>
    </NavigationContextProvider>
    </AdminBarProvider>
  )
}
