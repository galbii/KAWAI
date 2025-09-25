'use client'

import React from 'react'
import { AlertTriangle, RefreshCw, Piano, Home, MapPin } from 'lucide-react'
import Link from 'next/link'
import { FALLBACK_ERROR_MESSAGES, FALLBACK_EMPTY_STATES } from '@/lib/fallbacks'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; retry?: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

class ErrorBoundaryClass extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  retry = () => {
    this.setState({ hasError: false })
  }

  override render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent {...(this.state.error !== undefined && { error: this.state.error })} retry={this.retry} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, retry }: { error?: Error; retry?: () => void }) {
  // Determine if this is a CMS-related error
  const isCMSError = error?.message?.toLowerCase().includes('cms') ||
                    error?.message?.toLowerCase().includes('payload') ||
                    error?.message?.toLowerCase().includes('fetch')

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <AlertTriangle className="h-12 w-12 text-kawai-red mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-kawai-black mb-2">
          {isCMSError ? 'Content Temporarily Unavailable' : 'Something went wrong'}
        </h3>
        <p className="text-kawai-black/70 mb-4">
          {isCMSError
            ? FALLBACK_ERROR_MESSAGES.cmsUnavailable
            : error?.message || FALLBACK_ERROR_MESSAGES.general
          }
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {retry && (
            <button
              onClick={retry}
              className="inline-flex items-center px-4 py-2 bg-kawai-black text-kawai-pearl rounded-md hover:bg-kawai-black/80 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </button>
          )}
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-kawai-black text-kawai-black rounded-md hover:bg-kawai-black hover:text-kawai-pearl transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export function ErrorBoundary({ children, fallback, onError }: ErrorBoundaryProps) {
  return (
    <ErrorBoundaryClass
      {...(fallback !== undefined && { fallback })}
      {...(onError !== undefined && { onError })}
    >
      {children}
    </ErrorBoundaryClass>
  )
}

// Piano-specific error fallbacks
export function PianoSectionErrorFallback({ error, retry }: { error?: Error; retry?: () => void }) {
  return (
    <div className="min-h-[300px] flex items-center justify-center p-6 bg-kawai-pearl/50 rounded-2xl">
      <div className="text-center max-w-md">
        <Piano className="h-10 w-10 text-kawai-red mx-auto mb-3" />
        <h4 className="text-lg font-medium text-kawai-black mb-2">
          Piano Content Unavailable
        </h4>
        <p className="text-kawai-black/70 text-sm mb-4">
          {error?.message || FALLBACK_ERROR_MESSAGES.cmsUnavailable}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {retry && (
            <button
              onClick={retry}
              className="inline-flex items-center px-3 py-2 bg-kawai-black text-kawai-pearl text-sm rounded hover:bg-kawai-black/80 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </button>
          )}
          <Link
            href="/pianos"
            className="inline-flex items-center px-3 py-2 border border-kawai-black text-kawai-black text-sm rounded hover:bg-kawai-black hover:text-kawai-pearl transition-colors"
          >
            <Piano className="h-4 w-4 mr-2" />
            View All Pianos
          </Link>
        </div>
      </div>
    </div>
  )
}

// Homepage section error fallback
export function HomeSectionErrorFallback({ error, retry, sectionName }: {
  error?: Error;
  retry?: () => void;
  sectionName?: string;
}) {
  return (
    <div className="min-h-[200px] flex items-center justify-center p-6 bg-kawai-pearl/30 rounded-xl">
      <div className="text-center max-w-sm">
        <AlertTriangle className="h-8 w-8 text-kawai-red mx-auto mb-3" />
        <h4 className="text-base font-medium text-kawai-black mb-2">
          {sectionName ? `${sectionName} Section Unavailable` : 'Section Unavailable'}
        </h4>
        <p className="text-kawai-black/70 text-sm mb-3">
          {FALLBACK_ERROR_MESSAGES.cmsUnavailable}
        </p>
        {retry && (
          <button
            onClick={retry}
            className="inline-flex items-center px-3 py-2 bg-kawai-black text-kawai-pearl text-sm rounded hover:bg-kawai-black/80 transition-colors"
          >
            <RefreshCw className="h-3 w-3 mr-2" />
            Retry
          </button>
        )}
      </div>
    </div>
  )
}

// No results found component
export function NoResultsFallback({
  title = FALLBACK_EMPTY_STATES.noResults.title,
  description = FALLBACK_EMPTY_STATES.noResults.description,
  ctaText = FALLBACK_EMPTY_STATES.noResults.cta.text,
  ctaLink = FALLBACK_EMPTY_STATES.noResults.cta.link
}: {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
}) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <Piano className="h-12 w-12 text-kawai-black/40 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-kawai-black mb-2">
          {title}
        </h3>
        <p className="text-kawai-black/70 mb-6">
          {description}
        </p>
        <Link
          href={ctaLink}
          className="inline-flex items-center px-6 py-3 bg-kawai-black text-kawai-pearl rounded-md hover:bg-kawai-black/80 transition-colors"
        >
          <Piano className="h-4 w-4 mr-2" />
          {ctaText}
        </Link>
      </div>
    </div>
  )
}

// Loading state fallback
export function LoadingFallback({
  title = FALLBACK_EMPTY_STATES.loading.title,
  description = FALLBACK_EMPTY_STATES.loading.description
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="min-h-[300px] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="animate-spin h-8 w-8 border-4 border-kawai-black/20 border-t-kawai-black rounded-full mx-auto mb-4"></div>
        <h3 className="text-lg font-medium text-kawai-black mb-2">
          {title}
        </h3>
        <p className="text-kawai-black/70">
          {description}
        </p>
      </div>
    </div>
  )
}