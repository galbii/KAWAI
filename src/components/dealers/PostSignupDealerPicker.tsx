'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DealerChoiceModal } from '@/components/dealers/DealerChoiceModal'
import { getNearbyDealersForLead } from '@/lib/actions/nearby-dealers'
import { notifyRsmOfLead } from '@/lib/actions/notify-rsm-of-lead'
import type { NearbyDealerOption } from '@/lib/rsm/nearby-dealers'

/**
 * Post-signup dealer picker.
 *
 * Bridges a captured lead to the dealer-choice modal, then routes the lead to
 * its RSM carrying whatever the visitor chose. Used by the offer pages that run
 * the picker (/signup2 and its /signup3 staging copy); shared rather than
 * page-local so the single-fire guarantees below can't drift between them.
 *
 * The hard requirement here is that a lead can never be lost. /signup notifies
 * the RSM the instant the form completes; deferring that until someone answers
 * a modal would drop the notification for anyone who wanders off. So the
 * notification fires on whichever of these happens first:
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
 *
 * An explicit answer (1) also navigates: to the chosen dealer's page, or to the
 * dealer finder when the visitor wasn't sure. The other three paths deliberately
 * do not — a dismissal means "I'm closing this", and yanking someone to another
 * page after they closed a box (or after a background timer fired while they
 * were reading) would be hostile.
 */

/** Where "I'm not sure" sends the visitor to browse the full network. */
const DEALER_FINDER_PATH = '/find-a-dealer'

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
  const router = useRouter()
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

  /**
   * An explicit answer — either action button. Routes the lead, then takes the
   * visitor where they asked to go.
   *
   * `pending` stays set through the navigation: it swaps the button to
   * "Connecting…" and locks the modal's dismiss affordances, so the box can't be
   * closed out from under an answer that is already on its way.
   */
  const answer = useCallback(
    (dealerId: string | null) => {
      setPending(true)
      notify(dealerId)

      // Every dealer the picker offers comes from the `dealers` collection, so
      // the detail page is always /find-a-dealer/[slug] — storefronts, which
      // live at /store/[slug], are a separate collection this pipeline never
      // reads. Falls back to the finder if a slug is somehow missing.
      const chosen = dealerId ? dealers.find((d) => d.id === dealerId) : undefined
      const href = chosen?.slug ? `${DEALER_FINDER_PATH}/${chosen.slug}` : DEALER_FINDER_PATH

      // router.push, not window.location: a soft navigation leaves the in-flight
      // notification request alive, where a full page load could abort it.
      router.push(href)
    },
    [notify, dealers, router],
  )

  /**
   * X / Esc / overlay. Still routes the lead — a dismissal means "not sure",
   * never "discard me" — but stays put rather than navigating.
   */
  const dismiss = useCallback(() => {
    notify(selectionRef.current)
    setOpen(false)
  }, [notify])

  if (!open && !armed) return null

  return (
    <DealerChoiceModal
      isOpen={open}
      zip={lead.zip ?? ''}
      dealers={dealers}
      center={center}
      onChoose={answer}
      onSelectionChange={(id) => {
        selectionRef.current = id
      }}
      onDismiss={dismiss}
      pending={pending}
    />
  )
}
