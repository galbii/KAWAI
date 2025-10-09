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

  // Build the full viewer URL by combining base URL and parameters
  const fullViewerUrl = useMemo(() => {
    if (!config?.enabled || !config?.viewerUrl) {
      return ''
    }

    const baseUrl = config.viewerUrl
    const params = config.modelParams || ''

    // If modelParams starts with ?, just append it
    // Otherwise, add ? if baseUrl doesn't have query params yet
    if (params.startsWith('?')) {
      return `${baseUrl}${params}`
    } else if (params) {
      const separator = baseUrl.includes('?') ? '&' : '?'
      return `${baseUrl}${separator}${params}`
    }

    return baseUrl
  }, [config])

  // Determine if viewer should auto-open based on URL parameter
  const shouldAutoOpen = useMemo(() => {
    if (!config?.enabled || !config?.autoOpen || !searchParams) {
      return false
    }

    const modeParam = searchParams.get('mode')
    return modeParam?.toLowerCase() === '3d'
  }, [config, searchParams])

  // Open modal
  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

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
