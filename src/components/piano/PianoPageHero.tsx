'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { MediaRenderer } from '@/components/ui/media/MediaRenderer'
import { useScrollAnimation, fadeUpClass } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'

export interface PianoPageHeroData {
  heroTitle: string
  heroDescription: string
  heroBackgroundImage?: string
  heroCta?: {
    text: string
    link: string
  }
}

interface PianoPageHeroProps {
  heroData: PianoPageHeroData
}

export function PianoPageHero({ heroData }: PianoPageHeroProps) {
  const heroAnimation = useScrollAnimation({ threshold: 0.1 })

  return (
    <section 
      ref={heroAnimation.ref as React.RefObject<HTMLElement>} 
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Hero Background Image */}
      {heroData.heroBackgroundImage && (
        <div className="absolute inset-0 z-0">
          <MediaRenderer
            media={heroData.heroBackgroundImage}
            preset="hero"
            priority={true}
            className="absolute inset-0 w-full h-full object-cover [&_img]:object-left"
          />
          <div className="absolute inset-0 bg-white/20" />
        </div>
      )}
      
      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="max-w-2xl">
          <h1 className={cn(
            'text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-kawai-black mb-6',
            fadeUpClass(heroAnimation.isVisible)
          )}>
            {heroData.heroTitle}
          </h1>
          <p className={cn(
            'text-xl md:text-2xl leading-relaxed text-kawai-black/80 mb-8',
            fadeUpClass(heroAnimation.isVisible, 200)
          )}>
            {heroData.heroDescription}
          </p>
          <div className={fadeUpClass(heroAnimation.isVisible, 400)}>
            <Link
              href={heroData.heroCta?.link || "#categories"}
              className="inline-flex items-center px-8 py-4 bg-kawai-black hover:bg-kawai-black/80 text-kawai-pearl font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group text-lg"
            >
              <span>{heroData.heroCta?.text || "Explore Categories"}</span>
              <ArrowRight className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}