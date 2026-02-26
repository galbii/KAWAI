'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Modal } from '@/components/ui/modal'

interface RegisterPianoModalProps {
  isOpen: boolean
  onClose: () => void
  /** Banner image URL from CMS (optional) */
  bannerImageUrl?: string | null
  /** Overlay title on the banner */
  bannerTitle?: string | null
  /** Overlay description on the banner */
  bannerDescription?: string | null
  /** HubSpot embed script src URL */
  hubspotEmbedUrl?: string | null
  /** HubSpot data-form-id */
  hubspotFormId?: string | null
  /** HubSpot data-portal-id */
  hubspotPortalId?: string | null
  /** HubSpot data-region */
  hubspotRegion?: string | null
}

// Fallback values — can be overridden from the CMS
const DEFAULT_EMBED_URL = 'https://js.hsforms.net/forms/embed/21987263.js'
const DEFAULT_FORM_ID = '2d83f40a-44fe-421e-a4a5-3b4efcd80100'
const DEFAULT_PORTAL_ID = '21987263'
const DEFAULT_REGION = 'na1'

export function RegisterPianoModal({
  isOpen,
  onClose,
  bannerImageUrl,
  bannerTitle,
  bannerDescription,
  hubspotEmbedUrl,
  hubspotFormId,
  hubspotPortalId,
  hubspotRegion,
}: RegisterPianoModalProps) {
  const scriptUrl = hubspotEmbedUrl || DEFAULT_EMBED_URL
  const formId = hubspotFormId || DEFAULT_FORM_ID
  const portalId = hubspotPortalId || DEFAULT_PORTAL_ID
  const region = hubspotRegion || DEFAULT_REGION

  const [formReady, setFormReady] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      // Reset so the skeleton shows fresh on the next open
      setFormReady(false)
      return
    }

    const existing = document.querySelector('script[data-hs-reg-piano]')
    if (existing) existing.remove()

    const script = document.createElement('script')
    script.src = scriptUrl
    script.setAttribute('data-hs-reg-piano', 'true')
    script.async = true
    document.body.appendChild(script)

    // HubSpot renders the form asynchronously after the script executes.
    // Poll until an iframe or form element appears inside the frame div.
    const interval = setInterval(() => {
      const injected = document.querySelector('.hs-form-frame iframe, .hs-form-frame form')
      if (injected) {
        setFormReady(true)
        clearInterval(interval)
      }
    }, 150)

    return () => {
      script.remove()
      clearInterval(interval)
    }
  }, [isOpen, scriptUrl])

  const hasDarkHeader = bannerImageUrl || bannerTitle || bannerDescription

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      showCloseButton={false}
      className="p-0 overflow-hidden max-h-[90dvh] overflow-y-auto w-[calc(100%-2rem)] sm:w-full"
    >
      {/* Close button — adapts colour based on whether there's a dark header */}
      <button
        onClick={onClose}
        aria-label="Close"
        className={`absolute right-3 top-3 sm:right-4 sm:top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200 ${
          hasDarkHeader
            ? 'bg-black/30 text-white hover:bg-black/55'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3.5 w-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Banner — image from CMS */}
      {bannerImageUrl ? (
        <div className="relative overflow-hidden bg-kawai-black min-h-[120px] sm:min-h-[220px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bannerImageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          {(bannerTitle ?? bannerDescription) && (
            <div className="relative hidden sm:flex h-full min-h-[220px] flex-col justify-center px-8 py-8">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-kawai-red">
                Piano Owner
              </p>
              {bannerTitle && (
                <h2 className="text-2xl font-bold text-white leading-snug">{bannerTitle}</h2>
              )}
              {bannerDescription && (
                <p className="mt-2 max-w-xs text-sm text-white/75 leading-relaxed">{bannerDescription}</p>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Branded dark header — shown when no banner image is configured */
        <div className="bg-kawai-black px-8 py-6">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-kawai-red mb-1.5">
            Piano Owner
          </p>
          <h2 className="text-xl font-bold text-white leading-snug">
            {bannerTitle || 'Register Your Piano'}
          </h2>
          {bannerDescription && (
            <p className="mt-1.5 text-sm text-white/70 leading-relaxed max-w-sm">{bannerDescription}</p>
          )}
        </div>
      )}

      {/* Form area */}
      <div className="relative px-4 py-6 sm:px-8 sm:py-8 sm:min-h-[320px]">

        {/* Loading skeleton — visible until HubSpot renders */}
        <AnimatePresence>
          {!formReady && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 px-4 py-6 sm:px-8 sm:py-8 space-y-4"
            >
              {/* Mimics a typical HubSpot form layout */}
              <div className="space-y-1.5">
                <div className="h-3 w-20 rounded bg-gray-200 animate-pulse" />
                <div className="h-10 rounded-md bg-gray-100 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-24 rounded bg-gray-200 animate-pulse" />
                <div className="h-10 rounded-md bg-gray-100 animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <div className="h-3 w-16 rounded bg-gray-200 animate-pulse" />
                  <div className="h-10 rounded-md bg-gray-100 animate-pulse" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-20 rounded bg-gray-200 animate-pulse" />
                  <div className="h-10 rounded-md bg-gray-100 animate-pulse" />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-28 rounded bg-gray-200 animate-pulse" />
                <div className="h-10 rounded-md bg-gray-100 animate-pulse" />
              </div>
              <div className="pt-2">
                <div className="h-11 w-32 rounded-md bg-gray-200 animate-pulse" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HubSpot form — fades in once rendered */}
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
    </Modal>
  )
}
