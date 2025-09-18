'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { InteractiveAssessment } from '@/components/assessment/InteractiveAssessment'
import { EmailContinuationForm } from './EmailContinuationForm'
import { DualConversion } from './DualConversion'
import { ExitIntentModal } from './ExitIntentModal'
import { WelcomeScreen } from './WelcomeScreen'
import { AssessmentControlHub, type AssessmentState } from './AssessmentControlHub'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { trackSubmitApplication, trackCompleteRegistration } from '@/components/MetaPixel'
import { usePostHog } from 'posthog-js/react'
import type { AssessmentResponse } from '../types'
import { ASSESSMENT_QUESTIONS } from '../lib/constants'

interface SignatureExperienceProps {
  slug: string
}

type ExperienceStage = 'welcome' | 'email' | 'assessment' | 'conversion' | 'complete'

type DialogPhase = 'welcome-intro' | 'loading-assessment' | 'assessment' | 'thank-you' | 'analyzing'

interface EmailData {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  optInMarketing?: boolean
  constantContactAdded?: boolean
  conversionType?: string
  location?: string
  formType?: string
}

export function SignatureExperience({ slug }: SignatureExperienceProps) {
  const posthog = usePostHog()
  const [currentStage, setCurrentStage] = useState<ExperienceStage>('welcome')
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResponse | null>(null)
  const [emailData, setEmailData] = useState<EmailData | null>(null)
  const [showExitIntent, setShowExitIntent] = useState(false)
  const [showAssessmentDialog, setShowAssessmentDialog] = useState(false)
  const [hasAssessmentProgress, setHasAssessmentProgress] = useState(false)
  const [assessmentProgressData, setAssessmentProgressData] = useState<any>(null)
  const [assessmentState, setAssessmentState] = useState<AssessmentState>('not-started')
  const [showSavedFeedback, setShowSavedFeedback] = useState(false)
  const [currentAssessmentStep, setCurrentAssessmentStep] = useState(0)
  const [dialogPhase, setDialogPhase] = useState<DialogPhase>('welcome-intro')

  // Auto-scroll functionality
  const conversionRef = useRef<HTMLDivElement>(null)

  // Auto-progression through dialog phases
  useEffect(() => {
    if (!showAssessmentDialog) return

    // Skip auto-progression if user has assessment progress and we start directly at assessment phase
    if (dialogPhase === 'assessment' && assessmentProgressData) {
      return // Stay on assessment phase
    }

    if (dialogPhase === 'welcome-intro') {
      // Welcome intro: fade in (0.8s) + hold (1s) + fade out (0.7s) = 2.5s total
      const timer = setTimeout(() => {
        setDialogPhase('loading-assessment')
      }, 2500)
      return () => clearTimeout(timer)
    } else if (dialogPhase === 'loading-assessment') {
      // Loading: fade in (0.5s) + hold (2s) + fade out (0.5s) = 3s total
      const timer = setTimeout(() => {
        setDialogPhase('assessment')
      }, 3000)
      return () => clearTimeout(timer)
    } else if (dialogPhase === 'thank-you') {
      // Thank you: fade in (0.5s) + hold (1s) = 1.5s total
      const timer = setTimeout(() => {
        setDialogPhase('analyzing')
      }, 1500)
      return () => clearTimeout(timer)
    } else if (dialogPhase === 'analyzing') {
      // Analyzing: fade in (0.5s) + loading (2s) + checkmark (0.5s) = 3s total
      const timer = setTimeout(() => {
        // Close dialog and go to conversion
        setShowAssessmentDialog(false)
        setCurrentStage('conversion')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [dialogPhase, showAssessmentDialog, assessmentProgressData])

  // Handle welcome screen continuation
  const handleWelcomeContinue = () => {
    setCurrentStage('email')
  }

  // Handle email form completion
  const handleEmailComplete = (type: 'email', data: any) => {
    console.log('✅ Email form completed:', data)
    console.log('📧 Email extracted:', data?.email)
    console.log('📋 Full data structure:', JSON.stringify(data, null, 2))
    setEmailData(data)
    setCurrentStage('assessment')
    // Open the assessment dialog and update state
    setShowAssessmentDialog(true)
    setAssessmentState('active')
    setDialogPhase('welcome-intro')
  }

  // Handle assessment completion
  const handleAssessmentComplete = async (results: AssessmentResponse) => {
    console.log('Assessment completed:', results)
    setAssessmentResults(results)
    setAssessmentState('completed')
    setDialogPhase('thank-you')
    console.log('Dialog phase set to thank-you')
  }

  // Handle dual conversion completion
  const handleConversionComplete = (type: 'email' | 'booking', data: any) => {
    console.log(`Conversion completed: ${type}`, data)
    console.log('Render check - currentStage:', currentStage, 'assessmentResults:', assessmentResults)
    setCurrentStage('complete')

    // Track Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion_completed', {
        event_category: 'signature_experience',
        event_label: type,
        value: type === 'booking' ? 1000 : 500
      })
    }

    // Track Meta Pixel events
    if (type === 'booking') {
      // Track submit application for booking appointments
      trackSubmitApplication({
        content_name: `Signature Experience - ${slug}`,
        content_category: 'piano_consultation',
        value: 1000,
        currency: 'USD',
        status: data.conversionType === 'calendly' ? 'calendly_booking' : 'manual_booking'
      })

      // Also track as a completed registration
      trackCompleteRegistration({
        content_name: `Piano Consultation - ${slug}`,
        content_category: 'signature_collection',
        value: 1000,
        currency: 'USD'
      })

      // Track PostHog event for signature houston booking
      posthog?.capture('signature_houston_booking', {
        signature_page: slug,
        conversion_type: data.conversionType || 'booking',
        booking_method: data.conversionType === 'calendly' ? 'calendly' : 'manual_form',
        email: emailData?.email,
        assessment_completed: !!assessmentResults,
        calendly_event_uri: data.calendlyEventData?.data?.payload?.event?.uri,
        calendly_invitee_uri: data.calendlyEventData?.data?.payload?.invitee?.uri,
        value: 1000,
        currency: 'USD'
      })
    } else if (type === 'email') {
      // Track lead generation for email capture
      trackSubmitApplication({
        content_name: `Email Lead - ${slug}`,
        content_category: 'piano_interest',
        value: 500,
        currency: 'USD',
        status: 'email_captured'
      })

      // Track PostHog event for email lead
      posthog?.capture('signature_email_lead', {
        signature_page: slug,
        email: emailData?.email || data.email,
        assessment_completed: !!assessmentResults,
        conversion_type: 'email_only',
        value: 500,
        currency: 'USD'
      })
    }
  }

  // Assessment Control Hub Handlers
  const handleStartAssessment = () => {
    console.log('Starting assessment from control hub')

    // Move to email stage if not already past it
    if (currentStage === 'welcome') {
      setCurrentStage('email')
    } else if (emailData) {
      // If user has assessment progress, call handleResumeAssessment (which works correctly)
      if (assessmentProgressData) {
        handleResumeAssessment()
        return
      }

      // Otherwise, start fresh assessment
      setCurrentStage('assessment')
      setShowAssessmentDialog(true)
      setAssessmentState('active')
      setDialogPhase('welcome-intro')
    }
  }

  const handleResumeAssessment = () => {
    console.log('Resuming assessment with progress:', assessmentProgressData)
    
    // If we're not in assessment stage, move to it
    if (currentStage !== 'assessment') {
      setCurrentStage('assessment')
    }
    
    // Open the assessment dialog
    setShowAssessmentDialog(true)
    setAssessmentState('active')
    setDialogPhase('assessment') // Resume goes directly to assessment, skipping intro
    
    // Track analytics
    const currentStep = assessmentProgressData?.currentStep || 0
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'assessment_resumed', {
        event_category: 'signature_experience',
        event_label: 'control_hub',
        value: currentStep
      })
    }
  }

  const handlePauseAssessment = () => {
    console.log('Pausing assessment from control hub')
    setShowAssessmentDialog(false)
    setAssessmentState('paused')
    
    // Show save confirmation in control hub
    setShowSavedFeedback(true)
    
    // Track analytics
    const currentStep = assessmentProgressData?.currentStep || 0
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'assessment_paused', {
        event_category: 'signature_experience',
        event_label: 'control_hub',
        value: currentStep
      })
    }
  }

  // Stage transition animations
  const stageVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 }
  }

  const stageTransition = {
    type: "spring" as const,
    stiffness: 100,
    damping: 20,
    duration: 0.6
  }

  // Check for saved assessment progress and update assessment state
  useEffect(() => {
    const checkSavedProgress = () => {
      try {
        const savedData = localStorage.getItem('assessment_assessment_signature')
        if (savedData) {
          const parsed = JSON.parse(savedData)
          if (parsed.currentStep > 0 && parsed.responses && Object.keys(parsed.responses).length > 0) {
            setHasAssessmentProgress(true)
            setAssessmentProgressData(parsed)
            
            // Update assessment state based on current stage and dialog status
            if (assessmentResults) {
              setAssessmentState('completed')
            } else if (showAssessmentDialog) {
              setAssessmentState('active')
            } else {
              // If user has saved progress, they should always be in 'paused' state
              setAssessmentState('paused')
            }
          } else {
            setAssessmentState('not-started')
          }
        } else {
          setAssessmentState('not-started')
        }
      } catch (error) {
        console.warn('Failed to check saved assessment progress:', error)
        setAssessmentState('not-started')
      }
    }

    checkSavedProgress()
  }, [currentStage, showAssessmentDialog, emailData, assessmentResults])

  // Debug emailData changes
  useEffect(() => {
    console.log('🔄 EmailData state changed:', emailData)
    console.log('📧 Current email:', emailData?.email)
    console.log('🎯 Current stage:', currentStage)
  }, [emailData, currentStage])

  // Auto-scroll to conversion section when assessment completes
  useEffect(() => {
    if (currentStage === 'conversion') {
      // Longer delay to ensure dialog closes and conversion section renders completely
      const timer = setTimeout(() => {
        if (conversionRef.current) {
          // Use requestAnimationFrame for smoother timing
          requestAnimationFrame(() => {
            conversionRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            })
          })
        }
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [currentStage])

  return (
    <section id="signature-experience" className="min-h-screen bg-stone-50">
      {/* Conditional container - full width for welcome, contained for other stages */}
      {currentStage === 'welcome' ? (
        <AnimatePresence mode="wait">
          <motion.div
            key="welcome"
            variants={stageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={stageTransition}
            className="min-h-screen"
          >
            <WelcomeScreen onContinue={handleWelcomeContinue} />
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="container mx-auto px-4 py-16">
          {/* Progress Indicator */}
          <motion.div
            className="max-w-4xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-center space-x-3 text-sm font-medium">
              {/* Email Stage */}
              <div className={`flex items-center ${currentStage === 'email' ? 'text-kawai-red' : 'text-kawai-black/40'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2 ${
                  currentStage === 'email' ? 'border-kawai-red bg-kawai-red/10' :
                  ['assessment', 'conversion', 'complete'].includes(currentStage) ? 'border-kawai-red bg-kawai-red/10' : 'border-kawai-black/30'
                }`}>
                  {['assessment', 'conversion', 'complete'].includes(currentStage) ? '✓' : '1'}
                </div>
                Email
              </div>

              <div className={`w-12 h-0.5 ${
                ['assessment', 'conversion', 'complete'].includes(currentStage) ? 'bg-kawai-red' : 'bg-kawai-black/30'
              }`} />

              {/* Assessment Stage */}
              <div className={`flex items-center ${currentStage === 'assessment' ? 'text-kawai-red' : 'text-kawai-black/40'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2 ${
                  currentStage === 'assessment' ? 'border-kawai-red bg-kawai-red/10' :
                  ['conversion', 'complete'].includes(currentStage) ? 'border-kawai-red bg-kawai-red/10' : 'border-kawai-black/30'
                }`}>
                  {['conversion', 'complete'].includes(currentStage) ? '✓' : '2'}
                </div>
                Assessment
              </div>

              <div className={`w-12 h-0.5 ${
                ['conversion', 'complete'].includes(currentStage) ? 'bg-kawai-red' : 'bg-kawai-black/30'
              }`} />

              {/* Conversion Stage */}
              <div className={`flex items-center ${currentStage === 'conversion' ? 'text-kawai-red' : 'text-kawai-black/40'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2 ${
                  currentStage === 'conversion' ? 'border-kawai-red bg-kawai-red/10' :
                  currentStage === 'complete' ? 'border-kawai-red bg-kawai-red/10' : 'border-kawai-black/30'
                }`}>
                  {currentStage === 'complete' ? '✓' : '3'}
                </div>
                Choose Path
              </div>

              <div className={`w-12 h-0.5 ${
                currentStage === 'complete' ? 'bg-kawai-red' : 'bg-kawai-black/30'
              }`} />

              {/* Complete Stage */}
              <div className={`flex items-center ${currentStage === 'complete' ? 'text-kawai-red' : 'text-kawai-black/40'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2 ${
                  currentStage === 'complete' ? 'border-kawai-red bg-kawai-red/10' : 'border-kawai-black/30'
                }`}>
                  {currentStage === 'complete' ? '✓' : '4'}
                </div>
                Complete
              </div>
            </div>
          </motion.div>

          {/* Main Experience Stages */}
          <AnimatePresence mode="wait">

          {/* Email Form Stage */}
          {currentStage === 'email' && (
            <motion.div
              key="email"
              variants={stageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={stageTransition}
              className="max-w-4xl mx-auto"
            >
              <EmailContinuationForm
                onComplete={handleEmailComplete}
                location={slug}
                onBack={() => setCurrentStage('welcome')}
              />
            </motion.div>
          )}

          {/* Assessment Stage - Loading State */}
          {currentStage === 'assessment' && (
            <motion.div
              key="assessment-loading"
              variants={stageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={stageTransition}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center">
                <div className="bg-white rounded-2xl shadow-xl p-12">
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-light font-serif text-kawai-black mb-8">
                        Assessment Started
                      </h2>
                      <motion.button
                        onClick={handleResumeAssessment}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-kawai-red hover:bg-red-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-kawai-red focus:ring-offset-2 shadow-lg"
                      >
                        Continue
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Dual Conversion Stage */}
          {currentStage === 'conversion' && assessmentResults && (
            <motion.div
              ref={conversionRef}
              key="dual-conversion"
              variants={stageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={stageTransition}
              className="max-w-4xl mx-auto"
            >
              {(() => {
                console.log('🎯 Rendering DualConversion with emailData:', emailData)
                console.log('📧 Email being passed:', emailData?.email)
                return (
                  <DualConversion
                    assessmentResults={assessmentResults!}
                    onComplete={handleConversionComplete}
                    location={slug}
                    emailData={emailData}
                  />
                )
              })()}
            </motion.div>
          )}

          {/* Completion Stage */}
          {currentStage === 'complete' && (
            <motion.div
              key="complete"
              variants={stageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={stageTransition}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="bg-white rounded-2xl shadow-xl p-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h2 className="text-5xl font-light text-kawai-red mb-6">
                  See you there!
                </h2>
                <p className="text-xl text-kawai-black/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                  You'll receive event confirmation details in your email and an official warm welcome from our team here at Kawai! We can't wait to see you there!
                </p>

                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
                    <div className="w-16 h-16 bg-kawai-red rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-kawai-black mb-2">Email Confirmation</h3>
                    <p className="text-kawai-black/70 text-sm">Event details and location information arriving soon</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-amber-50 to-yellow-100 rounded-xl border border-amber-200">
                    <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-kawai-black mb-2">Signature Collection</h3>
                    <p className="text-kawai-black/70 text-sm">Exclusive access to our heritage piano collection</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-kawai-black mb-2">Expert Team</h3>
                    <p className="text-kawai-black/70 text-sm">Personal guidance from certified master craftsmen</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          </AnimatePresence>

          {/* Exit Intent Modal */}
          <ExitIntentModal
            isOpen={showExitIntent}
            onClose={() => setShowExitIntent(false)}
            onCapture={(data) => {
              console.log('Exit intent capture:', data)
              setShowExitIntent(false)
            }}
          />
        </div>
      )}

      {/* Assessment Dialog - Custom Scrollable Implementation */}
      <AnimatePresence>
        {showAssessmentDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handlePauseAssessment()
              }
            }}
          >
            <div className="fixed inset-0">
              <div className="flex min-h-full items-center justify-center p-4">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Dynamic Dialog Content Based on Phase */}
                  <AnimatePresence mode="wait">
                    
                    {/* Welcome Intro Phase */}
                    {dialogPhase === 'welcome-intro' && (
                      <motion.div
                        key="dialog-welcome-intro"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="flex-1 flex items-center justify-center bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 p-12"
                      >
                        <div className="text-center">
                          <motion.h1 
                            className="text-3xl md:text-5xl font-light font-serif text-white mb-4"
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                          >
                            Welcome to the
                          </motion.h1>
                          <motion.h2 
                            className="text-4xl md:text-6xl font-light font-serif text-amber-400"
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                          >
                            Signature Experience
                          </motion.h2>
                        </div>
                      </motion.div>
                    )}

                    {/* Loading Assessment Phase */}
                    {dialogPhase === 'loading-assessment' && (
                      <motion.div
                        key="dialog-loading-assessment"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="flex-1 flex items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100 p-12"
                      >
                        <div className="text-center max-w-xl mx-auto">
                          <motion.h1 
                            className="text-2xl md:text-4xl font-light font-serif text-kawai-black mb-6"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                          >
                            Preparing Your Assessment
                          </motion.h1>
                          <motion.p 
                            className="text-lg text-kawai-black/70 font-light leading-relaxed mb-8"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                          >
                            Our master craftsmen are preparing your personalized piano assessment experience...
                          </motion.p>
                          <motion.div
                            className="flex justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.4 }}
                          >
                            <div className="flex space-x-2">
                              <motion.div
                                className="w-3 h-3 bg-kawai-red rounded-full"
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                              />
                              <motion.div
                                className="w-3 h-3 bg-kawai-red rounded-full"
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                              />
                              <motion.div
                                className="w-3 h-3 bg-kawai-red rounded-full"
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                              />
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}

                    {/* Assessment Phase */}
                    {dialogPhase === 'assessment' && (
                      <motion.div
                        key="dialog-assessment"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 flex flex-col min-h-0"
                      >
                        {/* Header */}
                        <div className="p-6 pb-4 border-b border-gray-200 flex-shrink-0 relative">
                          {/* Save Button - Top Right */}
                          <motion.button
                            onClick={handlePauseAssessment}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="absolute right-6 top-6 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 flex items-center gap-2 shadow-sm"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h4v16H6V4zM14 4h4v16h-4V4z" />
                            </svg>
                            <span>Pause & Save</span>
                          </motion.button>
                          
                          <div className="text-center">
                            <h2 className="text-2xl md:text-3xl font-light font-serif text-kawai-black">
                              Claim Your Invite
                            </h2>
                            <p className="text-kawai-black/70 mt-2">
                              Lets get to know who you are and claim an invite to the Baby Grand Select!
                            </p>
                            <div className="flex items-center justify-center gap-2 mt-3 text-xs text-kawai-black/50">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Your progress is automatically saved</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Scrollable Content */}
                        <div
                          className="flex-1 min-h-0 overflow-y-auto scroll-smooth focus:outline-none"
                          style={{
                            scrollBehavior: 'smooth',
                            WebkitOverflowScrolling: 'touch'
                          }}
                          tabIndex={0}
                          onWheel={(e) => {
                            // Ensure wheel events propagate correctly for smooth scrolling
                            e.stopPropagation()
                          }}
                        >
                          <InteractiveAssessment
                            questions={ASSESSMENT_QUESTIONS}
                            onComplete={handleAssessmentComplete}
                            onProgress={(currentStep, totalSteps) => {
                              // Track current step for pause/resume functionality
                              setCurrentAssessmentStep(currentStep - 1) // Convert to 0-based index
                              console.log('Assessment progress:', currentStep, 'of', totalSteps)
                            }}
                            allowBack={true}
                            saveProgress={true}
                            progressIndicator={false}
                            estimatedTime={3}
                            dialogMode={true}
                            initialStep={currentAssessmentStep}
                            className="!bg-transparent"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Thank You Phase */}
                    {dialogPhase === 'thank-you' && (
                      <motion.div
                        key="dialog-thank-you"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="flex-1 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 p-12"
                      >
                        <div className="text-center">
                          <motion.h1 
                            className="text-3xl md:text-5xl font-light font-serif text-emerald-800 mb-8"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                          >
                            Thank you
                          </motion.h1>
                          <motion.div
                            className="mt-8"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6, duration: 0.4, type: "spring" }}
                          >
                            <svg className="w-16 h-16 mx-auto text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}

                    {/* Analyzing Phase */}
                    {dialogPhase === 'analyzing' && (
                      <motion.div
                        key="dialog-analyzing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="flex-1 flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-100 p-12"
                      >
                        <div className="text-center">
                          <motion.h1 
                            className="text-2xl md:text-4xl font-light font-serif text-amber-800 mb-12"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                          >
                            Analyzing
                          </motion.h1>
                          <motion.div
                            className="relative"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            <motion.div
                              className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full mx-auto"
                              animate={{ 
                                rotate: 360,
                                opacity: [1, 1, 0]
                              }}
                              transition={{ 
                                rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                                opacity: { duration: 2.5, times: [0, 0.8, 1] }
                              }}
                            />
                            <motion.div
                              className="absolute inset-0 flex items-center justify-center"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 2.5, duration: 0.5, type: "spring" }}
                            >
                              <svg className="w-16 h-16 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </motion.div>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assessment Control Hub */}
      <AssessmentControlHub
        state={assessmentState}
        currentStep={assessmentProgressData?.currentStep || 0}
        totalSteps={ASSESSMENT_QUESTIONS.length}
        onStart={handleStartAssessment}
        onResume={handleResumeAssessment}
        onMinimize={handlePauseAssessment}
        isVisible={currentStage !== 'welcome' && currentStage !== 'conversion' && currentStage !== 'complete'}
        showSavedFeedback={showSavedFeedback}
      />
    </section>
  )
}