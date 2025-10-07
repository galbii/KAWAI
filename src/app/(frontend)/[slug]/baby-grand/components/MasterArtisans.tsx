'use client'

import Image from 'next/image'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'

interface MasterArtisan {
  name: string
  nameJapanese: string
  title: string
  experience: number
  signature: string
  specialty: string
  image: string
}

interface MasterArtisansProps {
  className?: string
}

export function MasterArtisans({ className = '' }: MasterArtisansProps) {
  const masterArtisans: MasterArtisan[] = [
    {
      name: 'Naoto Ichikawa',
      nameJapanese: '市川直人',
      title: 'Master Piano Artisan',
      experience: 30,
      signature: '',
      specialty: 'Naoto \'Nick\' Ichikawa is at the very height of his profession. Depth of experience, refined talents, and passion to his craft qualifies Naoto as one of Kawai\'s select Master Piano Artisans.',
      image: '/images/signature/artisan-ichikawa.webp'
    },
    {
      name: 'David Reed',
      nameJapanese: 'デビッド・リード',
      title: 'Master Piano Artisan',
      experience: 25,
      signature: '',
      specialty: 'David Reed is a newly certified Master Piano Artisan who has always been intrigued by the mechanics of acoustic pianos, in addition to being a lifelong pianist.',
      image: '/images/signature/artisan-reed.webp'
    },
    {
      name: 'Tatsuya Murakami',
      nameJapanese: '村上達也',
      title: 'Master Piano Artisan',
      experience: 25,
      signature: '',
      specialty: 'Tatsuya Murakami is an eminently talented piano craftsman who has travelled extensively in support of Shigeru Kawai piano owners and international piano competitions.',
      image: '/images/signature/artisan-murakami.webp'
    }
  ]

  return (
    <section className={`relative py-20 md:py-32 bg-gradient-to-b from-kawai-black via-gray-900 to-kawai-black overflow-hidden ${className}`}>
      {/* Background texture and lighting */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-kawai-gold/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_var(--tw-gradient-stops))] from-kawai-gold/3 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">

        {/* Header Section */}
        <div className="text-center max-w-6xl mx-auto mb-20">
          <div className="inline-block text-kawai-gold text-sm font-light tracking-[0.3em] uppercase mb-12 border border-kawai-gold/30 px-6 py-3 rounded-full">
            Crafted by Master Piano Artisans
          </div>
        </div>

        {/* Master Artisans Section */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-light text-kawai-pearl mb-4">
              Master <span className="text-kawai-gold">Artisans</span>
            </h3>
            <p className="text-kawai-pearl/70 font-light max-w-2xl mx-auto">
              Kawai entrusts only its finest and skilled artisans to create and tune their finest products,
              ensuring a performance fit for the world's finest concert halls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {masterArtisans.map((artisan, index) => {
              const imageProps = getImagePropsWithFallback(
                artisan.image,
                '/images/signature/fallback-artisan.webp',
                'gallery',
                {
                  fill: true,
                  className: 'object-cover object-center group-hover:scale-105 transition-transform duration-500'
                }
              )

              return (
                <div
                  key={artisan.name}
                  className="rounded-lg border border-kawai-gold/20 bg-gradient-to-br from-kawai-black/30 to-transparent group hover:border-kawai-gold/40 transition-all duration-500 overflow-hidden hover:-translate-y-2"
                >
                  {/* Large Image with Overlay */}
                  <div className="relative h-96 overflow-hidden">
                    <Image
                      {...imageProps}
                      alt={`Master Artisan ${artisan.name}`}
                    />

                    {/* Default gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-kawai-black/80 via-kawai-black/30 to-transparent" />

                    {/* Always visible text overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                      <h4 className="text-kawai-pearl text-xl font-medium mb-1 group-hover:text-kawai-gold transition-colors duration-300">
                        {artisan.name}
                      </h4>
                      <div className="text-kawai-gold text-sm font-light mb-1">{artisan.nameJapanese}</div>
                      <div className="text-kawai-pearl/80 text-sm">{artisan.title}</div>
                    </div>

                    {/* Hover overlay with description */}
                    <div className="absolute inset-0 bg-kawai-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-6">
                      <div className="text-center max-w-xs">
                        <h4 className="text-kawai-gold text-xl font-medium mb-3">
                          {artisan.name}
                        </h4>
                        <div className="text-kawai-gold text-sm font-light mb-3">{artisan.nameJapanese}</div>
                        <div className="text-kawai-pearl/90 text-sm leading-relaxed mb-4">
                          {artisan.specialty}
                        </div>
                        <div className="text-kawai-pearl/70 text-xs">
                          {artisan.experience} years experience
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-kawai-gold/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-kawai-gold/20 to-transparent" />
    </section>
  )
}