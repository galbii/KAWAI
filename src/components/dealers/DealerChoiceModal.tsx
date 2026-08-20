'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import { MapPin, Phone, Check } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { DialogTitle, DialogDescription } from '@/components/ui/dialog'
import type { DealerWithDistance } from '@/app/(frontend)/find-a-dealer/types'
import type { NearbyDealerOption } from '@/lib/rsm/nearby-dealers'
import { cn } from '@/lib/utils'

/**
 * Post-submit dealer picker.
 *
 * Opens once a lead is captured and offers the Kawai dealers closest to the ZIP
 * the visitor gave, so a lead arrives at the RSM already carrying a
 * destination. "I'm not sure" is a first-class outcome, not a dismissal — it
 * still routes the lead, it just asks the RSM to recommend from the same list.
 *
 * Picking a dealer reveals the shared find-a-dealer map, flown to that dealer
 * with its marker enlarged (both behaviours already live in `DealerMapLibre`,
 * driven by `selectedDealer`). The map is loaded on demand rather than with the
 * modal — MapLibre is a heavy bundle to hand every visitor who submits a form,
 * and nobody needs it until they've actually chosen.
 *
 * `onChoose(dealerId)` fires with the chosen dealer's id, or `null` for
 * "not sure". `onDismiss` is the escape hatch (X / overlay / Esc); callers on a
 * live lead path should treat a dismissal as `null` rather than dropping the
 * lead, since the visitor has already submitted their details by this point.
 */

const DealerMapLibre = dynamic(
  () =>
    import('@/app/(frontend)/find-a-dealer/components/DealerMapLibre').then(
      (m) => m.DealerMapLibre,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-kawai-pearl">
        <span className="text-xs text-kawai-charcoal/50">Loading map…</span>
      </div>
    ),
  },
)

/**
 * Widen a public dealer option back into the `Dealer` shape the shared map
 * expects. Only display fields are reconstructed — the projection never carried
 * `rsmEmail`, so there is nothing internal to restore.
 */
function toDealerMarker(option: NearbyDealerOption): DealerWithDistance {
  return {
    id: option.id,
    dealerName: option.name,
    slug: option.slug,
    isActive: true,
    distance: option.distance,
    contactInfo: {
      ...(option.phone ? { phone: option.phone } : {}),
      ...(option.email ? { email: option.email } : {}),
      ...(option.website ? { website: option.website } : {}),
    },
    address: {
      street: option.street,
      city: option.city,
      state: option.state,
      zipCode: option.zipCode,
    },
    coordinates: {
      latitude: option.latitude ?? 0,
      longitude: option.longitude ?? 0,
    },
    dealerType: 'dealer',
    shigeruKawaiDealer: option.shigeru,
    acousticPianoDealer: option.acoustic,
    digitalPianoDealer: option.digital,
    professionalProductDealer: option.professional,
    updatedAt: '',
    createdAt: '',
  }
}

interface Props {
  isOpen: boolean
  /** ZIP / postal code the list was built from — shown for reassurance. */
  zip: string
  dealers: NearbyDealerOption[]
  /** Geocoded centre of the ZIP, used as the map's opening view. */
  center?: { lat: number; lng: number } | null
  onChoose: (dealerId: string | null) => void
  onDismiss: () => void
  /** Disables the controls while the caller's submit is in flight. */
  pending?: boolean
}

