'use client'

import { useState } from 'react'
import { lookupSerialNumber } from '@/lib/serial-numbers'
import type { LookupResult, DisambiguationResult, LookupError, Candidate } from '@/lib/serial-numbers'
import { cn } from '@/lib/utils'

/* ─── Data ─────────────────────────────────────────────────────────── */

const COUNTRY_LABEL = {
  Japan:     'Japan',
  USA:       'United States',
  Indonesia: 'Indonesia',
} as const

const EXAMPLES = ['1856250', '2500000', 'A49071', 'F049000']

const TIMELINE_START = 1927
const TIMELINE_END   = 2026

const ERA_MARKS = [1927, 1950, 1975, 2000, 2026]

function pct(year: number) {
  const clamped = Math.min(Math.max(year, TIMELINE_START), TIMELINE_END)
  return ((clamped - TIMELINE_START) / (TIMELINE_END - TIMELINE_START)) * 100
}

/* Boundary cases aren't pinned to one year — show the span of possibility
   (e.g. "1993–1994") instead of a single year plus a caveat. */
function yearLabel(year: number, confidence: 'exact' | 'boundary', boundaryYear: number | null) {
  if (confidence === 'boundary' && boundaryYear != null) {
    return `${Math.min(year, boundaryYear)}–${Math.max(year, boundaryYear)}`
  }
  return String(year)
}

/* A normalized shape both a confident result and a chosen candidate feed into. */
interface Readout {
  year: number
  confidence: 'exact' | 'boundary'
  boundaryYear: number | null
  country: keyof typeof COUNTRY_LABEL
  seriesLabel: string
  serialNormalized: string
}

/* ─── Timeline ───────────────────────────────────────────────────────── */
/* The 1927–2026 production span as a single track; the result year sits on it
   as a marker, with a muted second marker for a boundary (adjacent) year. */

