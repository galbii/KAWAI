'use client'

/**
 * CountdownTimer Component
 * Real-time countdown to NAMM 2026 with animated number transitions
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { CountdownTime } from '@/lib/namm-utils'
import { getCountdownToNAMM, formatTimeUnit, prefersReducedMotion } from '@/lib/namm-utils'
import { cn } from '@/lib/utils'

interface CountdownTimerProps {
  /** Additional CSS classes */
  className?: string
  /** Show seconds (default: false for cleaner display) */
  showSeconds?: boolean
  /** Compact layout for mobile (default: false) */
  compact?: boolean
}

/**
 * NAMM 2026 Countdown Timer
 *
 * Features:
 * - Updates every minute (or second if showSeconds is true)
 * - Animated number transitions using Framer Motion
 * - Responsive layout (stacks on mobile, inline on desktop)
 * - Respects prefers-reduced-motion
 * - Handles event start/end states
 *
 * @example
 * <CountdownTimer />
 * <CountdownTimer showSeconds compact />
 */
export default function CountdownTimer({
  className,
  showSeconds = false,
  compact = false,
}: CountdownTimerProps) {
  const [countdown, setCountdown] = useState<CountdownTime>(getCountdownToNAMM())
  const [mounted, setMounted] = useState(false)
  const reducedMotion = prefersReducedMotion()

  // Client-side mounting flag to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Update countdown timer
  useEffect(() => {
    if (!mounted) return

    // Update interval: 1 second if showing seconds, 1 minute otherwise
    const interval = showSeconds ? 1000 : 60000

    const timer = setInterval(() => {
      setCountdown(getCountdownToNAMM())
    }, interval)

    return () => clearInterval(timer)
  }, [mounted, showSeconds])

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className={cn('flex gap-4 justify-center items-center', className)}>
        <TimeUnit label="Days" value="--" loading />
        <TimeUnit label="Hours" value="--" loading />
        <TimeUnit label="Minutes" value="--" loading />
      </div>
    )
  }

  // Event has ended
  if (countdown.hasEnded) {
    return (
      <div className={cn('text-center', className)}>
        <p className="text-xl md:text-2xl font-semibold text-kawai-red">
          Event has concluded
        </p>
        <p className="text-sm md:text-base text-kawai-charcoal mt-2">
          Thank you for visiting Kawai at NAMM 2026!
        </p>
      </div>
    )
  }

  // Event is live
  if (countdown.hasStarted) {
    return (
      <div className={cn('text-center', className)}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-block bg-kawai-red text-white px-6 py-3 rounded-full"
        >
          <p className="text-lg md:text-xl font-bold">🎹 Event is Live Now!</p>
        </motion.div>
        <p className="text-sm md:text-base text-kawai-charcoal mt-3">
          Visit us at {countdown.hasStarted ? 'the Anaheim Convention Center' : 'Booth TBA'}
        </p>
      </div>
    )
  }

  // Countdown display
  const timeUnits = [
    { label: 'Days', value: countdown.days },
    { label: 'Hours', value: countdown.hours },
    { label: 'Minutes', value: countdown.minutes },
    ...(showSeconds ? [{ label: 'Seconds', value: countdown.seconds }] : []),
  ]

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {/* Countdown Units */}
      <div
        className={cn(
          'flex gap-3 md:gap-6 justify-center items-center',
          compact ? 'flex-wrap' : 'flex-col sm:flex-row'
        )}
      >
        {timeUnits.map((unit, index) => (
          <TimeUnit
            key={unit.label}
            label={unit.label}
            value={formatTimeUnit(unit.value)}
            delay={reducedMotion ? 0 : index * 0.1}
            compact={compact}
          />
        ))}
      </div>

      {/* Event Date */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-sm md:text-base text-kawai-charcoal/80 mt-4 md:mt-6 text-center"
      >
        January 22-24, 2026 • Anaheim Convention Center
      </motion.p>
    </div>
  )
}

/**
 * Individual Time Unit Component
 */
interface TimeUnitProps {
  label: string
  value: string
  delay?: number
  compact?: boolean
  loading?: boolean
}

function TimeUnit({ label, value, delay = 0, compact = false, loading = false }: TimeUnitProps) {
  const reducedMotion = prefersReducedMotion()

  return (
    <motion.div
      initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        'flex flex-col items-center',
        compact ? 'min-w-[70px]' : 'min-w-[90px] md:min-w-[110px]'
      )}
    >
      {/* Number Display */}
      <div
        className={cn(
          'relative bg-kawai-black rounded-lg overflow-hidden',
          compact ? 'w-16 h-16 md:w-20 md:h-20' : 'w-20 h-20 md:w-28 md:h-28',
          'shadow-lg border-2 border-kawai-red/20'
        )}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-kawai-red/10 via-transparent to-transparent" />

        {/* Number */}
        <AnimatePresence mode="wait">
          <motion.div
            key={loading ? 'loading' : value}
            initial={reducedMotion ? {} : { y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reducedMotion ? {} : { y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span
              className={cn(
                'font-bold text-white tabular-nums',
                compact ? 'text-2xl md:text-3xl' : 'text-3xl md:text-5xl',
                loading && 'animate-pulse'
              )}
            >
              {value}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Red accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-kawai-red" />
      </div>

      {/* Label */}
      <span
        className={cn(
          'mt-2 md:mt-3 font-semibold text-kawai-charcoal uppercase tracking-wider',
          compact ? 'text-xs' : 'text-sm md:text-base'
        )}
      >
        {label}
      </span>
    </motion.div>
  )
}
