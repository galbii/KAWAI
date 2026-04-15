"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { NewsCarouselProps, NewsItem } from '@/lib/types/homepage';
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
import { NAMMCarouselSlide } from './NAMMCarouselSlide';
import { NewsImageCarousel } from './NewsImageCarousel';
import { NewsVideoBackground } from './NewsVideoBackground';

export function NewsCarousel({ data }: NewsCarouselProps) {
  // Use comprehensive fallback system
  const carouselData = withFallback(data, FALLBACK_NEWS_CAROUSEL_DATA);
  const newsItems = withArrayFallback(carouselData.newsItems, FALLBACK_NEWS_CAROUSEL_DATA.newsItems, 1);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const sectionRef = useRef(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const minSwipeDistance = 50;
  const SLIDE_DURATION = carouselData.autoPlayDuration;

  // Auto-play functionality — deferred 2s so autoplay doesn't run during hydration
  const [autoPlayReady, setAutoPlayReady] = useState(false);
  useEffect(() => {
    const startDelay = setTimeout(() => setAutoPlayReady(true), 2000);
    return () => clearTimeout(startDelay);
  }, []);

  useEffect(() => {
    if (!isPlaying || !isInView || !autoPlayReady || newsItems.length <= 1) return;

    const slideTimer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
    }, SLIDE_DURATION);

    return () => clearTimeout(slideTimer);
  }, [isPlaying, currentIndex, isInView, autoPlayReady, newsItems.length, SLIDE_DURATION]);

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

  // Reset image loaded state when slide changes
  useEffect(() => {
    setImageLoaded(false);
  }, [currentIndex]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[85vh] min-h-[600px] overflow-hidden"
    >
      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className="relative w-full h-full"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence mode="wait" custom={currentIndex}>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.8,
              ease: "easeInOut"
            }}
            className="absolute inset-0"
          >
            {(() => {
              const currentItem = newsItems[currentIndex];
              if (!currentItem) return null;

              // Check if this is the special NAMM slide with scrolling background
              const isNAMMSlide = currentItem.category === 'namm-event' ||
                                  currentItem.link === '/namm-2026';

              // Render custom NAMM slide with scrolling background
              if (isNAMMSlide) {
                return <NAMMCarouselSlide prefersReducedMotion={prefersReducedMotion} />;
              }

              // Render video background if videoUrl is present
              if (currentItem.videoUrl) {
                return (
                  <NewsVideoBackground
                    title={currentItem.title}
                    description={currentItem.description}
                    videoUrl={currentItem.videoUrl}
                    videoSource={currentItem.videoSource || 'youtube'}
                    youtubeZoom={currentItem.youtubeZoom ?? null}
                    category={currentItem.category}
                    link={currentItem.link}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                );
              }

              // Render image carousel if multiple images are present
              if (currentItem.images && currentItem.images.length > 0) {
                return (
                  <NewsImageCarousel
                    title={currentItem.title}
                    description={currentItem.description}
                    images={currentItem.images}
                    category={currentItem.category}
                    link={currentItem.link}
                    prefersReducedMotion={prefersReducedMotion}
                    slideDuration={SLIDE_DURATION}
                  />
                );
              }

              // Regular slide rendering
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
                  sizes: '100vw',
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
                <>
                  {/* Background Image with Ken Burns Effect */}
                  <motion.div
                    className="absolute inset-0"
                    initial={{ scale: 1 }}
                    animate={{ scale: imageLoaded ? 1.05 : 1 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : SLIDE_DURATION / 1000,
                      ease: "linear"
                    }}
                  >
                    <Image
                      {...imageProps}
                      alt={currentItem.title}
                      onError={handleImageError}
                      onLoad={() => setImageLoaded(true)}
                    />
                  </motion.div>

                  {/* Gradient Overlays for Better Text Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-kawai-black/80 via-kawai-black/40 to-kawai-black/30" />
                  <div className="absolute inset-0 bg-gradient-to-r from-kawai-black/60 via-transparent to-transparent" />

                  {/* Category Badge - Top Right */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="absolute top-8 right-8 sm:top-12 sm:right-12 lg:top-16 lg:right-16 z-20"
                  >
                    <span className="inline-block px-6 py-3 text-xs font-bold tracking-[0.25em] uppercase bg-kawai-red/90 backdrop-blur-sm text-white rounded-full shadow-xl border border-white/10">
                      {currentItem.category}
                    </span>
                  </motion.div>

                  {/* Content Overlay - Bottom Left with Glassmorphism */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12 lg:bottom-16 lg:left-16 right-8 sm:right-12 lg:right-1/3 z-20"
                  >
                    {/* Glassmorphism Container */}
                    <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 sm:p-10 lg:p-12 shadow-2xl">
                      <div className="space-y-6">
                        {/* Small Label */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.6, delay: 0.5 }}
                        >
                          <span className="text-xs text-kawai-pearl tracking-[0.2em] uppercase font-medium">
                            Latest News
                          </span>
                        </motion.div>

                        {/* Title */}
                        <motion.h3
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.6 }}
                          className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light font-serif text-white leading-tight"
                        >
                          {currentItem.title}
                        </motion.h3>

                        {/* Description */}
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.7 }}
                          className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl"
                        >
                          {currentItem.description}
                        </motion.p>

                        {/* CTA Button */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.8 }}
                          className="pt-4"
                        >
                          <Link
                            href={currentItem.link || '#'}
                            className="inline-flex items-center space-x-3 bg-white hover:bg-kawai-red text-kawai-black hover:text-white px-8 py-4 rounded-full font-medium text-sm tracking-wide uppercase transition-all duration-300 shadow-lg hover:shadow-2xl group"
                          >
                            <span>{currentItem.ctaText || 'Read Full Story'}</span>
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
                      </div>
                    </div>
                  </motion.div>
                </>
              );
            })()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots - Bottom Center */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex items-center space-x-3">
          {newsItems.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsPlaying(false);
                setTimeout(() => setIsPlaying(true), 2000);
              }}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-12 h-3 bg-white shadow-lg'
                  : 'w-3 h-3 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex}
            />
          ))}
        </div>

        {/* Play/Pause Button - Bottom Right */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12 z-30 w-12 h-12 backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
          aria-label={isPlaying ? 'Pause autoplay' : 'Resume autoplay'}
        >
          {isPlaying ? (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </motion.button>
      </div>
    </section>
  );
}