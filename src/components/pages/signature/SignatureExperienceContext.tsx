'use client'

import React, { createContext, useContext, useState, useRef, useEffect } from 'react'
import type { AssessmentResponse } from './types'
import type { AssessmentState } from './AssessmentControlHub'

// Types for the context
export type ExperienceStage = 'welcome' | 'email' | 'assessment' | 'conversion' | 'complete'

export type DialogPhase = 'welcome-intro' | 'email-form' | 'loading-assessment' | 'assessment' | 'thank-you' | 'contact-details' | 'analyzing' | 'booking-invite-intro' | 'booking-invite-form'

export interface EmailData {
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

interface SignatureExperienceContextType {
  // State
  currentStage: ExperienceStage
  assessmentResults: AssessmentResponse | null
  emailData: EmailData | null
  showAssessmentDialog: boolean
  dialogPhase: DialogPhase
  assessmentState: AssessmentState
  currentAssessmentStep: number
  hasAssessmentProgress: boolean
  assessmentProgressData: any
  showSavedFeedback: boolean
  hasEmailProgress: boolean

  // Actions
  openAssessmentModal: () => void
  closeAssessmentModal: () => void
  startAssessment: () => void
  pauseAssessment: () => void
  resumeAssessment: () => void
  handleEmailExit: () => void
  resumeFromEmailStep: () => void
  handleEmailComplete: (type: 'email', data: any) => void
  handleContactDetailsComplete: (type: 'contact-details', data: any) => void
  handleAssessmentComplete: (results: AssessmentResponse) => void
  handleConversionComplete: (type: 'email' | 'booking', data: any) => void
  handleBookingComplete: (data: any) => void

