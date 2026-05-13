'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface UniversityCountdownRendererProps {
  block: {
    targetDate?: string
    eventLabel?: string
    ctaButtonText?: string
    ctaScrollTarget?: string
    position?: 'bottom-right' | 'bottom-left' | 'bottom-center'
    showAfterScrollPercent?: number
  }
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
}

const DISMISSED_KEY = 'kawai-countdown-dismissed'

const positionMap: Record<string, string> = {
  'bottom-right': 'bottom-5 right-5 sm:bottom-6 sm:right-6',
  'bottom-left': 'bottom-5 left-5 sm:bottom-6 sm:left-6',
  'bottom-center': 'bottom-5 left-1/2 -translate-x-1/2',
}

function calcTimeLeft(targetDate: Date): TimeLeft | null {
  const diff = targetDate.getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
  }
}

export const UniversityCountdownRenderer: React.FC<UniversityCountdownRendererProps> = ({ block }) => {
  const {
    targetDate: targetDateStr,
    eventLabel,
    ctaButtonText,
    ctaScrollTarget,
    position = 'bottom-right',
    showAfterScrollPercent = 25,
  } = block

  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)
  const [expired, setExpired] = useState(false)

  // Hydration guard
  useEffect(() => {
    setMounted(true)
    // Check persistent dismissal from localStorage
    try {
      if (localStorage.getItem(DISMISSED_KEY) === 'true') {
        setDismissed(true)
      }
    } catch {
      // localStorage unavailable (e.g. private browsing with strict settings) — ignore
    }
  }, [])

  // Compute target date once
  const targetDate = targetDateStr ? new Date(targetDateStr) : null

  // Initial time calculation and interval
  useEffect(() => {
    if (!mounted || !targetDate) return

    const initial = calcTimeLeft(targetDate)
    if (!initial) {
      setExpired(true)
      return
    }
    setTimeLeft(initial)

    const interval = setInterval(() => {
      const t = calcTimeLeft(targetDate)
      if (!t) {
        setExpired(true)
        clearInterval(interval)
      } else {
        setTimeLeft(t)
      }
    }, 60_000)

    return () => clearInterval(interval)
  }, [mounted, targetDateStr]) // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll listener — show after threshold
  useEffect(() => {
    if (!mounted || dismissed || expired) return

    const onScroll = () => {
      const scrollPos = window.scrollY
      const docHeight = document.documentElement.scrollHeight
      const winHeight = window.innerHeight
      const scrollPct = (scrollPos / (docHeight - winHeight)) * 100
      if (scrollPct >= showAfterScrollPercent) {
        setVisible(true)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [mounted, dismissed, expired, showAfterScrollPercent])

  const handleDismiss = () => {
    setDismissed(true)
    try {
      localStorage.setItem(DISMISSED_KEY, 'true')
    } catch {
      // ignore
    }
  }

  const handleCta = () => {
    if (!ctaScrollTarget) return
    const el = document.querySelector(ctaScrollTarget)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Don't render anything until mounted (SSR safe)
  if (!mounted) return null
  // Hide if expired, dismissed, or not yet triggered by scroll
  if (expired || dismissed || !visible) return null

  if (minimized) {
    return (
      <button
        type="button"
        aria-label="Expand countdown timer"
        onClick={() => setMinimized(false)}
        className={cn(
          'fixed z-50 w-14 h-14 rounded-full bg-kawai-red text-white shadow-brand-premium flex items-center justify-center hover:bg-kawai-red-700 transition-colors',
          positionMap[position] ?? positionMap['bottom-right']
        )}
      >
        {/* Clock icon */}
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    )
  }

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div
      className={cn(
        'fixed z-50',
        positionMap[position] ?? positionMap['bottom-right']
      )}
    >
      {/* Glassmorphism card */}
      <div className="relative backdrop-blur-xl bg-kawai-black/80 border border-white/10 rounded-2xl shadow-brand-premium p-5 w-64 sm:w-72">
        {/* Dismiss button */}
        <button
          type="button"
          aria-label="Dismiss countdown"
          onClick={handleDismiss}
          className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-white/50 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Minimize button */}
        <button
          type="button"
          aria-label="Minimize countdown"
          onClick={() => setMinimized(true)}
          className="absolute top-3 right-10 w-6 h-6 flex items-center justify-center text-white/50 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>

        {/* Event label */}
        {eventLabel && (
          <div className="flex items-center gap-2 mb-4 pr-14">
            <span className="w-2 h-2 rounded-full bg-kawai-red shrink-0 animate-pulse" />
            <span className="text-xs font-medium text-white/80 uppercase tracking-wider leading-tight">{eventLabel}</span>
          </div>
        )}

        {/* Countdown digits */}
        {timeLeft && (
          <div className="grid grid-cols-3 gap-2 text-center mb-4">
            {[
              { value: timeLeft.days, unit: 'Days' },
              { value: timeLeft.hours, unit: 'Hours' },
              { value: timeLeft.minutes, unit: 'Min' },
            ].map(({ value, unit }) => (
              <div key={unit} className="bg-white/10 rounded-xl py-2 px-1">
                <div className="text-2xl font-bold text-white tabular-nums leading-none">{pad(value)}</div>
                <div className="text-xs text-white/50 mt-1 uppercase tracking-wide">{unit}</div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        {ctaButtonText && (
          <button
            type="button"
            onClick={handleCta}
            className="w-full bg-kawai-red text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-kawai-red-700 transition-colors active:scale-95"
          >
            {ctaButtonText}
          </button>
        )}
      </div>
    </div>
  )
}
