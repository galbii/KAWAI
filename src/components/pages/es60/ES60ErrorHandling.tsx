'use client';

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  RefreshCw, 
  Piano, 
  Home, 
  Phone, 
  Wifi, 
  WifiOff,
  Volume2,
  VolumeX,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import Link from 'next/link';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  retryCount: number;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry?: () => void; retryCount?: number }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  maxRetries?: number;
  variant?: 'page' | 'section' | 'component' | 'audio' | 'form';
}

// Main Error Boundary Class Component
class ES60ErrorBoundaryClass extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeout: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ES60 Error Boundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Track error in analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'error_boundary_triggered', {
        event_category: 'ES60',
        event_label: error.message,
        error_type: error.name,
        component_stack: errorInfo.componentStack
      });
    }

    this.props.onError?.(error, errorInfo);
  }

  retry = () => {
    const maxRetries = this.props.maxRetries || 3;
    
    if (this.state.retryCount < maxRetries) {
      this.setState(prev => ({
        hasError: false,
        retryCount: prev.retryCount + 1
      }));

      // Track retry attempt
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'error_retry_attempt', {
          event_category: 'ES60',
          event_label: 'Error Boundary Retry',
          retry_count: this.state.retryCount + 1
        });
      }
    } else {
      // Max retries reached, show contact option
      this.setState({ hasError: true });
    }
  };

  override render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || this.getDefaultFallback();
      return (
        <FallbackComponent
          {...(this.state.error && { error: this.state.error })}
          retry={this.retry}
          retryCount={this.state.retryCount}
        />
      );
    }

    return this.props.children;
  }

  private getDefaultFallback() {
    switch (this.props.variant) {
      case 'page':
        return ES60PageErrorFallback;
      case 'section':
        return ES60SectionErrorFallback;
      case 'audio':
        return AudioErrorFallback;
      case 'form':
        return FormErrorFallback;
      default:
        return ES60ComponentErrorFallback;
    }
  }
}

// Export the functional wrapper
export function ES60ErrorHandling({ children, ...props }: ErrorBoundaryProps) {
  return <ES60ErrorBoundaryClass {...props}>{children}</ES60ErrorBoundaryClass>;
}

