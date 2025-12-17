'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CTAButtonProps {
  onClick: () => void
  children: React.ReactNode
  subtext?: string
  spotsRemaining?: number
  variant?: 'primary' | 'secondary'
  className?: string
}

export default function CTAButton({
  onClick,
  children,
  subtext,
  spotsRemaining,
  variant = 'primary',
  className
}: CTAButtonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "w-full py-6 px-8 rounded-xl font-bold text-xl sm:text-2xl shadow-lg transition-all transform hover:shadow-xl border-2",
          variant === 'primary' && "bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white border-orange-400",
          variant === 'secondary' && "bg-kawai-red hover:bg-kawai-red/90 text-white border-red-700"
        )}
      >
        <span className="block">{children}</span>
        {spotsRemaining !== undefined && (
          <span className="block text-sm font-semibold mt-1 opacity-90">Only {spotsRemaining} Spots Left</span>
        )}
      </motion.button>
      {subtext && (
        <p className="text-sm text-gray-600 text-center font-medium">
          {subtext}
        </p>
      )}
    </div>
  )
}
