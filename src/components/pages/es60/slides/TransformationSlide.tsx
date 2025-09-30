"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Headphones } from 'lucide-react';
import Image from 'next/image';

export function TransformationSlide() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const [showES60, setShowES60] = useState(false);

  // Trigger ES60 transformation when slide comes into view
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setShowES60(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowES60(false);
    }
    return undefined;
  }, [isInView]);

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden scroll-snap-slide"
      style={{
        background: 'transparent'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0.3 }}
      transition={{ duration: 1.5 }}
    >
      {/* Particle System */}
      <div className="absolute inset-0">
        {[...Array(60)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              opacity: isInView ? [0, 1, 0] : 0,
              scale: isInView ? [0, 1, 0] : 0,
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: isInView ? Infinity : 0,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center max-w-6xl mx-auto px-6">
          {/* Transformation Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isInView ? 1 : 0,
              scale: isInView ? 1 : 0.8
            }}
            transition={{ duration: 1.5 }}
            className="mb-16"
          >
            <p className="text-red-400 text-sm md:text-lg font-medium mb-4 tracking-wide uppercase">
              Perfect for Beginners & Students
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Everything You Need
              <span className="block text-red-500">To Start Playing</span>
            </h2>
            <p className="text-lg md:text-xl text-white/80">
              Apartment-friendly • Student-portable • Budget-conscious
            </p>
          </motion.div>

          {/* Morphing Animation Container */}
          <div className="relative w-full max-w-4xl mx-auto h-80 mb-8">
            {/* Concert Grand (morphs out) */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ 
                opacity: showES60 ? 0 : 1,
                scale: showES60 ? 1.2 : 1,
                filter: showES60 ? 'blur(20px)' : 'blur(0px)'
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              <div className="text-center">
                <div className="w-80 md:w-96 h-40 md:h-48 mx-auto mb-6 relative">
                  <svg viewBox="0 0 400 200" className="w-full h-full">
                    <path
                      d="M50 120 Q50 80 100 80 L300 80 Q350 80 350 120 L350 160 Q350 180 330 180 L70 180 Q50 180 50 160 Z"
                      fill="#1a1a1a"
                      stroke="#666"
                      strokeWidth="2"
                    />
                    <rect x="80" y="160" width="240" height="20" fill="#f8f8f8" stroke="#333" />
                  </svg>
                </div>
                <p className="text-white/60 text-lg">Concert Grand Heritage</p>
              </div>
            </motion.div>

            {/* ES60 Large Image (slides in from right, bleeds off screen) */}
            <motion.div
              className="absolute top-0 h-full"
              style={{
                width: '70vw',
                right: '-30vw' // Extends beyond right edge
              }}
              initial={{ opacity: 0, x: '30vw' }}
              animate={{
                opacity: showES60 ? 1 : 0,
                x: showES60 ? 0 : '30vw'
              }}
              transition={{ delay: 1, duration: 2, ease: "easeOut" }}
            >
              <motion.div
                className="relative w-full h-full"
                animate={{
                  filter: showES60 ? [
                    'drop-shadow(0 0 30px rgba(225, 25, 34, 0.2))',
                    'drop-shadow(0 0 50px rgba(225, 25, 34, 0.4))',
                    'drop-shadow(0 0 30px rgba(225, 25, 34, 0.2))'
                  ] : 'drop-shadow(0 0 30px rgba(225, 25, 34, 0.2))'
                }}
                transition={{
                  duration: 3,
                  repeat: showES60 ? Infinity : 0,
                  ease: "easeInOut"
                }}
              >
                <Image
                  src="/images/es60-above-closeup.png"
                  alt="ES60 Digital Piano"
                  fill
                  className="object-contain object-left"
                />
              </motion.div>
            </motion.div>

            {/* Left Side Content */}
            <motion.div
              className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2/5 pl-8 md:pl-16"
              initial={{ opacity: 0, x: -100 }}
              animate={{
                opacity: showES60 ? 1 : 0,
                x: showES60 ? 0 : -100
              }}
              transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }}
            >
              <div className="space-y-6">
                <p className="text-red-400 text-xl md:text-2xl font-bold" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
                  Beginner-Friendly Features
                </p>

                {/* Feature Highlights - Vertical Layout */}
                <div className="space-y-4">
                  <motion.div
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{
                      opacity: showES60 ? 1 : 0,
                      x: showES60 ? 0 : -50
                    }}
                    transition={{ delay: 2, duration: 1, ease: "easeOut" }}
                  >
                    <div className="text-left">
                      <p className="text-red-500 text-2xl md:text-3xl font-bold">24 lbs</p>
                      <p className="text-white/80 text-sm md:text-base" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>Perfect for Apartments & Dorms</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{
                      opacity: showES60 ? 1 : 0,
                      x: showES60 ? 0 : -50
                    }}
                    transition={{ delay: 2.3, duration: 1, ease: "easeOut" }}
                  >
                    <div className="flex items-start gap-3">
                      <Headphones className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-white font-medium text-base md:text-lg" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>Silent Practice</p>
                        <p className="text-white/70 text-xs md:text-sm">Practice anytime, anywhere</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{
                      opacity: showES60 ? 1 : 0,
                      x: showES60 ? 0 : -50
                    }}
                    transition={{ delay: 2.6, duration: 1, ease: "easeOut" }}
                  >
                    <div className="text-left">
                      <p className="text-red-500 text-2xl md:text-3xl font-bold">192</p>
                      <p className="text-white/80 text-sm md:text-base" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>Polyphony - Never Drop Notes</p>
                    </div>
                  </motion.div>
                </div>

                {/* Price Section */}
                <motion.div
                  className="space-y-2 pt-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: showES60 ? 1 : 0,
                    scale: showES60 ? 1 : 0.8
                  }}
                  transition={{ delay: 3, duration: 1.2, ease: "easeOut" }}
                >
                  <p className="text-white text-lg md:text-xl" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
                    Professional features that won't break the bank
                  </p>
                  <p className="text-red-500 text-3xl md:text-4xl font-bold" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
                    Only $499
                  </p>
                  <p className="text-white/70 text-sm" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
                    Best affordable digital piano for beginners
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}