'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { QuestionStep } from '../QuestionStep'
import { ASSESSMENT_QUESTIONS_BY_ID } from '@/components/pages/signature/lib/constants'
import type { FormStepProps } from '@/components/pages/signature/types'

/**
 * Collection Access Level Question Component
 * Final question - determines conversion path preference
 */
export const CollectionAccessQuestion: React.FC<FormStepProps> = ({
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
  const question = ASSESSMENT_QUESTIONS_BY_ID.collectionAccessLevel

  if (!question) {
    return null
  }

  // Experience type icons and descriptions
  const experienceTypes = {
    'curated-recommendations': {
      icon: '📱',
      description: 'Digital-first convenience',
      benefits: ['Instant access', 'Personalized matches', 'Detailed guides']
    },
    'private-viewing': {
      icon: '🏛️', 
      description: 'In-person expertise',
      benefits: ['Touch and hear pianos', 'Expert guidance', 'Personalized service']
    },
    'both': {
      icon: '🌟',
      description: 'Comprehensive experience', 
      benefits: ['Best of both worlds', 'Complete guidance', 'Maximum convenience']
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
        value={value || ''}
        onChange={onChange}
        onNext={onNext || (() => {})}
        onBack={onBack || (() => {})}
        isValid={isValid}
        showNavigation={showNavigation}
        stepNumber={stepNumber}
        totalSteps={totalSteps}
      />

      {/* Experience benefits preview */}
      {value && experienceTypes[value as keyof typeof experienceTypes] && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          <div className="max-w-md mx-auto bg-white border border-blue-200 rounded-xl p-4 shadow-sm">
            <div className="text-center mb-3">
              <span className="text-2xl">
                {experienceTypes[value as keyof typeof experienceTypes].icon}
              </span>
              <h4 className="font-medium text-gray-900 mt-1">
                {experienceTypes[value as keyof typeof experienceTypes].description}
              </h4>
            </div>
            <ul className="space-y-1">
              {experienceTypes[value as keyof typeof experienceTypes].benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center text-sm text-gray-600"
                >
                  <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
        <div className="max-w-lg mx-auto bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-4 rounded-lg border border-blue-100">
          <p className="text-sm text-gray-700">
            <span className="font-medium text-blue-600">🚀 Almost there!</span> Your personalized piano recommendations are just one click away.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default CollectionAccessQuestion