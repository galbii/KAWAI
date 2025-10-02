"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SLIDE_COMPONENTS, SLIDE_NAMES } from './slides';

// Background Video Component with dynamic video switching
interface BackgroundVideoProps {
  currentSlide: number;
}

function BackgroundVideo({ currentSlide }: BackgroundVideoProps) {
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1);
  const video2PreloadedRef = useRef(false);

  // Determine which video should be playing based on current slide
  // Slides 0-2: Video 1 (powerhouse loop) - Opening, Experience, Premium Sound
  // Slides 3-5: Video 2 (es60studio) - Transformation, FAQ, Finale
  const getActiveVideoNumber = (): 1 | 2 => {
    if (currentSlide >= 3) return 2; // Transformation (3), FAQ (4), Finale (5)
    return 1; // Opening (0), Experience (1), Premium Sound (2)
  };

  // Handle video playback for both videos
  const playVideo = useCallback((video: HTMLVideoElement | null) => {
    if (!video) return;

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
  }, []);

  // Initialize and play video 1 on mount
  useEffect(() => {
    const video1 = video1Ref.current;
    if (!video1) return;

    const handleCanPlay = () => playVideo(video1);
    const handleLoadedData = () => playVideo(video1);

    video1.addEventListener('canplay', handleCanPlay);
    video1.addEventListener('loadeddata', handleLoadedData);

    // Try to play immediately when component mounts
    if (video1.readyState >= 2) {
      playVideo(video1);
    }

    return () => {
      video1.removeEventListener('canplay', handleCanPlay);
      video1.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [playVideo]);

  // Preload video 2 when approaching slide 3
  useEffect(() => {
    // Preload video 2 when on slide 2 (Premium Sound) - one slide before switch to Transformation
    if (currentSlide >= 2 && video2Ref.current && !video2PreloadedRef.current) {
      video2Ref.current.load();
      video2PreloadedRef.current = true;
    }
  }, [currentSlide]);

  // Switch videos with crossfade when slide changes
  useEffect(() => {
    const video1 = video1Ref.current;
    const video2 = video2Ref.current;
    const targetVideo = getActiveVideoNumber();

    // Pause all videos first
    if (video1 && targetVideo !== 1) video1.pause();
    if (video2 && targetVideo !== 2) video2.pause();

    // Set active video and play the target video
    setActiveVideo(targetVideo);

    if (targetVideo === 1 && video1) {
      playVideo(video1);
    } else if (targetVideo === 2 && video2) {
      playVideo(video2);
    }
  }, [currentSlide, playVideo]);

  // Ensure looping works properly - add 'ended' event listener as fallback
  useEffect(() => {
    const video1 = video1Ref.current;
    const video2 = video2Ref.current;

    const handleVideo1Ended = () => {
      if (video1 && activeVideo === 1) {
        video1.currentTime = 0;
        playVideo(video1);
      }
    };

    const handleVideo2Ended = () => {
      if (video2 && activeVideo === 2) {
        video2.currentTime = 0;
        playVideo(video2);
      }
    };

    if (video1) {
      video1.addEventListener('ended', handleVideo1Ended);
    }
    if (video2) {
      video2.addEventListener('ended', handleVideo2Ended);
    }

    return () => {
      if (video1) {
        video1.removeEventListener('ended', handleVideo1Ended);
      }
      if (video2) {
        video2.removeEventListener('ended', handleVideo2Ended);
      }
    };
  }, [activeVideo, playVideo]);

  return (
    <div className="fixed inset-0 z-0">
      {/* Video 1: Powerhouse Loop (Slides 0-2: Opening, Experience, Premium Sound) */}
      <video
        ref={video1Ref}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        style={{ opacity: activeVideo === 1 ? 1 : 0 }}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/videos/es60powerhouse-loop.webm" type="video/webm" />
        <source src="/videos/es60powerhouse-loop.mp4" type="video/mp4" />
      </video>

      {/* Video 2: ES60 Studio (Slides 3-5: Transformation, FAQ, Finale) */}
      <video
        ref={video2Ref}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        style={{ opacity: activeVideo === 2 ? 1 : 0 }}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/videos/es60studio.mp4" type="video/mp4" />
      </video>

      {/* Overlay for better text contrast on mobile - positioned behind to allow backdrop-blur to work */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 md:from-black/10 md:to-black/20 -z-10" />
    </div>
  );
}

export function SimplifiedCinematicPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Preload YouTube resources immediately on mount
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const preconnectDomains = [
      'https://www.youtube.com',
      'https://i.ytimg.com',
      'https://www.google.com'
    ];

    const links: HTMLLinkElement[] = [];

    preconnectDomains.forEach(domain => {
      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = domain;
      preconnect.crossOrigin = 'anonymous';
      document.head.appendChild(preconnect);
      links.push(preconnect);
    });

    return () => {
      links.forEach(link => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, []);

  // Detect touch device
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    checkTouchDevice();
  }, []);

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
        if (entry?.isIntersecting) {
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

  // Add wheel event listener (only on non-touch devices)
  useEffect(() => {
    const container = containerRef.current;
    if (container && !isTouchDevice) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
    return undefined;
  }, [handleWheel, isTouchDevice]);

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
      <BackgroundVideo currentSlide={currentSlide} />

      {/* Main Scroll Container */}
      <div
        ref={containerRef}
        className="h-screen overflow-y-scroll scrollbar-hide relative z-10"
        style={{
          scrollSnapType: 'y mandatory',
          WebkitScrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        } as React.CSSProperties}
      >
        {SLIDE_COMPONENTS.map((SlideComponent, index) => (
          <div
            key={index}
            data-slide-index={index}
            className="scroll-snap-slide relative"
            style={{
              height: '100vh',
              scrollSnapAlign: 'start',
              WebkitScrollSnapAlign: 'start',
              scrollSnapStop: 'always',
              WebkitScrollSnapStop: 'always'
            } as React.CSSProperties}
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