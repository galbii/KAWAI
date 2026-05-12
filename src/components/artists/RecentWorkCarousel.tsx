'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react'
import { SocialBrandIcon } from './SocialBrandIcon'

interface RecentWorkCarouselProps {
  works: {
    title: string
    description?: string | null
    date?: string | null
    platform?: string | null
    link?: string | null
    featured?: boolean | null
    id?: string | null
  }[]
  artistName: string
}

function formatWorkDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(
      new Date(dateStr),
    )
  } catch {
    return dateStr
  }
}

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname.startsWith('/embed/')) return u.pathname.split('/embed/')[1]?.split('/')[0] ?? null
      if (u.pathname.startsWith('/shorts/')) return u.pathname.split('/shorts/')[1]?.split('/')[0] ?? null
      return u.searchParams.get('v')
    }
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('/')[0] ?? null
  } catch {
    // not a valid URL
  }
  return null
}

export function RecentWorkCarousel({ works, artistName }: RecentWorkCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const startAutoplay = () => {
    if (reducedMotion || !api) return
    intervalRef.current = setInterval(() => {
      api.scrollNext()
    }, 3000)
  }

  const pauseAutoplay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const resumeAutoplay = () => {
    pauseAutoplay()
    startAutoplay()
  }

  useEffect(() => {
    if (!api) return
    startAutoplay()
    return () => pauseAutoplay()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api])

  return (
    <section className="py-16 bg-kawai-pearl">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-kawai-red text-xs font-semibold uppercase tracking-widest mb-2">
              Recent Work
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-kawai-black font-[family-name:var(--font-brand-serif)]">
              {artistName}&apos;s Latest
            </h2>
          </div>

          {/* Prev / Next */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => api?.scrollPrev()}
              className="w-10 h-10 rounded-full bg-white border border-kawai-neutral shadow-brand-subtle flex items-center justify-center text-kawai-charcoal hover:bg-kawai-black hover:text-white hover:border-kawai-black transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="sr-only">Previous</span>
            </button>
            <button
              onClick={() => api?.scrollNext()}
              className="w-10 h-10 rounded-full bg-white border border-kawai-neutral shadow-brand-subtle flex items-center justify-center text-kawai-charcoal hover:bg-kawai-black hover:text-white hover:border-kawai-black transition-all duration-200"
            >
              <ChevronRight className="w-4 h-4" />
              <span className="sr-only">Next</span>
            </button>
          </div>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{ loop: true, align: 'start' }}
          setApi={setApi}
          onMouseEnter={pauseAutoplay}
          onMouseLeave={resumeAutoplay}
        >
          <CarouselContent className="-ml-4">
            {works.map((work, i) => {
              const youtubeId = work.link ? extractYouTubeId(work.link) : null

              if (youtubeId !== null) {
                return (
                  <CarouselItem
                    key={work.id ?? i}
                    className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <div
                      className={cn(
                        'rounded-2xl overflow-hidden h-full flex flex-col shadow-brand-medium bg-kawai-charcoal',
                        work.featured && 'ring-2 ring-kawai-red',
                      )}
                    >
                      {/* Platform bar — matches non-YouTube card header */}
                      <div className="px-5 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <SocialBrandIcon platform="youtube" className="w-4 h-4" />
                          <span className="text-xs text-white/50 font-medium">YouTube</span>
                        </div>
                        {work.date && (
                          <span className="text-xs text-white/30">{formatWorkDate(work.date)}</span>
                        )}
                      </div>

                      {/* YouTube embed */}
                      <div className="aspect-video w-full bg-black">
                        <iframe
                          src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                          title={work.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full block"
                        />
                      </div>

                      {/* Title strip */}
                      <div className="px-5 py-4">
                        <p className="font-bold text-white text-sm leading-snug line-clamp-2">
                          {work.title}
                        </p>
                        {work.description && (
                          <p className="text-xs text-white/40 leading-relaxed line-clamp-1 mt-1">
                            {work.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CarouselItem>
                )
              }

              const card = (
                <div
                  className={cn(
                    'bg-white rounded-2xl overflow-hidden transition-all duration-300 group h-full flex flex-col',
                    work.featured && 'ring-2 ring-kawai-red',
                    work.link && 'hover:shadow-brand-premium cursor-pointer',
                  )}
                >
                  {/* Header bar */}
                  <div className="bg-kawai-charcoal px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {work.platform && (
                        <SocialBrandIcon platform={work.platform} className="w-4 h-4" />
                      )}
                      {work.platform && (
                        <span className="text-xs text-white/50 font-medium capitalize">
                          {work.platform}
                        </span>
                      )}
                    </div>
                    {work.date && (
                      <span className="text-xs text-white/30">{formatWorkDate(work.date)}</span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1">
                    <p className="font-bold text-kawai-black text-base leading-tight mb-2">
                      {work.title}
                    </p>
                    {work.description && (
                      <p className="text-sm text-kawai-charcoal/80 leading-relaxed line-clamp-3">
                        {work.description}
                      </p>
                    )}
                  </div>

                  {/* Footer */}
                  {work.link && (
                    <div className="px-5 pb-5 mt-auto">
                      <span className="inline-flex items-center gap-1.5 text-kawai-red text-xs font-semibold">
                        View
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </span>
                    </div>
                  )}
                </div>
              )

              return (
                <CarouselItem
                  key={work.id ?? i}
                  className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  {work.link ? (
                    <a
                      href={work.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full"
                    >
                      {card}
                    </a>
                  ) : (
                    card
                  )}
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}
