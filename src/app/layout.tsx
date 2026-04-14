import type { Metadata, Viewport } from "next";
import { getSite, getSiteName, getSiteUrl } from '@/lib/site-context'
import { Inter, Crimson_Text, Playfair_Display, Cormorant_Garamond, Noto_Sans } from "next/font/google";
import { GoogleTagManager } from '@next/third-parties/google';
import Script from 'next/script';
import { Suspense } from 'react';
import { PHProvider } from './providers'
import { CartProvider } from '@/contexts/CartContext'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import PageViewTracker from '../components/PageViewTracker'
import "./globals.css";

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
  preload: false,
});

// Luxury display font for special brand messaging
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-buena-park",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  preload: false,
});

// Refined serif for artist carousel headings - Japanese-inspired elegance
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  preload: false,
});

// Clean sans-serif for artist carousel subheadings
const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto",
  display: "swap",
  weight: ["300", "400", "500", "600"],
  preload: false,
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()
  const name = getSiteName(site)
  return {
    metadataBase: new URL(getSiteUrl(site)),
    title: {
      template: `%s | ${name}`,
      default: name,
    },
    openGraph: {
      siteName: name,
    },
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1E1B16", // Kawai Black - matches footer background
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="preload"
          as="video"
          href="/assets/videos/Hero_compressed.mp4"
          type="video/mp4"
        />
      </head>
      <body className={`${inter.variable} ${crimsonText.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable} ${notoSans.variable} antialiased bg-kawai-black text-kawai-pearl`}>
        {/* GA4 Consent Mode v2 — must run before GTM so tags use the correct defaults.
            Reads vanilla-cookieconsent's saved cookie synchronously so returning visitors
            who already accepted don't have their pageview dropped by the 500ms race. */}
        <Script
          id="gtag-consent-defaults"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}

              // Read vanilla-cookieconsent's saved cookie (cc_cookie) synchronously.
              // This runs before GTM so returning visitors get correct consent immediately.
              var _ccCookie = (document.cookie.match(/(?:^|;\\s*)cc_cookie=([^;]*)/) || [])[1];
              var _ccData = null;
              try { _ccData = _ccCookie ? JSON.parse(decodeURIComponent(_ccCookie)) : null; } catch(e) {}
              var _analyticsAccepted = _ccData && Array.isArray(_ccData.categories) && _ccData.categories.indexOf('analytics') !== -1;
              var _marketingAccepted = _ccData && Array.isArray(_ccData.categories) && _ccData.categories.indexOf('marketing') !== -1;

              gtag('consent', 'default', {
                'ad_storage':          _marketingAccepted ? 'granted' : 'denied',
                'ad_user_data':        _marketingAccepted ? 'granted' : 'denied',
                'ad_personalization':  _marketingAccepted ? 'granted' : 'denied',
                'analytics_storage':   _analyticsAccepted ? 'granted' : 'denied',
                'wait_for_update':     _ccData ? 0 : 2000
              });
            `,
          }}
        />
        <GoogleTagManager gtmId="GTM-MGQR7XXS" />
        <NuqsAdapter>
          <PHProvider>
            <CartProvider>
              <Suspense fallback={null}>
                <PageViewTracker />
              </Suspense>
              {children}
            </CartProvider>
          </PHProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
