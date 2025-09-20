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
    <div ref={videoRef} className="w-full px-6 lg:px-8 mb-8">
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
  // Removed scroll transforms to fix animation conflicts
  // const { scrollYProgress } = useScroll({
  //   target: containerRef,
  //   offset: ["start end", "end start"]
  // })
  // const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  // const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

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
          className="text-center max-w-6xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="inline-block text-kawai-gold text-sm font-light tracking-[0.3em] uppercase mb-12 border border-kawai-gold/30 px-6 py-3 rounded-full backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Your Personal Showroom
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-kawai-pearl leading-tight mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
            >
              Transform your space into a{' '}
            </motion.span>
            <motion.span
              className="text-kawai-gold font-bold inline-block"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
            >
              Grand Concert Hall
            </motion.span>
          </motion.h2>
        </motion.div>

        {/* Full-width YouTube Video with Scroll-Triggered Playback */}
        <YouTubeVideo videoId="1cmwb6evs2A" />

          <div className="max-w-7xl mx-auto mb-8">
            {/* Two-column layout for invitation text and assessment benefits */}
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

              {/* Left Column - Kawai Signature Collection Text */}
              <motion.div
                className="relative pl-6 border-l-2 border-kawai-gold/30 bg-gradient-to-r from-kawai-gold/5 to-transparent rounded-r-lg p-6"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.0, ease: "easeOut" }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <motion.p
                  className="text-xl md:text-2xl text-kawai-pearl font-light leading-relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.3 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  We're offering a warm welcome to{' '}
                  <span className="text-kawai-gold font-medium">musicians, educators, and other passionate individuals</span> to check out the{' '}
                  <span className="text-kawai-gold">Signature Collection</span>,
                  Kawai's personally selected line of baby grand pianos such as the{' '}
                  <span className="text-kawai-gold">GL-10 and GL-20</span> at a special rate for our community.
                </motion.p>
              </motion.div>

              {/* Right Column - What Your Assessment Reveals */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="p-8 rounded-lg border border-kawai-gold/20 bg-gradient-to-br from-kawai-black/50 to-transparent backdrop-blur-sm">
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.4 }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <h3 className="text-kawai-gold text-2xl md:text-3xl font-light mb-6 tracking-wide">
                      October 9th through the 11th
                    </h3>
                    <h4 className="text-kawai-pearl text-lg font-medium mb-4">
                      A special event for our Qualified Musicians:
                    </h4>
                    <div className="space-y-3">
                      {[
                        "Apply for the signature circle and join thousands of passionate musicians",
                        "Exclusive consultation and personal showroom tour with master technicians",
                        "Very Limited and special offers on your own piece of Kawai's hundred year legacy",
                        "Present your invitation for white glove delivery and professional tuning, on us"
                      ].map((benefit, index) => {
                        const isDeliveryBenefit = benefit.includes("Present your invitation for white glove")
                        return (
                          <motion.div
                            key={index}
                            className={`flex items-start gap-3 ${isDeliveryBenefit ? 'mt-4 p-4 rounded-xl bg-gradient-to-r from-kawai-gold/10 via-kawai-gold/5 to-transparent border border-kawai-gold/20' : ''}`}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 1.5 + index * 0.1 }}
                            viewport={{ once: true, margin: "-100px" }}
                          >
                            <div className={`flex-shrink-0 rounded-full flex items-center justify-center mt-0.5 ${isDeliveryBenefit ? 'w-6 h-6 bg-kawai-gold/30' : 'w-5 h-5 bg-kawai-gold/20'}`}>
                              <svg className={`text-kawai-gold fill-current ${isDeliveryBenefit ? 'w-4 h-4' : 'w-3 h-3'}`} viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className={`leading-relaxed ${isDeliveryBenefit ? 'text-kawai-gold font-medium text-base' : 'text-kawai-pearl/80 text-sm'}`}>
                              {benefit}
                            </span>
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
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
                View Gallery
              </PremiumButton>
            </motion.div>
          </div>

        {/* Heritage Achievements - Moved to Bottom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.label}
              className="text-center p-8 rounded-lg border border-kawai-gold/20 bg-gradient-to-br from-kawai-black/50 to-transparent group hover:border-kawai-gold/40 transition-all duration-500"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.5 }}
              whileHover={{ y: -4 }}
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-light text-kawai-gold mb-2 group-hover:scale-105 transition-transform duration-300">
{achievement.number}{achievement.suffix}
              </div>
              <h3 className="text-xl md:text-2xl font-light text-kawai-pearl mb-3 group-hover:text-kawai-gold transition-colors duration-300">
                {achievement.label}
              </h3>
              <p className="text-kawai-pearl/70 font-light leading-relaxed">
                {achievement.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-kawai-gold/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-kawai-gold/20 to-transparent" />
    </section>
  )
}