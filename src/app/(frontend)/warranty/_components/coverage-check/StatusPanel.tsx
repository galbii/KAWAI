'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  getWarrantyForModel,
  calculateCoverage,
  formatLongDate,
} from '@/lib/warranty-coverage'
import { CoverageAccordion } from './CoverageAccordion'
import type { ProductHit } from './types'

interface StatusPanelProps {
  product: ProductHit
  purchaseDate: Date
  onChangeModel: () => void
  onChangeDate: () => void
}

export function StatusPanel({ product, purchaseDate, onChangeModel, onChangeDate }: StatusPanelProps) {
  const info = getWarrantyForModel(product.productType, product.productModel)
  const status = calculateCoverage(purchaseDate, info)

  // Accessory case — info.detailHref is null and status is null
  if (!status || !info.detailHref) {
    return (
      <div className="space-y-6">
        <BackLinks onChangeModel={onChangeModel} onChangeDate={onChangeDate} />
        <p className="text-[15px] text-kawai-charcoal/80">
          Kawai accessories are not separately warranted under the piano warranty. For service or
          replacement questions, contact your dealer or call{' '}
          <a href="tel:+18004212177" className="text-kawai-red hover:underline">1-800-421-2177</a>.
        </p>
      </div>
    )
  }

  const isActive = status.isActive
  const category = info.category === 'acoustic' ? 'acoustic' : 'digital'

  return (
    <div className="space-y-10">
      <BackLinks onChangeModel={onChangeModel} onChangeDate={onChangeDate} />

      {/* Hero status — calm, centered */}
      <div className="text-center space-y-5 pt-2">
        <span
          className={cn(
            'inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest',
            isActive
              ? 'bg-kawai-charcoal text-white'
              : 'bg-kawai-red text-white',
          )}
        >
          <span className={cn('w-1.5 h-1.5 rounded-full', isActive ? 'bg-emerald-300' : 'bg-white')} />
          {isActive ? 'Covered' : 'Expired'}
        </span>

        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-kawai-pearl rounded-lg relative overflow-hidden shrink-0">
            {product.productImageUrl ? (
              <Image
                src={product.productImageUrl}
                alt=""
                fill
                className="object-contain"
                sizes="48px"
                unoptimized
              />
            ) : null}
          </div>
          <div className="text-left">
            <p className="text-[18px] font-bold text-kawai-charcoal leading-tight">
              {product.productModel ? product.productModel.toUpperCase() : product.title}
            </p>
            <p className="text-[13px] text-kawai-charcoal/55">{info.label}</p>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-[12px] uppercase tracking-widest text-kawai-charcoal/40 mb-1">
            {isActive ? 'Covered through' : 'Expired on'}
          </p>
          <p className="text-3xl md:text-4xl font-bold text-kawai-charcoal tracking-tight">
            {formatLongDate(status.expiresOn)}
          </p>
          <p className="text-[14px] text-kawai-charcoal/55 mt-2">{status.remainingLabel}</p>
        </div>

        {info.inferred && (
          <p className="text-[12px] text-kawai-charcoal/50 max-w-sm mx-auto pt-2">
            We couldn&apos;t verify the exact series from this model name. Confirm coverage with
            your dealer to be sure.
          </p>
        )}
      </div>

      {/* Coverage details — inline accordions, no card */}
      <CoverageAccordion category={category} />

      {/* Footer actions — one line */}
      <div className="border-t border-kawai-neutral pt-6 text-[14px] text-kawai-charcoal/70 flex flex-wrap items-center gap-x-6 gap-y-3">
        {!isActive ? (
          <span>
            Need a repair?{' '}
            <Link href="/find-a-dealer" className="text-kawai-red hover:underline font-medium">
              Find your dealer →
            </Link>
          </span>
        ) : (
          <span>
            Need service?{' '}
            <a href="tel:+18004212177" className="text-kawai-red hover:underline font-medium">
              1-800-421-2177
            </a>
          </span>
        )}
        <Link href="/warranty-registration" className="text-kawai-red hover:underline font-medium">
          Register your piano
        </Link>
        <Link
          href={info.detailHref}
          className="text-kawai-charcoal/60 hover:text-kawai-charcoal inline-flex items-center gap-1 ml-auto"
        >
          Full warranty terms
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}

function BackLinks({
  onChangeModel,
  onChangeDate,
}: {
  onChangeModel: () => void
  onChangeDate: () => void
}) {
  return (
    <div className="flex items-center gap-5 text-[13px] text-kawai-charcoal/50">
      <button
        onClick={onChangeModel}
        className="inline-flex items-center gap-1.5 hover:text-kawai-charcoal transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Change model
      </button>
      <button
        onClick={onChangeDate}
        className="hover:text-kawai-charcoal transition-colors"
      >
        Change date
      </button>
    </div>
  )
}
