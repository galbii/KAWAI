'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface WarrantyFromBannerProps {
  model: string
}

export function WarrantyFromBanner({ model }: WarrantyFromBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  const displayModel = model.toUpperCase().replace(/-/g, '‑')

  return (
    <div className="bg-kawai-red/5 border border-kawai-red/20 rounded-xl px-5 py-3 flex items-center justify-between gap-4">
      <p className="text-[14px] text-kawai-charcoal/80">
        Showing warranty for your <span className="font-semibold text-kawai-charcoal">{displayModel}</span>.
      </p>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="text-kawai-charcoal/40 hover:text-kawai-charcoal transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
