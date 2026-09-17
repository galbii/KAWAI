import { HeroPoster } from './HeroPoster'
import { RebateLedger } from './RebateLedger'
import { ShowroomsSection } from './ShowroomsSection'
import { StatsSection } from './StatsSection'
import { CodaSection } from './CodaSection'
import CinematicOutro from './cinematic/CinematicOutro'
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
 * The page is printed, then it plays: the poster and the rebate ledger are flat
 * sheets in the Back to School register — no scroll orchestration, the hero
 * animates itself with CSS on load (so nothing gates the LCP text) and the
 * ledger reveals off an IntersectionObserver — and then the /signup2 cinematic
 * takes the closing third, pinned and scroll-scrubbed, carrying showrooms →
 * trust strip → coda.
 *
 * The flat versions of those three sections are still here and still rendered:
 * CinematicOutro hands them back verbatim under reduced motion, so the page
 * never loses a section, only its choreography.
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
      <CinematicOutro
        fallback={
          <>
            <ShowroomsSection />
            <StatsSection />
            <CodaSection />
          </>
        }
      />
    </OfferModalProvider>
  )
}
