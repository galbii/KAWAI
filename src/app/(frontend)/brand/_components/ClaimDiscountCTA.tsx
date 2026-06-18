'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useLeadFunnel } from '@/components/lead-funnel'

/**
 * A pill CTA — visually identical to BrandCTA — that opens the lead-funnel
 * popup instead of navigating. Must be rendered inside a <LeadFunnelProvider>
 * (the brand page wraps the whole scroll experience in one).
 */

type CTAVariant = 'red' | 'white' | 'outline'

const CTA_VARIANTS: Record<CTAVariant, string> = {
  red: 'bg-kawai-red text-white hover:bg-kawai-red/90 hover:shadow-[0_8px_32px_rgba(225,25,34,0.45)]',
  white: 'bg-white text-kawai-black hover:bg-kawai-pearl hover:shadow-[0_8px_28px_rgba(0,0,0,0.28)]',
  outline:
    'border border-white/60 text-white hover:bg-white hover:text-kawai-black hover:border-transparent',
}

type Props = {
  children: ReactNode
  variant?: CTAVariant
  className?: string
}

export function ClaimDiscountCTA({ children, variant = 'red', className }: Props) {
  const { open } = useLeadFunnel()

  return (
    <button
      type="button"
      onClick={open}
      className={cn(
        'group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-3.5',
        'font-[family-name:var(--font-brand-sans)] text-sm font-semibold uppercase tracking-[0.12em]',
        'transition-all duration-300',
        CTA_VARIANTS[variant],
        className,
      )}
    >
      <span className="relative z-10">{children}</span>
      <svg
        className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full"
      />
    </button>
  )
}
