'use client'

import type { DealerWithDistance } from '../types'
import { DealerCard } from './DealerCard'
import { MapPin } from 'lucide-react'

interface Props {
  dealers: DealerWithDistance[]
  selectedDealer: string | null
  onDealerSelect: (dealerId: string | null) => void
}

export function DealerList({ dealers, selectedDealer, onDealerSelect }: Props) {
  if (dealers.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center max-w-xs">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-kawai-neutral/40 flex items-center justify-center">
            <MapPin className="w-7 h-7 text-kawai-charcoal/30" strokeWidth={1.5} />
          </div>
          <h3 className="text-sm font-semibold text-kawai-charcoal mb-1.5">
            No dealers found
          </h3>
          <p className="text-kawai-charcoal/55 text-xs leading-relaxed">
            Try expanding your search radius or adjusting your filters.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* List header */}
      <div className="px-4 py-2.5 border-b border-kawai-neutral/60 bg-white flex-shrink-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-kawai-charcoal/50">
          {dealers.length} {dealers.length === 1 ? 'Dealer' : 'Dealers'}
        </p>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto">
        {dealers.map((dealer, index) => (
          <div
            key={dealer.id}
            className="dealer-card-animate"
            style={{ animationDelay: `${60 * index}ms` }}
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
