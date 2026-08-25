'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { useModal } from '@/hooks/useModal'
import { SignupForm, RAIL_QUESTION_LIMIT, type SignupSuccess } from './SignupForm'
import type { SignupCoreConfig, SignupQuestion } from '@/lib/signup/types'

interface Props {
  campaignSlug: string
  storeslug: string
  title: string
  subtitle?: string | null | undefined
  submitLabel: string
  finePrint?: string | null | undefined
  core: SignupCoreConfig
  questions: SignupQuestion[]
}

const DEFAULT_SUCCESS = "Thanks — you're all set. Check your email for a confirmation."

export function SignupRail(props: Props) {
  const { isOpen, open, close } = useModal()
  const [done, setDone] = useState<string | null>(null)

  const overflow = props.questions.length > RAIL_QUESTION_LIMIT

  const onSuccess = (result: SignupSuccess) => {
    if (result.mode === 'redirect' && result.redirectUrl) {
      window.location.assign(result.redirectUrl)
      return
    }
    close()
    setDone(result.message ?? DEFAULT_SUCCESS)
  }

  const formProps = {
    campaignSlug: props.campaignSlug,
    storeslug: props.storeslug,
    core: props.core,
    questions: props.questions,
    submitLabel: props.submitLabel,
    finePrint: props.finePrint,
  }

  return (
    <aside id="signup-form" className="mt-8 lg:sticky lg:top-6 lg:mt-0">
      <div className="overflow-hidden rounded-lg border border-kawai-neutral bg-white shadow-lg">
        <div className="bg-kawai-black px-4 py-3">
          <p className="text-base font-bold text-kawai-pearl">{props.title}</p>
          {props.subtitle ? (
            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-kawai-gold">
              {props.subtitle}
            </p>
          ) : null}
        </div>
        <div className="px-4 py-4">
          {done ? (
            <p role="status" className="py-6 text-center text-sm text-kawai-black">
              {done}
            </p>
          ) : (
            <SignupForm {...formProps} inlineOnly={overflow} onOverflow={open} onSuccess={onSuccess} />
          )}
        </div>
      </div>

      {overflow ? (
        <Modal isOpen={isOpen} onClose={close}>
          <div className="max-h-[80vh] overflow-y-auto p-5">
            <h2 className="mb-4 text-xl font-bold text-kawai-black">{props.title}</h2>
            <SignupForm {...formProps} inlineOnly={false} onSuccess={onSuccess} />
          </div>
        </Modal>
      ) : null}
    </aside>
  )
}
