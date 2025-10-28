"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export function SoundQualitySection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const tonalCharacteristics = [
    {
      title: "Warm & Singing Tone",
      description: "A rich, warm piano sound that breathes with every note, offering the expressive capabilities demanded by classical music and contemporary performances alike.",
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      )
    },
    {
      title: "Dynamic Range & Expression",
      description: "From whisper-soft pianissimos to powerful fortissimos, the tonal palette responds to your every musical intention with unmatched sensitivity and control.",
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: "Clarity Across All Registers",
      description: "Every note rings true with exceptional clarity and sustain, from the resonant bass to the crystalline treble, delivering the piano tone quality that defines musical excellence.",
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    }
  ];

  return (
    <section
      ref={sectionRef}
      className="relative bg-kawai-pearl py-16 sm:py-20 lg:py-28 overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-96 h-96 bg-kawai-red rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-kawai-red rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-4">
            The Kawai Sound
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light font-serif text-kawai-black mb-6 leading-tight max-w-4xl mx-auto">
            Warm, Rich, and Unmistakably <span className="text-kawai-red">Musical</span>
          </h2>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="space-y-4 text-lg sm:text-xl text-kawai-black/80 leading-relaxed">
              <p>
                <strong className="text-kawai-black font-medium">What does a Kawai piano sound like?</strong> Musicians describe the
                tone as warm, singing, and responsive—a <strong className="text-kawai-black font-medium">rich piano sound</strong> that
                invites musical expression and connects performer to listener with emotional depth.
              </p>
              <p>
                The distinctive <strong className="text-kawai-black font-medium">Kawai sound</strong> emerges from carefully selected
                materials and precision voicing techniques. Tapered soundboards of premium spruce respond with immediate sensitivity,
                while our exclusive hammer felts produce a warm, mellow character that elevates both practice and performance.
              </p>
              <p>
                Are Kawai pianos good for classical music? Absolutely. The <strong className="text-kawai-black font-medium">expressive piano sound</strong> and
                dynamic range make Kawai the choice of conservatories worldwide. Yet this versatility extends beautifully to jazz,
                contemporary, and all musical genres—a true testament to superior <strong className="text-kawai-black font-medium">piano sound quality</strong>.
              </p>
            </div>

            {/* Quote */}
            <div className="bg-white rounded-xl p-6 border-l-4 border-kawai-red shadow-sm">
              <p className="text-kawai-black/70 italic mb-2">
                "The Kawai tone has this singing quality that makes every phrase come alive. It's warm without being muddy,
                bright without being harsh—just pure, musical sound."
              </p>
              <p className="text-sm text-kawai-black/60">— Concert Pianist</p>
            </div>
          </motion.div>

          {/* Visual Element - Soundwave representation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            <div className="aspect-square bg-gradient-to-br from-kawai-black via-kawai-red/20 to-kawai-black rounded-2xl p-12 flex items-center justify-center shadow-2xl">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Animated soundwave bars */}
                <div className="flex items-end justify-center space-x-2 h-48">
                  {[40, 80, 60, 90, 50, 70, 85, 55, 75, 65, 90, 50, 80, 60, 70].map((height, index) => (
                    <motion.div
                      key={index}
                      initial={{ scaleY: 0.3 }}
                      animate={isVisible ? {
                        scaleY: [0.3, 1, 0.3],
                      } : {}}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.1,
                        ease: "easeInOut"
                      }}
                      className="w-2 bg-kawai-red rounded-full"
                      style={{ height: `${height}%`, transformOrigin: 'bottom' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tonal Characteristics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {tonalCharacteristics.map((characteristic, index) => (
            <div
              key={characteristic.title}
              className="text-center group"
            >
              <h3 className="text-xl font-serif text-kawai-black mb-3">
                {characteristic.title}
              </h3>
              <p className="text-kawai-black/70 leading-relaxed">
                {characteristic.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
