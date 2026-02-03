'use client'

import type { Dealer } from '@/payload-types'
import { cn } from '@/lib/utils'
import { Phone } from 'lucide-react'
import { useState, useEffect } from 'react'

interface DealerHoursProps {
  dealer: Dealer
  /**
   * Override the default container className
   * @default ''
   */
  className?: string
}

interface HourEntry {
  day?: string | null
  openTime?: string | null | undefined
  closeTime?: string | null | undefined
  isClosed?: boolean | null
}

interface CurrentStatus {
  isOpen: boolean
  currentDay: string
  currentHours?: HourEntry | undefined
}

/**
 * DealerHours Component
 *
 * Displays weekly business hours in a responsive grid format.
 * Features:
 * - Highlights current day of week
 * - Shows "Open Now" or "Closed" badge based on current time
 * - Displays "Call for hours" fallback if no hours provided
 * - Responsive grid layout (2 columns on mobile, adjusts based on content)
 * - Calculates if currently open using current time + day of week
 * - Full TypeScript strict mode compliance with proper null checks
 *
 * @example
 * ```tsx
 * <DealerHours dealer={dealer} />
 * ```
 */
export function DealerHours({ dealer, className = '' }: DealerHoursProps) {
  const [currentStatus, setCurrentStatus] = useState<CurrentStatus | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Parse time string (e.g., "10:00 AM" or "10:00") to 24-hour format
  const parseTime = (timeStr: string | null | undefined): number | null => {
    if (!timeStr || typeof timeStr !== 'string') return null

    const cleaned = timeStr.trim()
    if (cleaned === '') return null

    // Try to parse different formats
    let hours: number
    let minutes: number

    // Check for AM/PM format
    const ampmMatch = cleaned.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i)
    if (ampmMatch && ampmMatch[1] && ampmMatch[2] && ampmMatch[3]) {
      hours = parseInt(ampmMatch[1], 10)
      minutes = parseInt(ampmMatch[2], 10)
      const period = ampmMatch[3].toUpperCase()

      if (period === 'PM' && hours !== 12) {
        hours += 12
      } else if (period === 'AM' && hours === 12) {
        hours = 0
      }
    } else {
      // Try 24-hour format
      const timeMatch = cleaned.match(/^(\d{1,2}):(\d{2})$/)
      if (!timeMatch || !timeMatch[1] || !timeMatch[2]) return null

      hours = parseInt(timeMatch[1], 10)
      minutes = parseInt(timeMatch[2], 10)
    }

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return null
    }

    return hours * 60 + minutes
  }

  // Check if currently open
  const isCurrentlyOpen = (hourEntry: HourEntry | null | undefined): boolean => {
    if (!hourEntry || hourEntry.isClosed) return false
    if (!hourEntry.openTime || !hourEntry.closeTime) return false

    const openMinutes = parseTime(hourEntry.openTime)
    const closeMinutes = parseTime(hourEntry.closeTime)

    if (openMinutes === null || closeMinutes === null) return false

    // Get current time in minutes
    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    return currentMinutes >= openMinutes && currentMinutes < closeMinutes
  }

  // Get day of week name
  const getDayName = (index: number): string => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return days[index] || 'unknown'
  }

  // Format time for display
  const formatTimeDisplay = (timeStr: string | null | undefined): string => {
    if (!timeStr || typeof timeStr !== 'string') return ''

    const cleaned = timeStr.trim()
    if (cleaned === '') return ''

    return cleaned
  }

  // Calculate current status (client-side only)
  useEffect(() => {
    setIsMounted(true)

    if (!dealer.hours || !Array.isArray(dealer.hours) || dealer.hours.length === 0) {
      setCurrentStatus(null)
      return
    }

    const now = new Date()
    const currentDayIndex = now.getDay()
    const currentDayName = getDayName(currentDayIndex)

    // Find current day's hours
    const currentHours = dealer.hours.find(
      (h) => h && typeof h === 'object' && h.day && h.day.toLowerCase() === currentDayName
    )

    if (!currentHours) {
      setCurrentStatus({
        isOpen: false,
        currentDay: currentDayName,
        currentHours: undefined,
      })
      return
    }

    const isOpen = isCurrentlyOpen(currentHours)

    setCurrentStatus({
      isOpen,
      currentDay: currentDayName,
      currentHours,
    })
  }, [dealer.hours])

  // If no hours data, show fallback
  if (!dealer.hours || !Array.isArray(dealer.hours) || dealer.hours.length === 0) {
    return (
      <div className={cn('bg-gray-50 rounded-lg p-6', className)}>
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Business Hours</h3>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Hours not available online</p>
          {dealer.contactInfo?.phone && (
            <a
              href={`tel:${dealer.contactInfo.phone}`}
              className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-kawai-red text-white text-sm font-medium rounded-lg hover:bg-kawai-red/90 transition-colors"
            >
              <Phone className="w-4 h-4" strokeWidth={2} />
              Call for Hours
            </a>
          )}
          {!dealer.contactInfo?.phone && (
            <p className="text-sm text-gray-500">Please contact the dealer directly</p>
          )}
        </div>
      </div>
    )
  }

  const hours = dealer.hours

  // Sort hours by day order for display
  const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const sortedHours = [...hours].sort((a, b) => {
    const aDay = a?.day?.toLowerCase() || ''
    const bDay = b?.day?.toLowerCase() || ''
    return dayOrder.indexOf(aDay) - dayOrder.indexOf(bDay)
  })

  // Format day name for display
  const formatDayLabel = (day: string): string => {
    return day.charAt(0).toUpperCase() + day.slice(1, 3)
  }

  return (
    <div className={cn('bg-gradient-to-br from-white to-gray-50/50 rounded-2xl p-8 shadow-xl border-0 overflow-hidden', className)}>
      {/* Decorative gold accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-kawai-gold via-kawai-red to-kawai-gold/20" />

      {/* Header with status badge */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-kawai-gold/10 rounded-lg">
            <Phone className="w-6 h-6 text-kawai-gold" strokeWidth={2.5} />
          </div>
          <h3 className="text-xl font-serif font-semibold text-kawai-charcoal">Business Hours</h3>
        </div>
        {isMounted && currentStatus && (
          <div
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-sm',
              currentStatus.isOpen
                ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-2 border-green-200'
                : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 border-2 border-gray-200'
            )}
          >
            {currentStatus.isOpen && (
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            )}
            {currentStatus.isOpen ? 'Open Now' : 'Closed'}
          </div>
        )}
      </div>

      {/* Hours List - Elegant timeline design */}
      <div className="space-y-2">
        {sortedHours.map((hour) => {
          if (!hour || typeof hour !== 'object') return null

          const dayName = hour.day && typeof hour.day === 'string' ? hour.day : ''
          const dayLower = dayName.toLowerCase()
          const isCurrentDay =
            isMounted && currentStatus ? dayLower === currentStatus.currentDay : false

          return (
            <div
              key={dayName}
              className={cn(
                'group relative flex justify-between items-center px-5 py-4 rounded-xl transition-all duration-300',
                isCurrentDay
                  ? 'bg-gradient-to-r from-kawai-gold/10 via-kawai-gold/5 to-transparent border-2 border-kawai-gold/30 shadow-md'
                  : 'bg-white/50 hover:bg-white border-2 border-transparent hover:border-gray-100 hover:shadow-sm'
              )}
            >
              {/* Current day indicator */}
              {isCurrentDay && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-kawai-gold to-kawai-red rounded-l-xl" />
              )}

              <span
                className={cn(
                  'text-sm font-semibold tracking-wide transition-colors duration-300',
                  isCurrentDay ? 'text-kawai-gold' : 'text-gray-700 group-hover:text-kawai-charcoal'
                )}
              >
                {formatDayLabel(dayName)}
              </span>

              <span
                className={cn(
                  'text-sm font-medium text-right transition-colors duration-300',
                  hour.isClosed
                    ? 'text-gray-400'
                    : isCurrentDay
                      ? 'text-kawai-charcoal'
                      : 'text-gray-600 group-hover:text-kawai-charcoal'
                )}
              >
                {hour.isClosed ? (
                  'Closed'
                ) : hour.openTime && hour.closeTime ? (
                  `${formatTimeDisplay(hour.openTime)} - ${formatTimeDisplay(hour.closeTime)}`
                ) : (
                  'Closed'
                )}
              </span>
            </div>
          )
        })}
      </div>

      {/* Additional Info with refined styling */}
      {dealer.hours && dealer.hours.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200/60">
          {dealer.contactInfo?.phone && (
            <p className="text-sm text-gray-600 text-center leading-relaxed">
              For holiday hours or special exceptions, please{' '}
              <a
                href={`tel:${dealer.contactInfo.phone}`}
                className="text-kawai-gold hover:text-kawai-red font-semibold underline decoration-kawai-gold/30 hover:decoration-kawai-red transition-all duration-300"
              >
                call us
              </a>
            </p>
          )}
          {!dealer.contactInfo?.phone && (
            <p className="text-sm text-gray-600 text-center leading-relaxed">
              Please contact the dealer directly for holiday hours or special exceptions
            </p>
          )}
        </div>
      )}
    </div>
  )
}
