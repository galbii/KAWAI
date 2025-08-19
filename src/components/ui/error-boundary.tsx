'use client'

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} retry={this.retry} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, retry }: { error?: Error; retry?: () => void }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <AlertTriangle className="h-12 w-12 text-kawai-red mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-kawai-black mb-2">
          Something went wrong
        </h3>
        <p className="text-kawai-black/70 mb-4">
          {error?.message || 'An unexpected error occurred while loading the content.'}
        </p>
        {retry && (
          <button
            onClick={retry}
            className="inline-flex items-center px-4 py-2 bg-kawai-black text-kawai-pearl rounded-md hover:bg-kawai-black/80 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try again
          </button>
        )}
      </div>
    </div>
  )
}

export function ErrorBoundary({ children, fallback, onError }: ErrorBoundaryProps) {
  return (
    <ErrorBoundaryClass fallback={fallback} onError={onError}>
      {children}
    </ErrorBoundaryClass>
  )
}

// Piano-specific error fallbacks
export function PianoSectionErrorFallback({ error, retry }: { error?: Error; retry?: () => void }) {
  return (
    <div className="min-h-[300px] flex items-center justify-center p-6 bg-kawai-pearl/50 rounded-2xl">
      <div className="text-center max-w-md">
        <AlertTriangle className="h-10 w-10 text-kawai-red mx-auto mb-3" />
        <h4 className="text-lg font-medium text-kawai-black mb-2">
          Unable to load piano content
        </h4>
        <p className="text-kawai-black/70 text-sm mb-4">
          {error?.message || 'There was an issue loading the piano information. Please try again.'}
        </p>
        {retry && (
          <button
            onClick={retry}
            className="inline-flex items-center px-3 py-2 bg-kawai-black text-kawai-pearl text-sm rounded hover:bg-kawai-black/80 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </button>
        )}
      </div>
    </div>
  )
}