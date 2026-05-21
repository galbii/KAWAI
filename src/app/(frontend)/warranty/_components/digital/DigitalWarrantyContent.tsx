'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, X, ExternalLink, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { digitalSeries, seriesIdForModel } from './DigitalSeriesData'
import { ServiceAndClaims } from '../ServiceAndClaims'
import { RegisterCTA } from '../RegisterCTA'
import { WarrantyFromBanner } from '../WarrantyFromBanner'

export function DigitalWarrantyContent() {
  const searchParams = useSearchParams()
  const fromModel = searchParams.get('from') ?? undefined
  const inferredId = seriesIdForModel(fromModel)
  const [activeTab, setActiveTab] = useState<string>(inferredId ?? digitalSeries[0]!.id)

  useEffect(() => {
    const next = seriesIdForModel(fromModel)
    if (next) setActiveTab(next)
  }, [fromModel])

  const current = digitalSeries.find((s) => s.id === activeTab) ?? digitalSeries[0]!

  return (
    <div className="container mx-auto px-6 max-w-2xl pt-10 pb-20 space-y-12">
      {fromModel && <WarrantyFromBanner model={fromModel} />}

      <p className="text-[15px] text-kawai-charcoal/70 leading-relaxed">
        Kawai America Corporation backs every digital and hybrid instrument with a limited
        warranty covering defects in materials and workmanship.
      </p>

      {/* Series selector — minimal underline buttons */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-kawai-charcoal/40 mb-3">
          Select your series
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 border-b border-kawai-neutral">
          {digitalSeries.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'pb-3 -mb-px text-[14px] font-medium transition-colors border-b-2',
                activeTab === tab.id
                  ? 'border-kawai-red text-kawai-charcoal'
                  : 'border-transparent text-kawai-charcoal/50 hover:text-kawai-charcoal',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Series content */}
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-kawai-charcoal mb-2">{current.seriesName}</h2>
          <p className="text-[14px] text-kawai-charcoal/65 leading-relaxed">
            {current.description}
          </p>
        </div>

        <div className="bg-kawai-pearl border-l-2 border-kawai-red px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-kawai-charcoal/50 mb-1">
            Coverage
          </p>
          <p className="text-[15px] text-kawai-charcoal/85 leading-relaxed">
            {current.warrantyDuration}
          </p>
          {current.warrantyNote && (
            <p className="text-[13px] text-kawai-charcoal/55 leading-relaxed mt-1.5">
              {current.warrantyNote}
            </p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-kawai-charcoal/40 mb-3">
              What&apos;s covered
            </p>
            <ul className="space-y-2.5">
              {current.covered.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[14px] text-kawai-charcoal/80 leading-relaxed">
                  <Check className="w-4 h-4 text-kawai-charcoal/60 shrink-0 mt-0.5" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-kawai-charcoal/40 mb-3">
              What&apos;s not covered
            </p>
            <ul className="space-y-2.5">
              {current.notCovered.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[14px] text-kawai-charcoal/55 leading-relaxed">
                  <X className="w-4 h-4 text-kawai-charcoal/30 shrink-0 mt-0.5" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <a
          href={current.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-kawai-red hover:underline"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View full warranty card (PDF)
        </a>
      </div>

      {/* Service + Register — full variant, but in minimal layout */}
      <div className="space-y-10 pt-6 border-t border-kawai-neutral">
        <ServiceAndClaims />
        <RegisterCTA />
      </div>

      {/* Cross-link */}
      <div className="pt-6 border-t border-kawai-neutral flex items-center justify-between gap-4 flex-wrap">
        <p className="text-[14px] text-kawai-charcoal/65">
          Have an acoustic piano?{' '}
          <span className="text-kawai-charcoal/45">Full 10-year transferable coverage.</span>
        </p>
        <Link
          href="/warranty/acoustic"
          className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-kawai-red hover:underline"
        >
          Acoustic warranty
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <p className="text-[12px] text-kawai-charcoal/40 leading-relaxed">
        Applies to digital and hybrid instruments purchased through authorized Kawai dealers in
        the United States and Canada.{' '}
        <Link href="/pianos/digital" className="text-kawai-red hover:underline">Browse digital pianos</Link>
        {' · '}
        <Link href="/find-a-dealer" className="text-kawai-red hover:underline">Find a dealer</Link>
      </p>
    </div>
  )
}
