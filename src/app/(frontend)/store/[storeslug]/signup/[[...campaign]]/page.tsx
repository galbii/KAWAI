import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  getSignupCampaignsForStore,
  getAllSignupCampaignParams,
  getStorefrontBySlugDirect,
  getMusicSchoolByStorefrontSlug,
} from '@/lib/payload/queries'
import { resolveCampaign, type ResolvableCampaign } from '@/lib/signup/resolve'
import { getSiteAlternates } from '@/lib/site-context'
import { SignupLockup } from '@/components/signup/SignupLockup'
import { SignupHero } from '@/components/signup/SignupHero'
import { SignupBlocks } from '@/components/signup/SignupBlocks'
import { SignupEndedPanel } from '@/components/signup/SignupEndedPanel'
import { SignupRail } from '@/components/signup/SignupRail'
import { SignupMobileBar } from '@/components/signup/SignupMobileBar'
import type { SignupQuestion } from '@/lib/signup/types'

export const revalidate = 3600
export const dynamicParams = true

type Params = { storeslug: string; campaign?: string[] }

export async function generateStaticParams() {
  return getAllSignupCampaignParams()
}

/** Shared by generateMetadata and the page so resolution happens once per shape. */
async function resolve(params: Params) {
  const [storefront, campaigns] = await Promise.all([
    getStorefrontBySlugDirect(params.storeslug),
    getSignupCampaignsForStore(params.storeslug),
  ])

  const slug = params.campaign?.[0] ?? null
  const resolution = resolveCampaign(
    campaigns.map((c) => ({
      ...c,
      isActive: Boolean(c.isActive),
      isDefault: Boolean(c.isDefault),
      startDate: c.startDate ?? null,
      endDate: c.endDate ?? null,
    })) as (ResolvableCampaign & (typeof campaigns)[number])[],
    { slug, now: new Date() },
  )

  return { storefront, resolution }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const resolved = await params
  const { resolution } = await resolve(resolved)
  const campaign = resolution.campaign
  const path = `/store/${resolved.storeslug}/signup${campaign ? `/${campaign.slug}` : ''}`

  return {
    title: campaign?.meta?.title ?? campaign?.title ?? 'Sign Up',
    description: campaign?.meta?.description ?? undefined,
    alternates: { languages: getSiteAlternates(path) },
    ...(resolution.status === 'ended' ? { robots: { index: false } } : {}),
  }
}

export default async function SignupCampaignPage({ params }: { params: Promise<Params> }) {
  const resolved = await params
  const { storefront, resolution } = await resolve(resolved)

  if (!storefront || resolution.status === 'missing' || !resolution.campaign) notFound()

  const campaign = resolution.campaign
  const storeName: string = storefront.locationName ?? resolved.storeslug

  if (resolution.status === 'ended') {
    return (
      <>
        <SignupLockup storeName={storeName} />
        <SignupEndedPanel
          campaignTitle={campaign.title}
          storeName={storeName}
          storeslug={resolved.storeslug}
        />
      </>
    )
  }

  const school = await getMusicSchoolByStorefrontSlug(resolved.storeslug)

  return (
    <>
      <SignupLockup storeName={storeName} />
      <SignupHero hero={campaign.hero} />
      <main className="mx-auto max-w-7xl px-4 py-10 pb-20 sm:px-6 lg:pb-10">
        <div className="lg:grid lg:grid-cols-[1.35fr_1fr] lg:items-start lg:gap-8">
          <div className="space-y-4">
            <SignupBlocks
              blocks={campaign.blocks ?? []}
              storefront={storefront}
              school={school}
            />
          </div>
          <SignupRail
            campaignSlug={campaign.slug}
            storeslug={resolved.storeslug}
            title={campaign.form?.title ?? 'Reserve your spot'}
            subtitle={campaign.form?.subtitle}
            submitLabel={campaign.form?.submitLabel ?? 'Save My Spot'}
            finePrint={campaign.form?.finePrint}
            core={{
              collectPhone: Boolean(campaign.form?.collectPhone),
              requirePhone: Boolean(campaign.form?.requirePhone),
              collectZip: Boolean(campaign.form?.collectZip),
              requireZip: Boolean(campaign.form?.requireZip),
            }}
            questions={(campaign.form?.questions ?? []) as unknown as SignupQuestion[]}
          />
        </div>
      </main>
      <SignupMobileBar label={campaign.form?.submitLabel ?? 'Save My Spot'} />
    </>
  )
}
