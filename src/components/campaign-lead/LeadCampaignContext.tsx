'use client'

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { useModal } from '@/hooks'
import { LeadModal } from './LeadModal'
import { notifyRsmOfLead } from '@/lib/actions/notify-rsm-of-lead'
import type { PreFormValues } from '@/components/forms/TwoStepHubSpotForm'
import type { LeadCampaignConfig } from './types'

/**
 * Shares one lead-capture modal across a whole campaign page, so any section can
 * open it with `useLeadCampaign().open()` and no page has to thread props down
 * its section tree. Generalized from the three hand-copied OfferModalContext
 * files on /signup, /signup2 and /signup3 — the campaign's identity now arrives
 * as {@link LeadCampaignConfig} instead of being hardcoded per copy.
 *
 * The provider owns lead ROUTING, not just the modal, and that ownership is
 * load-bearing rather than tidy. The form renders in more than one place, and
 * one of those places is inside the modal, whose subtree is unmounted the moment
 * it closes. Routing owned by the form would therefore be torn down if a visitor
 * submitted and immediately dismissed the dialog — the lead would reach HubSpot
 * and never reach a dealer. Anchored here it outlives the modal that spawned it,
 * so every submitted lead is routed exactly once whatever the visitor does.
 */

interface LeadCampaignContextValue {
  /** Open the lead modal. */
  open: () => void
  close: () => void
  config: LeadCampaignConfig
  /**
   * Dry run: validate, route, and show the confirmation, but write nothing to
   * HubSpot or Shopify. For staging a campaign without junk in the CRM.
   */
  testMode: boolean
  /** Hand a completed submission up for routing to the nearest dealer's RSM. */
  captureLead: (data: PreFormValues) => void
  /** The confirmation screen is up — anything deferred until then may run now. */
  confirmLead: () => void
  /** True once a submission has been confirmed on this page view. */
  confirmed: boolean
}

const LeadCampaignContext = createContext<LeadCampaignContextValue | null>(null)

export function LeadCampaignProvider({
  config,
  testMode = false,
  children,
}: {
  config: LeadCampaignConfig
  testMode?: boolean
  children: ReactNode
}) {
  const { isOpen, open, close } = useModal()
  const [confirmed, setConfirmed] = useState(false)

  /**
   * Guards against a double send. Nothing sits between the form and Resend, so
   * a stray second `onComplete` would email the RSM about the same lead twice.
   */
  const notifiedRef = useRef(false)

  const captureLead = useCallback(
    (data: PreFormValues) => {
      if (notifiedRef.current) return
      notifiedRef.current = true
      // Fire-and-forget: HubSpot already has the lead, and the visitor must
      // never be left waiting on our internal routing.
      //
      // Deliberately NOT gated on `testMode` — routing is precisely what a
      // staging run needs to exercise, and the LEAD_NOTIFY_* environment
      // switches are what hold or redirect the mail.
      void notifyRsmOfLead(data, config.source).catch(() => {})
    },
    [config.source],
  )

  const confirmLead = useCallback(() => setConfirmed(true), [])

  // Memoised: campaign pages are scroll- and animation-heavy, and capturing a
  // lead should not re-render every section that reads this context.
  const value = useMemo(
    () => ({ open, close, config, testMode, captureLead, confirmLead, confirmed }),
    [open, close, config, testMode, captureLead, confirmLead, confirmed],
  )

  return (
    <LeadCampaignContext.Provider value={value}>
      {children}
      <LeadModal isOpen={isOpen} onClose={close} />
    </LeadCampaignContext.Provider>
  )
}

export function useLeadCampaign(): LeadCampaignContextValue {
  const ctx = useContext(LeadCampaignContext)
  if (!ctx) {
    throw new Error('useLeadCampaign must be used within a LeadCampaignProvider')
  }
  return ctx
}
