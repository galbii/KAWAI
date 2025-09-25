'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { QuestionStep } from '../QuestionStep'
import { ASSESSMENT_QUESTIONS_BY_ID } from '@/components/pages/signature/lib/constants'
import type { FormStepProps } from '@/components/pages/signature/types'

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

  if (!question) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className={className}
    >

      <QuestionStep
        question={question}
        value={value || ''}
        onChange={onChange}
        onNext={onNext || (() => {})}
        onBack={onBack || (() => {})}
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
        <p className="text-kawai-black/60">Answer honestly - your responses determine qualification for this exclusive opportunity.</p>
      </motion.div>
    </motion.div>
  )
}

export default MusicalIdentityQuestion