"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import { SLIDE_COMPONENTS, SLIDE_NAMES } from './slides';

export function FadeScrollCinematicPresentation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Track scroll progress within the container itself
  const { scrollYProgress } = useScroll({
    container: containerRef
  });

  // Update current slide state for indicators
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (progress) => {
      const newSlide = Math.round(progress * (SLIDE_COMPONENTS.length - 1));
      if (newSlide !== currentSlide && newSlide >= 0 && newSlide < SLIDE_COMPONENTS.length) {
        setCurrentSlide(newSlide);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, currentSlide]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!containerRef.current) return;

      const slideHeight = containerRef.current.scrollHeight / SLIDE_COMPONENTS.length;
      
      switch (event.key) {
        case 'ArrowDown':
        case 'PageDown':
          event.preventDefault();
          if (currentSlide < SLIDE_COMPONENTS.length - 1) {
            containerRef.current.scrollTo({
              top: (currentSlide + 1) * slideHeight,
              behavior: 'smooth'
            });
          }
          break;
        case 'ArrowUp':
        case 'PageUp':
          event.preventDefault();
          if (currentSlide > 0) {
            containerRef.current.scrollTo({
              top: (currentSlide - 1) * slideHeight,
              behavior: 'smooth'
            });
          }
          break;
        case 'Home':
          event.preventDefault();
          containerRef.current.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          break;
        case 'End':
          event.preventDefault();
          containerRef.current.scrollTo({
            top: containerRef.current.scrollHeight - containerRef.current.clientHeight,
            behavior: 'smooth'
          });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  // Calculate opacity for each slide based on scroll progress
  // Use a simpler approach without complex useTransform calls
  const [slideOpacities, setSlideOpacities] = useState([1, 0, 0, 0, 0]);

  // Update slide opacities based on scroll progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (progress) => {
      const totalSlides = SLIDE_COMPONENTS.length;
      const fadeRange = 0.15;

      const newOpacities = SLIDE_COMPONENTS.map((_, slideIndex) => {
        const slideProgress = slideIndex / (totalSlides - 1);
        const fadeStart = Math.max(0, slideProgress - fadeRange);
        const fadeEnd = Math.min(1, slideProgress + fadeRange);

        // Handle edge cases to prevent division by zero
        if (progress <= fadeStart) return 0;
        if (progress >= fadeEnd) return slideIndex === totalSlides - 1 ? 1 : 0;

        if (progress <= slideProgress) {
          // Fade in: from fadeStart to slideProgress
          const fadeInRange = slideProgress - fadeStart;
          return fadeInRange > 0 ? (progress - fadeStart) / fadeInRange : 1;
        } else {
          // Fade out: from slideProgress to fadeEnd (except last slide)
          if (slideIndex === totalSlides - 1) return 1; // Last slide stays visible
          const fadeOutRange = fadeEnd - slideProgress;
          return fadeOutRange > 0 ? (fadeEnd - progress) / fadeOutRange : 0;
        }
      });

      setSlideOpacities(newOpacities);
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  // Quick navigation to specific slide
  const scrollToSlide = (slideIndex: number) => {
    if (!containerRef.current) return;
    
    const slideHeight = containerRef.current.scrollHeight / SLIDE_COMPONENTS.length;
    containerRef.current.scrollTo({
      top: slideIndex * slideHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative">
      {/* Scrollable Container - Total height = slides × 100vh */}
      <div
        ref={containerRef}
        className="h-screen overflow-y-scroll scrollbar-hide fade-scroll-container"
        style={{
          height: '100vh',
          overflowY: 'scroll',
          scrollBehavior: 'smooth'
        }}
      >
        {/* Spacer element to create scrollable height */}
        <div style={{ height: `${SLIDE_COMPONENTS.length * 100}vh`, position: 'relative' }}>
          {/* All slides positioned absolutely and stacked */}
          {SLIDE_COMPONENTS.map((SlideComponent, index) => (
            <motion.div
              key={index}
              className="fade-slide"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                opacity: slideOpacities[index],
                zIndex: SLIDE_COMPONENTS.length - index, // Higher z-index for earlier slides
              }}
            >
              <SlideComponent />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Progress Indicators */}
      <ProgressIndicators 
        currentSlide={currentSlide}
        totalSlides={SLIDE_COMPONENTS.length}
        slideNames={SLIDE_NAMES}
        scrollProgress={scrollYProgress}
        onSlideClick={scrollToSlide}
      />

      {/* Scroll Instructions */}
      <ScrollInstructions />
    </div>
  );
}

// Enhanced Progress Indicators
interface ProgressIndicatorsProps {
  currentSlide: number;
  totalSlides: number;
  slideNames: readonly string[];
  scrollProgress: any;
  onSlideClick: (index: number) => void;
}

function ProgressIndicators({ 
  currentSlide, 
  totalSlides, 
  slideNames,
  scrollProgress,
  onSlideClick 
}: ProgressIndicatorsProps) {
  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden md:block">
      <div className="flex flex-col gap-4">
        {/* Slide Dots */}
        {Array.from({ length: totalSlides }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => onSlideClick(index)}
            className={`group relative w-3 h-3 rounded-full transition-all duration-500 ${
              index === currentSlide
                ? 'bg-red-500 shadow-lg shadow-red-500/30'
                : 'bg-white/30 hover:bg-white/50'
            }`}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Slide name tooltip */}
            <div className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
              <div className="bg-black/90 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap border border-white/20">
                <span className="font-medium">{slideNames[index]}</span>
                <div className="text-xs text-white/70 mt-1">
                  {index + 1} of {totalSlides}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
        
        {/* Progress Line */}
        <div className="absolute left-1/2 top-0 w-0.5 h-full bg-white/20 rounded-full transform -translate-x-1/2 -z-10">
          <motion.div
            className="bg-red-500 w-full rounded-full origin-top"
            style={{
              scaleY: scrollProgress
            }}
            transition={{ type: "spring", stiffness: 100, damping: 30 }}
          />
        </div>
      </div>
    </div>
  );
}

// Scroll Instructions Component
function ScrollInstructions() {
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowInstructions(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: showInstructions ? 1 : 0, y: showInstructions ? 0 : 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40"
    >
      <div className="bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm border border-white/20">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-lg"
          >
            <div className="w-0.5 h-4 bg-white/60 rounded-full mx-auto mb-1" />
            <div className="w-2 h-1 bg-white/60 rounded-full" />
          </motion.div>
          <span className="hidden sm:inline">Scroll to experience the story</span>
          <span className="sm:hidden">Scroll to explore</span>
        </div>
      </div>
    </motion.div>
  );
}