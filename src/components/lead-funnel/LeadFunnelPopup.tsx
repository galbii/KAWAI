'use client'

/**
 * Lead Funnel — orchestrator.
 *
 * A modular, plug-and-play multi-step lead-capture popup. Renders the modal
 * shell + step state machine:
 *   contact → dealers → thankyou
 *
 * Usage (auto-show only):
 *   <LeadFunnelPopup config={myConfig} />
 *
 * Usage (auto-show + manual CTA triggers):
 *   <LeadFunnelProvider>
 *     <SomeButtonThatCalls useLeadFunnel().open() />
 *     <LeadFunnelPopup config={myConfig} />
 *   </LeadFunnelProvider>
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { trackFormInteraction } from '@/lib/analytics/unified-tracking'
import { THEMES } from './theme'
import type { LeadFunnelConfig, NearestDealer } from './types'
import { useLeadFunnelOptional } from './LeadFunnelProvider'
import { StepContact } from './steps/StepContact'
import { StepDealers } from './steps/StepDealers'
import { StepThankYou } from './steps/StepThankYou'

const DEFAULT_STORAGE_KEY = 'kawai-lead-funnel-shown'

type Step = 'contact' | 'dealers' | 'thankyou'

export function LeadFunnelPopup({ config }: { config: LeadFunnelConfig }) {
  const ctx = useLeadFunnelOptional()

  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<Step>('contact')
  const [email, setEmail] = useState('')
  const [dealer, setDealer] = useState<NearestDealer | null>(null)

  const hasTrackedOpen = useRef(false)
  const prevCtxOpen = useRef(false)

  const theme = THEMES[config.theme ?? 'light']
  const size = config.size ?? 'md'
  const behavior = config.behavior ?? {}
  const showOncePerSession = behavior.showOncePerSession !== false
  const storageKey = behavior.storageKey?.trim() || DEFAULT_STORAGE_KEY
  const customTags = (config.tags ?? []).join(',')

  const resetSteps = useCallback(() => {
    setStep('contact')
    setEmail('')
    setDealer(null)
  }, [])

  // ─── Auto-show (timer + scroll), once per session ──────────────────────────
  const autoOpen = useCallback(() => {
    if (showOncePerSession && localStorage.getItem(storageKey)) return
    if (showOncePerSession) localStorage.setItem(storageKey, '1')
    resetSteps()
    setIsOpen(true)
  }, [showOncePerSession, storageKey, resetSteps])

  useEffect(() => {
    if (behavior.autoShow === false) return

    const delay = behavior.autoShowDelay ?? 5000
    const timer = setTimeout(autoOpen, delay)

    let onScroll: (() => void) | null = null
    if (behavior.triggerOnScroll !== false) {
      onScroll = () => {
        const total = document.documentElement.scrollHeight - window.innerHeight
        if (total > 0 && window.scrollY / total >= 0.3) autoOpen()
      }
      window.addEventListener('scroll', onScroll, { passive: true })
    }

    return () => {
      clearTimeout(timer)
      if (onScroll) window.removeEventListener('scroll', onScroll)
    }
  }, [autoOpen, behavior.autoShow, behavior.autoShowDelay, behavior.triggerOnScroll])

  // ─── Manual open via context (bypasses the session guard) ──────────────────
  useEffect(() => {
    const open = ctx?.isOpen ?? false
    if (open && !prevCtxOpen.current) {
      resetSteps()
      setIsOpen(true)
    }
    prevCtxOpen.current = open
  }, [ctx?.isOpen, resetSteps])

  // ─── Track first open ──────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen && !hasTrackedOpen.current) {
      hasTrackedOpen.current = true
      trackFormInteraction({
        blockType: 'lead-funnel',
        blockData: { tracking: { enabled: true, category: 'lead' } },
        action: 'form_start',
        formName: 'Lead Funnel',
      })
    }
  }, [isOpen])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    if (showOncePerSession) localStorage.setItem(storageKey, '1')
    ctx?.close()
  }, [showOncePerSession, storageKey, ctx])

  const handleContactSuccess = useCallback((capturedEmail: string) => {
    setEmail(capturedEmail)
    setStep('dealers')
    trackFormInteraction({
      blockType: 'lead-funnel',
      blockData: { tracking: { enabled: true, category: 'lead' } },
      action: 'form_submit',
      formName: 'Lead Funnel',
    })
  }, [])

  const handleDealerSelected = useCallback((selected: NearestDealer) => {
    setDealer(selected)
    setStep('thankyou')
  }, [])

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size={size} layout="centered" showCloseButton>
      {/* Accent bar */}
      <div
        className="absolute left-0 right-0 top-0 h-1 rounded-t-lg"
        style={{ background: theme.accentBar }}
      />

      <div className="rounded-lg px-6 py-8" style={{ background: theme.bg }}>
        {step === 'contact' && (
          <StepContact
            theme={theme}
            config={config.offer}
            customTags={customTags}
            onSuccess={handleContactSuccess}
          />
        )}

        {step === 'dealers' && (
          <StepDealers
            theme={theme}
            config={config.dealers}
            email={email}
            onSelected={handleDealerSelected}
          />
        )}

        {step === 'thankyou' && dealer && (
          <StepThankYou theme={theme} config={config.thankYou} dealer={dealer} />
        )}
      </div>
    </Modal>
  )
}
