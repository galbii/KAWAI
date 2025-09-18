'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ResumeAssessmentButtonProps {
  isVisible: boolean
  onResume: () => void
  currentStep: number
  totalSteps: number
  className?: string
}

export const ResumeAssessmentButton: React.FC<ResumeAssessmentButtonProps> = ({
  isVisible,
  onResume,
  currentStep,
  totalSteps,
  className
}) => {
  const progressPercent = Math.round((currentStep / totalSteps) * 100)
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - currentStep / totalSteps)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.3
          }}
          className={cn(
            "fixed bottom-6 right-6 z-50 drop-shadow-2xl",
            className
          )}
        >
          {/* Progress Ring Background */}
          <div className="relative">
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
                className="text-kawai-black/10"
              />
              {/* Progress circle */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="text-kawai-red transition-all duration-500 ease-out"
                strokeLinecap="round"
              />
            </svg>

            {/* Main Button */}
            <motion.button
              onClick={onResume}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-20 h-20 bg-gradient-to-r from-kawai-red to-red-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-kawai-red/30 focus:ring-offset-2 group"
              aria-label={`Resume assessment - ${progressPercent}% complete, step ${currentStep} of ${totalSteps}`}
            >
              {/* Play Icon */}
              <svg 
                className="w-8 h-8 ml-1 group-hover:scale-110 transition-transform duration-200" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>

              {/* Pulsing ring animation */}
              <div className="absolute inset-0 rounded-full bg-kawai-red opacity-20 animate-ping" />
            </motion.button>
          </div>

          {/* Tooltip/Label */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute right-full top-1/2 transform -translate-y-1/2 mr-4 hidden sm:block"
          >
            <div className="bg-kawai-black text-white text-sm px-4 py-2 rounded-lg shadow-lg whitespace-nowrap relative">
              <div className="font-medium">Continue Assessment</div>
              <div className="text-xs text-white/70">{progressPercent}% complete</div>
              
              {/* Arrow pointing to button */}
              <div className="absolute top-1/2 left-full transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-kawai-black border-t-4 border-t-transparent border-b-4 border-b-transparent" />
            </div>
          </motion.div>

          {/* Mobile-only progress text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="sm:hidden absolute -bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="bg-kawai-black text-white text-xs px-3 py-1 rounded-full shadow-lg">
              {progressPercent}% complete
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ResumeAssessmentButton