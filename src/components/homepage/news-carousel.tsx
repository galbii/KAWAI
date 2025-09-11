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
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  
  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;
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

  // Touch event handlers for mobile swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset touch end
    setTouchStart(e.targetTouches[0].clientX);
    setIsPlaying(false); // Pause auto-play during touch
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
    
    // Resume auto-play after swipe
    setTimeout(() => setIsPlaying(true), 2000);
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
      className="relative w-full h-[60vh] sm:h-[70vh] overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
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

      {/* Content with better mobile positioning */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 md:p-12 lg:p-16">
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

            {/* Title with better mobile typography */}
            <motion.h2
              variants={textItemVariants}
              className="font-brand-luxury text-kawai-pearl font-bold text-xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight mb-3 sm:mb-4 tracking-tight"
            >
              {currentItem.title}
            </motion.h2>

            {/* Description with improved mobile readability */}
            <motion.p
              variants={textItemVariants}
              className="text-kawai-pearl/90 text-base sm:text-lg md:text-xl leading-relaxed font-light mb-4 sm:mb-6 max-w-xl"
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

      {/* Navigation Arrows - Better mobile sizing and positioning */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 sm:left-8 md:left-12 lg:left-16 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-kawai-black/40 hover:bg-kawai-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-kawai-pearl hover:text-kawai-red transition-all duration-300 group touch-manipulation"
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
        className="absolute right-4 sm:right-8 md:right-12 lg:right-16 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-kawai-black/40 hover:bg-kawai-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-kawai-pearl hover:text-kawai-red transition-all duration-300 group touch-manipulation"
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

      {/* Dot Indicators - Better mobile positioning */}
      <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 md:right-12 lg:right-16 flex space-x-2">
        {data.newsItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 sm:w-2 sm:h-2 rounded-full transition-all duration-300 touch-manipulation ${
              index === currentIndex
                ? 'bg-kawai-red scale-125'
                : 'bg-kawai-pearl/40 hover:bg-kawai-pearl/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Mobile swipe indicator */}
      <div className="absolute bottom-4 left-4 sm:hidden">
        <div className="text-kawai-pearl/60 text-xs flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
          </svg>
          Swipe
        </div>
      </div>
    </section>
  );
}