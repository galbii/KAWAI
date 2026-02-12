'use client'

import React, { useState, useEffect } from 'react'
import type { LayoutBookingModalBlock } from '@/payload-types'
import { cn } from '@/lib/utils'
import { CalendlyBookingWidget } from '@/components/pages/signature/CalendlyBookingWidget'
import { BookingPreForm, type BookingPreFormData } from '@/components/ui/BookingPreForm'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import Image from 'next/image'
import useCalendlyTracking from '@/hooks/useCalendlyTracking'
import { trackCTAClick } from '@/lib/analytics/unified-tracking'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface BookingModalBlockProps extends LayoutBookingModalBlock {}

/**
 * Booking Modal Block - Piano Key Inspired Luxury
 *
 * Premium booking button with tactile piano key aesthetics
 * Floating mode: Smooth damper-lift animations with scroll-based visibility
 * Inline mode: Elegant centered button with refined spacing
 */
export function BookingModalBlock({
  buttonText,
  buttonStyle,
  buttonSize,
  buttonIcon,
  buttonAlignment,
  modalTitle,
  modalSubtitle,
  calendlyUrl,
  displayMode,
  backgroundColor,
  padding,
  ctaTracking,
  bookingTracking,
  constantContact,
}: BookingModalBlockProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFloatingVisible, setIsFloatingVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showPreForm, setShowPreForm] = useState(true)
  const [prefillData, setPrefillData] = useState<BookingPreFormData | undefined>(undefined)
  const [isMobile, setIsMobile] = useState(false)

  // Client-side mounting check + mobile detection
  useEffect(() => {
    setMounted(true)

    // Detect mobile viewport
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => {
      setMounted(false)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Floating button visibility control (scroll-based with delay)
  useEffect(() => {
    if (displayMode !== 'floating' || !mounted) return

    // Show after scroll threshold or 2 seconds (whichever comes first)
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
  }, [displayMode, mounted])

  // Apply defaults
  const actualButtonText = buttonText || 'Book Now'
  const actualButtonStyle = buttonStyle || 'primary'
  const actualButtonSize = buttonSize || 'default'
  const actualButtonAlignment = buttonAlignment || 'center'
  const actualModalTitle = modalTitle || 'Book your appointment'
  const actualModalSubtitle = modalSubtitle ?? undefined // Convert null to undefined for strict types
  const actualDisplayMode = displayMode || 'inline'
  const actualBackgroundColor = backgroundColor || 'transparent'
  const actualPadding = padding || 'medium'

  // Debug logging for floating mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📍 BookingModalBlock render state:', {
        displayMode: actualDisplayMode,
        mounted,
        isFloatingVisible,
        isModalOpen,
      })
    }
  }, [actualDisplayMode, mounted, isFloatingVisible, isModalOpen])

  // Early return if no Calendly URL
  if (!calendlyUrl) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[BookingModalBlock] No Calendly URL provided')
    }
    return null
  }

  // Set up booking tracking (only when modal is open AND we have prefill data)
  const bookingTrackingEnabled = bookingTracking?.enabled ?? true
  useCalendlyTracking(
    {
      eventName: bookingTracking?.eventName || 'Booking Modal Completion',
      posthogEventName: 'booking_modal_completion',
      widgetId: 'booking-modal',  // Unique identifier for this widget instance
      enabled: bookingTrackingEnabled && isModalOpen && !showPreForm,
      // Conditionally include calendlyUrl (exactOptionalPropertyTypes: true)
      ...(calendlyUrl && { calendlyUrl }),
      metaPixel: {
        content_name: 'Booking Modal',
        content_category: bookingTracking?.category || 'lead',
        value: bookingTracking?.conversionValue || 100,
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
      onBookingComplete: () => {
        setTimeout(() => {
          setIsModalOpen(false)
          setShowPreForm(true) // Reset for next time
          setPrefillData(undefined)
        }, 2000)
      },
    },
    prefillData // Pass the collected data to tracking hook
  )

  // Handle pre-form submission
  const handlePreFormSubmit = (data: BookingPreFormData) => {
    console.log('📝 Pre-form data collected:', data)
    setPrefillData(data)
    setShowPreForm(false) // Hide pre-form, show Calendly
  }

  // Reset state when modal closes
  const handleModalClose = () => {
    setIsModalOpen(false)
    setShowPreForm(true)
    setPrefillData(undefined)
  }

  // Handle button click with CTA tracking
  const handleButtonClick = () => {
    const ctaTrackingEnabled = ctaTracking?.enabled ?? true
    if (ctaTrackingEnabled && calendlyUrl) {
      trackCTAClick({
        blockType: 'layout-booking-modal',
        blockData: { ctaTracking },
        ctaText: actualButtonText,
        destination: calendlyUrl,
      })
    }
    setIsModalOpen(true)
  }

  // Get icon image props if icon is provided
  const iconProps = buttonIcon
    ? getImagePropsWithFallback(buttonIcon, '', 'thumbnail')
    : null

  // Background color class mapping
  const bgColorClasses = {
    transparent: 'bg-transparent',
    white: 'bg-white',
    'light-gray': 'bg-[#F8F8F8]',
    'dark-gray': 'bg-[#2C2C2C]',
  }

  // Padding class mapping
  const paddingClasses = {
    none: 'py-0',
    small: 'py-8 md:py-12',
    medium: 'py-12 md:py-20',
    large: 'py-20 md:py-32',
  }

  // Button alignment class mapping
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }

  // Piano Key Inspired Button - Tactile, crisp, refined
  const PianoKeyButton = ({ className = '' }: { className?: string }) => {
    const baseStyles = cn(
      'group relative overflow-hidden',
      'px-8 py-4',
      'font-medium tracking-[0.15em] uppercase text-sm',
      'focus:outline-none focus:ring-2 focus:ring-[#C41E3A] focus:ring-offset-2',
      actualButtonSize === 'sm' && 'px-6 py-3 text-xs',
      actualButtonSize === 'lg' && 'px-10 py-5 text-base',
      className
    )

    const primaryStyles =
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
              boxShadow: `
              0 1px 0 0 rgba(0, 0, 0, 0.2) inset,
              0 2px 4px rgba(196, 30, 58, 0.3)
            `,
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
            hoverStyle: {
              transform: 'translateY(-2px)',
            },
            activeStyle: {
              transform: 'translateY(1px)',
            },
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
            hoverStyle: {
              background: '#2C2C2C',
              color: 'white',
            },
            activeStyle: {},
          }
        : {
            // Ghost style
            style: {
              background: 'transparent',
              color: '#2C2C2C',
              transition: 'all 0.3s ease',
            },
            hoverStyle: {
              background: 'rgba(44, 44, 44, 0.05)',
            },
            activeStyle: {},
          }

    return (
      <button
        onClick={handleButtonClick}
        className={baseStyles}
        style={primaryStyles.style}
        onMouseEnter={(e) => {
          if (primaryStyles.hoverStyle && 'transform' in primaryStyles.hoverStyle) {
            Object.assign(e.currentTarget.style, primaryStyles.hoverStyle)
          }
        }}
        onMouseLeave={(e) => {
          Object.assign(e.currentTarget.style, primaryStyles.style)
        }}
        onMouseDown={(e) => {
          if (primaryStyles.activeStyle && 'transform' in primaryStyles.activeStyle) {
            Object.assign(e.currentTarget.style, primaryStyles.activeStyle)
          }
        }}
        onMouseUp={(e) => {
          if (primaryStyles.hoverStyle && 'transform' in primaryStyles.hoverStyle) {
            Object.assign(e.currentTarget.style, primaryStyles.hoverStyle)
          }
        }}
      >
        {/* Refined shimmer (like light reflecting off polished ebony) */}
        <div
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%)',
            transition: 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />

        <span className="relative flex items-center justify-center gap-2.5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          {iconProps && (
            <Image {...iconProps} alt="" className="w-5 h-5 object-contain" width={20} height={20} />
          )}
          {actualButtonText}
        </span>
      </button>
    )
  }

  // Render floating button (NO PORTAL - direct fixed positioning works perfectly)
  if (actualDisplayMode === 'floating' && mounted) {
    // Calculate bottom position to avoid mobile search bar
    // Mobile search bar height: ~66px (16px padding + 34px input + 16px padding)
    // Add 16px gap for visual separation = 82px total
    const bottomPosition = isMobile ? '82px' : '2rem'

    return (
      <>
        {/* Floating Button - Piano Key with Damper Lift Animation */}
        <div
          className="fixed right-8"
          style={{
            bottom: bottomPosition, // Dynamic positioning for mobile search bar
            zIndex: 99999, // Extremely high to ensure it's on top
            transition: 'opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), bottom 0.3s ease',
            opacity: isFloatingVisible && !isModalOpen ? 1 : 0,  // Hide when modal is open
            transform: isFloatingVisible && !isModalOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
            pointerEvents: isFloatingVisible && !isModalOpen ? 'auto' : 'none',  // Disable clicks when hidden
          }}
        >
          {/* Grain texture overlay (piano wood cabinet feel) */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04] rounded-lg"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Refined gold glow (like piano pedal hardware) */}
          <div
            className="absolute -inset-3 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.25) 0%, transparent 70%)',
              filter: 'blur(16px)',
              animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          />

          {/* Button Container with enhanced shadow */}
          <div
            className="relative"
            style={{
              filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.2)) drop-shadow(0 20px 40px rgba(196, 30, 58, 0.15))',
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

        {/* Modal with Pre-Form or Calendly Widget */}
        <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {showPreForm ? (
              <BookingPreForm
                onSubmit={handlePreFormSubmit}
                onCancel={handleModalClose}
                modalTitle={actualModalTitle}
              />
            ) : (
              <CalendlyBookingWidget
                isOpen={true}
                onClose={handleModalClose}
                calendlyUrl={calendlyUrl}
                displayMode="inline"
                modalTitle={actualModalTitle}
                {...(actualModalSubtitle && { modalSubtitle: actualModalSubtitle })}
                {...(prefillData && { prefillData })}
              />
            )}
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // Render inline button (default) - Piano showroom aesthetic
  return (
    <>
      {/* Inline Button Section */}
      <div
        className={cn(
          'w-full relative overflow-hidden',
          bgColorClasses[actualBackgroundColor as keyof typeof bgColorClasses],
          paddingClasses[actualPadding as keyof typeof paddingClasses]
        )}
      >
        {/* Grain texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Gold hardware accent - top */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"
          style={{
            boxShadow: '0 0 8px rgba(212, 175, 55, 0.3)',
          }}
        />

        <div
          className={cn(
            'container mx-auto px-4 flex',
            alignmentClasses[actualButtonAlignment as keyof typeof alignmentClasses],
            'relative'
          )}
          style={{
            animation: 'fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
          }}
        >
          <PianoKeyButton />
        </div>

        {/* Gold hardware accent - bottom */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"
          style={{
            boxShadow: '0 0 8px rgba(212, 175, 55, 0.3)',
          }}
        />
      </div>

      {/* Modal with Pre-Form or Calendly Widget */}
      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {showPreForm ? (
            <BookingPreForm
              onSubmit={handlePreFormSubmit}
              onCancel={handleModalClose}
              modalTitle={actualModalTitle}
            />
          ) : (
            <CalendlyBookingWidget
              isOpen={true}
              onClose={handleModalClose}
              calendlyUrl={calendlyUrl}
              displayMode="inline"
              modalTitle={actualModalTitle}
              {...(actualModalSubtitle && { modalSubtitle: actualModalSubtitle })}
              {...(prefillData && { prefillData })}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Keyframe for fade-in animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}
