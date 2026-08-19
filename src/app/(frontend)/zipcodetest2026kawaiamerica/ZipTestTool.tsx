'use client'

import { useState } from 'react'
import {
  testRsmRouting,
  sendTestRsmEmail,
  type TestSendResult,
} from '@/lib/actions/test-rsm-routing'
import { DealerMapLibre } from '../find-a-dealer/components/DealerMapLibre'
import type { DealerWithDistance } from '../find-a-dealer/types'
import { cn } from '@/lib/utils'

/**
 * Internal ZIP → RSM routing test tool.
 *
 * Two modes against the same lead payload:
 *   - Dry run   — resolves routing only, sends nothing.
 *   - Send test — emails the real production template (plus the 5 closest
 *     dealers) to the operator-supplied test inboxes, so a tester can see
 *     exactly what an RSM receives. Never emails the real RSM.
 *
 * Results render the would-be recipient, per-recipient send outcomes, the
 * shared find-a-dealer map centred on the geocoded ZIP, and the ranked
 * candidate table.
 */

const INPUT_CLASS =
  'h-11 w-full rounded-md border border-kawai-neutral bg-white px-3 text-sm text-kawai-black outline-none focus-visible:ring-2 focus-visible:ring-kawai-red'

const LABEL_CLASS = 'mb-1 block text-[11px] font-semibold uppercase tracking-[0.06em] text-kawai-charcoal/60'

/** Prefilled so a tester can fire a send in two clicks. */
const DEFAULT_LEAD = {
  firstname: 'Test',
  lastname: 'Lead',
  email: 'noreply@kawaius.com',
  phone: '555-0123',
  zip: '',
  piano_type: 'Grand Piano',
  when_are_you_looking_to_purchase_: '1_3_months',
}

