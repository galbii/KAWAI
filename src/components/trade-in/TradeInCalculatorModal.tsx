'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { BookingModal } from './BookingModal'

interface TradeInCalculatorModalProps {
  isOpen: boolean
  onClose: () => void
  phone?: string | null
  calendlyUrl?: string | null
  locationName?: string | null
  storeslug?: string | null
}

function formatUSD(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

function toTel(phone: string): string {
  return phone.replace(/\D/g, '')
}

const APPRAISAL_MIN = 500
const APPRAISAL_MAX = 15000
const KAWAI_BONUS = 500

// ── Step 1 ─────────────────────────────────────────────────────────────────────

function ValuatorStep({
  phone,
  onCalculate,
}: {
  phone?: string | null
  onCalculate: () => void
}) {
  return (
    <div className="px-7 pt-8 pb-10">

      {/* Heading */}
      <div className="mb-9">
        <h2
          className="font-[family-name:var(--font-family-cormorant)] font-normal text-kawai-pearl leading-tight mb-4"
          style={{ fontSize: 'clamp(2.4rem, 7vw, 3.2rem)' }}
        >
          Value Your Piano
        </h2>
        <p className="text-kawai-pearl/55 text-base leading-relaxed">
          Piano trade-in values are determined in-store, based on two key factors:
        </p>
      </div>

      {/* Factor cards */}
      <div className="space-y-3 mb-9">
        <div
          className="flex items-start gap-5 px-5 py-5 rounded-sm"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <div className="flex-shrink-0 w-11 h-11 rounded-full bg-kawai-red/10 flex items-center justify-center mt-0.5">
            <svg className="w-5 h-5 text-kawai-red/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
          <div>
            <p className="text-kawai-pearl/90 text-base font-semibold mb-1.5">Condition</p>
            <p className="text-kawai-pearl/50 text-sm leading-relaxed">
              Cosmetic wear, age, mechanical health, and tuning history all affect your piano&apos;s final value.
            </p>
          </div>
        </div>

        <div
          className="flex items-start gap-5 px-5 py-5 rounded-sm"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <div className="flex-shrink-0 w-11 h-11 rounded-full bg-kawai-red/10 flex items-center justify-center mt-0.5">
            <svg className="w-5 h-5 text-kawai-red/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
          </div>
          <div>
            <p className="text-kawai-pearl/90 text-base font-semibold mb-1.5">Market Value</p>
            <p className="text-kawai-pearl/50 text-sm leading-relaxed">
              Brand, model, size, and current resale demand are weighed against recent comparable sales.
            </p>
          </div>
        </div>
      </div>

      {/* Phone callout */}
      {phone && (
        <div className="mb-8 rounded-sm border border-white/[0.12] px-6 py-5">
          <p className="text-kawai-pearl/45 text-xs tracking-[0.2em] uppercase mb-3">
            Want an estimate before you visit?
          </p>
          <a
            href={`tel:${toTel(phone)}`}
            className="flex items-center gap-3 group mb-2"
          >
            <svg
              className="w-5 h-5 text-kawai-red/70 flex-shrink-0"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
            </svg>
            <span
              className="font-[family-name:var(--font-family-cormorant)] text-kawai-pearl/90 group-hover:text-kawai-pearl transition-colors underline underline-offset-4 decoration-kawai-pearl/25 group-hover:decoration-kawai-pearl/60"
              style={{ fontSize: 'clamp(1.6rem, 5vw, 2.1rem)' }}
            >
              {phone}
            </span>
          </a>
          <p className="text-kawai-pearl/40 text-xs leading-relaxed">
            Call ahead and our team will walk you through your estimate.
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-kawai-pearl/35 text-sm leading-relaxed italic font-[family-name:var(--font-family-cormorant)] mb-8">
        The calculator below provides a general reference estimate. All final trade-in values are confirmed in-store after inspection.
      </p>

      {/* Calculate CTA */}
      <button
        onClick={onCalculate}
        className="w-full flex items-center justify-between px-7 py-5 bg-kawai-red hover:bg-kawai-red/90 active:bg-kawai-red/80 text-white text-sm tracking-[0.18em] uppercase font-semibold transition-colors group relative overflow-hidden rounded-sm"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
        <span className="relative z-10">Calculate</span>
        <svg
          className="w-5 h-5 relative z-10 group-hover:translate-x-1.5 transition-transform duration-300"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </button>

      <div className="sm:hidden" style={{ height: 'env(safe-area-inset-bottom, 16px)' }} />
    </div>
  )
}

// ── Step 2 ─────────────────────────────────────────────────────────────────────

function CalculatorStep({
  appraisalValue,
  setAppraisalValue,
  calculated,
  onCalculate,
  onClaim,
}: {
  appraisalValue: number
  setAppraisalValue: (v: number) => void
  calculated: boolean
  onCalculate: () => void
  onClaim: () => void
}) {
  const [revealing, setRevealing] = useState(false)
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const total = appraisalValue + KAWAI_BONUS
  const sliderPct = ((appraisalValue - APPRAISAL_MIN) / (APPRAISAL_MAX - APPRAISAL_MIN)) * 100

  useEffect(() => {
    return () => {
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current)
    }
  }, [])

  function handleCalculate() {
    setRevealing(true)
    revealTimerRef.current = setTimeout(() => {
      onCalculate()
      setRevealing(false)
    }, 700)
  }

  return (
    <div className="px-7 pt-7 pb-10">

      {/* Question */}
      <p className="text-kawai-pearl/45 text-xs tracking-[0.25em] uppercase text-center mb-5">
        What is your piano estimated at?
      </p>

      {/* Value display */}
      <div
        className="font-[family-name:var(--font-family-cormorant)] text-kawai-pearl tabular-nums leading-none text-center mb-8"
        style={{ fontSize: 'clamp(4rem, 16vw, 6.5rem)' }}
        aria-live="polite"
        aria-atomic="true"
      >
        {formatUSD(appraisalValue)}
      </div>

      {/* Slider */}
      <input
        type="range"
        min={APPRAISAL_MIN}
        max={APPRAISAL_MAX}
        step={100}
        value={appraisalValue}
        onChange={(e) => setAppraisalValue(Number(e.target.value))}
        disabled={revealing || calculated}
        className="tcm-range mb-4"
        aria-label="Estimated piano value"
        style={{
          background: `linear-gradient(to right, #E11922 ${sliderPct}%, rgba(255,255,255,0.08) ${sliderPct}%)`,
          opacity: calculated ? 0.35 : 1,
          transition: 'opacity 0.4s ease',
          cursor: calculated ? 'default' : 'pointer',
        }}
      />
      <div className="flex justify-between text-kawai-pearl/40 text-sm tracking-wide mb-8">
        <span>{formatUSD(APPRAISAL_MIN)}</span>
        <span>{formatUSD(APPRAISAL_MAX)}</span>
      </div>

      {/* ── Phase A: Calculate CTA ── */}
      {!calculated && (
        <button
          onClick={handleCalculate}
          disabled={revealing}
          className="w-full flex items-center justify-between px-7 py-5 bg-kawai-red hover:bg-kawai-red/90 active:bg-kawai-red/80 text-white text-sm tracking-[0.18em] uppercase font-semibold transition-colors group relative overflow-hidden rounded-sm disabled:cursor-wait"
          style={{ animation: 'tcm-calc-in 0.4s cubic-bezier(0.22,1,0.36,1) 120ms both' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
          {revealing ? (
            <>
              <span className="relative z-10" style={{ animation: 'tcm-calculating-pulse 1s ease infinite' }}>
                Calculating
              </span>
              <div className="relative z-10 flex items-center gap-1.5">
                {[0, 180, 360].map((delay) => (
                  <div
                    key={delay}
                    className="w-1.5 h-1.5 rounded-full bg-white/60"
                    style={{ animation: `tcm-dot-bounce 0.9s ease ${delay}ms infinite` }}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <span className="relative z-10">Calculate</span>
              <svg
                className="w-5 h-5 relative z-10 group-hover:translate-x-1.5 transition-transform duration-300"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </>
          )}
        </button>
      )}

      {/* ── Phase B: Breakdown + Book Now (suspense-paced staggered reveal) ── */}
      {calculated && (
        <>
          {/* Divider 1 — draws in left → right, signals reveal beginning */}
          <div
            style={{
              height: '1px',
              background: 'rgba(255,255,255,0.09)',
              transformOrigin: 'left',
              animation: 'tcm-divider-in 0.65s ease 60ms both',
            }}
          />

          {/* Row 1 — your piano estimate (grounded baseline) */}
          <div
            className="flex items-baseline justify-between gap-4 pt-6"
            style={{ animation: 'tcm-row-in 0.5s cubic-bezier(0.22,1,0.36,1) 280ms both' }}
          >
            <span className="text-kawai-pearl/55 text-base leading-snug">Your piano estimate</span>
            <span
              className="font-[family-name:var(--font-family-cormorant)] text-kawai-pearl/70 tabular-nums flex-shrink-0"
              style={{ fontSize: 'clamp(1.7rem, 5vw, 2.4rem)' }}
            >
              {formatUSD(appraisalValue)}
            </span>
          </div>

          {/* Row 2 — Kawai Spring Bonus (slides in from right — the gift arriving) */}
          <div
            className="flex items-baseline justify-between gap-4 py-5 px-5 -mx-5 rounded-sm mt-5"
            style={{
              background: 'rgba(225,25,34,0.09)',
              animation: 'tcm-bonus-in 0.55s cubic-bezier(0.22,1,0.36,1) 720ms both',
            }}
          >
            <span className="text-kawai-red/90 text-base font-semibold leading-snug">Kawai Spring Bonus</span>
            <span
              className="font-[family-name:var(--font-family-cormorant)] text-kawai-red tabular-nums flex-shrink-0"
              style={{ fontSize: 'clamp(1.7rem, 5vw, 2.4rem)' }}
            >
              + {formatUSD(KAWAI_BONUS)}
            </span>
          </div>

          {/* Divider 2 — final buildup before the total reveal */}
          <div
            className="mt-6"
            style={{
              height: '1px',
              background: 'rgba(255,255,255,0.14)',
              transformOrigin: 'left',
              animation: 'tcm-divider-in 0.5s ease 1180ms both',
            }}
          />

          {/* Total — centered feature reveal (the climax) */}
          <div className="pt-5 pb-4 text-center">
            <p
              className="text-kawai-pearl/45 text-xs tracking-[0.25em] uppercase mb-4"
              style={{ animation: 'tcm-row-in 0.4s ease 1320ms both' }}
            >
              Total Trade-In Credit
            </p>
            <span
              className="font-[family-name:var(--font-family-cormorant)] tabular-nums leading-none block"
              style={{
                fontSize: 'clamp(3.8rem, 14vw, 5.5rem)',
                color: '#4ade80',
                animation: 'tcm-total-in 0.72s cubic-bezier(0.34,1.2,0.64,1) 1450ms both, tcm-glow-once 2s ease 2000ms both',
              }}
            >
              {formatUSD(total)}
            </span>
          </div>

          {/* Disclaimer — quiet fade after the glow peaks */}
          <p
            className="text-kawai-pearl/35 text-sm text-center leading-relaxed italic font-[family-name:var(--font-family-cormorant)] mt-5 mb-8"
            style={{ animation: 'tcm-row-in 0.5s ease 1750ms both' }}
          >
            Pianos are appraised in-store based on condition and market value — estimate may vary.
          </p>

          {/* Book Now CTA — arrives last as the clear resolution */}
          <button
            onClick={onClaim}
            className="w-full flex items-center justify-between px-7 py-5 bg-kawai-red hover:bg-kawai-red/90 active:bg-kawai-red/80 text-white text-sm tracking-[0.18em] uppercase font-semibold transition-colors group relative overflow-hidden rounded-sm"
            style={{ animation: 'tcm-btn-in 0.55s cubic-bezier(0.22,1,0.36,1) 2100ms both' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
            <span className="relative z-10">Book Now</span>
            <svg
              className="w-5 h-5 relative z-10 group-hover:translate-x-1.5 transition-transform duration-300"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </>
      )}

      <div className="sm:hidden" style={{ height: 'env(safe-area-inset-bottom, 16px)' }} />
    </div>
  )
}

// ── Modal shell ────────────────────────────────────────────────────────────────

export function TradeInCalculatorModal({
  isOpen,
  onClose,
  phone,
  calendlyUrl,
  locationName,
  storeslug,
}: TradeInCalculatorModalProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [stepVisible, setStepVisible] = useState(true)
  const [appraisalValue, setAppraisalValue] = useState(3500)
  const [calculated, setCalculated] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Reset to step 1 each time the modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setStepVisible(true)
      setCalculated(false)
    }
  }, [isOpen])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!mounted) return null

  function transition(toStep: 1 | 2) {
    setStepVisible(false)
    setTimeout(() => {
      setStep(toStep)
      setStepVisible(true)
    }, 180)
  }

  return createPortal(
    <>
      <style>{`
        @keyframes tcm-overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes tcm-panel-in {
          0%   { opacity: 0; transform: translateY(32px) scale(0.97); }
          60%  { opacity: 1; transform: translateY(-4px) scale(1.008); }
          80%  { transform: translateY(1px) scale(0.999); }
          100% { transform: translateY(0) scale(1); }
        }
        @media (max-width: 639px) {
          @keyframes tcm-panel-in {
            from { opacity: 0; transform: translateY(60px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        }
        .tcm-range {
          -webkit-appearance: none; appearance: none;
          width: 100%; height: 2px; border-radius: 0;
          cursor: pointer; outline: none;
        }
        .tcm-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 28px; height: 28px; border-radius: 50%;
          background: #E11922; margin-top: -13px; cursor: pointer;
          box-shadow: 0 0 0 5px rgba(225,25,34,0.15), 0 0 18px rgba(225,25,34,0.4);
          transition: box-shadow 0.2s ease, transform 0.15s ease;
        }
        .tcm-range:hover::-webkit-slider-thumb,
        .tcm-range:active::-webkit-slider-thumb {
          box-shadow: 0 0 0 8px rgba(225,25,34,0.15), 0 0 28px rgba(225,25,34,0.55);
          transform: scale(1.12);
        }
        .tcm-range::-webkit-slider-runnable-track { height: 2px; }
        .tcm-range::-moz-range-thumb {
          width: 28px; height: 28px; border-radius: 50%;
          background: #E11922; border: none;
          box-shadow: 0 0 0 5px rgba(225,25,34,0.15);
        }
        .tcm-range::-moz-range-track {
          height: 2px; background: rgba(255,255,255,0.08);
        }
        @keyframes tcm-row-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes tcm-bonus-in {
          from { opacity: 0; transform: translateX(32px) scale(0.97); }
          65%  { opacity: 1; transform: translateX(-3px) scale(1.01); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes tcm-divider-in {
          from { opacity: 0; transform: scaleX(0.05); transform-origin: left; }
          to   { opacity: 1; transform: scaleX(1); }
        }
        @keyframes tcm-total-in {
          0%   { opacity: 0; transform: scale(0.42) translateY(12px); }
          55%  { opacity: 1; transform: scale(1.1) translateY(-4px); }
          78%  { transform: scale(0.97) translateY(2px); }
          100% { transform: scale(1) translateY(0); }
        }
        @keyframes tcm-glow-once {
          0%   { text-shadow: none; }
          28%  { text-shadow: 0 0 52px rgba(74,222,128,0.85), 0 0 100px rgba(74,222,128,0.35), 0 0 20px rgba(74,222,128,0.95); }
          65%  { text-shadow: 0 0 28px rgba(74,222,128,0.35), 0 0 56px rgba(74,222,128,0.1); }
          100% { text-shadow: none; }
        }
        @keyframes tcm-btn-in {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes tcm-calc-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes tcm-calculating-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        @keyframes tcm-dot-bounce {
          0%, 100% { transform: translateY(0);    opacity: 0.6; }
          40%       { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9008] bg-kawai-black/65 backdrop-blur-sm"
          style={{ animation: 'tcm-overlay-in 0.22s ease both' }}
          onClick={onClose}
          aria-hidden
        />
      )}

      {/* Centering shell — bottom sheet on mobile, centered on sm+ */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9009] flex items-end sm:items-center justify-center p-0 sm:p-6 pointer-events-none"
          role="dialog"
          aria-modal="true"
          aria-label="Trade-In Calculator"
        >
          {/* Panel */}
          <div
            className="pointer-events-auto w-full sm:max-w-[600px] bg-kawai-black rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col shadow-[0_-8px_60px_rgba(0,0,0,0.5),0_40px_80px_rgba(0,0,0,0.6)]"
            style={{
              maxHeight: '92dvh',
              animation: 'tcm-panel-in 0.46s cubic-bezier(0.34,1.15,0.64,1) both',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Red accent strip */}
            <div className="h-[3px] bg-kawai-red flex-shrink-0" />

            {/* Drag handle — mobile only */}
            <div className="flex justify-center pt-3 sm:hidden flex-shrink-0">
              <div className="w-10 h-[3px] rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-4 sm:pt-5 pb-4 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                {/* Back button — step 2 only */}
                {step === 2 && (
                  <button
                    onClick={() => transition(1)}
                    className="w-7 h-7 flex items-center justify-center text-kawai-pearl/40 hover:text-kawai-pearl hover:bg-white/[0.07] transition-colors rounded-full -ml-1 mr-0.5"
                    aria-label="Back to valuation"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                )}
                <div className="h-px w-5 bg-kawai-red/40" />
                <span className="text-kawai-red/70 text-xs tracking-[0.22em] uppercase font-semibold">
                  Trade-In Calculator
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Step counter */}
                <span className="text-kawai-pearl/30 text-xs tracking-[0.15em] tabular-nums">
                  {step} / 2
                </span>
                {/* Close */}
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center text-kawai-pearl/35 hover:text-kawai-pearl hover:bg-white/[0.07] transition-colors rounded-full"
                  aria-label="Close calculator"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-[3px] bg-white/[0.06] flex-shrink-0 mx-7 rounded-full overflow-hidden mb-0">
              <div
                className="h-full bg-kawai-red/50 rounded-full transition-all duration-500 ease-[var(--ease-elegant)]"
                style={{ width: step === 1 ? '50%' : '100%' }}
              />
            </div>

            {/* Step content — fades between steps */}
            <div
              className="overflow-y-auto flex-1 transition-all duration-[180ms]"
              style={{
                opacity: stepVisible ? 1 : 0,
                transform: stepVisible ? 'translateY(0)' : 'translateY(6px)',
              }}
            >
              {step === 1 ? (
                <ValuatorStep phone={phone} onCalculate={() => transition(2)} />
              ) : (
                <CalculatorStep
                  appraisalValue={appraisalValue}
                  setAppraisalValue={setAppraisalValue}
                  calculated={calculated}
                  onCalculate={() => setCalculated(true)}
                  onClaim={() => { onClose(); setTimeout(() => setBookingOpen(true), 150) }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* BookingModal layers on top (z-[9010]/[9011]) */}
      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        calendlyUrl={calendlyUrl}
        locationName={locationName}
        storeslug={storeslug}
      />
    </>,
    document.body,
  )
}
