'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, formatPrice } from '@/lib/utils'
import {
  PromoPopupShell,
  PromoSheetHandle,
  PromoCta,
  PROMO_TOKENS,
  type PromoFrequency,
} from '@/components/ui/promo-popup-shell'

export interface BundlePromoItem {
  /** Display name — the model label, or an editor override */
  label: string
  /** Per-item price in the active currency; null hides the figure */
  price?: number | null | undefined
  imageUrl?: string | null | undefined
}

export interface BundlePromoImage {
  url: string
  alt?: string | null | undefined
}

export interface BundlePromoPopupProps {
  /** Full storage key remembering dismissal (e.g. `kawai-bundle-promo-{handle}`) */
  storageKey: string
  /** Where the CTA button navigates */
  href: string
  headline: string
  /** Small uppercase label above the headline */
  eyebrow?: string | null | undefined
  message?: string | null | undefined
  /** The products in the bundle, in showcase order (2–4 reads best) */
  items: BundlePromoItem[]
  /** Bundle price in the active currency — omit to showcase without pricing */
  bundlePrice?: number | null | undefined
  /** Fine print under the bundle price, e.g. "until December 1st" */
  priceNote?: string | null | undefined
  currency?: string | undefined
  /** Lifestyle carousel; falls back to the items' own images when empty */
  media?: BundlePromoImage[] | undefined
  ctaLabel?: string | null | undefined
  dismissLabel?: string | undefined
  frequency?: PromoFrequency | null | undefined
  delaySeconds?: number | null | undefined
}

const TITLE_ID = 'kawai-bundle-promo-title'
const MESSAGE_ID = 'kawai-bundle-promo-message'

/**
 * Bundle promo modal — showcases several products sold together: the pieces
 * with their individual prices, the separate total struck through, and the
 * bundle price that replaces it. Modelled on the ES60 designer-stand bundle
 * popup, rebuilt on the shared promo chrome and brand tokens.
 *
 * Pricing is optional: with no bundlePrice the card is a pure showcase of the
 * pieces, so a bundle can go live before its numbers are signed off.
 */
