'use client'

import { motion } from 'framer-motion'

export default function GL10BabyGrand() {
  return (
    <section className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-kawai-charcoal mb-6">
            The Perfect Balance of
            <br />
            <span className="text-[#8B7355]">Size and Sound</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The GL-10 Baby Grand represents the pinnacle of compact piano design,
            delivering exceptional performance without compromise.
          </p>
        </motion.div>

        {/* YouTube Embed - No UI */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full aspect-video max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl"
        >
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube-nocookie.com/embed/mUsF0GpAcaY?controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=0&disablekb=1&autoplay=0&mute=0"
            title="GL-10 Baby Grand Piano"
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="w-full h-full"
          />
          {/* Overlay to block title area - only covers top portion */}
          <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none bg-gradient-to-b from-black/5 to-transparent" />
        </motion.div>
      </div>
    </section>
  )
}
