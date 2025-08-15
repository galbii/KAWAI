"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function Hero() {
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
      
      {/* Content - Left Aligned */}
      <div className="container-brand max-w-8xl mx-auto px-8 lg:px-16 relative z-20">
        {/* Local positioning and Est. 1927 */}
        <motion.div 
          className="absolute -top-24 left-1 z-10"
          variants={contentReveal}
          custom={0}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <p className="text-brand-musical text-kawai-pearl tracking-wider text-sm font-semibold uppercase mb-2">
            St. Louis's Premier Kawai Piano Dealer
          </p>
          <p className="text-brand-musical text-kawai-red tracking-wider text-sm font-semibold uppercase">
            Est. 1927 • Lake St. Louis, Missouri
          </p>
        </motion.div>

        <div className="max-w-5xl">
          <div className="mb-12 lg:mb-16">
            <h1 className="heading-brand-luxury text-kawai-pearl mb-8 lg:mb-12 leading-[0.75] tracking-tight">
              <motion.span 
                className="block text-2xl md:text-3xl lg:text-4xl font-normal mb-6 tracking-[0.2em] opacity-90"
                variants={wordReveal}
                custom={0.8}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                The
              </motion.span>
              <motion.span 
                className="block text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-[-0.02em] leading-[0.8]"
                variants={wordReveal}
                custom={1.6}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                INSTRUMENTAL
              </motion.span>
              <motion.div 
                className="block text-3xl md:text-4xl lg:text-5xl font-light mt-4 tracking-[0.1em] opacity-90"
                variants={wordReveal}
                custom={2.0}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                to Life
              </motion.div>
            </h1>
          </div>
          
          <motion.p 
            className="text-brand-sophisticated text-kawai-pearl/80 mb-brand-4xl max-w-lg text-lg md:text-xl leading-relaxed font-light"
            variants={contentReveal}
            custom={2.5}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            Every musician harbors a vision. Every performance seeks perfection. 
            Since 1927, we've been crafting the instruments that transform inspiration into reality. 
            Visit our Lake St. Louis showroom and discover why we're Missouri's trusted Kawai piano experts.
          </motion.p>
          
          <div className="flex flex-col sm:flex-row gap-brand-lg items-start">
            <motion.div 
              variants={contentReveal}
              custom={3.0}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <Button size="lg" className="btn-brand-primary" asChild>
                <Link href="/pianos">
                  View Our Piano Collection
                </Link>
              </Button>
            </motion.div>
            <motion.div 
              variants={contentReveal}
              custom={3.3}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <Button size="lg" className="btn-brand-secondary" asChild>
                <Link href="/contact">
                  Visit Our St. Louis Showroom
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}