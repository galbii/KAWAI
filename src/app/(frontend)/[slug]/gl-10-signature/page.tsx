'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  GL10Provider,
  useGL10Context,
  GL10Hero,
  GL10Welcome,
  GL10AssessmentQuestion,
  GL10Showcase,
  GL10Contact,
  GL10Booking,
  GL10SuccessOverlay,
  GL10Navigation,
  GL10Gallery,
  GL10BabyGrand,
  GL10MillenniumAction,
  MUSICAL_IDENTITY_QUESTION,
  TIMELINE_QUESTION,
  type ViewType,
} from './components'

function GL10SignaturePageContent() {
  const { progress, updateProgress } = useGL10Context()
  const [showSuccess, setShowSuccess] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [currentView, setCurrentView] = useState<ViewType>('signature')

  // Handle view changes
  const handleViewChange = (view: ViewType) => {
    setCurrentView(view)
    // Scroll to top when switching views (except signature which doesn't scroll)
    if (view !== 'signature') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Control scrolling based on current view
  useEffect(() => {
    if (currentView === 'signature') {
      // Disable scrolling for signature experience
      document.body.style.overflow = 'hidden'
    } else {
      // Enable scrolling for gallery, baby-grand, millennium-action
      document.body.style.overflow = 'auto'
    }

    return () => {
      // Re-enable scrolling on unmount
      document.body.style.overflow = ''
    }
  }, [currentView])

  // Handle hero CTA click
  const handleBeginJourney = () => {
    setCurrentStep(1) // Move to Welcome step
  }

  // Handle email completion
  const handleEmailComplete = (email: string) => {
    const newCompleted = [...progress.completedSections]
    if (!newCompleted.includes('welcome')) {
      newCompleted.push('welcome')
    }
    updateProgress({ email, completedSections: newCompleted })

    // Move to first assessment after brief delay
    setTimeout(() => {
      setCurrentStep(2)
    }, 500)
  }

  // Handle assessment Q1 completion
  const handleAssessment1Complete = (optionId: string) => {
    const newCompleted = [...progress.completedSections]
    if (!newCompleted.includes('assessment-1')) {
      newCompleted.push('assessment-1')
    }
    updateProgress({
      musicalIdentity: {
        experience: optionId,
        goals: [],
        interests: [],
      },
      completedSections: newCompleted,
    })

    // Move to second assessment
    setTimeout(() => {
      setCurrentStep(3)
    }, 500)
  }

  // Handle assessment Q2 completion
  const handleAssessment2Complete = (optionId: string) => {
    const newCompleted = [...progress.completedSections]
    if (!newCompleted.includes('assessment-2')) {
      newCompleted.push('assessment-2')
    }
    updateProgress({
      timeline: {
        purchaseWindow: optionId,
        visitPreference: '',
      },
      completedSections: newCompleted,
    })

    // Move to showcase
    setTimeout(() => {
      setCurrentStep(4)
    }, 500)
  }

  // Auto-advance from showcase to contact after viewing
  useEffect(() => {
    if (currentStep === 4) {
      // Auto-advance to contact after 3 seconds of viewing showcase
      const timer = setTimeout(() => {
        setCurrentStep(5)
      }, 3000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [currentStep])

  // Handle contact details completion
  const handleContactComplete = (contactData: {
    firstName: string
    lastName: string
    phone: string
  }) => {
    const newCompleted = [...progress.completedSections]
    if (!newCompleted.includes('contact')) {
      newCompleted.push('contact')
    }
    updateProgress({
      contactDetails: {
        name: `${contactData.firstName} ${contactData.lastName}`,
        phone: contactData.phone,
        preferredContact: 'phone',
      },
      completedSections: newCompleted,
    })

    // Move to booking
    setTimeout(() => {
      setCurrentStep(6)
    }, 500)
  }

  // Handle booking completion
  const handleBookingComplete = () => {
    const newCompleted = [...progress.completedSections]
    if (!newCompleted.includes('booking')) {
      newCompleted.push('booking')
    }
    updateProgress({ completedSections: newCompleted })
    setShowSuccess(true)
  }

  // Prepare prefill data for booking
  const prefillData = {
    email: progress.email,
    firstName: progress.contactDetails.name.split(' ')[0] || '',
    lastName: progress.contactDetails.name.split(' ').slice(1).join(' ') || '',
    phone: progress.contactDetails.phone,
  }

  return (
    <div className={cn(
      "min-h-screen bg-white",
      currentView === 'signature' ? 'overflow-hidden' : 'overflow-auto'
    )}>
      {/* Navigation Bar - Appears from step 1 onwards */}
      {currentStep >= 1 && (
        <GL10Navigation
          currentView={currentView}
          onViewChange={handleViewChange}
          currentStep={currentStep}
        />
      )}

      <AnimatePresence mode="wait">
        {/* Signature Experience Flow */}
        {currentView === 'signature' && (
          <>
            {/* Step 0: Hero Section */}
            {currentStep === 0 && (
              <motion.div
                key="hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen"
              >
                <GL10Hero onBeginJourney={handleBeginJourney} />
              </motion.div>
            )}

            {/* Step 1: Welcome + Email Capture */}
            {currentStep === 1 && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen"
              >
                <GL10Welcome
                  onComplete={handleEmailComplete}
                  savedEmail={progress.email}
                />
              </motion.div>
            )}

            {/* Step 2: Assessment Q1: Musical Journey */}
            {currentStep === 2 && (
              <motion.div
                key="assessment-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen"
              >
                <GL10AssessmentQuestion
                  question={MUSICAL_IDENTITY_QUESTION.question}
                  options={MUSICAL_IDENTITY_QUESTION.options}
                  onSelect={handleAssessment1Complete}
                  selectedValue={progress.musicalIdentity.experience}
                  backgroundColor="white"
                />
              </motion.div>
            )}

            {/* Step 3: Assessment Q2: Timeline */}
            {currentStep === 3 && (
              <motion.div
                key="assessment-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen"
              >
                <GL10AssessmentQuestion
                  question={TIMELINE_QUESTION.question}
                  options={TIMELINE_QUESTION.options}
                  onSelect={handleAssessment2Complete}
                  selectedValue={progress.timeline.purchaseWindow}
                  backgroundColor="pearl"
                />
              </motion.div>
            )}

            {/* Step 4: GL-10 Showcase */}
            {currentStep === 4 && (
              <motion.div
                key="showcase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen"
              >
                <GL10Showcase />
              </motion.div>
            )}

            {/* Step 5: Contact Details */}
            {currentStep === 5 && (
              <motion.div
                key="contact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen"
              >
                <GL10Contact
                  onComplete={handleContactComplete}
                  {...(progress.contactDetails.name && {
                    savedData: {
                      firstName: progress.contactDetails.name.split(' ')[0] || '',
                      lastName: progress.contactDetails.name.split(' ').slice(1).join(' ') || '',
                      phone: progress.contactDetails.phone,
                    }
                  })}
                />
              </motion.div>
            )}

            {/* Step 6: Booking Section */}
            {currentStep === 6 && (
              <motion.div
                key="booking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen"
              >
                <GL10Booking
                  prefillData={prefillData}
                  onBookingComplete={handleBookingComplete}
                />
              </motion.div>
            )}
          </>
        )}

        {/* Gallery View */}
        {currentView === 'gallery' && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <GL10Gallery />
          </motion.div>
        )}

        {/* Baby Grand Features View */}
        {currentView === 'baby-grand' && (
          <motion.div
            key="baby-grand"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <GL10BabyGrand />
          </motion.div>
        )}

        {/* Millennium III Action View */}
        {currentView === 'millennium-action' && (
          <motion.div
            key="millennium-action"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <GL10MillenniumAction />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Overlay (appears on top of any view) */}
      <GL10SuccessOverlay isOpen={showSuccess} onClose={() => setShowSuccess(false)} />
    </div>
  )
}

export default function GL10SignaturePage() {
  const params = useParams()
  const slug = params?.slug as string

  return (
    <GL10Provider slug={slug}>
      <GL10SignaturePageContent />
    </GL10Provider>
  )
}
