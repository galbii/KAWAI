'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useModal } from '@/hooks'
import OfferModal from './OfferModal'

/**
 * Shares the dealer-discount modal across the whole /signup scroll so any scene
 * can open it with `useOfferModal().open()` — no prop-threading through the
 * scene tree. Modeled on the project's NavigationContext idiom. Renders a single
 * OfferModal instance for both the cinematic and reduced-motion experiences.
 */

type OfferModalContextValue = {
  open: () => void
  close: () => void
  /**
   * /signup3 is running as a staging variant: the form writes nothing to
   * HubSpot or Shopify. Resolved server-side and threaded through this
   * provider, which already wraps every OfferSignupForm placement — the hero
   * card, the reduced-motion fallback, and the modal.
   */
  testMode: boolean
}

const OfferModalContext = createContext<OfferModalContextValue | null>(null)

export function OfferModalProvider({
  children,
  testMode = false,
}: {
  children: ReactNode
  testMode?: boolean
}) {
  const { isOpen, open, close } = useModal()

  return (
    <OfferModalContext.Provider value={{ open, close, testMode }}>
      {children}
      <OfferModal isOpen={isOpen} onClose={close} />
    </OfferModalContext.Provider>
  )
}

export function useOfferModal(): OfferModalContextValue {
  const ctx = useContext(OfferModalContext)
  if (!ctx) {
    throw new Error('useOfferModal must be used within an OfferModalProvider')
  }
  return ctx
}
