'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  isOpen: boolean
  onClose: () => void
  selectedDealerTypes: string[]
  selectedRadius: number
  onFilterChange: (dealerTypes: string[], radius: number) => void
}

const DEALER_TYPES = [
  {
    value: 'shigeru',
    label: 'Shigeru Kawai',
    description: 'Authorized SK Series grand piano dealers',
    dot: '#C49A00',
    text: '#A07800',
  },
  {
    value: 'acoustic',
    label: 'Acoustic Piano',
    description: 'Grand, upright & hybrid acoustic pianos',
    dot: 'rgba(44,44,44,0.35)',
    text: 'rgba(44,44,44,0.6)',
  },
  {
    value: 'professional',
    label: 'Professional',
    description: 'Stage pianos, portables & professional gear',
    dot: '#C01820',
    text: '#C01820',
  },
]

const RADII = [10, 25, 50, 100, 200]

export function FilterPanel({
  isOpen,
  onClose,
  selectedDealerTypes,
  selectedRadius,
  onFilterChange,
}: Props) {
  const [tempDealerTypes, setTempDealerTypes] = useState<string[]>(selectedDealerTypes)
  const [tempRadius, setTempRadius] = useState(selectedRadius)

  useEffect(() => {
    setTempDealerTypes(selectedDealerTypes)
    setTempRadius(selectedRadius)
  }, [selectedDealerTypes, selectedRadius])

  const toggle = (type: string) =>
    setTempDealerTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )

  const handleApply = () => {
    onFilterChange(tempDealerTypes, tempRadius)
    onClose()
  }

  const handleClearAll = () => {
    setTempDealerTypes([])
    setTempRadius(25)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-[60] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-[70] animate-in slide-in-from-right duration-300 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-kawai-neutral">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-kawai-red mb-0.5 font-[family-name:var(--font-brand-sans)]">
              Kawai Dealers
            </p>
            <h2 className="text-[17px] font-semibold text-kawai-black font-[family-name:var(--font-brand-luxury)]">
              Filter Results
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-kawai-pearl transition-colors"
          >
            <X className="w-4 h-4 text-kawai-charcoal/50" strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-8">

          {/* Dealer Type */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-kawai-charcoal/40 mb-4 font-[family-name:var(--font-brand-sans)]">
              Dealer Type
            </p>
            <div className="space-y-1">
              {DEALER_TYPES.map(({ value, label, description, dot, text }) => {
                const checked = tempDealerTypes.includes(value)
                return (
                  <label
                    key={value}
                    className={cn(
                      'flex items-start gap-4 cursor-pointer py-3 px-3 -mx-3 rounded-lg transition-colors',
                      checked ? 'bg-kawai-pearl/60' : 'hover:bg-kawai-pearl/30'
                    )}
                  >
                    {/* Custom checkbox */}
                    <div className="relative flex-shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(value)}
                        className="sr-only"
                      />
                      <div className={cn(
                        'w-4 h-4 rounded border transition-all',
                        checked
                          ? 'bg-kawai-black border-kawai-black'
                          : 'border-kawai-neutral bg-white'
                      )}>
                        {checked && (
                          <svg viewBox="0 0 10 8" className="w-full h-full p-[3px] text-white" fill="none">
                            <path d="M1 4l2.5 2.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
                        <span className="text-[13px] font-semibold" style={{ color: text }}>
                          {label}
                        </span>
                      </div>
                      <p className="text-[12px] text-kawai-charcoal/45 leading-snug">
                        {description}
                      </p>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-kawai-neutral/60" />

          {/* Search Radius */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-kawai-charcoal/40 mb-4 font-[family-name:var(--font-brand-sans)]">
              Search Radius
            </p>
            <div className="space-y-0.5">
              {RADII.map(radius => {
                const active = tempRadius === radius
                return (
                  <label
                    key={radius}
                    className={cn(
                      'flex items-center justify-between cursor-pointer py-2.5 px-3 -mx-3 rounded-lg transition-colors',
                      active ? 'bg-kawai-pearl/60' : 'hover:bg-kawai-pearl/30'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {/* Custom radio */}
                      <div className="relative flex-shrink-0">
                        <input
                          type="radio"
                          name="radius"
                          value={radius}
                          checked={active}
                          onChange={() => setTempRadius(radius)}
                          className="sr-only"
                        />
                        <div className={cn(
                          'w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all',
                          active ? 'border-kawai-black' : 'border-kawai-neutral'
                        )}>
                          {active && <div className="w-1.5 h-1.5 rounded-full bg-kawai-black" />}
                        </div>
                      </div>
                      <span className={cn(
                        'text-[13px] transition-colors',
                        active ? 'font-semibold text-kawai-black' : 'text-kawai-charcoal/60'
                      )}>
                        Within {radius} miles
                      </span>
                    </div>
                    {active && (
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-kawai-charcoal/30">
                        Selected
                      </span>
                    )}
                  </label>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-5 border-t border-kawai-neutral flex gap-3">
          <button
            onClick={handleClearAll}
            className="flex-1 py-2.5 text-[12px] font-semibold text-kawai-charcoal/60 hover:text-kawai-black border border-kawai-neutral hover:border-kawai-charcoal/40 rounded-lg transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-2.5 text-[12px] font-semibold text-white bg-kawai-black hover:bg-kawai-charcoal rounded-lg transition-colors"
          >
            Apply Filters
          </button>
        </div>

      </div>
    </>
  )
}
