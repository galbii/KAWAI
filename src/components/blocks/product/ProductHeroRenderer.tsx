import React from 'react'
import Image from 'next/image'
import type { ProductHeroBlock } from '@/payload-types'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import { cn } from '@/lib/utils'

interface ProductHeroRendererProps extends ProductHeroBlock {}

export function ProductHeroRenderer({
  layout,
  overrides,
}: ProductHeroRendererProps) {
  const bgColorClasses = {
    pearl: 'bg-kawai-pearl',
    white: 'bg-white',
    black: 'bg-kawai-black text-white',
  }

  const backgroundColor = layout?.backgroundColor || 'pearl'
  const imagePosition = layout?.imagePosition || 'left'
  const isBlack = backgroundColor === 'black'

  const imageFirst = imagePosition === 'left'

  return (
    <section
      className={cn(
        'min-h-screen flex flex-col md:flex-row',
        bgColorClasses[backgroundColor as keyof typeof bgColorClasses]
      )}
    >
      {/* ── IMAGE HALF ─────────────────────────────────────────────────── */}
      {overrides?.customImage && (
        <div
          className={cn(
            'relative w-full md:w-1/2 min-h-[50vh] md:min-h-screen flex-shrink-0',
            'group overflow-hidden',
            !imageFirst && 'md:order-last'
          )}
        >
          {(() => {
            const imageProps = getImagePropsWithFallback(
              overrides.customImage,
              '/images/defaults/product-hero.jpg',
              'hero'
            )
            return (
              <Image
                {...imageProps}
                alt={overrides.customTitle || ''}
                fill
                className="object-cover object-center transition-transform duration-700 ease-[var(--ease-elegant)] group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            )
          })()}

          {/* Subtle inner shadow to ground the image edge */}
          <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(30,27,22,0.08)] pointer-events-none" />

          {/* Badge */}
          {overrides?.badge && (
            <div className="absolute top-6 right-6 bg-kawai-red text-white px-4 py-2 font-bold text-xs tracking-[0.2em] uppercase">
              {overrides.badge}
            </div>
          )}
        </div>
      )}

      {/* ── TEXT HALF ──────────────────────────────────────────────────── */}
      <div
        className={cn(
          'flex-1 flex flex-col justify-center',
          'px-8 py-16 md:px-14 lg:px-20 xl:px-24',
          'md:min-h-screen',
          !imageFirst && 'md:order-first'
        )}
      >
        {overrides?.customTitle && (
          <h1
            className={cn(
              'font-[family-name:var(--font-brand-luxury)] font-semibold leading-[1.06] tracking-tight',
              'text-8xl lg:text-9xl',
              'mb-6',
              isBlack ? 'text-white' : 'text-kawai-black'
            )}
          >
            {overrides.customTitle}
          </h1>
        )}

        {overrides?.customDescription && (
          <p
            className={cn(
              'text-lg sm:text-xl leading-relaxed max-w-lg',
              'mb-10',
              isBlack ? 'text-white/70' : 'text-kawai-charcoal/70'
            )}
          >
            {overrides.customDescription}
          </p>
        )}

        {/* Thin accent rule */}
        <div className={cn('w-12 h-px mb-10', isBlack ? 'bg-white/20' : 'bg-kawai-neutral')} />
      </div>
    </section>
  )
}
