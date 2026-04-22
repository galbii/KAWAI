'use client'

import { useState, useEffect, useRef } from 'react'
import type { GrandSaleProduct } from '@/lib/payload/queries'

interface TradeInCalculatorProps {
  products: GrandSaleProduct[]
}

function formatUSD(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function useAnimatedValue(target: number, duration = 750) {
  const [current, setCurrent] = useState(0)
  const animRef = useRef<number | null>(null)
  const fromRef = useRef(0)

  useEffect(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    const start = fromRef.current
    const end = target
    const startTime = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1)
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      setCurrent(Math.round(start + (end - start) * eased))
      if (t < 1) animRef.current = requestAnimationFrame(tick)
      else fromRef.current = target
    }
    animRef.current = requestAnimationFrame(tick)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [target, duration])

  return current
}

const APPRAISAL_MIN = 500
const APPRAISAL_MAX = 15000
const KAWAI_BONUS = 500

type Step = 1 | 2 | 3
type RevealPhase = 'calculating' | 'piano' | 'bonus' | 'total' | 'cta'

export function TradeInCalculator({ products: _ }: TradeInCalculatorProps) {
  const [step, setStep] = useState<Step>(1)
  const [appraisalValue, setAppraisalValue] = useState(3500)
  const [pianoBrand, setPianoBrand] = useState('')
  const [pianoModel, setPianoModel] = useState('')
  const [phase, setPhase] = useState<RevealPhase>('calculating')

  const totalCredit = appraisalValue + KAWAI_BONUS
  const animTotal = useAnimatedValue(
    phase === 'total' || phase === 'cta' ? totalCredit : 0,
    900
  )

  const sliderPct = ((appraisalValue - APPRAISAL_MIN) / (APPRAISAL_MAX - APPRAISAL_MIN)) * 100

  useEffect(() => {
    if (step !== 3) return
    setPhase('calculating')
    const timers = [
      setTimeout(() => setPhase('piano'),  1200),
      setTimeout(() => setPhase('bonus'),  2100),
      setTimeout(() => setPhase('total'),  2900),
      setTimeout(() => setPhase('cta'),    4000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [step])

  const reset = () => {
    setStep(1)
    setPianoBrand('')
    setPianoModel('')
    setPhase('calculating')
  }

  return (
    <section id="trade-calculator" className="bg-kawai-black/90 backdrop-blur-md py-24 md:py-32">
      <style>{`
        /* ── Slider ── */
        .tc-range { -webkit-appearance: none; appearance: none; width: 100%; height: 1px; border-radius: 0; cursor: pointer; outline: none; }
        .tc-range::-webkit-slider-thumb {
          -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%;
          background: #E11922; margin-top: -8.5px; cursor: pointer;
          box-shadow: 0 0 0 3px rgba(225,25,34,0.18), 0 0 14px rgba(225,25,34,0.35);
          transition: box-shadow 0.25s ease, transform 0.2s ease;
        }
        .tc-range:hover::-webkit-slider-thumb {
          box-shadow: 0 0 0 5px rgba(225,25,34,0.22), 0 0 22px rgba(225,25,34,0.5);
          transform: scale(1.1);
        }
        .tc-range::-moz-range-thumb {
          width: 18px; height: 18px; border-radius: 50%; background: #E11922; border: none;
          box-shadow: 0 0 0 3px rgba(225,25,34,0.18);
        }

        /* ── Step entrance ── */
        @keyframes tc-step-enter {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .tc-step { animation: tc-step-enter 0.6s cubic-bezier(0.22,1,0.36,1) both; }

        /* ── Calculating bars ── */
        @keyframes tc-bar {
          0%, 100% { transform: scaleY(0.25); opacity: 0.25; }
          50%       { transform: scaleY(1);    opacity: 1; }
        }
        .tc-bar   { animation: tc-bar 1s ease-in-out infinite; transform-origin: bottom; }
        .tc-bar-b { animation: tc-bar 1s ease-in-out 0.18s infinite; transform-origin: bottom; }
        .tc-bar-c { animation: tc-bar 1s ease-in-out 0.36s infinite; transform-origin: bottom; }
        .tc-bar-d { animation: tc-bar 1s ease-in-out 0.54s infinite; transform-origin: bottom; }
        .tc-bar-e { animation: tc-bar 1s ease-in-out 0.72s infinite; transform-origin: bottom; }

        /* ── Piano line ── */
        @keyframes tc-line-in {
          from { opacity: 0; transform: translateX(-14px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .tc-line { animation: tc-line-in 0.55s cubic-bezier(0.22,1,0.36,1) both; }

        /* ── Bonus pop ── */
        @keyframes tc-bonus {
          0%   { opacity: 0; transform: scaleX(0.85) scaleY(0.7) translateY(10px); }
          55%  { transform: scaleX(1.02) scaleY(1.04) translateY(-2px); }
          80%  { transform: scaleX(0.99) scaleY(0.99); }
          100% { opacity: 1; transform: scaleX(1) scaleY(1) translateY(0); }
        }
        .tc-bonus { animation: tc-bonus 0.7s cubic-bezier(0.34,1.56,0.64,1) both; }

        /* Bonus shimmer sweep */
        @keyframes tc-sweep {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .tc-sweep { animation: tc-sweep 0.9s ease both 0.15s; }

        /* ── Gold total ── */
        @keyframes tc-total {
          from { opacity: 0; transform: translateY(10px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .tc-total { animation: tc-total 0.65s cubic-bezier(0.22,1,0.36,1) both; }

        /* ── CTA ── */
        @keyframes tc-cta {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .tc-cta { animation: tc-cta 0.75s cubic-bezier(0.22,1,0.36,1) both; }

        /* ── Inputs ── */
        .tc-input {
          background: transparent; border: none; border-bottom: 1px solid rgba(250,248,245,0.1);
          color: #FAF8F5; width: 100%; padding: 1rem 0; font-size: 1.25rem; outline: none;
          font-family: inherit; transition: border-color 0.25s ease;
        }
        .tc-input::placeholder { color: rgba(250,248,245,0.18); font-style: italic; }
        .tc-input:focus { border-bottom-color: rgba(225,25,34,0.45); }
      `}</style>

      <div className="max-w-2xl mx-auto px-6">

        {/* ── Header bar ── */}
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
            <div className="h-px w-6 bg-kawai-red/35" />
            <span className="text-kawai-red/45 text-xs tracking-[0.3em] uppercase font-medium">
              Claim Your Bonus
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {([1, 2, 3] as const).map((s) => (
              <div
                key={s}
                className="rounded-full transition-all duration-500 ease-out"
                style={{
                  width:      s === step ? '1.6rem' : '0.28rem',
                  height:     '0.28rem',
                  background: s === step ? '#E11922' : s < step ? 'rgba(225,25,34,0.38)' : 'rgba(255,255,255,0.13)',
                }}
              />
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            STEP 1 — Estimated value
        ══════════════════════════════════════════ */}
        {step === 1 && (
          <div className="tc-step">
            <p className="text-kawai-pearl/25 text-sm tracking-[0.25em] uppercase text-center mb-8">
              What is your piano estimated at?
            </p>

            {/* Hero number */}
            <div className="text-center mb-12">
              <div
                className="font-[family-name:var(--font-family-cormorant)] text-kawai-pearl tabular-nums leading-none"
                style={{ fontSize: 'clamp(6rem, 16vw, 10rem)' }}
              >
                {formatUSD(appraisalValue)}
              </div>
              <p className="text-kawai-pearl/20 text-sm mt-4 tracking-wide italic font-[family-name:var(--font-family-cormorant)]">
                estimated value
              </p>
            </div>

            {/* Slider */}
            <div className="mb-3">
              <input
                type="range"
                min={APPRAISAL_MIN}
                max={APPRAISAL_MAX}
                step={100}
                value={appraisalValue}
                onChange={(e) => setAppraisalValue(Number(e.target.value))}
                className="tc-range"
                style={{
                  background: `linear-gradient(to right, #E11922 ${sliderPct}%, rgba(255,255,255,0.08) ${sliderPct}%)`,
                }}
              />
            </div>
            <div className="flex justify-between text-kawai-pearl/30 text-sm tracking-wide mb-14">
              <span>{formatUSD(APPRAISAL_MIN)}</span>
              <span>{formatUSD(APPRAISAL_MAX)}</span>
            </div>

            <div className="h-px bg-white/5 mb-10" />

            <button
              onClick={() => setStep(2)}
              className="w-full flex items-center justify-between px-7 py-5 border border-white/10 hover:border-kawai-red/35 text-kawai-pearl/50 hover:text-kawai-pearl text-sm tracking-[0.2em] uppercase transition-all duration-300 group"
            >
              <span>Continue</span>
              <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════
            STEP 2 — Brand + model
        ══════════════════════════════════════════ */}
        {step === 2 && (
          <div className="tc-step">

            {/* Top row: back + confirmed value */}
            <div className="flex items-center justify-between mb-14">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-kawai-pearl/30 hover:text-kawai-pearl/60 text-xs tracking-[0.2em] uppercase transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                Back
              </button>
              <span className="font-[family-name:var(--font-family-cormorant)] text-kawai-pearl/30 tabular-nums" style={{ fontSize: '2rem' }}>
                {formatUSD(appraisalValue)}
              </span>
            </div>

            {/* Heading */}
            <h2
              className="font-[family-name:var(--font-family-cormorant)] font-light leading-[1.05] mb-14"
              style={{ fontSize: 'clamp(3rem, 7vw, 5rem)' }}
            >
              <span className="text-kawai-pearl">Tell us about</span>
              <br />
              <span className="text-kawai-pearl/30">your piano.</span>
            </h2>

            {/* Fields */}
            <div className="space-y-10 mb-14">
              <div>
                <label className="text-kawai-pearl/35 text-xs tracking-[0.22em] uppercase block mb-3">
                  Brand <span className="text-kawai-red/60">*</span>
                </label>
                <input
                  type="text"
                  value={pianoBrand}
                  onChange={(e) => setPianoBrand(e.target.value)}
                  placeholder="Yamaha, Steinway, Baldwin…"
                  className="tc-input"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-kawai-pearl/35 text-xs tracking-[0.22em] uppercase block mb-3">
                  Model
                  <span className="text-kawai-pearl/20 ml-2 normal-case tracking-normal text-xs">— optional</span>
                </label>
                <input
                  type="text"
                  value={pianoModel}
                  onChange={(e) => setPianoModel(e.target.value)}
                  placeholder="U1, Baby Grand, Studio Upright…"
                  className="tc-input"
                />
              </div>
            </div>

            {/* Reveal button */}
            <button
              onClick={() => setStep(3)}
              disabled={!pianoBrand.trim()}
              className="w-full flex items-center justify-center gap-3 px-7 py-5 bg-kawai-red hover:bg-kawai-red/88 disabled:opacity-25 disabled:cursor-not-allowed text-white transition-all duration-300 group relative overflow-hidden"
            >
              {/* Hover shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
              <span className="text-sm tracking-[0.2em] uppercase font-medium relative z-10">
                Reveal My Bonus
              </span>
              <svg className="w-4 h-4 relative z-10 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
              </svg>
            </button>

            {!pianoBrand.trim() && (
              <p className="text-kawai-pearl/18 text-xs text-center mt-4 tracking-wide">
                Enter your piano brand to continue
              </p>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════
            STEP 3 — The Reveal
        ══════════════════════════════════════════ */}
        {step === 3 && (
          <div className="tc-step">

            {/* ── Phase: calculating ── */}
            {phase === 'calculating' && (
              <div className="flex flex-col items-center justify-center py-20 gap-10">
                {/* Animated equalizer bars */}
                <div className="flex items-end gap-1 h-8">
                  {[['tc-bar', 'h-4'], ['tc-bar-b', 'h-7'], ['tc-bar-c', 'h-5'], ['tc-bar-d', 'h-8'], ['tc-bar-e', 'h-3']].map(([cls, h], i) => (
                    <div
                      key={i}
                      className={`w-0.5 rounded-sm bg-kawai-red ${cls}`}
                      style={{ height: h === 'h-3' ? '0.75rem' : h === 'h-4' ? '1rem' : h === 'h-5' ? '1.25rem' : h === 'h-7' ? '1.75rem' : '2rem' }}
                    />
                  ))}
                </div>
                <div className="text-center">
                  <p
                    className="font-[family-name:var(--font-family-cormorant)] italic text-kawai-pearl/40"
                    style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)' }}
                  >
                    Appraising your{' '}
                    <span className="text-kawai-pearl/70 not-italic">{pianoBrand}</span>
                    {pianoModel && <span className="text-kawai-pearl/45 not-italic"> {pianoModel}</span>}
                    <span className="text-kawai-red">…</span>
                  </p>
                </div>
              </div>
            )}

            {/* ── Phase: piano + beyond ── */}
            {phase !== 'calculating' && (
              <div>
                {/* Piano line */}
                <div className="tc-line">
                  <div className="flex items-baseline justify-between py-5 border-b border-white/6">
                    <div>
                      <p className="text-kawai-pearl/60 text-sm">
                        {pianoBrand}{pianoModel ? ` — ${pianoModel}` : ''}
                      </p>
                      <p className="text-kawai-pearl/22 text-xs mt-0.5 tracking-wide italic font-[family-name:var(--font-family-cormorant)]">
                        estimated value
                      </p>
                    </div>
                    <span
                      className="font-[family-name:var(--font-family-cormorant)] text-kawai-pearl/65 tabular-nums"
                      style={{ fontSize: '2rem' }}
                    >
                      {formatUSD(appraisalValue)}
                    </span>
                  </div>
                </div>

                {/* Bonus line */}
                {(phase === 'bonus' || phase === 'total' || phase === 'cta') && (
                  <div className="tc-bonus relative overflow-hidden">
                    {/* Shimmer sweep */}
                    <div className="tc-sweep absolute inset-0 bg-gradient-to-r from-transparent via-white/12 to-transparent skew-x-12 pointer-events-none z-10" />
                    <div className="flex items-center justify-between py-5 px-5 -mx-5 border-b border-kawai-red/18"
                      style={{ background: 'rgba(225,25,34,0.07)' }}>
                      <div>
                        <p className="text-kawai-red font-semibold text-sm tracking-wide">
                          Kawai Spring Bonus
                        </p>
                        <p className="text-kawai-red/35 text-xs mt-0.5">
                          Up to $500 added · ends May 17
                        </p>
                      </div>
                      <span
                        className="font-[family-name:var(--font-family-cormorant)] text-kawai-red tabular-nums font-light"
                        style={{ fontSize: '2rem' }}
                      >
                        + up to {formatUSD(KAWAI_BONUS)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Total */}
                {(phase === 'total' || phase === 'cta') && (
                  <div className="tc-total pt-12 pb-6 text-center">
                    <p className="text-kawai-pearl/22 text-[0.58rem] tracking-[0.4em] uppercase mb-5">
                      Your estimated trade-in value — up to
                    </p>
                    <div
                      className="font-[family-name:var(--font-family-cormorant)] text-kawai-gold tabular-nums leading-none"
                      style={{ fontSize: 'clamp(5rem, 13vw, 8rem)' }}
                    >
                      {formatUSD(animTotal)}
                    </div>
                    <p className="text-kawai-pearl/18 text-xs mt-5 leading-relaxed max-w-xs mx-auto">
                      Subject to in-store certified appraisal. Final offer may vary
                      based on condition and market demand — we always aim to beat any independent quote.
                    </p>
                  </div>
                )}

                {/* CTA */}
                {phase === 'cta' && (
                  <div className="tc-cta mt-6 space-y-3">
                    <div className="h-px bg-white/6 mb-6" />
                    <a
                      href="#appraisal-form"
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById('appraisal-form')?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="w-full flex flex-col items-center gap-1.5 px-6 py-6 bg-kawai-red hover:bg-kawai-red/90 text-white transition-all duration-300 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                      <span className="text-[0.58rem] tracking-[0.35em] uppercase opacity-65 font-medium relative z-10">
                        Lock in your bonus at the
                      </span>
                      <span className="font-kawai-script leading-none relative z-10" style={{ fontSize: 'clamp(1.9rem, 4.5vw, 2.6rem)' }}>
                        Grand Piano Spring Sale
                      </span>
                      <svg className="w-3.5 h-3.5 mt-1 opacity-55 group-hover:translate-y-0.5 transition-transform duration-300 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                      </svg>
                    </a>

                    <button
                      onClick={reset}
                      className="w-full text-kawai-pearl/18 hover:text-kawai-pearl/45 text-[0.62rem] tracking-[0.2em] uppercase transition-colors py-3"
                    >
                      Start over
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  )
}
