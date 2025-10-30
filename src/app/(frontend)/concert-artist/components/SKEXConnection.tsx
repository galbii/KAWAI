'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function SKEXConnection() {
  return (
    <section className="relative bg-[#1A1A1A] py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            {/* Eyebrow */}
            <div className="mb-6">
              <span className="text-sm tracking-[0.2em] text-neutral-400 uppercase">
                The SK-EX Connection
              </span>
            </div>

            {/* Headline */}
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight">
              One Sound,
              <br />
              Every Stage
            </h2>

            {/* Opening Paragraph */}
            <p className="text-lg text-neutral-300 mb-8 leading-relaxed">
              Every concert pianist remembers the moment—their first time playing a world-class concert grand. For many, it's a Shigeru Kawai SK-EX.
            </p>

            {/* Craftsmanship Detail */}
            <p className="text-base text-neutral-400 mb-10 leading-relaxed">
              The SK-EX takes over two years to handcraft in our Piano Research Laboratory in Ryuyo, Japan. Only our most experienced artisans—craftsmen who've spent 30+ years understanding how wood breathes, how hammers must strike, how soundboards must resonate—are entrusted with its creation.
            </p>

            {/* Stage Credentials */}
            <div className="mb-10 space-y-3">
              <p className="text-neutral-300 flex items-start">
                <span className="text-neutral-600 mr-4">—</span>
                <span>International piano competitions worldwide</span>
              </p>
              <p className="text-neutral-300 flex items-start">
                <span className="text-neutral-600 mr-4">—</span>
                <span>Concert halls from Carnegie to Kennedy Center</span>
              </p>
              <p className="text-neutral-300 flex items-start">
                <span className="text-neutral-600 mr-4">—</span>
                <span>Recording studios capturing history's greatest performances</span>
              </p>
            </div>

            {/* Connection Statement - Emphasized */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative pl-6 border-l-2 border-white/20 mb-8"
            >
              <p className="font-serif text-2xl md:text-3xl text-white leading-relaxed italic">
                And this is the sound in your CA series piano.
              </p>
            </motion.div>

            {/* Clarification */}
            <p className="text-base text-neutral-300 mb-8 leading-relaxed">
              Not a simulation. Not an approximation. The actual SK-EX Competition Grand, recorded from the player's perspective in concert halls, captured with multi-channel technology that preserves every harmonic complexity.
            </p>

            {/* Closing Message */}
            <p className="text-lg text-neutral-200 leading-relaxed">
              Your child's first lesson. Your midnight practice. Your Sunday morning playing. All on the sound that artists perform on.
            </p>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="/images/skmax.jpg"
                alt="Shigeru Kawai SK-EX Concert Grand Piano"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* Subtle overlay gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/5 rounded-lg -z-10" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-white/5 rounded-lg -z-10" />
          </motion.div>
        </div>
      </div>

      {/* Background Texture Overlay (Optional) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.02),transparent_50%)] pointer-events-none" />
    </section>
  )
}
