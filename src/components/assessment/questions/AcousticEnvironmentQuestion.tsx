'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { QuestionStep } from '../QuestionStep'
import { ASSESSMENT_QUESTIONS_BY_ID } from '@/components/pages/signature/lib/constants'
import type { FormStepProps } from '@/components/pages/signature/types'

/**
 * Acoustic Environment Question Component
 * Third question - explores physical space and acoustic considerations
 */
export const AcousticEnvironmentQuestion: React.FC<FormStepProps> = ({
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
  const question = ASSESSMENT_QUESTIONS_BY_ID.acousticEnvironment

  if (!question) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
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

      {/* Space optimization tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="text-center mt-8"
      >
        <div className="max-w-md mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-medium text-blue-600">💡 Pro tip:</span> Room acoustics significantly impact your piano's sound and your playing experience.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AcousticEnvironmentQuestion