'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import NextImage from 'next/image'
import type { GrandSaleProduct } from '@/lib/payload/queries'
import { extractYouTubeId } from '@/lib/utils/youtube'

interface ProductMediaModalProps {
  product: GrandSaleProduct
  onClose: () => void
}

function YouTubeEmbed({ youtubeId, title }: { youtubeId: string; title?: string | undefined }) {
  return (
    <div className="relative w-full aspect-video bg-black rounded-sm overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}?modestbranding=1&rel=0`}
        title={title ?? 'Product video'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  )
}

function CmsImage({ url, alt }: { url: string; alt?: string }) {
  return (
    <div className="relative bg-white rounded-sm overflow-hidden border border-kawai-neutral/50">
      <NextImage
        src={url}
        alt={alt ?? ''}
        width={1200}
        height={800}
        className="w-full h-auto object-contain max-h-[520px]"
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  )
}

function ModalContent({ product, onClose }: ProductMediaModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Build ordered media list
  type MediaItem =
    | { kind: 'youtube'; youtubeId: string; title?: string | undefined }
    | { kind: 'image'; url: string; alt?: string | undefined }
    | { kind: 'shopify-image'; url: string; alt?: string | undefined; width?: number | undefined; height?: number | undefined }

  const items: MediaItem[] = []

  // 1. Custom CMS images first
  for (const m of product.customMedia ?? []) {
    if ((!m.mediaType || m.mediaType === 'media') && m.image?.url) {
      const alt = m.alt ?? m.image.alt
      items.push({ kind: 'image', url: m.image.url, ...(alt ? { alt } : {}) })
    }
  }

  // 2. YouTube videos after
  for (const m of product.customMedia ?? []) {
    if (m.mediaType === 'youtube' && m.youtubeUrl) {
      const id = extractYouTubeId(m.youtubeUrl)
      const title = m.alt ?? product.name
      if (id) items.push({ kind: 'youtube', youtubeId: id, ...(title ? { title } : {}) })
    }
  }

  // Fallback to primary imageUrl if no custom media at all
  if (items.length === 0 && product.imageUrl) {
    const alt = product.name ?? product.model
    items.push({ kind: 'shopify-image', url: product.imageUrl, ...(alt ? { alt } : {}) })
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-kawai-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={product.name ?? product.model}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[51] w-full max-w-2xl bg-white rounded-sm shadow-2xl flex flex-col"
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-kawai-neutral flex-shrink-0">
          <div>
            <p className="text-kawai-charcoal/45 text-[10px] tracking-[0.25em] uppercase font-medium mb-0.5 font-[family-name:var(--font-brand-sans)]">
              Kawai · {product.model}
            </p>
            <h2 className="font-[family-name:var(--font-brand-serif)] text-kawai-black text-xl leading-snug">
              {product.name ?? product.model}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-4 mt-0.5 w-8 h-8 flex items-center justify-center rounded-full border border-kawai-neutral hover:border-kawai-black/40 hover:bg-kawai-pearl transition-colors text-kawai-charcoal/60 hover:text-kawai-black"
            aria-label="Close"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable media */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain min-h-0">
          {items.length === 0 ? (
            <div className="flex items-center justify-center py-16 px-6 text-center">
              <p className="text-kawai-charcoal/50 text-sm font-[family-name:var(--font-brand-sans)]">
                Media gallery coming soon.
              </p>
            </div>
          ) : (
            <div className="p-6 space-y-5">
              {items.map((item, i) => (
                <div key={i}>
                  {item.kind === 'youtube' && (
                    <YouTubeEmbed youtubeId={item.youtubeId} {...(item.title ? { title: item.title } : {})} />
                  )}
                  {item.kind === 'image' && (
                    <CmsImage url={item.url} {...(item.alt ? { alt: item.alt } : {})} />
                  )}
                  {item.kind === 'shopify-image' && (
                    <div className="bg-white rounded-sm overflow-hidden border border-kawai-neutral/50">
                      <img
                        src={item.url}
                        alt={item.alt ?? ''}
                        width={item.width}
                        height={item.height}
                        className="w-full h-auto object-contain max-h-[520px]"
                        loading={i === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                      />
                    </div>
                  )}
                </div>
              ))}
              <div className="h-2" />
            </div>
          )}
        </div>

        {/* Footer CTAs */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-kawai-neutral bg-white flex gap-3">
          <button
            onClick={() => {
              onClose()
              setTimeout(() => {
                document.getElementById('grand-lead-form')?.scrollIntoView({ behavior: 'smooth' })
              }, 150)
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3.5 bg-kawai-red hover:bg-kawai-red/90 text-white text-sm font-medium tracking-[0.08em] uppercase transition-colors rounded-sm font-[family-name:var(--font-brand-sans)]"
          >
            Book Now
          </button>
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3.5 border border-kawai-black text-kawai-black hover:bg-kawai-black hover:text-white text-sm font-medium tracking-[0.08em] uppercase transition-colors rounded-sm font-[family-name:var(--font-brand-sans)]"
          >
            View Product
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </>
  )
}

export function ProductMediaModal({ product, onClose }: ProductMediaModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  if (!mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-50 px-4">
      <ModalContent product={product} onClose={onClose} />
    </div>,
    document.body,
  )
}
