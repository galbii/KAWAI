'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, type TouchEvent } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Modal } from '@/components/ui/modal'
import { DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { cn, formatPrice } from '@/lib/utils'
import { getRebateModelDetail } from '@/lib/actions/rebate-model-detail'
import type { RebateModelDetail, RebateProduct } from '@/lib/payload/rebate-types'

type SpecKey = 'action' | 'tone' | 'features'
type SectionKey = 'details' | SpecKey

const SPEC_SECTIONS: { key: SpecKey; label: string }[] = [
  { key: 'action', label: 'Touch & Action' },
  { key: 'tone', label: 'Sound & Tone' },
  { key: 'features', label: 'Connectivity & Features' },
]

type Props = {
  /** The rebate row this modal details. `null` while closed (last value is retained for the exit). */
  product: RebateProduct | null
  isOpen: boolean
  categoryLabel: string
  /** Shigeru leans further into the gold treatment. */
  isShigeru: boolean
  /** Opens the dealer sign-up offer popup (closes this modal first). */
  onSignUp: () => void
  onClose: () => void
}

function parseYouTubeId(url: string | null): string | null {
  if (!url) return null
  const m = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/\s]{11})/.exec(url)
  return m?.[1] ?? (/^[a-zA-Z0-9_-]{11}$/.test(url) ? url : null)
}

const ARROW = (
  <svg
    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)

const CHEVRON_DOWN = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
)

const EYEBROW = 'font-[family-name:var(--font-brand-sans)] text-xs font-semibold uppercase tracking-[0.28em]'
const LABEL = 'font-[family-name:var(--font-brand-sans)] text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60'

