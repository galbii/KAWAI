'use client'

import { Map, List } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  view: 'map' | 'list'
  onViewChange: (view: 'map' | 'list') => void
  dealerCount: number
}

export function MobileViewToggle({ view, onViewChange, dealerCount }: Props) {
  return (
    <div className="px-4 py-3 bg-white border-b border-gray-200">
      <div className="flex gap-2">
        <button
          onClick={() => onViewChange('map')}
          className={cn(
            "flex-1 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2",
            view === 'map'
              ? "bg-kawai-red text-white shadow-sm"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          <Map className="w-4 h-4" />
          Map View
        </button>

        <button
          onClick={() => onViewChange('list')}
          className={cn(
            "flex-1 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2",
            view === 'list'
              ? "bg-kawai-red text-white shadow-sm"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          <List className="w-4 h-4" />
          List View ({dealerCount})
        </button>
      </div>
    </div>
  )
}