export function BundlePromoPopup({
  storageKey,
  href,
  headline,
  eyebrow,
  message,
  items,
  bundlePrice,
  priceNote,
  currency = 'USD',
  media,
  ctaLabel,
  dismissLabel,
  frequency = 'session',
  delaySeconds = 2,
}: BundlePromoPopupProps) {
  // Carousel falls back to the bundle pieces' own product shots
  const hasOwnImagery = Boolean(media && media.length > 0)
  const slides: BundlePromoImage[] = hasOwnImagery
    ? (media as BundlePromoImage[])
    : items
        .filter((item) => Boolean(item.imageUrl))
        .map((item) => ({ url: item.imageUrl as string, alt: item.label }))

  const [slideIndex, setSlideIndex] = useState(0)
  const activeSlide = slides[slideIndex] ?? slides[0]

  const goPrev = () => setSlideIndex((i) => (i === 0 ? slides.length - 1 : i - 1))
  const goNext = () => setSlideIndex((i) => (i === slides.length - 1 ? 0 : i + 1))

  // Separate total — only meaningful when every piece carries a price
  const pricedItems = items.filter((item) => typeof item.price === 'number' && item.price > 0)
  const separateTotal =
    pricedItems.length === items.length && items.length > 0
      ? pricedItems.reduce((sum, item) => sum + (item.price as number), 0)
      : null
  const showBundlePrice = typeof bundlePrice === 'number' && bundlePrice > 0
  const savings =
    showBundlePrice && separateTotal && separateTotal > bundlePrice
      ? separateTotal - bundlePrice
      : null

  if (items.length === 0) return null

  return (
    <PromoPopupShell
      storageKey={storageKey}
      frequency={frequency}
      delaySeconds={delaySeconds}
      labelledBy={TITLE_ID}
      describedBy={message ? MESSAGE_ID : undefined}
      cardClassName="sm:max-w-[920px] sm:mx-4"
      closeOverImage={false}
    >
      {({ dismiss, reduceMotion, fadeUp }) => (
        <div className="grid grid-cols-1 sm:grid-cols-[1.05fr_1fr]">
          {/* ── Left: bundle imagery ──────────────────────────────────────── */}
          {slides.length > 0 && activeSlide && (
            <div
              className="relative h-[210px] sm:h-auto sm:min-h-[420px] sm:border-r border-kawai-black/[0.07]"
              style={{ background: '#F2EFEA' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={slideIndex}
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.03 }}
                  animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0.2 : 0.5 }}
                  className={cn('absolute inset-0', !hasOwnImagery && 'p-6 sm:p-9')}
                >
                  <div className="relative w-full h-full">
                    {/* sizes is hinted well above the panel's ~470px width on
                        purpose. This panel is taller than it is wide, so
                        object-cover scales a landscape source by HEIGHT — a 3:2
                        photo renders ~630 CSS px wide here, ~1260 at 2x. Hinting
                        the panel width served a 1080-wide file into that and the
                        upscale is what looked soft. */}
                    <Image
                      src={activeSlide.url}
                      alt={activeSlide.alt || headline}
                      fill
                      sizes="(max-width: 640px) 100vw, 640px"
                      quality={90}
                      className={hasOwnImagery ? 'object-cover' : 'object-contain'}
                      priority
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {slides.length > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    aria-label="Previous bundle image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center
                               bg-white/80 text-kawai-black/70 hover:bg-white hover:text-kawai-black transition-colors duration-200
                               focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red"
                    style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.10)' }}
                  >
                    <ChevronLeft size={16} strokeWidth={2.2} />
                  </button>
                  <button
                    onClick={goNext}
                    aria-label="Next bundle image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center
                               bg-white/80 text-kawai-black/70 hover:bg-white hover:text-kawai-black transition-colors duration-200
                               focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red"
                    style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.10)' }}
                  >
                    <ChevronRight size={16} strokeWidth={2.2} />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
                    {slides.map((slide, i) => (
                      <button
                        key={slide.url + i}
                        onClick={() => setSlideIndex(i)}
                        aria-label={`Show bundle image ${i + 1} of ${slides.length}`}
                        aria-current={i === slideIndex}
                        className={cn(
                          'h-1.5 rounded-full transition-all duration-300',
                          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red',
                          i === slideIndex ? 'w-5 bg-kawai-red' : 'w-1.5 bg-kawai-black/20 hover:bg-kawai-black/40',
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <PromoSheetHandle />

          {/* ── Right: the offer ──────────────────────────────────────────── */}
          <div className="px-7 sm:px-10 pt-6 sm:pt-11 pb-9 sm:pb-11 text-left flex flex-col justify-center">
            {eyebrow && (
              <motion.p
                {...fadeUp(0)}
                className="text-[9px] tracking-[0.45em] uppercase font-bold text-kawai-red mb-3.5"
                style={{ fontFamily: 'var(--font-brand-sans, system-ui)' }}
              >
                {eyebrow}
              </motion.p>
            )}

            <motion.h3
              {...fadeUp(1)}
              id={TITLE_ID}
              className="text-[26px] sm:text-[32px]"
              style={{
                fontFamily: 'var(--font-brand-luxury, Georgia, serif)',
                fontWeight: 500,
                lineHeight: 1.2,
                color: PROMO_TOKENS.titleColor,
                margin: '0 0 10px',
                letterSpacing: '-0.01em',
              }}
            >
              {headline}
            </motion.h3>

            {message && (
              <motion.p
                {...fadeUp(2)}
                id={MESSAGE_ID}
                style={{
                  fontFamily: 'var(--font-brand-sans, system-ui)',
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: PROMO_TOKENS.messageColor,
                  margin: '0 0 22px',
                  fontWeight: 400,
                }}
              >
                {message}
              </motion.p>
            )}

            {/* What's in the bundle, as a receipt.
                Rows rather than a "+" chain: thumbnails get to be big enough to
                recognise, prices line up in a column the eye can add, and a
                fourth piece costs a row instead of breaking the line. Piece names
                are not headings — a screen reader navigates by the dialog title. */}
            <motion.div
              {...fadeUp(3)}
              className="mb-6 text-left"
              style={{ fontFamily: 'var(--font-brand-sans, system-ui)' }}
            >
              <ul className="border-t border-kawai-black/[0.09]">
                {items.map((item, i) => (
                  <li
                    key={item.label + i}
                    className="flex items-center gap-3.5 py-2.5 border-b border-kawai-black/[0.09]"
                  >
                    <div className="relative w-[72px] h-14 shrink-0 overflow-hidden rounded-[3px] bg-white border border-kawai-black/[0.06]">
                      {item.imageUrl && (
                        <Image
                          src={item.imageUrl}
                          alt=""
                          fill
                          sizes="72px"
                          className="object-contain p-1"
                        />
                      )}
                    </div>
                    <span className="flex-1 min-w-0 truncate text-[13.5px] font-semibold text-kawai-black">
                      {item.label}
                    </span>
                    {typeof item.price === 'number' && item.price > 0 && (
                      <span className="shrink-0 text-[13.5px] tabular-nums text-kawai-black/65">
                        {formatPrice(item.price, currency)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              {/* The sum the rows above add up to, struck where it sits — same
                  column as the prices, so the eye reads the arithmetic. */}
              {separateTotal && showBundlePrice && (
                <div className="flex items-center justify-between gap-4 pt-2.5">
                  <span className="text-[9px] tracking-[0.22em] uppercase font-bold text-kawai-black/65">
                    Separately
                  </span>
                  <span className="relative text-[13.5px] font-semibold tabular-nums text-kawai-black/65">
                    {formatPrice(separateTotal, currency)}
                    {/* `top` is set rather than a -translate-y class: framer writes
                        its own transform for scaleX and would drop the class's. */}
                    <motion.span
                      aria-hidden
                      className="absolute left-0 right-0 h-[1.5px] origin-left"
                      style={{ top: 'calc(50% - 0.75px)', background: PROMO_TOKENS.accentBar }}
                      initial={{ scaleX: reduceMotion ? 1 : 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: reduceMotion ? 0 : 0.85, duration: reduceMotion ? 0 : 0.45 }}
                    />
                  </span>
                </div>
              )}
            </motion.div>

            {/* What you actually pay */}
            {(separateTotal || showBundlePrice) && (
              <motion.div
                {...fadeUp(4)}
                className="mb-7 text-left"
                style={{ fontFamily: 'var(--font-brand-sans, system-ui)' }}
              >
                {showBundlePrice ? (
                  <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1.5">
                    <motion.span
                      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
                      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: reduceMotion ? 0.1 : 1.15, duration: reduceMotion ? 0.2 : 0.5 }}
                      className="text-[34px] sm:text-[40px] font-bold leading-none tabular-nums"
                      style={{ color: PROMO_TOKENS.accentBar, letterSpacing: '-0.02em' }}
                    >
                      {formatPrice(bundlePrice, currency)}
                    </motion.span>
                    {savings && (
                      <span
                        className="inline-block rounded-[3px] px-2 py-[3px] text-[10px] tracking-[0.14em] uppercase font-bold text-kawai-black/70"
                        style={{ background: 'rgba(30,27,22,0.06)' }}
                      >
                        Save {formatPrice(savings, currency)}
                      </span>
                    )}
                  </div>
                ) : (
                  separateTotal && (
                    <span className="text-[24px] font-semibold tabular-nums text-kawai-black">
                      {formatPrice(separateTotal, currency)}
                    </span>
                  )
                )}

                {priceNote && (
                  <p className="mt-3 text-[11.5px] leading-relaxed text-kawai-black/65">{priceNote}</p>
                )}
              </motion.div>
            )}

            <motion.div {...fadeUp(5)}>
              <PromoCta
                href={href}
                label={ctaLabel || 'Shop the Bundle'}
                onNavigate={dismiss}
                onDismiss={dismiss}
                dismissLabel={dismissLabel || 'No thanks, continue browsing'}
                align="start"
              />
            </motion.div>
          </div>
        </div>
      )}
    </PromoPopupShell>
  )
}
