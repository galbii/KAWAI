'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { QuestionStep } from '../QuestionStep'
import { ASSESSMENT_QUESTIONS_BY_ID } from '@/app/(frontend)/[slug]/signature/lib/constants'
import type { FormStepProps } from '@/app/(frontend)/[slug]/signature/types'

/**
 * Musical Identity Question Component
 * First question in the assessment flow - determines user's piano journey stage
 */
export const MusicalIdentityQuestion: React.FC<FormStepProps> = ({
  value,
  onChange,
  onNext,
  onBack,
  isValid,
  showNavigation = true,
  stepNumber,
  totalSteps,
  className
}) => {
  const question = ASSESSMENT_QUESTIONS_BY_ID.musicalIdentity

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {/* Welcome message for first question */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <svg 
            className="w-8 h-8 text-blue-600" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Let's Find Your Perfect Piano
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          This personalized assessment will help us recommend the ideal Kawai piano for your unique needs and preferences.
        </p>
      </motion.div>

      <QuestionStep
        question={question}
        value={value}
        onChange={onChange}
        onNext={onNext}
        onBack={onBack}
        isValid={isValid}
        showNavigation={showNavigation}
        stepNumber={stepNumber}
        totalSteps={totalSteps}
      />

      {/* Encouragement text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="text-center mt-8 text-sm text-gray-500"
      >
        <p>No wrong answers - just honest preferences that help us serve you better.</p>
      </motion.div>
    </motion.div>
  )
}

export default MusicalIdentityQuestion