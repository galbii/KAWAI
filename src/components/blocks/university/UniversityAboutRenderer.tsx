'use client'

import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import type { Media } from '@/payload-types'
import { cn } from '@/lib/utils'

interface GalleryItem {
  image: Media | string | null
  caption?: string | null
}

interface DescriptionParagraph {
  text: string
}

interface UniversityAboutRendererProps {
  block: any // UniversityAboutBlock — typed as any until payload types are generated
}

function isMediaObject(media: Media | string | null | undefined): media is Media {
  return typeof media === 'object' && media !== null && 'url' in media
}

function useIntersectionVisible<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px', ...options },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}

const bgColorMap: Record<string, string> = {
  white: 'bg-white',
  pearl: 'bg-kawai-pearl',
  black: 'bg-kawai-black text-kawai-pearl',
}

/**
 * Maps gallery index to a bento grid layout class (desktop).
 * Index 0 is the hero (large), the rest fill out a mosaic.
 */
function getBentoClass(index: number, total: number): string {
  if (index === 0) return 'col-span-3 row-span-2' // hero cell
  if (total <= 3) return 'col-span-3 row-span-1'
  if (index === 1) return 'col-span-3 row-span-1'
  if (index === 2) return 'col-span-2 row-span-1'
  if (index === 3) return 'col-span-1 row-span-1'
  if (index === 4) return 'col-span-3 row-span-1'
  return 'col-span-3 row-span-1'
}

