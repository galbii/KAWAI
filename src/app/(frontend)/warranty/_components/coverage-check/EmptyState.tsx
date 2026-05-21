import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductSearchInput } from './ProductSearchInput'
import type { ProductHit } from './types'

interface EmptyStateProps {
  onPick: (hit: ProductHit) => void
}

export function EmptyState({ onPick }: EmptyStateProps) {
  return (
    <div className="space-y-10">
      <div className="text-center space-y-3">
        <h2 className="text-4xl md:text-5xl font-bold text-kawai-charcoal tracking-tight">
          Is your Kawai covered?
        </h2>
        <p className="text-[15px] text-kawai-charcoal/60 max-w-md mx-auto">
          Search your model — we&apos;ll show you exactly when your warranty expires.
        </p>
      </div>

      <ProductSearchInput onPick={onPick} />

      <div className="flex items-center gap-4" aria-hidden="true">
        <div className="flex-1 border-t border-kawai-neutral" />
        <span className="text-[11px] font-medium uppercase tracking-widest text-kawai-charcoal/40">
          or browse coverage
        </span>
        <div className="flex-1 border-t border-kawai-neutral" />
      </div>

      <div className="grid sm:grid-cols-2 gap-2 -mx-3">
        <Link
          href="/warranty/digital"
          className="group flex items-center justify-between px-3 py-4 rounded-lg hover:bg-kawai-pearl transition-colors"
        >
          <div>
            <p className="text-[15px] font-semibold text-kawai-charcoal">Digital pianos</p>
            <p className="text-[13px] text-kawai-charcoal/50">3- or 5-year limited warranty</p>
          </div>
          <ArrowRight className="w-4 h-4 text-kawai-charcoal/30 group-hover:text-kawai-red group-hover:translate-x-1 transition-all" />
        </Link>
        <Link
          href="/warranty/acoustic"
          className="group flex items-center justify-between px-3 py-4 rounded-lg hover:bg-kawai-pearl transition-colors"
        >
          <div>
            <p className="text-[15px] font-semibold text-kawai-charcoal">Acoustic pianos</p>
            <p className="text-[13px] text-kawai-charcoal/50">Full 10-year transferable</p>
          </div>
          <ArrowRight className="w-4 h-4 text-kawai-charcoal/30 group-hover:text-kawai-red group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  )
}
