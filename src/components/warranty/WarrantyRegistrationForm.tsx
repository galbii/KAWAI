'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { motion, AnimatePresence } from 'framer-motion'

interface WarrantyRegistrationFormProps {
  scriptUrl: string
  formId: string
  portalId: string
  region: string
}

export function WarrantyRegistrationForm({
  scriptUrl,
  formId,
  portalId,
  region,
}: WarrantyRegistrationFormProps) {
  const [formReady, setFormReady] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const listenerAttached = useRef(false)

  // Register the HubSpot V4 submission event BEFORE the script loads.
  // The new hs-form-frame embed fires a CustomEvent on window (not postMessage).
  useEffect(() => {
    if (listenerAttached.current) return
    listenerAttached.current = true

    const handleReady = () => {
      setFormReady(true)
    }

    const handleSuccess = (event: Event) => {
      const detail = (event as CustomEvent<{ formId?: string }>).detail

      // Guard: only react to this component's form
      if (detail?.formId && detail.formId !== formId) return

      setSubmitted(true)
    }

    window.addEventListener('hs-form-event:on-ready', handleReady)
    window.addEventListener('hs-form-event:on-submission:success', handleSuccess)

    return () => {
      window.removeEventListener('hs-form-event:on-ready', handleReady)
      window.removeEventListener('hs-form-event:on-submission:success', handleSuccess)
      listenerAttached.current = false
    }
  }, [formId])

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col items-center py-10 text-center"
      >
        {/* Fine line check mark */}
        <div
          className="mb-6 flex items-center justify-center"
          style={{
            width: 52,
            height: 52,
            border: '1px solid #E11922',
            background: 'transparent',
          }}
        >
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
            <path d="M1 7L7 13L19 1" stroke="#E11922" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <p
          style={{
            fontFamily: 'var(--font-brand-luxury)',
            fontSize: '22px',
            fontWeight: 400,
            color: '#1E1B16',
            letterSpacing: '-0.01em',
            marginBottom: '8px',
          }}
        >
          Registration Complete
        </p>
        <p
          style={{
            fontFamily: 'var(--font-brand-sans)',
            fontSize: '13px',
            color: '#1E1B16',
            opacity: 0.5,
            lineHeight: 1.7,
            maxWidth: '280px',
          }}
        >
          Your KAWAI piano is now registered and your warranty is active.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="relative min-h-[320px]">
      {/* HubSpot embed script — afterInteractive ensures it loads after hydration */}
      <Script src={scriptUrl} strategy="afterInteractive" />

      {/* Loading skeleton */}
      <AnimatePresence>
        {!formReady && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 space-y-4 px-1"
          >
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-2.5 w-20 rounded-full bg-kawai-neutral animate-pulse" />
                <div className="h-10 rounded-xl bg-kawai-neutral/60 animate-pulse" />
              </div>
            ))}
            <div className="pt-2">
              <div className="h-11 rounded-xl bg-kawai-neutral animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HubSpot form container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: formReady ? 1 : 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div
          className="hs-form-frame"
          data-region={region}
          data-form-id={formId}
          data-portal-id={portalId}
        />
      </motion.div>
    </div>
  )
}
