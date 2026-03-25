'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonColor = 'red' | 'black' | 'white' | 'gold'

interface ContentCtaLink {
  id?: string | null
  label: string
  url: string
  variant?: ButtonVariant | null
  color?: ButtonColor | null
  openInNewTab?: boolean | null
}

interface ContentCtaBlockProps {
  heading?: string | null
  subtext?: string | null
  style?: 'centered' | 'left-aligned' | 'card' | null
  links: ContentCtaLink[]
}

export function ContentCtaBlock({ heading, subtext, style, links }: ContentCtaBlockProps) {
  if (!links || links.length === 0) return null

  const isCard = style === 'card'
  const isCentered = !style || style === 'centered'
  const isLeftAligned = style === 'left-aligned'

  return (
    <div
      className={cn(
        'my-8 w-full',
        isCard && 'rounded-lg border border-kawai-neutral bg-kawai-pearl px-8 py-10 shadow-brand-subtle',
        !isCard && 'py-4',
      )}
    >
      <div
        className={cn(
          'flex flex-col gap-4',
          isCentered && 'items-center text-center',
          isLeftAligned && 'items-start text-left',
          isCard && 'items-center text-center',
        )}
      >
        {/* Heading */}
        {heading && (
          <h3
            className={cn(
              'text-xl font-semibold text-kawai-black font-[family-name:var(--font-brand-sans)]',
              (isCentered || isCard) && 'text-center',
              isLeftAligned && 'text-left',
            )}
          >
            {heading}
          </h3>
        )}

        {/* Subtext */}
        {subtext && (
          <p
            className={cn(
              'text-base leading-relaxed text-kawai-charcoal font-[family-name:var(--font-brand-sans)] max-w-xl',
              (isCentered || isCard) && 'text-center',
              isLeftAligned && 'text-left',
            )}
          >
            {subtext}
          </p>
        )}

        {/* Buttons */}
        <div
          className={cn(
            'flex flex-col sm:flex-row gap-3 mt-1',
            (isCentered || isCard) && 'justify-center',
            isLeftAligned && 'justify-start',
          )}
        >
          {links.map((link: ContentCtaLink) => {
            const isNewTab = link.openInNewTab === true
            const target = isNewTab ? '_blank' : undefined
            const rel = isNewTab ? 'noopener noreferrer' : undefined
            const variant: ButtonVariant = link.variant ?? 'primary'
            const color: ButtonColor = link.color ?? 'red'

            // Filled (primary) classes by color
            const primaryClasses: Record<ButtonColor, string> = {
              red:   'bg-kawai-red text-white hover:bg-kawai-red-700 shadow-brand-red-glow',
              black: 'bg-kawai-black text-white hover:bg-kawai-charcoal',
              white: 'bg-white text-kawai-black hover:bg-kawai-pearl border border-kawai-neutral',
              gold:  'bg-kawai-gold text-kawai-black hover:opacity-90',
            }

            // Outlined (secondary) classes by color
            const secondaryClasses: Record<ButtonColor, string> = {
              red:   'border border-kawai-red text-kawai-red hover:bg-kawai-red hover:text-white',
              black: 'border border-kawai-black text-kawai-black hover:bg-kawai-black hover:text-white',
              white: 'border border-white text-white hover:bg-white hover:text-kawai-black',
              gold:  'border border-kawai-gold text-kawai-gold hover:bg-kawai-gold hover:text-kawai-black',
            }

            // Ghost (text only) classes by color
            const ghostClasses: Record<ButtonColor, string> = {
              red:   'text-kawai-red underline-offset-4 hover:underline',
              black: 'text-kawai-black underline-offset-4 hover:underline',
              white: 'text-white underline-offset-4 hover:underline',
              gold:  'text-kawai-gold underline-offset-4 hover:underline',
            }

            const variantClass =
              variant === 'primary' ? primaryClasses[color] :
              variant === 'secondary' ? secondaryClasses[color] :
              ghostClasses[color]

            return (
              <Link
                key={link.id ?? link.url}
                href={link.url}
                target={target}
                rel={rel}
                className={cn(
                  'inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-all duration-200 font-[family-name:var(--font-brand-sans)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red focus-visible:ring-offset-2',
                  variantClass,
                )}
              >
                {link.label}
                {variant !== 'ghost' && (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
