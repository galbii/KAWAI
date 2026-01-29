import React from 'react'
import Image from 'next/image'
import type { ContentImageBlock } from '@/payload-types'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import { cn } from '@/lib/utils'

interface ContentImageRendererProps extends ContentImageBlock {}

export function ContentImageRenderer({
  image,
  alt,
  caption,
  size = 'medium',
  alignment = 'center'
}: ContentImageRendererProps) {
  // Get optimized image props
  const imageProps = getImagePropsWithFallback(
    image,
    '/images/defaults/placeholder.jpg',
    size === 'small' ? 'card' : size === 'large' ? 'hero' : 'gallery',
    {
      className: 'rounded-lg',
    }
  )

  // Size class mapping
  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    full: 'w-full',
  }

  // Alignment class mapping
  const alignmentClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  }

  return (
    <figure
      className={cn(
        'my-8',
        sizeClasses[size as keyof typeof sizeClasses],
        alignmentClasses[alignment as keyof typeof alignmentClasses]
      )}
    >
      <div className="relative overflow-hidden rounded-lg">
        <Image
          {...imageProps}
          alt={alt || ''}
          className="w-full h-auto object-cover"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
