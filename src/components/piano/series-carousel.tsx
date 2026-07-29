"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useEffect, useRef, useState } from "react";

interface Piano {
  slug: string;
  name: string;
  series: string;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  keyFeatures: string[];
}

interface SeriesCarouselProps {
  pianos: Piano[];
  activeSeriesName: string;
}

export function SeriesCarousel({ pianos, activeSeriesName }: SeriesCarouselProps) {
  const animationRef = useRef<number | null>(null);

  // Auto-scroll respects a user-operable play/pause control (WCAG 2.2.2) and
  // pauses on hover/focus. Defaults to playing; reduced-motion users start paused.
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const runningRef = useRef(false);
  const shouldRun = isPlaying && !isPaused;
  const shouldRunRef = useRef(shouldRun);
  shouldRunRef.current = shouldRun;

  const stopScroll = () => {
    runningRef.current = false;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const startSmoothScroll = (slider: any) => {
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    runningRef.current = true;

    const tryStart = () => {
      if (!runningRef.current) return;
      if (!slider?.track?.details) {
        // Retry if track details not ready yet
        setTimeout(tryStart, 100);
        return;
      }

      const animate = () => {
        if (!runningRef.current) {
          animationRef.current = null;
          return;
        }
        if (slider.track && slider.track.details) {
          // Use track.add() for relative movement - works better with loop
          const increment = 0.0006; // Ultra slow, smooth scrolling
          slider.track.add(increment);
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    tryStart();
  };

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      drag: false,
      slides: {
        perView: "auto",
        spacing: 0,
      },
      created(s) {
        if (shouldRunRef.current) startSmoothScroll(s);
      },
      updated(s) {
        if (shouldRunRef.current) startSmoothScroll(s);
      },
      detailsChanged(s) {
        if (shouldRunRef.current) startSmoothScroll(s);
      },
    }
  );

  // Respect prefers-reduced-motion: start paused and follow live changes.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) setIsPlaying(false);
    const onChange = (e: MediaQueryListEvent) => setIsPlaying(!e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Start/stop the marquee whenever the effective run state changes.
  useEffect(() => {
    if (!shouldRun) {
      stopScroll();
      return;
    }
    const timer = setTimeout(() => {
      if (instanceRef.current) {
        startSmoothScroll(instanceRef.current);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      stopScroll();
    };
  }, [shouldRun]);

  // Don't restart animation when activeSeriesName changes, just let it continue
  // The carousel content will update but animation should keep running

  // Filter pianos to only show those from the active series
  const activePianos = pianos.filter(piano =>
    piano.series === activeSeriesName ||
    piano.series.includes(activeSeriesName.replace(' Series', ''))
  );

  // If no pianos match, show all pianos as fallback
  const displayPianos = activePianos.length > 0 ? activePianos : pianos;

  // Duplicate pianos to ensure smooth infinite scroll
  const carouselPianos = [...displayPianos, ...displayPianos, ...displayPianos];

  return (
    <section
      className="relative bg-kawai-pearl overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div ref={sliderRef} className="keen-slider">
        {carouselPianos.map((piano, index) => (
          <div
            key={`${piano.slug}-${index}`}
            className="keen-slider__slide relative aspect-square min-w-[250px] md:min-w-[300px] lg:min-w-[350px] xl:min-w-[400px]"
          >
            <img
              src={piano.image}
              alt={piano.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-kawai-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 text-white">
              <h3 className="text-sm md:text-base lg:text-lg font-bold">{piano.name}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Play/Pause control for the auto-scrolling marquee (WCAG 2.2.2) */}
      <button
        type="button"
        onClick={() => setIsPlaying(p => !p)}
        aria-label={isPlaying ? 'Pause scrolling gallery' : 'Play scrolling gallery'}
        className="absolute bottom-4 right-4 z-30 w-11 h-11 flex items-center justify-center rounded-full bg-kawai-black/70 hover:bg-kawai-black text-white backdrop-blur-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {isPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </section>
  );
}
