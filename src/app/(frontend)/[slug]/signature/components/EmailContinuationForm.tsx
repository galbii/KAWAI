'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ConstantContactForm, type FormConfig } from '@/components/forms/ConstantContactForm'
import type { ConstantContactConfig } from '@/hooks/useConstantContactIntegration'
import type { AssessmentResponse } from '../types'

interface EmailContinuationFormProps {
  onComplete: (type: 'email', data: any) => void
  location: string
  onBack?: () => void
  className?: string
}

export function EmailContinuationForm({
  onComplete,
  location,
  onBack,
  className
}: EmailContinuationFormProps) {
  // Simple form configuration for email continuation
  const formConfig: FormConfig = {
    title: 'Please enter your email to continue',
    description: 'We\'ll use this to send you your personalized piano recommendations and assessment results.',
    fields: [
      {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'your@email.com',
        required: true
      }
    ],
    submitText: 'Continue to Assessment',
    loadingText: 'Processing...',
    successMessage: 'Email saved! Continuing to your assessment...',
    theme: 'signature',
    className: 'max-w-md mx-auto'
  }

  // Constant Contact configuration for signature experience
  const constantContactConfig: ConstantContactConfig = {
    targetList: 'Signature Experience Participants',
    createListIfMissing: true,
    showAuthPrompts: false
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={className}
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg mx-auto">
        {/* Simple continuation message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-kawai-red/10 rounded-full mb-6">
            <svg className="w-8 h-8 text-kawai-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-light font-serif text-kawai-black mb-4">
            Almost There!
          </h2>
          <p className="text-lg text-kawai-black/70 max-w-md mx-auto">
            Just one quick step before we begin your personalized piano assessment.
          </p>
        </div>

        {/* ConstantContact Form */}
        <ConstantContactForm
          constantContactConfig={constantContactConfig}
          formConfig={formConfig}
          onSuccess={(data) => {
            // Call the parent completion handler
            onComplete('email', {
              ...data,
              conversionType: 'email-continuation',
              location,
              formType: 'signature-email-continuation'
            })
          }}
          onError={(error) => {
            console.error('Email continuation error:', error)
            // Form continues to work even if Constant Contact fails
          }}
          additionalData={{
            location,
            formType: 'signature-email-continuation',
            eventType: 'signature-piano-experience',
            stage: 'email-continuation'
          }}
        />

        {/* Back Button */}
        {onBack && (
          <div className="mt-6 text-center">
            <button
              onClick={onBack}
              className="text-kawai-black/60 hover:text-kawai-black transition-colors duration-200 text-sm"
            >
              ← Back to Welcome
            </button>
          </div>
        )}

        {/* What's Next - Simple version */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center text-sm text-kawai-black/60">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span>Next:</span>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-kawai-red rounded-full"></span>
                <span>3-minute piano assessment</span>
              </div>
            </div>
            <p className="text-xs text-kawai-black/50">
              We'll help you discover your perfect piano match
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default EmailContinuationForm