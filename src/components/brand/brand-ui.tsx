import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Brand vocabulary primitives shared across the cinematic /about page and the
 * company / heritage / recognition pages it links to. Lifted out of
 * about/_components so every page reads with the same hero-grade UI.
 *
 *   BrandEyebrow   — hairline rule + tracked uppercase sans (tone per background)
 *   BrandCTA       — pill button with arrow + hover shine, four color variants
 *   BrandArrowLink — text link with arrow nudge, used inline in body copy
 */

type EyebrowTone = 'light' | 'gold' | 'red' | 'gold-on-light'

type BrandEyebrowProps = {
  children: ReactNode
  /**
   * Color treatment, chosen by the background it sits on:
   *   light        — white text + red hairline (dark backgrounds, About hero default)
   *   gold         — gold text + gold hairline (dark backgrounds)
   *   red          — red text + red hairline (light / pearl backgrounds)
   *   gold-on-light— deep gold text + hairline (light / pearl backgrounds)
   */
  tone?: EyebrowTone
  /** Center-align the eyebrow (rule on both sides). Defaults to left-anchored. */
  centered?: boolean
  className?: string
}

const EYEBROW_TONES: Record<EyebrowTone, { text: string; rule: string }> = {
  light: { text: 'text-white/65', rule: 'bg-kawai-red' },
  gold: { text: 'text-kawai-gold', rule: 'bg-kawai-gold' },
  red: { text: 'text-kawai-red', rule: 'bg-kawai-red' },
  'gold-on-light': { text: 'text-kawai-gold-on-light', rule: 'bg-kawai-gold-on-light' },
}

export function BrandEyebrow({
  children,
  tone = 'light',
  centered = false,
  className,
}: BrandEyebrowProps) {
  const t = EYEBROW_TONES[tone]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2.5 font-[family-name:var(--font-brand-sans)] text-xs font-semibold uppercase tracking-[0.28em]',
        t.text,
        className,
      )}
    >
      <span aria-hidden className={cn('block h-px w-5 flex-shrink-0', t.rule)} />
      {children}
      {centered && <span aria-hidden className={cn('block h-px w-5 flex-shrink-0', t.rule)} />}
    </span>
  )
}

type CTAVariant = 'red' | 'white' | 'outline' | 'dark-outline'

type BrandCTAProps = {
  href: string
  children: ReactNode
  variant?: CTAVariant
  className?: string
  /** Whether to render the arrow icon. Defaults to true. */
  showArrow?: boolean
}

const CTA_VARIANTS: Record<CTAVariant, string> = {
  red: 'bg-kawai-red text-white hover:bg-kawai-red/90 hover:shadow-[0_8px_32px_rgba(225,25,34,0.45)]',
  white: 'bg-white text-kawai-black hover:bg-kawai-pearl hover:shadow-[0_8px_28px_rgba(0,0,0,0.28)]',
  outline:
    'border border-white/60 text-white hover:bg-white hover:text-kawai-black hover:border-transparent',
  // Outline for use on light backgrounds (e.g. pearl sections).
  'dark-outline':
    'border border-kawai-black/30 text-kawai-black hover:bg-kawai-black hover:text-white hover:border-transparent',
}

/** Internal links keep next/link; tel:/mailto:/http(s) fall back to a plain anchor. */
function isExternalHref(href: string) {
  return /^(https?:|tel:|mailto:)/.test(href)
}

export function BrandCTA({
  href,
  children,
  variant = 'red',
  className,
  showArrow = true,
}: BrandCTAProps) {
  const classes = cn(
    'group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-3.5',
    'font-[family-name:var(--font-brand-sans)] text-sm font-semibold uppercase tracking-[0.12em]',
    'transition-all duration-300',
    CTA_VARIANTS[variant],
    className,
  )

  const inner = (
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

  if (isExternalHref(href)) {
    return (
      <a href={href} className={classes}>
        {inner}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  )
}

type BrandArrowLinkProps = {
  href: string
  children: ReactNode
  /** 'light' for dark backgrounds (white→red), 'muted' for secondary links, 'red' for light backgrounds. */
  tone?: 'light' | 'muted' | 'red'
  className?: string
}

export function BrandArrowLink({ href, children, tone = 'light', className }: BrandArrowLinkProps) {
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
