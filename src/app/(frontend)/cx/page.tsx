import type { Metadata } from 'next'
import { getSite, getSiteUrl, getSiteName, getSiteAlternates } from '@/lib/site-context'
import { CxLanding } from './CxLanding'
import './cx.css'

const TITLE = "KAWAI CX Line — The Piano Maker's Digital Piano"
const DESCRIPTION =
  'The Kawai CX Line digital pianos (CX102 & CX202) bring the Responsive Hammer Compact II action and Shigeru Kawai SK-EX concert grand sound home. Nearly a century of piano craft, under your fingers.'
const OG_IMAGE = '/images/cx/scene.jpg'

export const revalidate = 3600 // Static campaign page; refresh hourly.

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()
  const siteUrl = getSiteUrl(site)
  const siteName = getSiteName(site)
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: {
      canonical: `${siteUrl}/cx`,
      languages: getSiteAlternates('/cx'),
    },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: `${siteUrl}/cx`,
      type: 'website',
      siteName,
      locale: site === 'cad' ? 'en_CA' : 'en_US',
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Kawai CX Line digital pianos' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: TITLE,
      description: DESCRIPTION,
    },
    robots: { index: true, follow: true },
  }
}

export default function CxPage() {
  return <CxLanding />
}
