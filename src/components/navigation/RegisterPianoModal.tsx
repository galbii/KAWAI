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

    // Poll until HubSpot injects its iframe or form element
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
      // flex-col layout: header is fixed, form scrolls independently.
      // overflow-hidden on the shell prevents the whole modal from growing/jumping.
      // z-[9601] sits above the portaled search bar (z-[9003]) and sidebar (z-[9501]).
      className="p-0 flex flex-col max-h-[90dvh] overflow-hidden w-[calc(100%-2rem)] sm:w-full z-[9601]"
      overlayClassName="z-[9600]"
    >
      {/* Close button — absolute so it always floats above both sections */}
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

      {/* ── HEADER (flex-shrink-0 — never scrolls away) ───────────────────── */}
      <div className="flex-shrink-0">
        {bannerImageUrl ? (
          <div className="relative overflow-hidden bg-kawai-black h-[140px] sm:h-[220px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bannerImageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            {(bannerTitle ?? bannerDescription) && (
              <div className="relative hidden sm:flex h-full flex-col justify-center px-8 py-8">
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
          <div className="bg-kawai-black px-8 py-6">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-kawai-red mb-1.5">
              Piano Owner
            </p>
            <h2 className="text-xl font-bold text-white leading-snug">
              {bannerTitle || '3 Month Subscription When You Activate Your Warranty Today'}
            </h2>
            {bannerDescription && (
              <p className="mt-1.5 text-sm text-white/70 leading-relaxed max-w-sm">{bannerDescription}</p>
            )}
          </div>
        )}
      </div>

      {/* ── FORM PANE (flex-1, scrolls independently) ─────────────────────── */}
      <div className="flex-1 overflow-y-auto min-h-0 relative bg-kawai-pearl">
        <div className="px-4 py-6 sm:px-6 sm:py-8">
          {/* Card that wraps the form */}
          <div className="relative bg-white rounded-2xl shadow-sm border border-kawai-neutral/40 overflow-hidden min-h-[280px]">

            {/* Loading skeleton — absolute inside the card */}
            <AnimatePresence>
              {!formReady && (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 px-5 py-6 space-y-4 bg-white"
                >
                  <div className="space-y-1.5">
                    <div className="h-2.5 w-16 rounded-full bg-gray-200 animate-pulse" />
                    <div className="h-10 rounded-xl bg-gray-100 animate-pulse" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2.5 w-20 rounded-full bg-gray-200 animate-pulse" />
                    <div className="h-10 rounded-xl bg-gray-100 animate-pulse" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <div className="h-2.5 w-14 rounded-full bg-gray-200 animate-pulse" />
                      <div className="h-10 rounded-xl bg-gray-100 animate-pulse" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2.5 w-16 rounded-full bg-gray-200 animate-pulse" />
                      <div className="h-10 rounded-xl bg-gray-100 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2.5 w-24 rounded-full bg-gray-200 animate-pulse" />
                    <div className="h-10 rounded-xl bg-gray-100 animate-pulse" />
                  </div>
                  <div className="pt-3">
                    <div className="h-11 rounded-xl bg-gray-200 animate-pulse" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* HubSpot form — fades in once ready */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: formReady ? 1 : 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="px-5 py-6"
            >
              <div
                className="hs-form-frame"
                data-region={region}
                data-form-id={formId}
                data-portal-id={portalId}
              />
            </motion.div>
          </div>

          {/* Privacy note */}
          {formReady && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mt-3 text-center text-[11px] text-gray-400 leading-relaxed"
            >
              Your information is protected and will never be shared.
            </motion.p>
          )}
        </div>
      </div>
    </Modal>
  )
}
