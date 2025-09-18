'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { AssessmentQuestion, AssessmentOption } from '@/app/(frontend)/[slug]/signature/types'
import * as Icons from 'lucide-react'

interface QuestionStepProps {
  question: AssessmentQuestion
  value?: string
  onChange: (value: string) => void
  onNext?: () => void
  onBack?: () => void
  isValid: boolean
  showNavigation?: boolean
  stepNumber: number
  totalSteps: number
  className?: string
  allowSkip?: boolean
}

interface OptionButtonProps {
  option: AssessmentOption
  isSelected: boolean
  onClick: () => void
  className?: string
}

/**
 * Individual option button component with luxury styling
 */
const OptionButton: React.FC<OptionButtonProps> = ({ 
  option, 
  isSelected, 
  onClick, 
  className 
}) => {
  // Get the icon component dynamically
  const IconComponent = option.icon ? (Icons as any)[option.icon as keyof typeof Icons] : null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "w-full p-4 sm:p-6 text-left border-2 rounded-md transition-all duration-300 group touch-manipulation min-h-[44px]",
          "hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-kawai-red/50",
          isSelected
            ? "border-kawai-red bg-kawai-red/5 shadow-md"
            : "border-kawai-black/20 bg-white hover:border-kawai-red hover:bg-stone-50",
          className
        )}
        role="radio"
        aria-checked={isSelected}
        tabIndex={0}
      >
        <div className="flex items-center">
          {/* Radio button indicator (like homepage) */}
          <div className={cn(
            "w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center transition-all duration-300",
            isSelected
              ? "border-kawai-red bg-kawai-red"
              : "border-kawai-black/30"
          )}>
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full rounded-full bg-white scale-50"
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className={cn(
              "font-medium transition-colors duration-300",
              isSelected ? "text-kawai-black" : "text-kawai-black"
            )}>
              {option.label}
            </div>
            {option.description && (
              <div className={cn(
                "text-sm mt-1 transition-colors duration-300",
                isSelected ? "text-kawai-black/80" : "text-kawai-black/60"
              )}>
                {option.description}
              </div>
            )}
          </div>
        </div>
      </button>
    </motion.div>
  )
}

/**
 * Main QuestionStep component with elegant layout and animations
 */
export const QuestionStep: React.FC<QuestionStepProps> = ({
  question,
  value,
  onChange,
  onNext,
  onBack,
  isValid,
  showNavigation = true,
  stepNumber,
  totalSteps,
  className,
  allowSkip = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("max-w-4xl mx-auto", className)}
    >
      {/* Question Header */}
      <div className="mb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="mb-4"
        >
          <span className="text-sm font-medium text-kawai-red bg-kawai-red/10 px-3 py-1 rounded-full">
            Question {stepNumber} of {totalSteps}
          </span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="text-3xl font-light font-serif text-kawai-black mb-4 leading-tight"
        >
          {question.title}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="text-lg text-kawai-black/70 max-w-2xl mx-auto leading-relaxed"
        >
          {question.description}
        </motion.p>
      </div>

      {/* Options */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="space-y-4 mb-8"
      >
        <AnimatePresence mode="popLayout">
          {question.options.map((option, index) => (
            <motion.div
              key={option.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
            >
              <OptionButton
                option={option}
                isSelected={value === option.value}
                onClick={() => onChange(option.value)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Navigation */}
      {showNavigation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.3 }}
          className="flex items-center justify-between"
        >
          {/* Back Button */}
          <button
            type="button"
            onClick={onBack}
            disabled={stepNumber === 1}
            className={cn(
              "px-6 py-3 rounded-md font-medium transition-colors",
              stepNumber === 1
                ? "text-kawai-black/40 cursor-not-allowed invisible"
                : "text-kawai-black hover:text-kawai-red"
            )}
          >
            ← Previous
          </button>


          {/* Next Button */}
          <div className="flex items-center space-x-3">
            {allowSkip && !isValid && (
              <button
                type="button"
                onClick={onNext}
                className="text-kawai-black/50 hover:text-kawai-red px-6 py-3 rounded-md font-medium transition-colors"
              >
                Skip
              </button>
            )}

            <button
              type="button"
              onClick={onNext}
              disabled={!isValid && !allowSkip}
              className={cn(
                "px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] rounded-md font-medium transition-colors text-sm sm:text-base",
                isValid
                  ? "bg-kawai-red hover:bg-kawai-black text-white"
                  : "bg-kawai-black/20 text-kawai-black/40 cursor-not-allowed"
              )}
            >
              {stepNumber === totalSteps ? 'Complete Assessment →' : 'Next Step →'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Validation message */}
      <AnimatePresence>
        {!isValid && value && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 text-center"
          >
            <p className="text-sm text-kawai-red bg-kawai-red/10 px-4 py-2 rounded-lg inline-block">
              Please select an option to continue
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default QuestionStep