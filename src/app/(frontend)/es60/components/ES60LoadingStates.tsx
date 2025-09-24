'use client';

import { useState, useEffect } from 'react';
import { Piano, Volume2, Loader2, Wifi, WifiOff } from 'lucide-react';

interface LoadingStateProps {
  className?: string;
  variant?: 'page' | 'section' | 'component' | 'audio' | 'image';
  message?: string;
  progress?: number;
  showProgress?: boolean;
}

export function ES60LoadingStates({ 
  className = '', 
  variant = 'component',
  message = '',
  progress = 0,
  showProgress = false
}: LoadingStateProps) {

  switch (variant) {
    case 'page':
      return <ES60PageSkeleton className={className} />;
    case 'section':
      return <ES60SectionSkeleton className={className} />;
    case 'audio':
      return <AudioLoadingState className={className} message={message} progress={progress} />;
    case 'image':
      return <ImageLoadingState className={className} />;
    default:
      return <BasicLoadingState className={className} message={message} />;
  }
}

// Full page skeleton for initial load
function ES60PageSkeleton({ className }: { className?: string }) {
  return (
    <div className={`min-h-screen bg-[#FAF8F5] ${className}`}>
      {/* Navigation Skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F5] border-b border-[#8B7355]/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="h-6 w-32 bg-[#8B7355]/20 rounded animate-pulse"></div>
          <div className="hidden md:flex space-x-2">
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="h-8 w-16 bg-[#8B7355]/20 rounded animate-pulse"></div>
            ))}
          </div>
          <div className="md:hidden h-8 w-8 bg-[#8B7355]/20 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="pt-16">
        {/* Hero Skeleton */}
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FAF8F5] to-[#F5F2ED]">
          <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="h-16 w-3/4 bg-[#8B7355]/20 rounded-lg animate-pulse"></div>
                <div className="h-6 w-full bg-[#8B7355]/15 rounded animate-pulse"></div>
                <div className="h-6 w-2/3 bg-[#8B7355]/15 rounded animate-pulse"></div>
              </div>
              <div className="space-y-4">
                <div className="h-12 w-48 bg-[#8B7355]/25 rounded-xl animate-pulse"></div>
                <div className="flex gap-4">
                  <div className="h-12 w-32 bg-[#8B7355]/20 rounded-xl animate-pulse"></div>
                  <div className="h-12 w-32 bg-[#8B7355]/20 rounded-xl animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="aspect-[4/3] bg-[#8B7355]/15 rounded-2xl animate-pulse relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Piano className="h-24 w-24 text-[#8B7355]/30 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Features Skeleton */}
        <div className="py-20 bg-[#F5F2ED]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <div className="h-12 w-64 bg-[#8B7355]/20 rounded mx-auto animate-pulse"></div>
              <div className="h-6 w-96 bg-[#8B7355]/15 rounded mx-auto animate-pulse"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 space-y-4">
                  <div className="h-12 w-12 bg-[#8B7355]/20 rounded animate-pulse"></div>
                  <div className="h-6 w-full bg-[#8B7355]/15 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-[#8B7355]/10 rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-[#8B7355]/10 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Skeleton */}
        <div className="py-20 bg-[#8B7355]/10">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
            <div className="h-12 w-80 bg-[#8B7355]/20 rounded mx-auto animate-pulse"></div>
            <div className="h-16 w-64 bg-[#8B7355]/25 rounded-xl mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Section-specific skeleton
function ES60SectionSkeleton({ className }: { className?: string }) {
  return (
    <div className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="h-10 w-3/4 bg-[#8B7355]/20 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-[#8B7355]/15 rounded animate-pulse"></div>
              <div className="h-4 w-5/6 bg-[#8B7355]/15 rounded animate-pulse"></div>
              <div className="h-4 w-2/3 bg-[#8B7355]/15 rounded animate-pulse"></div>
            </div>
            <div className="h-12 w-40 bg-[#8B7355]/25 rounded-xl animate-pulse"></div>
          </div>
          <div className="aspect-[16/10] bg-[#8B7355]/15 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

// Audio loading state with progress
function AudioLoadingState({ 
  className, 
  message = 'Loading audio demo...', 
  progress = 0 
}: { 
  className?: string; 
  message?: string; 
  progress?: number; 
}) {
  const [dots, setDots] = useState('');
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className={`bg-[#FAF8F5] border border-[#8B7355]/20 rounded-2xl p-8 ${className}`}>
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="h-20 w-20 bg-[#8B7355]/10 rounded-full mx-auto flex items-center justify-center animate-pulse">
            <Volume2 className="h-8 w-8 text-[#8B7355]/50" />
          </div>
          <div className="absolute -top-2 -right-2">
            {isOnline ? (
              <Wifi className="h-6 w-6 text-[#9CAF88]" />
            ) : (
              <WifiOff className="h-6 w-6 text-[#8B7355]/50" />
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[#3C3530]">
            {message}{dots}
          </h3>
          
          {progress > 0 && (
            <div className="space-y-2">
              <div className="w-full bg-[#8B7355]/20 rounded-full h-2">
                <div 
                  className="bg-[#8B7355] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-[#3C3530]/70">{Math.round(progress)}% loaded</p>
            </div>
          )}

          {!isOnline && (
            <div className="bg-[#8B7355]/10 border border-[#8B7355]/20 rounded-lg p-3">
              <p className="text-sm text-[#3C3530]/80">
                Connection lost. Audio will load when connection is restored.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 text-[#8B7355] animate-spin" />
        </div>
      </div>
    </div>
  );
}

// Image loading with LQIP (Low Quality Image Placeholder)
function ImageLoadingState({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      {/* LQIP - Blurred low quality placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#8B7355]/20 via-[#9CAF88]/10 to-[#8B7355]/30 animate-pulse">
        <div className="absolute inset-0 backdrop-blur-sm"></div>
      </div>
      
      {/* Loading indicator */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/90 p-4 rounded-xl shadow-lg">
          <Loader2 className="h-6 w-6 text-[#8B7355] animate-spin" />
        </div>
      </div>

      {/* Piano silhouette for context */}
      <div className="absolute bottom-4 left-4 opacity-20">
        <Piano className="h-8 w-8 text-[#3C3530]" />
      </div>
    </div>
  );
}

// Basic loading state
function BasicLoadingState({ 
  className, 
  message = 'Loading...' 
}: { 
  className?: string; 
  message?: string; 
}) {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 text-[#8B7355] animate-spin mx-auto" />
        <p className="text-[#3C3530]/70 font-medium">{message}</p>
      </div>
    </div>
  );
}

// Progressive image loading component
export function ProgressiveImage({ 
  src, 
  alt, 
  className = '', 
  priority = false,
  onLoad,
  onError 
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    if (retryCount < 2) {
      // Retry loading
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, 1000 * Math.pow(2, retryCount)); // Exponential backoff
    } else {
      setHasError(true);
      setIsLoading(false);
      onError?.();
    }
  };

  if (hasError) {
    return (
      <div className={`bg-[#8B7355]/10 flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <Piano className="h-12 w-12 text-[#8B7355]/50 mx-auto mb-2" />
          <p className="text-sm text-[#3C3530]/70">Image unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && <ImageLoadingState className="absolute inset-0" />}
      <img
        src={`${src}${retryCount > 0 ? `?retry=${retryCount}` : ''}`}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
      />
    </div>
  );
}

// Component loading wrapper
export function ComponentLoadingBoundary({ 
  children, 
  fallback,
  timeout = 5000 
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  timeout?: number;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    const timeoutTimer = setTimeout(() => {
      setHasTimedOut(true);
    }, timeout);

    return () => {
      clearTimeout(timer);
      clearTimeout(timeoutTimer);
    };
  }, [timeout]);

  if (hasTimedOut) {
    return (
      <div className="bg-[#8B7355]/5 border border-[#8B7355]/20 rounded-xl p-6">
        <div className="text-center">
          <Piano className="h-8 w-8 text-[#8B7355]/50 mx-auto mb-2" />
          <p className="text-sm text-[#3C3530]/70">Component taking longer than expected</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-[#8B7355] text-sm hover:underline"
          >
            Refresh page
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return fallback || <BasicLoadingState />;
  }

  return <>{children}</>;
}