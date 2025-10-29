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
      className="relative bg-kawai-pearl py-16 sm:py-20 lg:py-28"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-3">
            Latest News
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light font-serif text-kawai-black">
            Stay Updated
          </h2>
        </div>

        {/* Carousel Container */}
        <div
          ref={carouselRef}
          className="relative"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Main Carousel Card */}
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" custom={currentIndex}>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="w-full"
              >
                {/* Split Layout Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                  <div className="grid lg:grid-cols-2 min-h-[500px] lg:min-h-[600px]">
                    {/* Content Side - Left */}
                    <div className="relative flex flex-col justify-center p-8 sm:p-10 lg:p-12 xl:p-16 order-2 lg:order-1">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-6"
                      >
                        {(() => {
                          const currentItem = newsItems[currentIndex];
                          if (!currentItem) return null;

                          return (
                            <>
                              {/* Category Badge */}
                              <div>
                                <span className="inline-block px-4 py-2 text-xs font-bold tracking-[0.2em] uppercase bg-kawai-red text-white rounded-full">
                                  {currentItem.category}
                                </span>
                              </div>

                              {/* Title */}
                              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-light font-serif text-kawai-black leading-tight">
                                {currentItem.title}
                              </h3>

                              {/* Description */}
                              <p className="text-lg sm:text-xl text-kawai-black/70 leading-relaxed">
                                {currentItem.description}
                              </p>

                              {/* CTA Button */}
                              <div className="pt-4">
                                <Link
                                  href={currentItem.link || '#'}
                                  className="inline-flex items-center space-x-3 bg-kawai-red hover:bg-kawai-red/90 text-white px-8 py-4 rounded-full font-medium text-sm tracking-wide uppercase transition-all duration-300 shadow-lg hover:shadow-xl group"
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
                              </div>
                            </>
                          );
                        })()}
                      </motion.div>

                    </div>

                    {/* Image Side - Right */}
                    <div className="relative min-h-[300px] lg:min-h-full order-1 lg:order-2">
                      <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative w-full h-full"
                      >
                        {(() => {
                          const currentItem = newsItems[currentIndex];
                          if (!currentItem) return null;

                          const defaultItem = FALLBACK_NEWS_CAROUSEL_DATA.newsItems.find(
                            defaultNews => defaultNews.title === currentItem.title
                          );
                          const fallbackImage = (typeof defaultItem?.image === 'string' ? defaultItem.image : null) || '/images/banners/I2LNew-banner.jpg';

                          const imageProps = getFallbackImageProps(
                            currentItem.image,
                            fallbackImage,
                            'hero',
                            {
                              fill: true,
                              className: 'object-cover',
                              sizes: '(max-width: 1024px) 100vw, 50vw',
                              priority: currentIndex === 0,
                              context: {
                                type: 'news'
                              }
                            }
                          );

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

                        {/* Gradient Overlay - Subtle */}
                        <div className="absolute inset-0 bg-gradient-to-t from-kawai-black/20 via-transparent to-transparent lg:hidden" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center mt-8 sm:mt-10">
            <div className="flex items-center space-x-4">
              <button
                onClick={goToPrevious}
                className="w-12 h-12 sm:w-14 sm:h-14 bg-white hover:bg-kawai-red text-kawai-black hover:text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl border border-kawai-pearl hover:border-kawai-red group"
                aria-label="Previous slide"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:-translate-x-0.5"
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
                className="w-12 h-12 sm:w-14 sm:h-14 bg-white hover:bg-kawai-red text-kawai-black hover:text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl border border-kawai-pearl hover:border-kawai-red group"
                aria-label="Next slide"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}