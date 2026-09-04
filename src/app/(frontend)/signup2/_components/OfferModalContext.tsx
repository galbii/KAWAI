'use client'

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { useModal } from '@/hooks'
import OfferModal from './OfferModal'
import { PostSignupDealerPicker } from '@/components/dealers/PostSignupDealerPicker'
import { notifyRsmOfLead } from '@/lib/actions/notify-rsm-of-lead'
import type { PreFormValues } from '@/components/forms/TwoStepHubSpotForm'

/**
 * Shares the dealer-discount modal across the whole /signup scroll so any scene
 * can open it with `useOfferModal().open()` — no prop-threading through the
 * scene tree. Modeled on the project's NavigationContext idiom. Renders a single
 * OfferModal instance for both the cinematic and reduced-motion experiences.
 *
 * It also owns the submitted lead and — when {@link DEALER_PICKER_ENABLED} is
 * on — renders the post-signup dealer picker. That ownership is deliberate and
 * load-bearing: OfferSignupForm renders in two places, one of which is inside
 * OfferModal, and OfferModal unmounts its whole subtree when it closes. A picker
 * owned by the form would therefore be torn down — cancelling its timer and
 * pagehide listener — if the visitor closed the offer modal before answering,
 * and the lead would reach HubSpot but never be routed to an RSM or dealer.
 * Anchored here it outlives the modal that spawned it, so every submitted lead
 * is routed exactly once whatever the visitor does.
 */

/** Identifies this page in the RSM notification email + Resend dashboard tag. */
const LEAD_SOURCE = 'signup2'

/**
 * Ask the visitor which dealer they want after they submit.
 *
 * Currently OFF: the extra step is disabled and the lead routes purely on the
 * ZIP they already entered — `notifyRsmOfLead` geocodes it and matches the
 * nearest RSM-managed dealer, exactly as /signup does. Flip this back to `true`
 * to restore the picker; the whole switch lives in this one constant and
 * everything it needs (PostSignupDealerPicker, captureLead/confirmLead) is
 * still wired up below.
 */
const DEALER_PICKER_ENABLED = false

type OfferModalContextValue = {
  open: () => void
  close: () => void
  /**
   * Hand a completed submission on for routing — to the dealer picker while it
   * is enabled, otherwise straight to the RSM on ZIP alone.
   */
  captureLead: (data: PreFormValues) => void
  /** The form's confirmation screen is up — the picker may now open over it. */
  confirmLead: () => void
}

const OfferModalContext = createContext<OfferModalContextValue | null>(null)

export function OfferModalProvider({ children }: { children: ReactNode }) {
  const { isOpen, open, close } = useModal()
  const [lead, setLead] = useState<PreFormValues | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  /**
   * Guards the picker-disabled path against a double send. The picker has its
   * own single-fire guard; without the step there is nothing between the form
   * and Resend, so a stray second `onComplete` would email the RSM twice.
   */
  const notifiedRef = useRef(false)

  const captureLead = useCallback((data: PreFormValues) => {
    if (DEALER_PICKER_ENABLED) {
      setLead(data)
      return
    }
    // No picker: route on the ZIP the visitor already gave us. Fire-and-forget
    // — HubSpot has the lead and the visitor must never wait on our routing.
    if (notifiedRef.current) return
    notifiedRef.current = true
    void notifyRsmOfLead(data, LEAD_SOURCE).catch(() => {})
  }, [])

  const confirmLead = useCallback(() => setConfirmed(true), [])

  // Memoised so capturing a lead doesn't re-render every consumer on this
  // scroll-heavy page — all four handlers are already referentially stable.
  const value = useMemo(
    () => ({ open, close, captureLead, confirmLead }),
    [open, close, captureLead, confirmLead],
  )

  return (
    <OfferModalContext.Provider value={value}>
      {children}
      <OfferModal isOpen={isOpen} onClose={close} />
      {DEALER_PICKER_ENABLED && lead && (
        <PostSignupDealerPicker lead={lead} source={LEAD_SOURCE} armed={confirmed} />
      )}
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
