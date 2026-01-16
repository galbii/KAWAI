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
    if (!autoShow) return

    const { delay, storageKey } = autoShow

    // Check if modal was already shown (if storageKey provided)
    if (storageKey) {
      try {
        const wasShown = localStorage.getItem(storageKey)
        if (wasShown === 'true') {
          return // Don't auto-show if already shown before
        }
      } catch (error) {
        // localStorage might not be available (SSR, private mode, etc.)
        console.warn('localStorage not available:', error)
      }
    }

    // Set timeout to auto-show modal
    const timer = setTimeout(() => {
      setIsOpen(true)
      onOpen?.()
    }, delay)

    return () => clearTimeout(timer)
  }, [autoShow, onOpen])

  const open = useCallback(() => {
    setIsOpen(true)
    onOpen?.()
  }, [onOpen])

  const close = useCallback(() => {
    setIsOpen(false)
    onClose?.()

    // Mark as shown in localStorage if storageKey provided
    if (autoShow?.storageKey) {
      try {
        localStorage.setItem(autoShow.storageKey, 'true')
      } catch (error) {
        console.warn('Failed to save to localStorage:', error)
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
