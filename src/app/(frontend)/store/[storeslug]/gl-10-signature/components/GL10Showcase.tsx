'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Award, Maximize2, Hand, Sparkles, CheckCircle2, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  image?: string
  badge?: string
  features?: string[]
  video?: string
  delay?: number
  size?: 'large' | 'medium'
}

function FeatureCard({
  icon,
  title,
  description,
  image,
  badge,
  features,
  video,
  delay = 0,
  size = 'medium'
}: FeatureCardProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, delay }}
        className={cn(
          'group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300',
          'hover:shadow-xl hover:-translate-y-1',
          size === 'large' ? 'md:col-span-2 md:row-span-2' : 'col-span-1'
        )}
      >
        {/* Badge */}
        {badge && (
          <div className="absolute top-4 left-4 z-10">
            <div className="flex items-center gap-2 px-4 py-2 bg-kawai-red text-white rounded-full text-sm font-semibold shadow-lg">
              <Award className="w-4 h-4" />
              {badge}
            </div>
          </div>
        )}

        {/* Image Section */}
        {image && (
          <div className={cn(
            'relative overflow-hidden bg-kawai-pearl',
            size === 'large' ? 'h-[400px] md:h-[500px]' : 'h-[200px]'
          )}>
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes={size === 'large' ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
            />

            {/* Video Play Button */}
            {video && (
              <button
                onClick={() => setIsVideoOpen(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors">
                  <Play className="w-6 h-6 text-kawai-red ml-1" />
                </div>
              </button>
            )}
          </div>
        )}

        {/* Content Section */}
        <div className={cn(
          'p-6',
          size === 'large' ? 'md:p-8' : 'p-6'
        )}>
          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 mb-4 bg-kawai-pearl rounded-xl text-kawai-red">
            {icon}
          </div>

          {/* Title */}
          <h3 className={cn(
            'font-serif text-kawai-charcoal mb-2',
            size === 'large' ? 'text-2xl md:text-3xl' : 'text-xl'
          )}>
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-4">
            {description}
          </p>

          {/* Features List */}
          {features && features.length > 0 && (
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-kawai-red flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>

      {/* Video Modal */}
      {video && isVideoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsVideoOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              ×
            </button>
            <video
              src={video}
              controls
              autoPlay
              className="w-full h-full"
            >
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </div>
      )}
    </>
  )
}

export default function GL10Showcase() {
  return (
    <section className="py-16 md:py-24 bg-kawai-pearl">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-kawai-charcoal mb-4">
            The GL-10 Baby Grand
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Where artistry meets innovation. Experience the perfect harmony of compact elegance
            and concert-quality performance.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Large Feature Card - Award Winner */}
          <FeatureCard
            size="large"
            icon={<Award className="w-6 h-6" />}
            title="Award-Winning Design"
            description="Recognized by Music & Sound Retailer as the 2016 Product of the Year. The GL-10 represents the pinnacle of baby grand piano engineering, combining timeless elegance with cutting-edge innovation."
            image="/images/gl10/gl10-award-winner.jpg"
            badge="MMR 2016 Product of the Year"
            delay={0}
          />

          {/* Compact Perfection */}
          <FeatureCard
            icon={<Maximize2 className="w-6 h-6" />}
            title="Compact Perfection"
            description="At just 5'0&quot;, the GL-10 delivers grand piano performance in a size that fits beautifully in any space. Perfect for modern homes without compromising on sound quality."
            delay={0.1}
          />

          {/* Millennium III Action */}
          <FeatureCard
            icon={<Hand className="w-6 h-6" />}
            title="Millennium III Action"
            description="Experience unparalleled touch and response with our revolutionary action system. Engineered for precision, designed for expression."
            image="/images/gl10/millennium-action.jpg"
            video="/videos/millennium-action-demo.mp4"
            delay={0.2}
          />

          {/* Master Craftsmanship */}
          <FeatureCard
            icon={<Sparkles className="w-6 h-6" />}
            title="Master Craftsmanship"
            description="Every GL-10 is handcrafted by master artisans in Japan, ensuring the highest standards of quality and attention to detail."
            image="/images/gl10/craftsmanship.jpg"
            delay={0.3}
          />

          {/* Signature Features */}
          <FeatureCard
            icon={<CheckCircle2 className="w-6 h-6" />}
            title="Signature Features"
            description="Exclusive features that set the GL-10 apart from every other baby grand:"
            features={[
              'Extended harmonic imaging for richer tones',
              'Premium spruce soundboard with Alaskan Sitka bracing',
              'Hand-wound bass strings for superior resonance',
              'Slow-close fallboard for safety and elegance',
              'Lifetime warranty on action components'
            ]}
            delay={0.4}
          />
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-lg text-gray-600 italic">
            This is more than a piano. It's your partner in musical excellence.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
