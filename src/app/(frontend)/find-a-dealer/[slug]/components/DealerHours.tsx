'use client'

import type { Dealer } from '@/payload-types'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface DealerHoursProps {
  dealer: Dealer
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

export function DealerHours({ dealer, className = '' }: DealerHoursProps) {
  const [currentStatus, setCurrentStatus] = useState<CurrentStatus | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Parse time string to minutes since midnight (supports AM/PM and 24h)
  const parseTime = (timeStr: string | null | undefined): number | null => {
    if (!timeStr || typeof timeStr !== 'string') return null
    const cleaned = timeStr.trim()
    if (cleaned === '') return null

    let hours: number
    let minutes: number

    const ampmMatch = cleaned.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i)
    if (ampmMatch && ampmMatch[1] && ampmMatch[2] && ampmMatch[3]) {
      hours = parseInt(ampmMatch[1], 10)
      minutes = parseInt(ampmMatch[2], 10)
      const period = ampmMatch[3].toUpperCase()
      if (period === 'PM' && hours !== 12) hours += 12
      else if (period === 'AM' && hours === 12) hours = 0
    } else {
      const timeMatch = cleaned.match(/^(\d{1,2}):(\d{2})$/)
      if (!timeMatch || !timeMatch[1] || !timeMatch[2]) return null
      hours = parseInt(timeMatch[1], 10)
      minutes = parseInt(timeMatch[2], 10)
    }

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null
    return hours * 60 + minutes
  }

  const isCurrentlyOpen = (hourEntry: HourEntry | null | undefined): boolean => {
    if (!hourEntry || hourEntry.isClosed) return false
    if (!hourEntry.openTime || !hourEntry.closeTime) return false
    const openMinutes = parseTime(hourEntry.openTime)
    const closeMinutes = parseTime(hourEntry.closeTime)
    if (openMinutes === null || closeMinutes === null) return false
    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    return currentMinutes >= openMinutes && currentMinutes < closeMinutes
  }

  const getDayName = (index: number): string => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return days[index] ?? 'unknown'
  }

  useEffect(() => {
    setIsMounted(true)

    if (!dealer.hours || !Array.isArray(dealer.hours) || dealer.hours.length === 0) {
      setCurrentStatus(null)
      return
    }

    const now = new Date()
    const currentDayName = getDayName(now.getDay())
    const currentHours = dealer.hours.find(
      (h) => h && typeof h === 'object' && h.day && h.day.toLowerCase() === currentDayName
    )

    if (!currentHours) {
      setCurrentStatus({ isOpen: false, currentDay: currentDayName, currentHours: undefined })
      return
    }

    setCurrentStatus({
      isOpen: isCurrentlyOpen(currentHours),
      currentDay: currentDayName,
      currentHours,
    })
  }, [dealer.hours])

  // Fallback — no hours data
  if (!dealer.hours || !Array.isArray(dealer.hours) || dealer.hours.length === 0) {
    return (
      <div className={cn('', className)}>
        <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-4">
          Hours
        </div>
        <p className="text-sm text-kawai-black/60 mb-3">Hours not listed online</p>
        {dealer.contactInfo?.phone && (
          <a
            href={`tel:${dealer.contactInfo.phone}`}
            className="text-sm font-medium text-kawai-black hover:text-kawai-red transition-colors"
          >
            Call for hours →
          </a>
        )}
      </div>
    )
  }

  const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const sortedHours = [...dealer.hours].sort((a, b) => {
    const aDay = a?.day?.toLowerCase() ?? ''
    const bDay = b?.day?.toLowerCase() ?? ''
    return dayOrder.indexOf(aDay) - dayOrder.indexOf(bDay)
  })

  const formatDayLabel = (day: string): string =>
    day.charAt(0).toUpperCase() + day.slice(1, 3)

  return (
    <div className={cn('', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase">
          Hours
        </div>
        {isMounted && currentStatus && (
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                'w-1.5 h-1.5 rounded-full flex-shrink-0',
                currentStatus.isOpen ? 'bg-green-500' : 'bg-kawai-black/20'
              )}
            />
            <span
              className={cn(
                'text-xs font-medium tracking-wide uppercase',
                currentStatus.isOpen ? 'text-green-600' : 'text-kawai-black/40'
              )}
            >
              {currentStatus.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
        )}
      </div>

      {/* Hours table */}
      <div className="space-y-1">
        {sortedHours.map((hour) => {
          if (!hour || typeof hour !== 'object') return null

          const dayName = typeof hour.day === 'string' ? hour.day : ''
          const dayLower = dayName.toLowerCase()
          const isCurrentDay =
            isMounted && currentStatus ? dayLower === currentStatus.currentDay : false

          return (
            <div
              key={dayName}
              className={cn(
                'flex justify-between items-center py-1.5 text-sm',
                isCurrentDay
                  ? 'text-kawai-red font-medium'
                  : 'text-kawai-black/60'
              )}
            >
              <span>{formatDayLabel(dayName)}</span>
              <span
                className={cn(
                  'text-right',
                  isCurrentDay ? 'text-kawai-black font-medium' : 'text-kawai-black/50'
                )}
              >
                {hour.isClosed
                  ? 'Closed'
                  : hour.openTime && hour.closeTime
                  ? `${hour.openTime} – ${hour.closeTime}`
                  : 'Closed'}
              </span>
            </div>
          )
        })}
      </div>

      {dealer.contactInfo?.phone && (
        <p className="text-xs text-kawai-black/40 mt-3 uppercase tracking-wider">
          Call for holiday hours
        </p>
      )}
    </div>
  )
}
