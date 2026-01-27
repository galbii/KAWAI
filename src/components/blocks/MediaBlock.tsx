import React from 'react'
import type { MediaBlock as MediaBlockProps, Media } from '@/payload-types'
import { cn } from '@/lib/utils'
import Image from 'next/image'

type Props = MediaBlockProps & {
  className?: string
  imgClassName?: string
  enableGutter?: boolean
}

/**
 * MediaBlock Component
 *
 * Renders an image or media file with optional caption.
 * Uses Next.js Image component for optimization.
 *
 * Server Component
 */
export function MediaBlock({ media, className, imgClassName, enableGutter = true }: Props) {
  if (!media || typeof media !== 'object') {
    return null
  }

  const mediaData = media as Media

  return (
    <div
      className={cn(
        'my-16',
        {
          'container': enableGutter,
        },
        className
      )}
    >
      {mediaData.url && (
        <div className="relative rounded-lg overflow-hidden">
          <Image
            src={mediaData.url}
            alt={mediaData.alt || ''}
            width={mediaData.width || 1200}
            height={mediaData.height || 800}
            className={cn('w-full h-auto', imgClassName)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>
      )}

      {mediaData.caption && (
        <p className="mt-4 text-sm text-gray-600 text-center">
          {mediaData.caption}
        </p>
      )}
    </div>
  )
}
