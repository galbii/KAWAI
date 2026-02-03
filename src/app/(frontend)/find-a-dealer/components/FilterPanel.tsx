'use client'

import { useState, useEffect, useMemo } from 'react'
import { X, Piano, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Dealer } from '@/payload-types'
import { cn } from '@/lib/utils'

type DealerType = 'all' | 'professional-products' | 'acoustic-digital'

interface Props {
  isOpen: boolean
  onClose: () => void
  selectedDealerTypes: string[]
  selectedServices: string[]
  selectedRadius: number
  onFilterChange: (dealerTypes: string[], services: string[], radius: number) => void
  dealers: Dealer[]
}

export function FilterPanel({
  isOpen,
  onClose,
  selectedDealerTypes,
  selectedServices,
  selectedRadius,
  onFilterChange,
  dealers
}: Props) {
  const [tempDealerTypes, setTempDealerTypes] = useState<string[]>(selectedDealerTypes)
  const [tempServices, setTempServices] = useState<string[]>(selectedServices)
  const [tempRadius, setTempRadius] = useState(selectedRadius)

  // Update temp state when props change
  useEffect(() => {
    setTempDealerTypes(selectedDealerTypes)
    setTempServices(selectedServices)
    setTempRadius(selectedRadius)
  }, [selectedDealerTypes, selectedServices, selectedRadius])

  // Get all unique service tags from dealers
  const availableServices = useMemo(() => {
    const servicesMap = new Map<string, number>()

    dealers.forEach(dealer => {
      dealer.tags?.forEach(tag => {
        const tagStr = String(tag)
        servicesMap.set(tagStr, (servicesMap.get(tagStr) || 0) + 1)
      })
    })

    return Array.from(servicesMap.entries())
      .map(([service, count]) => ({ service, count }))
      .sort((a, b) => a.service.localeCompare(b.service))
  }, [dealers])

  const handleDealerTypeToggle = (type: string) => {
    setTempDealerTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const handleServiceToggle = (service: string) => {
    setTempServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    )
  }

  const handleApply = () => {
    onFilterChange(tempDealerTypes, tempServices, tempRadius)
    onClose()
  }

  const handleClearAll = () => {
    setTempDealerTypes([])
    setTempServices([])
    setTempRadius(25)
  }

  const formatServiceName = (service: string) => {
    return service.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  if (!isOpen) return null

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
                <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={tempDealerTypes.includes('acoustic-digital')}
                    onChange={() => handleDealerTypeToggle('acoustic-digital')}
                    className="w-4 h-4 rounded text-kawai-charcoal focus:ring-kawai-charcoal cursor-pointer"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-kawai-charcoal/10">
                      <Piano className="w-4 h-4 text-kawai-charcoal" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700 group-hover:text-kawai-charcoal">
                        Acoustic & Digital Pianos
                      </div>
                      <div className="text-xs text-gray-500">
                        Grand, upright & home pianos
                      </div>
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={tempDealerTypes.includes('professional-products')}
                    onChange={() => handleDealerTypeToggle('professional-products')}
                    className="w-4 h-4 rounded text-kawai-red focus:ring-kawai-red cursor-pointer"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-kawai-red/10">
                      <Briefcase className="w-4 h-4 text-kawai-red" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700 group-hover:text-kawai-charcoal">
                        Professional Products
                      </div>
                      <div className="text-xs text-gray-500">
                        Stage pianos, keyboards & pro gear
                      </div>
                    </div>
                  </div>
                </label>
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

            {/* Service Filters */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Services & Features
              </h3>
              <div className="space-y-2">
                {availableServices.map(({ service, count }) => (
                  <label
                    key={service}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={tempServices.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                      className="w-4 h-4 rounded text-kawai-red focus:ring-kawai-red cursor-pointer"
                    />
                    <span className="flex-1 text-sm text-gray-700 group-hover:text-kawai-charcoal">
                      {formatServiceName(service)}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({count})
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
