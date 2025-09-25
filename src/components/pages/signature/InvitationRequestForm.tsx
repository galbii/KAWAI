'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ConstantContactForm, type FormConfig } from '@/components/forms/ConstantContactForm'
import type { ConstantContactConfig } from '@/hooks/useConstantContactIntegration'
import type { AssessmentResponse } from './types'

interface InvitationRequestFormProps {
  assessmentResults: AssessmentResponse
  onComplete: (type: 'email', data: any) => void
  location: string
  onBack?: () => void
  className?: string
}

export function InvitationRequestForm({
  assessmentResults,
  onComplete,
  location,
  onBack,
  className
}: InvitationRequestFormProps) {
  // Form configuration for invitation request
  const formConfig: FormConfig = {
    title: 'Request Your Exclusive Invitation',
    description: 'Based on your responses, you qualify for our exclusive signature piano event. Enter your email to receive your formal invitation within 24 hours.',
    fields: [
      {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'your@email.com',
        required: true
      }
    ],
    submitText: 'Send My Invitation',
    loadingText: 'Requesting Invitation...',
    successMessage: 'Invitation request submitted! Check your email within 24 hours for your exclusive event details.',
    theme: 'signature',
    className: 'max-w-md mx-auto'
  }

  // Constant Contact configuration for signature events
  const constantContactConfig: ConstantContactConfig = {
    targetList: 'Signature Event Invitations',
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
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Qualification Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-light font-serif text-kawai-black mb-4">
            Congratulations! You Qualify
          </h2>
          <p className="text-xl text-kawai-black/70 max-w-2xl mx-auto mb-2">
            Your responses indicate you're an ideal candidate for our exclusive signature piano event.
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
              conversionType: 'invitation',
              assessmentResults,
              location,
              formType: 'signature-invitation'
            })
          }}
          onError={(error) => {
            console.error('Signature invitation request error:', error)
            // Form continues to work even if Constant Contact fails
          }}
          additionalData={{
            assessmentResults,
            location,
            formType: 'signature-invitation',
            eventType: 'signature-piano-event',
            qualificationScore: calculateQualificationScore(assessmentResults)
          }}
        />

        {/* Back Button */}
        {onBack && (
          <div className="mt-6 text-center">
            <button
              onClick={onBack}
              className="text-kawai-black/60 hover:text-kawai-black transition-colors duration-200 text-sm"
            >
              ← Back to Assessment
            </button>
          </div>
        )}

        {/* What Happens Next */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            What Happens Next?
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-center text-sm">
            <div className="p-4">
              <div className="text-2xl mb-2">📧</div>
              <h4 className="font-medium mb-1">Invitation Sent</h4>
              <p className="text-gray-600">Formal invitation within 24 hours</p>
            </div>
            <div className="p-4">
              <div className="text-2xl mb-2">🎹</div>
              <h4 className="font-medium mb-1">Exclusive Access</h4>
              <p className="text-gray-600">Private viewing of signature instruments</p>
            </div>
            <div className="p-4">
              <div className="text-2xl mb-2">👨‍🎨</div>
              <h4 className="font-medium mb-1">Expert Consultation</h4>
              <p className="text-gray-600">One-on-one with master craftsmen</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Calculate qualification score based on assessment responses
 * Higher scores indicate better qualification for exclusive events
 */
function calculateQualificationScore(assessmentResults: AssessmentResponse): number {
  let score = 0

  // Musical identity weight
  const identityValue = assessmentResults.musicalIdentity
  if (identityValue === 'professional') score += 40
  else if (identityValue === 'active') score += 30
  else if (identityValue === 'family-legacy') score += 25
  else if (identityValue === 'returning') score += 20
  else score += 10

  // Timeline weight - use existing InvestmentTimeline values
  const timelineValue = assessmentResults.investmentTimeline
  if (timelineValue === 'ready-30-days') score += 40
  else if (timelineValue === 'exploring-2-6-months') score += 30
  else if (timelineValue === 'planning-this-year') score += 20
  else if (timelineValue === 'beginning-research') score += 10

  // Exclusive access interest scoring
  const accessValue = assessmentResults.exclusiveAccess
  if (accessValue === 'highly-interested') score += 40
  else if (accessValue === 'interested') score += 30
  else if (accessValue === 'somewhat-interested') score += 20
  else if (accessValue === 'prefer-standard') score += 10
  else if (!accessValue) score += 20 // Default score if not provided

  return score
}

export default InvitationRequestForm