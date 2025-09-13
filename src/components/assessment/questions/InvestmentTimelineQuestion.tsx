'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { QuestionStep } from '../QuestionStep'
import { ASSESSMENT_QUESTIONS_BY_ID } from '@/app/(frontend)/[slug]/signature/lib/constants'
import type { FormStepProps } from '@/app/(frontend)/[slug]/signature/types'

/**
 * Investment Timeline Question Component
 * Fourth question - determines purchase urgency and decision timeline
 */
export const InvestmentTimelineQuestion: React.FC<FormStepProps> = ({
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
  const question = ASSESSMENT_QUESTIONS_BY_ID.investmentTimeline

  return (
    <motion.div
      initial={{ opacity: 0, rotate: 1 }}
      animate={{ opacity: 1, rotate: 0 }}
      exit={{ opacity: 0, rotate: -1 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
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

      {/* Timeline flexibility message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="text-center mt-8"
      >
        <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">No pressure!</span>
          <span>We'll tailor our recommendations to your timeline</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default InvestmentTimelineQuestion