function Timeline({ year, altYear }: { year: number; altYear?: number | null }) {
  const pos = pct(year)
  const altPos = altYear != null ? pct(altYear) : null

  return (
    <div className="px-6 sm:px-8 pt-8 pb-7">
      {/* Track */}
      <div className="relative h-3.5">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-kawai-neutral" />
        {/* Progress fill to the result year */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-px bg-kawai-red/40 origin-left"
          style={{ width: `${pos}%`, animation: 'growX 0.5s cubic-bezier(0.4,0,0.2,1) both' }}
        />
        {/* Era ticks */}
        {ERA_MARKS.map(m => (
          <span
            key={m}
            className="absolute top-1/2 -translate-y-1/2 w-px h-2 bg-kawai-neutral"
            style={{ left: `${pct(m)}%` }}
          />
        ))}
        {/* Boundary-year marker (muted) */}
        {altPos != null && (
          <span
            className="absolute top-1/2 z-10 h-2.5 w-2.5 rounded-full border border-kawai-charcoal/40 bg-white"
            style={{ left: `${altPos}%`, transform: 'translate(-50%,-50%)' }}
          />
        )}
        {/* Primary marker */}
        <span
          className="absolute top-1/2 z-20 h-3.5 w-3.5 rounded-full bg-kawai-red"
          style={{
            left: `${pos}%`,
            transform: 'translate(-50%,-50%)',
            boxShadow: '0 0 0 3px white, 0 0 0 5px rgba(225,25,34,0.2)',
            animation: 'dotPop 0.45s cubic-bezier(0.34,1.56,0.64,1) both',
          }}
        />
      </div>

      {/* Era scale */}
      <div className="relative mt-4 h-4">
        {ERA_MARKS.map(m => (
          <span
            key={m}
            className="absolute font-mono text-[11px] text-kawai-charcoal/55 tabular-nums"
            style={{
              left: `${pct(m)}%`,
              transform:
                m === TIMELINE_START ? 'translateX(0)' : m === TIMELINE_END ? 'translateX(-100%)' : 'translateX(-50%)',
            }}
          >
            {m}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─── Result readout ─────────────────────────────────────────────────── */

function ReadoutField({
  label,
  value,
  sub,
  big,
}: {
  label: string
  value: string
  sub?: string | undefined
  big?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5 px-6 sm:px-8 py-5">
      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-kawai-charcoal/55">
        {label}
      </span>
      <span
        className={cn(
          'font-mono text-kawai-black tabular-nums leading-none',
          big ? 'text-5xl sm:text-6xl font-medium tracking-tight' : 'text-2xl sm:text-3xl',
        )}
      >
        {value}
      </span>
      {sub && <span className="text-sm text-kawai-charcoal/70 leading-snug">{sub}</span>}
    </div>
  )
}

function ResultCard({ readout, onReset }: { readout: Readout; onReset?: (() => void) | undefined }) {
  const isBoundary = readout.confidence === 'boundary' && readout.boundaryYear != null

  return (
    <div style={{ animation: 'revealUp 0.4s cubic-bezier(0.22,1,0.36,1) both' }}>
      {/* Echo the dated serial + which series it was read against */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-6 sm:px-8 pt-5 pb-1">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-kawai-charcoal/55">
          Serial
        </span>
        <span className="font-mono text-sm text-kawai-charcoal tracking-[0.12em]">
          {readout.serialNormalized}
        </span>
        <span className="text-[11px] text-kawai-charcoal/55">· {readout.seriesLabel}</span>
      </div>

      {/* Readout: production year + manufacturing country */}
      <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr] sm:divide-x divide-kawai-neutral/70">
        <ReadoutField
          label={isBoundary ? 'Production Years' : 'Production Year'}
          value={yearLabel(readout.year, readout.confidence, readout.boundaryYear)}
          big
        />
        <ReadoutField label="Manufacturing Country" value={COUNTRY_LABEL[readout.country]} />
      </div>

      {/* Timeline */}
      <div className="border-t border-kawai-neutral/70">
        <Timeline year={readout.year} altYear={isBoundary ? readout.boundaryYear : null} />
      </div>

      {/* Back to the other candidates, when this came from a disambiguation */}
      {onReset && (
        <div className="border-t border-kawai-neutral/70 px-6 sm:px-8 py-3.5">
          <button
            onClick={onReset}
            className="text-sm text-kawai-red hover:text-kawai-red-700 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red/30 rounded"
          >
            ← Not it? See the other matches
          </button>
        </div>
      )}

      {/* Disclaimer */}
      <div className="border-t border-kawai-neutral/70 px-6 sm:px-8 py-3.5 bg-kawai-pearl/50">
        <p className="text-xs text-kawai-charcoal/65 leading-relaxed">
          Dates are approximate — serial figures mark the first unit built each year and vary by model.
        </p>
      </div>
    </div>
  )
}

/* ─── Disambiguation (prefix required) ───────────────────────────────── */

function PrefixBadge({ prefix }: { prefix: string | null }) {
  return (
    <span
      className={cn(
        'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded font-mono text-sm font-semibold',
        prefix
          ? 'bg-kawai-red/10 text-kawai-red border border-kawai-red/30'
          : 'bg-kawai-neutral/40 text-kawai-charcoal/70 border border-kawai-neutral text-[10px] leading-tight',
      )}
    >
      {prefix ?? 'None'}
    </span>
  )
}

function DisambiguationCard({
  result,
  onChoose,
}: {
  result: DisambiguationResult
  onChoose: (c: Candidate) => void
}) {
  return (
    <div
      className="border-t border-kawai-neutral/70"
      style={{ animation: 'revealUp 0.4s cubic-bezier(0.22,1,0.36,1) both' }}
    >
      <div className="px-6 sm:px-8 pt-5 pb-3">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-kawai-red mb-1.5">
          Prefix needed
        </p>
        <p className="text-sm text-kawai-charcoal leading-relaxed">
          <span className="font-mono text-kawai-black">{result.serialNormalized}</span> appears in
          more than one Kawai numbering series. Check the plate on your piano for a letter in front of
          the number, then choose the match below.
        </p>
      </div>

      <ul className="divide-y divide-kawai-neutral/70 border-t border-kawai-neutral/70">
        {result.candidates.map(c => (
          <li key={c.id}>
            <button
              onClick={() => onChoose(c)}
              className="group flex w-full items-center gap-4 px-6 sm:px-8 py-4 text-left hover:bg-kawai-pearl/60 focus:outline-none focus-visible:bg-kawai-pearl/60 transition-colors"
            >
              <PrefixBadge prefix={c.prefix} />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-kawai-black">
                  {c.prefix ? `Prefix “${c.prefix}”` : 'No prefix (plain number)'}
                </span>
                <span className="block text-xs text-kawai-charcoal/70 truncate">{c.seriesLabel}</span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block font-mono text-lg font-medium text-kawai-black tabular-nums">
                  {yearLabel(c.year, c.confidence, c.boundaryYear)}
                </span>
                <span className="block text-[11px] text-kawai-charcoal/55">
                  {COUNTRY_LABEL[c.country]}
                </span>
              </span>
              <svg
                className="w-4 h-4 shrink-0 text-kawai-charcoal/30 transition-transform group-hover:translate-x-0.5 group-hover:text-kawai-red"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </li>
        ))}
      </ul>

      <div className="border-t border-kawai-neutral/70 px-6 sm:px-8 py-3.5 bg-kawai-pearl/50">
        <p className="text-xs text-kawai-charcoal/65 leading-relaxed">
          The letter prefix is stamped on the iron plate alongside the number. If yours has none, use
          the model name on the fallboard to tell a vintage grand from a newer instrument.
        </p>
      </div>
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────────────────── */

export function SerialNumberLookup() {
  const [input, setInput]       = useState('')
  const [result, setResult]     = useState<LookupResult | DisambiguationResult | LookupError | null>(null)
  const [chosen, setChosen]     = useState<Readout | null>(null)
  const [animKey, setAnimKey]   = useState(0)

  function submit(value?: string) {
    const serial = (value ?? input).trim()
    if (!serial) return
    if (value) setInput(value)
    setResult(lookupSerialNumber(serial))
    setChosen(null)
    setAnimKey(k => k + 1)
  }

  const error        = result?.kind === 'error' ? result : null
  const confident    = result?.kind === 'result' ? result : null
  const disambig     = result?.kind === 'disambiguation' ? result : null

  // A confident result, or a candidate the user picked from a disambiguation.
  const readout: Readout | null =
    chosen ??
    (confident
      ? {
          year: confident.year,
          confidence: confident.confidence,
          boundaryYear: confident.boundaryYear,
          country: confident.country,
          seriesLabel: confident.seriesLabel,
          serialNormalized: confident.serialNormalized,
        }
      : null)

  function chooseCandidate(c: Candidate) {
    setChosen({
      year: c.year,
      confidence: c.confidence,
      boundaryYear: c.boundaryYear,
      country: c.country,
      seriesLabel: c.seriesLabel,
      serialNormalized: `${c.prefix ?? ''}${disambig?.serialNormalized ?? ''}`,
    })
    setAnimKey(k => k + 1)
  }

  return (
    <>
      <style>{`
        @keyframes growX {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes dotPop {
          0%   { opacity: 0; transform: translate(-50%,-50%) scale(0);    }
          70%  { opacity: 1; transform: translate(-50%,-50%) scale(1.25); }
          100% { opacity: 1; transform: translate(-50%,-50%) scale(1);    }
        }
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="min-h-screen bg-kawai-pearl font-[family-name:var(--font-brand-sans)]">
        {/* Brand rule */}
        <div className="h-[3px] bg-kawai-red w-full" />

        <div className="max-w-2xl mx-auto px-5 sm:px-6 pt-12 sm:pt-16 pb-24">
          <div>

            {/* ── Main column ── */}
            <div className="min-w-0">

          {/* ── Header ── */}
          <header className="mb-9">
            <img
              src="/images/logos/kawai-logo-new-red.png"
              alt="Kawai"
              className="h-6 w-auto mb-4"
            />
            <h1
              className="text-kawai-black leading-[1.04] tracking-[-0.02em] font-semibold"
              style={{ fontSize: 'clamp(2rem, 6vw, 3rem)' }}
            >
              Serial Number Lookup
            </h1>
            <p className="mt-4 text-base sm:text-lg text-kawai-charcoal leading-relaxed max-w-lg">
              Find when your piano was built. Enter the serial number stamped on the
              iron plate or printed on the fallboard — include any letter in front of it.
            </p>
          </header>

          {/* ── Instrument sheet ── */}
          <div className="bg-white rounded-lg border border-kawai-neutral shadow-[0_1px_2px_rgba(0,0,0,0.04),0_18px_40px_-24px_rgba(30,27,22,0.35)] overflow-hidden">

            {/* Input zone */}
            <div className="p-6 sm:p-8">
              <label
                htmlFor="serial-input"
                className="block font-mono text-[10px] tracking-[0.2em] uppercase text-kawai-charcoal/55 mb-2.5"
              >
                Serial Number
              </label>

              <div className="flex flex-col sm:flex-row rounded-md border border-kawai-neutral bg-kawai-pearl/60 focus-within:border-kawai-red focus-within:bg-white focus-within:ring-2 focus-within:ring-kawai-red/20 transition-all duration-200">
                <input
                  id="serial-input"
                  type="text"
                  inputMode="text"
                  value={input}
                  onChange={e => setInput(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && submit()}
                  placeholder="e.g. 1856250 or A49071"
                  maxLength={12}
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="Piano serial number, including any letter prefix"
                  className="flex-1 min-w-0 bg-transparent font-mono text-2xl sm:text-3xl tracking-[0.14em] text-kawai-black placeholder:text-kawai-charcoal/30 placeholder:text-lg placeholder:tracking-normal px-5 py-4 focus:outline-none"
                />
                <button
                  onClick={() => submit()}
                  disabled={!input.trim()}
                  className={cn(
                    'group flex items-center justify-center gap-2 px-7 py-4 shrink-0',
                    'border-t sm:border-t-0 sm:border-l border-kawai-neutral',
                    'text-sm font-semibold tracking-[0.08em] uppercase text-white bg-kawai-red',
                    'hover:bg-kawai-red-700 active:bg-kawai-red-700',
                    'disabled:bg-kawai-neutral disabled:text-white/80 disabled:cursor-not-allowed',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red/40 focus-visible:ring-offset-2',
                    'transition-colors duration-150',
                  )}
                >
                  Look up
                  <svg className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>

              {/* Examples */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-kawai-charcoal/45 mr-1">
                  Try
                </span>
                {EXAMPLES.map(s => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="font-mono text-xs tracking-[0.06em] px-2.5 py-1.5 rounded border border-kawai-neutral text-kawai-charcoal hover:border-kawai-red/50 hover:text-kawai-red focus:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red/30 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                key={`err-${animKey}`}
                className="border-t border-kawai-neutral/70 px-6 sm:px-8 py-5 flex gap-3.5"
                style={{ animation: 'revealUp 0.3s ease both' }}
              >
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-kawai-red" aria-hidden="true" />
                <div>
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-kawai-red mb-1">
                    No match
                  </p>
                  <p className="text-sm text-kawai-charcoal leading-relaxed">{error.message}</p>
                </div>
              </div>
            )}

            {/* Disambiguation — pick the prefix */}
            {disambig && !chosen && (
              <div key={`amb-${animKey}`}>
                <DisambiguationCard result={disambig} onChoose={chooseCandidate} />
              </div>
            )}

            {/* Confident result, or a chosen candidate */}
            {readout && (
              <div key={`res-${animKey}`} className="border-t border-kawai-neutral/70">
                <ResultCard
                  readout={readout}
                  onReset={disambig ? () => { setChosen(null); setAnimKey(k => k + 1) } : undefined}
                />
              </div>
            )}
          </div>

            </div>{/* /main column */}

          </div>
        </div>
      </div>
    </>
  )
}
