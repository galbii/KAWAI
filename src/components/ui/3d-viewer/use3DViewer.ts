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

    // modelParams is a query string, e.g. "?model=ES60&region=GLOBAL&inModal=true"
    const params = new URLSearchParams(config.modelParams.replace(/^\?/, ''))
    const modelId = params.get('model')

    if (!modelId) {
      console.warn('3D Viewer: No model parameter found in modelParams:', config.modelParams)
      return ''
    }

    // Forward every param the upstream viewer supports — not just `model`.
    // Dropping `region` is what let the ES60 render finishes we don't sell, and
    // dropping `inModal` left the options panel positioned for a standalone page.
    // The proxy re-validates this list server-side.
    const proxyParams = new URLSearchParams({ model: modelId })
    for (const key of ['region', 'inModal', 'finish', 'pose', 'options']) {
      const value = params.get(key)
      if (value) proxyParams.set(key, value)
    }

    // Use our proxy API route instead of the external URL —
    // this bypasses the upstream X-Frame-Options header.
    return `/api/3d-viewer-proxy?${proxyParams.toString()}`
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

  // NOTE: there used to be a global "press V to toggle" shortcut here. It fired on
  // any keydown outside an <input>/<textarea>, so a bare `v` anywhere on a product
  // page opened the modal — with no affordance telling anyone the key existed, and
  // no guard for contentEditable, <select>, or the search overlay. The modal is
  // reachable from the button and dismissible with Escape; the shortcut was removed
  // rather than guarded, because there is no reliable way to infer intent from a
  // single unmodified letter key.

  return {
    isOpen,
    open,
    close,
    toggle,
    fullViewerUrl,
    shouldAutoOpen
  }
}
