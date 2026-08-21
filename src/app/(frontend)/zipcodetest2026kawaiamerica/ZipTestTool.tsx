'use client'

import { useState } from 'react'
import {
  testRsmRouting,
  sendTestRsmEmail,
  type TestSendResult,
} from '@/lib/actions/test-rsm-routing'
import { DealerChoiceModal } from '@/components/dealers/DealerChoiceModal'
import { DealerMapLibre } from '../find-a-dealer/components/DealerMapLibre'
import type { DealerWithDistance } from '../find-a-dealer/types'
import type { NearbyDealerOption } from '@/lib/rsm/nearby-dealers'
import { cn } from '@/lib/utils'

/**
 * Internal ZIP → RSM routing test tool.
 *
 * Two modes against the same lead payload:
 *   - Dry run — resolves routing only, sends nothing, opens no modal.
 *   - Simulate lead submission — walks the real visitor flow end to end:
 *     resolve the 5 nearest dealers, open the post-submit dealer picker, then
 *     email the resulting production template to the operator's test inboxes.
 *
 * Nothing here can reach a real RSM or dealer. The matched RSM address is
 * reported on this page only (it is no longer printed in the email body), and
 * the dealer CC is previewed rather than applied.
 */

const INPUT_CLASS =
  'h-11 w-full rounded-md border border-kawai-neutral bg-white px-3 text-sm text-kawai-black outline-none focus-visible:ring-2 focus-visible:ring-kawai-red'

