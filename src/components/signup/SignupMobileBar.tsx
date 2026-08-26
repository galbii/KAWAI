'use client'

import { useEffect, useState } from 'react'
import { useSignupForm } from './SignupFormProvider'

/**
 * Sticky bottom CTA, mobile only.
 *
 * On mobile there is no rail at all — the page collapses to content-then-form,
 * so this bar is the whole mobile conversion path. It opens the form in a popup
 * rather than jumping to the anchor: the form sits below every content block,
 * and scrolling someone past the whole page to reach it loses them.
 *
 * It still hides once the inline form is on screen, so it never covers the
 * fields it points at and never offers a popup for a form already in view.
 */
export function SignupMobileBar({ label }: { label: string }) {
  const { openForm } = useSignupForm()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const target = document.getElementById('signup-form')
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry?.isIntersecting),
      { rootMargin: '-80px 0px 0px 0px' },
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-kawai-neutral bg-white/95 p-3 backdrop-blur transition-transform lg:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      // Off-screen it must also be out of the tab order, or keyboard users hit
      // an invisible button under the page.
      aria-hidden={!visible}
    >
      <button
        type="button"
        onClick={openForm}
        tabIndex={visible ? 0 : -1}
        className="block w-full rounded bg-kawai-red px-4 py-3 text-center font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red"
      >
        {label}
      </button>
    </div>
  )
}
