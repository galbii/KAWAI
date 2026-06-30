import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Brand vocabulary primitives ported from ProductHeroCarouselRenderer so the
 * About page reads with the same hero-grade UI as the rest of the site.
 *
 *   BrandEyebrow  — red 5px hairline + tracked uppercase sans
 *   BrandCTA      — pill button with arrow + hover shine, three color variants
 *   BrandArrowLink — text link with arrow nudge, used inline in body copy
 */

type BrandEyebrowProps = {
  children: ReactNode
  /** Center-align the eyebrow (rule on both sides). Defaults to left-anchored (rule on the left). */
  centered?: boolean
  className?: string
}

export function BrandEyebrow({ children, centered = false, className }: BrandEyebrowProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2.5 font-[family-name:var(--font-brand-sans)] text-xs font-semibold uppercase tracking-[0.28em] text-white/65',
        className,
      )}
    >
      <span aria-hidden className="block h-px w-5 flex-shrink-0 bg-kawai-red" />
      {children}
      {centered && <span aria-hidden className="block h-px w-5 flex-shrink-0 bg-kawai-red" />}
    </span>
  )
}

type CTAVariant = 'red' | 'white' | 'outline' | 'dark-outline'

const CTA_VARIANTS: Record<CTAVariant, string> = {
  red: 'bg-kawai-red text-white hover:bg-kawai-red/90 hover:shadow-[0_8px_32px_rgba(225,25,34,0.45)]',
  white:
    'bg-white text-kawai-black hover:bg-kawai-pearl hover:shadow-[0_8px_28px_rgba(0,0,0,0.28)]',
  outline:
    'border border-white/60 text-white hover:bg-white hover:text-kawai-black hover:border-transparent',
  // Outline for use on light backgrounds (e.g. the reduced-motion fallback's pearl sections).
  'dark-outline':
    'border border-kawai-black/30 text-kawai-black hover:bg-kawai-black hover:text-white hover:border-transparent',
}

/** Shared pill shell so the link and button variants render identically. */
const brandCtaBase = cn(
  'group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-7 py-3.5',
  'font-[family-name:var(--font-brand-sans)] text-sm font-semibold uppercase tracking-[0.12em]',
  'transition-all duration-300',
)

/** Inner contents shared by BrandCTA (link) and BrandCTAButton. */
function CTAContent({ children, showArrow }: { children: ReactNode; showArrow: boolean }) {
  return (
    <>
      <span className="relative z-10">{children}</span>
      {showArrow && (
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
      )}
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full"
      />
    </>
  )
}

type BrandCTAProps = {
  href: string
  children: ReactNode
  variant?: CTAVariant
  className?: string
  /** Whether to render the arrow icon. Defaults to true. */
  showArrow?: boolean
}

export function BrandCTA({
  href,
  children,
  variant = 'red',
  className,
  showArrow = true,
}: BrandCTAProps) {
  return (
    <Link href={href} className={cn(brandCtaBase, CTA_VARIANTS[variant], className)}>
      <CTAContent showArrow={showArrow}>{children}</CTAContent>
    </Link>
  )
}

type BrandCTAButtonProps = {
  onClick: () => void
  children: ReactNode
  variant?: CTAVariant
  className?: string
  /** Whether to render the arrow icon. Defaults to true. */
  showArrow?: boolean
  type?: 'button' | 'submit'
  disabled?: boolean
}

/**
 * Button twin of {@link BrandCTA} — identical brand styling, but triggers an
 * action (e.g. opening the offer modal) instead of navigating.
 */
export function BrandCTAButton({
  onClick,
  children,
  variant = 'red',
  className,
  showArrow = true,
  type = 'button',
  disabled = false,
}: BrandCTAButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(brandCtaBase, CTA_VARIANTS[variant], 'disabled:opacity-60', className)}
    >
      <CTAContent showArrow={showArrow}>{children}</CTAContent>
    </button>
  )
}

type BrandArrowLinkProps = {
  href: string
  children: ReactNode
  /** 'light' for dark backgrounds (white→red), 'muted' for secondary links, 'red' for light backgrounds. */
  tone?: 'light' | 'muted' | 'red'
  className?: string
}

export function BrandArrowLink({
  href,
  children,
  tone = 'light',
  className,
}: BrandArrowLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center gap-2 font-[family-name:var(--font-brand-sans)] text-sm font-semibold uppercase tracking-[0.12em] transition-colors duration-200',
        tone === 'light' && 'text-white hover:text-kawai-red',
        tone === 'muted' && 'text-white/55 hover:text-white',
        tone === 'red' && 'text-kawai-red hover:text-kawai-red/75',
        className,
      )}
    >
      <span>{children}</span>
      <svg
        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </Link>
  )
}