// Page-level error fallback
function ES60PageErrorFallback({ 
  error, 
  retry, 
  retryCount = 0 
}: { 
  error?: Error; 
  retry?: () => void; 
  retryCount?: number;
}) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const maxRetries = 3;
  const canRetry = retryCount < maxRetries;

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6">
      <div className="max-w-2xl text-center space-y-8">
        <div>
          <AlertTriangle className="h-20 w-20 text-[#8B7355] mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-[#3C3530] mb-4">
            Oops! Something went wrong
          </h1>
          <p className="text-lg text-[#3C3530]/80 mb-6">
            We're having trouble loading the ES60 experience. Don't worry - we're here to help.
          </p>
        </div>

        {/* Error details */}
        <div className="bg-white border border-[#8B7355]/20 rounded-2xl p-6 text-left">
          <h3 className="font-semibold text-[#3C3530] mb-3">What happened?</h3>
          <p className="text-sm text-[#3C3530]/70 mb-4">
            {error?.message || 'An unexpected error occurred while loading the page.'}
          </p>
          
          {!isOnline && (
            <div className="flex items-center gap-2 p-3 bg-[#8B7355]/10 rounded-lg mb-4">
              <WifiOff className="h-5 w-5 text-[#8B7355]" />
              <span className="text-sm text-[#3C3530]">
                No internet connection detected
              </span>
            </div>
          )}

          {retryCount > 0 && (
            <div className="text-sm text-[#3C3530]/60">
              Retry attempts: {retryCount}/{maxRetries}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {canRetry && retry && (
              <button
                onClick={retry}
                className="inline-flex items-center px-6 py-3 bg-[#8B7355] text-white rounded-xl hover:bg-[#5D4E37] transition-colors font-semibold"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Try Again
              </button>
            )}
            
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border-2 border-[#8B7355] text-[#8B7355] rounded-xl hover:bg-[#8B7355] hover:text-white transition-colors font-semibold"
            >
              <Home className="h-5 w-5 mr-2" />
              Go Home
            </Link>
          </div>

          {/* Contact fallback */}
          <div className="border-t border-[#8B7355]/20 pt-6">
            <p className="text-[#3C3530]/80 mb-4">
              Still having trouble? Our team is ready to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:6362652866"
                className="inline-flex items-center px-4 py-2 text-[#8B7355] hover:text-[#5D4E37] transition-colors"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call (636) 265-2866
              </a>
              <Link
                href="/contact?source=error-page"
                className="inline-flex items-center px-4 py-2 text-[#8B7355] hover:text-[#5D4E37] transition-colors"
              >
                <Piano className="h-4 w-4 mr-2" />
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Section-level error fallback
function ES60SectionErrorFallback({ 
  error, 
  retry, 
  retryCount = 0 
}: { 
  error?: Error; 
  retry?: () => void; 
  retryCount?: number;
}) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6 bg-[#FAF8F5] border border-[#8B7355]/20 rounded-2xl">
      <div className="text-center max-w-md space-y-6">
        <AlertCircle className="h-12 w-12 text-[#8B7355] mx-auto" />
        <div>
          <h3 className="text-xl font-semibold text-[#3C3530] mb-2">
            Section Temporarily Unavailable
          </h3>
          <p className="text-[#3C3530]/70">
            This part of the ES60 experience is having technical difficulties.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {retry && retryCount < 2 && (
            <button
              onClick={retry}
              className="inline-flex items-center px-4 py-2 bg-[#8B7355] text-white rounded-lg hover:bg-[#5D4E37] transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </button>
          )}
          <Link
            href="/contact?action=demo&product=es60&source=section-error"
            className="inline-flex items-center px-4 py-2 border border-[#8B7355] text-[#8B7355] rounded-lg hover:bg-[#8B7355] hover:text-white transition-colors"
          >
            <Piano className="h-4 w-4 mr-2" />
            Schedule Demo Instead
          </Link>
        </div>
      </div>
    </div>
  );
}

// Audio-specific error fallback
function AudioErrorFallback({ 
  error, 
  retry, 
  retryCount = 0 
}: { 
  error?: Error; 
  retry?: () => void; 
  retryCount?: number;
}) {
  const [isAudioSupported, setIsAudioSupported] = useState(true);

  useEffect(() => {
    // Check if audio is supported
    const audio = new Audio();
    setIsAudioSupported(!!audio.canPlayType);
  }, []);

  return (
    <div className="bg-[#FAF8F5] border border-[#8B7355]/20 rounded-2xl p-8">
      <div className="text-center space-y-6">
        <VolumeX className="h-16 w-16 text-[#8B7355] mx-auto" />
        
        <div>
          <h3 className="text-lg font-semibold text-[#3C3530] mb-2">
            Audio Demo Unavailable
          </h3>
          <p className="text-[#3C3530]/70">
            {!isAudioSupported 
              ? 'Your browser doesn\'t support audio playback.'
              : 'We\'re having trouble loading the audio demo.'
            }
          </p>
        </div>

        {isAudioSupported && retry && retryCount < 3 && (
          <button
            onClick={retry}
            className="inline-flex items-center px-4 py-2 bg-[#8B7355] text-white rounded-lg hover:bg-[#5D4E37] transition-colors"
          >
            <Volume2 className="h-4 w-4 mr-2" />
            Try Loading Audio Again
          </button>
        )}

        <div className="space-y-3">
          <p className="text-sm text-[#3C3530]/70">
            Experience the ES60 sound in person:
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact?action=visit&product=es60&source=audio-error"
              className="inline-flex items-center px-4 py-2 bg-white border border-[#8B7355] text-[#8B7355] rounded-lg hover:bg-[#8B7355] hover:text-white transition-colors"
            >
              <Piano className="h-4 w-4 mr-2" />
              Visit Showroom
            </Link>
            <a
              href="tel:6362652866"
              className="inline-flex items-center px-4 py-2 text-[#8B7355] hover:text-[#5D4E37] transition-colors"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call for Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Form-specific error fallback
function FormErrorFallback({ 
  error, 
  retry, 
  retryCount = 0 
}: { 
  error?: Error; 
  retry?: () => void; 
  retryCount?: number;
}) {
  return (
    <div className="bg-[#8B7355]/5 border border-[#8B7355]/20 rounded-xl p-6">
      <div className="text-center space-y-4">
        <AlertTriangle className="h-8 w-8 text-[#8B7355] mx-auto" />
        <div>
          <h4 className="font-semibold text-[#3C3530] mb-1">
            Form Submission Error
          </h4>
          <p className="text-sm text-[#3C3530]/70">
            We couldn't process your request. Please try again.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {retry && retryCount < 2 && (
            <button
              onClick={retry}
              className="inline-flex items-center px-3 py-2 bg-[#8B7355] text-white text-sm rounded hover:bg-[#5D4E37] transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
          )}
          <a
            href="tel:6362652866"
            className="inline-flex items-center px-3 py-2 text-[#8B7355] text-sm hover:text-[#5D4E37] transition-colors"
          >
            <Phone className="h-4 w-4 mr-2" />
            Call Instead
          </a>
        </div>
      </div>
    </div>
  );
}

// Component-level error fallback
function ES60ComponentErrorFallback({ 
  error, 
  retry, 
  retryCount = 0 
}: { 
  error?: Error; 
  retry?: () => void; 
  retryCount?: number;
}) {
  return (
    <div className="bg-[#8B7355]/5 border border-[#8B7355]/20 rounded-xl p-4">
      <div className="text-center space-y-3">
        <AlertCircle className="h-6 w-6 text-[#8B7355] mx-auto" />
        <div>
          <p className="text-sm font-medium text-[#3C3530]">
            Component temporarily unavailable
          </p>
          {retry && retryCount < 1 && (
            <button
              onClick={retry}
              className="mt-2 text-[#8B7355] text-sm hover:underline"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Success notification component
export function SuccessNotification({ 
  message, 
  onClose, 
  autoClose = true,
  duration = 5000 
}: {
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}) {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [autoClose, duration, onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 bg-[#9CAF88] text-white p-4 rounded-xl shadow-lg max-w-sm">
      <div className="flex items-start gap-3">
        <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Network error detector and handler
export function useNetworkErrorHandler() {
  const [isOnline, setIsOnline] = useState(true);
  const [hasNetworkError, setHasNetworkError] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setHasNetworkError(false);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setHasNetworkError(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, hasNetworkError };
}