'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { InteractiveAssessment } from '@/components/assessment/InteractiveAssessment'
import { EmailContinuationForm } from '@/components/pages/signature/EmailContinuationForm'
import { ContactDetailsForm } from '@/components/pages/signature/ContactDetailsForm'
import { DualConversion } from '@/components/pages/signature/DualConversion'
import { ExitIntentModal } from '@/components/pages/signature/ExitIntentModal'
import { WelcomeScreen } from '@/components/pages/signature/WelcomeScreen'
import { AssessmentControlHub } from '@/components/pages/signature/AssessmentControlHub'
import { CalendlyBookingWidget } from '@/components/pages/signature/CalendlyBookingWidget'
import { useSignatureExperience } from './SignatureExperienceContext'
import { trackSubmitApplication, trackCompleteRegistration } from '@/components/MetaPixel'
import { usePostHog } from 'posthog-js/react'
import useConstantContactIntegration from '@/hooks/useConstantContactIntegration'
import { ASSESSMENT_QUESTIONS } from './lib/constants'

interface SignatureExperienceProps {
  slug: string
}

// Component for sequential booking invite text display
function BookingInviteSequence() {
  const [currentText, setCurrentText] = useState<'first' | 'second' | null>('first')

  useEffect(() => {
    // First text: "You're invited." - show for 3 seconds then fade out
    const firstTimer = setTimeout(() => {
      setCurrentText(null) // Fade out first text
    }, 3000)

    // Second text: "Reserve your Signature Experience" - fade in after first fades out, show for 3 seconds
    const secondTimer = setTimeout(() => {
      setCurrentText('second')
    }, 3000) // Start second text exactly when first ends

    return () => {
      clearTimeout(firstTimer)
      clearTimeout(secondTimer)
    }
  }, [])

  return (
    <motion.div
      key="dialog-booking-invite-intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="flex-1 flex items-center justify-center bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 p-12"
    >
      <div className="text-center relative h-32 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {currentText === 'first' && (
            <motion.h1
              key="invited-text"
              className="text-3xl md:text-5xl font-light font-serif text-white absolute"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              You're invited.
            </motion.h1>
          )}
          {currentText === 'second' && (
            <motion.h2
              key="reserve-text"
              className="text-4xl md:text-6xl font-light font-serif text-amber-400 absolute"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              Reserve Your Signature
            </motion.h2>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export function SignatureExperience({ slug }: SignatureExperienceProps) {
  const posthog = usePostHog()

  // Constant Contact integration for uncommitted leads
  const {
    submitToConstantContact,
    isSubmitting: isSubmittingToCC,
    submitSuccess,
    submitError
  } = useConstantContactIntegration({
    targetList: 'Signature Uncommitted',
    createListIfMissing: true,
    showAuthPrompts: false
  })

  // Handle user exiting booking without completing - add to uncommitted list
  const handleBookingExit = async () => {
    const exitTimestamp = new Date().toISOString()
    console.log(`🚪 User booking exit - PostHog uncommitted_lead fired: ${exitTimestamp}`)

    if (!emailData?.email) {
      console.warn('No email data available for uncommitted list submission')
      return
    }

    try {
      console.log('🚪 User exiting booking without completing - adding to uncommitted list')

      // Fire PostHog event for uncommitted lead FIRST (priority tracking)
      posthog?.capture('uncommitted_lead', {
        email: emailData.email,
        firstName: emailData.firstName,
        lastName: emailData.lastName,
        phone: emailData.phone,
        signature_page: slug,
        assessment_completed: !!assessmentResults,
        lead_source: 'signature_experience',
        status: 'uncommitted',
        booking_exit: true,
        timestamp: exitTimestamp,
        // Include assessment data if available
        ...(assessmentResults && {
          musical_identity: assessmentResults.musicalIdentity,
          investment_timeline: assessmentResults.investmentTimeline,
          investment_range: assessmentResults.investmentRange,
          collection_access_level: assessmentResults.collectionAccessLevel,
          performance_aspirations: assessmentResults.performanceAspirations,
          acoustic_environment: assessmentResults.acousticEnvironment,
          aesthetic_preference: assessmentResults.aestheticPreference,
          exclusive_access: assessmentResults.exclusiveAccess
        })
      })

      console.log('📊 PostHog uncommitted_lead event fired for booking exit')

      // Submit to Constant Contact (non-blocking)
      const result = await submitToConstantContact({
        email: emailData.email,
        ...(emailData.firstName && { firstName: emailData.firstName }),
        ...(emailData.lastName && { lastName: emailData.lastName }),
        ...(emailData.phone && { phone: emailData.phone }),
        optInMarketing: emailData.optInMarketing ?? true
      })

      if (result) {
        console.log('✅ Successfully added user to signature uncommitted list')
      } else {
        console.error('❌ Failed to add user to signature uncommitted list')
      }
    } catch (error) {
      console.error('❌ Error adding user to signature uncommitted list:', error)
    }
  }

  // Get state and actions from context
  const {
    currentStage,
    assessmentResults,
    emailData,
    showAssessmentDialog,
    dialogPhase,
    assessmentState,
    currentAssessmentStep,
    hasAssessmentProgress,
    assessmentProgressData,
    showSavedFeedback,
    hasEmailProgress,
    handleEmailComplete,
    handleContactDetailsComplete,
    handleAssessmentComplete,
    handleEmailExit,
    resumeFromEmailStep,
    pauseAssessment,
    resumeAssessment,
    startAssessment,
    openAssessmentModal,
    handleConversionComplete: contextHandleConversionComplete,
    handleBookingComplete,
    closeAssessmentModal,
    setDialogPhase,
    setCurrentAssessmentStep
  } = useSignatureExperience()

  // Local state for this component only
  const [showExitIntent, setShowExitIntent] = useState(false)
  const [hideControlHubWhenDialogOpen, setHideControlHubWhenDialogOpen] = useState(false)
  const [showControlHubPopUp, setShowControlHubPopUp] = useState(false)

  // Auto-scroll functionality
  const conversionRef = useRef<HTMLDivElement>(null)

  // Auto-progression logic is now handled in context

  // Handle welcome screen continuation - use context function
  const handleWelcomeContinue = () => {
    openAssessmentModal()
  }

  // Email completion is now handled in context

  // Contact details completion is now handled in context

  // Assessment completion is now handled in context

  // Context function is already destructured above

  // Handle dual conversion completion with additional tracking
  const handleConversionComplete = (type: 'email' | 'booking', data: any) => {
    console.log(`Conversion completed: ${type}`, data)
    console.log('Render check - currentStage:', currentStage, 'assessmentResults:', assessmentResults)

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

      // Track PostHog event for signature houston booking (this should match the CalendlyBookingWidget event)
      const bookingTimestamp = new Date().toISOString()
      posthog?.capture('signature_houston_booking', {
        signature_page: slug,
        conversion_type: data.conversionType || 'booking',
        booking_method: data.conversionType === 'calendly' ? 'calendly' : 'manual_form',
        email: emailData?.email,
        assessment_completed: !!assessmentResults,
        calendly_event_uri: data.calendlyEventData?.data?.payload?.event?.uri,
        calendly_invitee_uri: data.calendlyEventData?.data?.payload?.invitee?.uri,
        value: 1000,
        currency: 'USD',
        timestamp: bookingTimestamp
      })

      console.log(`📈 PostHog signature_houston_booking fired from SignatureExperience: ${bookingTimestamp}`)
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

    // Call the context handler to manage state changes
    contextHandleConversionComplete(type, data)
  }

  // Assessment Control Hub Handlers are now in context

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

  // Saved progress checking is now handled in context

  // Debug logging for emailData changes
  useEffect(() => {
    console.log('🔄 EmailData state changed:', emailData)
    console.log('📧 Current email:', emailData?.email)
    console.log('🎯 Current stage:', currentStage)
  }, [emailData, currentStage])

  // Auto-scroll is now handled in context

  // Hide control hub after 3 seconds when dialog opens, with pop-up animation
  useEffect(() => {
    if (showAssessmentDialog) {
      // Briefly hide the control hub to trigger pop-up animation
      setShowControlHubPopUp(false)
      setHideControlHubWhenDialogOpen(true)

      // Show it again with pop-up animation after brief delay
      const popUpTimer = setTimeout(() => {
        setHideControlHubWhenDialogOpen(false)
        setShowControlHubPopUp(true)
      }, 100)

      // Hide it again after 3 seconds total
      const hideTimer = setTimeout(() => {
        setHideControlHubWhenDialogOpen(true)
        setShowControlHubPopUp(false)
      }, 3000)

      return () => {
        clearTimeout(popUpTimer)
        clearTimeout(hideTimer)
      }
    } else {
      // Reset when dialog closes
      setHideControlHubWhenDialogOpen(false)
      setShowControlHubPopUp(false)
    }
    return undefined
  }, [showAssessmentDialog])

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
                        onClick={resumeAssessment}
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
                  You'll receive an invitation in your email with your appointment details as well as your personal invitation which you can show for your special financing offer and tuning and delivery services!
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
                pauseAssessment()
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

                    {/* Email Form Phase */}
                    {dialogPhase === 'email-form' && (
                      <motion.div
                        key="dialog-email-form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 flex flex-col min-h-0 bg-stone-50"
                      >
                        {/* Header with X button */}
                        <div className="p-6 pb-4 border-b border-gray-200 flex-shrink-0 relative">
                          {/* X Button - Top Right */}
                          <motion.button
                            onClick={handleEmailExit}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="absolute right-6 top-6 text-kawai-black/60 hover:text-kawai-black transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-kawai-red/30 rounded-full p-2 hover:bg-gray-100"
                            aria-label="Close and save progress"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </motion.button>

                          <div className="text-center">
                            <h2 className="text-2xl md:text-3xl font-light font-serif text-kawai-black">
                              Reserve Your Invitation
                            </h2>
                          </div>
                        </div>

                        <div className="flex-1 flex items-center justify-center p-8">
                          <div className="w-full max-w-lg">
                            <EmailContinuationForm
                              onComplete={handleEmailComplete}
                              location={slug}
                              onBack={() => {
                                pauseAssessment()
                                // Don't set current stage back to welcome since user might want to restart
                              }}
                              className="!mt-0"
                            />
                          </div>
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
                          {/* Save Button - Top Right - Desktop Only */}
                          <motion.button
                            onClick={pauseAssessment}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="absolute right-6 top-6 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 items-center gap-2 shadow-sm hidden sm:flex"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h4v16H6V4zM14 4h4v16h-4V4z" />
                            </svg>
                            <span>Pause & Save</span>
                          </motion.button>
                          
                          <div className="text-center">
                            <h2 className="text-2xl md:text-3xl font-light font-serif text-kawai-black">
                              Join Event
                            </h2>
                            <p className="text-kawai-black/70 mt-2">
                              Lets get to know who you are and join the Baby Grand Select event!
                            </p>
                            {/* Desktop: Show auto-save text, Mobile: Show Pause & Save button */}
                            <div className="mt-3">
                              {/* Desktop auto-save indicator */}
                              <div className="hidden sm:flex items-center justify-center gap-2 text-xs text-kawai-black/50">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Your progress is automatically saved</span>
                              </div>

                              {/* Mobile Pause & Save button */}
                              <div className="sm:hidden flex justify-center">
                                <motion.button
                                  onClick={pauseAssessment}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 flex items-center gap-2 shadow-sm"
                                >
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h4v16H6V4zM14 4h4v16h-4V4z" />
                                  </svg>
                                  <span>Pause & Save</span>
                                </motion.button>
                              </div>
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

                    {/* Contact Details Phase */}
                    {dialogPhase === 'contact-details' && (
                      <motion.div
                        key="dialog-contact-details"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 flex flex-col min-h-0 bg-stone-50"
                      >
                        <div className="flex-1 flex items-center justify-center p-8">
                          <div className="w-full max-w-lg">
                            <ContactDetailsForm
                              onComplete={handleContactDetailsComplete}
                              location={slug}
                              emailData={emailData}
                              onBack={() => {
                                // Option to go back to thank-you phase if needed
                                setDialogPhase('thank-you')
                              }}
                              className="!mt-0"
                            />
                          </div>
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

                    {/* Booking Invite Intro Phase - Sequential Text Display */}
                    {dialogPhase === 'booking-invite-intro' && (
                      <BookingInviteSequence />
                    )}

                    {/* Booking Invite Form Phase */}
                    {dialogPhase === 'booking-invite-form' && (
                      <motion.div
                        key="dialog-booking-invite-form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 flex flex-col min-h-0 bg-stone-50"
                      >
                        {/* Header Section */}
                        <div className="flex-shrink-0 p-6 pb-4 border-b border-gray-200 relative">
                          {/* X Button - Top Right */}
                          <motion.button
                            onClick={closeAssessmentModal}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="absolute right-6 top-6 text-kawai-black/60 hover:text-kawai-black transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-kawai-red/30 rounded-full p-2 hover:bg-gray-100"
                            aria-label="Close booking form"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </motion.button>

                          <div className="text-center">
                            <h2 className="text-2xl md:text-3xl font-light font-serif text-kawai-black">
                              Join Event
                            </h2>
                            <p className="text-kawai-black/70 mt-2">
                              Schedule your exclusive piano viewing and consultation
                            </p>
                          </div>
                        </div>

                        {/* Calendly Widget Section */}
                        <div className="flex-1 min-h-0 p-6">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="h-full bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
                          >
                            <CalendlyBookingWidget
                              isOpen={true}
                              onClose={() => {
                                // User is exiting booking without completing - add to uncommitted list
                                handleBookingExit()
                                closeAssessmentModal()
                              }}
                              signaturePageSlug={slug}
                              calendlyUrl="https://calendly.com/kawaipianogallery/houston-baby-grand-sale"
                              displayMode="inline"
                              className="h-full"
                              prefillData={{
                                ...(emailData?.email && { email: emailData.email }),
                                ...(emailData?.firstName && { firstName: emailData.firstName }),
                                ...(emailData?.lastName && { lastName: emailData.lastName }),
                                ...(emailData?.phone && { phone: emailData.phone })
                              }}
                              onEventScheduled={(eventData) => {
                                const calendlyCompleteTimestamp = new Date().toISOString()
                                console.log(`🎉 Calendly booking completed from booking-invite-form dialog: ${calendlyCompleteTimestamp}`, eventData)
                                handleBookingComplete({
                                  conversionType: 'calendly',
                                  assessmentResults,
                                  location: slug,
                                  calendlyEventData: eventData
                                })
                              }}
                              onDateTimeSelected={(eventData) => {
                                console.log('📅 User selected consultation date/time:', eventData)
                              }}
                              onProfilePageViewed={(eventData) => {
                                console.log('👁️ User viewed consultation booking page:', eventData)
                              }}
                            />
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
        onStart={startAssessment}
        onResume={resumeAssessment}
        onMinimize={pauseAssessment}
        onResumeFromEmail={resumeFromEmailStep}
        hasEmailProgress={hasEmailProgress}
        isVisible={(currentStage !== 'welcome' || hasEmailProgress) && currentStage !== 'conversion' && currentStage !== 'complete' && !(showAssessmentDialog && hideControlHubWhenDialogOpen)}
        showSavedFeedback={showSavedFeedback}
      />
    </section>
  )
}