'use client'

import React, { useMemo } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

// Generate random positions for floating particles
const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 5,
  }))
}

export default function HeritageSection() {
  const particles = useMemo(() => generateParticles(25), [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, #2a1810 0%, #1a1a1a 100%)',
        }}
      />

      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-10 opacity-20">
        <Image
          src="/images/concert-artist/heritage-skex.jpg"
          alt="Shigeru Kawai SK-EX Concert Grand"
          fill
          className="object-cover"
          quality={90}
          priority={false}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: '#D4AF37',
              opacity: 0.3,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-30 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm uppercase tracking-wide mb-6"
            style={{ color: '#D4AF37' }}
          >
            Shigeru Kawai Heritage
          </motion.p>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-5xl text-white mb-6 font-serif"
            style={{ fontFamily: 'Crimson Text, serif' }}
          >
            The Sound That Defines Excellence
          </motion.h2>

          {/* Body Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-white/80 max-w-2xl mx-auto mb-8"
          >
            Every Concert Artist model captures the legendary Shigeru Kawai SK-EX concert
            grand—handcrafted over two years, trusted by concert halls worldwide. This is the
            sound of mastery, now accessible in your home.
          </motion.p>

          {/* Stat Callout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8"
          >
            <motion.p
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: 'easeInOut',
              }}
              className="text-2xl font-semibold"
              style={{ color: '#D4AF37' }}
            >
              97 Years of Piano Craftsmanship
            </motion.p>
          </motion.div>
        </motion.div>
      </div>

      {/* Gradient Vignette Overlay */}
      <div
        className="absolute inset-0 z-25 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%)',
        }}
      />
    </section>
  )
}
