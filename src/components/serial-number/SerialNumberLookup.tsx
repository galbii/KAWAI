'use client'

import { useState } from 'react'
import { lookupSerialNumber, getApproximateAge } from '@/lib/serial-numbers'
import type { LookupResult, LookupError } from '@/lib/serial-numbers'
import { cn } from '@/lib/utils'

/* ─── Data ─────────────────────────────────────────────────────────── */

const COUNTRY = {
  Japan:     { code: 'JP', label: 'Japan Production',      location: 'Hamamatsu, Japan'           },
  USA:       { code: 'US', label: 'U.S. Production',       location: 'Lincolnton, North Carolina' },
  Indonesia: { code: 'ID', label: 'Indonesia Production',  location: 'Surabaya, Indonesia'        },
} as const

const EXAMPLES = ['1856250', 'A49071', 'F049000', '303686']

const TIMELINE_START = 1927
const TIMELINE_END   = 2025

const ERA_MARKS = [
  { year: 1927, label: '1927' },
  { year: 1950, label: '1950' },
  { year: 1975, label: '1975' },
  { year: 2000, label: '2000' },
  { year: 2024, label: '2024' },
]

function pct(year: number) {
  return ((year - TIMELINE_START) / (TIMELINE_END - TIMELINE_START)) * 100
}

/* ─── Country code badge ─────────────────────────────────────────────── */

function CountryCode({ code }: { code: string }) {
  return (
    <span className="inline-flex items-center justify-center font-mono text-xs font-bold text-kawai-charcoal bg-kawai-pearl border border-kawai-neutral rounded px-1.5 py-0.5 tracking-wider">
      {code}
    </span>
  )
}

/* ─── Timeline ───────────────────────────────────────────────────────── */

function Timeline({ year }: { year: number }) {
  const pos = pct(year)
  return (
    <div className="px-8 pb-8 pt-4">
      {/* Era labels row */}
      <div className="relative h-6 mb-1">
        {ERA_MARKS.map(m => (
          <div
            key={m.year}
            className="absolute flex flex-col items-center"
            style={{ left: `${pct(m.year)}%`, transform: 'translateX(-50%)' }}
          >
            <span className="text-xs font-mono text-kawai-charcoal/65">{m.label}</span>
          </div>
        ))}
      </div>

      {/* Track */}
      <div className="relative h-5">
        <div className="absolute top-2 left-0 right-0 h-[2px] bg-kawai-neutral rounded-full" />
        <div
          className="absolute top-2 left-0 h-[2px] bg-kawai-red/40 rounded-full"
          style={{ width: `${pos}%` }}
        />
        {/* Tick marks */}
        {ERA_MARKS.map(m => (
          <div
            key={m.year}
            className="absolute top-0 w-px h-2 bg-kawai-neutral/80"
            style={{ left: `${pct(m.year)}%`, transform: 'translateX(-50%)' }}
          />
        ))}
        {/* Active dot */}
        <div
          className="absolute w-4 h-4 rounded-full bg-kawai-red"
          style={{
            left: `${pos}%`,
            top: '2px',
            transform: 'translateX(-50%) translateY(-25%)',
            boxShadow: '0 0 0 3px white, 0 0 0 5px rgba(225,25,34,0.25)',
            animation: 'dotBounce 0.55s cubic-bezier(0.34,1.56,0.64,1) both',
          }}
        />
      </div>

      <p className="text-center text-xs text-kawai-charcoal/65 tracking-widest uppercase mt-3">
        Kawai Production Timeline
      </p>
    </div>
  )
}

/* ─── Success card ───────────────────────────────────────────────────── */

