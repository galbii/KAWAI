'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

/**
 * Fixed overlay button — top-left, visible during hero, fades when sticky nav appears.
 * White pill on dark hero → high contrast and premium feel.
 * Entrance: slides in from left 150ms after mount.
 * Exit: fades + slides out when sticky nav threshold is crossed.
 */
export function BackToDealersButton() {
  const [entered, setEntered] = useState(false)
  const [hidden, setHidden] = useState(false)

  // Entrance animation — slight delay so it doesn't fight page load
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 200)
    return () => clearTimeout(t)
  }, [])

  // Hide when sticky nav becomes visible (same threshold as DealerStickyNav)
  useEffect(() => {
    const onScroll = () => {
      const heroH = Math.min(Math.max(window.innerHeight * 0.6, 460), 640)
      setHidden(window.scrollY > heroH - 100)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const visible = entered && !hidden

  return (
    <div
      aria-hidden={!visible}
      className="fixed z-50 left-4 sm:left-6"
      style={{
        // Sit just below the site header (~64px mobile, ~80px desktop)
        top: 'calc(4rem + 0.875rem)',
        transition: 'opacity 450ms cubic-bezier(0.4, 0, 0.2, 1), transform 450ms cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-1.5rem)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <Link
        href="/find-a-dealer"
        tabIndex={visible ? 0 : -1}
        className="
          group
          flex items-center gap-2.5
          bg-white text-kawai-black
          border border-kawai-black/10
          px-5 py-3 rounded-full
          shadow-[0_4px_24px_rgba(0,0,0,0.22),0_1px_4px_rgba(0,0,0,0.12)]
          hover:bg-kawai-black hover:text-white hover:border-kawai-black
          hover:shadow-[0_6px_32px_rgba(0,0,0,0.35),0_0_0_1px_rgba(0,0,0,0.08)]
          active:scale-[0.97]
          transition-all duration-300 ease-out
          select-none
        "
      >
        {/* Arrow — red, shifts left on hover */}
        <svg
          className="
            w-4 h-4 text-kawai-red flex-shrink-0
            transition-transform duration-300 ease-out
            group-hover:-translate-x-0.5
          "
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>

        {/* Label */}
        <span className="text-[11px] font-semibold tracking-[0.2em] uppercase whitespace-nowrap leading-none">
          All Dealers
        </span>
      </Link>
    </div>
  )
}
