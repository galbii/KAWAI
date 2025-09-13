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
          "w-full p-6 text-left border-2 rounded-xl transition-all duration-300 group",
          "hover:shadow-lg hover:shadow-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50",
          isSelected
            ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-500/20"
            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50",
          className
        )}
        role="radio"
        aria-checked={isSelected}
        tabIndex={0}
      >
        <div className="flex items-start space-x-4">
          {/* Icon */}
          {IconComponent && (
            <div className={cn(
              "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
              isSelected
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
            )}>
              <IconComponent className="w-5 h-5" />
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-semibold text-lg mb-2 transition-colors duration-300",
              isSelected ? "text-blue-900" : "text-gray-900"
            )}>
              {option.label}
            </h3>
            <p className={cn(
              "text-sm leading-relaxed transition-colors duration-300",
              isSelected ? "text-blue-700" : "text-gray-600"
            )}>
              {option.description}
            </p>
          </div>
          
          {/* Selection indicator */}
          <div className={cn(
            "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
            isSelected
              ? "border-blue-500 bg-blue-500"
              : "border-gray-300 group-hover:border-gray-400"
          )}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: isSelected ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="w-2 h-2 rounded-full bg-white"
            />
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
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Question {stepNumber} of {totalSteps}
          </span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="text-3xl font-bold text-gray-900 mb-4 leading-tight"
        >
          {question.title}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
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
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={stepNumber === 1}
            className={cn(
              "flex items-center space-x-2 px-6 py-3",
              stepNumber === 1 ? "invisible" : ""
            )}
          >
            <Icons.ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          {/* Progress indicator */}
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index + 1 === stepNumber
                    ? "bg-blue-500 w-6"
                    : index + 1 < stepNumber
                    ? "bg-blue-300"
                    : "bg-gray-300"
                )}
              />
            ))}
          </div>

          {/* Next Button */}
          <div className="flex items-center space-x-3">
            {allowSkip && !isValid && (
              <Button
                type="button"
                variant="ghost"
                onClick={onNext}
                className="text-gray-500 hover:text-gray-700"
              >
                Skip
              </Button>
            )}
            
            <Button
              type="button"
              onClick={onNext}
              disabled={!isValid && !allowSkip}
              className={cn(
                "flex items-center space-x-2 px-6 py-3 min-w-[100px]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isValid
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30"
                  : ""
              )}
            >
              <span>
                {stepNumber === totalSteps ? 'Complete' : 'Next'}
              </span>
              {stepNumber < totalSteps && (
                <Icons.ChevronRight className="w-4 h-4" />
              )}
            </Button>
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
            <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg inline-block">
              Please select a valid option to continue
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default QuestionStep