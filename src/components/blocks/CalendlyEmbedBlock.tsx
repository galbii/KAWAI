'use client'

import React, { useEffect, useRef, useState } from 'react'
import { InlineWidget } from 'react-calendly'
import type { LayoutCalendlyEmbedBlock } from '@/payload-types'
import { cn } from '@/lib/utils'
import useCalendlyTracking from '@/hooks/useCalendlyTracking'
import { BookingPreForm, type BookingPreFormData } from '@/components/ui/BookingPreForm'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface CalendlyEmbedBlockProps extends LayoutCalendlyEmbedBlock {}

/**
 * Calendly Embed Block - Piano Key Inspired Luxury
 *
 * Premium booking experience with refined piano showroom aesthetic.
 * Optionally renders a floating button (bottom-right) that opens the
 * Calendly widget in a modal. One useCalendlyTracking call total —
 * globalTrackedEvents deduplicates across both widget instances,
 * preventing the double Meta Pixel fire that occurred when
 * BookingModalBlock nested CalendlyBookingWidget (two listeners).
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
  floatingButton,
}: CalendlyEmbedBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Inline embed state
  const [showPreForm, setShowPreForm] = useState(true)
  const [prefillData, setPrefillData] = useState<BookingPreFormData | undefined>(undefined)

  // Floating button state
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isFloatingVisible, setIsFloatingVisible] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showModalPreForm, setShowModalPreForm] = useState(true)
  const [modalPrefillData, setModalPrefillData] = useState<BookingPreFormData | undefined>(
    undefined
  )

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

  // Client-side mounting + mobile detection (hydration guard)
  useEffect(() => {
    setIsMounted(true)

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Floating button scroll/timer visibility
  useEffect(() => {
    if (!floatingButton?.enabled || !isMounted) return

    const showTimer = setTimeout(() => {
      setIsFloatingVisible(true)
    }, 2000)

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsFloatingVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial scroll position

    return () => {
      clearTimeout(showTimer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [floatingButton?.enabled, isMounted])

  // Handle inline pre-form submission
  const handlePreFormSubmit = (data: BookingPreFormData) => {
    console.log('📝 Pre-form data collected for embed:', data)
    setPrefillData(data)
    setShowPreForm(false)
  }

  // Handle modal pre-form submission
  const handleModalPreFormSubmit = (data: BookingPreFormData) => {
    console.log('📝 Pre-form data collected for modal:', data)
    setModalPrefillData(data)
    setShowModalPreForm(false)
  }

  // Reset modal state on close
  const handleModalClose = () => {
    setIsModalOpen(false)
    setShowModalPreForm(true)
    setModalPrefillData(undefined)
  }

  // Single tracking hook — globalTrackedEvents deduplicates across both InlineWidget instances,
  // eliminating the double-fire that happened when BookingModalBlock nested CalendlyBookingWidget.
  const trackingEnabled = tracking?.enabled ?? true

  const trackingConfig = React.useMemo(
    () => ({
      eventName: tracking?.eventName || 'Calendly Embed Booking',
      posthogEventName: 'calendly_embed_booking',
      widgetId: 'calendly-embed',
      enabled: trackingEnabled, // Always enabled — dedup is handled by globalTrackedEvents
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
    }),
    [
      tracking?.eventName,
      tracking?.category,
      tracking?.conversionValue,
      trackingEnabled,
      calendlyUrl,
      constantContact?.enabled,
      constantContact?.targetList,
      constantContact?.createListIfMissing,
      constantContact?.listDescription,
    ]
  )

  // Pass whichever prefill data is currently active to the tracking hook
  const activePrefillData =
    isModalOpen && !showModalPreForm
      ? modalPrefillData
      : !showPreForm
        ? prefillData
        : undefined

  useCalendlyTracking(trackingConfig, activePrefillData)

  // Text alignment class mapping
  const textAlignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  // Transform BookingPreFormData for Calendly prefill format
  // Phone goes into customAnswers.a2 (2nd custom question = "Phone Number")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buildCalendlyPrefill = (data: BookingPreFormData | undefined): any => {
    if (!data) return undefined

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prefill: any = {}

    if (data.email) prefill.email = data.email
    if (data.firstName) prefill.firstName = data.firstName
    if (data.lastName) prefill.lastName = data.lastName

    if (data.firstName && data.lastName) {
      prefill.name = `${data.firstName} ${data.lastName}`
    }

    // CRITICAL: Phone must be in customAnswers, not as direct field
    // a1 = "What type of piano are you most interested in?" (dropdown)
    // a2 = "Phone Number" (phone input)
    if (data.phone) {
      let formattedPhone = data.phone.replace(/\D/g, '')
      if (!formattedPhone.startsWith('1') && formattedPhone.length === 10) {
        formattedPhone = '1' + formattedPhone
      }
      prefill.customAnswers = { a2: formattedPhone }
    }

    console.log('📋 [CalendlyEmbedBlock] Transformed prefill data:', prefill)
    return Object.keys(prefill).length > 0 ? prefill : undefined
  }

  // Floating button config
  const floatingEnabled = floatingButton?.enabled ?? false
  const actualButtonText = floatingButton?.buttonText || 'Book Now'
  const actualButtonStyle = floatingButton?.buttonStyle || 'primary'
  const actualButtonSize = floatingButton?.buttonSize || 'default'
  const actualModalTitle = floatingButton?.modalTitle || 'Book your appointment'

  // Bottom offset: clear the mobile search bar (≈66px) + 16px gap = 82px
  const bottomPosition = isMobile ? '82px' : '2rem'

  // Piano Key Button — same tactile style as BookingModalBlock
  const PianoKeyButton = () => {
    const baseStyles = cn(
      'group relative overflow-hidden',
      'px-8 py-4',
      'font-medium tracking-[0.15em] uppercase text-sm',
      'focus:outline-none focus:ring-2 focus:ring-[#C41E3A] focus:ring-offset-2',
      actualButtonSize === 'sm' && 'px-6 py-3 text-xs',
      actualButtonSize === 'lg' && 'px-10 py-5 text-base'
    )

    const buttonStyles =
      actualButtonStyle === 'primary'
        ? {
            style: {
              background: 'linear-gradient(180deg, #C41E3A 0%, #A01730 100%)',
              borderRadius: '4px',
              boxShadow: `
              0 1px 0 0 rgba(255, 255, 255, 0.2) inset,
              0 4px 8px rgba(196, 30, 58, 0.3),
              0 8px 16px rgba(160, 23, 48, 0.2),
              0 0 0 1px rgba(196, 30, 58, 0.5)
            `,
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              color: 'white',
            },
            hoverStyle: {
              transform: 'translateY(-2px)',
              boxShadow: `
              0 1px 0 0 rgba(255, 255, 255, 0.3) inset,
              0 6px 12px rgba(196, 30, 58, 0.4),
              0 12px 24px rgba(160, 23, 48, 0.3),
              0 0 0 1px rgba(196, 30, 58, 0.6)
            `,
            },
            activeStyle: {
              transform: 'translateY(1px)',
              boxShadow: `0 1px 0 0 rgba(0, 0, 0, 0.2) inset, 0 2px 4px rgba(196, 30, 58, 0.3)`,
            },
          }
        : actualButtonStyle === 'secondary'
          ? {
              style: {
                background: 'linear-gradient(180deg, #D4AF37 0%, #C49F27 100%)',
                borderRadius: '4px',
                boxShadow: `
              0 1px 0 0 rgba(255, 255, 255, 0.3) inset,
              0 4px 8px rgba(212, 175, 55, 0.3),
              0 8px 16px rgba(196, 159, 39, 0.2),
              0 0 0 1px rgba(212, 175, 55, 0.5)
            `,
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                color: '#2C2C2C',
              },
              hoverStyle: { transform: 'translateY(-2px)' },
              activeStyle: { transform: 'translateY(1px)' },
            }
          : actualButtonStyle === 'outline'
            ? {
                style: {
                  background: 'transparent',
                  border: '2px solid #2C2C2C',
                  borderRadius: '4px',
                  color: '#2C2C2C',
                  transition: 'all 0.3s ease',
                },
                hoverStyle: { background: '#2C2C2C', color: 'white' },
                activeStyle: {},
              }
            : {
                // Ghost
                style: {
                  background: 'transparent',
                  color: '#2C2C2C',
                  transition: 'all 0.3s ease',
                },
                hoverStyle: { background: 'rgba(44, 44, 44, 0.05)' },
                activeStyle: {},
              }

    return (
      <button
        onClick={() => setIsModalOpen(true)}
        className={baseStyles}
        style={buttonStyles.style}
        onMouseEnter={(e) => {
          if ('transform' in buttonStyles.hoverStyle) {
            Object.assign(e.currentTarget.style, buttonStyles.hoverStyle)
          }
        }}
        onMouseLeave={(e) => {
          Object.assign(e.currentTarget.style, buttonStyles.style)
        }}
        onMouseDown={(e) => {
          if ('transform' in buttonStyles.activeStyle) {
            Object.assign(e.currentTarget.style, buttonStyles.activeStyle)
          }
        }}
        onMouseUp={(e) => {
          if ('transform' in buttonStyles.hoverStyle) {
            Object.assign(e.currentTarget.style, buttonStyles.hoverStyle)
          }
        }}
      >
        {/* Shimmer — light on polished ebony */}
        <div
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%)',
            transition: 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />
        <span
          className="relative flex items-center justify-center gap-2.5"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          {actualButtonText}
        </span>
      </button>
    )
  }

  return (
    <>
      {/* Inline embed section */}
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
              className={cn(
                'mb-8 space-y-3',
                textAlignClasses[actualTextAlignment as keyof typeof textAlignClasses]
              )}
            >
              {heading && (
                <h2 className="text-3xl md:text-4xl font-semibold text-[#2C2C2C] tracking-tight">
                  {heading}
                </h2>
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
              <BookingPreForm onSubmit={handlePreFormSubmit} />
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
                {...(buildCalendlyPrefill(prefillData) && {
                  prefill: buildCalendlyPrefill(prefillData),
                })}
              />
            </div>
          )}
        </div>
      </div>

      {/* Floating button + modal (conditional on floatingButton.enabled) */}
      {floatingEnabled && isMounted && (
        <>
          {/* Floating Button — Piano Key with Damper Lift Animation */}
          <div
            className="fixed right-8"
            style={{
              bottom: bottomPosition,
              zIndex: 99999,
              transition:
                'opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), bottom 0.3s ease',
              opacity: isFloatingVisible && !isModalOpen ? 1 : 0,
              transform:
                isFloatingVisible && !isModalOpen
                  ? 'translateY(0) scale(1)'
                  : 'translateY(20px) scale(0.95)',
              pointerEvents: isFloatingVisible && !isModalOpen ? 'auto' : 'none',
            }}
          >
            {/* Grain texture (piano wood cabinet feel) */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.04] rounded-lg"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Gold glow (piano pedal hardware) */}
            <div
              className="absolute -inset-3 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(212, 175, 55, 0.25) 0%, transparent 70%)',
                filter: 'blur(16px)',
                animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            />

            <div
              className="relative"
              style={{
                filter:
                  'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.2)) drop-shadow(0 20px 40px rgba(196, 30, 58, 0.15))',
              }}
            >
              <PianoKeyButton />
            </div>

            {/* Subtle gold accent ring */}
            <div
              className="absolute -inset-[1px] rounded-lg pointer-events-none"
              style={{
                border: '1px solid rgba(212, 175, 55, 0.2)',
                boxShadow: '0 0 12px rgba(212, 175, 55, 0.15)',
              }}
            />
          </div>

          {/* Modal: PreForm → InlineWidget (direct, no CalendlyBookingWidget wrapper) */}
          <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              {showModalPreForm ? (
                <BookingPreForm
                  onSubmit={handleModalPreFormSubmit}
                  onCancel={handleModalClose}
                  modalTitle={actualModalTitle}
                />
              ) : (
                <InlineWidget
                  url={calendlyUrl}
                  styles={{
                    height: '700px',
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
                  {...(buildCalendlyPrefill(modalPrefillData) && {
                    prefill: buildCalendlyPrefill(modalPrefillData),
                  })}
                />
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  )
}
