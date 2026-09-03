'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { useOfferModal } from './OfferModalContext'
import { offerCopy, heroPoster } from './campaign'

/**
 * The page's buttons.
 *
 * Square, condensed caps, no pill and no shine — the /signup2 brand pill reads
 * as a different page's furniture next to poster type. Both shapes here are the
 * same size on purpose: a text link beside a filled button reads as an
 * afterthought, and on this page the second action (the rebate ledger) carries
 * most of the argument.
 */

const BASE =
  'inline-flex items-center justify-center gap-3 px-9 py-5 text-sm tracking-[0.18em] uppercase font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2'

const ARROW = (
  <svg
    className="w-4 h-4 transition-transform group-hover:translate-x-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.75}
    aria-hidden
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
)

/** Tone is the ground the button sits on, not the button's own colour. */
type Tone = 'light' | 'dark'

const OUTLINE: Record<Tone, string> = {
  dark: 'border-kawai-pearl/45 text-kawai-pearl hover:bg-kawai-pearl hover:text-kawai-black focus-visible:outline-kawai-pearl',
  light:
    'border-kawai-black/30 text-kawai-black hover:bg-kawai-black hover:text-kawai-pearl focus-visible:outline-kawai-black',
}

/** The one conversion action on the page — opens the shared offer popup. */
export function SignUpButton({
  tone = 'light',
  children = offerCopy.signUp,
}: {
  tone?: Tone
  children?: ReactNode
}) {
  const offer = useOfferModal()
  return (
    <button
      type="button"
      onClick={offer.open}
      className={`group ${BASE} bg-kawai-red hover:bg-kawai-red-600 text-white ${
        tone === 'dark' ? 'focus-visible:outline-kawai-pearl' : 'focus-visible:outline-kawai-black'
      }`}
    >
      {children}
      {ARROW}
    </button>
  )
}

/** Matched secondary — same size and shape, outlined instead of filled. */
export function CampaignLink({
  href,
  tone = 'light',
  children,
}: {
  href: string
  tone?: Tone
  children: ReactNode
}) {
  return (
    <Link href={href} className={`${BASE} border ${OUTLINE[tone]}`}>
      {children}
    </Link>
  )
}

/**
 * The hero's pair: sign up, or go read the ledger. "View Rebates" is a plain
 * anchor rather than a scripted scroll so it still works before hydration —
 * `scroll-mt` on the ledger section keeps the fixed header off the heading.
 */
export function HeroCtas({ tone = 'light' }: { tone?: Tone }) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
      <SignUpButton tone={tone}>{heroPoster.signUpCta}</SignUpButton>
      <a href="#rebates" className={`${BASE} border ${OUTLINE[tone]}`}>
        {heroPoster.viewRebatesCta}
      </a>
    </div>
  )
}
