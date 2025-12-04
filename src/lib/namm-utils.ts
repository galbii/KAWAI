/**
 * NAMM 2026 Utilities
 * Design system utilities and helper functions for the NAMM 2026 landing page
 */

/**
 * NAMM 2026 Color Palette
 * Following Kawai brand guidelines with event-specific accents
 */
export const NAMM_COLORS = {
  /** Primary Kawai Red - #C41E3A (Official brand color from docs) */
  kawaiRed: '#C41E3A',
  /** Pure Black - #000000 (High contrast for text and backgrounds) */
  black: '#000000',
  /** Pure White - #FFFFFF (Clean contrast) */
  white: '#FFFFFF',
  /** Warm Beige - #F5F5DC (Subtle background accent) */
  beige: '#F5F5DC',
  /** Kawai Pearl - #FAF8F5 (From brand system for soft backgrounds) */
  pearl: '#FAF8F5',
  /** Kawai Charcoal - #2C2C2C (Secondary text) */
  charcoal: '#2C2C2C',
} as const

/**
 * NAMM 2026 Event Configuration
 */
export const NAMM_EVENT = {
  /** Event start date: January 22, 2026, 9:00 AM PST */
  startDate: new Date('2026-01-22T09:00:00-08:00'),
  /** Event end date: January 24, 2026, 6:00 PM PST */
  endDate: new Date('2026-01-24T18:00:00-08:00'),
  /** Event venue */
  venue: 'Anaheim Convention Center',
  /** Event location */
  location: 'Anaheim, California',
  /** Booth number (TBA - placeholder) */
  booth: 'TBA',
} as const

/**
 * Countdown Data Structure
 */
export interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalMilliseconds: number
  hasStarted: boolean
  hasEnded: boolean
}

/**
 * Calculate time remaining until NAMM 2026
 * Returns countdown data with days, hours, minutes, seconds
 *
 * @returns {CountdownTime} Structured countdown data
 *
 * @example
 * const countdown = getCountdownToNAMM()
 * console.log(`${countdown.days} days until NAMM 2026`)
 */
export function getCountdownToNAMM(): CountdownTime {
  const now = new Date().getTime()
  const eventStart = NAMM_EVENT.startDate.getTime()
  const eventEnd = NAMM_EVENT.endDate.getTime()

  // Check if event has started or ended
  const hasStarted = now >= eventStart
  const hasEnded = now >= eventEnd

  // Calculate time difference
  const totalMilliseconds = Math.max(0, eventStart - now)

  // Convert to time units
  const days = Math.floor(totalMilliseconds / (1000 * 60 * 60 * 24))
  const hours = Math.floor((totalMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((totalMilliseconds % (1000 * 60)) / 1000)

  return {
    days,
    hours,
    minutes,
    seconds,
    totalMilliseconds,
    hasStarted,
    hasEnded,
  }
}

/**
 * Format countdown time unit with leading zero
 *
 * @param value - Number to format
 * @returns Formatted string with leading zero if needed
 *
 * @example
 * formatTimeUnit(5) // "05"
 * formatTimeUnit(15) // "15"
 */
export function formatTimeUnit(value: number): string {
  return value.toString().padStart(2, '0')
}

/**
 * Get event status text
 *
 * @returns Status message based on current time
 */
export function getEventStatus(): string {
  const countdown = getCountdownToNAMM()

  if (countdown.hasEnded) {
    return 'Event has concluded. Thank you for visiting!'
  }

  if (countdown.hasStarted) {
    return 'Event is live now at the Anaheim Convention Center!'
  }

  return `${countdown.days} days until NAMM 2026`
}

/**
 * Framer Motion animation variants for scroll-triggered effects
 */
export const NAMM_ANIMATIONS = {
  /** Fade in from bottom with delay support */
  fadeInUp: {
    hidden: {
      opacity: 0,
      y: 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number], // Elegant easing from brand system
      },
    },
  },

  /** Fade in from left */
  fadeInLeft: {
    hidden: {
      opacity: 0,
      x: -40,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
  },

  /** Fade in from right */
  fadeInRight: {
    hidden: {
      opacity: 0,
      x: 40,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
  },

  /** Scale in with fade */
  scaleIn: {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
  },

  /** Stagger children animation */
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  },

  /** Scroll indicator animation (bounce) */
  scrollIndicator: {
    initial: {
      y: 0,
      opacity: 0.7,
    },
    animate: {
      y: [0, 10, 0],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
}

/**
 * Responsive breakpoint utilities
 */
export const NAMM_BREAKPOINTS = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
} as const

/**
 * Check if user prefers reduced motion
 *
 * @returns {boolean} True if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