export function DealerChoiceModal({
  isOpen,
  zip,
  dealers,
  center = null,
  onChoose,
  onDismiss,
  pending = false,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const rowRefs = useRef<Record<string, HTMLLabelElement | null>>({})

  // A fresh open is a fresh decision — otherwise reopening the modal for a
  // different ZIP would carry the previous pick's id into the new list.
  useEffect(() => {
    if (isOpen) setSelected(null)
  }, [isOpen, zip])

  // Choosing opens the map above the list, pushing rows down — without this the
  // row you just tapped can end up off-screen. `nearest` keeps the scroll to the
  // minimum needed so the list doesn't jump when the row is already visible.
  useEffect(() => {
    if (!selected) return
    const row = rowRefs.current[selected]
    if (!row) return
    const id = window.setTimeout(
      () => row.scrollIntoView({ block: 'nearest', behavior: 'smooth' }),
      340, // after the map's height transition settles
    )
    return () => window.clearTimeout(id)
  }, [selected])

  const hasDealers = dealers.length > 0
  const selectedOption = dealers.find((d) => d.id === selected) ?? null
  // A dealer with no coordinates can't be shown on a map; the routing filter
  // excludes those, but the picker shouldn't crash if one slips through.
  const showMap = Boolean(selectedOption?.latitude && selectedOption?.longitude)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onDismiss}
      size="lg"
      showCloseButton={!pending}
      closeOnOverlayClick={!pending}
      closeOnEscape={!pending}
      className={cn(
        'grid max-h-[92dvh] w-[calc(100%-1.5rem)] grid-rows-[auto_auto_1fr_auto] gap-0 p-0',
        'bg-white sm:w-full',
      )}
    >
      {/* — Header — */}
      <div className="border-b border-kawai-neutral/70 px-4 py-4 sm:px-6 sm:py-5">
        <DialogTitle className="font-[family-name:var(--font-brand-serif)] text-xl font-light leading-tight text-kawai-black sm:text-2xl">
          Kawai Dealers Near You
        </DialogTitle>
        <DialogDescription className="mt-1.5 text-sm leading-relaxed text-kawai-charcoal/70">
          {hasDealers
            ? `Closest to ${zip}. Pick one and we'll connect you.`
            : `We couldn't find dealers near ${zip} — your Kawai regional manager will match you personally.`}
        </DialogDescription>
      </div>

      {/* — Map, revealed once a dealer is picked — */}
      <AnimatePresence initial={false}>
        {showMap && selectedOption && (
          <motion.div
            key="dealer-map"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden border-b border-kawai-neutral/70"
          >
            <div className="h-[170px] sm:h-[220px]">
              <DealerMapLibre
                dealers={dealers.filter((d) => d.latitude && d.longitude).map(toDealerMarker)}
                searchCenter={center}
                searchRadius={50}
                selectedDealer={selectedOption.id}
                onMarkerClick={(dealerId) => dealerId && setSelected(dealerId)}
                // Flat, close, pin-centred, no popup — see `compact` on the map.
                compact
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* — Dealer list — */}
      <div className="min-h-0 overflow-y-auto overscroll-contain">
        {hasDealers && (
          <fieldset
            className="divide-y divide-kawai-neutral/60"
            disabled={pending}
            aria-label="Nearby Kawai dealers"
          >
            <legend className="sr-only">Choose a dealer to be connected with</legend>
            {dealers.map((dealer) => {
              const isSelected = selected === dealer.id
              return (
                <label
                  key={dealer.id}
                  ref={(el) => {
                    rowRefs.current[dealer.id] = el
                  }}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors sm:px-6',
                    'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-inset has-[:focus-visible]:ring-kawai-red',
                    isSelected ? 'bg-kawai-red/[0.05]' : 'active:bg-kawai-pearl sm:hover:bg-kawai-pearl/70',
                  )}
                  style={{ borderLeft: `3px solid ${isSelected ? '#E11922' : 'transparent'}` }}
                >
                  <input
                    type="radio"
                    name="kawai-dealer-choice"
                    value={dealer.id}
                    checked={isSelected}
                    onChange={() => setSelected(dealer.id)}
                    className="sr-only"
                  />

                  {/* Custom control — the native radio stays in the a11y tree above. */}
                  <span
                    aria-hidden
                    className={cn(
                      'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-colors',
                      isSelected
                        ? 'border-kawai-red bg-kawai-red text-white'
                        : 'border-kawai-neutral bg-white',
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>

                  {/* Two lines. City and what the dealer stocks share the
                      second line as dot-separated text rather than stacking as
                      pills — the row stays one tap-height on a phone. */}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-semibold leading-snug text-kawai-black">
                      {dealer.name}
                      {dealer.shigeru && (
                        <span className="ml-2 align-middle text-[10px] font-bold uppercase tracking-[0.08em] text-kawai-gold-on-light">
                          Shigeru
                        </span>
                      )}
                    </span>
                    <span className="block truncate text-[13px] text-kawai-charcoal/60">
                      {[
                        dealer.location,
                        dealer.acoustic ? 'Acoustic' : null,
                        dealer.digital ? 'Digital' : null,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                  </span>

                  <span className="flex-shrink-0 text-[12px] font-medium tabular-nums text-kawai-charcoal/55">
                    {dealer.distance.toFixed(1)} mi
                  </span>
                </label>
              )
            })}
          </fieldset>
        )}
      </div>

      {/* — Actions — */}
      <div className="border-t border-kawai-neutral/70 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pb-5">
        {hasDealers && (
          <button
            type="button"
            disabled={pending || !selected}
            onClick={() => selected && onChoose(selected)}
            className={cn(
              'inline-flex w-full items-center justify-center rounded-full bg-kawai-red px-7 py-3.5',
              'font-[family-name:var(--font-brand-sans)] text-sm font-semibold uppercase tracking-[0.12em] text-white',
              'transition-colors duration-200 hover:bg-kawai-red-700',
              'disabled:cursor-not-allowed disabled:opacity-40',
            )}
          >
            {pending
              ? 'Connecting…'
              : // Naming the dealer confirms the choice, but an uppercase
                // tracked label wraps badly on a phone past ~22 characters.
                selectedOption && selectedOption.name.length <= 22
                ? `Connect me with ${selectedOption.name}`
                : 'Connect me'}
          </button>
        )}

        {/* Demoted to a link so the primary action owns the thumb zone, but it
            stays a real button — "not sure" is an answer, not a dismissal. */}
        <button
          type="button"
          disabled={pending}
          onClick={() => onChoose(null)}
          className={cn(
            'mx-auto mt-3 block text-[13px] text-kawai-charcoal/70 underline underline-offset-4',
            'transition-colors hover:text-kawai-black disabled:opacity-40',
            hasDealers ? '' : 'font-semibold text-kawai-black no-underline',
          )}
        >
          {hasDealers ? "I'm not sure — send me recommendations" : 'Continue'}
        </button>
      </div>
    </Modal>
  )
}
