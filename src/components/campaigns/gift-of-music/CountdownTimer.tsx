'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  deadline: Date
  className?: string
}

export default function CountdownTimer({ deadline, className }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = deadline.getTime() - now

      if (distance < 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setTimeRemaining({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [deadline])

  return (
    <div className={cn("text-center", className)}>
      <div className="mb-4">
        <p className="text-xs sm:text-sm font-semibold text-kawai-red uppercase tracking-wide mb-1">Limited Time Offer</p>
        <p className="text-base sm:text-lg text-gray-700 font-bold">This Offer Ends In:</p>
      </div>
      <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-md mx-auto mb-4">
        {[
          { label: 'Days', value: timeRemaining.days },
          { label: 'Hours', value: timeRemaining.hours },
          { label: 'Minutes', value: timeRemaining.minutes },
          { label: 'Seconds', value: timeRemaining.seconds }
        ].map((item) => (
          <div key={item.label} className="bg-kawai-red text-white rounded-lg p-3 sm:p-4 shadow-md">
            <div className="text-3xl sm:text-4xl font-bold font-mono leading-none">
              {String(item.value).padStart(2, '0')}
            </div>
            <div className="text-xs sm:text-sm mt-2 opacity-95 font-medium">{item.label}</div>
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-600">
        Deadline: {deadline.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </p>
    </div>
  )
}
