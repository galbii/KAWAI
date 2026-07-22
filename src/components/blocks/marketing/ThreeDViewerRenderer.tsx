'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ThreeDViewerButton, ThreeDViewerModal, use3DViewer } from '@/components/ui/3d-viewer'
import type { Viewer3DConfig } from '@/components/ui/3d-viewer'
import { trackWithConfig } from '@/lib/analytics/unified-tracking'

/**
 * Type definition for 3D Viewer Block props
 * This matches the block definition in src/blocks/marketing/ThreeDViewer.ts
 * After build, this will be available as Marketing3DViewerBlock in @/payload-types
 */
interface ThreeDViewerRendererProps {
  modelId: string
  productName?: string | null
  buttonText?: string | null
  buttonPosition?: 'bottom-left' | 'bottom-right' | 'bottom-center' | null
  theme?: 'blue' | 'kawai-red' | 'black' | 'gold' | null
  autoOpen?: boolean | null
  contextSection?: {
    showContext?: boolean | null
    heading?: string | null
    description?: string | null
    contextPosition?: 'above' | 'below' | 'separate' | null
  } | null
  layout?: {
    hideOnMobile?: boolean | null
    showScrollIndicator?: boolean | null
  } | null
  blockType?: string
  id?: string
  tracking?: any
}

