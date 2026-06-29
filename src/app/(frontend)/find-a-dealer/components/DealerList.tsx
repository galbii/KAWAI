'use client'

import { useEffect, useRef } from 'react'
import type { DealerWithDistance } from '../types'
import { DealerCard } from './DealerCard'
import { MapPin } from 'lucide-react'

interface Props {
  dealers: DealerWithDistance[]
  selectedDealer: string | null
  onDealerSelect: (dealerId: string | null) => void
  searchLabel?: string | undefined
}

export function DealerList({ dealers, selectedDealer, onDealerSelect, searchLabel }: Props) {
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  // When a map marker is clicked, scroll the matching card into view
  useEffect(() => {
    if (!selectedDealer) return
    const el = cardRefs.current.get(selectedDealer)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [selectedDealer])

  if (dealers.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center max-w-xs">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-kawai-neutral/40 flex items-center justify-center">
            <MapPin className="w-7 h-7 text-kawai-muted" strokeWidth={1.5} />
          </div>
          <h3 className="text-sm font-semibold text-kawai-charcoal mb-1.5">
            No dealers found
          </h3>
          <p className="text-kawai-muted text-xs leading-relaxed">
            Try expanding your search radius or adjusting your filters.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* List header */}
      <div className="px-5 py-3 border-b border-kawai-neutral/60 bg-white flex-shrink-0">
        <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-kawai-muted">
          {dealers.length} {dealers.length === 1 ? 'Dealer' : 'Dealers'}
        </p>
        {searchLabel && (
          <p className="text-[11px] text-kawai-muted mt-0.5 truncate">Near {searchLabel}</p>
        )}
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto">
        {dealers.map((dealer, index) => (
          <div
            key={dealer.id}
            ref={el => {
              if (el) cardRefs.current.set(dealer.id as string, el)
              else cardRefs.current.delete(dealer.id as string)
            }}
            className="dealer-card-animate"
            style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
          >
            <DealerCard
              dealer={dealer}
              isSelected={selectedDealer === dealer.id}
              onSelect={() => onDealerSelect(dealer.id as string)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
