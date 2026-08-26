'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { Modal } from '@/components/ui/modal'
import { useModal } from '@/hooks/useModal'
import { SignupForm, type SignupSuccess } from './SignupForm'
import { SignupSuccessMessage } from './SignupSuccessMessage'
import type { SignupCoreConfig, SignupQuestion } from '@/lib/signup/types'

export interface SignupFormConfig {
  campaignSlug: string
  storeslug: string
  core: SignupCoreConfig
  questions: SignupQuestion[]
  submitLabel: string
  finePrint?: string | null | undefined
  /** Card header and modal heading. */
  title: string
}

interface SignupFormContext {
  /** Optionally seeded with values already entered elsewhere on the page. */
  openForm: (values?: Record<string, unknown>) => void
  /** Success message once submitted, from either the rail or the modal. */
  done: string | null
  onSuccess: (result: SignupSuccess) => void
  config: SignupFormConfig
}

const Ctx = createContext<SignupFormContext | null>(null)

export function useSignupForm(): SignupFormContext {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useSignupForm must be used inside <SignupFormProvider>')
  return ctx
}

const DEFAULT_SUCCESS = "Thanks — you're all set. Check your email for a confirmation."

/**
 * Owns the one signup form modal and the one "submitted" flag for the page.
 *
 * The rail and the sticky mobile bar sit in different branches of the tree, and
 * both need to open the same popup — so the state cannot live in either of
 * them. Sharing `done` here matters just as much: a visitor who submits in the
 * popup must not scroll down to find the inline form still sitting there empty,
 * inviting them to enter everything a second time.
 */
export function SignupFormProvider({
  config,
  children,
}: {
  config: SignupFormConfig
  children: ReactNode
}) {
  const { isOpen, open, close } = useModal()
  const [done, setDone] = useState<string | null>(null)
  const [prefill, setPrefill] = useState<Record<string, unknown> | undefined>(undefined)
  // Bumped on every open so the popup's form remounts and actually picks up the
  // latest prefill — react-hook-form reads defaultValues once, at mount.
  const [openSeq, setOpenSeq] = useState(0)

  const openForm = (values?: Record<string, unknown>) => {
    setPrefill(values)
    setOpenSeq((n) => n + 1)
    open()
  }

  const onSuccess = (result: SignupSuccess) => {
    if (result.mode === 'redirect' && result.redirectUrl) {
      window.location.assign(result.redirectUrl)
      return
    }
    close()
    setDone(result.message ?? DEFAULT_SUCCESS)
  }

  return (
    <Ctx.Provider value={{ openForm, done, onSuccess, config }}>
      {children}
      <Modal isOpen={isOpen} onClose={close} size="lg">
        <div className="max-h-[80vh] overflow-y-auto p-1">
          {/* h2, not h1 — SignupHero owns the page's only h1. */}
          <h2 className="mb-4 text-xl font-bold text-kawai-black">{config.title}</h2>
          {done ? (
            <SignupSuccessMessage message={done} />
          ) : (
            <SignupForm
              key={openSeq}
              defaultValues={prefill}
              campaignSlug={config.campaignSlug}
              storeslug={config.storeslug}
              core={config.core}
              questions={config.questions}
              submitLabel={config.submitLabel}
              finePrint={config.finePrint}
              inlineOnly={false}
              animateIn
              onSuccess={onSuccess}
            />
          )}
        </div>
      </Modal>
    </Ctx.Provider>
  )
}
