'use client'

import { useEffect } from 'react'
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
}

// Fallback values — can be overridden from the CMS
const DEFAULT_EMBED_URL = 'https://js.hsforms.net/forms/embed/21987263.js'
const DEFAULT_FORM_ID = '2d83f40a-44fe-421e-a4a5-3b4efcd80100'
const DEFAULT_PORTAL_ID = '21987263'

export function RegisterPianoModal({
  isOpen,
  onClose,
  bannerImageUrl,
  bannerTitle,
  bannerDescription,
  hubspotEmbedUrl,
  hubspotFormId,
  hubspotPortalId,
}: RegisterPianoModalProps) {
  const scriptUrl = hubspotEmbedUrl || DEFAULT_EMBED_URL
  const formId = hubspotFormId || DEFAULT_FORM_ID
  const portalId = hubspotPortalId || DEFAULT_PORTAL_ID

  useEffect(() => {
    if (!isOpen) return

    const existing = document.querySelector('script[data-hs-reg-piano]')
    if (existing) existing.remove()

    const script = document.createElement('script')
    script.src = scriptUrl
    script.setAttribute('data-hs-reg-piano', 'true')
    script.async = true
    document.body.appendChild(script)

    return () => {
      script.remove()
    }
  }, [isOpen, scriptUrl])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      showCloseButton={false}
      className="p-0 overflow-hidden"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3.5 w-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Banner image with optional text overlay */}
      {bannerImageUrl && (
        <div className="relative overflow-hidden bg-gray-900" style={{ minHeight: '220px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bannerImageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Gradient overlay — only rendered when there's text to show */}
          {(bannerTitle ?? bannerDescription) && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
          )}
          {/* Text */}
          {(bannerTitle ?? bannerDescription) && (
            <div className="relative flex h-full min-h-[220px] flex-col justify-center px-8 py-8">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-kawai-red">
                Piano Owner
              </p>
              {bannerTitle && (
                <h2 className="text-2xl font-bold text-white">{bannerTitle}</h2>
              )}
              {bannerDescription && (
                <p className="mt-1.5 max-w-xs text-sm text-white/75">{bannerDescription}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* HubSpot form */}
      <div className="min-h-[320px] px-8 py-6">
        <div
          className="hs-form-frame"
          data-region="na1"
          data-form-id={formId}
          data-portal-id={portalId}
        />
      </div>
    </Modal>
  )
}
