'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import * as Icons from 'lucide-react'

interface AssessmentProgressProps {
  currentStep: number
  totalSteps: number
  completedSteps: number[]
  stepTitles?: string[]
  variant?: 'dots' | 'bar' | 'steps'
  showPercentage?: boolean
  showLabels?: boolean
  showTimeEstimate?: boolean
  estimatedTimeMinutes?: number
  className?: string
}

/**
 * Elegant progress indicator for assessment flow
 * Supports multiple visual styles and smooth animations
 */
export const AssessmentProgress: React.FC<AssessmentProgressProps> = ({
  currentStep,
  totalSteps,
  completedSteps,
  stepTitles,
  variant = 'dots',
  showPercentage = true,
  showLabels = false,
  showTimeEstimate = false,
  estimatedTimeMinutes = 3,
  className
}) => {
  const completionPercentage = Math.round((completedSteps.length / totalSteps) * 100)
  const remainingTime = estimatedTimeMinutes * (1 - completedSteps.length / totalSteps)

  // Default step titles based on assessment questions
  const defaultTitles = [
    'Musical Identity',
    'Performance Goals',
    'Your Space',
    'Timeline',
    'Style Preference',
    'Experience Type'
  ]

  const titles = stepTitles || defaultTitles

  if (variant === 'bar') {
    return (
      <div className={cn("w-full space-y-4", className)}>
        {/* Progress Bar Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-900">
              Assessment Progress
            </h3>
            {showTimeEstimate && (
              <p className="text-xs text-gray-500">
                {Math.ceil(remainingTime)} min remaining
              </p>
            )}
          </div>
          {showPercentage && (
            <div className="text-right">
              <span className="text-lg font-semibold text-blue-600">
                {completionPercentage}%
              </span>
              <p className="text-xs text-gray-500">Complete</p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="overflow-hidden h-3 bg-gray-100 rounded-full">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          
          {/* Progress markers */}
          <div className="absolute inset-0 flex items-center justify-between px-1">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "w-2 h-2 rounded-full border-2 border-white",
                  completedSteps.includes(index + 1)
                    ? "bg-blue-600"
                    : index + 1 === currentStep
                    ? "bg-blue-400"
                    : "bg-gray-300"
                )}
              />
            ))}
          </div>
        </div>

        {/* Step Labels */}
        {showLabels && (
          <div className="flex justify-between text-xs text-gray-500 px-1">
            {titles.slice(0, totalSteps).map((title, index) => (
              <span
                key={index}
                className={cn(
                  "text-center max-w-16 truncate",
                  index + 1 === currentStep ? "text-blue-600 font-medium" : ""
                )}
              >
                {title}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (variant === 'steps') {
    return (
      <div className={cn("w-full", className)}>
        <div className="flex items-center justify-between">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNumber = index + 1
            const isCompleted = completedSteps.includes(stepNumber)
            const isCurrent = stepNumber === currentStep
            const isFuture = stepNumber > currentStep && !isCompleted

            return (
              <React.Fragment key={index}>
                {/* Step Circle */}
                <div className="flex flex-col items-center space-y-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                      isCompleted
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                        : isCurrent
                        ? "bg-blue-100 text-blue-600 border-2 border-blue-600"
                        : "bg-gray-100 text-gray-600"
                    )}
                  >
                    {isCompleted ? (
                      <Icons.Check className="w-5 h-5" />
                    ) : (
                      stepNumber
                    )}
                    
                    {/* Current step pulse */}
                    {isCurrent && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-blue-400"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.div>

                  {/* Step Label */}
                  {showLabels && (
                    <span className={cn(
                      "text-xs text-center max-w-20 leading-tight",
                      isCurrent ? "text-blue-600 font-medium" : "text-gray-500"
                    )}>
                      {titles[index]}
                    </span>
                  )}
                </div>

                {/* Connector Line */}
                {index < totalSteps - 1 && (
                  <div className="flex-1 mx-2">
                    <div className="relative h-0.5 bg-gray-200">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-blue-500"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: completedSteps.includes(stepNumber) ? '100%' : '0%' 
                        }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* Progress Summary */}
        {(showPercentage || showTimeEstimate) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center space-y-1"
          >
            {showPercentage && (
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-blue-600">
                  {completionPercentage}%
                </span>{' '}
                complete
              </p>
            )}
            {showTimeEstimate && (
              <p className="text-xs text-gray-500">
                About {Math.ceil(remainingTime)} minutes remaining
              </p>
            )}
          </motion.div>
        )}
      </div>
    )
  }

  // Default: dots variant
  return (
    <div className={cn("flex items-center justify-center space-x-3", className)}>
      {/* Progress Dots */}
      <div className="flex items-center space-x-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1
          const isCompleted = completedSteps.includes(stepNumber)
          const isCurrent = stepNumber === currentStep

          return (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  isCompleted
                    ? "bg-blue-500 shadow-sm"
                    : isCurrent
                    ? "bg-blue-400 w-8"
                    : "bg-gray-300"
                )}
              />
              
              {/* Current step pulse effect */}
              {isCurrent && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-blue-400"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Progress Text */}
      {(showPercentage || showTimeEstimate) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-600 ml-4"
        >
          {showPercentage && (
            <span className="font-medium">
              {completionPercentage}%
            </span>
          )}
          {showPercentage && showTimeEstimate && (
            <span className="mx-2">•</span>
          )}
          {showTimeEstimate && (
            <span>
              {Math.ceil(remainingTime)} min left
            </span>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default AssessmentProgress