  // Setters for internal component communication
  setCurrentStage: (stage: ExperienceStage) => void
  setDialogPhase: (phase: DialogPhase) => void
  setCurrentAssessmentStep: (step: number) => void
}

const SignatureExperienceContext = createContext<SignatureExperienceContextType | undefined>(undefined)

interface SignatureExperienceProviderProps {
  children: React.ReactNode
  slug: string
}

export function SignatureExperienceProvider({ children, slug }: SignatureExperienceProviderProps) {
  // All the state that was previously in SignatureExperience component
  const [currentStage, setCurrentStage] = useState<ExperienceStage>('welcome')
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResponse | null>(null)
  const [emailData, setEmailData] = useState<EmailData | null>(null)
  const [showAssessmentDialog, setShowAssessmentDialog] = useState(false)
  const [dialogPhase, setDialogPhase] = useState<DialogPhase>('welcome-intro')
  const [assessmentState, setAssessmentState] = useState<AssessmentState>('not-started')
  const [currentAssessmentStep, setCurrentAssessmentStep] = useState(0)
  const [hasAssessmentProgress, setHasAssessmentProgress] = useState(false)
  const [assessmentProgressData, setAssessmentProgressData] = useState<any>(null)
  const [showSavedFeedback, setShowSavedFeedback] = useState(false)
  const [hasEmailProgress, setHasEmailProgress] = useState(false)

  // Auto-scroll ref for conversion section
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
        setDialogPhase('email-form')
      }, 2500)
      return () => clearTimeout(timer)
    } else if (dialogPhase === 'email-form') {
      // Email form: no auto-progression - wait for user to complete email
      return
    } else if (dialogPhase === 'loading-assessment') {
      // Loading: fade in (0.5s) + hold (2s) + fade out (0.5s) = 3s total
      const timer = setTimeout(() => {
        setDialogPhase('assessment')
      }, 3000)
      return () => clearTimeout(timer)
    } else if (dialogPhase === 'thank-you') {
      // Thank you: fade in (0.5s) + hold (1s) = 1.5s total
      const timer = setTimeout(() => {
        setDialogPhase('contact-details')
      }, 1500)
      return () => clearTimeout(timer)
    } else if (dialogPhase === 'contact-details') {
      // Contact details: no auto-progression - wait for user to complete form
      return
    } else if (dialogPhase === 'analyzing') {
      // Analyzing: fade in (0.5s) + loading (2s) + checkmark (0.5s) = 3s total
      const timer = setTimeout(() => {
        // After analyzing, go to booking invite intro instead of conversion
        setDialogPhase('booking-invite-intro')
      }, 3000)
      return () => clearTimeout(timer)
    } else if (dialogPhase === 'booking-invite-intro') {
      // Booking invite intro: fade in (0.8s) + hold (1s) + fade out (0.7s) = 2.5s total
      const timer = setTimeout(() => {
        setDialogPhase('booking-invite-form')
      }, 2500)
      return () => clearTimeout(timer)
    } else if (dialogPhase === 'booking-invite-form') {
      // Booking invite form: no auto-progression - wait for user to complete booking or close
      return
    }
    return undefined
  }, [dialogPhase, showAssessmentDialog, assessmentProgressData])

  // Check for saved assessment progress and update assessment state
  useEffect(() => {
    const checkSavedProgress = () => {
      try {
        // Check assessment progress
        const savedAssessmentData = localStorage.getItem('assessment_assessment_signature')
        if (savedAssessmentData) {
          const parsed = JSON.parse(savedAssessmentData)
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

        // Check email progress
        const savedEmailData = localStorage.getItem('signature_experience_email_started')
        if (savedEmailData) {
          const emailParsed = JSON.parse(savedEmailData)
          // Verify it's for the current slug and not too old (24 hours)
          const dayAgo = Date.now() - (24 * 60 * 60 * 1000)
          if (emailParsed.slug === slug && emailParsed.timestamp > dayAgo) {
            setHasEmailProgress(true)
          } else {
            // Clean up old/invalid email progress
            localStorage.removeItem('signature_experience_email_started')
            setHasEmailProgress(false)
          }
        } else {
          setHasEmailProgress(false)
        }
      } catch (error) {
        console.warn('Failed to check saved progress:', error)
        setAssessmentState('not-started')
        setHasEmailProgress(false)
      }
    }

    checkSavedProgress()
  }, [currentStage, showAssessmentDialog, emailData, assessmentResults, slug])

  // Auto-scroll to conversion section when assessment completes
  useEffect(() => {
    if (currentStage === 'conversion') {
      // Longer delay to ensure dialog closes and conversion section renders completely
      const timer = setTimeout(() => {
        // Find the conversion section by ID
        const conversionSection = document.getElementById('signature-experience')
        if (conversionSection) {
          // Use requestAnimationFrame for smoother timing
          requestAnimationFrame(() => {
            conversionSection.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            })
          })
        }
      }, 1200)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [currentStage])

  // Auto-scroll to completion section when booking completes
  useEffect(() => {
    if (currentStage === 'complete') {
      // Delay to ensure completion section renders completely after dialog closes
      const timer = setTimeout(() => {
        // Find the signature experience section and scroll to it
        const signatureSection = document.getElementById('signature-experience')
        if (signatureSection) {
          // Use requestAnimationFrame for smoother timing
          requestAnimationFrame(() => {
            signatureSection.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            })
          })
        }
      }, 800) // Shorter delay since dialog should already be closed
      return () => clearTimeout(timer)
    }
    return undefined
  }, [currentStage])

  // Action handlers
  const openAssessmentModal = () => {
    console.log('Opening assessment modal from context')
    setShowAssessmentDialog(true)
    setDialogPhase('welcome-intro')

    // If user has existing progress, handle appropriately
    if (assessmentProgressData && hasAssessmentProgress) {
      // If they have progress but are in welcome stage, start from email
      if (currentStage === 'welcome') {
        setCurrentStage('assessment')
        setAssessmentState('active')
      }
    }
  }

  const closeAssessmentModal = () => {
    setShowAssessmentDialog(false)
    setAssessmentState(hasAssessmentProgress ? 'paused' : 'not-started')
  }

  const startAssessment = () => {
    console.log('Starting assessment from context')

    // Open dialog if starting from welcome stage
    if (currentStage === 'welcome') {
      setShowAssessmentDialog(true)
      setDialogPhase('welcome-intro')
    } else if (emailData) {
      // If user has assessment progress, call handleResumeAssessment
      if (assessmentProgressData) {
        resumeAssessment()
        return
      }

      // Otherwise, start fresh assessment
      setCurrentStage('assessment')
      setShowAssessmentDialog(true)
      setAssessmentState('active')
      setDialogPhase('welcome-intro')
    }
  }

  const pauseAssessment = () => {
    console.log('Pausing assessment from context')
    setShowAssessmentDialog(false)
    setAssessmentState('paused')

    // Show save confirmation
    setShowSavedFeedback(true)

    // Track analytics
    const currentStep = assessmentProgressData?.currentStep || 0
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'assessment_paused', {
        event_category: 'signature_experience',
        event_label: 'context',
        value: currentStep
      })
    }
  }

  const resumeAssessment = () => {
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
        event_label: 'context',
        value: currentStep
      })
    }
  }

  const handleEmailExit = () => {
    console.log('User exiting from email step')

    // Save email step progress to localStorage
    try {
      const emailProgressData = {
        slug,
        timestamp: Date.now(),
        step: 'email'
      }
      localStorage.setItem('signature_experience_email_started', JSON.stringify(emailProgressData))
      setHasEmailProgress(true)
    } catch (error) {
      console.warn('Failed to save email progress:', error)
    }

    // Close dialog and return to welcome stage
    setShowAssessmentDialog(false)
    setCurrentStage('welcome')

    // Track analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'email_step_exited', {
        event_category: 'signature_experience',
        event_label: 'context',
        value: 1
      })
    }
  }

  const resumeFromEmailStep = () => {
    console.log('Resuming from email step')

    // Open assessment dialog directly to email form
    setShowAssessmentDialog(true)
    setDialogPhase('email-form') // Skip welcome-intro, go directly to email form

    // Track analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'email_step_resumed', {
        event_category: 'signature_experience',
        event_label: 'context',
        value: 1
      })
    }
  }

  const handleEmailComplete = (type: 'email', data: any) => {
    console.log('✅ Email form completed in context:', data)
    console.log('📧 Email extracted:', data?.email)
    setEmailData(data)
    setCurrentStage('assessment')
    // Progress to loading assessment phase since dialog is already open
    setAssessmentState('active')
    setDialogPhase('loading-assessment')

    // Clear email progress since user has completed this step
    try {
      localStorage.removeItem('signature_experience_email_started')
      setHasEmailProgress(false)
    } catch (error) {
      console.warn('Failed to clear email progress:', error)
    }
  }

  const handleContactDetailsComplete = (type: 'contact-details', data: any) => {
    console.log('✅ Contact details form completed in context:', data)
    // Update emailData with the complete contact information
    setEmailData(data)
    // Progress to analyzing phase
    setDialogPhase('analyzing')
  }

  const handleAssessmentComplete = async (results: AssessmentResponse) => {
    console.log('Assessment completed in context:', results)
    setAssessmentResults(results)
    setAssessmentState('completed')
    // Normal flow: go to thank-you phase first
    setDialogPhase('thank-you')
  }

  const handleConversionComplete = (type: 'email' | 'booking', data: any) => {
    console.log(`Conversion completed in context: ${type}`, data)
    setCurrentStage('complete')

    // Track Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion_completed', {
        event_category: 'signature_experience',
        event_label: type,
        value: type === 'booking' ? 1000 : 500
      })
    }

    // Additional tracking logic would go here
  }

  const handleBookingComplete = (data: any) => {
    console.log('Booking completed directly from booking-invite dialog:', data)

    // Close dialog and go to complete stage
    setShowAssessmentDialog(false)
    handleConversionComplete('booking', data)
  }

  const contextValue: SignatureExperienceContextType = {
    // State
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

    // Actions
    openAssessmentModal,
    closeAssessmentModal,
    startAssessment,
    pauseAssessment,
    resumeAssessment,
    handleEmailExit,
    resumeFromEmailStep,
    handleEmailComplete,
    handleContactDetailsComplete,
    handleAssessmentComplete,
    handleConversionComplete,
    handleBookingComplete,

    // Setters for internal component communication
    setCurrentStage,
    setDialogPhase,
    setCurrentAssessmentStep
  }

  return (
    <SignatureExperienceContext.Provider value={contextValue}>
      {children}
    </SignatureExperienceContext.Provider>
  )
}

export function useSignatureExperience() {
  const context = useContext(SignatureExperienceContext)
  if (context === undefined) {
    throw new Error('useSignatureExperience must be used within a SignatureExperienceProvider')
  }
  return context
}