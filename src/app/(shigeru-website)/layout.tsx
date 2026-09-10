import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import ShigeruHeader from './_components/ShigeruHeader'
import { footerLinks } from '@/lib/shigeru/nav'
import { SHIGERU_MODELS } from './shigeru/_data/models'
import { getShigeruPageData } from './shigeru/_data/shopify'
import './shigeru.css'

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
  // NOTE: no `alternates.canonical` here — a layout-level canonical cascades to
  // every child page, marking them all as duplicates of /shigeru. Each page
  // sets its own self-referencing canonical via getStaticAlternates().
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

/*
 * The ItemList of the six models used to live here, which emitted it on every
 * /shigeru page — the dealers page, the contact page, all of them — with no
 * URL on any list item. It now lives on /shigeru/models, the one page it
 * actually describes, with a url and an image per model.
 */

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

export default async function ShigeruLayout({ children }: { children: React.ReactNode }) {
  // Same 1h-cached read the homepage collection carousel makes, so the header's
  // grand-piano menu shows the real instruments without a second query.
  const productData = await getShigeruPageData()
  const modelImages = Object.fromEntries(
    SHIGERU_MODELS.map((model) => [
      model.slug,
      productData[model.slug.replace(/-/g, '')]?.imageUrl ?? null,
    ]),
  )

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(shigeruOrganizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Inside .sk-site so shigeru.css's font-size / opacity floors apply to the
          header too — it previously sat outside and silently opted out of them. */}
      <div className="sk-site">
        <ShigeruHeader modelImages={modelImages} />

        <main className="flex-1">{children}</main>

        {/* Shigeru Kawai footer */}
        <footer className="bg-[#0a0a0a] border-t border-white/[0.04]">
        {/* Logo */}
        <div className="flex justify-center pt-12 pb-8">
          <Link href="/shigeru" aria-label="Shigeru Kawai — Home">
            <Image
              src="https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/Shigeru%20Kawai%20logo%20(white).webp"
              alt="Shigeru Kawai"
              width={0}
              height={0}
              sizes="200px"
              className="h-[52px] w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
            />
          </Link>
        </div>

        {/* Footer nav links */}
        <div className="flex items-center justify-center gap-8 px-8 pb-10 flex-wrap">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/35 hover:text-white/70 text-[11px] tracking-[0.25em] uppercase transition-colors duration-200"
              style={{ fontFamily: 'var(--font-oswald)' }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <div className="flex justify-center px-8 pb-10">
          <span
            className="text-white/30 text-[12px] tracking-[0.15em] text-center"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            &copy; 2026 Kawai America Corporation. All rights reserved.
          </span>
        </div>
      </footer>
      </div>
    </>
  )
}
