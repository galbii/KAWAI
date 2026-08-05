'use client'

import { useState } from 'react'
import { testRsmRouting, type ZipTestResult } from '@/lib/actions/test-rsm-routing'
import { DealerMapLibre } from '../find-a-dealer/components/DealerMapLibre'
import type { DealerWithDistance } from '../find-a-dealer/types'
import { cn } from '@/lib/utils'

/**
 * Internal ZIP → RSM routing test tool. Text input + dry-run action call,
 * result panel showing the would-be recipient, and the shared find-a-dealer
 * map (DealerMapLibre) centered on the geocoded ZIP with the ranked candidate
 * dealers as markers.
 */
export function ZipTestTool() {
  const [zip, setZip] = useState('')
  const [result, setResult] = useState<ZipTestResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedDealer, setSelectedDealer] = useState<string | null>(null)

  const run = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!zip.trim() || loading) return
    setLoading(true)
    setResult(null)
    setSelectedDealer(null)
    try {
      const res = await testRsmRouting(zip)
      setResult(res)
      setSelectedDealer(res.matchedDealerId ?? null)
    } catch {
      setResult({ success: false, message: 'Something went wrong running the test.' })
    } finally {
      setLoading(false)
    }
  }

  const mapDealers: DealerWithDistance[] =
    result?.candidates?.map(({ dealer, distance }) => ({ ...dealer, distance })) ?? []

  return (
    <div className="space-y-6">
      {/* — Input — */}
      <form onSubmit={run} className="flex gap-3">
        <input
          type="text"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          aria-label="ZIP or postal code to test"
          placeholder="90210 or M5V 2T6"
          className="h-11 w-full max-w-xs rounded-md border border-kawai-neutral bg-white px-4 text-sm text-kawai-black outline-none focus-visible:ring-2 focus-visible:ring-kawai-red"
        />
        <button
          type="submit"
          disabled={loading}
          className="h-11 rounded-md bg-kawai-red px-6 text-sm font-semibold text-white transition-colors hover:bg-kawai-red/90 disabled:opacity-60"
        >
          {loading ? 'Testing…' : 'Test Routing'}
        </button>
      </form>

      {/* — Result — */}
      {result && !result.success && (
        <p role="alert" className="text-sm font-medium text-kawai-red">
          {result.message}
        </p>
      )}

      {result?.success && (
        <>
          <div
            className={cn(
              'rounded-lg border p-5',
              result.usedFallback
                ? 'border-amber-300 bg-amber-50'
                : 'border-emerald-300 bg-emerald-50',
            )}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-kawai-charcoal/60">
              Email would be sent to
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
