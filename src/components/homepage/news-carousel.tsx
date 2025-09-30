"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { NewsCarouselProps } from '@/lib/types/homepage';
import { getImagePropsWithFallback } from '@/lib/media/r2-utils';
import {
  withFallback,
  withArrayFallback,
  FALLBACK_NEWS_CAROUSEL_DATA
} from '@/lib/fallbacks';
import {
  getImagePropsWithFallback as getFallbackImageProps,
  createImageErrorHandler
} from '@/lib/fallbacks/media';

export function NewsCarousel({ data }: NewsCarouselProps) {
  // Use comprehensive fallback system
  const carouselData = withFallback(data, FALLBACK_NEWS_CAROUSEL_DATA);
  const newsItems = withArrayFallback(carouselData.newsItems, FALLBACK_NEWS_CAROUSEL_DATA.newsItems, 1);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const sectionRef = useRef(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const minSwipeDistance = 50;
  const SLIDE_DURATION = carouselData.autoPlayDuration;

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || !isInView || newsItems.length <= 1) return;

    const slideTimer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
    }, SLIDE_DURATION);

    return () => clearTimeout(slideTimer);
  }, [isPlaying, currentIndex, isInView, newsItems.length, SLIDE_DURATION]);

  // Navigation functions
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? newsItems.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
  };

  // Touch event handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    if (e.targetTouches[0]) {
      setTouchStart(e.targetTouches[0].clientX);
    }
    setIsPlaying(false);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.targetTouches[0]) {
      setTouchEnd(e.targetTouches[0].clientX);
    }
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
    
    setTimeout(() => setIsPlaying(true), 2000);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  // Reduced motion support
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;




  return (
    <section
      ref={sectionRef}
      className="relative bg-white py-16 sm:py-24"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-2">
            Latest News
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-light font-serif text-kawai-black">
            Stay Updated
          </h2>
        </div>

        {/* Carousel Container */}
        <div 
          ref={carouselRef}
          className="relative overflow-hidden w-full"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Carousel Track */}
          <div className="relative w-full h-[60vh] sm:h-[70vh] min-h-[500px] max-h-[800px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                {/* News Card - Full Image with Overlay */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                  <div className="relative w-full h-full">
                    {(() => {
                      const currentItem = newsItems[currentIndex];
                      if (!currentItem) return null;

                      const defaultItem = FALLBACK_NEWS_CAROUSEL_DATA.newsItems.find(
                        defaultNews => defaultNews.title === currentItem.title
                      );
                      const fallbackImage = (typeof defaultItem?.image === 'string' ? defaultItem.image : null) || '/images/banners/I2LNew-banner.jpg';

                      // Use enhanced fallback utility with context
                      const imageProps = getFallbackImageProps(
                        currentItem.image,
                        fallbackImage,
                        'hero',
                        {
                          fill: true,
                          className: 'object-cover',
                          sizes: '100vw',
                          priority: currentIndex === 0,
                          context: {
                            type: 'news'
                          }
                        }
                      );

                      // Create error handler for automatic fallback
                      const handleImageError = createImageErrorHandler({
                        type: 'news'
                      });

                      return (
                        <Image
                          {...imageProps}
                          alt={currentItem.title}
                          onError={handleImageError}
                        />
                      );
                    })()}

                    {/* Navigation Arrows - On Image */}
                    <button
                      onClick={goToPrevious}
                      className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 sm:w-14 sm:h-14 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-300 border border-white/30 hover:border-white/50"
                      aria-label="Previous slide"
                    >
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 hover:-translate-x-0.5"
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
                      className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 sm:w-14 sm:h-14 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-300 border border-white/30 hover:border-white/50"
                      aria-label="Next slide"
                    >
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 hover:translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-12 lg:p-16">
                      {(() => {
                        const currentItem = newsItems[currentIndex];
                        if (!currentItem) return null;

                        return (
                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="max-w-3xl"
                          >
                            {/* Category Badge */}
                            <div className="mb-4">
                              <span className="inline-block px-4 py-2 text-xs font-bold tracking-[0.2em] uppercase bg-kawai-red text-white rounded-full shadow-lg">
                                {currentItem.category}
                              </span>
                            </div>

                            {/* Title - Bold and Prominent */}
                            <h3 className="font-brand-luxury text-white font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-4 sm:mb-6 tracking-tight drop-shadow-lg">
                              {currentItem.title}
                            </h3>

                            {/* Description */}
                            <p className="text-white/90 text-lg sm:text-xl md:text-2xl leading-relaxed font-light mb-6 sm:mb-8 max-w-2xl drop-shadow-md">
                              {currentItem.description}
                            </p>

                            {/* Read More Link */}
                            <Link
                              href={currentItem.link || '#'}
                          className="inline-flex items-center space-x-3 text-kawai-red hover:text-white bg-white/20 hover:bg-kawai-red/90 backdrop-blur-sm px-6 py-3 rounded-full font-medium text-sm tracking-wide uppercase transition-all duration-300 border border-white/30 hover:border-kawai-red/90 group"
                        >
                          <span>Read Full Story</span>
                          <svg
                            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                            </Link>
                          </motion.div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}