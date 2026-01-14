'use client';

import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'default' | 'rounded' | 'circle';
  lines?: number;
  animate?: boolean;
}

export function LoadingSkeleton({
  className,
  variant = 'default',
  lines = 1,
  animate = true
}: LoadingSkeletonProps) {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';
  const animationClasses = animate ? 'animate-pulse' : '';

  const variantClasses = {
    default: 'rounded-md',
    rounded: 'rounded-lg',
    circle: 'rounded-full'
  };

  if (lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              variantClasses[variant],
              animationClasses,
              'h-4',
              i === lines - 1 && 'w-3/4', // Last line shorter
              className
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses,
        'h-4 w-full',
        className
      )}
    />
  );
}

// Specialized skeletons for common use cases
export function ImageSkeleton({ className, ...props }: Omit<LoadingSkeletonProps, 'variant'>) {
  return (
    <LoadingSkeleton
      variant="rounded"
      className={cn('aspect-video w-full', className)}
      {...props}
    />
  );
}

export function VideoSkeleton({ className, ...props }: Omit<LoadingSkeletonProps, 'variant'>) {
  return (
    <div className={cn('relative', className)}>
      <LoadingSkeleton
        variant="rounded"
        className="aspect-video w-full"
        {...props}
      />
      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <div className="w-0 h-0 border-l-4 border-l-white border-y-2 border-y-transparent ml-1" />
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton({ className, ...props }: LoadingSkeletonProps) {
  return (
    <div className={cn('p-4 space-y-4', className)}>
      <ImageSkeleton className="h-32" />
      <LoadingSkeleton lines={2} {...props} />
      <LoadingSkeleton className="w-1/2" {...props} />
    </div>
  );
}