function SuccessCard({ result }: { result: LookupResult }) {
  const c = COUNTRY[result.country]
  const age = getApproximateAge(result.year)

  return (
    <div style={{ animation: 'cardReveal 0.45s cubic-bezier(0.22,1,0.36,1) both' }}>
      <div className="bg-white rounded-2xl border border-kawai-neutral overflow-hidden shadow-[0_4px_40px_rgba(0,0,0,0.08)]">

        {/* Animated top line */}
        <div
          className="h-[2px] bg-kawai-red origin-left"
          style={{ animation: 'lineGrow 0.5s cubic-bezier(0.4,0,0.2,1) 0.1s both' }}
        />

        <div className="px-8 pt-8 pb-6 flex flex-col items-center text-center gap-5">

          {/* Country display — no emoji, two-line label */}
          <div
            className="inline-flex flex-col items-center gap-1 px-6 py-3 rounded-xl border border-kawai-neutral bg-kawai-pearl/60"
            style={{ animation: 'fadeUp 0.4s ease 0.15s both' }}
          >
            <span className="text-xs tracking-[0.18em] uppercase font-bold text-kawai-black">
              {c.label}
            </span>
            <span className="text-sm text-kawai-charcoal">
              {c.location}
            </span>
          </div>

          {/* Year — the centrepiece */}
          <div style={{ animation: 'yearStamp 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.1s both' }}>
            <div
              className="text-kawai-black tabular-nums leading-none"
              style={{
                fontFamily: 'var(--font-family-cormorant)',
                fontSize: 'clamp(5.5rem, 20vw, 9.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
              }}
            >
              {result.year}
            </div>
            {!result.isKxAmbiguous && result.yearEnd && (
              <div className="text-sm text-kawai-charcoal/70 mt-1">
                through {result.yearEnd}
              </div>
            )}
          </div>

          {/* Age */}
          <div
            className="flex items-center gap-3"
            style={{ animation: 'fadeUp 0.4s ease 0.25s both' }}
          >
            <div className="h-px w-8 bg-kawai-neutral" />
            <span className="text-base text-kawai-charcoal">
              Approximately <strong className="text-kawai-black font-semibold">{age} years old</strong>
            </span>
            <div className="h-px w-8 bg-kawai-neutral" />
          </div>
        </div>

        {/* Timeline */}
        <Timeline year={result.year} />

        {/* Disclaimer */}
        <div className="border-t border-kawai-neutral px-8 py-4 bg-kawai-pearl/50">
          <p className="text-center text-xs text-kawai-charcoal/70 leading-relaxed">
            Dates are approximate. Serial numbers reflect the first produced for each year and may vary by model.
          </p>
        </div>
      </div>

      {/* KX notice */}
      {result.isKxAmbiguous && result.kxYear && (
        <div
          className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-6 py-5"
          style={{ animation: 'fadeUp 0.4s ease 0.3s both' }}
        >
          <p className="text-xs font-bold tracking-[0.15em] uppercase text-amber-800 mb-2">
            KX Model also possible
          </p>
          <p className="text-sm text-amber-800 leading-relaxed">
            KX upright models share this serial range with a separate sequence. If yours is a KX,
            the production year would be{' '}
            <strong className="font-semibold">
              {result.kxYear}{result.kxYearEnd ? `–${result.kxYearEnd}` : ''}
            </strong>.{' '}
            Check the model name on your piano's fallboard.
          </p>
        </div>
      )}
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────────────────── */

export function SerialNumberLookup() {
  const [input, setInput]     = useState('')
  const [result, setResult]   = useState<LookupResult | LookupError | null>(null)
  const [animKey, setAnimKey] = useState(0)

  function submit(value?: string) {
    const serial = (value ?? input).trim()
    if (!serial) return
    if (value) setInput(value)
    setResult(lookupSerialNumber(serial))
    setAnimKey(k => k + 1)
  }

  const success = result && !('type' in result) ? result : null
  const error   = result && 'type' in result    ? result : null

  return (
    <>
      <style>{`
        @keyframes yearStamp {
          0%   { opacity: 0; transform: scale(0.82) translateY(12px); }
          65%  { opacity: 1; transform: scale(1.03) translateY(0);    }
          100% { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        @keyframes lineGrow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes dotBounce {
          0%   { opacity: 0; transform: translateX(-50%) translateY(-25%) scale(0);    }
          65%  { opacity: 1; transform: translateX(-50%) translateY(-25%) scale(1.35); }
          100% { opacity: 1; transform: translateX(-50%) translateY(-25%) scale(1);    }
        }
        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      <div className="min-h-screen bg-white relative overflow-hidden font-[family-name:var(--font-brand-sans)]">

        {/* Dot-grid texture */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, #DBDBDB 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.45,
          }}
        />

        {/* Top red rule */}
        <div className="relative h-[2px] bg-kawai-red w-full" />

        <div className="relative max-w-xl mx-auto px-6 pt-14 pb-24 space-y-10">

          {/* ── Header ── */}
          <header className="text-center space-y-4">
            <p className="text-xs tracking-[0.28em] uppercase font-semibold text-kawai-red">
              Kawai Piano
            </p>
            <h1
              className="text-kawai-black leading-[1.05]"
              style={{
                fontFamily: 'var(--font-brand-serif)',
                fontSize: 'clamp(2rem, 6vw, 3.25rem)',
                fontWeight: 600,
              }}
            >
              Serial Number Lookup
            </h1>
            <p className="text-base text-kawai-charcoal leading-relaxed max-w-sm mx-auto">
              Enter the serial number from your Kawai acoustic piano to discover when and where it was crafted.
            </p>
            <div className="flex justify-center pt-1">
              <div className="w-10 h-[2px] bg-kawai-red" />
            </div>
          </header>

          {/* ── Input card ── */}
          <div className="bg-white rounded-2xl border border-kawai-neutral shadow-[0_2px_20px_rgba(0,0,0,0.06)] p-6 space-y-4">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="e.g. 1856250 or A49071"
              maxLength={12}
              autoComplete="off"
              spellCheck={false}
              className={cn(
                'w-full font-mono text-xl md:text-2xl text-kawai-black',
                'placeholder:text-kawai-charcoal/40 placeholder:font-sans',
                'bg-kawai-pearl/70 rounded-xl px-5 py-4',
                'border border-kawai-neutral',
                'focus:outline-none focus:ring-2 focus:ring-kawai-red/25 focus:border-kawai-red focus:bg-white',
                'transition-all duration-200',
              )}
            />

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => submit()}
                disabled={!input.trim()}
                className={cn(
                  'flex items-center gap-2 px-6 py-3 rounded-xl',
                  'text-sm font-semibold tracking-[0.08em] uppercase text-white bg-kawai-red',
                  'shadow-[0_2px_14px_rgba(225,25,34,0.28)]',
                  'hover:bg-kawai-red-700 hover:shadow-[0_4px_22px_rgba(225,25,34,0.4)]',
                  'active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed',
                  'transition-all duration-150',
                )}
              >
                Look Up
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

              <div className="flex gap-1.5 flex-wrap justify-end">
                {EXAMPLES.map(s => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="text-xs font-mono px-2.5 py-1.5 rounded-lg border border-kawai-charcoal/30 text-kawai-charcoal hover:border-kawai-red/60 hover:text-kawai-red hover:bg-kawai-red/5 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Error ── */}
          {error && (
            <div
              key={`err-${animKey}`}
              className="bg-white border border-kawai-neutral rounded-xl px-6 py-4"
              style={{ animation: 'fadeUp 0.3s ease both' }}
            >
              <p className="text-sm text-kawai-charcoal leading-relaxed">{error.message}</p>
            </div>
          )}

          {/* ── Result ── */}
          {success && (
            <div key={`res-${animKey}`}>
              <SuccessCard result={success} />
            </div>
          )}

          {/* ── Reference guide ── */}
          <div className="space-y-3">
            <p className="text-xs tracking-[0.22em] uppercase font-semibold text-kawai-charcoal">
              Serial Number Format
            </p>
            <div className="bg-white rounded-xl border border-kawai-neutral overflow-hidden">
              {[
                { code: 'JP', prefix: 'No letter',  country: 'Japan',      range: '1927–present' },
                { code: 'US', prefix: 'Starts A',   country: 'USA',        range: '1988–2004'    },
                { code: 'ID', prefix: 'Starts F',   country: 'Indonesia',  range: '2003–present' },
              ].map((row, i) => (
                <div
                  key={row.prefix}
                  className={cn('flex items-center gap-4 px-5 py-4', i > 0 && 'border-t border-kawai-neutral')}
                >
                  <CountryCode code={row.code} />
                  <code className="font-mono text-xs text-kawai-charcoal/75 w-16 shrink-0">{row.prefix}</code>
                  <span className="text-sm text-kawai-black font-semibold flex-1">{row.country}</span>
                  <span className="font-mono text-xs text-kawai-charcoal/65">{row.range}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-kawai-charcoal/65 leading-relaxed">
              Any letter other than A or F at the start of a serial number should be disregarded when looking up the date.
            </p>
          </div>

        </div>
      </div>
    </>
  )
}
