"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import type { HeroSectionData } from '@/lib/types/homepage'

interface HomeHeroProps {
  data?: HeroSectionData  // NEW: Accept CMS data
  headingLevel?: 'h1' | 'h2'
}

export function HomeHero({ data, headingLevel = 'h1' }: HomeHeroProps = {}) {
  const SectionHeading = headingLevel
  const heroRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(heroRef, { once: true, amount: 0.2 });

  // Manage video playback lifecycle
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Attempt to play the video when component mounts
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn('Video autoplay prevented:', error);
      });
    }

    // Cleanup: pause video when component unmounts or navigating away
    return () => {
      video.pause();
    };
  }, []);

  // Use CMS data if provided, fallback to hardcoded
  const heroData = data || {
    locationText: "",
    establishedText: "Est. 1927",
    description: "Every musician harbors a vision. Every performance seeks perfection. Since 1927, we've been crafting the instruments that transform inspiration into reality.",
    primaryCta: {
      text: "Find Your Store",
      link: "#dealer-locations"
    },
    secondaryCta: {
      text: "View Our Collection",
      link: "#piano-gallery"
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
      style={{
        willChange: 'transform',
        paddingTop: '70px'
      }}
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        poster="/images/piano-categories/grand-pianos.jpg"
        preload="metadata"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        style={{ willChange: 'transform' }}
        aria-hidden="true"
      >
        <source src="/assets/videos/Hero_compressed.mp4" type="video/mp4" />
      </video>
      
      {/* Dark Overlay for Text Readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-kawai-black/50 z-10" />
      
      {/* Content - Center Aligned with better mobile padding */}
      <div className="container-brand max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 relative z-20 flex flex-col items-center text-center">
        {/* Single semantic page heading for SEO/a11y; design has no visible title here */}
        <SectionHeading className="sr-only">Kawai America — Grand, Upright, Hybrid &amp; Digital Pianos</SectionHeading>
        {/* Centered Est. 1927 */}
        {heroData.establishedText && (
          <motion.div 
            className="absolute top-4 sm:top-8 md:top-12 lg:top-16 left-1/2 transform -translate-x-1/2 z-10"
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

        <div className="w-full mt-16 sm:mt-20 md:mt-24 lg:mt-28">
          <motion.p
            className="text-brand-sophisticated text-kawai-pearl/80 mb-12 lg:mb-16 max-w-2xl text-lg md:text-xl leading-relaxed font-light text-center mx-auto"
            variants={contentReveal}
            custom={1.6}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {heroData.description}
          </motion.p>
        </div>

        {/* CTA Buttons - Side by side */}
        <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
          <motion.div
            variants={contentReveal}
            custom={2.0}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <Button size="lg" className="btn-brand-primary text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7" asChild>
              <Link href={heroData.primaryCta.link}>
                {heroData.primaryCta.text}
              </Link>
            </Button>
          </motion.div>
          <motion.div
            variants={contentReveal}
            custom={2.2}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <Button size="lg" className="btn-brand-secondary text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7" asChild>
              <Link href={heroData.secondaryCta.link}>
                {heroData.secondaryCta.text}
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}