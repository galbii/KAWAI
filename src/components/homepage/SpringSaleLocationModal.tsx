'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Modal } from '@/components/ui/modal'

interface Storefront {
  slug: string
  locationName: string
  locationText?: string
  showroomInfo?: { address?: string }
}

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function SpringSaleLocationModal({ isOpen, onClose }: Props) {
  const router = useRouter()
  const [storefronts, setStorefronts] = useState<Storefront[]>([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!isOpen) return
    fetch('/api/storefronts/active')
      .then(r => r.json())
      .then(data => setStorefronts(data?.data ?? []))
      .catch(() => {})
  }, [isOpen])

  const filtered = storefronts.filter(s => {
    const q = query.toLowerCase()
    return (
      s.locationName?.toLowerCase().includes(q) ||
      s.locationText?.toLowerCase().includes(q)
    )
  })

  function select(slug: string) {
    onClose()
    router.push(`/store/${slug}/grand-spring-sale`)
  }

  function useMyLocation() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(() => {
      // Geolocation granted — for now just close modal and go to find-a-dealer
      onClose()
      router.push('/find-a-dealer')
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" layout="centered" className="p-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-kawai-neutral">
        <span className="font-[family-name:var(--font-brand-sans)] font-bold text-kawai-red text-xl tracking-tight">
          KAWAI
        </span>
        <span className="text-sm text-kawai-charcoal/60 font-[family-name:var(--font-brand-sans)]">
          {storefronts.length > 0 ? `${storefronts.length} locations` : ''}
        </span>
      </div>

      {/* Search */}
      <div className="px-6 py-4 border-b border-kawai-neutral">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-kawai-pearl border border-kawai-neutral">
          <svg className="w-4 h-4 text-kawai-charcoal/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search city or state..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-kawai-black placeholder:text-kawai-charcoal/40 outline-none font-[family-name:var(--font-brand-sans)]"
            autoFocus
          />
        </div>

        <button
          onClick={useMyLocation}
          className="flex items-center gap-2 mt-3 text-kawai-red text-sm font-semibold tracking-wide font-[family-name:var(--font-brand-sans)] hover:text-kawai-red/80 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4-4 4M3 12h18" />
          </svg>
          USE MY LOCATION
        </button>
      </div>

      {/* Location list */}
      <div className="overflow-y-auto max-h-80">
        {filtered.map(s => (
          <button
            key={s.slug}
            onClick={() => select(s.slug)}
            className="w-full text-left px-6 py-5 border-b border-kawai-neutral last:border-0 hover:bg-kawai-pearl/60 transition-colors group"
          >
            <div className="text-kawai-red text-xs font-bold tracking-widest font-[family-name:var(--font-brand-sans)] mb-0.5">
              KAWAI
            </div>
            <div className="text-kawai-black text-base font-bold uppercase tracking-wide font-[family-name:var(--font-brand-sans)] leading-tight">
              {s.locationName}
            </div>
            <div className="mt-1.5 w-8 h-0.5 bg-kawai-red" />
            {s.showroomInfo?.address && (
              <div className="mt-1 text-kawai-charcoal/50 text-xs font-[family-name:var(--font-brand-sans)]">
                {s.showroomInfo.address}
              </div>
            )}
          </button>
        ))}

        {filtered.length === 0 && storefronts.length > 0 && (
          <p className="px-6 py-8 text-center text-sm text-kawai-charcoal/50 font-[family-name:var(--font-brand-sans)]">
            No locations match &ldquo;{query}&rdquo;
          </p>
        )}
      </div>
    </Modal>
  )
}
