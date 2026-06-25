import { cn } from '@/lib/utils'
import { Reveal } from './Reveal'

type Stat = {
  /** Big serif figure, e.g. "1927", "2.4M+", "50+". */
  value: string
  /** Tracked uppercase caption, e.g. "Founded". */
  label: string
}

type StatStripProps = {
  stats: Stat[]
  /** Background tone. Default 'black'. */
  tone?: 'black' | 'pearl'
  className?: string
}

/**
 * Horizontal row of big serif statistics with gold uppercase captions —
 * the About page's stat band, reusable on any page. Wraps to two columns on
 * mobile, single row with divider rules on desktop.
 */
export function StatStrip({ stats, tone = 'black', className }: StatStripProps) {
  const dark = tone === 'black'
  return (
    <div
      className={cn(
        dark ? 'bg-kawai-black text-white' : 'bg-kawai-pearl text-kawai-black',
        'py-16 md:py-20',
        className,
      )}
    >
      <div className="container mx-auto px-6">
        <Reveal className="mx-auto flex max-w-6xl flex-wrap justify-center gap-y-10 md:flex-nowrap">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={cn(
                'basis-1/2 px-4 text-center md:flex-1 md:basis-0',
                i > 0 && 'md:border-l',
                dark ? 'md:border-white/10' : 'md:border-kawai-black/10',
              )}
            >
              <div className="font-[family-name:var(--font-brand-serif)] text-4xl font-medium leading-none md:text-5xl lg:text-6xl">
                {s.value}
              </div>
              <div
                className={cn(
                  'mt-3 text-[11px] font-semibold uppercase tracking-[0.25em]',
                  dark ? 'text-kawai-gold/85' : 'text-kawai-gold-on-light',
                )}
              >
                {s.label}
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </div>
  )
}
