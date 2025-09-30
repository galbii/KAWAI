'use client'

import React, { createContext, useContext, useState } from 'react'
import { SignatureExperienceProvider, useSignatureExperience } from './SignatureExperienceContext'
import { CalendlyBookingWidget } from './CalendlyBookingWidget'
import { QuickContactModal, type QuickContactData } from './QuickContactModal'

/**
 * CalendlyModalContext - Overrides assessment modal with Calendly booking
 *
 * This context wrapper intercepts openAssessmentModal() calls and shows
 * a Calendly booking modal instead of the assessment flow. Used exclusively
 * on signature2 page to provide direct booking without the assessment.
 */

interface CalendlyModalContextType {
  isCalendlyModalOpen: boolean
  openCalendlyModal: () => void
  closeCalendlyModal: () => void
}

const CalendlyModalContext = createContext<CalendlyModalContextType | undefined>(undefined)

interface CalendlyModalProviderProps {
  children: React.ReactNode
  slug: string
  calendlyUrl?: string
}

function CalendlyModalProviderInner({
  children,
  slug,
  calendlyUrl = 'https://calendly.com/kawaipianogallery/houston-baby-grand-sale'
}: {
  children: React.ReactNode
  slug: string
  calendlyUrl?: string
}) {
  const [showQuickContact, setShowQuickContact] = useState(false)
  const [isCalendlyModalOpen, setIsCalendlyModalOpen] = useState(false)
  const [contactData, setContactData] = useState<QuickContactData | null>(null)

  // Get the original context
  const originalContext = useSignatureExperience()

  // NOTE: Constant Contact integration is handled internally by CalendlyBookingWidget
  // No need for separate integration here to avoid duplicate submissions

  const openCalendlyModal = () => {
    console.log('🎯 CalendlyModalContext: Opening contact form (step 1/2)')
    console.log('📊 Tracking enabled for signature page:', slug)
    setShowQuickContact(true)
  }

  const closeQuickContact = () => {
    console.log('🎯 CalendlyModalContext: Closing contact form')
    setShowQuickContact(false)
  }

  const handleQuickContactSubmit = (data: QuickContactData) => {
    console.log('✅ Contact form submitted:', {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || '[NOT PROVIDED]'
    })

    // Store contact data for later use
    setContactData(data)

    // Close contact form and open Calendly
    setShowQuickContact(false)
    setIsCalendlyModalOpen(true)

    console.log('🎯 CalendlyModalContext: Opening Calendly with pre-filled data (step 2/2)')
  }

  const closeCalendlyModal = () => {
    console.log('🎯 CalendlyModalContext: Closing Calendly modal')
    setIsCalendlyModalOpen(false)
    // Clear contact data after closing
    setContactData(null)
  }

  // Handle Calendly booking completion
  // NOTE: All tracking (Meta Pixel, PostHog, Constant Contact) is handled
  // internally by CalendlyBookingWidget. This callback is just for logging and UI updates.
  const handleCalendlyBooking = async (eventData: any) => {
    console.log('✅ Calendly booking completed:', eventData)
    console.log('📊 Tracking handled by CalendlyBookingWidget: Meta Pixel SubmitApplication + PostHog signature_houston_booking + Constant Contact')
    console.log('📧 Contact data passed via prefillData:', {
      email: contactData?.email ? '[PRESENT]' : '[MISSING]',
      firstName: contactData?.firstName ? '[PRESENT]' : '[MISSING]',
      lastName: contactData?.lastName ? '[PRESENT]' : '[MISSING]',
      phone: contactData?.phone ? '[PRESENT]' : '[MISSING]'
    })

    // Close modal after successful booking
    setTimeout(() => closeCalendlyModal(), 2000)
  }

  // Override the openAssessmentModal function
  const overriddenContext = {
    ...originalContext,
    openAssessmentModal: openCalendlyModal
  }

  return (
    <CalendlyModalContext.Provider value={{
      isCalendlyModalOpen,
      openCalendlyModal,
      closeCalendlyModal
    }}>
      {/* Re-provide the SignatureExperienceContext with overridden openAssessmentModal */}
      <SignatureExperienceContext.Provider value={overriddenContext}>
        {children}

        {/* Step 1: Quick Contact Form */}
        <QuickContactModal
          isOpen={showQuickContact}
          onClose={closeQuickContact}
          onSubmit={handleQuickContactSubmit}
          loading={false}
        />

        {/* Step 2: Calendly Modal (with pre-filled data) */}
        <CalendlyBookingWidget
          isOpen={isCalendlyModalOpen}
          onClose={closeCalendlyModal}
          signaturePageSlug={slug}
          calendlyUrl={calendlyUrl}
          displayMode="modal"
          {...(contactData && {
            prefillData: {
              email: contactData.email,
              firstName: contactData.firstName,
              lastName: contactData.lastName,
              name: `${contactData.firstName} ${contactData.lastName}`,
              ...(contactData.phone && { phone: contactData.phone })
            }
          })}
          onEventScheduled={handleCalendlyBooking}
        />
      </SignatureExperienceContext.Provider>
    </CalendlyModalContext.Provider>
  )
}

// Need to import the context to re-provide it
import { SignatureExperienceContext } from './SignatureExperienceContext'

/**
 * CalendlyModalProvider - Wraps SignatureExperienceProvider and overrides behavior
 *
 * Usage (signature2 page only):
 * <CalendlyModalProvider slug={slug}>
 *   <YourPageContent />
 * </CalendlyModalProvider>
 */
export function CalendlyModalProvider({ children, slug, calendlyUrl }: CalendlyModalProviderProps) {
  return (
    <SignatureExperienceProvider slug={slug}>
      <CalendlyModalProviderInner slug={slug} {...(calendlyUrl && { calendlyUrl })}>
        {children}
      </CalendlyModalProviderInner>
    </SignatureExperienceProvider>
  )
}

export function useCalendlyModal() {
  const context = useContext(CalendlyModalContext)
  if (context === undefined) {
    throw new Error('useCalendlyModal must be used within a CalendlyModalProvider')
  }
  return context
}