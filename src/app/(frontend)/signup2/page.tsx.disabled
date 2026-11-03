import type { Metadata } from 'next'
import { getSite, getSiteUrl, getSiteAlternates } from '@/lib/site-context'
import { getRebateShowcase } from '@/lib/payload/queries'
import SignupScroll from './_components/SignupScroll'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()
  const url = getSiteUrl(site) + '/signup2'
  const title = 'Sign Up for Rebates on a Kawai Piano | Find a Dealer'
  const description =
    'Sign up and your nearest Authorized Kawai dealer will reach out with current rebates and savings on your next piano — or find a dealer near you to play in person.'
  return {
    title,
    description,
    // Conversion-test variant of /signup — keep it out of the index so it does
    // not compete with the canonical page for the same queries.
    robots: { index: false, follow: true },
    alternates: {
      canonical: url,
      languages: getSiteAlternates('/signup2'),
    },
    openGraph: {
      type: 'website',
      url,
      siteName: 'KAWAI',
      title,
      description,
      images: [
        {
          url: '/images/banners/GX-7-BLAK-grand-styling.webp',
          width: 1200,
          height: 630,
          alt: 'Kawai GX-7 grand piano',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/banners/GX-7-BLAK-grand-styling.webp'],
    },
  }
}

export default async function SignupPage() {
  const site = await getSite()
  const rebateData = await getRebateShowcase(site)
  return <SignupScroll rebateData={rebateData} site={site} />
}
