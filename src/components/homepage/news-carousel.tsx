"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { NewsCarouselProps, DEFAULT_NEWS_CAROUSEL_DATA } from '@/lib/types/homepage';
import { getImagePropsWithFallback } from '@/lib/media/r2-utils';


export function NewsCarousel({ data = DEFAULT_NEWS_CAROUSEL_DATA }: NewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const SLIDE_DURATION = data.autoPlayDuration; // Dynamic slide duration from CMS

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || !isInView) return;

    const slideTimer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.newsItems.length);
    }, SLIDE_DURATION);

    return () => clearTimeout(slideTimer);
  }, [isPlaying, currentIndex, isInView]);

  // Pause/resume on hover
  const handleMouseEnter = () => setIsPlaying(false);
  const handleMouseLeave = () => setIsPlaying(true);

  // Navigation functions
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? data.newsItems.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.newsItems.length);
  };

  // Reduced motion support
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const currentItem = data.newsItems[currentIndex];

  const imageVariants = {
    enter: {
      opacity: prefersReducedMotion ? 1 : 0,
      scale: prefersReducedMotion ? 1 : 1.05,
      filter: prefersReducedMotion ? 'blur(0px)' : 'blur(2px)'
    },
    center: {
      opacity: 1,
      scale: 1.02, // Subtle Ken Burns effect
      filter: 'blur(0px)',
      transition: {
        opacity: { duration: prefersReducedMotion ? 0 : 1.2 },
        scale: { duration: prefersReducedMotion ? 0 : 8 },
        filter: { duration: prefersReducedMotion ? 0 : 1 }
      }
    },
    exit: {
      opacity: prefersReducedMotion ? 1 : 0,
      scale: prefersReducedMotion ? 1 : 1,
      filter: prefersReducedMotion ? 'blur(0px)' : 'blur(1px)',
      transition: {
        duration: prefersReducedMotion ? 0 : 0.8,
      }
    }
  };

  const textContainerVariants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.8,
        delay: prefersReducedMotion ? 0 : 0.6,
        staggerChildren: prefersReducedMotion ? 0 : 0.15
      }
    }
  };

  const textItemVariants = {
    hidden: {
      opacity: prefersReducedMotion ? 1 : 0,
      y: prefersReducedMotion ? 0 : 12,
      filter: prefersReducedMotion ? 'blur(0px)' : 'blur(1px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: prefersReducedMotion ? 0 : 0.7,
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[70vh] overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: 'transform' }}
    >
      {/* Image Container */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="absolute inset-0"
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {(() => {
              // Find the corresponding default news item for fallback image
              const defaultItem = DEFAULT_NEWS_CAROUSEL_DATA.newsItems.find(
                defaultNews => defaultNews.title === currentItem.title
              );
              const fallbackImage = (typeof defaultItem?.image === 'string' ? defaultItem.image : null) || '/images/banners/I2LNew-banner.jpg';

              // Use the utility function to get image props
              const imageProps = getImagePropsWithFallback(
                currentItem.image, 
                fallbackImage, 
                'hero', 
                {
                  fill: true,
                  className: 'object-cover',
                  sizes: '100vw',
                  priority: currentIndex === 0
                }
              );

              return (
                <Image
                  {...imageProps}
                  alt={currentItem.title}
                  style={{ willChange: 'transform' }}
                />
              );
            })()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Minimal Gradient Overlay - Only for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-kawai-black/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            variants={textContainerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            {/* Category Badge */}
            <motion.div
              variants={textItemVariants}
              className="mb-4"
            >
              <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wide uppercase bg-kawai-red text-kawai-pearl rounded-full">
                {currentItem.category}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h2
              variants={textItemVariants}
              className="font-brand-luxury text-kawai-pearl font-bold text-3xl md:text-4xl lg:text-5xl leading-tight mb-4 tracking-tight"
            >
              {currentItem.title}
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={textItemVariants}
              className="text-kawai-pearl/90 text-lg md:text-xl leading-relaxed font-light mb-6"
            >
              {currentItem.description}
            </motion.p>

            {/* Read More Link */}
            <motion.div variants={textItemVariants}>
              <Link
                href={currentItem.link || '#'}
                className="inline-flex items-center text-kawai-red hover:text-kawai-red-400 font-medium text-sm tracking-wide uppercase transition-all duration-300 group"
              >
                <span>Read More</span>
                <svg
                  className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-8 md:left-12 lg:left-16 top-1/2 -translate-y-1/2 w-12 h-12 bg-kawai-black/30 hover:bg-kawai-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-kawai-pearl hover:text-kawai-red transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <svg
          className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-8 md:right-12 lg:right-16 top-1/2 -translate-y-1/2 w-12 h-12 bg-kawai-black/30 hover:bg-kawai-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-kawai-pearl hover:text-kawai-red transition-all duration-300 group"
        aria-label="Next slide"
      >
        <svg
          className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 right-8 md:right-12 lg:right-16 flex space-x-2">
        {data.newsItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-kawai-red scale-125'
                : 'bg-kawai-pearl/40 hover:bg-kawai-pearl/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}