'use client'

import { useEffect, useState } from 'react'

/**
 * Sticky bottom CTA, mobile only.
 *
 * On mobile there is no rail at all — the page collapses to content-then-form,
 * so this bar is the whole mobile conversion path. It hides once the form is on
 * screen so it never covers the fields it points at.
 */
export function SignupMobileBar({ label }: { label: string }) {
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
    >
      <a
        href="#signup-form"
        className="block rounded bg-kawai-red px-4 py-3 text-center font-bold text-white"
      >
        {label}
      </a>
    </div>
  )
}
