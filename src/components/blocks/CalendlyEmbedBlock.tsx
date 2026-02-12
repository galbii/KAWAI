'use client'

import React, { useEffect, useRef, useState } from 'react'
import { InlineWidget } from 'react-calendly'
import type { LayoutCalendlyEmbedBlock } from '@/payload-types'
import { cn } from '@/lib/utils'
import useCalendlyTracking from '@/hooks/useCalendlyTracking'
import { BookingPreForm, type BookingPreFormData } from '@/components/ui/BookingPreForm'

interface CalendlyEmbedBlockProps extends LayoutCalendlyEmbedBlock {}

/**
 * Calendly Embed Block - Piano Key Inspired Luxury
 *
 * Premium booking experience with refined piano showroom aesthetic
 * Inspired by the tactile elegance of a grand piano's keyboard
 */
export function CalendlyEmbedBlock({
  heading,
  subheading,
  calendlyUrl,
  widgetHeight,
  customHeight,
  backgroundColor,
  padding,
  textAlignment,
  tracking,
  constantContact,
}: CalendlyEmbedBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [showPreForm, setShowPreForm] = useState(true)
  const [prefillData, setPrefillData] = useState<BookingPreFormData | undefined>(undefined)

  // Apply defaults
  const actualWidgetHeight = widgetHeight || '700'
  const actualTextAlignment = textAlignment || 'center'

  // Early return if no Calendly URL
  if (!calendlyUrl) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[CalendlyEmbedBlock] No Calendly URL provided')
    }
    return null
  }

  // Calculate actual height
  const actualHeight =
    actualWidgetHeight === 'custom' && customHeight ? `${customHeight}px` : `${actualWidgetHeight}px`

  // Scroll-reveal animation with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [])

  // Handle pre-form submission
  const handlePreFormSubmit = (data: BookingPreFormData) => {
    console.log('📝 Pre-form data collected for embed:', data)
    setPrefillData(data)
    setShowPreForm(false) // Hide pre-form, show Calendly widget
  }

  // Set up tracking with useCalendlyTracking hook (only after pre-form is submitted)
  const trackingEnabled = tracking?.enabled ?? true

  // Memoize tracking config to prevent unnecessary re-renders and duplicate listeners
  const trackingConfig = React.useMemo(() => ({
    eventName: tracking?.eventName || 'Calendly Embed Booking',
    posthogEventName: 'calendly_embed_booking',
    widgetId: 'calendly-embed',  // Unique identifier for this widget instance
    enabled: trackingEnabled && !showPreForm, // Only track when widget is visible
    // Conditionally include calendlyUrl (exactOptionalPropertyTypes: true)
    ...(calendlyUrl && { calendlyUrl }),
    metaPixel: {
      content_name: 'Calendly Booking',
      content_category: tracking?.category || 'lead',
      value: tracking?.conversionValue || 100,
      currency: 'USD',
      status: 'completed',
    },
    constantContact: constantContact?.enabled
      ? {
          enabled: true,
          targetList: constantContact.targetList || 'SHOWROOM KAWAI',
          createListIfMissing: constantContact.createListIfMissing ?? true,
          showAuthPrompts: false,
          ...(constantContact.listDescription && {
            listDescription: constantContact.listDescription,
          }),
        }
      : { enabled: false, targetList: '' },
  }), [
    tracking?.eventName,
    tracking?.category,
    tracking?.conversionValue,
    trackingEnabled,
    showPreForm,
    calendlyUrl,  // Added for widget ownership tracking
    constantContact?.enabled,
    constantContact?.targetList,
    constantContact?.createListIfMissing,
    constantContact?.listDescription,
  ])

  useCalendlyTracking(trackingConfig, prefillData)

  // Text alignment class mapping
  const textAlignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  // Transform prefillData for Calendly (phone must be in customAnswers)
  const buildCalendlyPrefill = () => {
    if (!prefillData) return undefined

    const prefill: any = {}

    if (prefillData.email) prefill.email = prefillData.email
    if (prefillData.firstName) prefill.firstName = prefillData.firstName
    if (prefillData.lastName) prefill.lastName = prefillData.lastName

    // Build full name
    if (prefillData.firstName && prefillData.lastName) {
      prefill.name = `${prefillData.firstName} ${prefillData.lastName}`
    }

    // CRITICAL: Phone must be in customAnswers, not as direct field
    // NOTE: Phone is the 2nd custom question in Calendly (a2), not the 1st (a1)
    // a1 = "What type of piano are you most interested in?" (dropdown)
    // a2 = "Phone Number" (phone input)
    if (prefillData.phone) {
      // Add US country code (+1) if not already present
      let formattedPhone = prefillData.phone.replace(/\D/g, '') // Remove non-digits
      if (!formattedPhone.startsWith('1') && formattedPhone.length === 10) {
        formattedPhone = '1' + formattedPhone // Add country code
      }

      prefill.customAnswers = {
        a2: formattedPhone,  // e.g., "17143268063"
      }
    }

    console.log('📋 [CalendlyEmbedBlock] Transformed prefill data:', prefill)
    return Object.keys(prefill).length > 0 ? prefill : undefined
  }

  return (
    <div
      ref={containerRef}
      className="w-full py-12 md:py-20 bg-white"
      style={{
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      }}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Heading Section */}
        {(heading || subheading) && (
          <div
            className={cn('mb-8 space-y-3', textAlignClasses[actualTextAlignment as keyof typeof textAlignClasses])}
          >
            {heading && (
              <h2 className="text-3xl md:text-4xl font-semibold text-[#2C2C2C] tracking-tight">{heading}</h2>
            )}
            {subheading && (
              <p
                className={cn(
                  'text-base md:text-lg text-[#2C2C2C]/70 leading-relaxed',
                  actualTextAlignment === 'center' && 'mx-auto max-w-2xl'
                )}
              >
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Pre-Form or Calendly Widget */}
        {showPreForm ? (
          <div className="flex justify-center items-start">
            <BookingPreForm
              onSubmit={handlePreFormSubmit}
              modalTitle={heading || 'Schedule Your Consultation'}
            />
          </div>
        ) : (
          <div
            className="relative bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
            style={{
              transition: 'opacity 0.6s ease, transform 0.6s ease',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'scale(1)' : 'scale(0.98)',
            }}
          >
            <InlineWidget
              url={calendlyUrl}
              styles={{
                height: actualHeight,
                minWidth: '320px',
                width: '100%',
              }}
              pageSettings={{
                backgroundColor: 'ffffff',
                hideEventTypeDetails: false,
                hideLandingPageDetails: false,
                primaryColor: 'C41E3A',
                textColor: '2C2C2C',
              }}
              {...(buildCalendlyPrefill() && { prefill: buildCalendlyPrefill() })}
            />
          </div>
        )}
      </div>
    </div>
  )
}
