"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export function HeritageSlide() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden scroll-snap-slide"
      style={{
        background: 'transparent'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0.3 }}
      transition={{ duration: 2 }}
    >
      {/* Concert Hall Ambiance */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 to-transparent" />
        <motion.div
          className="absolute inset-0"
          animate={{
            background: isInView ? [
              'radial-gradient(circle at 30% 40%, rgba(255,223,186,0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 70% 60%, rgba(255,223,186,0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 30% 40%, rgba(255,223,186,0.1) 0%, transparent 50%)'
            ] : 'radial-gradient(circle at 30% 40%, rgba(255,223,186,0.05) 0%, transparent 50%)'
          }}
          transition={{ duration: 8, repeat: isInView ? Infinity : 0 }}
        />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-6 md:px-8">
          {/* Heritage Title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{
              opacity: isInView ? 1 : 0,
              y: isInView ? 0 : 50
            }}
            transition={{ duration: 1.5 }}
            className="mb-12"
          >
            <p className="text-amber-300 text-sm md:text-lg font-medium mb-4 tracking-wide uppercase">
              Heritage Meets Affordability
            </p>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
              <span className="block text-amber-400">Premium Sound,</span>
              <span className="block">Beginner Price</span>
            </h2>
            <p className="text-lg md:text-xl text-amber-200/90 font-medium">
              Concert grand excellence, now accessible to everyone
            </p>
          </motion.div>

          {/* Shigeru Kawai SK-EX Showcase */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: isInView ? 1 : 0.8, 
              opacity: isInView ? 1 : 0 
            }}
            transition={{ 
              delay: isInView ? 1 : 0, 
              duration: 2, 
              type: "spring" 
            }}
            className="relative mb-8"
          >
            {/* Grand Piano Silhouette */}
            <div className="relative mx-auto w-80 md:w-96 h-48 md:h-64">
              <motion.svg
                viewBox="0 0 400 250"
                className="w-full h-full"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isInView ? 1 : 0 }}
                transition={{ 
                  delay: isInView ? 1.5 : 0, 
                  duration: 3 
                }}
              >
                <defs>
                  <linearGradient id="pianoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1a1a1a" />
                    <stop offset="50%" stopColor="#333" />
                    <stop offset="100%" stopColor="#111" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Grand Piano Body */}
                <motion.path
                  d="M50 150 Q50 100 100 100 L300 100 Q350 100 350 150 L350 200 Q350 220 330 220 L70 220 Q50 220 50 200 Z"
                  fill="url(#pianoGradient)"
                  stroke="#E11922"
                  strokeWidth="2"
                  filter="url(#glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: isInView ? 1 : 0, 
                    opacity: isInView ? 1 : 0 
                  }}
                  transition={{ 
                    delay: isInView ? 2 : 0, 
                    duration: 2 
                  }}
                />
                
                {/* Piano Lid */}
                <motion.path
                  d="M100 100 L300 100 Q320 80 340 85 L355 90 Q350 100 350 150"
                  fill="none"
                  stroke="#E11922"
                  strokeWidth="2"
                  filter="url(#glow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: isInView ? 1 : 0 }}
                  transition={{ 
                    delay: isInView ? 3 : 0, 
                    duration: 1.5 
                  }}
                />

                {/* Keyboard */}
                <motion.rect
                  x="80"
                  y="200"
                  width="240"
                  height="20"
                  fill="#f8f8f8"
                  stroke="#333"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isInView ? 1 : 0 }}
                  transition={{ 
                    delay: isInView ? 4 : 0, 
                    duration: 1 
                  }}
                />
              </motion.svg>
              
              {/* Floating Labels */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ 
                  opacity: isInView ? 1 : 0, 
                  x: isInView ? 0 : -50 
                }}
                transition={{ 
                  delay: isInView ? 4.5 : 0, 
                  duration: 1 
                }}
                className="absolute -left-4 md:-left-8 top-1/2 transform -translate-y-1/2"
              >
                <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-amber-500/30">
                  <p className="text-amber-400 text-xs md:text-sm font-bold">Shigeru Kawai</p>
                  <p className="text-white text-xs">SK-EX Concert Grand</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ 
                  opacity: isInView ? 1 : 0, 
                  x: isInView ? 0 : 50 
                }}
                transition={{ 
                  delay: isInView ? 5 : 0, 
                  duration: 1 
                }}
                className="absolute -right-4 md:-right-8 bottom-1/4"
              >
                <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-amber-500/30">
                  <p className="text-amber-400 text-xs md:text-sm font-bold">Premium Samples</p>
                  <p className="text-white text-xs">Studio Recorded</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Heritage Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: isInView ? 1 : 0,
              y: isInView ? 0 : 30
            }}
            transition={{
              delay: isInView ? 5.5 : 0,
              duration: 1.5
            }}
            className="space-y-4"
          >
            <p className="text-lg md:text-xl text-white/80 leading-relaxed">
              Every note in the ES60 contains the soul of our legendary Shigeru Kawai SK-EX concert grand—
              <span className="text-amber-400 font-medium"> the same piano trusted by concert halls worldwide</span>
            </p>
            <p className="text-xl md:text-2xl text-amber-400 font-bold">
              Now accessible to beginners and students at only $499
            </p>
            <p className="text-base md:text-lg text-white/70 leading-relaxed">
              The best piano sound quality under $500, verified by professional reviewers
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}