'use client'

import { cn } from '@/lib/utils'
import { Piano, Briefcase } from 'lucide-react'

type DealerType = 'all' | 'professional-products' | 'acoustic-digital'

interface Props {
  selected: DealerType
  onChange: (type: DealerType) => void
  counts: {
    all: number
    'professional-products': number
    'acoustic-digital': number
  }
}

export function DealerTypeFilter({ selected, onChange, counts }: Props) {
  const options = [
    {
      value: 'all' as const,
      label: 'All Dealers',
      count: counts.all,
    },
    {
      value: 'professional-products' as const,
      label: 'Professional Products',
      icon: Briefcase,
      count: counts['professional-products'],
      description: 'Stage pianos & keyboards',
    },
    {
      value: 'acoustic-digital' as const,
      label: 'Acoustic & Digital',
      icon: Piano,
      count: counts['acoustic-digital'],
      description: 'Grand, upright & home pianos',
    },
  ]

  return (
    <div className="flex items-center gap-3">
      {options.map((option) => {
        const isSelected = selected === option.value
        const Icon = option.icon

        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "group relative px-5 py-3 rounded-full transition-all duration-300",
              "border-2 font-medium text-sm",
              "hover:scale-[1.02] active:scale-[0.98]",
              isSelected
                ? "bg-kawai-charcoal border-kawai-charcoal text-white shadow-lg shadow-kawai-charcoal/20"
                : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-md"
            )}
          >
            <div className="flex items-center gap-2">
              {Icon && (
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isSelected ? "text-white" : "text-gray-500"
                  )}
                  strokeWidth={2}
                />
              )}
              <span>{option.label}</span>
              <span
                className={cn(
                  "ml-1 px-2 py-0.5 rounded-full text-xs font-semibold transition-colors",
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                )}
              >
                {option.count}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