/** The film that plays behind the whole modal — collection video, image, or product photo. */
function FilmBackground({
  videoId,
  imageUrl,
}: {
  videoId: string | null
  imageUrl: string | null
}) {
  return (
    <div aria-hidden className="absolute inset-0 z-0 overflow-hidden bg-kawai-black">
      {videoId ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
          allow="autoplay; encrypted-media"
          title=""
        />
      ) : imageUrl ? (
        <Image src={imageUrl} alt="" fill priority className="object-cover" sizes="92vw" />
      ) : null}
      {/* Heavier on the control-panel side so the copy always reads. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/65 to-black/80 lg:bg-gradient-to-r lg:from-black/90 lg:via-black/60 lg:to-black/45" />
    </div>
  )
}

/** MSRP struck, savings reward in gold serif, resulting price. */
function RebateReveal({ product }: { product: RebateProduct }) {
  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span className={LABEL}>MSRP</span>
        <span className="text-base text-white/55 line-through">
          {formatPrice(product.msrp, product.currency)}
        </span>
      </div>
      <div className="mt-3">
        <span className={cn(LABEL, 'text-kawai-gold/80')}>You save</span>
        <div className="mt-1 font-[family-name:var(--font-brand-serif)] text-[3.75rem] font-light leading-[0.95] tracking-tight text-kawai-gold">
          {formatPrice(Math.max(product.msrp - product.yourPrice, 0), product.currency)}
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className={LABEL}>Your price</span>
        <span className="font-[family-name:var(--font-brand-serif)] text-2xl font-medium text-white">
          {formatPrice(product.yourPrice, product.currency)}
        </span>
      </div>
      {product.rebate > 0 && product.msrp - product.yourPrice > product.rebate ? (
        <p className="mt-2.5 font-[family-name:var(--font-brand-sans)] text-xs font-semibold uppercase tracking-[0.12em] text-kawai-gold/90">
          Includes {formatPrice(product.rebate, product.currency)} instant rebate
        </p>
      ) : null}
      {product.note ? (
        <p className="mt-3 font-[family-name:var(--font-brand-sans)] text-xs font-medium uppercase tracking-[0.1em] text-white/55">
          {product.note}
        </p>
      ) : null}
    </div>
  )
}

export default function RebateModelModal({
  product,
  isOpen,
  categoryLabel,
  isShigeru,
  onSignUp,
  onClose,
}: Props) {
  const reduce = useReducedMotion() ?? false

  // Retain the last product so the close animation has content to render.
  const [shown, setShown] = useState<RebateProduct | null>(product)
  const [detail, setDetail] = useState<RebateModelDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeKey, setActiveKey] = useState<SectionKey>('details')
  const [mediaIndex, setMediaIndex] = useState(0)
  // Mobile only: collapse the pricing panel so the active content section fills
  // the screen once the shopper dives into it. Desktop keeps both side-by-side.
  const [pricingOpen, setPricingOpen] = useState(true)

  useEffect(() => {
    if (product) setShown(product)
  }, [product])

  // Lazily load the model's media, specs + film when the modal opens for a product.
  useEffect(() => {
    if (!isOpen || !product) return
    let cancelled = false
    setLoading(true)
    setDetail(null)
    setMediaIndex(0)
    setPricingOpen(true)
    getRebateModelDetail(product.slug)
      .then((d) => {
        if (cancelled) return
        setDetail(d)
        const first: SectionKey =
          d.media.length > 0
            ? 'details'
            : (SPEC_SECTIONS.find((s) => d[s.key].length > 0)?.key ?? 'features')
        setActiveKey(first)
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [isOpen, product])

  const p = product ?? shown
  if (!p) return null

  const media = detail?.media ?? []
  const specSections = SPEC_SECTIONS.filter((s) => (detail?.[s.key]?.length ?? 0) > 0)
  const navSections: { key: SectionKey; label: string }[] = [
    ...(media.length > 0 ? [{ key: 'details' as SectionKey, label: 'Details' }] : []),
    ...specSections,
  ]
  const hasContent = navSections.length > 0
  const activeSpec = SPEC_SECTIONS.find((s) => s.key === activeKey)
  const activeItems = activeSpec ? (detail?.[activeSpec.key] ?? []) : []
  const activeLabel = navSections.find((s) => s.key === activeKey)?.label ?? ''
  const showMedia = activeKey === 'details' && media.length > 0
  const current = media[mediaIndex]
  const stepMedia = (dir: number) => {
    setPricingOpen(false) // mobile: diving into the gallery expands it full-screen
    setMediaIndex((i) => (media.length ? (i + dir + media.length) % media.length : 0))
  }

  // Mobile bottom-sheet swipe: swipe up focuses the content (lower) panel, swipe
  // down brings back the pricing (upper) panel. Reads the content scroll position
  // to tell a real scroll from a sheet swipe, so it never fights the scroller.
  const scrollRef = useRef<HTMLDivElement>(null)
  const touchRef = useRef<{ x: number; y: number; scrollTop: number } | null>(null)
  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0]
    if (!t) return
    touchRef.current = { x: t.clientX, y: t.clientY, scrollTop: scrollRef.current?.scrollTop ?? 0 }
  }
  const onTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    const start = touchRef.current
    touchRef.current = null
    const t = e.changedTouches[0]
    if (!start || !t) return
    const dy = t.clientY - start.y
    const dx = t.clientX - start.x
    const scrolled = Math.abs((scrollRef.current?.scrollTop ?? 0) - start.scrollTop)
    // Only decisive, mostly-vertical swipes that didn't scroll the content toggle.
    if (scrolled > 6 || Math.abs(dy) < 56 || Math.abs(dx) > Math.abs(dy)) return
    setPricingOpen(dy > 0) // up → collapse pricing (content); down → reveal pricing
  }

  const videoId = reduce ? null : parseYouTubeId(detail?.film?.youtubeUrl ?? null)
  const bgImage = detail?.film?.imageUrl ?? detail?.productImageUrl ?? p.imageUrl

  const handleSignUp = () => {
    onClose()
    onSignUp()
  }

  const signUpPill =
    'group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-kawai-red px-6 py-3.5 font-[family-name:var(--font-brand-sans)] text-sm font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-kawai-red/90 hover:shadow-[0_8px_28px_rgba(225,25,34,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red focus-visible:ring-offset-2 focus-visible:ring-offset-black'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      showCloseButton={false}
      className="w-[94vw] max-w-5xl overflow-hidden rounded-2xl border-0 bg-kawai-black p-0 text-white lg:w-[92vw]"
    >
      <DialogTitle className="sr-only">{`${p.name} — current rebate and specifications`}</DialogTitle>
      <DialogDescription className="sr-only">
        {`${p.name}: ${formatPrice(p.yourPrice, p.currency)} — save ${formatPrice(Math.max(p.msrp - p.yourPrice, 0), p.currency)} off ${formatPrice(p.msrp, p.currency)} MSRP, including a ${formatPrice(p.rebate, p.currency)} instant rebate. Touch and action, sound and tone, and connectivity features, with a sign-up to claim the rebate through your local dealer.`}
      </DialogDescription>

      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative flex h-[92vh] w-full flex-col overflow-hidden lg:h-[88vh] lg:max-h-[760px] lg:flex-row"
      >
        <FilmBackground videoId={videoId} imageUrl={bgImage} />

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-kawai-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Control panel — model, the savings reward, the section rail, the CTA */}
        <aside className="relative z-20 flex flex-shrink-0 flex-col gap-5 bg-gradient-to-b from-black/70 to-black/35 p-6 backdrop-blur-md lg:w-[360px] lg:gap-7 lg:bg-black/40 lg:p-8">
          <div className="pr-8">
            <p className={cn(EYEBROW, isShigeru ? 'text-kawai-gold' : 'text-kawai-red')}>
              {categoryLabel}
            </p>
            <h2
              className={cn(
                'mt-2 font-[family-name:var(--font-brand-serif)] font-medium leading-tight tracking-tight text-white transition-all duration-300 sm:text-4xl lg:!text-4xl',
                pricingOpen ? 'text-[2rem]' : 'text-2xl',
              )}
            >
              {p.name}
            </h2>
          </div>

          {/* Full savings reveal — collapses on mobile when the shopper dives into
              a content section, so that section can fill the screen. Always open
              on desktop (side-by-side layout). */}
          <div
            className={cn(
              'grid transition-[grid-template-rows,opacity] duration-300 ease-out lg:!grid-rows-[1fr] lg:!opacity-100',
              pricingOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
            )}
          >
            <div className="overflow-hidden">
              <RebateReveal product={p} />
            </div>
          </div>

          {/* Compact savings bar — mobile only, shown while pricing is collapsed.
              Tap to bring the full pricing panel back. */}
          {!pricingOpen ? (
            <button
              type="button"
              onClick={() => setPricingOpen(true)}
              aria-label="Show full pricing"
              className="flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-left transition-colors hover:bg-white/10 lg:hidden"
            >
              <span className="font-[family-name:var(--font-brand-sans)] text-sm font-semibold text-white">
                Save {formatPrice(Math.max(p.msrp - p.yourPrice, 0), p.currency)}
                <span className="text-white/50"> · {formatPrice(p.yourPrice, p.currency)}</span>
              </span>
              <span className="flex-shrink-0 text-white/60">{CHEVRON_DOWN}</span>
            </button>
          ) : null}

          {/* Section rail — backlit "string" nav (desktop) */}
          <nav className="mt-1 hidden flex-col lg:flex" aria-label="Product details">
            {navSections.map((s) => {
              const active = s.key === activeKey
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setActiveKey(s.key)}
                  className="group flex items-center gap-3 py-3 text-left"
                >
                  <span
                    className={cn(
                      'block w-px flex-shrink-0 transition-all duration-300',
                      active ? 'h-8 bg-kawai-red' : 'h-5 bg-white/25 group-hover:bg-white/55',
                    )}
                  />
                  <span
                    className={cn(
                      'font-[family-name:var(--font-brand-sans)] text-xs font-semibold uppercase tracking-[0.18em] transition-colors',
                      active ? 'text-white' : 'text-white/55 group-hover:text-white/85',
                    )}
                  >
                    {s.label}
                  </span>
                </button>
              )
            })}
          </nav>

          {/* CTA (desktop, pinned to the panel bottom) */}
          <div className="mt-auto hidden lg:block">
            <button type="button" onClick={handleSignUp} className={signUpPill}>
              Sign Up Now
              {ARROW}
            </button>
            <Link
              href="/find-a-dealer"
              className="mt-3 block text-center font-[family-name:var(--font-brand-sans)] text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-white"
            >
              Find a dealer
            </Link>
          </div>
        </aside>

        {/* Active section */}
        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          {/* Section nav pills (mobile) */}
          {hasContent ? (
            <div className="flex gap-2 overflow-x-auto scrollbar-none border-b border-white/10 bg-black/30 px-5 py-3 backdrop-blur-sm lg:hidden">
              {navSections.map((s) => {
                const active = s.key === activeKey
                return (
                  <button
                    key={s.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => { setActiveKey(s.key); setPricingOpen(false) }}
                    className={cn(
                      'shrink-0 whitespace-nowrap rounded-full px-4 py-2 font-[family-name:var(--font-brand-sans)] text-xs font-semibold uppercase tracking-[0.14em] transition-colors',
                      active ? 'bg-white text-kawai-black' : 'bg-white/15 text-white/80',
                    )}
                  >
                    {s.label}
                  </button>
                )
              })}
            </div>
          ) : null}

          <div
            ref={scrollRef}
            className={cn(
              'min-h-0 flex-1 overflow-y-auto overscroll-contain',
              showMedia ? 'bg-white' : 'p-6 sm:p-8 lg:p-12',
            )}
          >
            {loading ? (
              <div className="max-w-lg animate-pulse space-y-4">
                <div className="h-8 w-2/3 rounded bg-white/15" />
                <div className="mt-8 space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-4 rounded bg-white/10" style={{ width: `${85 - i * 9}%` }} />
                  ))}
                </div>
              </div>
            ) : showMedia ? (
              <div key="details" className="flex h-full animate-fade-in flex-col">
                <h3 className="px-6 pt-6 font-[family-name:var(--font-brand-serif)] text-4xl font-light uppercase tracking-[0.06em] text-kawai-black sm:px-8 sm:pt-8 sm:text-5xl lg:px-10 lg:pt-10 lg:text-6xl">
                  Details
                </h3>
                <div className="relative mt-3 flex min-h-0 flex-1 items-center justify-center">
                  {current?.type === 'video' ? (
                    <div className="relative aspect-video w-full max-w-3xl px-4 sm:px-8">
                      <iframe
                        key={current.youtubeId}
                        src={`https://www.youtube.com/embed/${current.youtubeId}?rel=0&modestbranding=1&playsinline=1`}
                        title={current.alt}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full animate-fade-in rounded-xl bg-black shadow-lg"
                      />
                    </div>
                  ) : (
                    <div className="relative h-full w-full">
                      <Image
                        key={current?.url}
                        src={current?.url ?? ''}
                        alt={current?.alt || p.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 640px"
                        className="animate-fade-in object-contain"
                      />
                    </div>
                  )}
                  {media.length > 1 ? (
                    <>
                      <button
                        type="button"
                        onClick={() => stepMedia(-1)}
                        aria-label="Previous item"
                        className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-kawai-black/15 bg-white text-kawai-black shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-colors hover:bg-kawai-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-black/40"
                      >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => stepMedia(1)}
                        aria-label="Next item"
                        className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-kawai-black/15 bg-white text-kawai-black shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-colors hover:bg-kawai-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-black/40"
                      >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  ) : null}
                </div>
                {media.length > 1 ? (
                  <p className="px-6 pb-5 pt-2 text-center font-[family-name:var(--font-brand-sans)] text-xs font-semibold uppercase tracking-[0.18em] tabular-nums text-kawai-charcoal/60">
                    {mediaIndex + 1} / {media.length}
                  </p>
                ) : null}
              </div>
            ) : activeSpec ? (
              <div key={activeKey} className="animate-fade-in">
                <h3 className="max-w-2xl font-[family-name:var(--font-brand-serif)] text-4xl font-light uppercase tracking-[0.06em] text-white sm:text-5xl lg:text-6xl">
                  {activeLabel}
                </h3>
                <ul className="mt-8 max-w-xl space-y-4">
                  {activeItems.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3.5 font-[family-name:var(--font-brand-sans)] text-lg leading-relaxed text-white sm:text-xl"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          'mt-[0.6em] block h-1.5 w-1.5 flex-shrink-0 rounded-full',
                          isShigeru ? 'bg-kawai-gold' : 'bg-kawai-red',
                        )}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center">
                {bgImage ? (
                  <div className="relative h-40 w-56 sm:h-52 sm:w-72">
                    <Image src={bgImage} alt={p.name} fill className="object-contain" sizes="288px" />
                  </div>
                ) : null}
                <p className="mt-6 max-w-sm font-[family-name:var(--font-brand-sans)] text-base leading-relaxed text-white/80">
                  Your local Authorized Kawai dealer can walk you through everything the {p.label}{' '}
                  has to offer.
                </p>
              </div>
            )}
          </div>

          {/* CTA (mobile, sticky to the modal bottom) */}
          <div className="border-t border-white/10 bg-black/70 p-4 backdrop-blur-md lg:hidden">
            <button type="button" onClick={handleSignUp} className={signUpPill}>
              Sign Up Now
              {ARROW}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
