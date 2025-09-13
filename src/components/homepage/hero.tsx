"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MediaRenderer } from "@/components/ui/media/MediaRenderer";
import type { HeroProps } from "@/lib/types/homepage";
import { DEFAULT_HERO_DATA } from "@/lib/types/homepage";

export function Hero({ data = DEFAULT_HERO_DATA }: HeroProps) {
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { once: true, amount: 0.2 });

  // Simplified animation variants with reduced motion support
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const wordReveal = {
    hidden: { 
      opacity: prefersReducedMotion ? 1 : 0, 
      y: prefersReducedMotion ? 0 : 20
    },
    visible: (delay: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.6,
        delay: prefersReducedMotion ? 0 : delay
      }
    })
  };

  const contentReveal = {
    hidden: { 
      opacity: prefersReducedMotion ? 1 : 0, 
      y: prefersReducedMotion ? 0 : 20
    },
    visible: (delay: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.6,
        delay: prefersReducedMotion ? 0 : delay
      }
    })
  };

  return (
    <section 
      ref={heroRef}
      className="section-brand-primary relative min-h-screen flex items-center overflow-hidden"
      style={{ willChange: 'transform' }}
    >
      {/* Video Background */}
      {data.backgroundVideo ? (
        <MediaRenderer
          media={data.backgroundVideo}
          preset="hero"
          priority
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          aria-hidden="true"
        />
      ) : (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          style={{ willChange: 'transform' }}
          aria-hidden="true"
        >
          <source src="/assets/videos/Hero_compressed.mp4" type="video/mp4" />
        </video>
      )}
      
      {/* Lighter Overlay - Let Background Video Shine */}
      <div className="absolute top-0 left-0 w-full h-full bg-kawai-black/35 z-10" />
      
      {/* Content - Centered on Mobile, Left on Desktop */}
      <div className="container-brand max-w-8xl mx-auto px-8 sm:px-12 lg:px-16 relative z-20">
        <div className="max-w-5xl mx-auto lg:mx-0">
          {/* Location and Established - Natural Flow */}
          <motion.div 
            className="text-center lg:text-left mb-8 sm:mb-12"
            variants={contentReveal}
            custom={0}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <p className="text-brand-musical text-kawai-pearl tracking-wider text-sm font-semibold uppercase mb-2">
              {data.locationText}
            </p>
            <p className="text-brand-musical text-kawai-red tracking-wider text-sm font-semibold uppercase">
              {data.establishedText}
            </p>
          </motion.div>

          <div className="mb-12 lg:mb-16">
            <h1 className="heading-brand-luxury text-kawai-pearl mb-8 lg:mb-12 leading-tight tracking-tight text-center lg:text-left">
              <motion.span 
                className="block text-xl sm:text-2xl md:text-3xl font-normal mb-4 sm:mb-6 tracking-[0.15em] opacity-90"
                variants={wordReveal}
                custom={0.4}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                {data.titlePrefix}
              </motion.span>
              <motion.span 
                className="block text-lg min-[400px]:text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black tracking-[-0.05em] sm:tracking-tight md:tracking-normal lg:tracking-[-0.01em] leading-[0.9] px-8 sm:px-4 md:px-2 lg:px-0 max-w-full overflow-hidden"
                variants={wordReveal}
                custom={0.8}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                {data.titleMain}
              </motion.span>
              <motion.div 
                className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mt-3 sm:mt-4 tracking-[0.08em] opacity-90"
                variants={wordReveal}
                custom={1.2}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                {data.titleSuffix}
              </motion.div>
            </h1>
          </div>
          
          <motion.p 
            className="text-brand-sophisticated text-kawai-pearl/80 mb-brand-4xl max-w-lg text-lg md:text-xl leading-relaxed font-light text-center lg:text-left mx-auto lg:mx-0"
            variants={contentReveal}
            custom={1.6}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {data.description}
          </motion.p>
          
          <div className="flex flex-col sm:flex-row gap-brand-lg items-center lg:items-start justify-center lg:justify-start">
            <motion.div 
              variants={contentReveal}
              custom={2.0}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <Button size="lg" className="btn-brand-primary" asChild>
                <Link href={data.primaryCta.link}>
                  {data.primaryCta.text}
                </Link>
              </Button>
            </motion.div>
            <motion.div 
              variants={contentReveal}
              custom={2.2}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <Button size="lg" className="btn-brand-secondary" asChild>
                <Link href={data.secondaryCta.link}>
                  {data.secondaryCta.text}
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}