"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function HomeHero() {
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { once: true, amount: 0.2 });

  // Hardcoded data with your requested changes
  const heroData = {
    locationText: "",
    establishedText: "Est. 1927",
    titlePrefix: "The",
    titleMain: "INSTRUMENTAL",
    titleSuffix: "to Life",
    description: "Every musician harbors a vision. Every performance seeks perfection. Since 1927, we've been crafting the instruments that transform inspiration into reality.",
    primaryCta: {
      text: "View Our Piano Collection",
      link: "/pianos"
    },
    secondaryCta: {
      text: "Visit Our St. Louis Showroom",
      link: "/contact"
    }
  };

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
      
      {/* Dark Overlay for Text Readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-kawai-black/50 z-10" />
      
      {/* Content - Center Aligned with better mobile padding */}
      <div className="container-brand max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 relative z-20 flex flex-col items-center text-center overflow-hidden">
        {/* Centered Est. 1927 */}
        {heroData.establishedText && (
          <motion.div 
            className="absolute -top-24 left-1/2 transform -translate-x-1/2 z-10"
            variants={contentReveal}
            custom={0}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {heroData.locationText && (
              <p className="text-brand-musical text-kawai-pearl tracking-wider text-sm font-semibold uppercase mb-2 text-center">
                {heroData.locationText}
              </p>
            )}
            <p className="text-brand-musical text-kawai-red tracking-wider text-sm font-semibold uppercase text-center">
              {heroData.establishedText}
            </p>
          </motion.div>
        )}

        <div className="max-w-5xl">
          <div className="mb-12 lg:mb-16">
            <h1 className="heading-brand-luxury text-kawai-pearl mb-8 lg:mb-12 leading-[0.75] tracking-tight text-center">
              <motion.span 
                className="block text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl font-normal mb-4 sm:mb-6 tracking-[0.15em] sm:tracking-[0.2em] opacity-90"
                variants={wordReveal}
                custom={0.8}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                {heroData.titlePrefix}
              </motion.span>
              <motion.span 
                className="block text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-[-0.02em] leading-[0.8] sm:leading-[0.75] max-w-full overflow-hidden"
                style={{ fontSize: 'clamp(2rem, 12vw, 12rem)' }}
                variants={wordReveal}
                custom={1.6}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                {heroData.titleMain}
              </motion.span>
              <motion.div 
                className="block text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl font-light mt-3 sm:mt-4 tracking-[0.05em] sm:tracking-[0.1em] opacity-90"
                variants={wordReveal}
                custom={2.0}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                {heroData.titleSuffix}
              </motion.div>
            </h1>
          </div>
          
          <motion.p 
            className="text-brand-sophisticated text-kawai-pearl/80 mb-brand-4xl mx-auto max-w-lg text-base sm:text-lg md:text-xl leading-relaxed font-light text-center px-4 sm:px-0"
            variants={contentReveal}
            custom={2.5}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {heroData.description}
          </motion.p>
        </div>
        
        {/* Centered button with mobile optimization */}
        <motion.div 
          variants={contentReveal}
          custom={3.0}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="px-4 sm:px-0"
        >
          <Button size="lg" className="btn-brand-primary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] w-auto" asChild>
            <Link href={heroData.primaryCta.link}>
              <span className="text-center leading-tight">{heroData.primaryCta.text}</span>
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}