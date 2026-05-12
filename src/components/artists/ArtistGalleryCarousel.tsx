'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import type { Media } from '@/payload-types'

interface GalleryItem {
  image?: (string | null) | Media
  url?: string | null
  id?: string | null
}

interface ArtistGalleryCarouselProps {
  gallery: GalleryItem[]
  artistName: string
}

function resolveUrl(item: GalleryItem): string | null {
  const { image, url } = item
  if (image) {
    if (typeof image === 'string') return image || null
    if (image.url) return image.url
  }
  return url ?? null
}

function resolveAlt(item: GalleryItem, artistName: string): string {
  if (item.image && typeof item.image === 'object' && item.image.alt) return item.image.alt
  return `${artistName} gallery photo`
}

export function ArtistGalleryCarousel({ gallery, artistName }: ArtistGalleryCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  const validItems = gallery.filter(item => resolveUrl(item) !== null)

  useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())
    api.on('select', () => setCurrent(api.selectedScrollSnap()))
  }, [api])

  if (validItems.length === 0) return null

  return (
    <section className="bg-white py-14 md:py-20">
      {/* Label + counter */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mb-6 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-kawai-charcoal/40">
          Gallery
        </p>
        {count > 1 && (
          <span className="text-xs tabular-nums text-kawai-charcoal/30 select-none">
            {current + 1} / {count}
          </span>
        )}
      </div>

      {/* Carousel wrapper — padded container, arrows overlaid */}
      <div className="relative px-6 md:px-12">
        <Carousel
          opts={{ loop: true, align: 'start' }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="-ml-3 md:-ml-4">
            {validItems.map((item, i) => {
              const url = resolveUrl(item)!
              const alt = resolveAlt(item, artistName)

              return (
                <CarouselItem
                  key={item.id ?? i}
                  className="pl-3 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-kawai-neutral">
                    <Image
                      src={url}
                      alt={alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                    />
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>

        {/* Side arrows */}
        {count > 1 && (
          <>
            <button
              onClick={() => api?.scrollPrev()}
              aria-label="Previous photo"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-brand-medium border border-kawai-neutral flex items-center justify-center text-kawai-charcoal hover:bg-kawai-black hover:text-white hover:border-kawai-black transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              aria-label="Next photo"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-brand-medium border border-kawai-neutral flex items-center justify-center text-kawai-charcoal hover:bg-kawai-black hover:text-white hover:border-kawai-black transition-all duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Dot indicators */}
      {count > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-6">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              aria-label={`Go to photo ${i + 1}`}
              className={cn(
                'rounded-full transition-all duration-300',
                i === current
                  ? 'w-5 h-1.5 bg-kawai-black'
                  : 'w-1.5 h-1.5 bg-kawai-neutral hover:bg-kawai-charcoal/40',
              )}
            />
          ))}
        </div>
      )}
    </section>
  )
}
