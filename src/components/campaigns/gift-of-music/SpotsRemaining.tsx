'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SpotsRemainingProps {
  totalSpots: number
  spotsRemaining: number
  className?: string
}

export default function SpotsRemaining({
  totalSpots,
  spotsRemaining,
  className
}: SpotsRemainingProps) {
  const takenSpots = totalSpots - spotsRemaining
  const percentageFilled = ((takenSpots) / totalSpots) * 100

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">
          Spots Remaining
        </span>
        <span className="text-xl font-bold text-kawai-red">
          {spotsRemaining} / {totalSpots}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200 shadow-inner">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-kawai-red"
          initial={{ width: 0 }}
          animate={{ width: `${percentageFilled}%` }}
          transition={{
            duration: 1,
            delay: 0.8,
            ease: 'easeOut'
          }}
        />
      </div>

      {/* Social Proof Text */}
      <p className="text-sm text-gray-600 font-medium">
        {takenSpots} families enrolled today
      </p>
    </div>
  )
}
