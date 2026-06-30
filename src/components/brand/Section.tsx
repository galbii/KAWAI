import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Reveal } from './Reveal'
import { BrandEyebrow } from './brand-ui'

type SectionTone = 'black' | 'pearl' | 'white'

type SectionProps = {
  children: ReactNode
  /** Background treatment. Alternate black ↔ pearl/white down the page. */
  tone?: SectionTone
  eyebrow?: string
  /** Serif section heading. */
  title?: ReactNode
  /** Lead paragraph under the heading. */
  intro?: ReactNode
  center?: boolean
  id?: string
  /** Max width of the inner column. Default 'max-w-4xl'. */
  maxWidth?: string
  /** Vertical padding. Default 'py-20 md:py-28'. */
  padding?: string
  className?: string
}

const TONE_STYLES: Record<SectionTone, { bg: string; heading: string; intro: string; eyebrow: 'gold' | 'red' }> = {
  black: { bg: 'bg-kawai-black text-white', heading: 'text-white', intro: 'text-white/72', eyebrow: 'gold' },
  pearl: { bg: 'bg-kawai-pearl text-kawai-black', heading: 'text-kawai-black', intro: 'text-kawai-charcoal', eyebrow: 'red' },
  white: { bg: 'bg-white text-kawai-black', heading: 'text-kawai-black', intro: 'text-kawai-charcoal', eyebrow: 'red' },
}

/**
 * Standard brand content section: tone-aware background, eyebrow hairline,
 * serif heading, lead paragraph — all revealed on scroll. The body is passed
 * as children. Use this to keep the dark↔pearl rhythm consistent across pages.
 */
export function Section({
  children,
  tone = 'pearl',
  eyebrow,
  title,
  intro,
  center = false,
  id,
  maxWidth = 'max-w-4xl',
  padding = 'py-20 md:py-28',
  className,
}: SectionProps) {
  const t = TONE_STYLES[tone]
  const hasHeader = Boolean(eyebrow || title || intro)

  return (
    <section id={id || undefined} className={cn(t.bg, padding, className)}>
      <div className={cn('container mx-auto px-6')}>
        <div className={cn('mx-auto', maxWidth, center && 'text-center')}>
          {hasHeader && (
            <Reveal className={cn('mb-9 md:mb-12', center && 'flex flex-col items-center')}>
              {eyebrow && (
                <div className="mb-4">
                  <BrandEyebrow tone={t.eyebrow} centered={center}>
                    {eyebrow}
                  </BrandEyebrow>
                </div>
              )}
              {title && (
                <h2
                  className={cn(
                    'font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,4.5vw,3.25rem)] font-light leading-[1.06] tracking-tight',
                    t.heading,
                  )}
                >
                  {title}
                </h2>
              )}
              {intro && (
                <p
                  className={cn(
                    'mt-5 max-w-2xl font-[family-name:var(--font-brand-sans)] text-base leading-relaxed sm:text-lg',
                    t.intro,
                    center && 'mx-auto',
                  )}
                >
                  {intro}
                </p>
              )}
            </Reveal>
          )}
          {children}
        </div>
      </div>
    </section>
  )
}
