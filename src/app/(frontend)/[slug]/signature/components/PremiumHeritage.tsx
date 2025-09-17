'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import Image from 'next/image'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import { cn } from '@/lib/utils'

// Global YouTube API type declaration
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

// Interfaces
interface HeritageAchievement {
  number: number
  suffix: string
  label: string
  description: string
}

interface HeritageMilestone {
  year: number
  title: string
  description: string
  icon: string
}

interface MasterArtisan {
  name: string
  nameJapanese: string
  title: string
  experience: number
  signature: string
  specialty: string
  image: string
}

interface PremiumHeritageProps {
  className?: string
}

// Animated counter component
function AnimatedCounter({
  from = 0,
  to,
  suffix = '',
  duration = 2
}: {
  from?: number
  to: number
  suffix?: string
  duration?: number
}) {
  const [count, setCount] = useState(from)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (inView) {
      let start = from
      const increment = (to - from) / (duration * 60) // 60fps
      const timer = setInterval(() => {
        start += increment
        if (start >= to) {
          setCount(to)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 1000 / 60)

      return () => clearInterval(timer)
    }
  }, [inView, from, to, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

// Premium button component
interface PremiumButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'md' | 'lg'
  className?: string
  onClick?: () => void
}

function PremiumButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick
}: PremiumButtonProps) {
  const baseStyles = "relative font-medium tracking-wide transition-all duration-500 overflow-hidden group focus:outline-none focus:ring-2 focus:ring-kawai-gold/30 border"

  const variants = {
    primary: "bg-kawai-gold text-kawai-black border-kawai-gold hover:bg-kawai-gold/90 hover:border-kawai-gold/90 shadow-lg hover:shadow-xl",
    secondary: "bg-transparent text-kawai-gold border-kawai-gold/40 hover:bg-kawai-gold/10 hover:border-kawai-gold backdrop-blur-sm"
  }

  const sizes = {
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  }

  return (
    <motion.button
      onClick={onClick}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {/* Golden shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-kawai-gold/20 to-transparent transition-transform duration-1000"></div>
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

// YouTube video component with scroll-triggered playback
function YouTubeVideo({ videoId }: { videoId: string }) {
  const videoRef = useRef<HTMLDivElement>(null)
  const [player, setPlayer] = useState<any>(null)
  const isInView = useInView(videoRef, { once: true, margin: "-100px" })

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      script.async = true
      document.body.appendChild(script)

      window.onYouTubeIframeAPIReady = () => {
        initializePlayer()
      }
    } else {
      initializePlayer()
    }

    function initializePlayer() {
      if (videoRef.current) {
        const newPlayer = new window.YT.Player(videoRef.current.querySelector('iframe'), {
          events: {
            onReady: (event: any) => {
              setPlayer(event.target)
            }
          }
        })
      }
    }

    return () => {
      if (player) {
        player.destroy()
      }
    }
  }, [])

  useEffect(() => {
    if (player && isInView) {
      player.playVideo()
    }
  }, [player, isInView])

  return (
    <div ref={videoRef} className="max-w-4xl mx-auto mb-8">
      <div className="relative aspect-video rounded-lg overflow-hidden border border-kawai-gold/20 shadow-2xl">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&mute=1&rel=0&modestbranding=1&showinfo=0&controls=1`}
          title="Kawai Signature Collection"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  )
}

// Main PremiumHeritage component
export function PremiumHeritage({ className = '' }: PremiumHeritageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  // Heritage data
  const achievements: HeritageAchievement[] = [
    {
      number: 100,
      suffix: '',
      label: 'Years of Heritage',
      description: '100 years of advancement, knowledge and craftsmanship'
    },
    {
      number: 400,
      suffix: '',
      label: 'Annual Production',
      description: 'Meticulously handcrafted in carefully limited numbers'
    },
    {
      number: 12,
      suffix: '',
      label: 'Master Artisans',
      description: 'Highest level of piano craftsmanship in Japan'
    }
  ]

  const milestones: HeritageMilestone[] = [
    {
      year: 1927,
      title: 'Kawai Founded',
      description: 'Koichi Kawai begins his spiritual quest to design the finest piano',
      icon: '🏛️'
    },
    {
      year: 1980,
      title: 'Shigeru Kawai Born',
      description: 'Premium line established with uncompromising craftsmanship',
      icon: '⭐'
    },
    {
      year: 2000,
      title: 'Master Artisan Program',
      description: 'Elite craftsmen dedicate their lives to perfecting the art',
      icon: '👨‍🎨'
    },
    {
      year: 2025,
      title: 'Signature Collection',
      description: 'Your invitation to transform your space into a concert hall',
      icon: '🎹'
    }
  ]

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
      signature: '', // Remove signature for David Reed
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

  const handleAssessmentClick = () => {
    const assessmentSection = document.getElementById('signature-experience')
    if (assessmentSection) {
      assessmentSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleCollectionClick = () => {
    const assessmentSection = document.getElementById('signature-experience')
    if (assessmentSection) {
      assessmentSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleShowroomClick = () => {
    const bentoSection = document.getElementById('premium-bento-gallery')
    if (bentoSection) {
      bentoSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative py-20 md:py-32 bg-gradient-to-b from-kawai-black via-gray-900 to-kawai-black overflow-hidden",
        className
      )}
    >
      {/* Background texture and lighting */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-kawai-gold/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_var(--tw-gradient-stops))] from-kawai-gold/3 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-kawai-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-kawai-gold/10 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">

        {/* Header Section */}
        <motion.div
          className="text-center max-w-6xl mx-auto mb-20"
          style={{ y, opacity }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-block text-kawai-gold text-sm font-light tracking-[0.3em] uppercase mb-6 border border-kawai-gold/30 px-6 py-3 rounded-full backdrop-blur-sm">
            Crafted by Master Piano Artisans
          </div>

          {/* YouTube Video with Scroll-Triggered Playback */}
          <YouTubeVideo videoId="1cmwb6evs2A" />

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-kawai-pearl leading-tight mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              Transform Your Space Into A{' '}
            </motion.span>
            <motion.span
              className="text-kawai-gold font-normal inline-block"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              Concert Hall
            </motion.span>
          </motion.h2>

          <div className="max-w-5xl mx-auto mb-8">
            <motion.div
              className="relative pl-6 border-l-2 border-kawai-gold/30 bg-gradient-to-r from-kawai-gold/5 to-transparent rounded-r-lg p-6"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.0, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <motion.p
                className="text-xl md:text-2xl text-kawai-pearl font-light leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.3 }}
                viewport={{ once: true }}
              >
                <span className="font-medium">Your invitation</span> to the{' '}
                <span className="text-kawai-gold font-medium">Kawai Signature Collection</span> — where each instrument carries a{' '}
                <span className="text-kawai-gold">century of musical history</span>,
                artistic cultivation, and the devoted craftsmanship of{' '}
                <span className="text-kawai-gold">master artisans</span> at the highest level of piano excellence.
              </motion.p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <PremiumButton
                variant="primary"
                size="lg"
                onClick={handleAssessmentClick}
              >
                Reserve Your Spot
              </PremiumButton>
              <PremiumButton
                variant="secondary"
                size="lg"
                onClick={handleShowroomClick}
              >
                View Showroom
              </PremiumButton>
            </motion.div>
          </div>
        </motion.div>



        {/* Master Artisans Section */}
        <motion.div
          className="max-w-6xl mx-auto mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-light text-kawai-pearl mb-4">
              Master <span className="text-kawai-gold">Artisans</span>
            </h3>
            <p className="text-kawai-pearl/70 font-light max-w-2xl mx-auto">
              Each piano in the Signature Selection is individually signed by our master craftsmen,
              whose remarkable skills have been proven in the world's finest concert halls.
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
                <motion.div
                  key={artisan.name}
                  className="rounded-lg border border-kawai-gold/20 bg-gradient-to-br from-kawai-black/30 to-transparent backdrop-blur-sm group hover:border-kawai-gold/40 transition-all duration-500 overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
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

                    {/* Hover overlay with description - HIDDEN by default */}
                    <div className="absolute inset-0 bg-kawai-black/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-6 pointer-events-none group-hover:pointer-events-auto">
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
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Heritage Achievements - Moved to Bottom */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.label}
              className="text-center p-8 rounded-lg border border-kawai-gold/20 bg-gradient-to-br from-kawai-black/50 to-transparent backdrop-blur-sm group hover:border-kawai-gold/40 transition-all duration-500"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-light text-kawai-gold mb-2 group-hover:scale-105 transition-transform duration-300">
                <AnimatedCounter to={achievement.number} suffix={achievement.suffix} />
              </div>
              <h3 className="text-xl md:text-2xl font-light text-kawai-pearl mb-3 group-hover:text-kawai-gold transition-colors duration-300">
                {achievement.label}
              </h3>
              <p className="text-kawai-pearl/70 font-light leading-relaxed">
                {achievement.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-kawai-gold/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-kawai-gold/20 to-transparent" />
    </section>
  )
}