'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { QuestionStep } from '../QuestionStep'
import { ASSESSMENT_QUESTIONS_BY_ID } from '@/app/(frontend)/[slug]/signature/lib/constants'
import type { FormStepProps } from '@/app/(frontend)/[slug]/signature/types'

/**
 * Exclusive Access Interest Question Component
 * Final question - determines interest level in exclusive signature events
 */
export const ExclusiveAccessQuestion: React.FC<FormStepProps> = ({
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
  const question = ASSESSMENT_QUESTIONS_BY_ID.exclusiveAccess

  // Interest level descriptions and benefits
  const interestTypes = {
    'highly-interested': {
      icon: '⭐',
      description: 'Priority access to exclusive events',
      benefits: ['First invitation to private events', 'Master craftsman consultations', 'Exclusive piano previews']
    },
    'interested': {
      icon: '❤️',
      description: 'Access to curated exclusive experiences',
      benefits: ['Invitations to select events', 'Private viewing opportunities', 'Specialized guidance']
    },
    'somewhat-interested': {
      icon: '👁️',
      description: 'Information about exclusive offerings',
      benefits: ['Event announcements', 'Special opportunity alerts', 'Educational content']
    },
    'prefer-standard': {
      icon: '🏠',
      description: 'Traditional showroom experience',
      benefits: ['Standard appointments', 'Regular showroom access', 'Classic consultation approach']
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
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

      {/* Interest level benefits preview */}
      {value && interestTypes[value as keyof typeof interestTypes] && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          <div className="max-w-md mx-auto bg-white border border-red-200 rounded-xl p-4 shadow-sm">
            <div className="text-center mb-3">
              <span className="text-2xl">
                {interestTypes[value as keyof typeof interestTypes].icon}
              </span>
              <h4 className="font-medium text-gray-900 mt-1">
                {interestTypes[value as keyof typeof interestTypes].description}
              </h4>
            </div>
            <ul className="space-y-1">
              {interestTypes[value as keyof typeof interestTypes].benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center text-sm text-gray-600"
                >
                  <svg className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {benefit}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      {/* Completion encouragement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="text-center mt-8"
      >
        <div className="max-w-lg mx-auto bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 p-4 rounded-lg border border-red-100">
          <p className="text-sm text-gray-700">
            <span className="font-medium text-red-600">Submit the assessment so we can see if you're a good fit for this exclusive event!</span>
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ExclusiveAccessQuestion