import Image from 'next/image'
import type { ReactNode } from 'react'
import { Reveal } from './Choreography'

interface SectionHeadProps {
  /** Small red-dash label above the heading. Omit where the title stands alone. */
  eyebrow?: string
  /** The display line. Plain text — it is set in condensed caps at poster size. */
  title: string
  /**
   * Set the Kawai wordmark on the same line as the title, sized to its cap
   * height. For headings that name a place rather than a thing — the showroom
   * signs itself the way the header does. The title must not repeat "Kawai".
   */
  logo?: boolean
  /** Bold line straight under the title — a price claim, not an aside. */
  subhead?: string
  /** The one italic serif line per section: the human aside under the shout. */
  aside?: string
  /** Right-hand data line — counts, deadlines. Optional by design. */
  meta?: ReactNode
  tone?: 'light' | 'dark'
  /** Set when a section already has its own <h2> and this is decorative. */
  as?: 'h2' | 'div'
  className?: string
}

/**
 * The heading every section on this page wears.
 *
 * The order is the argument: the label names the subject, the display line
 * shouts it, the serif line says the human half quietly, and the rule under it
 * closes the header off — drawn left to right as the section arrives, which is
 * the page's one repeated gesture.
 */
export function SectionHead({
  eyebrow,
  title,
  logo = false,
  subhead,
  aside,
  meta,
  tone = 'light',
  as = 'h2',
  className = '',
}: SectionHeadProps) {
  const dark = tone === 'dark'
  const Heading = as

  return (
    <header className={`relative ${className}`}>
      {eyebrow && (
        <div className="flex items-center gap-3.5 mb-6">
          <Reveal
            as="span"
            variant="ruleX"
            className={`w-10 h-px ${dark ? 'bg-kawai-red-400' : 'bg-kawai-red'}`}
            aria-hidden
          />
          <Reveal
            as="span"
            delay={0.08}
            className={`bts-eyebrow ${dark ? 'text-kawai-red-400' : 'text-kawai-red'}`}
          >
            {eyebrow}
          </Reveal>
        </div>
      )}

      <Heading className={`bts-display bts-h2 ${dark ? 'text-kawai-pearl' : 'text-kawai-black'}`}>
        <Reveal
          as="span"
          variant="line"
          className={logo ? 'flex flex-wrap items-center gap-x-5 gap-y-1' : 'block'}
        >
          {logo && (
            <Image
              src="/images/logos/kawai-logo-new-red.png"
              alt="Kawai"
              width={1030}
              height={207}
              // em, so the wordmark tracks the heading's clamped size and keeps
              // sitting on the caps rather than floating above or under them.
              className={`h-[0.66em] w-auto ${dark ? 'brightness-0 invert' : ''}`}
            />
          )}
          {title}
        </Reveal>
      </Heading>

      {subhead && (
        <Reveal
          as="p"
          delay={0.14}
          className={`bts-eyebrow mt-5 ${dark ? 'text-kawai-red-400' : 'text-kawai-red'}`}
          style={{ fontSize: 'clamp(0.95rem, 1.7vw, 1.35rem)', letterSpacing: '0.16em' }}
        >
          {subhead}
        </Reveal>
      )}

      {aside && (
        <Reveal
          as="p"
          delay={0.16}
          className={`bts-serif mt-5 max-w-2xl ${dark ? 'text-kawai-pearl/70' : 'text-kawai-charcoal/70'}`}
          style={{ fontSize: 'clamp(1.15rem, 2.1vw, 1.5rem)', lineHeight: 1.35 }}
        >
          {aside}
        </Reveal>
      )}

      <div className="flex items-end gap-6 mt-8">
        <Reveal
          variant="ruleX"
          delay={0.24}
          className={`flex-1 h-px ${dark ? 'bg-kawai-pearl/20' : 'bg-kawai-black/15'}`}
          aria-hidden
        />
        {meta && (
          <Reveal
            as="span"
            delay={0.3}
            className={`bts-eyebrow whitespace-nowrap pb-1 ${
              dark ? 'text-kawai-pearl/50' : 'text-kawai-charcoal/50'
            }`}
          >
            {meta}
          </Reveal>
        )}
      </div>
    </header>
  )
}
