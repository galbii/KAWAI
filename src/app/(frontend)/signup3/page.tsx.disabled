import type { Metadata } from 'next'
import { getSite, getSiteUrl, getSiteAlternates } from '@/lib/site-context'
import { getRebateShowcase } from '@/lib/payload/queries'
import { CampaignStyles, CampaignNoScript } from '@/components/back-to-school'
import { SignupCampaign } from './_components/SignupCampaign'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()
  const url = getSiteUrl(site) + '/signup3'
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
      languages: getSiteAlternates('/signup3'),
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
  // Server-side only — the browser can't turn staging mode on or off.
  const testMode = process.env.SIGNUP3_TEST_MODE === 'true'

  return (
    <div className="bg-kawai-pearl">
      {/* One style block for the whole campaign — the type scale, the hero's
          entrance keyframes, and the scroll-reveal transitions. Shared with
          /store/[storeslug]/back-to-school so the two pages cannot drift. */}
      <CampaignStyles />
      <CampaignNoScript />
      <SignupCampaign rebateData={rebateData} site={site} testMode={testMode} />
    </div>
  )
}
