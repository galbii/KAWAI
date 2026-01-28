'use client'

import { useState, useEffect, useCallback } from 'react'

export interface UseModalOptions {
  defaultOpen?: boolean
  autoShow?: { delay: number; storageKey?: string }
  onOpen?: () => void
  onClose?: () => void
}

export interface UseModalReturn {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export function useModal(options?: UseModalOptions): UseModalReturn {
  const { defaultOpen = false, autoShow, onOpen, onClose } = options || {}

  const [isOpen, setIsOpen] = useState(defaultOpen)

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Auto-show logic
  useEffect(() => {
    if (!autoShow) {
      console.log('[useModal] No autoShow config provided')
      return
    }

    const { delay, storageKey } = autoShow
    console.log('[useModal] Auto-show configured:', { delay, storageKey })

    // Check if modal was already shown (if storageKey provided)
    if (storageKey) {
      try {
        const wasShown = localStorage.getItem(storageKey)
        console.log(`[useModal] Checking localStorage["${storageKey}"]:`, wasShown)
        if (wasShown === 'true') {
          console.log('[useModal] ⚠️ Modal already shown (localStorage check), skipping auto-show')
          console.log('[useModal] 💡 To see modal again, run in console: localStorage.removeItem("' + storageKey + '")')
          return // Don't auto-show if already shown before
        }
        console.log('[useModal] ✅ Modal not previously shown, will auto-show after delay')
      } catch (error) {
        // localStorage might not be available (SSR, private mode, etc.)
        console.warn('[useModal] localStorage not available:', error)
      }
    }

    // Set timeout to auto-show modal
    console.log(`[useModal] Setting timer to show modal in ${delay}ms`)
    const timer = setTimeout(() => {
      console.log('[useModal] Timer fired, opening modal')
      setIsOpen(true)
      onOpen?.()
    }, delay)

    return () => {
      console.log('[useModal] Cleaning up timer')
      clearTimeout(timer)
    }
  }, [autoShow, onOpen])

  const open = useCallback(() => {
    setIsOpen(true)
    onOpen?.()
  }, [onOpen])

  const close = useCallback(() => {
    console.log('[useModal] Closing modal')
    setIsOpen(false)
    onClose?.()

    // Mark as shown in localStorage if storageKey provided
    if (autoShow?.storageKey) {
      try {
        console.log('[useModal] Saving to localStorage:', autoShow.storageKey)
        localStorage.setItem(autoShow.storageKey, 'true')
      } catch (error) {
        console.warn('[useModal] Failed to save to localStorage:', error)
      }
    }
  }, [onClose, autoShow?.storageKey])

  const toggle = useCallback(() => {
    if (isOpen) {
      close()
    } else {
      open()
    }
  }, [isOpen, open, close])

  return {
    isOpen,
    open,
    close,
    toggle,
  }
}
