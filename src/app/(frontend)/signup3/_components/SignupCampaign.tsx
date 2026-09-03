import { HeroPoster } from './HeroPoster'
import { RebateLedger } from './RebateLedger'
import { ShowroomsSection } from './ShowroomsSection'
import { StatsSection } from './StatsSection'
import { CodaSection } from './CodaSection'
import { OfferModalProvider } from './OfferModalContext'
import type { RebateCategory } from '@/lib/payload/rebate-types'

type SignupCampaignProps = {
  /** Rebated products grouped by category, resolved server-side for the active site. */
  rebateData: RebateCategory[]
  /** Active site — 'cad' swaps in the Canada program figure. */
  site?: 'us' | 'cad'
  /** Staging mode — the offer form skips HubSpot and Shopify writes. */
  testMode?: boolean
}

/**
 * /signup3 — the /signup2 Summer Savings campaign in the Back to School house
 * style. Same offer, same copy, same conversion flow; a different type system.
 *
 * /signup2 is a cinematic: a pinned canvas cross-fading layered piano
 * photography under scroll-scrubbed scene windows. That machinery is gone here.
 * The Back to School register is print — a full-bleed poster, then flat sheets
 * of ruled paper — and it needs no scroll orchestration at all: the hero
 * animates itself with CSS on load (so nothing gates the LCP text) and every
 * section below reveals off an IntersectionObserver. Which also means there is
 * no separate reduced-motion fallback to keep in sync: the global
 * reduced-motion rule in globals.css collapses both mechanisms to their
 * finished state.
 *
 * Only the offer modal needs client state, and it stays where /signup2 put it —
 * in OfferModalProvider, which outlives the modal so a submitted lead is always
 * routed (see the note in OfferModalContext).
 */
export function SignupCampaign({ rebateData, site = 'us', testMode = false }: SignupCampaignProps) {
  return (
    <OfferModalProvider testMode={testMode}>
      <HeroPoster site={site} />
      <RebateLedger data={rebateData} />
      <ShowroomsSection />
      <StatsSection />
      <CodaSection />
    </OfferModalProvider>
  )
}
