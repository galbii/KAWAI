'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { useLeadCampaign } from './LeadCampaignContext'

/**
 * The button vocabulary a Back-to-School-register campaign page uses.
 *
 * Square, condensed caps, no pill and no shine — the main site's rounded brand
 * pill reads as a different page's furniture next to poster type. Both shapes
 * are deliberately the SAME size: a text link beside a filled button reads as an
 * afterthought, and on these pages the secondary action usually carries real
 * weight (a ledger, a dealer locator).
 */

const BASE =
  'inline-flex items-center justify-center gap-3 px-9 py-5 text-sm tracking-[0.18em] uppercase font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2'

const ARROW = (
  <svg
    className="h-4 w-4 transition-transform group-hover:translate-x-1"
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
export type Tone = 'light' | 'dark'

const OUTLINE: Record<Tone, string> = {
  dark: 'border-kawai-pearl/45 text-kawai-pearl hover:bg-kawai-pearl hover:text-kawai-black focus-visible:outline-kawai-pearl',
  light:
    'border-kawai-black/30 text-kawai-black hover:bg-kawai-black hover:text-kawai-pearl focus-visible:outline-kawai-black',
}

/** The conversion action — opens the campaign's lead modal. */
export function LeadButton({
  tone = 'light',
  children,
}: {
  tone?: Tone
  children?: ReactNode
}) {
  const { open, config } = useLeadCampaign()
  return (
    <button
      type="button"
      onClick={open}
      className={`group ${BASE} bg-kawai-red text-white hover:bg-kawai-red-600 ${
        tone === 'dark' ? 'focus-visible:outline-kawai-pearl' : 'focus-visible:outline-kawai-black'
      }`}
    >
      {children ?? config.copy.openLabel}
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
 * Same shape as {@link CampaignLink} for an in-page anchor. A plain `<a>` rather
 * than a Link or a scripted scroll so it still works before hydration — pair it
 * with `scroll-mt` on the target so the fixed header does not cover the heading.
 */
export function CampaignAnchor({
  href,
  tone = 'light',
  children,
}: {
  href: string
  tone?: Tone
  children: ReactNode
}) {
  return (
    <a href={href} className={`${BASE} border ${OUTLINE[tone]}`}>
      {children}
    </a>
  )
}
