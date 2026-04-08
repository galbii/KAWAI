'use client'

import { LayoutGroup, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type DealerType = 'all' | 'shigeru' | 'acoustic' | 'digital'

interface Props {
  selected: DealerType
  onChange: (type: DealerType) => void
  counts: {
    all: number
    shigeru: number
    acoustic: number
    digital: number
  }
}

const OPTIONS: { value: DealerType; label: string }[] = [
  { value: 'all', label: 'All Dealers' },
  { value: 'digital', label: 'Digital Piano' },
  { value: 'acoustic', label: 'Acoustic Piano' },
  { value: 'shigeru', label: 'Shigeru Kawai' },
]

export function DealerTypeFilter({ selected, onChange, counts }: Props) {
  return (
    <LayoutGroup id="dealer-type-tabs">
      <nav className="flex items-center gap-0" aria-label="Dealer type filter">
        {OPTIONS.map((opt) => {
          const isSelected = selected === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={cn(
                'relative px-5 h-[52px] text-xs uppercase tracking-[0.08em] font-semibold',
                'transition-colors duration-200 font-[family-name:var(--font-brand-sans)]',
                'focus-visible:outline-2 focus-visible:outline-kawai-red',
                isSelected
                  ? 'text-kawai-pearl'
                  : 'text-kawai-charcoal hover:text-kawai-black',
              )}
            >
              {isSelected && (
                <motion.span
                  layoutId="dealer-type-pill"
                  className="absolute inset-0 bg-kawai-black"
                  style={{ borderRadius: 0 }}
                  transition={{ type: 'spring', bounce: 0.18, duration: 0.42 }}
                  aria-hidden
                />
              )}
              <span className="relative z-10">
                {opt.label}
                <span
                  className={cn(
                    'ml-2 text-xs font-semibold tabular-nums',
                    isSelected ? 'text-kawai-pearl/60' : 'text-kawai-charcoal/40',
                  )}
                >
                  {counts[opt.value]}
                </span>
              </span>
            </button>
          )
        })}
      </nav>
    </LayoutGroup>
  )
}
