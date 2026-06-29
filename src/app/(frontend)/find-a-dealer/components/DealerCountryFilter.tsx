'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type CountryFilter = 'us' | 'canada' | 'all'

interface Props {
  selected: CountryFilter
  onChange: (v: CountryFilter) => void
  counts: { us: number; canada: number; all: number }
}

const OPTIONS: { value: CountryFilter; label: string }[] = [
  { value: 'us', label: 'US' },
  { value: 'canada', label: 'CA' },
  { value: 'all', label: 'All' },
]

export function DealerCountryFilter({ selected, onChange, counts }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Filter dealers by country"
      className="flex items-center rounded-lg border border-kawai-neutral bg-kawai-pearl/50 p-0.5 gap-0.5"
    >
      {OPTIONS.map(({ value, label }) => {
        const isSelected = selected === value
        return (
          <motion.button
            key={value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(value)}
            whileTap={{ scale: 0.93 }}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150',
              'font-[family-name:var(--font-brand-sans)]',
              'focus-visible:outline-2 focus-visible:outline-kawai-red',
              isSelected
                ? 'bg-kawai-charcoal text-white shadow-sm'
                : 'text-kawai-muted hover:text-kawai-black',
            )}
          >
            <span>{label}</span>
            <span
              className={cn(
                'text-[10px] font-semibold tabular-nums',
                isSelected ? 'text-white/60' : 'text-kawai-muted',
              )}
            >
              {counts[value]}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
