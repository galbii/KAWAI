"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

export function OpeningSlide() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden scroll-snap-slide"
      style={{
        background: 'transparent'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0.3 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      {/* Subtle Audio Visualization Background */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-red-500/5 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="text-center z-10 max-w-4xl mx-auto px-6">
        {/* Kawai Logo Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: isInView ? 1 : 0
          }}
          transition={{
            duration: 2.5,
            ease: "easeInOut",
            delay: isInView ? 0.5 : 0
          }}
          className="mb-8"
        >
          <motion.div
            className="relative w-80 md:w-96 h-24 md:h-32 mx-auto mb-4"
            animate={{
              filter: isInView ? [
                'drop-shadow(0 0 20px rgba(225, 25, 34, 0.5))',
                'drop-shadow(0 0 40px rgba(225, 25, 34, 0.8))',
                'drop-shadow(0 0 20px rgba(225, 25, 34, 0.5))'
              ] : 'drop-shadow(0 0 20px rgba(225, 25, 34, 0.5))'
            }}
            transition={{
              duration: 3,
              repeat: isInView ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            <Image
              src="/images/Kawai (Red)(2).png"
              alt="Kawai"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Tagline with Sequential Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: isInView ? 1 : 0, 
            y: isInView ? 0 : 30 
          }}
          transition={{ delay: isInView ? 1.5 : 0, duration: 1.5 }}
          className="space-y-4"
        >
          <motion.p
            className="text-3xl md:text-5xl font-light text-white mb-2"
            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}
            animate={{ opacity: isInView ? [1, 0.7, 1] : 1 }}
            transition={{
              duration: 2,
              repeat: isInView ? Infinity : 0
            }}
          >
            Concert Grand Sound.
          </motion.p>

          <motion.p
            className="text-4xl md:text-6xl font-bold text-red-500"
            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}
            initial={{ scale: 0.8 }}
            animate={{ scale: isInView ? 1 : 0.8 }}
            transition={{
              delay: isInView ? 2.5 : 0,
              duration: 0.8,
              type: "spring"
            }}
          >
            $499.
          </motion.p>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{
            delay: isInView ? 3.5 : 0,
            duration: 1.5
          }}
          className="text-lg md:text-xl text-white/90 mt-8 max-w-md mx-auto leading-relaxed"
          style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}
        >
          Revolutionary digital piano technology made accessible
        </motion.p>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: isInView ? 1 : 0, 
            y: isInView ? 0 : 20 
          }}
          transition={{ 
            delay: isInView ? 4.5 : 0, 
            duration: 1 
          }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ 
              duration: 2, 
              repeat: isInView ? Infinity : 0 
            }}
            className="flex flex-col items-center text-white/50"
          >
            <span className="text-sm mb-2">Scroll to explore</span>
            <div className="w-0.5 h-8 bg-white/30 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}