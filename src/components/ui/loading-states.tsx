'use client'

import React from 'react'
import { Piano, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  }

  return (
    <Loader2 className={cn('animate-spin text-kawai-black/50', sizeClasses[size], className)} />
  )
}

export function PianoLoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero skeleton */}
      <div className="h-96 bg-kawai-neutral/20 rounded-2xl animate-pulse">
        <div className="p-8 space-y-4">
          <div className="h-8 bg-kawai-neutral/30 rounded w-3/4"></div>
          <div className="h-4 bg-kawai-neutral/30 rounded w-1/2"></div>
          <div className="h-4 bg-kawai-neutral/30 rounded w-2/3"></div>
        </div>
      </div>

      {/* Category sections skeleton */}
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="space-y-6">
          <div className="flex items-center space-x-6">
            <div className="h-16 w-16 bg-kawai-neutral/30 rounded-xl animate-pulse"></div>
            <div className="space-y-2 flex-1">
              <div className="h-6 bg-kawai-neutral/30 rounded w-1/3 animate-pulse"></div>
              <div className="h-4 bg-kawai-neutral/30 rounded w-2/3 animate-pulse"></div>
            </div>
          </div>
          
          {/* Image grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }, (_, j) => (
              <div key={j} className="h-64 bg-kawai-neutral/20 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function FeaturedCarouselSkeleton() {
  return (
    <div className="relative h-[70vh] bg-kawai-neutral/20 rounded-2xl animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Piano className="h-16 w-16 text-kawai-neutral/40 mx-auto animate-pulse" />
          <div className="h-6 bg-kawai-neutral/30 rounded w-48 mx-auto"></div>
          <div className="h-4 bg-kawai-neutral/30 rounded w-32 mx-auto"></div>
        </div>
      </div>
    </div>
  )
}

export function CategorySectionSkeleton() {
  return (
    <div className="min-h-[60vh] flex items-center py-8">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content skeleton */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="h-12 bg-kawai-neutral/30 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-kawai-neutral/30 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-kawai-neutral/30 rounded w-2/3 animate-pulse"></div>
            </div>
            <div className="h-12 bg-kawai-neutral/30 rounded w-48 animate-pulse"></div>
          </div>

          {/* Image skeleton */}
          <div className="aspect-[4/3] bg-kawai-neutral/20 rounded-2xl animate-pulse"></div>
        </div>
        
        {/* Image grid skeleton */}
        <div className="w-full py-8 -mx-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 w-full">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-80 md:h-96 bg-kawai-neutral/20 border border-kawai-neutral/20 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface LoadingStateProps {
  message?: string
  className?: string
  showSpinner?: boolean
}

export function LoadingState({ 
  message = 'Loading...', 
  className,
  showSpinner = true 
}: LoadingStateProps) {
  return (
    <div className={cn('flex items-center justify-center p-8', className)}>
      <div className="text-center space-y-3">
        {showSpinner && <LoadingSpinner size="lg" />}
        <p className="text-kawai-black/70 font-medium">{message}</p>
      </div>
    </div>
  )
}

// Inline loading states for buttons and smaller components
export function InlineLoadingState({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <LoadingSpinner size="sm" />
      <span className="text-kawai-black/70 text-sm">Loading...</span>
    </div>
  )
}