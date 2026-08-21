'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { useModal } from '@/hooks'
import OfferModal from './OfferModal'
import { PostSignupDealerPicker } from '@/components/dealers/PostSignupDealerPicker'
import type { PreFormValues } from '@/components/forms/TwoStepHubSpotForm'

/**
 * Shares the dealer-discount modal across the whole /signup scroll so any scene
 * can open it with `useOfferModal().open()` — no prop-threading through the
 * scene tree. Modeled on the project's NavigationContext idiom. Renders a single
 * OfferModal instance for both the cinematic and reduced-motion experiences.
 *
 * It also owns the submitted lead and renders the post-signup dealer picker.
 * That ownership is deliberate and load-bearing: OfferSignupForm renders in two
 * places, one of which is inside OfferModal, and OfferModal unmounts its whole
 * subtree when it closes. A picker owned by the form would therefore be torn
 * down — cancelling its timer and pagehide listener — if the visitor closed the
 * offer modal before answering, and the lead would reach HubSpot but never be
 * routed to an RSM or dealer. Anchored here it outlives the modal that spawned
 * it, so every submitted lead is routed exactly once whatever the visitor does.
 */

/** Identifies this page in the RSM notification email + Resend dashboard tag. */
const LEAD_SOURCE = 'signup3'

type OfferModalContextValue = {
  open: () => void
  close: () => void
  /**
   * /signup3 is running as a staging variant: the form writes nothing to
   * HubSpot or Shopify. Resolved server-side and threaded through this
   * provider, which already wraps every OfferSignupForm placement — the hero
   * card, the reduced-motion fallback, and the modal.
   */
  testMode: boolean
  /** Hand a completed submission to the dealer picker. */
  captureLead: (data: PreFormValues) => void
  /** The form's confirmation screen is up — the picker may now open over it. */
  confirmLead: () => void
}

const OfferModalContext = createContext<OfferModalContextValue | null>(null)

export function OfferModalProvider({
  children,
  testMode = false,
}: {
  children: ReactNode
  testMode?: boolean
}) {
  const { isOpen, open, close } = useModal()
  const [lead, setLead] = useState<PreFormValues | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  const captureLead = useCallback((data: PreFormValues) => setLead(data), [])
  const confirmLead = useCallback(() => setConfirmed(true), [])

  // Memoised so capturing a lead doesn't re-render every consumer on this
  // scroll-heavy page — all four handlers are already referentially stable.
  const value = useMemo(
    () => ({ open, close, testMode, captureLead, confirmLead }),
    [open, close, testMode, captureLead, confirmLead],
  )

  return (
    <OfferModalContext.Provider value={value}>
      {children}
      <OfferModal isOpen={isOpen} onClose={close} />
      {lead && <PostSignupDealerPicker lead={lead} source={LEAD_SOURCE} armed={confirmed} />}
    </OfferModalContext.Provider>
  )
}

export function useOfferModal(): OfferModalContextValue {
  const ctx = useContext(OfferModalContext)
  if (!ctx) {
    throw new Error('useOfferModal must be used within an OfferModalProvider')
  }
  return ctx
}
