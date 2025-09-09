'use client';

import { useEffect, useRef, useState } from 'react';

interface OptimizedVideoProps {
  src: string;
  webmSrc?: string;
  fallbackSrc?: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  startTime?: number;
  preload?: 'none' | 'metadata' | 'auto';
  onLoadedData?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  priority?: boolean;
}

export function OptimizedVideo({
  src,
  webmSrc,
  fallbackSrc,
  poster,
  className = '',
  autoPlay = false,
  muted = true,
  loop = false,
  playsInline = true,
  startTime = 0,
  preload = 'metadata',
  onLoadedData,
  priority = false,
  ...props
}: OptimizedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority); // If priority, load immediately
  
  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return; // Skip intersection observer if priority video
    
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [priority]);

  // Handle video loading and start time
  const handleLoadedData = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement;
    
    // Set start time if specified
    if (startTime > 0) {
      video.currentTime = startTime;
    }
    
    setIsLoaded(true);
    onLoadedData?.(e);
  };

  const handleError = () => {
    setHasError(true);
  };

  // Progressive enhancement: only load video when in view (unless priority)
  const shouldLoadVideo = isInView || priority;

  return (
    <div className="relative w-full h-full">
      {/* Loading placeholder */}
      {!isLoaded && poster && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}
      
      {/* Loading indicator */}
      {!isLoaded && shouldLoadVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {shouldLoadVideo && (
        <video
          ref={videoRef}
          className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          preload={preload}
          poster={poster}
          onLoadedData={handleLoadedData}
          onError={handleError}
          {...props}
        >
          {/* WebM source for better compression */}
          {webmSrc && !hasError && (
            <source src={webmSrc} type="video/webm" />
          )}
          
          {/* Primary MP4 source */}
          <source src={hasError && fallbackSrc ? fallbackSrc : src} type="video/mp4" />
          
          {/* Fallback message */}
          <p className="absolute inset-0 flex items-center justify-center text-white bg-black/50">
            Your browser does not support the video tag. Please upgrade to a modern browser.
          </p>
        </video>
      )}
    </div>
  );
}