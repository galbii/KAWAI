'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ViewType } from './GL10Navigation'

interface ViewIndicatorProps {
  currentView: ViewType
  views: ViewType[]
  onViewChange?: (view: ViewType) => void
  className?: string
}

/**
 * Progress dots indicator for mobile navigation
 * Shows current position in the view sequence
 */
export default function ViewIndicator({
  currentView,
  views,
  onViewChange,
  className
}: ViewIndicatorProps) {
  const currentIndex = views.indexOf(currentView)

  return (
    <div
      className={cn(
        'fixed bottom-24 left-0 right-0 z-40',
        'flex justify-center items-center gap-2',
        'md:hidden', // Only show on mobile
        'pointer-events-none',
        className
      )}
    >
      <div className="flex gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg pointer-events-auto">
        {views.map((view, index) => (
          <button
            key={view}
            onClick={() => onViewChange?.(view)}
            className={cn(
              'w-2 h-2 rounded-full transition-all duration-300',
              'hover:scale-125',
              currentIndex === index
                ? 'bg-kawai-red w-6'
                : 'bg-gray-300 hover:bg-gray-400'
            )}
            aria-label={`Go to ${view} view`}
            aria-current={currentIndex === index ? 'true' : 'false'}
          >
            {/* Active indicator animation */}
            {currentIndex === index && (
              <motion.div
                layoutId="activeIndicator"
                className="w-full h-full bg-kawai-red rounded-full"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
