"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

export function ExperienceSlide() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const [activeDemo, setActiveDemo] = useState(0);
  
  const demos = [
    { 
      title: "Real Piano Feel", 
      icon: "🎹", 
      description: "88-key Responsive Hammer Compact II Action",
      detail: "Graded weighting provides authentic touch response across all keys"
    },
    { 
      title: "Concert Sound", 
      icon: "🎼", 
      description: "Shigeru Kawai SK-EX Samples",
      detail: "Studio-recorded from the world's most celebrated concert grand"
    },
    { 
      title: "Silent Practice", 
      icon: "🎧", 
      description: "Dual Headphone Outputs",
      detail: "Practice anytime without disturbing others - perfect for families"
    }
  ];

  // Cycle through demos when slide is in view
  useEffect(() => {
    if (isInView) {
      const interval = setInterval(() => {
        setActiveDemo(prev => (prev + 1) % demos.length);
      }, 3000);
      return () => clearInterval(interval);
    } else {
      setActiveDemo(0);
    }
    return undefined;
  }, [isInView, demos.length]);

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
      {/* Background Ambiance */}
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-blue-500/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
            }}
            animate={{
              scale: isInView ? [1, 1.5, 1] : 1,
              opacity: isInView ? [0.3, 0.8, 0.3] : 0.3,
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: isInView ? Infinity : 0,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center max-w-5xl mx-auto px-6">
          {/* Experience Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ 
              opacity: isInView ? 1 : 0, 
              y: isInView ? 0 : 30 
            }}
            transition={{ duration: 1.5 }}
            className="mb-16"
          >
            <p className="text-blue-400 text-sm md:text-lg font-medium mb-4 tracking-wide uppercase">
              Experience
            </p>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Feel the
              <span className="block text-blue-400">Difference</span>
            </h2>
          </motion.div>

          {/* Demo Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            {demos.map((demo, index) => (
              <motion.div
                key={demo.title}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-500 ${
                  index === activeDemo
                    ? 'border-blue-500 bg-blue-500/10 shadow-2xl'
                    : 'border-white/20 bg-white/5'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: isInView ? 1 : 0,
                  y: isInView ? 0 : 20,
                  scale: index === activeDemo ? 1.05 : 1,
                }}
                transition={{ 
                  delay: isInView ? index * 0.2 : 0,
                  duration: 0.8 
                }}
              >
                <div className="text-4xl mb-4">{demo.icon}</div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">{demo.title}</h3>
                <p className="text-white/70 text-sm md:text-base mb-3">{demo.description}</p>
                
                <motion.p 
                  className="text-blue-400 text-xs md:text-sm font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: index === activeDemo ? 1 : 0.7 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {demo.detail}
                </motion.p>
                
                {/* Active indicator */}
                {index === activeDemo && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                  >
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </motion.div>
                )}

                {/* Glow effect for active card */}
                {index === activeDemo && (
                  <motion.div
                    className="absolute inset-0 bg-blue-500/20 rounded-2xl -z-10"
                    animate={{
                      opacity: [0.2, 0.4, 0.2],
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Feature Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ 
              opacity: isInView ? 1 : 0, 
              y: isInView ? 0 : 30 
            }}
            transition={{ delay: isInView ? 1.5 : 0, duration: 1 }}
            className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-blue-500/20"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
              <div className="space-y-2">
                <p className="text-2xl md:text-3xl font-bold text-blue-400">88</p>
                <p className="text-white/70 text-sm">Weighted Keys</p>
              </div>
              <div className="space-y-2">
                <p className="text-2xl md:text-3xl font-bold text-blue-400">192</p>
                <p className="text-white/70 text-sm">Note Polyphony</p>
              </div>
              <div className="space-y-2">
                <p className="text-2xl md:text-3xl font-bold text-blue-400">19</p>
                <p className="text-white/70 text-sm">Instrument Voices</p>
              </div>
              <div className="space-y-2">
                <p className="text-2xl md:text-3xl font-bold text-blue-400">24</p>
                <p className="text-white/70 text-sm">Pounds</p>
              </div>
            </div>
          </motion.div>

          {/* Bottom Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ delay: isInView ? 2.5 : 0, duration: 1 }}
            className="text-lg md:text-xl text-white/80 mt-8"
          >
            Ready to experience concert grand excellence for yourself?
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}