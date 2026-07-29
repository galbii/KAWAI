'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Piano, Mail, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface EmailCapturePopupProps {
  /** Delay in milliseconds before showing popup (default: 3000) */
  delay?: number
  /** Show popup after user scrolls this percentage (default: 25) */
  scrollTrigger?: number
}

export default function EmailCapturePopup({ 
  delay = 3000, 
  scrollTrigger = 25 
}: EmailCapturePopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  // Check if user has already seen/dismissed the popup
  useEffect(() => {
    const dismissed = localStorage.getItem('kawai-email-popup-dismissed')
    const submitted = localStorage.getItem('kawai-email-popup-submitted')
    
    if (dismissed || submitted) {
      setIsDismissed(true)
      return
    }

    let timeoutId: NodeJS.Timeout
    let hasShownByScroll = false

    const handleScroll = () => {
      if (hasShownByScroll || isDismissed) return
      
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      
      if (scrollPercent >= scrollTrigger) {
        hasShownByScroll = true
        setIsVisible(true)
      }
    }

    // Show popup after delay OR scroll trigger
    timeoutId = setTimeout(() => {
      if (!hasShownByScroll && !isDismissed) {
        setIsVisible(true)
      }
    }, delay)

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [delay, scrollTrigger, isDismissed])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem('kawai-email-popup-dismissed', Date.now().toString())
  }

  // A11y: dialog focus trap, initial focus, Escape-to-close, focus restore
  const dialogRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const closeRef = useRef(handleClose)
  closeRef.current = handleClose

  useEffect(() => {
    if (!isVisible) return
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
  }, [isVisible])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || isSubmitting) return

    setIsSubmitting(true)
    
    try {
      // Submit to your existing Constant Contact integration
      const response = await fetch('/api/email-capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          source: 'homepage_popup',
          subscribeToUpdates: true 
        }),
      })

      if (response.ok) {
        setHasSubmitted(true)
        localStorage.setItem('kawai-email-popup-submitted', Date.now().toString())
        
        // Auto-close after success message
        setTimeout(() => {
          setIsVisible(false)
        }, 2500)
      } else {
        throw new Error('Subscription failed')
      }
    } catch (error) {
      console.error('Email capture error:', error)
      // Still show success to user, fail gracefully
      setHasSubmitted(true)
      setTimeout(() => {
        setIsVisible(false)
      }, 2500)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isDismissed) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Subtle backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-[9998] pointer-events-none"
            transition={{ duration: 0.3 }}
          />
          
          {/* Slide-in popup */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Newsletter signup"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.4
            }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                       w-[90vw] max-w-md bg-stone-50 rounded-2xl shadow-2xl
                       border-2 border-black z-[9999] overflow-hidden focus:outline-none"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 
                         transition-colors duration-200 z-10"
              aria-label="Close popup"
            >
              <X size={20} />
            </button>

            {!hasSubmitted ? (
              <div className="p-6 pt-8">
                {/* Icon and headline */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 
                                  bg-gradient-to-br from-blue-50 to-indigo-100 
                                  rounded-full mb-4">
                    <Piano className="w-8 h-8 text-blue-600" />
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Find Your Perfect Piano
                  </h2>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Get exclusive access to new arrivals, piano care tips, 
                    and special events at our St. Louis showroom.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 
                                     w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-label="Email address for newsletter signup"
                      placeholder="Enter your email address"
                      required
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 
                                 rounded-lg focus:ring-2 focus:ring-blue-500 
                                 focus:border-transparent transition-all duration-200
                                 text-sm"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 
                               hover:from-blue-700 hover:to-indigo-700 
                               disabled:from-gray-400 disabled:to-gray-400
                               text-white font-medium py-3 px-4 rounded-lg 
                               transition-all duration-200 text-sm
                               flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white 
                                        rounded-full animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Get Exclusive Updates
                      </>
                    )}
                  </button>
                </form>

                {/* Trust indicators */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center">
                    ✨ Exclusive showroom events • 🎹 New piano arrivals • 📧 Unsubscribe anytime
                  </p>
                </div>
              </div>
            ) : (
              /* Success state */
              <div className="p-6 pt-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 
                                bg-gradient-to-br from-green-50 to-emerald-100 
                                rounded-full mb-4">
                  <div className="w-8 h-8 text-green-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4" />
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Welcome to Our Community!
                </h2>
                
                <p className="text-gray-600 text-sm">
                  You're all set! We'll keep you updated on exclusive piano events, 
                  new arrivals, and special offers at our St. Louis showroom.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}