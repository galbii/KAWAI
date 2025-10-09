'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ThreeDViewerModalProps } from './types'

/**
 * ThreeDViewerModal - Full-screen 3D model viewer with iframe
 *
 * Features:
 * - Full-screen modal overlay with smooth animations
 * - iframe-based viewer for external 3D model services
 * - Keyboard support (Escape to close)
 * - Click-outside to close
 * - Body scroll lock when open
 * - Error handling with fallback UI
 * - GTM tracking integration
 *
 * @example
 * ```tsx
 * <ThreeDViewerModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   viewerUrl="https://kawai-global.com/modelviewer/?model=gl-10"
 *   productName="GL-10 Grand Piano"
 * />
 * ```
 */
export function ThreeDViewerModal({
  isOpen,
  onClose,
  viewerUrl,
  productName,
  className
}: ThreeDViewerModalProps) {
  const [iframeError, setIframeError] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  // Track GTM events
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', '3d_viewer_opened', {
        product_name: productName,
        viewer_url: viewerUrl
      })
    }
  }, [isOpen, productName, viewerUrl])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('viewer-modal-open')
      document.body.style.overflow = 'hidden'
    } else {
      document.body.classList.remove('viewer-modal-open')
      document.body.style.overflow = ''
    }

    return () => {
      document.body.classList.remove('viewer-modal-open')
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isClosing) {
        handleClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isClosing])

  // Close handler with animation coordination
  const handleClose = () => {
    if (isClosing) return

    setIsClosing(true)

    // Track GTM close event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', '3d_viewer_closed', {
        product_name: productName,
        viewer_url: viewerUrl
      })
    }

    // Call onClose after a small delay to allow animation to start
    setTimeout(() => {
      onClose()
      setIsClosing(false)
      setIframeError(false)
    }, 100)
  }

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleClose()
    }
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className={cn(
            'fixed inset-0 z-[1000] flex items-center justify-center',
            'bg-black/95 backdrop-blur-md',
            className
          )}
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="viewer-modal-title"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className={cn(
              'absolute top-5 right-8 z-[1001]',
              'text-gray-400 hover:text-gray-200 transition-colors',
              'text-5xl leading-none focus:outline-none focus:ring-2 focus:ring-white/50 rounded',
              'p-2 -m-2'
            )}
            aria-label="Close 3D Viewer"
          >
            ×
          </button>

          {/* Hidden title for accessibility */}
          <h2 id="viewer-modal-title" className="sr-only">
            3D Model Viewer - {productName}
          </h2>

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full h-full"
          >
            {/* iframe or error state */}
            {!iframeError ? (
              <iframe
                src={viewerUrl}
                className={cn(
                  'w-full h-full border-none bg-transparent'
                )}
                allow="autoplay; fullscreen; xr-spatial-tracking"
                allowFullScreen
                title={`3D Model - ${productName}`}
                onError={() => {
                  console.error('Failed to load 3D viewer iframe:', viewerUrl)
                  setIframeError(true)
                }}
              />
            ) : (
              // Error fallback
              <div className="flex items-center justify-center w-full h-full">
                <div className="text-center space-y-4">
                  <div className="text-6xl">⚠️</div>
                  <h3 className="text-2xl font-light text-white">
                    Unable to Load 3D Viewer
                  </h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    Sorry, the 3D model viewer could not be loaded at this time.
                    Please try again later or contact support if the problem persists.
                  </p>
                  <button
                    onClick={handleClose}
                    className={cn(
                      'mt-6 px-6 py-3 rounded-lg',
                      'bg-white/10 hover:bg-white/20 text-white',
                      'transition-colors duration-200'
                    )}
                  >
                    Close Viewer
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
