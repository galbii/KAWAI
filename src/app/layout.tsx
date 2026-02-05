import type { Viewport } from "next";
import { Inter, Crimson_Text, Playfair_Display, Cormorant_Garamond, Noto_Sans } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import { Suspense } from 'react';
import { PHProvider } from './providers'
import { CartProvider } from '@/contexts/CartContext'
import PageViewTracker from '../components/PageViewTracker'
import MetaPixel from '../components/MetaPixel'
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
});

// Luxury display font for special brand messaging
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-buena-park",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// Refined serif for artist carousel headings - Japanese-inspired elegance
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// Clean sans-serif for artist carousel subheadings
const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

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
      <body className={`${inter.variable} ${crimsonText.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable} ${notoSans.variable} antialiased bg-kawai-black text-kawai-pearl`}>
        <PHProvider>
          <CartProvider>
            <Suspense fallback={null}>
              <PageViewTracker />
            </Suspense>
            {children}
          </CartProvider>
        </PHProvider>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <MetaPixel pixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID} />
        )}
      </body>
    </html>
  );
}
