"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

/**
 * FinderHero Component
 *
 * Hero section for the Piano Finder page featuring:
 * - SEO-optimized headline targeting "piano finder" keyword
 * - Value proposition addressing buyer journey awareness stage
 * - Dual CTAs (primary: scroll to quiz, secondary: how it works)
 * - Elegant background gradient with Kawai brand colors
 * - Framer Motion scroll animations with IntersectionObserver
 *
 * Design follows Kawai's Japanese-inspired aesthetic:
 * - Section label in uppercase red text
 * - Large serif headline with light weight
 * - Spacious layout with generous padding
 * - Pearl-to-white gradient background
 */

interface FinderHeroProps {
  className?: string;
}

export function FinderHero({ className = "" }: FinderHeroProps) {
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

  /**
   * Smooth scroll handler for CTA buttons
   * Scrolls to quiz tool or how-it-works section with offset for fixed header
   */
  const handleScrollTo = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`relative bg-gradient-to-b from-kawai-pearl to-white py-16 sm:py-20 lg:py-28 overflow-hidden ${className}`}
      aria-labelledby="finder-hero-heading"
    >
      {/* Decorative background element */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-kawai-red rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Section Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase"
          >
            Find Your Perfect Piano
          </motion.div>

          {/* Main Headline - SEO optimized for "piano finder" keyword */}
          <motion.h1
            id="finder-hero-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light font-serif text-kawai-black leading-tight"
          >
            Discover Your Ideal Piano in{" "}
            <span className="text-kawai-red">7 Questions</span>
          </motion.h1>

          {/* Value Proposition - Addresses awareness stage buyer needs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4 text-lg sm:text-xl text-kawai-black/80 leading-relaxed max-w-3xl mx-auto"
          >
            <p>
              Choosing the right piano can feel overwhelming with countless models, features, and price points to consider.
              Our intelligent{" "}
              <strong className="font-medium text-kawai-black">piano finder tool</strong>{" "}
              simplifies your search by matching you with the perfect Kawai instrument based on your unique needs,
              experience level, and musical goals.
            </p>
            <p>
              Whether you're a beginner taking your first steps, a parent investing in your child's musical education,
              or an experienced player seeking an upgrade, our{" "}
              <strong className="font-medium text-kawai-black">piano selection guide</strong>{" "}
              combines expert knowledge with Kawai's 95+ years of craftsmanship to recommend instruments that will
              inspire and grow with you. Get personalized recommendations in under 3 minutes.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            {/* Primary CTA - Scroll to Quiz Tool */}
            <button
              onClick={() => handleScrollTo("quiz-tool")}
              className="group relative bg-kawai-red hover:bg-kawai-red/90 text-white font-medium px-8 py-4 rounded-md text-lg transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto"
              aria-label="Start the piano finder quiz"
            >
              <span className="relative z-10">Start Your Piano Finder</span>
              <div className="absolute inset-0 bg-gradient-to-r from-kawai-red to-kawai-red/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md" />
            </button>

            {/* Secondary CTA - How It Works */}
            <button
              onClick={() => handleScrollTo("how-it-works")}
              className="group border-2 border-kawai-red text-kawai-red hover:bg-kawai-red hover:text-white font-medium px-8 py-4 rounded-md text-lg transition-all duration-300 w-full sm:w-auto"
              aria-label="Learn how the piano finder works"
            >
              How It Works
              <span className="inline-block ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 sm:gap-8 pt-8 text-sm text-kawai-black/60"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-kawai-red" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>7 Expert Questions</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-kawai-red" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Under 3 Minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-kawai-red" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Personalized Results</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-kawai-red" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>95+ Years of Expertise</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
