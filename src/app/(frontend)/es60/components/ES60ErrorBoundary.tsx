"use client";

import React from 'react';
import { ErrorBoundaryState, ErrorFallbackProps, ES60_COLORS } from './types';

interface ES60ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}

export class ES60ErrorBoundary extends React.Component<ES60ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ES60ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ES60 Component Error:', error, errorInfo);
    
    // In production, you might want to log this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: errorReportingService.log(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error!}
          resetError={() => this.setState({ hasError: false, error: undefined })}
        />
      );
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div 
      className="rounded-xl p-8 text-center max-w-md mx-auto my-8"
      style={{ 
        backgroundColor: ES60_COLORS.secondaryBackground,
        border: `1px solid ${ES60_COLORS.warmGray}`
      }}
    >
      <div className="mb-4">
        <svg
          className="w-12 h-12 mx-auto mb-4"
          style={{ color: ES60_COLORS.accentEarth }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      
      <h3 
        className="text-lg font-semibold mb-2"
        style={{ color: ES60_COLORS.textPrimary }}
      >
        Something went wrong
      </h3>
      
      <p 
        className="text-sm mb-6"
        style={{ color: ES60_COLORS.textSecondary }}
      >
        We're sorry, but there was an error loading this section. Please try refreshing the page.
      </p>
      
      {process.env.NODE_ENV === 'development' && (
        <details className="mb-4 text-left">
          <summary 
            className="cursor-pointer text-xs font-medium mb-2"
            style={{ color: ES60_COLORS.accentEarth }}
          >
            Error Details (Development Only)
          </summary>
          <pre 
            className="text-xs p-3 rounded overflow-auto"
            style={{ 
              backgroundColor: ES60_COLORS.primaryBackground,
              color: ES60_COLORS.textSecondary,
              border: `1px solid ${ES60_COLORS.warmGray}`
            }}
          >
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}
      
      <button
        onClick={resetError}
        className="px-6 py-2 rounded-lg font-medium transition-colors"
        style={{
          backgroundColor: ES60_COLORS.accentEarth,
          color: ES60_COLORS.primaryBackground
        }}
      >
        Try Again
      </button>
    </div>
  );
}

// HOC for wrapping individual components with error boundary
export function withES60ErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  const WrappedComponent = (props: P) => (
    <ES60ErrorBoundary>
      <Component {...props} />
    </ES60ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withES60ErrorBoundary(${componentName})`;
  return WrappedComponent;
}