'use client'

import type { DealerWithDistance } from '../types'
import { DealerCard } from './DealerCard'

interface Props {
  dealers: DealerWithDistance[]
  selectedDealer: string | null
  onDealerSelect: (dealerId: string | null) => void
}

export function DealerList({ dealers, selectedDealer, onDealerSelect }: Props) {
  if (dealers.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No Dealers Found
          </h3>
          <p className="text-gray-600 text-sm">
            Try expanding your search radius or adjusting your filters to find more dealers.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 space-y-3">
      {dealers.map((dealer, index) => (
        <div
          key={dealer.id}
          className="dealer-card-animate"
          style={{ animationDelay: `${80 * index}ms` }}
        >
          <DealerCard
            dealer={dealer}
            isSelected={selectedDealer === dealer.id}
            onSelect={() => onDealerSelect(dealer.id as string)}
          />
        </div>
      ))}
    </div>
  )
}
