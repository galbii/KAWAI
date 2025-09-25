'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { QuestionStep } from '../QuestionStep'
import { ASSESSMENT_QUESTIONS_BY_ID } from '@/components/pages/signature/lib/constants'
import type { FormStepProps } from '@/components/pages/signature/types'

/**
 * Aesthetic Preference Question Component
 * Fifth question - explores style and finish preferences
 */
export const AestheticPreferenceQuestion: React.FC<FormStepProps> = ({
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
  const question = ASSESSMENT_QUESTIONS_BY_ID.aestheticPreference

  if (!question) {
    return null
  }

  // Color palette visualization for aesthetic options
  const finishPreviews = {
    'classic-ebony': ['#000000', '#1a1a1a', '#2d2d2d'],
    'rich-mahogany': ['#7d4f39', '#a0613b', '#8b4513'],
    'contemporary-white': ['#ffffff', '#f8f8f8', '#f0f0f0'],
    'experience-differences': ['#000000', '#7d4f39', '#ffffff']
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      {/* Visual style preview */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-center mb-6"
      >
        <div className="inline-flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {Object.entries(finishPreviews).map(([key, colors], index) => (
            <motion.div
              key={key}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={`flex space-x-1 p-2 rounded ${value === key ? 'bg-white shadow-sm' : ''}`}
            >
              {colors.map((color, colorIndex) => (
                <div
                  key={colorIndex}
                  className="w-3 h-3 rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                />
              ))}
            </motion.div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">Preview of finish options</p>
      </motion.div>

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

      {/* Style confidence message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="text-center mt-8"
      >
        <div className="max-w-lg mx-auto bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border">
          <p className="text-sm text-gray-700">
            <span className="font-medium text-purple-600">🎨 Style matters:</span> Your piano will be a centerpiece in your home for decades to come.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AestheticPreferenceQuestion