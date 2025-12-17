'use client'

import { cn } from '@/lib/utils'

interface StickyHeaderProps {
  spotsRemaining: number
  timeRemaining: {
    days: number
    hours: number
    minutes: number
    seconds: number
  }
  className?: string
}

export default function StickyHeader({
  spotsRemaining,
  timeRemaining,
  className
}: StickyHeaderProps) {
  return (
    <div className={cn(
      "sticky top-0 z-50 bg-kawai-red",
      "text-white py-4 px-4 shadow-lg",
      className
    )}>
      <div className="max-w-6xl mx-auto flex items-center justify-between text-sm sm:text-base">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <span className="font-bold tracking-wide">{spotsRemaining} SPOTS LEFT</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-semibold hidden sm:inline">OFFER ENDS:</span>
          <span className="font-mono font-bold">
            {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m
          </span>
        </div>
      </div>
    </div>
  )
}
