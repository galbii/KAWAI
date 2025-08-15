"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useEffect, useRef } from "react";

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
  
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      drag: false,
      slides: {
        perView: "auto",
        spacing: 0,
      },
      created(s) {
        startSmoothScroll(s);
      },
      updated(s) {
        startSmoothScroll(s);
      },
      detailsChanged(s) {
        startSmoothScroll(s);
      },
    }
  );

  const startSmoothScroll = (slider: any) => {
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    const tryStart = () => {
      if (!slider?.track?.details) {
        // Retry if track details not ready yet
        setTimeout(tryStart, 100);
        return;
      }
      
      const animate = () => {
        if (slider.track && slider.track.details) {
          // Use track.add() for relative movement - works better with loop
          const increment = 0.0006; // Ultra slow, smooth scrolling
          
          // Use track.add() to add relative movement
          slider.track.add(increment);
          
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    tryStart();
  };

  useEffect(() => {
    // Force start animation when component mounts and slider is ready
    const timer = setTimeout(() => {
      if (instanceRef.current) {
        startSmoothScroll(instanceRef.current);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

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
    <section className="bg-kawai-pearl overflow-hidden">
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
    </section>
  );
}