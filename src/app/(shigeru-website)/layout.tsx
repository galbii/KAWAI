import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'),
  title: {
    default: 'Shigeru Kawai Grand Pianos | Premier Handcrafted Pianos of Japan',
    template: '%s | Shigeru Kawai',
  },
  description:
    'Shigeru Kawai grand pianos are the pinnacle of Japanese piano craftsmanship. Handcrafted in Hamamatsu, Japan. Explore the SK-2 through SK-EX concert grand — fewer than 20 SK-EX instruments are made each year.',
  keywords: [
    'shigeru kawai',
    'shigeru kawai piano',
    'shigeru kawai grand piano',
    'shigeru kawai sk-ex',
    'shigeru kawai sk-7',
    'shigeru kawai sk-6',
    'shigeru kawai sk-5',
    'shigeru kawai sk-3',
    'shigeru kawai sk-2',
    'shigeru kawai concert grand',
    'shigeru kawai price',
    'shigeru kawai dealer',
    'shigeru kawai for sale',
    'premier piano japan',
    'handcrafted grand piano',
    'japanese concert grand piano',
    'kawai shigeru piano',
    'sk-ex concert grand piano',
    'luxury grand piano',
    'master piano artisan',
  ],
  authors: [{ name: 'Kawai Piano Gallery' }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'Shigeru Kawai Grand Pianos | Premier Handcrafted Pianos of Japan',
    description:
      'Fewer than 20 SK-EX concert grands are handcrafted each year. Discover all six Shigeru Kawai models — from the SK-2 salon grand to the SK-EX concert grand.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Shigeru Kawai at Kawai Piano Gallery',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shigeru Kawai Grand Pianos',
    description:
      'The premier piano of Japan. Handcrafted. Elegance. Excellence. Six models from SK-2 to SK-EX.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'}/shigeru`,
  },
}

// JSON-LD structured data for the Shigeru Kawai brand
const shigeruOrganizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Brand',
  name: 'Shigeru Kawai',
  description:
    'Shigeru Kawai grand pianos represent the pinnacle of Japanese piano craftsmanship. Handcrafted at the Ryuyo Grand Piano Factory in Hamamatsu, Japan, each instrument is a limited-edition treasure built to the exacting standards of Shigeru Kawai himself.',
  url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'}/shigeru`,
  logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'}/images/shigeru-kawai-logo.png`,
  founder: {
    '@type': 'Person',
    name: 'Shigeru Kawai',
    birthDate: '1922-07-28',
    birthPlace: 'Shizuoka Prefecture, Japan',
    description:
      'Shigeru Kawai succeeded his father Koichi Kawai as president of Kawai Musical Instruments in 1955 and introduced the Shigeru Kawai premium piano line in 1999.',
  },
  foundingDate: '1999',
  areaServed: 'Worldwide',
  parentOrganization: {
    '@type': 'Organization',
    name: 'Kawai Musical Instruments',
    url: 'https://kawaius.com',
  },
}

const shigeruProductListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Shigeru Kawai Grand Piano Models',
  description: 'The complete collection of six Shigeru Kawai handcrafted grand pianos.',
  url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'}/shigeru`,
  numberOfItems: 6,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'Product',
        name: 'Shigeru Kawai SK-2',
        description:
          'The Classic Salon Grand — 5 feet 11 inches. The first model in the premium Shigeru Kawai line. Rivals any premium piano of its class.',
        brand: { '@type': 'Brand', name: 'Shigeru Kawai' },
        model: 'SK-2',
        category: 'Grand Piano',
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'Product',
        name: 'Shigeru Kawai SK-3',
        description:
          'The Conservatory Grand — 6 feet 2 inches. Regarded as some of the finest pianos available. Admired by world-class pianists across the globe.',
        brand: { '@type': 'Brand', name: 'Shigeru Kawai' },
        model: 'SK-3',
        category: 'Grand Piano',
      },
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@type': 'Product',
        name: 'Shigeru Kawai SK-5',
        description:
          'The Chamber Grand — 6 feet 7 inches. Perfect fusion of robust tone, power, and presence for stately homes and professional venues.',
        brand: { '@type': 'Brand', name: 'Shigeru Kawai' },
        model: 'SK-5',
        category: 'Grand Piano',
      },
    },
    {
      '@type': 'ListItem',
      position: 4,
      item: {
        '@type': 'Product',
        name: 'Shigeru Kawai SK-6',
        description:
          'The Orchestra Grand — 7 feet even. Stability, consistent touch, and a rich, well-rounded tone. Each new owner receives an MPA in-home visit.',
        brand: { '@type': 'Brand', name: 'Shigeru Kawai' },
        model: 'SK-6',
        category: 'Grand Piano',
      },
    },
    {
      '@type': 'ListItem',
      position: 5,
      item: {
        '@type': 'Product',
        name: 'Shigeru Kawai SK-7',
        description:
          'The Semi-Concert Grand — 7 feet 6 inches. Second only to the SK-EX in full-bodied tone and exceptional dynamic range.',
        brand: { '@type': 'Brand', name: 'Shigeru Kawai' },
        model: 'SK-7',
        category: 'Grand Piano',
      },
    },
    {
      '@type': 'ListItem',
      position: 6,
      item: {
        '@type': 'Product',
        name: 'Shigeru Kawai SK-EX',
        description:
          'The Concert Grand — 9 feet 1 inch. Fewer than 20 are handcrafted each year. The pinnacle of the Shigeru Kawai range and a common choice at international piano competitions.',
        brand: { '@type': 'Brand', name: 'Shigeru Kawai' },
        model: 'SK-EX',
        category: 'Grand Piano',
      },
    },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a Shigeru Kawai piano?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shigeru Kawai pianos are a premium line of handcrafted grand pianos made by Kawai Musical Instruments, introduced in 1999 and named after company president Shigeru Kawai. They are built at the Ryuyo Grand Piano Factory in Hamamatsu, Japan — the world\'s first ISO14001-certified piano factory. The line includes six models from the SK-2 salon grand to the SK-EX concert grand.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does a Shigeru Kawai piano cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shigeru Kawai pianos range from approximately $18,900 for the SK-2 salon grand to over $200,000 for the SK-EX concert grand. Each piano is handcrafted and limited in production. Contact an authorized dealer for current pricing.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where are Shigeru Kawai pianos made?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shigeru Kawai pianos are handcrafted exclusively at the Ryuyo Grand Piano Factory in Hamamatsu, Japan. The factory was completed by Shigeru Kawai in 1980 and received ISO14001 environmental certification in 1997 — the first piano factory in the world to do so.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between Shigeru Kawai and regular Kawai pianos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shigeru Kawai pianos are the ultra-premium handcrafted line from Kawai, built to concert-grade standards with hand-selected materials including Kigarashi naturally aged soundboards, Shiko Seion hammers made without artificial hardeners, and Temaki hand-wound bass strings. Each piano is voiced by a Master Piano Artisan and takes 3–5 times longer to build than a standard piano.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many SK-EX concert grands are made each year?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Fewer than 20 Shigeru Kawai SK-EX concert grand pianos are handcrafted each year, making each one a rare and highly sought-after instrument. The SK-EX has been chosen by all finalists at the Sendai International Piano Competition.',
      },
    },
  ],
}

const navLinks = [
  { label: 'Grand Pianos', href: '/shigeru/models' },
  { label: 'Artists', href: '/shigeru/artists' },
  { label: 'About', href: '/shigeru/about' },
  { label: 'Technology', href: '/shigeru/technology' },
  { label: 'Institutions', href: '/shigeru/institutions' },
  { label: 'Find a Dealer', href: '/shigeru/dealers' },
]

const footerLinks = [
  ...navLinks,
  { label: 'Contact', href: '/shigeru/contact' },
]

export default function ShigeruLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(shigeruOrganizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(shigeruProductListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Standalone Shigeru Kawai header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5"
        style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.95) 0%, transparent 100%)' }}
      >
        <Link
          href="/shigeru"
          className="flex flex-col items-start"
          aria-label="Shigeru Kawai — Home"
        >
          <span
            className="text-kawai-gold text-[9px] tracking-[0.5em] uppercase leading-none"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Shigeru
          </span>
          <span
            className="text-white text-[11px] tracking-[0.45em] uppercase leading-none mt-0.5"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Kawai
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Shigeru Kawai navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/45 hover:text-white/90 text-[10px] tracking-[0.25em] uppercase transition-colors duration-200"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/shigeru/contact"
          className="hidden sm:inline-flex border border-kawai-gold/30 hover:border-kawai-gold text-kawai-gold text-[9px] tracking-[0.3em] uppercase px-5 py-2.5 transition-all duration-200 hover:bg-kawai-gold/5"
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          Inquire
        </Link>
      </header>

      <main className="flex-1">{children}</main>

      {/* Shigeru Kawai footer */}
      <footer className="bg-[#0a0a0a] border-t border-white/[0.04]">
        {/* Footer nav links */}
        <div className="flex items-center justify-center gap-8 px-8 py-8 flex-wrap">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/25 hover:text-white/60 text-[9px] tracking-[0.3em] uppercase transition-colors duration-200"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between px-8 pb-8 gap-4">
          <span
            className="text-kawai-gold text-[9px] tracking-[0.4em] uppercase"
            style={{ fontFamily: 'var(--font-brand-sans)', fontVariant: 'small-caps' }}
          >
            Shigeru Kawai
          </span>
          <span
            className="text-white/25 text-[9px] tracking-[0.2em] text-center"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            &copy; 2026 Kawai Musical Instruments. All rights reserved.
          </span>
          <Link
            href="https://kawaius.com"
            className="text-white/20 hover:text-white/50 text-[9px] tracking-[0.3em] uppercase transition-colors duration-200"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            kawaius.com
          </Link>
        </div>
      </footer>
    </>
  )
}
