'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getWarrantyForModel } from '@/lib/warranty-coverage'
import type { ProductHit } from './types'

interface DateStepProps {
  product: ProductHit
  onSubmit: (date: Date) => void
  onChange: () => void
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10)
}

export function DateStep({ product, onSubmit, onChange }: DateStepProps) {
  const [dateStr, setDateStr] = useState('')
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const info = getWarrantyForModel(product.productType, product.productModel)
  const max = todayIsoDate()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!dateStr) {
      setError('Enter your purchase date.')
      return
    }
    const date = new Date(dateStr)
    if (Number.isNaN(date.getTime())) {
      setError('That date doesn&apos;t look right.')
      return
    }
    if (date.getTime() > Date.now()) {
      setError('Purchase date can&apos;t be in the future.')
      return
    }
    setError(null)
    onSubmit(date)
  }

  return (
    <div className="space-y-8">
      <button
        onClick={onChange}
        className="inline-flex items-center gap-1.5 text-[13px] text-kawai-charcoal/50 hover:text-kawai-charcoal transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Change model
      </button>

      {/* Product summary — quiet, single row */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-kawai-pearl rounded-lg shrink-0 relative overflow-hidden">
          {product.productImageUrl ? (
            <Image
              src={product.productImageUrl}
              alt=""
              fill
              className="object-contain"
              sizes="64px"
              unoptimized
            />
          ) : null}
        </div>
        <div className="min-w-0">
          <p className="text-xl font-bold text-kawai-charcoal truncate">
            {product.productModel ? product.productModel.toUpperCase() : product.title}
          </p>
          <p className="text-[14px] text-kawai-charcoal/60 truncate">
            {product.title} · {info.label}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="purchase-date" className="block">
          <span className="text-[15px] font-medium text-kawai-charcoal">
            When did you purchase it?
          </span>
        </label>
        <div className="flex items-center gap-3 border-b-2 border-kawai-charcoal py-3">
          <input
            ref={inputRef}
            id="purchase-date"
            type="date"
            value={dateStr}
            onChange={(e) => {
              setDateStr(e.target.value)
              setError(null)
            }}
            max={max}
            className="flex-1 bg-transparent outline-none text-lg text-kawai-charcoal placeholder:text-kawai-charcoal/40"
          />
          <button
            type="submit"
            disabled={!dateStr}
            className="inline-flex items-center gap-1.5 bg-kawai-charcoal hover:bg-kawai-black disabled:bg-kawai-neutral disabled:text-kawai-charcoal/40 text-white font-semibold px-5 py-2 rounded-full transition-colors text-sm"
          >
            Check coverage
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        {error && (
          <p className="text-[13px] text-kawai-red" role="alert">
            {error}
          </p>
        )}
        <p className="text-[12px] text-kawai-charcoal/40">
          We don&apos;t store this — it stays in your browser.
        </p>
      </form>
    </div>
  )
}
