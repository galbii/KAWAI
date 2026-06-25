import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Reveal } from './Reveal'

type TimelineItem = {
  /** Leading marker — a year ("1927") or a name ("Koichi Kawai"). */
  marker: string
  title?: string
  description?: ReactNode
  children?: ReactNode
}

type BrandTimelineProps = {
  items: TimelineItem[]
  tone?: 'black' | 'pearl'
  className?: string
}

/**
 * Vertical timeline — left rule with red dots, serif markers. Lifted from the
 * About innovation timeline. Each item reveals on scroll as it enters view.
 */
export function BrandTimeline({ items, tone = 'black', className }: BrandTimelineProps) {
  const dark = tone === 'black'
  return (
    <ol
      className={cn(
        'relative ml-3 border-l pl-10',
        dark ? 'border-white/15' : 'border-kawai-black/15',
        className,
      )}
    >
      {items.map((item, i) => (
        <li key={item.marker + i} className="relative mb-12 last:mb-0">
          <Reveal delay={Math.min(i * 0.04, 0.2)}>
            <span
              aria-hidden
              className={cn(
                'absolute -left-[45px] top-2 size-2.5 rounded-full bg-kawai-red ring-4',
                dark ? 'ring-kawai-black' : 'ring-kawai-pearl',
              )}
            />
            <div className="font-[family-name:var(--font-brand-serif)] text-2xl text-kawai-red">
              {item.marker}
            </div>
            {item.title && (
              <h3
                className={cn(
                  'mt-1 mb-2 text-lg font-semibold',
                  dark ? 'text-white' : 'text-kawai-black',
                )}
              >
                {item.title}
              </h3>
            )}
            {item.description && (
              <p className={cn('leading-relaxed', dark ? 'text-white/75' : 'text-kawai-charcoal')}>
                {item.description}
              </p>
            )}
            {item.children}
          </Reveal>
        </li>
      ))}
    </ol>
  )
}