const LABEL_CLASS =
  'mb-1 block text-[11px] font-semibold uppercase tracking-[0.06em] text-kawai-charcoal/60'

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
  const [pending, setPending] = useState<'dry' | 'lookup' | 'send' | null>(null)
  const [selectedDealer, setSelectedDealer] = useState<string | null>(null)
  const [pickerDealers, setPickerDealers] = useState<NearbyDealerOption[]>([])
  const [pickerCenter, setPickerCenter] = useState<{ lat: number; lng: number } | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  const set = (key: keyof typeof DEFAULT_LEAD) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setLead((prev) => ({ ...prev, [key]: e.target.value }))

  /**
   * Surface what's missing instead of silently no-op'ing — a dead button reads
   * as a broken tool. Returns true when the run may proceed.
   */
  const guard = (needsInbox: boolean): boolean => {
    const missing: string[] = []
    if (!password.trim()) missing.push('access password')
    if (!lead.zip.trim()) missing.push('ZIP / postal code')
    if (needsInbox && !recipients.trim()) missing.push('at least one test inbox')
    if (missing.length === 0) return true

    setResult({ success: false, message: `Fill in ${missing.join(', ')} first.` })
    return false
  }

  /** DRY RUN — routing only. */
  const runDry = async () => {
    if (pending || !guard(false)) return

    setPending('dry')
    setResult(null)
    setSelectedDealer(null)
    try {
      // Password is verified server-side on every call — this state only
      // controls whether we keep showing the input.
      const res = await testRsmRouting(lead.zip, password)
      if (res.success || res.message !== 'Incorrect password.') setUnlocked(true)
      setResult(res)
      setSelectedDealer(res.matchedDealerId ?? null)
    } catch {
      setResult({ success: false, message: 'Something went wrong running the test.' })
    } finally {
      setPending(null)
    }
  }

  /** Step 1 of the visitor flow — resolve dealers, then open the picker. */
  const startSimulation = async () => {
    if (pending || !guard(true)) return

    setPending('lookup')
    setResult(null)
    setSelectedDealer(null)
    try {
      const res = await testRsmRouting(lead.zip, password)
      if (res.success || res.message !== 'Incorrect password.') setUnlocked(true)
      setResult(res)
      if (!res.success) return

      setSelectedDealer(res.matchedDealerId ?? null)
      setPickerDealers(res.nearby ?? [])
      setPickerCenter(res.coords ?? null)
      setPickerOpen(true)
    } catch {
      setResult({ success: false, message: 'Something went wrong resolving nearby dealers.' })
    } finally {
      setPending(null)
    }
  }

  /** Step 2 — the operator answered the picker; send the resulting email. */
  const submitChoice = async (dealerId: string | null) => {
    if (pending) return

    setPending('send')
    try {
      const res = await sendTestRsmEmail({
        ...lead,
        password,
        recipients,
        selectedDealerId: dealerId,
        dealerChoiceMade: true,
      })
      setResult(res)
      setSelectedDealer(dealerId ?? res.matchedDealerId ?? null)
      setPickerOpen(false)
    } catch {
      setResult({ success: false, message: 'Something went wrong sending the test email.' })
      setPickerOpen(false)
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
          void runDry()
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
              <input
                id="zt-firstname"
                className={INPUT_CLASS}
                value={lead.firstname}
                onChange={set('firstname')}
              />
            </div>
            <div>
              <label className={LABEL_CLASS} htmlFor="zt-lastname">
                Last name
              </label>
              <input
                id="zt-lastname"
                className={INPUT_CLASS}
                value={lead.lastname}
                onChange={set('lastname')}
              />
            </div>
            <div>
              <label className={LABEL_CLASS} htmlFor="zt-email">
                Lead email (becomes Reply-To)
              </label>
              <input
                id="zt-email"
                type="email"
                className={INPUT_CLASS}
                value={lead.email}
                onChange={set('email')}
              />
            </div>
            <div>
              <label className={LABEL_CLASS} htmlFor="zt-phone">
                Phone
              </label>
              <input
                id="zt-phone"
                className={INPUT_CLASS}
                value={lead.phone}
                onChange={set('phone')}
              />
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
              <input
                id="zt-piano-type"
                className={INPUT_CLASS}
                value={lead.piano_type}
                onChange={set('piano_type')}
              />
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
            Each inbox receives the RSM email, plus the dealer email when you pick a dealer. No
            real RSM, dealer or corporate inbox is addressed, copied or BCC&rsquo;d — the envelopes production
            would use are reported below. No HubSpot, no Shopify.
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
            onClick={() => void startSimulation()}
            disabled={pending !== null}
            className="h-11 rounded-md bg-kawai-red px-6 text-sm font-semibold text-white transition-colors hover:bg-kawai-red/90 disabled:opacity-60"
          >
            {pending === 'lookup'
              ? 'Finding dealers…'
              : pending === 'send'
                ? 'Sending…'
                : 'Simulate lead submission'}
          </button>
        </div>
      </form>

      {/* — Post-submit dealer picker, exactly as a visitor would see it — */}
      <DealerChoiceModal
        isOpen={pickerOpen}
        zip={lead.zip}
        dealers={pickerDealers}
        center={pickerCenter}
        onChoose={(dealerId) => void submitChoice(dealerId)}
        onDismiss={() => setPickerOpen(false)}
        pending={pending === 'send'}
      />

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
                  <li key={`${s.kind}-${s.email}`} className="flex flex-wrap items-baseline gap-2 text-sm">
                    <span className={s.ok ? 'text-emerald-700' : 'text-kawai-red'}>
                      {s.ok ? '✓' : '✕'}
                    </span>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                        s.kind === 'dealer'
                          ? 'bg-kawai-red/10 text-kawai-red-700'
                          : 'bg-kawai-charcoal/10 text-kawai-charcoal',
                      )}
                    >
                      {s.kind === 'dealer' ? 'Dealer email' : 'RSM email'}
                    </span>
                    <span className="font-mono text-xs text-kawai-black">{s.email}</span>
                    {s.id && (
                      <span className="font-mono text-[11px] text-kawai-charcoal/50">{s.id}</span>
                    )}
                    {s.error && <span className="text-xs text-kawai-red">{s.error}</span>}
                  </li>
                ))}
              </ul>

              {/* — What the visitor picked — */}
              <div className="mt-4 border-t border-kawai-neutral/60 pt-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-kawai-charcoal/60">
                  Visitor&rsquo;s dealer choice
                </p>
                <p className="mt-1 text-sm text-kawai-charcoal">
                  {result.chosenDealer ? (
                    <>
                      <strong className="text-kawai-black">{result.chosenDealer.name}</strong>
                      {result.chosenDealer.location && ` · ${result.chosenDealer.location}`} ·{' '}
                      {result.chosenDealer.distance.toFixed(1)} mi
                    </>
                  ) : (
                    'Not sure — asked the RSM to recommend from the 5 nearest.'
                  )}
                </p>
              </div>

              {/* — Exactly who production would have delivered to, To/Cc/Bcc — */}
              {result.plan && result.plan.length > 0 && (
                <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-amber-800">
                    Live delivery held — nobody real was emailed
                  </p>
                  <ul className="mt-2 space-y-2">
                    {result.plan.map((d) => (
                      <li key={d.kind} className="text-sm">
                        <span className="font-semibold text-kawai-black">
                          {d.kind === 'dealer' ? 'Dealer email' : 'RSM email'}
                        </span>{' '}
                        {d.skipped ? (
                          <span className="text-kawai-charcoal/60">
                            — not produced ({d.skipped})
                          </span>
                        ) : (
                          <>
                            <span className="text-kawai-charcoal/70">would go to </span>
                            <span className="font-mono text-xs text-amber-900">{d.to}</span>
                            <span className="text-kawai-charcoal/70"> · CC </span>
                            <span className="font-mono text-xs text-amber-900">
                              {d.cc.length > 0 ? d.cc.join(', ') : 'none'}
                            </span>
                            <span className="text-kawai-charcoal/70"> · BCC </span>
                            <span className="font-mono text-xs text-amber-900">
                              {d.bcc.length > 0 ? d.bcc.join(', ') : 'none'}
                            </span>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2.5 text-xs text-kawai-charcoal/70">
                    Production holds both sends too. Enable with{' '}
                    <code>LEAD_NOTIFY_RSM_EMAIL=true</code> and{' '}
                    <code>LEAD_NOTIFY_DEALER_EMAIL=true</code> — until then it logs these same
                    envelopes instead of sending.
                  </p>
                </div>
              )}
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
            <p className="mt-2 text-xs text-kawai-charcoal/60">
              Shown here only — the email body no longer names the RSM, because the RSM is the
              recipient.
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
                    const isChosen = dealer.id === result.chosenDealer?.id
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
                          {isChosen && (
                            <span className="ml-2 rounded-full bg-kawai-red px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                              Visitor pick
                            </span>
                          )}
                          {isMatch && (
                            <span className="ml-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                              Routes to RSM
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
