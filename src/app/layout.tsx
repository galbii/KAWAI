import type { Metadata, Viewport } from "next";
import { getSite, getSiteName, getSiteUrl } from '@/lib/site-context'
import { Inter, Crimson_Text, Playfair_Display, Cormorant_Garamond, Noto_Sans, Oswald, Great_Vibes } from "next/font/google";
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
  display: "optional",
  weight: ["400", "600"],
  style: ["normal", "italic"],
  preload: false,
});

// Luxury display font for special brand messaging
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-buena-park",
  display: "optional",
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
  display: "optional",
  weight: ["300", "400", "500", "600"],
  preload: false,
});

// Elegant flowing script — Grand Spring Sale hero
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-great-vibes",
  display: "swap",
  weight: ["400"],
  preload: false,
});

// Condensed bold display font — primary for Shigeru Kawai microsite
const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
  weight: ["400", "500", "600", "700"],
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
    // meta[name=author] signals content ownership to search engines and AI systems.
    // Used for byline attribution when AI surfaces articles and product content.
    authors: [{ name: 'Kawai America Corporation', url: getSiteUrl(site) }],
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
    // Font variable classes live on <html>, not <body>: the @theme aliases in
    // globals.css (--font-family-cormorant, --font-brand-serif, …) are defined
    // on :root and reference these next/font variables, and a :root-level
    // var() can only resolve variables that are set on <html> itself.
    <html
      lang="en"
      className={`scroll-smooth ${inter.variable} ${crimsonText.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable} ${notoSans.variable} ${oswald.variable} ${greatVibes.variable}`}
    >
      <head>
        <link
          rel="preload"
          as="video"
          href="/assets/videos/Hero_compressed.mp4"
          type="video/mp4"
        />
        {/* Preconnect to high-priority third-party origins — saves one DNS+TCP+TLS
            handshake per domain on first use. crossOrigin="anonymous" is required
            for font origins (CORS). dns-prefetch is used for origins that load
            conditionally (ad/analytics) to avoid holding open unused connections. */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
        <link rel="preconnect" href="https://img.youtube.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://www.facebook.com" />
        <link rel="dns-prefetch" href="https://stats.g.doubleclick.net" />
        <link rel="dns-prefetch" href="https://us.posthog.com" />
      </head>
      <body className="antialiased bg-kawai-black text-kawai-pearl">
        {/* GA4 Consent Mode v2 — must run before GTM so tags use the correct defaults.
            Opt-out model: granted by default worldwide (US/Canada + rest), EXCEPT the
            EEA, UK, and Switzerland where GDPR/UK-GDPR/FADP require prior opt-in — those
            regions default to denied via Consent Mode's native region scoping (Google
            does its own server-side geo, so this is reliable even on edge-cached pages).
            Returning visitors keep their exact saved cookie choice regardless of region. */}
        <Script
          id="gtag-consent-defaults"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}

              // Read vanilla-cookieconsent's saved cookie (cc_cookie) synchronously so
              // returning visitors get their exact prior choice before GTM loads.
              var _ccCookie = (document.cookie.match(/(?:^|;\\s*)cc_cookie=([^;]*)/) || [])[1];
              var _ccData = null;
              try { _ccData = _ccCookie ? JSON.parse(decodeURIComponent(_ccCookie)) : null; } catch(e) {}

              if (_ccData) {
                // Returning visitor — honor their exact saved preference, regardless of region.
                var _analyticsAccepted = Array.isArray(_ccData.categories) && _ccData.categories.indexOf('analytics') !== -1;
                var _marketingAccepted = Array.isArray(_ccData.categories) && _ccData.categories.indexOf('marketing') !== -1;
                gtag('consent', 'default', {
                  'ad_storage':          _marketingAccepted ? 'granted' : 'denied',
                  'ad_user_data':        _marketingAccepted ? 'granted' : 'denied',
                  'ad_personalization':  _marketingAccepted ? 'granted' : 'denied',
                  'analytics_storage':   _analyticsAccepted ? 'granted' : 'denied',
                  'wait_for_update':     0
                });
              } else {
                // New visitor — granted by default worldwide (opt-out model)...
                gtag('consent', 'default', {
                  'ad_storage':         'granted',
                  'ad_user_data':       'granted',
                  'ad_personalization': 'granted',
                  'analytics_storage':  'granted'
                });
                // ...except EEA + UK + Switzerland, where prior opt-in is required.
                gtag('consent', 'default', {
                  'region': ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH'],
                  'ad_storage':         'denied',
                  'ad_user_data':       'denied',
                  'ad_personalization': 'denied',
                  'analytics_storage':  'denied',
                  'wait_for_update':    2000
                });
              }
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