export function ZipTestTool() {
  const [lead, setLead] = useState(DEFAULT_LEAD)
  const [recipients, setRecipients] = useState('')
  const [password, setPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [result, setResult] = useState<TestSendResult | null>(null)
  const [pending, setPending] = useState<'dry' | 'send' | null>(null)
  const [selectedDealer, setSelectedDealer] = useState<string | null>(null)

  const set = (key: keyof typeof DEFAULT_LEAD) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setLead((prev) => ({ ...prev, [key]: e.target.value }))

  const run = async (mode: 'dry' | 'send') => {
    if (pending) return

    // Surface what's missing instead of silently no-op'ing — a dead button
    // reads as a broken tool.
    const missing: string[] = []
    if (!password.trim()) missing.push('access password')
    if (!lead.zip.trim()) missing.push('ZIP / postal code')
    if (mode === 'send' && !recipients.trim()) missing.push('at least one test inbox')
    if (missing.length > 0) {
      setResult({ success: false, message: `Fill in ${missing.join(', ')} first.` })
      return
    }

    setPending(mode)
    setResult(null)
    setSelectedDealer(null)
    try {
      // Password is verified server-side on every call — this state only
      // controls whether we keep showing the input.
      const res =
        mode === 'dry'
          ? await testRsmRouting(lead.zip, password)
          : await sendTestRsmEmail({ ...lead, password, recipients })

      if (res.success || res.message !== 'Incorrect password.') setUnlocked(true)
      setResult(res)
      setSelectedDealer(res.matchedDealerId ?? null)
    } catch {
      setResult({ success: false, message: 'Something went wrong running the test.' })
    } finally {
      setPending(null)
    }
  }

  const mapDealers: DealerWithDistance[] =
    result?.candidates?.map(({ dealer, distance }) => ({ ...dealer, distance })) ?? []

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          void run('dry')
        }}
        className="space-y-5 rounded-lg border border-kawai-neutral bg-white p-5"
      >
        {!unlocked && (
          <div className="max-w-[220px]">
            <label className={LABEL_CLASS} htmlFor="zt-password">
              Access password
            </label>
            <input
              id="zt-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              className={INPUT_CLASS}
            />
          </div>
        )}

        {/* — Lead payload (same field names the HubSpot signup form emits) — */}
        <div>
          <p className="mb-3 text-sm font-semibold text-kawai-black">Lead details</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className={LABEL_CLASS} htmlFor="zt-firstname">
                First name
              </label>
              <input id="zt-firstname" className={INPUT_CLASS} value={lead.firstname} onChange={set('firstname')} />
            </div>
            <div>
              <label className={LABEL_CLASS} htmlFor="zt-lastname">
                Last name
              </label>
              <input id="zt-lastname" className={INPUT_CLASS} value={lead.lastname} onChange={set('lastname')} />
            </div>
            <div>
              <label className={LABEL_CLASS} htmlFor="zt-email">
                Lead email (becomes Reply-To)
              </label>
              <input id="zt-email" type="email" className={INPUT_CLASS} value={lead.email} onChange={set('email')} />
            </div>
            <div>
              <label className={LABEL_CLASS} htmlFor="zt-phone">
                Phone
              </label>
              <input id="zt-phone" className={INPUT_CLASS} value={lead.phone} onChange={set('phone')} />
            </div>
            <div>
              <label className={LABEL_CLASS} htmlFor="zt-zip">
                ZIP / postal code
              </label>
              <input
                id="zt-zip"
                className={INPUT_CLASS}
                value={lead.zip}
                onChange={set('zip')}
                placeholder="90210 or M5V 2T6"
              />
            </div>
            <div>
              <label className={LABEL_CLASS} htmlFor="zt-piano-type">
                Shopping for
              </label>
              <input id="zt-piano-type" className={INPUT_CLASS} value={lead.piano_type} onChange={set('piano_type')} />
            </div>
            <div>
              <label className={LABEL_CLASS} htmlFor="zt-timeframe">
                Timeframe
              </label>
              <input
                id="zt-timeframe"
                className={INPUT_CLASS}
                value={lead.when_are_you_looking_to_purchase_}
                onChange={set('when_are_you_looking_to_purchase_')}
              />
            </div>
          </div>
        </div>

        {/* — Test inboxes — */}
        <div>
          <label className={LABEL_CLASS} htmlFor="zt-recipients">
            Test inboxes — emulate the RSM (max 5, comma separated)
          </label>
          <input
            id="zt-recipients"
            className={INPUT_CLASS}
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            placeholder="you@kawaius.com, someone-else@kawaius.com"
          />
          <p className="mt-1.5 text-xs text-kawai-charcoal/60">
            The real RSM is never emailed — the matched address is shown inside the email body
            instead. Each inbox gets its own copy. No HubSpot, no Shopify.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="submit"
            disabled={pending !== null}
            className="h-11 rounded-md border border-kawai-neutral bg-white px-5 text-sm font-semibold text-kawai-black transition-colors hover:bg-kawai-pearl disabled:opacity-60"
          >
            {pending === 'dry' ? 'Testing…' : 'Dry run — no email'}
          </button>
          <button
            type="button"
            onClick={() => void run('send')}
            disabled={pending !== null}
            className="h-11 rounded-md bg-kawai-red px-6 text-sm font-semibold text-white transition-colors hover:bg-kawai-red/90 disabled:opacity-60"
          >
            {pending === 'send' ? 'Sending…' : 'Send test email'}
          </button>
        </div>
      </form>

      {/* — Result — */}
      {result && !result.success && (
        <p role="alert" className="text-sm font-medium text-kawai-red">
          {result.message}
        </p>
      )}

      {result?.success && (
        <>
          {/* — Per-recipient send outcomes — */}
          {result.sends && result.sends.length > 0 && (
            <div className="rounded-lg border border-kawai-neutral bg-white p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-kawai-charcoal/60">
                Test send results
              </p>
              <p className="mt-1 text-sm text-kawai-charcoal">{result.message}</p>
              <ul className="mt-3 space-y-1.5">
                {result.sends.map((s) => (
                  <li key={s.email} className="flex flex-wrap items-baseline gap-2 text-sm">
                    <span className={s.ok ? 'text-emerald-700' : 'text-kawai-red'}>
                      {s.ok ? '✓' : '✕'}
                    </span>
                    <span className="font-mono text-xs text-kawai-black">{s.email}</span>
                    {s.id && <span className="font-mono text-[11px] text-kawai-charcoal/50">{s.id}</span>}
                    {s.error && <span className="text-xs text-kawai-red">{s.error}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div
            className={cn(
              'rounded-lg border p-5',
              result.usedFallback
                ? 'border-amber-300 bg-amber-50'
                : 'border-emerald-300 bg-emerald-50',
            )}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-kawai-charcoal/60">
              In production this would be sent to
            </p>
            <p className="mt-1 font-mono text-lg font-semibold text-kawai-black">
              {result.wouldSendTo}
            </p>
            <p className="mt-2 text-sm text-kawai-charcoal">
              {result.usedFallback
                ? result.message ||
                  'No nearby dealer has an RSM email — this would go to the fallback inbox.'
                : `Nearest dealer with an RSM: ${
                    mapDealers.find((d) => d.id === result.matchedDealerId)?.dealerName ?? '—'
                  }`}
              {' · '}
              Detected country: <strong>{result.country === 'canada' ? 'Canada' : 'US'}</strong>
              {result.coords && (
                <>
                  {' · '}Geocoded: {result.coords.lat.toFixed(4)}, {result.coords.lng.toFixed(4)}
                </>
              )}
            </p>
          </div>

          {/* — Map (shared find-a-dealer component) — */}
          {mapDealers.length > 0 && (
            <div className="h-[420px] overflow-hidden rounded-lg border border-kawai-neutral">
              <DealerMapLibre
                dealers={mapDealers}
                searchCenter={result.coords ?? null}
                searchRadius={50}
                selectedDealer={selectedDealer}
                onMarkerClick={setSelectedDealer}
                site={result.country === 'canada' ? 'cad' : 'us'}
              />
            </div>
          )}

          {/* — Candidate table — */}
          {result.candidates && result.candidates.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-kawai-neutral bg-white">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-kawai-neutral text-[11px] uppercase tracking-[0.06em] text-kawai-charcoal/60">
                    <th className="px-4 py-3 font-semibold">#</th>
                    <th className="px-4 py-3 font-semibold">Dealer</th>
                    <th className="px-4 py-3 font-semibold">Location</th>
                    <th className="px-4 py-3 font-semibold">Distance</th>
                    <th className="px-4 py-3 font-semibold">RSM Email</th>
                  </tr>
                </thead>
                <tbody>
                  {result.candidates.map(({ dealer, distance, hasRsmEmail }, i) => {
                    const isMatch = dealer.id === result.matchedDealerId
                    const inEmail = i < 5
                    return (
                      <tr
                        key={dealer.id}
                        onClick={() => setSelectedDealer(dealer.id)}
                        className={cn(
                          'cursor-pointer border-b border-kawai-neutral/50 last:border-0',
                          isMatch ? 'bg-emerald-50' : 'hover:bg-kawai-pearl',
                        )}
                      >
                        <td className="px-4 py-3 tabular-nums text-kawai-charcoal/60">{i + 1}</td>
                        <td className="px-4 py-3 font-medium text-kawai-black">
                          {dealer.dealerName}
                          {isMatch && (
                            <span className="ml-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                              Chosen
                            </span>
                          )}
                          {inEmail && (
                            <span className="ml-2 rounded-full bg-kawai-charcoal/10 px-2 py-0.5 text-[10px] font-bold uppercase text-kawai-charcoal">
                              In email
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-kawai-charcoal">
                          {[dealer.address?.city, dealer.address?.state].filter(Boolean).join(', ')}
                        </td>
                        <td className="px-4 py-3 tabular-nums text-kawai-charcoal">
                          {distance.toFixed(1)} mi
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">
                          {hasRsmEmail ? (
                            <span className="text-emerald-700">{dealer.rsmEmail}</span>
                          ) : (
                            <span className="text-kawai-charcoal/40">— none (skipped)</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {typeof result.totalCandidates === 'number' &&
                result.totalCandidates > result.candidates.length && (
                  <p className="px-4 py-2 text-xs text-kawai-charcoal/50">
                    Showing nearest {result.candidates.length} of {result.totalCandidates} eligible
                    dealers.
                  </p>
                )}
            </div>
          ) : (
            <p className="text-sm text-kawai-charcoal/70">
              No eligible dealers for this country/location (geocoded + non-ecommerce +
              dealer/branch type).
            </p>
          )}
        </>
      )}
    </div>
  )
}
