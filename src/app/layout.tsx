import type { Metadata, Viewport } from "next";
import { Inter, Crimson_Text, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

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

// Luxury serif font for premium headlines
const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Kawai Pianos St. Louis | Premium Piano Dealer | Lake St. Louis, MO",
  description: "Experience 97 years of Japanese craftsmanship with Kawai pianos in St. Louis. Visit our Lake St. Louis showroom for Shigeru Kawai concert grands, digital pianos with Millennium III Action, and expert service. Authorized Kawai dealer serving Missouri since 1927.",
  keywords: "Kawai pianos St. Louis, Kawai piano dealer St. Louis, piano store Lake St. Louis MO, Shigeru Kawai St. Louis, Millennium III Action, Grand Feel III, SK-EX concert grand, digital pianos St. Louis, acoustic pianos Missouri, hybrid pianos St. Louis, piano showroom Lake St. Louis, Kawai piano gallery Missouri",
  authors: [{ name: "Kawai Musical Instruments" }],
  openGraph: {
    title: "Kawai Pianos | Crafting Inspiration Since 1927",
    description: "Experience 97 years of Japanese craftsmanship. From concert halls to living rooms, Kawai pianos unlock the universal language of music.",
    type: "website",
    locale: "en_US",
    siteName: "Kawai Pianos",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kawai Pianos | Crafting Inspiration Since 1927",
    description: "Experience 97 years of Japanese craftsmanship with innovative piano technology.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#e21d30", // Kawai Red
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${crimsonText.variable} ${bodoniModa.variable} antialiased bg-white text-gray-900`}
      >
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