export function ThreeDViewerRenderer({
  modelId,
  productName,
  buttonText = 'View in 3D',
  buttonPosition = 'bottom-left',
  theme = 'kawai-red',
  autoOpen = false,
  contextSection,
  layout,
  tracking,
}: ThreeDViewerRendererProps) {
  const searchParams = useSearchParams()

  // Debug logging
  console.log('🎹 [3D Viewer] Rendering with config:', {
    modelId,
    productName,
    buttonText,
    buttonPosition,
    theme,
    autoOpen,
    hideOnMobile: layout?.hideOnMobile,
    zIndex: 10004,
    mobileBottomSpacing: '80px (bottom-20)',
    desktopBottomSpacing: '20px (bottom-5)',
    note: 'z-index above search bar (10003)',
  })

  // Build viewer configuration
  const viewerConfig: Viewer3DConfig = {
    enabled: true,
    viewerUrl: 'https://www.kawai-global.com/modelviewer/index.php',
    modelParams: `?model=${modelId}`,
    autoOpen: autoOpen ?? false,
    buttonText: buttonText || 'View in 3D',
  }

  // Use the 3D viewer hook
  const viewer = use3DViewer({
    config: viewerConfig,
    productName: productName || modelId,
    searchParams,
  })

  // Tracking helper
  const fireTracking = React.useCallback(
    (method: 'click' | 'auto-open') => {
      trackWithConfig({
        blockType: 'marketing-3d-viewer',
        blockData: { tracking: tracking as any },
        action: 'engagement',
        label: `3D Viewer: ${productName || modelId}`,
        additionalProps: {
          model_id: modelId,
          product_name: productName || modelId,
          button_text: buttonText,
          open_method: method,
        },
      })
    },
    [tracking, modelId, productName, buttonText],
  )

  // Handle manual open with tracking
  const handleOpen = React.useCallback(() => {
    viewer.open()
    fireTracking('click')
  }, [viewer, fireTracking])

  // Track auto-opens (triggered by ?mode=3d URL param)
  React.useEffect(() => {
    if (viewer.shouldAutoOpen) {
      fireTracking('auto-open')
    }
  }, [viewer.shouldAutoOpen, fireTracking])

  // Theme styles for the button (using !important to override defaults)
  const themeStyles = {
    blue: {
      bg: '!bg-blue-600 hover:!bg-blue-700',
      text: '!text-white',
      ring: '!focus:ring-blue-500',
    },
    'kawai-red': {
      bg: '!bg-kawai-red hover:!bg-kawai-red/90',
      text: '!text-white',
      ring: '!focus:ring-kawai-red',
    },
    black: {
      bg: '!bg-kawai-charcoal hover:!bg-kawai-black',
      text: '!text-white',
      ring: '!focus:ring-kawai-charcoal',
    },
    gold: {
      bg: '!bg-kawai-gold hover:!bg-kawai-gold/90',
      text: '!text-kawai-charcoal',
      ring: '!focus:ring-kawai-gold',
    },
  }

  const currentTheme = themeStyles[theme as keyof typeof themeStyles] || themeStyles['kawai-red']

  // Button position classes with mobile-optimized spacing
  // On mobile: bottom-20 (80px) to clear browser chrome and mobile search bars
  // On desktop: bottom-5 (20px) standard spacing
  const positionClasses = {
    'bottom-left': '!bottom-20 md:!bottom-5 !left-5 !right-auto !translate-x-0',
    'bottom-right': '!bottom-20 md:!bottom-5 !right-5 !left-auto !translate-x-0',
    'bottom-center': '!bottom-20 md:!bottom-5 !left-1/2 !right-auto !-translate-x-1/2',
  }

  const currentPosition =
    positionClasses[buttonPosition as keyof typeof positionClasses] || positionClasses['bottom-left']

  // Hide on mobile if specified
  const mobileClasses = layout?.hideOnMobile ? 'hidden md:block' : ''

  // High z-index to appear above mobile UI elements and search bar
  const zIndexClass = '!z-[10004]'

  // Context section alignment
  const contextPositionMap = {
    above: 'mb-8',
    below: 'mt-8',
    separate: 'mb-16',
  }

  const contextPosition = contextSection?.contextPosition || 'above'
  const contextClasses = contextPositionMap[contextPosition as keyof typeof contextPositionMap]

  return (
    <>
      {/* Optional Context Section */}
      {contextSection?.showContext && contextPosition === 'separate' && (
        <section className="py-12 md:py-16 bg-kawai-pearl">
          <div className="container mx-auto px-6 sm:px-8 max-w-4xl text-center">
            {contextSection.heading && (
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-kawai-charcoal mb-6">
                {contextSection.heading}
              </h2>
            )}
            {contextSection.description && (
              <p className="text-lg sm:text-xl text-kawai-charcoal/70 leading-relaxed max-w-2xl mx-auto">
                {contextSection.description}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Context near button (if not separate) */}
      {contextSection?.showContext && contextPosition !== 'separate' && contextPosition === 'above' && (
        <div className={cn('fixed z-[998] left-1/2 -translate-x-1/2', contextClasses, mobileClasses)}>
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-6 py-4 max-w-md text-center">
            {contextSection.heading && (
              <h3 className="font-serif text-xl font-medium text-kawai-charcoal mb-2">
                {contextSection.heading}
              </h3>
            )}
            {contextSection.description && (
              <p className="text-sm text-kawai-charcoal/70">{contextSection.description}</p>
            )}
          </div>
        </div>
      )}

      {/* 3D Viewer Button */}
      <ThreeDViewerButton
        onClick={handleOpen}
        text={buttonText || 'View in 3D'}
        productName={productName || modelId}
        visible={!viewer.isOpen}
        className={cn(
          // High z-index for mobile (above browser UI)
          zIndexClass,
          // Override positioning (mobile-optimized)
          currentPosition,
          // Override theme colors
          currentTheme.bg,
          currentTheme.text,
          currentTheme.ring,
          // Mobile visibility
          mobileClasses
        )}
      />

      {/* Context below button */}
      {contextSection?.showContext && contextPosition === 'below' && (
        <div className={cn('fixed z-[998] left-1/2 -translate-x-1/2', contextClasses, mobileClasses)}>
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-6 py-4 max-w-md text-center">
            {contextSection.heading && (
              <h3 className="font-serif text-xl font-medium text-kawai-charcoal mb-2">
                {contextSection.heading}
              </h3>
            )}
            {contextSection.description && (
              <p className="text-sm text-kawai-charcoal/70">{contextSection.description}</p>
            )}
          </div>
        </div>
      )}

      {/* 3D Viewer Modal */}
      <ThreeDViewerModal
        isOpen={viewer.isOpen}
        onClose={viewer.close}
        viewerUrl={viewer.fullViewerUrl}
        productName={productName || modelId}
      />

      {/* Optional Scroll Indicator */}
      {layout?.showScrollIndicator && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[997] animate-bounce">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-kawai-charcoal/50"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      )}
    </>
  )
}
