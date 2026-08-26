'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Modal } from '@/components/ui/modal'
import { SignupForm, type SignupSuccess } from './SignupForm'
import type { SignupCoreConfig, SignupQuestion } from '@/lib/signup/types'

export type PromoFrequency = 'session' | 'once' | 'always'

interface Props {
  campaignSlug: string
  storeslug: string
  heading: string
  body?: string | null | undefined
  delaySeconds: number
  frequency: PromoFrequency
  core: SignupCoreConfig
  questions: SignupQuestion[]
  submitLabel: string
  finePrint?: string | null | undefined
  /** Link to the full landing page, for people who want the detail first. */
  campaignHref: string
}

const DEFAULT_SUCCESS = "Thanks — you're all set. Check your email for a confirmation."

function storageFor(frequency: PromoFrequency): Storage | null {
  if (typeof window === 'undefined') return null
  if (frequency === 'session') return window.sessionStorage
  if (frequency === 'once') return window.localStorage
  return null
}

/**
 * Campaign popup for the music school page.
 *
 * Deliberately mounts closed and opens on a timer rather than on load: an
 * interstitial that covers the page before the visitor has read anything is
 * the pattern people reflexively dismiss, and Google penalises it on mobile.
 *
 * The seen-flag is written when the popup opens, not when it is dismissed —
 * otherwise a visitor who navigates away with it still open gets it again on
 * the next page, which reads as the popup ignoring them.
 */
export function SignupPromoModal({
  campaignSlug,
  storeslug,
  heading,
  body,
  delaySeconds,
  frequency,
  core,
  questions,
  submitLabel,
  finePrint,
  campaignHref,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [done, setDone] = useState<string | null>(null)

  useEffect(() => {
    const key = `kawai-signup-promo-${campaignSlug}`
    const store = storageFor(frequency)

    try {
      if (store?.getItem(key)) return
    } catch {
      // Safari in private mode throws on storage access. Showing the popup is
      // the better failure than suppressing the campaign entirely.
    }

    const timer = window.setTimeout(
      () => {
        setIsOpen(true)
        try {
          store?.setItem(key, '1')
        } catch {
          /* see above */
        }
      },
      Math.max(0, delaySeconds) * 1000,
    )

    return () => window.clearTimeout(timer)
  }, [campaignSlug, delaySeconds, frequency])

  const onSuccess = (result: SignupSuccess) => {
    if (result.mode === 'redirect' && result.redirectUrl) {
      window.location.assign(result.redirectUrl)
      return
    }
    setDone(result.message ?? DEFAULT_SUCCESS)
  }

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="lg">
      <div className="max-h-[85vh] overflow-y-auto">
        <div className="bg-kawai-black px-6 py-5">
          <h2 className="pr-8 text-2xl font-extrabold leading-tight tracking-tight text-kawai-pearl">
            {heading}
          </h2>
          {body ? (
            <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-kawai-pearl/85">{body}</p>
          ) : null}
        </div>

        <div className="px-6 py-5">
          {done ? (
            <p role="status" className="py-8 text-center text-sm text-kawai-black">
              {done}
            </p>
          ) : (
            <>
              <SignupForm
                campaignSlug={campaignSlug}
                storeslug={storeslug}
                core={core}
                questions={questions}
                submitLabel={submitLabel}
                finePrint={finePrint}
                inlineOnly={false}
                onSuccess={onSuccess}
              />
              <p className="mt-4 text-center text-xs text-kawai-charcoal">
                <Link href={campaignHref} className="underline hover:text-kawai-red">
                  See the full details
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}
