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

    </motion.div>
  )
}

export default ExclusiveAccessQuestion