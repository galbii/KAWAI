'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ConstantContactForm, type FormConfig } from '@/components/forms/ConstantContactForm'
import type { ConstantContactConfig } from '@/hooks/useConstantContactIntegration'
import type { AssessmentResponse } from './types'

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
  // Minimal form configuration for signature experience
  const formConfig: FormConfig = {
    title: '',
    description: '',
    fields: [
      {
        name: 'email',
        label: '',
        type: 'email',
        placeholder: 'Enter your email address',
        required: true
      }
    ],
    submitText: 'Apply Now',
    loadingText: 'Reserving your invitation...',
    successMessage: 'Invitation reserved! Preparing your signature experience...',
    theme: 'signature-minimal',
    className: 'w-full max-w-sm mx-auto',
    showAuthPrompts: false
  }

  // Constant Contact configuration for signature experience
  const constantContactConfig: ConstantContactConfig = {
    targetList: 'Signature Experience Participants',
    createListIfMissing: true,
    showAuthPrompts: false
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex items-center justify-center bg-white p-12"
    >
      <div className="text-center max-w-md mx-auto">
        {/* Main Heading */}
        <motion.h1
          className="text-4xl md:text-5xl font-light font-serif text-kawai-black mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Please enter your email to continue
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="text-lg text-kawai-black/70 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Reserve your free tuning and Delivery!
        </motion.p>

        {/* Email Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
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
        </motion.div>

      </div>
    </motion.div>
  )
}

export default EmailContinuationForm