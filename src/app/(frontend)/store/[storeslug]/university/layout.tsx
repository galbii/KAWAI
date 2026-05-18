import type { Metadata } from "next";
import { Barlow_Condensed, Comforter_Brush, Inter } from "next/font/google";
import { WebVitals } from "./_components/WebVitals";
import Script from "next/script";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-tcu-display",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  style: ["normal"],
  display: "swap",
});

const comforterBrush = Comforter_Brush({
  variable: "--font-tcu-script",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'),
  title: "Piano Sale Fort Worth | KAWAI Piano Deals | TCU Event May 2026",
  description: "Fort Worth piano sale at Texas Christian University featuring KAWAI digital & acoustic pianos. Save up to $6,000. TCU partnership May 28–31, 2026 at Boschini Music Center. Free delivery!",
  icons: {
    apple: '/images/optimized/logos/Kawai-Red.webp',
  },
  openGraph: {
    title: "Piano Sale Fort Worth | KAWAI Piano Deals | TCU Event May 2026",
    description: "Fort Worth piano sale at Texas Christian University featuring KAWAI digital & acoustic pianos. Save up to $6,000. TCU partnership May 28–31, 2026 at Boschini Music Center. Free delivery!",
    images: [
      {
        url: '/images/optimized/misc/kawai-piano-hands_1200.webp',
        width: 1200,
        height: 630,
        alt: 'KAWAI Piano Sales Event - Premium Piano Collection',
      },
    ],
    type: 'website',
  },
};

export default function UniversityLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Calendly Resources - exact format from official docs */}
      <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />

      {/* Google ReCAPTCHA Resources for Calendly */}
      <link rel="preconnect" href="https://www.google.com" />
      <link rel="preconnect" href="https://www.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.google.com/recaptcha/" />
      <link rel="dns-prefetch" href="https://www.gstatic.com/recaptcha/" />

      <div className={`${barlowCondensed.variable} ${comforterBrush.variable} ${inter.variable} antialiased`}>
        {children}
        <WebVitals />

        {/* Calendly JavaScript Preloading
            Note: InlineWidget from react-calendly will use this preloaded script
            Preloading here improves widget initialization performance */}
        <Script
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="afterInteractive"
        />

      </div>
    </>
  );
}
