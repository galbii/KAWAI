'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export type AssessmentState = 'not-started' | 'active' | 'paused' | 'completed'

interface AssessmentControlHubProps {
  state: AssessmentState
  currentStep?: number
  totalSteps?: number
  onStart?: () => void
  onPause?: () => void
  onResume?: () => void
  onMinimize?: () => void
  onResumeFromEmail?: () => void
  hasEmailProgress?: boolean
  isVisible?: boolean
  showSavedFeedback?: boolean
  className?: string
}

export const AssessmentControlHub: React.FC<AssessmentControlHubProps> = ({
  state,
  currentStep = 0,
  totalSteps = 8,
  onStart,
  onPause,
  onResume,
  onMinimize,
  onResumeFromEmail,
  hasEmailProgress = false,
  isVisible = true,
  showSavedFeedback = false,
  className
}) => {
  const [internalShowSaved, setInternalShowSaved] = React.useState(false)
  const [showTooltip, setShowTooltip] = React.useState(true)

  // Handle saved feedback display
  React.useEffect(() => {
    if (showSavedFeedback) {
      setInternalShowSaved(true)
      const timer = setTimeout(() => {
        setInternalShowSaved(false)
      }, 2000) // Show for 2 seconds
      return () => clearTimeout(timer)
    }
  }, [showSavedFeedback])

  // Auto-hide tooltip after 4 seconds - show on mount and when state changes to paused
  React.useEffect(() => {
    // Show tooltip when component mounts or when switching to paused state
    setShowTooltip(true)

    const timer = setTimeout(() => {
      setShowTooltip(false)
    }, 4000) // Hide after 4 seconds
    return () => clearTimeout(timer)
  }, [state]) // Re-run when state changes
  const progressPercent = totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - currentStep / totalSteps)

  // Different configurations for each state
  const stateConfig = {
    'not-started': {
      icon: 'kawai-logo',
      title: hasEmailProgress ? 'Continue Experience' : 'Continue',
      subtitle: hasEmailProgress ? 'Resume from email step' : 'Continue your assessment from here',
      action: hasEmailProgress ? onResumeFromEmail : onResume, // Prioritize email resume
      bgColor: 'from-white to-gray-50',
      showProgress: false
    },
    'active': {
      icon: '⏸️',
      title: 'Pause & Save',
      subtitle: `Step ${currentStep} of ${totalSteps}`,
      action: onMinimize || onPause,
      bgColor: 'from-amber-500 to-orange-600',
      showProgress: true
    },
    'paused': {
      icon: '▶️',
      title: 'Continue Assessment',
      subtitle: `${progressPercent}% complete`,
      action: onResume,
      bgColor: 'from-kawai-red to-red-700',
      showProgress: true
    },
    'completed': {
      icon: '✅',
      title: 'Assessment Complete',
      subtitle: 'View your results',
      action: undefined,
      bgColor: 'from-green-500 to-green-700',
      showProgress: false
    }
  }

  // Override config if showing saved feedback
  const config = internalShowSaved ? {
    icon: '✓',
    title: 'Progress Saved!',
    subtitle: `${progressPercent}% complete`,
    action: undefined,
    bgColor: 'from-green-500 to-green-700',
    showProgress: true
  } : stateConfig[state]
  
  const shouldShow = isVisible && state !== 'completed'

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.4
          }}
          className={cn(
            "fixed bottom-6 right-6 z-50 drop-shadow-2xl",
            className
          )}
        >
          {/* Progress Ring (only show for active/paused states) */}
          {config.showProgress && (
            <div className="absolute inset-0">
              <svg 
                className="absolute inset-0 w-20 h-20 transform -rotate-90" 
                width="80" 
                height="80"
              >
                {/* Background circle */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  className="text-white/20"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="text-white transition-all duration-500 ease-out"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}

          {/* Main Button */}
          <motion.button
            onClick={config.action}
            disabled={!config.action}
            whileHover={config.action ? { scale: 1.05 } : {}}
            whileTap={config.action ? { scale: 0.95 } : {}}
            className={cn(
              "relative w-20 h-20 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-kawai-red/30 focus:ring-offset-2 group text-white",
              `bg-gradient-to-r ${config.bgColor}`,
              config.action ? "cursor-pointer" : "cursor-default"
            )}
            aria-label={`${config.title} - ${config.subtitle}`}
          >
            {/* Icon/Emoji/Logo */}
            <div className="group-hover:scale-110 transition-transform duration-200">
              {config.icon === 'kawai-logo' ? (
                <img
                  src="/piano-logo-optimized.webp"
                  alt="Kawai Piano"
                  className="w-16 h-16 mx-auto object-contain p-1"
                  onError={(e) => {
                    // Fallback to piano emoji if logo fails to load
                    const imgElement = e.currentTarget as HTMLImageElement
                    const fallbackElement = imgElement.nextElementSibling as HTMLElement
                    imgElement.style.display = 'none'
                    if (fallbackElement) fallbackElement.style.display = 'block'
                  }}
                />
              ) : (
                <div className="text-2xl">
                  {config.icon}
                </div>
              )}
              {/* Fallback piano emoji (hidden by default) */}
              {config.icon === 'kawai-logo' && (
                <div className="text-2xl" style={{ display: 'none' }}>
                  🎹
                </div>
              )}
            </div>

            {/* Pulsing ring animation for interactive states */}
            {config.action && (
              <motion.div 
                className="absolute inset-0 rounded-full bg-current opacity-20"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </motion.button>

          {/* Tooltip/Label */}
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: 0.5 }}
              className="absolute right-full top-1/2 transform -translate-y-1/2 mr-4 hidden sm:block"
            >
            <div className="bg-kawai-black text-white text-sm px-4 py-3 rounded-lg shadow-lg whitespace-nowrap relative">
              <div className="font-semibold">{config.title}</div>
              <div className="text-xs text-white/70 mt-1">{config.subtitle}</div>
              
              {/* Arrow pointing to button */}
              <div className="absolute top-1/2 left-full transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-kawai-black border-t-4 border-t-transparent border-b-4 border-b-transparent" />
            </div>
            </motion.div>
          )}

          {/* Mobile-only compact label - positioned to the left like desktop */}
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: 0.7 }}
              className="sm:hidden absolute right-full top-1/2 transform -translate-y-1/2 mr-3"
            >
            <div className="bg-kawai-black text-white text-xs px-3 py-2 rounded-lg shadow-lg text-center relative">
              <div className="font-medium">{config.title}</div>
              {config.showProgress && (
                <div className="text-white/70 mt-1">{config.subtitle}</div>
              )}

              {/* Arrow pointing to button - same as desktop */}
              <div className="absolute top-1/2 left-full transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-kawai-black border-t-4 border-t-transparent border-b-4 border-b-transparent" />
            </div>
            </motion.div>
          )}

          {/* Auto-save indicator for paused state */}
          {state === 'paused' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-lg"
            >
              ✓ Saved
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AssessmentControlHub