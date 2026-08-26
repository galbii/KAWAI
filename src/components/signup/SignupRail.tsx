'use client'

import { SignupForm, RAIL_QUESTION_LIMIT } from './SignupForm'
import { useSignupForm } from './SignupFormProvider'

/**
 * Sticky sidebar card holding the inline form.
 *
 * Modal state and the submitted flag come from SignupFormProvider rather than
 * living here, because the sticky mobile bar opens the same popup and must see
 * the same result.
 */
export function SignupRail({ subtitle }: { subtitle?: string | null | undefined }) {
  const { openForm, done, onSuccess, config } = useSignupForm()

  const overflow = config.questions.length > RAIL_QUESTION_LIMIT

  return (
    <aside id="signup-form" className="mt-8 lg:sticky lg:top-6 lg:mt-0">
      <div className="overflow-hidden rounded-xl border border-kawai-neutral bg-white shadow-[0_1px_2px_rgba(30,27,22,0.04),0_10px_28px_-14px_rgba(30,27,22,0.18)]">
        <div className="bg-kawai-black px-4 py-3">
          <p className="text-base font-bold text-kawai-pearl">{config.title}</p>
          {subtitle ? (
            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-kawai-gold">
              {subtitle}
            </p>
          ) : null}
        </div>
        <div className="px-4 py-4">
          {done ? (
            <p role="status" className="py-6 text-center text-sm text-kawai-black">
              {done}
            </p>
          ) : (
            <SignupForm
              campaignSlug={config.campaignSlug}
              storeslug={config.storeslug}
              core={config.core}
              questions={config.questions}
              submitLabel={config.submitLabel}
              finePrint={config.finePrint}
              inlineOnly={overflow}
              onOverflow={openForm}
              onSuccess={onSuccess}
            />
          )}
        </div>
      </div>
    </aside>
  )
}
