'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Lenis from 'lenis'
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
  MUSICAL_IDENTITY_QUESTION,
  TIMELINE_QUESTION,
} from './components'
import { ThreeDViewerButton, ThreeDViewerModal, use3DViewer } from '@/components/ui/3d-viewer'

function GL10SignaturePageContent() {
  const { progress, updateProgress, scrollToSection } = useGL10Context()
  const [showSuccess, setShowSuccess] = useState(false)
  const lenisRef = useRef<Lenis | null>(null)
  const searchParams = useSearchParams()

  // Initialize 3D Viewer
  const viewer3D = use3DViewer({
    config: {
      enabled: true,
      viewerUrl: 'https://www.kawai-global.com/modelviewer/index.php',
      modelParams: '?model=ca901',
      autoOpen: true,
      buttonText: 'View the GL-10 in 3D'
    },
    productName: 'GL-10 Grand Piano',
    searchParams
  })

  // Initialize smooth scroll with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  // Handle hero CTA click
  const handleBeginJourney = () => {
    scrollToSection('welcome')
  }

  // Handle email completion
  const handleEmailComplete = (email: string) => {
    const newCompleted = [...progress.completedSections]
    if (!newCompleted.includes('welcome')) {
      newCompleted.push('welcome')
    }
    updateProgress({ email, completedSections: newCompleted })

    // Auto-scroll to first assessment after brief delay
    setTimeout(() => {
      scrollToSection('assessment-1')
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

    // Auto-scroll to second assessment
    setTimeout(() => {
      scrollToSection('assessment-2')
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

    // Auto-scroll to showcase
    setTimeout(() => {
      scrollToSection('showcase')
    }, 500)
  }

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

    // Auto-scroll to booking
    setTimeout(() => {
      scrollToSection('booking')
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <GL10Hero onBeginJourney={handleBeginJourney} />

      {/* Welcome + Email Capture */}
      <div id="welcome">
        <GL10Welcome
          onComplete={handleEmailComplete}
          savedEmail={progress.email}
        />
      </div>

      {/* Assessment Q1: Musical Journey */}
      <div id="assessment-1">
        <GL10AssessmentQuestion
          question={MUSICAL_IDENTITY_QUESTION.question}
          options={MUSICAL_IDENTITY_QUESTION.options}
          onSelect={handleAssessment1Complete}
          selectedValue={progress.musicalIdentity.experience}
          backgroundColor="white"
        />
      </div>

      {/* Assessment Q2: Timeline */}
      <div id="assessment-2">
        <GL10AssessmentQuestion
          question={TIMELINE_QUESTION.question}
          options={TIMELINE_QUESTION.options}
          onSelect={handleAssessment2Complete}
          selectedValue={progress.timeline.purchaseWindow}
          backgroundColor="pearl"
        />
      </div>

      {/* GL-10 Showcase */}
      <div id="showcase">
        <GL10Showcase />
      </div>

      {/* Contact Details */}
      <div id="contact">
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
      </div>

      {/* Booking Section */}
      <div id="booking">
        <GL10Booking
          prefillData={prefillData}
          onBookingComplete={handleBookingComplete}
        />
      </div>

      {/* Success Overlay */}
      <GL10SuccessOverlay isOpen={showSuccess} onClose={() => setShowSuccess(false)} />

      {/* 3D Viewer - Floating Button */}
      <ThreeDViewerButton
        onClick={viewer3D.open}
        text="View the GL-10 in 3D"
        productName="GL-10 Grand Piano"
      />

      {/* 3D Viewer - Modal with iframe */}
      <ThreeDViewerModal
        isOpen={viewer3D.isOpen}
        onClose={viewer3D.close}
        viewerUrl={viewer3D.fullViewerUrl}
        productName="GL-10 Grand Piano"
      />
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
