"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MediaRenderer } from "@/components/ui/media/MediaRenderer";
import type { HeroProps } from "@/lib/types/homepage";
import { DEFAULT_HERO_DATA } from "@/lib/types/homepage";

export function Hero({ data = DEFAULT_HERO_DATA, storefrontName }: HeroProps) {
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
      {/* Hidden H1 for SEO - Only rendered for storefront pages */}
      {storefrontName && (
        <h1 className="sr-only">KAWAI {storefrontName}</h1>
      )}

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

      {/* Content - Centered */}
      <div className="container-brand max-w-8xl mx-auto px-8 sm:px-12 lg:px-16 relative z-20">
        <div className="max-w-6xl mx-auto">
          {/* Location and Established - Centered */}
          <motion.div
            className="text-center mb-8 sm:mb-12"
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
            <div className="heading-brand-luxury text-kawai-pearl mb-8 lg:mb-12 leading-tight tracking-tight text-center">
              <motion.div
                className="flex justify-center"
                variants={wordReveal}
                custom={0.4}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                <Image
                  src="/images/instrumental-to-life-logo.svg"
                  alt="Instrumental to Life"
                  width={600}
                  height={180}
                  className="w-full max-w-[350px] sm:max-w-[450px] md:max-w-[550px] lg:max-w-[650px] h-auto"
                  priority
                />
              </motion.div>
            </div>
          </div>

          <motion.p
            className="text-brand-sophisticated text-kawai-pearl/80 mb-12 lg:mb-16 max-w-2xl text-lg md:text-xl leading-relaxed font-light text-center mx-auto"
            variants={contentReveal}
            custom={1.6}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {data.description}
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
            <motion.div
              variants={contentReveal}
              custom={2.0}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <Button size="lg" className="btn-brand-primary text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7" asChild>
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
              <Button size="lg" className="btn-brand-secondary text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7" asChild>
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