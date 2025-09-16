'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import Image from 'next/image'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import { cn } from '@/lib/utils'

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
      name: 'Naoto "Nick" Ichikawa',
      nameJapanese: '市川直人',
      title: 'Master Artisan',
      experience: 30,
      signature: '市川',
      specialty: 'Described as being "at the very height of his profession" with depth of experience, refined talents, and passion for his craft',
      image: '/images/signature/artisan-ichikawa.webp'
    },
    {
      name: 'Tatsuya Murakami',
      nameJapanese: '村上達也',
      title: 'Master Artisan & Opera Tenor',
      experience: 25,
      signature: '村上',
      specialty: 'An eminently talented piano craftsman who has traveled extensively supporting Shigeru Kawai piano owners and international piano competitions. Professional opera tenor performing 20+ times yearly',
      image: '/images/signature/artisan-murakami.webp'
    },
    {
      name: 'Kazuo Goka',
      nameJapanese: '五嘉和夫',
      title: 'Senior Master Piano Artisan',
      experience: 40,
      signature: '五嘉',
      specialty: 'Professional cellist and piano craftsman. Author of Kawai\'s grand piano regulation manual as supervisor of the Piano Laboratory',
      image: '/images/signature/artisan-goka.webp'
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
            Master Piano Artisans
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-kawai-pearl leading-tight mb-6">
            Transform Your Space Into A{' '}
            <span className="text-kawai-gold font-normal">Concert Hall</span>
          </h2>

          <p className="text-lg md:text-xl text-kawai-pearl/80 font-light leading-relaxed max-w-4xl mx-auto mb-8">
            Your invitation to the Kawai Signature Collection — where each instrument carries a century of musical history,
            artistic cultivation, and the devoted craftsmanship of master artisans at the highest level of piano excellence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
              onClick={handleCollectionClick}
            >
              View Collection
            </PremiumButton>
          </div>
        </motion.div>

        {/* Heritage Achievements */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20"
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
                'thumbnail',
                {
                  fill: true,
                  className: 'object-cover object-center group-hover:scale-105 transition-transform duration-500'
                }
              )

              return (
                <motion.div
                  key={artisan.name}
                  className="text-center p-6 rounded-lg border border-kawai-gold/20 bg-gradient-to-br from-kawai-black/30 to-transparent backdrop-blur-sm group hover:border-kawai-gold/40 transition-all duration-500"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                >
                  <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                      {...imageProps}
                      alt={`Master Artisan ${artisan.name}`}
                    />
                  </div>

                  <h4 className="text-kawai-pearl text-lg font-medium mb-1 group-hover:text-kawai-gold transition-colors duration-300">
                    {artisan.name}
                  </h4>
                  <div className="text-kawai-gold text-sm font-light mb-2">{artisan.nameJapanese}</div>
                  <div className="text-kawai-pearl/60 text-sm mb-3">{artisan.title}</div>

                  <div className="border-t border-kawai-gold/20 pt-4">
                    <div className="text-kawai-pearl/70 text-sm mb-1">{artisan.experience} years experience</div>
                    <div className="text-kawai-pearl/70 text-sm mb-3">Specialty: {artisan.specialty}</div>
                    <div className="text-kawai-gold text-2xl font-light">{artisan.signature}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Conversion Section */}
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="p-8 md:p-12 rounded-lg border border-kawai-gold/20 bg-gradient-to-br from-kawai-black/50 to-transparent backdrop-blur-sm">
            <h3 className="text-3xl md:text-4xl font-light text-kawai-pearl mb-4">
              Ready to Begin Your <span className="text-kawai-gold">Musical Legacy</span>?
            </h3>
            <p className="text-kawai-pearl/70 font-light leading-relaxed mb-8 max-w-2xl mx-auto">
              Take our personalized assessment to discover which master artisan-crafted piano from our
              Signature Selection will transform your space into a concert hall and carry forward a century of musical excellence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <PremiumButton
                variant="primary"
                size="lg"
                onClick={handleAssessmentClick}
                className="min-w-[240px]"
              >
                Reserve Your Spot
              </PremiumButton>
              <PremiumButton
                variant="secondary"
                size="lg"
                onClick={handleCollectionClick}
                className="min-w-[240px]"
              >
                Explore Heritage Collection
              </PremiumButton>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-kawai-gold/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-kawai-gold/20 to-transparent" />
    </section>
  )
}