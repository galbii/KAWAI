'use client'

import { useState, useEffect } from 'react'
import { X, Piano, Briefcase, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  isOpen: boolean
  onClose: () => void
  selectedDealerTypes: string[]
  selectedRadius: number
  onFilterChange: (dealerTypes: string[], radius: number) => void
}

export function FilterPanel({
  isOpen,
  onClose,
  selectedDealerTypes,
  selectedRadius,
  onFilterChange,
}: Props) {
  const [tempDealerTypes, setTempDealerTypes] = useState<string[]>(selectedDealerTypes)
  const [tempRadius, setTempRadius] = useState(selectedRadius)

  // Update temp state when props change
  useEffect(() => {
    setTempDealerTypes(selectedDealerTypes)
    setTempRadius(selectedRadius)
  }, [selectedDealerTypes, selectedRadius])

  const handleDealerTypeToggle = (type: string) => {
    setTempDealerTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const handleApply = () => {
    onFilterChange(tempDealerTypes, tempRadius)
    onClose()
  }

  const handleClearAll = () => {
    setTempDealerTypes([])
    setTempRadius(25)
  }

  if (!isOpen) return null

  const dealerTypeOptions = [
    {
      value: 'shigeru',
      label: 'Shigeru Kawai Dealer',
      description: 'Authorized SK Series grand piano dealers',
      icon: Star,
      iconColor: 'text-kawai-gold',
      bgColor: 'bg-kawai-gold/10',
    },
    {
      value: 'acoustic',
      label: 'Acoustic Piano Dealer',
      description: 'Grand, upright & hybrid acoustic pianos',
      icon: Piano,
      iconColor: 'text-kawai-charcoal',
      bgColor: 'bg-kawai-charcoal/10',
    },
    {
      value: 'professional',
      label: 'Professional Product Dealer',
      description: 'Stage pianos, portables & professional gear',
      icon: Briefcase,
      iconColor: 'text-kawai-red',
      bgColor: 'bg-kawai-red/10',
    },
  ]

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-[60] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Filter Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[70] animate-in slide-in-from-right duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-kawai-charcoal">
              Filter Dealers
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Dealer Type Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Dealer Type
              </h3>
              <div className="space-y-2">
                {dealerTypeOptions.map(({ value, label, description, icon: Icon, iconColor, bgColor }) => (
                  <label
                    key={value}
                    className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={tempDealerTypes.includes(value)}
                      onChange={() => handleDealerTypeToggle(value)}
                      className="w-4 h-4 rounded text-kawai-charcoal focus:ring-kawai-charcoal cursor-pointer"
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <div className={cn("flex items-center justify-center w-8 h-8 rounded-lg", bgColor)}>
                        <Icon className={cn("w-4 h-4", iconColor)} strokeWidth={2.5} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-700 group-hover:text-kawai-charcoal">
                          {label}
                        </div>
                        <div className="text-xs text-gray-500">
                          {description}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Search Radius */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Search Radius
              </h3>
              <div className="space-y-2">
                {[10, 25, 50, 100, 200].map(radius => (
                  <label
                    key={radius}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="radius"
                      value={radius}
                      checked={tempRadius === radius}
                      onChange={() => setTempRadius(radius)}
                      className="w-4 h-4 text-kawai-red focus:ring-kawai-red cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-kawai-charcoal">
                      Within {radius} miles
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-white border-t border-gray-200">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClearAll}
                className="flex-1"
              >
                Clear All
              </Button>
              <Button
                onClick={handleApply}
                className="flex-1 bg-kawai-red hover:bg-kawai-red/90 text-white"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
