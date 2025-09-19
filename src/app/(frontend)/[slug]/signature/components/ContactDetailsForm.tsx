'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ConstantContactForm, type FormConfig } from '@/components/forms/ConstantContactForm'
import type { ConstantContactConfig } from '@/hooks/useConstantContactIntegration'

interface ContactDetailsFormProps {
  onComplete: (type: 'contact-details', data: any) => void
  location: string
  emailData: { email: string; [key: string]: any } | null
  onBack?: () => void
  className?: string
}

export function ContactDetailsForm({
  onComplete,
  location,
  emailData,
  onBack,
  className
}: ContactDetailsFormProps) {
  // Form configuration for contact details collection
  const formConfig: FormConfig = {
    title: '',
    description: '',
    fields: [
      {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        placeholder: 'Enter your first name',
        required: true
      },
      {
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        placeholder: 'Enter your last name',
        required: true
      }
    ],
    submitText: 'See your Results',
    loadingText: 'Updating your information...',
    successMessage: 'Contact details updated successfully!',
    theme: 'signature-minimal',
    className: 'w-full max-w-sm mx-auto',
    showAuthPrompts: false
  }

  // Constant Contact configuration for updating existing contact
  const constantContactConfig: ConstantContactConfig = {
    targetList: 'Signature Experience Participants',
    createListIfMissing: false, // Don't create - contact should already exist from email step
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
          className="text-4xl md:text-5xl font-light font-serif text-kawai-black mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Tell us about yourself
        </motion.h1>

        {/* Contact Details Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <ConstantContactForm
            constantContactConfig={constantContactConfig}
            formConfig={formConfig}
            onSuccess={(data) => {
              // Merge with existing email data and call completion handler
              onComplete('contact-details', {
                ...emailData,
                ...data,
                conversionType: 'contact-details-completion',
                location,
                formType: 'signature-contact-details'
              })
            }}
            onError={(error) => {
              console.error('Contact details collection error:', error)
              // Continue even if Constant Contact update fails
              // The form will still capture the data locally
            }}
            additionalData={{
              email: emailData?.email, // Include existing email for contact matching
              location,
              formType: 'signature-contact-details',
              eventType: 'signature-piano-experience',
              stage: 'contact-details-collection'
            }}
          />
        </motion.div>

        {/* Progress indicator */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-2 text-xs text-kawai-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>This information helps us prepare your personalized consultation</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ContactDetailsForm