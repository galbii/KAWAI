'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AssessmentToastProps {
  isVisible: boolean
  type: 'saved' | 'resumed' | 'progress'
  message: string
  progress?: number
  onClose?: () => void
  duration?: number
  className?: string
}

export const AssessmentToast: React.FC<AssessmentToastProps> = ({
  isVisible,
  type,
  message,
  progress,
  onClose,
  duration = 3000,
  className
}) => {
  React.useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  const toastConfig = {
    saved: {
      icon: '✓',
      bgColor: 'bg-green-500',
      textColor: 'text-white'
    },
    resumed: {
      icon: '▶️',
      bgColor: 'bg-kawai-red',
      textColor: 'text-white'
    },
    progress: {
      icon: '⏳',
      bgColor: 'bg-blue-500',
      textColor: 'text-white'
    }
  }

  const config = toastConfig[type]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            duration: 0.3
          }}
          className={cn(
            "fixed bottom-24 right-6 z-50 shadow-2xl rounded-xl overflow-hidden max-w-sm",
            className
          )}
        >
          <div className={cn("px-4 py-3 flex items-center gap-3", config.bgColor, config.textColor)}>
            {/* Icon */}
            <div className="text-lg flex-shrink-0">
              {config.icon}
            </div>

            {/* Message */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {message}
              </p>
              {progress !== undefined && (
                <p className="text-xs opacity-90 mt-1">
                  {progress}% complete
                </p>
              )}
            </div>

            {/* Close button */}
            {onClose && (
              <button
                onClick={onClose}
                className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Progress bar for auto-close */}
          {duration > 0 && (
            <motion.div
              className="h-1 bg-white/30"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              style={{ originX: 0 }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AssessmentToast