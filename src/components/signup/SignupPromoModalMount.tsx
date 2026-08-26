import { getPromoModalCampaignForStore } from '@/lib/payload/queries'
import { SignupPromoModal, type PromoFrequency } from './SignupPromoModal'
import type { SignupQuestion } from '@/lib/signup/types'

/**
 * Server half of the music school popup: resolves which campaign (if any) has
 * the popup switched on for this store, then hands the client component only
 * the fields it needs.
 *
 * Renders nothing when no campaign qualifies, so it is safe to mount
 * unconditionally on the school page. Wrap it in <Suspense fallback={null}> at
 * the call site to keep its query off the page's critical path.
 */
export async function SignupPromoModalMount({ storeslug }: { storeslug: string }) {
  const campaign = await getPromoModalCampaignForStore(storeslug)
  if (!campaign) return null

  const promo = campaign.promoModal
  const form = campaign.form

  const heading = promo?.heading || campaign.hero?.heading || campaign.title
  if (!heading) return null

  return (
    <SignupPromoModal
      campaignSlug={campaign.slug}
      storeslug={storeslug}
      heading={heading}
      body={promo?.body ?? campaign.hero?.subheading ?? null}
      delaySeconds={promo?.delaySeconds ?? 6}
      frequency={(promo?.frequency ?? 'session') as PromoFrequency}
      core={{
        collectPhone: form?.collectPhone ?? true,
        requirePhone: form?.requirePhone ?? false,
        collectZip: form?.collectZip ?? true,
        requireZip: form?.requireZip ?? false,
      }}
      questions={(form?.questions ?? []) as SignupQuestion[]}
      submitLabel={form?.submitLabel || 'Sign Up'}
      finePrint={form?.finePrint ?? null}
      campaignHref={`/store/${storeslug}/signup/${campaign.slug}`}
    />
  )
}
