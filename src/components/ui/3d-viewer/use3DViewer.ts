'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { Use3DViewerReturn, Use3DViewerOptions } from './types'

/**
 * Custom hook for managing 3D viewer state and behavior
 *
 * Features:
 * - Modal open/close state management
 * - Auto-open detection from URL parameters (?mode=3d)
 * - Full viewer URL construction (base URL + parameters)
 * - Preloading optimization
 *
 * @example
 * ```tsx
 * const viewer = use3DViewer({
 *   config: product.viewer3D,
 *   productName: product.name,
 *   searchParams: new URLSearchParams(window.location.search)
 * })
 *
 * return (
 *   <>
 *     <ThreeDViewerButton onClick={viewer.open} productName={product.name} />
 *     <ThreeDViewerModal
 *       isOpen={viewer.isOpen}
 *       onClose={viewer.close}
 *       viewerUrl={viewer.fullViewerUrl}
 *       productName={product.name}
 *     />
 *   </>
 * )
 * ```
 */
export function use3DViewer({
  config,
  productName,
  searchParams
}: Use3DViewerOptions): Use3DViewerReturn {
  const [isOpen, setIsOpen] = useState(false)

  // Build the full viewer URL using our proxy API route
  const fullViewerUrl = useMemo(() => {
    if (!config?.enabled || !config?.modelParams) {
      return ''
    }

    // Extract model parameter from modelParams
    // Expected format: "?model=ca901" or "model=ca901"
    const params = config.modelParams
    const modelMatch = params.match(/model=([^&]+)/)

    if (!modelMatch || !modelMatch[1]) {
      console.warn('3D Viewer: No model parameter found in modelParams:', params)
      return ''
    }

    const modelId = modelMatch[1]

    // Use our proxy API route instead of external URL
    // This bypasses X-Frame-Options header restrictions
    return `/api/3d-viewer-proxy?model=${encodeURIComponent(modelId)}`
  }, [config])

  // Determine if viewer should auto-open based on URL parameter
  const shouldAutoOpen = useMemo(() => {
    if (!config?.enabled || !config?.autoOpen || !searchParams) {
      return false
    }

    const modeParam = searchParams.get('mode')
    return modeParam?.toLowerCase() === '3d'
  }, [config, searchParams])

  // Open modal with iframe (now works thanks to proxy stripping X-Frame-Options)
  const open = useCallback(() => {
    if (fullViewerUrl) {
      // Open as iframe modal instead of popup window
      setIsOpen(true)

      // Track GTM event for modal open
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', '3d_viewer_opened', {
          product_name: productName,
          viewer_url: fullViewerUrl,
          method: 'iframe'
        })
      }
    }
  }, [fullViewerUrl, productName])

  // Close modal
  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Toggle modal
  const toggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  // Handle auto-open on mount if URL parameter is present
  useEffect(() => {
    if (shouldAutoOpen && fullViewerUrl) {
      // Small delay to ensure page is loaded
      const timer = setTimeout(() => {
        open()
      }, 100)

      return () => clearTimeout(timer)
    }
    return undefined
  }, [shouldAutoOpen, fullViewerUrl, open])

  // Preload viewer content for faster loading
  useEffect(() => {
    if (config?.enabled && fullViewerUrl) {
      // Preload the iframe content in the background
      fetch(fullViewerUrl, { method: 'HEAD' }).catch(error => {
        console.warn('3D Viewer preloading failed:', error)
      })
    }
  }, [config?.enabled, fullViewerUrl])

  // Handle keyboard shortcuts (optional enhancement)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Press 'V' to toggle viewer (when not in input field)
      if (
        event.key.toLowerCase() === 'v' &&
        !['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName) &&
        config?.enabled
      ) {
        toggle()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [toggle, config?.enabled])

  return {
    isOpen,
    open,
    close,
    toggle,
    fullViewerUrl,
    shouldAutoOpen
  }
}