export const UniversityAboutRenderer: React.FC<UniversityAboutRendererProps> = ({ block }) => {
  const { ref: headerRef, isVisible: headerVisible } = useIntersectionVisible<HTMLDivElement>()
  const { ref: contentRef, isVisible: contentVisible } = useIntersectionVisible<HTMLDivElement>({ threshold: 0.1 })
  const { ref: galleryRef, isVisible: galleryVisible } = useIntersectionVisible<HTMLDivElement>({ threshold: 0.05 })

  const partnerLogo = isMediaObject(block.partnerLogo) ? block.partnerLogo : null
  const partnershipDocument = isMediaObject(block.partnershipDocument)
    ? block.partnershipDocument
    : null

  const gallery: GalleryItem[] = Array.isArray(block.gallery) ? block.gallery : []
  const paragraphs: DescriptionParagraph[] = Array.isArray(block.descriptionParagraphs)
    ? block.descriptionParagraphs
    : []

  const bgClass = bgColorMap[block.backgroundColor ?? 'white'] ?? 'bg-white'
  const isOnDark = block.backgroundColor === 'black'

  // Split heading at highlight text for red colouring
  const heading: string = block.sectionHeading ?? ''
  const highlight: string = block.headingHighlight ?? ''
  const headingParts = highlight && heading.includes(highlight)
    ? heading.split(highlight)
    : null

  return (
    <>
      {/* Category label bar */}
      {block.categoryLabel && (
        <div
          ref={headerRef}
          className={cn(
            'py-4 border-b border-kawai-neutral',
            isOnDark ? 'bg-kawai-black border-kawai-charcoal' : 'bg-white',
          )}
        >
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p
              className={cn(
                'text-xs sm:text-sm font-normal tracking-wider leading-relaxed transition-all duration-700',
                isOnDark ? 'text-kawai-pearl/60' : 'text-kawai-charcoal/60',
                headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4',
              )}
            >
              {block.categoryLabel}
            </p>
          </div>
        </div>
      )}

      <section
        id="about-event"
        className={cn('py-16 sm:py-20 lg:py-24', bgClass)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Content grid: description left, document preview right */}
          <div
            ref={contentRef}
            className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          >
            {/* Left column */}
            <div className="space-y-4 sm:space-y-6">
              {/* Partner logo + heading */}
              <div className="flex flex-col items-center text-center mb-6">
                {partnerLogo?.url && (
                  <Image
                    src={partnerLogo.url}
                    alt={partnerLogo.alt ?? 'Partner logo'}
                    width={240}
                    height={60}
                    className={cn(
                      'h-16 w-auto mb-4 transition-all duration-600 delay-200',
                      contentVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
                    )}
                  />
                )}
                {heading && (
                  <h2
                    className={cn(
                      'text-2xl md:text-3xl font-bold tracking-tight transition-all duration-600 delay-400',
                      isOnDark ? 'text-kawai-pearl' : 'text-kawai-black',
                      contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
                    )}
                  >
                    {headingParts ? (
                      <>
                        {headingParts[0]}
                        <span className="text-kawai-red">{highlight}</span>
                        {headingParts[1]}
                      </>
                    ) : (
                      heading
                    )}
                  </h2>
                )}
              </div>

              {/* Description paragraphs */}
              {paragraphs.length > 0 && (
                <div
                  className={cn(
                    'space-y-4 leading-relaxed',
                    isOnDark ? 'text-kawai-pearl/80' : 'text-kawai-charcoal',
                  )}
                >
                  {paragraphs.map((p, i) => (
                    <p
                      key={i}
                      className={cn(
                        'text-base transition-all duration-600',
                        contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
                      )}
                      style={{ transitionDelay: `${400 + i * 150}ms` }}
                    >
                      {p.text}
                    </p>
                  ))}
                </div>
              )}

              {/* PDF button */}
              {block.showDocumentButton && partnershipDocument?.url && (
                <div
                  className={cn(
                    'pt-2 transition-all duration-700',
                    contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
                  )}
                  style={{ transitionDelay: '900ms' }}
                >
                  <a
                    href={partnershipDocument.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium',
                      'border-2 border-kawai-red text-kawai-red hover:bg-kawai-red hover:text-white',
                      'transition-all duration-300',
                    )}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    {block.documentButtonLabel ?? 'View Partnership Letter'}
                  </a>
                </div>
              )}
            </div>

            {/* Right column: document preview (desktop only) */}
            {partnershipDocument?.url && (
              <div
                className={cn(
                  'hidden lg:flex justify-center items-center transition-all duration-700 delay-700',
                  contentVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-6 scale-95',
                )}
              >
                <div className="relative w-full max-w-md aspect-[3/4] rounded-lg overflow-hidden shadow-brand-premium border border-kawai-neutral">
                  <iframe
                    src={`${partnershipDocument.url}#toolbar=0&view=FitH`}
                    title="Partnership document"
                    className="w-full h-full"
                  />
                  {/* Overlay to block iframe interaction — keeps layout clean */}
                  <a
                    href={partnershipDocument.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 cursor-pointer"
                    aria-label="Open partnership document"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Gallery */}
          {gallery.length > 0 && (
            <div ref={galleryRef} className="mt-12 sm:mt-16 overflow-hidden">
              {/* Desktop bento grid */}
              <div className="hidden md:grid grid-cols-6 gap-0 min-h-[40rem] w-full">
                {gallery.slice(0, 6).map((item, i) => {
                  const img = isMediaObject(item.image) ? item.image : null
                  if (!img?.url) return null
                  const bentoClass = getBentoClass(i, gallery.length)
                  return (
                    <div
                      key={i}
                      className={cn(
                        bentoClass,
                        'relative overflow-hidden',
                        'transition-all duration-700 hover:scale-105 cursor-zoom-in',
                        galleryVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
                      )}
                      style={{ transitionDelay: `${i * 120}ms` }}
                      title={item.caption ?? undefined}
                    >
                      <Image
                        src={img.url}
                        alt={item.caption ?? img.alt ?? `Gallery image ${i + 1}`}
                        fill
                        sizes={i === 0 ? '50vw' : '33vw'}
                        className="object-cover pointer-events-none"
                      />
                    </div>
                  )
                })}
              </div>

              {/* Mobile 2-col grid */}
              <div className="md:hidden grid grid-cols-2 gap-2 sm:gap-3">
                {gallery.slice(0, 6).map((item, i) => {
                  const img = isMediaObject(item.image) ? item.image : null
                  if (!img?.url) return null
                  const isHero = i === 0
                  return (
                    <div
                      key={i}
                      className={cn(
                        isHero ? 'col-span-2 h-52 sm:h-64' : 'h-36 sm:h-44',
                        'relative overflow-hidden rounded-lg',
                        'transition-all duration-700 hover:scale-105 cursor-zoom-in',
                        galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
                      )}
                      style={{ transitionDelay: `${i * 100}ms` }}
                    >
                      <Image
                        src={img.url}
                        alt={item.caption ?? img.alt ?? `Gallery image ${i + 1}`}
                        fill
                        sizes={isHero ? '100vw' : '50vw'}
                        className="object-cover pointer-events-none"
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
