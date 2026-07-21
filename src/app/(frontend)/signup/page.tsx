import type { Metadata } from 'next'
import { getSite, getSiteUrl, getSiteAlternates } from '@/lib/site-context'
import { getRebateShowcase } from '@/lib/payload/queries'
import SignupScroll from './_components/SignupScroll'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()
  const url = getSiteUrl(site) + '/signup'
  return {
    title: 'Sign Up | Kawai',
    description:
      'Join the Kawai community. Sign up to stay connected with the latest from three generations of innovative piano craftsmanship.',
    alternates: {
      canonical: url,
      languages: getSiteAlternates('/signup'),
    },
    openGraph: {
      type: 'website',
      url,
      siteName: 'KAWAI',
      title: 'Sign Up | Kawai',
      description:
        'Join the Kawai community. Sign up to stay connected with the latest from Kawai.',
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
      title: 'Sign Up | Kawai',
      description: 'Join the Kawai community.',
      images: ['/images/banners/GX-7-BLAK-grand-styling.webp'],
    },
  }
}

export default async function SignupPage() {
  const site = await getSite()
  const rebateData = await getRebateShowcase(site)
  return <SignupScroll rebateData={rebateData} site={site} />
}
