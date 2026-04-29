'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProductsNavigation, NavCollection } from '@/lib/payload/products-navigation'

// ─── Types ────────────────────────────────────────────────────────────────────

interface MobileProductsSheetProps {
  isOpen: boolean
  onBack: () => void
  onNavigate: () => void
  productsNavData: ProductsNavigation | null
  isLoading?: boolean
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: 'All',           key: 'all',           href: '/pianos',               terms: [] },
  { label: 'Digital',       key: 'digital',       href: '/pianos/digital',       terms: ['digital'] },
  { label: 'Hybrid',        key: 'hybrid',        href: '/pianos/hybrid',        terms: ['hybrid'] },
  { label: 'Upright',       key: 'upright',       href: '/pianos/upright',       terms: ['upright'] },
  { label: 'Grand',         key: 'grand',         href: '/pianos/grand',         terms: ['grand', 'baby grand', 'baby-grand', 'gl series'] },
  { label: 'Shigeru Kawai', key: 'shigeru-kawai', href: '/pianos/shigeru-kawai', terms: ['shigeru'] },
  { label: 'Accessories',   key: 'accessories',   href: '/accessories',          terms: [] },
] as const

type CategoryKey = (typeof CATEGORIES)[number]['key']

function extractYouTubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)
  return m?.[1] ?? null
}

function getCollectionsForKey(collections: NavCollection[], key: CategoryKey): NavCollection[] {
  if (key === 'all') return collections
  if (key === 'accessories') return []
  const cat = CATEGORIES.find((c) => c.key === key)
  if (!cat || cat.terms.length === 0) return []
  return collections.filter((col) => {
    if (col.pianoCategories && col.pianoCategories.length > 0) {
      return col.pianoCategories.includes(key)
    }
    const titleLower = col.title.toLowerCase()
    const handleLower = col.handle.toLowerCase()
    return cat.terms.some((term) => titleLower.includes(term) || handleLower.includes(term))
  })
}

// ─── Collection Card ──────────────────────────────────────────────────────────

function CollectionCard({ col, onNavigate }: { col: NavCollection; onNavigate: () => void }) {
  const ytId = col.youtubeUrl ? extractYouTubeId(col.youtubeUrl) : null
  const thumbUrl = ytId
    ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
    : col.imageUrl ?? col.mediaUrl ?? null

  return (
    <Link
      href={`/pianos/${col.handle}`}
      onClick={onNavigate}
      className="group relative block rounded-xl overflow-hidden bg-kawai-black aspect-[4/3] shadow-brand-medium"
    >
      {thumbUrl ? (
        <Image
          src={thumbUrl}
          alt={col.title}
          fill
          sizes="(max-width: 640px) 45vw, 200px"
          className="object-cover transition-transform duration-500 group-active:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-kawai-charcoal" />
      )}
      {/* gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      {/* text */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        {col.productCount > 0 && (
          <p className="text-white/50 text-[10px] uppercase tracking-widest mb-0.5">
            {col.productCount} models
          </p>
        )}
        <p className="text-white font-semibold text-sm leading-tight line-clamp-2">
          {col.heading ?? col.title}
        </p>
      </div>
      {/* red accent on active */}
      <div className="absolute top-0 left-0 w-0.5 h-full bg-kawai-red scale-y-0 group-active:scale-y-100 transition-transform duration-200 origin-top" />
    </Link>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function MobileProductsSheet({
  isOpen,
  onBack,
  onNavigate,
  productsNavData,
  isLoading,
}: MobileProductsSheetProps) {
  const [activeKey, setActiveKey] = useState<CategoryKey>('all')

  const allCollections = productsNavData?.allCollections ?? productsNavData?.collections ?? []
  const filteredCollections = getCollectionsForKey(allCollections, activeKey)

  const activeCat = CATEGORIES.find((c) => c.key === activeKey)!

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* backdrop — same level as sheet, tapping closes */}
          <motion.div
            className="fixed inset-0 z-[9502] bg-black/40 xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onBack}
          />

          {/* sheet slides up */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[9503] xl:hidden bg-kawai-pearl rounded-t-2xl shadow-2xl flex flex-col"
            style={{ maxHeight: '92vh' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.9 }}
          >
            {/* handle */}
            <div className="flex-shrink-0 flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-kawai-neutral/60" />
            </div>

            {/* header */}
            <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-kawai-neutral/40">
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 text-kawai-charcoal hover:text-kawai-black transition-colors"
                aria-label="Back to menu"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back</span>
              </button>
              <h2 className="text-base font-bold tracking-tight text-kawai-black">Browse Pianos</h2>
              <button
                onClick={onNavigate}
                className="p-1.5 rounded-md hover:bg-kawai-neutral/30 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-kawai-charcoal" />
              </button>
            </div>

            {/* category pills */}
            <div className="flex-shrink-0 px-4 py-3 overflow-x-auto scrollbar-none">
              <div className="flex gap-2 w-max">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveKey(cat.key)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200',
                      activeKey === cat.key
                        ? 'bg-kawai-red text-white shadow-[0_2px_8px_rgba(225,25,34,0.4)]'
                        : 'bg-white text-kawai-charcoal border border-kawai-neutral/50 hover:border-kawai-red/40',
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* content */}
            <div className="flex-1 overflow-y-auto px-4 pb-6 min-h-0">
              {isLoading ? (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="aspect-[4/3] rounded-xl bg-kawai-neutral/40 animate-pulse" />
                  ))}
                </div>
              ) : activeKey === 'accessories' ? (
                <div className="pt-4">
                  <Link
                    href="/accessories"
                    onClick={onNavigate}
                    className="flex items-center justify-between w-full px-5 py-4 bg-white rounded-xl border border-kawai-neutral/40 hover:border-kawai-red/40 transition-colors"
                  >
                    <span className="font-semibold text-kawai-black">Browse All Accessories</span>
                    <ChevronRight className="w-4 h-4 text-kawai-red" />
                  </Link>
                </div>
              ) : filteredCollections.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {filteredCollections.map((col) => (
                    <CollectionCard key={col.id} col={col} onNavigate={onNavigate} />
                  ))}
                </div>
              ) : (
                <div className="pt-4 space-y-2">
                  <Link
                    href={activeCat.href}
                    onClick={onNavigate}
                    className="flex items-center justify-between w-full px-5 py-4 bg-white rounded-xl border border-kawai-neutral/40 hover:border-kawai-red/40 transition-colors"
                  >
                    <span className="font-semibold text-kawai-black">View All {activeCat.label}</span>
                    <ChevronRight className="w-4 h-4 text-kawai-red" />
                  </Link>
                </div>
              )}

              {/* footer link */}
              {activeKey !== 'accessories' && filteredCollections.length > 0 && (
                <div className="pt-4">
                  <Link
                    href={activeCat.href}
                    onClick={onNavigate}
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-kawai-black text-white text-sm font-semibold hover:bg-kawai-charcoal transition-colors"
                  >
                    View All {activeCat.label === 'All' ? 'Pianos' : activeCat.label}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
