"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SLIDE_COMPONENTS, SLIDE_NAMES } from './slides';

// Background Video Component with seamless forward-reverse loop
function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      // Start playing when video is ready
      video.play().catch((error) => {
        console.warn('Video autoplay failed:', error);
        // Try again after user interaction
        const tryPlay = () => {
          video.play().catch(console.error);
          document.removeEventListener('click', tryPlay);
          document.removeEventListener('touchstart', tryPlay);
        };
        document.addEventListener('click', tryPlay);
        document.addEventListener('touchstart', tryPlay);
      });
    };

    const handleLoadedData = () => {
      // Ensure video starts when loaded
      video.play().catch(console.error);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadeddata', handleLoadedData);

    // Try to play immediately when component mounts
    if (video.readyState >= 2) {
      video.play().catch(console.error);
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
      >
        <source src="/videos/es60powerhouse-loop.webm" type="video/webm" />
        <source src="/videos/es60powerhouse-loop.mp4" type="video/mp4" />
      </video>
      {/* Subtle overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
    </div>
  );
}

export function SimplifiedCinematicPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
        case 'PageDown':
          event.preventDefault();
          scrollToSlide(Math.min(currentSlide + 1, SLIDE_COMPONENTS.length - 1));
          break;
        case 'ArrowUp':
        case 'PageUp':
          event.preventDefault();
          scrollToSlide(Math.max(currentSlide - 1, 0));
          break;
        case 'Home':
          event.preventDefault();
          scrollToSlide(0);
          break;
        case 'End':
          event.preventDefault();
          scrollToSlide(SLIDE_COMPONENTS.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  // Track current slide with intersection observer for better accuracy
  useEffect(() => {
    const observerOptions = {
      root: containerRef.current,
      rootMargin: '-40% 0px -40% 0px', // Only trigger when slide is centered
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const slideIndex = parseInt(entry.target.getAttribute('data-slide-index') || '0');
          setCurrentSlide(slideIndex);
        }
      });
    }, observerOptions);

    // Observe all slides
    const slides = containerRef.current?.querySelectorAll('[data-slide-index]');
    slides?.forEach(slide => observer.observe(slide));

    return () => {
      slides?.forEach(slide => observer.unobserve(slide));
    };
  }, []);

  // Handle wheel events for better scroll control
  const handleWheel = useCallback((event: WheelEvent) => {
    if (Math.abs(event.deltaY) < 50) return; // Ignore small scroll movements

    event.preventDefault();

    if (event.deltaY > 0) {
      // Scroll down
      scrollToSlide(Math.min(currentSlide + 1, SLIDE_COMPONENTS.length - 1));
    } else {
      // Scroll up
      scrollToSlide(Math.max(currentSlide - 1, 0));
    }
  }, [currentSlide]);

  // Add wheel event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  const scrollToSlide = (slideIndex: number) => {
    if (!containerRef.current) return;
    
    const slideHeight = containerRef.current.clientHeight;
    containerRef.current.scrollTo({
      top: slideIndex * slideHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative">
      {/* Background Video - Fixed behind everything */}
      <BackgroundVideo />

      {/* Main Scroll Container */}
      <div
        ref={containerRef}
        className="h-screen overflow-y-scroll scrollbar-hide relative z-10"
        style={{
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {SLIDE_COMPONENTS.map((SlideComponent, index) => (
          <div
            key={index}
            data-slide-index={index}
            className="scroll-snap-slide relative"
            style={{
              height: '100vh',
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always'
            }}
          >
            <SlideComponent />
          </div>
        ))}
      </div>

      {/* Scroll Progress Indicator */}
      <ScrollIndicator
        currentSlide={currentSlide}
        totalSlides={SLIDE_COMPONENTS.length}
        slideNames={SLIDE_NAMES}
        onSlideClick={scrollToSlide}
      />

      {/* Mobile Instructions */}
      <MobileInstructions />
    </div>
  );
}

// Scroll Progress Indicator Component
interface ScrollIndicatorProps {
  currentSlide: number;
  totalSlides: number;
  slideNames: readonly string[];
  onSlideClick: (index: number) => void;
}

function ScrollIndicator({ 
  currentSlide, 
  totalSlides, 
  slideNames, 
  onSlideClick 
}: ScrollIndicatorProps) {
  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden md:block">
      <div className="flex flex-col gap-3">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => onSlideClick(index)}
            className={`group relative w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-red-500 shadow-lg shadow-red-500/30'
                : 'bg-white/30 hover:bg-white/50'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Slide name tooltip */}
            <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {slideNames[index]}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
      
      {/* Progress line */}
      <div className="absolute left-1/2 top-0 w-0.5 h-full bg-white/20 rounded-full transform -translate-x-1/2 -z-10">
        <motion.div
          className="bg-red-500 w-full rounded-full"
          initial={{ height: '0%' }}
          animate={{ height: `${((currentSlide + 1) / totalSlides) * 100}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

// Mobile Instructions Component
function MobileInstructions() {
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowInstructions(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: showInstructions ? 1 : 0, y: showInstructions ? 0 : 20 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 md:hidden"
    >
      <div className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-lg"
          >
            👆
          </motion.div>
          <span>Swipe up to explore</span>
        </div>
      </div>
    </motion.div>
  );
}