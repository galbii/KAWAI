'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { DealerChoiceModal } from '@/components/dealers/DealerChoiceModal'
import { getNearbyDealersForLead } from '@/lib/actions/nearby-dealers'
import { notifyRsmOfLead } from '@/lib/actions/notify-rsm-of-lead'
import type { NearbyDealerOption } from '@/lib/rsm/nearby-dealers'

/**
 * Post-signup dealer picker for /signup3.
 *
 * Bridges a captured lead to the dealer-choice modal, then routes the lead to
 * its RSM carrying whatever the visitor chose.
 *
 * The hard requirement here is that a lead can never be lost. /signup and
 * /signup2 notify the RSM the instant the form completes; deferring that until
 * someone answers a modal would drop the notification for anyone who wanders
 * off. So the notification fires on whichever of these happens first:
 *
 *   1. The visitor answers — a dealer, or "I'm not sure".
 *   2. They dismiss the modal (X / Esc / overlay). A dismissal is treated as
 *      "not sure", never as "discard this lead".
 *   3. `pagehide` — best effort as the tab goes away.
 *   4. A {@link ANSWER_GRACE_MS} timer expires.
 *
 * A single `notifiedRef` guard makes those mutually exclusive, so exactly one
 * notification is ever sent. The safety-net paths send the visitor's *current*
 * highlighted selection rather than null, so someone who picked a dealer but
 * never pressed Confirm still has their choice carried through.
 */

/**
 * How long to hold the notification waiting for an answer. Generous enough that
 * a visitor genuinely reading the list is never cut off, short enough that an
 * abandoned tab still reaches the RSM promptly.
 */
const ANSWER_GRACE_MS = 120_000

type Props = {
  /** The submitted lead, in the HubSpot field shape `notifyRsmOfLead` expects. */
  lead: Record<string, string>
  /** Page identifier for the Resend tag + email footer. */
  source: string
  /** Open the modal only once the form's confirmation screen is showing. */
  armed: boolean
}

export function PostSignupDealerPicker({ lead, source, armed }: Props) {
  const [dealers, setDealers] = useState<NearbyDealerOption[]>([])
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  const notifiedRef = useRef(false)
  /** Latest highlighted dealer, so the safety nets can send a real answer. */
  const selectionRef = useRef<string | null>(null)

  /** Route the lead exactly once, whatever triggers it. */
  const notify = useCallback(
    (dealerId: string | null) => {
      if (notifiedRef.current) return
      notifiedRef.current = true
      // Fire-and-forget: HubSpot already has the lead, and the visitor must
      // never be blocked on our internal routing.
      void notifyRsmOfLead(lead, source, { dealerId }).catch(() => {})
    },
    [lead, source],
  )

  // Resolve the nearby dealers as soon as the lead exists — this runs while
  // HubSpot is still submitting, so the modal opens without a spinner.
  useEffect(() => {
    let cancelled = false

    void getNearbyDealersForLead(lead.zip ?? '')
      .then((res) => {
        if (cancelled) return
        setDealers(res.dealers)
        setCenter(res.center)
        setLoaded(true)
      })
      .catch(() => {
        if (cancelled) return
        // No list means no question to ask — route the lead rather than
        // stranding it behind a modal that will never open.
        notify(null)
        setLoaded(true)
      })

    return () => {
      cancelled = true
    }
  }, [lead, notify])

  // Open once the lookup is done AND the confirmation screen is up.
  useEffect(() => {
    if (armed && loaded && !notifiedRef.current) setOpen(true)
  }, [armed, loaded])

  // Safety nets — only while the question is actually on screen.
  useEffect(() => {
    if (!open) return

    const timer = window.setTimeout(() => notify(selectionRef.current), ANSWER_GRACE_MS)

    // Best effort: a server action during unload may not complete, which is
    // why the timer above is the real guarantee rather than this.
    const onPageHide = () => notify(selectionRef.current)
    window.addEventListener('pagehide', onPageHide)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('pagehide', onPageHide)
    }
  }, [open, notify])

  const choose = useCallback(
    (dealerId: string | null) => {
      setPending(true)
      notify(dealerId)
      setOpen(false)
      setPending(false)
    },
    [notify],
  )

  if (!open && !armed) return null

  return (
    <DealerChoiceModal
      isOpen={open}
      zip={lead.zip ?? ''}
      dealers={dealers}
      center={center}
      onChoose={choose}
      onSelectionChange={(id) => {
        selectionRef.current = id
      }}
      // A dismissal still routes the lead — it means "not sure", not "forget me".
      onDismiss={() => choose(selectionRef.current)}
      pending={pending}
    />
  )
}
