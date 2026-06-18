'use client'

/**
 * Lead Funnel — context for manual triggering.
 *
 * Wrap a page (or subtree) in <LeadFunnelProvider> and place a single
 * <LeadFunnelPopup config={...} /> inside it. Any descendant can then call
 * useLeadFunnel().open() — e.g. from a CTA button or <LeadFunnelTrigger> — to
 * open the popup manually. Manual opens bypass the once-per-session guard.
 *
 * The provider is optional: <LeadFunnelPopup> works standalone for pure
 * auto-show usage. It only needs the provider when you want manual triggers.
 */

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

interface LeadFunnelContextValue {
  /** True when the popup is currently open. */
  isOpen: boolean
  /** Open the popup manually (bypasses the once-per-session guard). */
  open: () => void
  /** Close the popup. */
  close: () => void
}

const LeadFunnelContext = createContext<LeadFunnelContextValue | null>(null)

export function LeadFunnelProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  // Bumped on every manual open so the popup can distinguish manual opens
  // (which ignore the session guard) from auto-shows.
  const manualOpenCount = useRef(0)

  const open = useCallback(() => {
    manualOpenCount.current += 1
    setIsOpen(true)
  }, [])

  const close = useCallback(() => setIsOpen(false), [])

  const value = useMemo<LeadFunnelContextValue>(
    () => ({ isOpen, open, close }),
    [isOpen, open, close],
  )

  return <LeadFunnelContext.Provider value={value}>{children}</LeadFunnelContext.Provider>
}

/**
 * Access the funnel controls. Returns null when used outside a provider so
 * <LeadFunnelPopup> can run in standalone (auto-show only) mode.
 */
export function useLeadFunnelOptional(): LeadFunnelContextValue | null {
  return useContext(LeadFunnelContext)
}

/**
 * Access the funnel controls. Throws if used outside a <LeadFunnelProvider> —
 * use this in CTA buttons that must open the popup.
 */
export function useLeadFunnel(): LeadFunnelContextValue {
  const ctx = useContext(LeadFunnelContext)
  if (!ctx) {
    throw new Error('useLeadFunnel must be used within a <LeadFunnelProvider>')
  }
  return ctx
}
