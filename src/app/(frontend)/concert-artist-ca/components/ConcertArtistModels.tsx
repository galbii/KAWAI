'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'
import { useInView } from 'framer-motion'
import type { ConcertArtistPage } from '@/payload-types'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import YouTubeEmbed from '@/components/ui/youtube-embed'

interface ConcertArtistModelsProps {
  data?: ConcertArtistPage | null
}

export default function ConcertArtistModels({ data }: ConcertArtistModelsProps) {
  // Get models from CMS or use fallback
  const modelsData = data?.modelsOverviewSection
  const sectionHeader = modelsData?.sectionHeader || 'The Lineup'
  const sectionTitle = modelsData?.sectionTitle || 'Four Voices, One Vision'

  const cmsModels = data?.concertArtistModels || []
  const fallbackModels = [
    {
      name: 'CA401',
      tagline: 'Where Mastery Begins',
      descriptor: 'Entry to the Concert Artist lineage—wooden keys from lesson one',
      image: '/images/concert-artist/ca401.jpg',
      link: '/products/ca401',
    },
    {
      name: 'CA501',
      tagline: 'The Journey Instrument',
      descriptor: 'Professional sound and features supporting Grade 1 through Graduate-level growth',
      image: '/images/concert-artist/ca501.jpg',
      link: '/products/ca501',
    },
    {
      name: 'CA701',
      tagline: 'The Artist\'s Choice',
      descriptor: 'Grand Feel III action and SK-EX Rendering for those who demand concert-level practice',
      image: '/images/concert-artist/ca701.jpg',
      link: '/products/ca701',
    },
    {
      name: 'CA901',
      tagline: 'The Master\'s Companion',
      descriptor: 'TwinDrive genuine spruce soundboard—concert physics in your home',
      image: '/images/concert-artist/ca901.jpg',
      link: '/products/ca901',
    },
  ]

  const models = cmsModels.length > 0 ? cmsModels : fallbackModels
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="bg-white py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-20 text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px bg-black/20 w-12"></div>
            <p className="text-[11px] md:text-xs font-medium uppercase tracking-[0.25em] text-black/60">
              {sectionHeader}
            </p>
            <div className="h-px bg-black/20 w-12"></div>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-black leading-tight">
            {sectionTitle}
          </h2>
        </motion.div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 lg:gap-8">
          {models.map((model, index) => {
            const imageProps = getImagePropsWithFallback(
              model.image,
              '/images/concert-artist/placeholder.jpg',
              'card',
              {
                sizes: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw'
              }
            )

            return (
              <motion.div
                key={model.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <a
                  href="https://kawaius.com/find-a-dealer/acoustic-digital/?utm_source=kawaipianogallery&utm_medium=referral&utm_campaign=CA_Series_CampaignCAD&utm_content=model_overview_cta&utm_term=concert_artist"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  onClick={() => {
                    // Track to Meta Pixel - ViewContent event
                    if (typeof window !== 'undefined' && (window as any).fbq) {
                      (window as any).fbq('track', 'ViewContent', {
                        content_name: model.name,
                        content_ids: [model.name.toLowerCase()],
                        content_type: 'product',
                        content_category: 'Digital Piano - Concert Artist',
                        utm_campaign: 'CA_Series_CampaignCAD',
                        source: 'concert_artist_ca_overview'
                      })
                      console.log('🎯 Meta Pixel: ViewContent event tracked', { model: model.name })
                    }
                  }}
                >
                  {/* Model Card */}
                  <div className="space-y-4">
                    {/* Product Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 mb-6">
                      <Image
                        {...imageProps}
                        alt={`${model.name} - ${model.tagline}`}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                  <div className="pb-6 border-b border-black/10 transition-all duration-300 group-hover:border-black/30">
                    {/* Model Name */}
                    <h3 className="font-serif text-3xl md:text-4xl text-black font-light mb-3">
                      {model.name}
                    </h3>

                    {/* Tagline */}
                    <p className="text-xs uppercase tracking-[0.2em] text-black/60 font-medium mb-3">
                      {model.tagline}
                    </p>

                    {/* Divider */}
                    <div className="h-px bg-black/10 w-8 mb-3"></div>

                    {/* Descriptor */}
                    <p className="text-sm leading-relaxed text-black/70 font-light min-h-[4rem] mb-4">
                      {model.descriptor}
                    </p>

                    {/* Find a dealer Link */}
                    <div className="flex items-center text-xs uppercase tracking-wider text-black/60 group-hover:text-black transition-colors">
                      <span>Find a dealer</span>
                      <svg
                        className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            </motion.div>
          )})}
        </div>

        {/* Showcase Video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 md:mt-20"
        >
          <div className="max-w-5xl mx-auto">
            <div className="[&_.group]:hover:scale-100 [&_img]:!transition-none [&_button]:hover:scale-100">
              <YouTubeEmbed
                videoId="WW6Us-oDKIY"
                title="Four Voices, One Vision - Concert Artist Series"
                aspectRatio="video"
                showTitle={false}
                privacy={true}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
