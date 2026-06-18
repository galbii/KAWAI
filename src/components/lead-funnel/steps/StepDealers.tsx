'use client'

/**
 * Step 2 — Dealer locator.
 * Takes a ZIP, fetches the 5 nearest active dealers, lets the user pick one.
 * The selection tags the Shopify customer (dealer routing) and advances the
 * funnel to the thank-you step.
 */

import { useState, useTransition } from 'react'
import { MapPinIcon } from '@heroicons/react/24/outline'
import { FormAlert } from '@/components/ui/form-alert'
import { findNearestDealers, attachDealerToLead } from '@/lib/actions/lead-funnel'
import type { LeadFunnelConfig, NearestDealer } from '../types'
import type { ThemeTokens } from '../theme'

interface StepDealersProps {
  theme: ThemeTokens
  config: LeadFunnelConfig['dealers']
  /** Email captured in step 1, used to tag the chosen dealer. */
  email: string
  onSelected: (dealer: NearestDealer) => void
}

export function StepDealers({ theme, config, email, onSelected }: StepDealersProps) {
  const [zip, setZip] = useState('')
  const [dealers, setDealers] = useState<NearestDealer[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searching, startSearch] = useTransition()
  const [selecting, startSelect] = useTransition()

  const search = () => {
    setError(null)
    startSearch(async () => {
      const result = await findNearestDealers(zip)
      if (result.success) {
        setDealers(result.dealers)
      } else {
        setDealers(null)
        setError(result.message)
      }
    })
  }

  const choose = (dealer: NearestDealer) => {
    startSelect(async () => {
      // Fire-and-await the tag, but advance regardless — routing failure
      // shouldn't block the user's experience.
      await attachDealerToLead(email, dealer.slug)
      onSelected(dealer)
    })
  }

  const formatLocation = (d: NearestDealer) =>
    [d.city, d.state].filter(Boolean).join(', ') || 'Location available on request'

  return (
    <div>
      <div className="mb-5">
        <h2
          className="mb-2 text-2xl font-semibold tracking-tight"
          style={{ color: theme.heading, fontFamily: 'var(--font-brand-serif)' }}
        >
          {config?.heading ?? 'Find your nearest dealer'}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: theme.subheading }}>
          {config?.subheading ?? 'Enter your ZIP code and choose a dealer to claim your offer.'}
        </p>
      </div>

      {error && <FormAlert variant="error" message={error} className="mb-4" />}

      {/* ZIP search */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          search()
        }}
        className="mb-4 flex gap-2"
      >
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MapPinIcon className="h-4 w-4" style={{ color: theme.mutedText }} />
          </div>
          <input
            type="text"
            inputMode="numeric"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="ZIP / Postal code"
            className="w-full rounded-md border py-3 pl-10 pr-3 text-sm outline-none"
            style={{
              background: theme.inputBg,
              borderColor: theme.inputBorder,
              color: theme.bodyText,
            }}
          />
        </div>
        <button
          type="submit"
          disabled={searching || zip.trim().length < 3}
          className="rounded-md px-4 text-sm font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-70"
          style={{ background: theme.submitBg, color: theme.submitFg }}
        >
          {searching ? 'Searching…' : (config?.submitText ?? 'Find dealers')}
        </button>
      </form>

      {/* Results */}
      {dealers && dealers.length > 0 && (
        <ul className="flex max-h-72 flex-col gap-2 overflow-y-auto">
          {dealers.map((dealer) => (
            <li key={dealer.slug}>
              <button
                type="button"
                onClick={() => choose(dealer)}
                disabled={selecting}
                className="flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors duration-150 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ borderColor: theme.cardBorder, background: theme.inputBg }}
              >
                <span className="min-w-0">
                  <span
                    className="block truncate text-sm font-semibold"
                    style={{ color: theme.bodyText }}
                  >
                    {dealer.dealerName}
                  </span>
                  <span className="block truncate text-xs" style={{ color: theme.mutedText }}>
                    {formatLocation(dealer)}
                  </span>
                </span>
                <span
                  className="ml-3 flex-shrink-0 text-xs font-medium"
                  style={{ color: theme.subheading }}
                >
                  {dealer.distance} mi
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {dealers && dealers.length === 0 && (
        <p className="text-sm" style={{ color: theme.mutedText }}>
          No dealers found near that ZIP. Try a nearby ZIP code.
        </p>
      )}
    </div>
  )
}
