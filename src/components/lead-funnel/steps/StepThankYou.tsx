'use client'

/**
 * Step 3 — Thank you + visit-in-person CTA.
 * Confirms signup and links to the chosen dealer's dynamic page.
 */

import Link from 'next/link'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import type { LeadFunnelConfig, NearestDealer } from '../types'
import type { ThemeTokens } from '../theme'

interface StepThankYouProps {
  theme: ThemeTokens
  config: LeadFunnelConfig['thankYou']
  dealer: NearestDealer
}

const DEFAULT_MESSAGE =
  'Thank you for signing up! {dealer} will contact you shortly. Want to play in person?'

export function StepThankYou({ theme, config, dealer }: StepThankYouProps) {
  const message = (config?.message ?? DEFAULT_MESSAGE).replace('{dealer}', dealer.dealerName)

  return (
    <div className="flex flex-col items-center gap-4 py-2 text-center">
      <CheckCircleIcon className="h-14 w-14" style={{ color: theme.successIcon }} />

      <h2
        className="text-2xl font-semibold tracking-tight"
        style={{ color: theme.heading, fontFamily: 'var(--font-brand-serif)' }}
      >
        {config?.heading ?? "You're all set!"}
      </h2>

      <p className="max-w-sm text-sm leading-relaxed" style={{ color: theme.subheading }}>
        {message}
      </p>

      <Link
        href={`/find-a-dealer/${dealer.slug}`}
        className="mt-1 w-full rounded-md py-3 text-center text-sm font-semibold transition-colors duration-150"
        style={{ background: theme.submitBg, color: theme.submitFg }}
      >
        {config?.ctaText ?? 'Visit in person today'}
      </Link>
    </div>
  )
}
