'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface QuickContactModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: QuickContactData) => void
  loading?: boolean
}

export interface QuickContactData {
  email: string
  firstName: string
  lastName: string
  phone?: string
}

/**
 * QuickContactModal - Lightweight contact form for signature2
 *
 * Collects minimal info (email, name, phone) before opening Calendly.
 * This enables:
 * - Pre-filling Calendly (reduces friction)
 * - Tracking with real data (Meta Pixel + PostHog)
 * - Constant Contact submission (SHOWROOM KAWAI list)
 *
 * Design: Elegant, fast, minimal - matches luxury aesthetic
 */
export function QuickContactModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false
}: QuickContactModalProps) {
  const [formData, setFormData] = useState<QuickContactData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof QuickContactData, string>>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof QuickContactData, string>> = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleChange = (field: keyof QuickContactData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // A11y: dialog focus trap, initial focus, Escape-to-close, focus restore
  const dialogRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    if (!isOpen) return
    previouslyFocused.current = document.activeElement as HTMLElement | null
    dialogRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeRef.current()
        return
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (!first || !last) return
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocused.current?.focus?.()
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-kawai-black/95 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Reserve your Signature spot"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className={cn(
              'relative bg-gradient-to-br from-gray-900 to-kawai-black rounded-2xl shadow-2xl',
              'w-full max-w-md p-8 border border-kawai-gold/20 focus:outline-none'
            )}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 text-kawai-pearl/60 hover:text-kawai-pearl transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-light text-kawai-pearl mb-2">
                Reserve Your <span className="text-kawai-red">Signature</span> Spot
              </h2>
              <p className="text-kawai-pearl/70 text-sm">
                A few quick details to secure your special financing, tuning, and delivery priority
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-kawai-pearl text-sm font-light mb-2">
                  First Name <span className="text-kawai-red">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  disabled={loading}
                  className={cn(
                    'w-full px-4 py-3 rounded-lg bg-kawai-black/50 border text-kawai-pearl',
                    'focus:outline-none focus:ring-2 focus:ring-kawai-gold/50 transition-all',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    errors.firstName ? 'border-red-500' : 'border-kawai-gold/20'
                  )}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-kawai-pearl text-sm font-light mb-2">
                  Last Name <span className="text-kawai-red">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  disabled={loading}
                  className={cn(
                    'w-full px-4 py-3 rounded-lg bg-kawai-black/50 border text-kawai-pearl',
                    'focus:outline-none focus:ring-2 focus:ring-kawai-gold/50 transition-all',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    errors.lastName ? 'border-red-500' : 'border-kawai-gold/20'
                  )}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-kawai-pearl text-sm font-light mb-2">
                  Email <span className="text-kawai-red">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  disabled={loading}
                  className={cn(
                    'w-full px-4 py-3 rounded-lg bg-kawai-black/50 border text-kawai-pearl',
                    'focus:outline-none focus:ring-2 focus:ring-kawai-gold/50 transition-all',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    errors.email ? 'border-red-500' : 'border-kawai-gold/20'
                  )}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone (optional) */}
              <div>
                <label htmlFor="phone" className="block text-kawai-pearl text-sm font-light mb-2">
                  Phone <span className="text-kawai-pearl/50 text-xs">(optional)</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  disabled={loading}
                  className={cn(
                    'w-full px-4 py-3 rounded-lg bg-kawai-black/50 border border-kawai-gold/20 text-kawai-pearl',
                    'focus:outline-none focus:ring-2 focus:ring-kawai-gold/50 transition-all',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={cn(
                  'w-full px-6 py-4 rounded-lg font-medium tracking-wide transition-all',
                  'bg-gradient-to-r from-kawai-gold to-kawai-gold/90 text-kawai-black',
                  'hover:from-kawai-gold/90 hover:to-kawai-gold shadow-lg hover:shadow-xl',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'flex items-center justify-center gap-2'
                )}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-kawai-black/30 border-t-kawai-black rounded-full animate-spin" />
                    <span>Opening Calendar...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Calendar</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </motion.button>

              {/* Privacy note */}
              <p className="text-kawai-pearl/50 text-xs text-center mt-4">
                Your information is secure and will only be used to coordinate your exclusive appointment.
              </p>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}